export const SERVER_ENV = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

if (!SERVER_ENV.RESEND_API_KEY) {
  throw new Error('❌ RESEND_API_KEY is not defined');
}
