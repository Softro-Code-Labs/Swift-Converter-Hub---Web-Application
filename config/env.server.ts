export const SERVER_ENV = {
  NODE_ENV: process.env.NODE_ENV,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

if (!SERVER_ENV.NODE_ENV) {
  throw new Error('❌ NODE_ENV is not defined');
}

if (!SERVER_ENV.RESEND_API_KEY) {
  throw new Error('❌ RESEND_API_KEY is not defined');
}
