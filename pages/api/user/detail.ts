import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { options } from '../../../config';
import { EXCEPTION_USER } from '../config/code';
import lodash from 'lodash';

type ISession = IronSession & Record<string, any>;

async function detailHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = req?.session;
  if (!session.users) return res?.status(200).json({...EXCEPTION_USER.NOT_LOGIN});
  const { userId } = session?.users;

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const userInfo = await userCollection.findOne({ userId });

  if (userInfo) {
    res?.status(200).json({ code: 0, msg: 'ok', data: { ...lodash.pick(userInfo, ['nickname', 'job', 'introduce']) } });
  } else {
    res?.status(200).json({...EXCEPTION_USER.NOT_FOUND});
  }

  client.close();
}

export default withIronSessionApiRoute(detailHandler, options);