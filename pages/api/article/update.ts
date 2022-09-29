import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { EXCEPTION_ARTICLE, EXCEPTION_USER } from '../config/code';
import { options } from '../../../config';
import { ObjectId } from "mongodb";

type ISession = IronSession & Record<string, any>;

async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = req.session;
  if (!session.users) return res.status(200).json({ ...EXCEPTION_USER.NOT_LOGIN });
  const { userId } = session.users;
  const { title =  '', content =  '', articleId = '', tagIds = [] } = req.body;
  const client = await connectToDatabase();
  const articleCollections = client.db().collection("articles");
  const tagCollection = client.db().collection("tags");

  const resArticle = await articleCollections.findOne({_id: new ObjectId(articleId)});

  if (resArticle?.userId !== userId) return res.status(200).json({ code: -1, msg: '沒有操作權限' });

  if (resArticle) {
    await articleCollections.updateOne({_id: new ObjectId(articleId)},{ $set: { title, content, updateTime: new Date() } });
    // @ts-ignore
    await tagCollection.updateMany({}, { $pull: { tagArticles: new ObjectId(articleId) } });

    await Promise.all(tagIds.map(async (id: string) => {
      await tagCollection.updateOne({
        _id: new ObjectId(id),
      }, { $push: { tagArticles: new ObjectId(articleId) } })
    }));

    client.close();

    res.status(200).json({ code: 0, msg: '更新成功', data: resArticle });
  } else if (!resArticle) {
    res.status(200).json({...EXCEPTION_ARTICLE.NOT_FOUND});
    client.close();
  } else {
    res.status(200).json({...EXCEPTION_ARTICLE.UPDATE_FAILED});
    client.close();
  }
}

export default withIronSessionApiRoute(updateHandler, options);