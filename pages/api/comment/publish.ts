import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { EXCEPTION_COMMENT, EXCEPTION_USER } from '../config/code';
import { options } from '../../../config';


type ISession = IronSession & Record<string, any>;

async function publishHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = req.session;
  if (!session.users) return res.status(200).json({ ...EXCEPTION_USER });
  const { userId, nickname } = session.users;
  const { articleId = '', content = '' } = req.body;
  const client = await connectToDatabase();
  const commentCollections = client.db().collection("comments");
  const resComment = await commentCollections.insertOne({ content, updateTime: new Date(), userId, articleId, userNickname: nickname });
  client.close();
  if (resComment) {
    return res.status(200).json({ code: 0, msg: '發布成功', data: resComment });
  } else {
    return res.status(200).json({...EXCEPTION_COMMENT.PUBLISH_FAILED});
  }
}

export default withIronSessionApiRoute(publishHandler, options);