import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { EXCEPTION_USER } from '../config/code';
import { options } from '../../../config';
import { ObjectId } from 'mongodb';


type ISession = IronSession & Record<string, any>;

async function followHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = req.session;
  if (!session.users) return res.status(200).json({ ...EXCEPTION_USER.NOT_LOGIN });
  const { userId = '' } = session.users;
  const { tagId } = req?.body;
  const client = await connectToDatabase();
  const tagCollection = client.db().collection("tags");
  const isFollow = await tagCollection.findOne({followUsers: [userId], _id: new ObjectId(tagId)});
  const followList = isFollow?.followUsers || [];

  if (isFollow) {
    const resultArr = followList.filter((item: string) => item !== userId);
    await tagCollection.updateOne({followUsers: [userId], _id: new ObjectId(tagId)}, { $set: { followUsers: resultArr } });
  } else {
    const resultArr = [...followList, userId]
    await tagCollection.updateOne({_id: new ObjectId(tagId)}, { $set: { followUsers: resultArr }});
  }
  client.close();
  return res.status(200).json({code: 0, data: {}, msg: 'ok'})
}

export default withIronSessionApiRoute(followHandler, options);