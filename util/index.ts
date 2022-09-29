interface ICookieInfo {
  email: string,
  nickname: string,
  userId: string,
}

export const setCookies = (cookies: any, { email, nickname, userId }: ICookieInfo) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('email', email, {
    path,
    expires
  });
  cookies.set('nickname', nickname, {
    path,
    expires
  });
  cookies.set('userId', userId, {
    path,
    expires
  });
};

export const clearCookies = (cookies: any) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';

  cookies.set('email', '', {
    path,
    expires
  });
  cookies.set('nickname', '', {
    path,
    expires
  });
  cookies.set('userId', '', {
    path,
    expires
  });
};
