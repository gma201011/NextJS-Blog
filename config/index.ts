export const options = {
  cookieName: process.env.NEXT_PUBLIC_SESSION_COOKIE_NAME as string,
  password: process.env.NEXT_PUBLIC_SESSION_PASSWORD as string,
  cookieOption: {
    maxAge: 24 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production'
  }
}