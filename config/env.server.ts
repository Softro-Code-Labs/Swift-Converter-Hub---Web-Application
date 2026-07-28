// Server-only env vars. Do not import this from client components -
// process.env values here are not exposed to the browser bundle.
export const SERVER_ENV = {
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

if (!SERVER_ENV.RESEND_API_KEY) {
  throw new Error('❌ RESEND_API_KEY is not defined');
}
