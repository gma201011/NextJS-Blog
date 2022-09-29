import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { EXCEPTION_ARTICLE, EXCEPTION_USER } from '../config/code';
import { options } from '../../../config';
import { ObjectId } from 'mongodb';


type ISession = IronSession & Record<string, any>;

async function publishHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = req.session;
  if (!session.users) return res.status(200).json({ ...EXCEPTION_USER.NOT_LOGIN });
  const { nickname, email, userId } = session.users;
  const { title =  '', content =  '', tagIds = [] } = req.body;
  const client = await connectToDatabase();
  const articleCollection = client.db().collection("articles");

  const resArticle = await articleCollection.insertOne({ content, title, nickname, email, updateTime: new Date(), view: 0, userId });

  if (tagIds.length) {
    const tagCollection = client.db().collection("tags");
    const result = await Promise.all(tagIds.map(async (id: string) => {
      await tagCollection.updateOne({
        _id: new ObjectId(id),
      }, { $push: { tagArticles: resArticle?.insertedId } })
    }));
  }

  client.close();

  if (resArticle) {
    res.status(200).json({ code: 0, msg: '發布成功', data: resArticle });
  } else {
    res.status(200).json({...EXCEPTION_ARTICLE.PUBLISH_FAILED});
  }
}

export default withIronSessionApiRoute(publishHandler, options);