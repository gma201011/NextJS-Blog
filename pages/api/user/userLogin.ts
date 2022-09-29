import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { Cookie } from 'next-cookie';
import { setCookies } from '../../../util';
import { options } from '../../../config';

type ISession = IronSession & Record<string, any>;

async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  const client = await connectToDatabase();
  const userCollections = client.db().collection("users");
  const { email, password } = req.body;
  const users = await userCollections.findOne({email, password});
  client.close();
  if (users) {
    const { email, nickname, userId } = users;
    setCookies(cookies, { nickname, email, userId })
    session.users = users;
    await session.save();
    res.status(200).json({
      code: 0,
      msg: '登入成功',
      data: { email, nickname, userId }
    });
  } else {
    res.status(401).send({ code: -1, msg: '帳號或密碼錯誤' })
  }
}

export default withIronSessionApiRoute(loginHandler, options);