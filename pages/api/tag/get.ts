import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { options } from '../../../config';
import { EXCEPTION_USER } from '../config/code';


type ISession = IronSession & Record<string, any>;

async function getHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = req.session;
  if (!session.users) return res.status(200).json({ ...EXCEPTION_USER.NOT_LOGIN });
  const { userId = '' } = session.users;
  const client = await connectToDatabase();
  const tagCollection = client.db().collection("tags");
  const followTags = await tagCollection.find({followUsers: [userId]}).toArray() || [];
  const allTags =  await tagCollection.find().toArray() || [];
  client.close();
  return res.status(200).json({code: 0, data: {followTags, allTags}, msg: 'ok'})
}

export default withIronSessionApiRoute(getHandler, options);