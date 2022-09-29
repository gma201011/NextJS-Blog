import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from 'iron-session/next'
import { IronSession } from 'iron-session';
import { Cookie } from 'next-cookie';
import { clearCookies } from '../../../util';
import { options } from '../../../config';

type ISession = IronSession & Record<string, any>;

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  await session.destroy();
  clearCookies(cookies);

  res.status(200).json({
    code: 0,
    msg: '退出成功'
  })
}

export default withIronSessionApiRoute(logout, options)