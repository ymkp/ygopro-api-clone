export default (): any => ({
  env: process.env.APP_ENV,
  port: process.env.APP_PORT,
  prefix: process.env.APP_PREFIX,
  doc_pass: process.env.DOC_PASS,
  fe_url: process.env.FE_URL,
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  jwt: {
    publicKey: Buffer.from(
      process.env.JWT_PUBLIC_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    privateKey: Buffer.from(
      process.env.JWT_PRIVATE_KEY_BASE64,
      'base64',
    ).toString('utf8'),
    accessTokenExpiresInSec: parseInt(
      process.env.JWT_ACCESS_TOKEN_EXP_IN_SEC,
      10,
    ),
    refreshTokenExpiresInSec: parseInt(
      process.env.JWT_REFRESH_TOKEN_EXP_IN_SEC,
      10,
    ),
  },
  // email: {
  //   host: process.env.EMAIL_HOST,
  //   secure: process.env.EMAIL_SECURE === 'true',
  //   port: parseInt(process.env.EMAIL_PORT, 10),
  //   user: process.env.EMAIL_USER,
  //   pass: process.env.EMAIL_PASSWORD,
  //   service: process.env.EMAIL_SERVICE,
  //   forgotPasswordURL: process.env.EMAIL_FORGOT_PASSWORD_URL,
  // },
  // wa: {
  //   url: process.env.WA_API_URL,
  //   token: process.env.WA_API_TOKEN,
  // },
  // defaultAdminUserPassword: process.env.DEFAULT_ADMIN_USER_PASSWORD,
  // telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
  // ssoLoginURL: process.env.SSO_LOGIN_URL,
  // urlShorterAPI: process.env.URL_SHORTER_API,
});
