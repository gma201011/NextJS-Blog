import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { Cookie } from 'next-cookie';
import { setCookies } from '../../../util';
import { options } from '../../../config';
import { EXCEPTION_USER } from '../config/code';

type ISession = IronSession & Record<string, any>;

async function updateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = req?.session;
  if (!session.users) return res?.status(200).json({...EXCEPTION_USER.NOT_LOGIN});
  const { userId } = session?.users;
  const cookies = Cookie.fromApiRoute(req, res);
  const { nickname = '', job = '', introduce = '' } = req.body;
  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const user = await userCollection.findOne({ userId });

  if (user) {
    const { email } = user;
    const cookieInfo = { userId, nickname,email };
    setCookies(cookies, cookieInfo);
    const resUser = await userCollection.updateOne({ userId }, { $set: { nickname, job, introduce } })
    res.status(200).json({ code: 0, data: resUser, msg: 'ok' });
  } else {
    res?.status(200).json({...EXCEPTION_USER.NOT_FOUND});
  }

  client.close();
}

export default withIronSessionApiRoute(updateHandler, options);