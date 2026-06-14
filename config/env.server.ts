export const SERVER_ENV = {
  NODE_ENV: process.env.NODE_ENV,
};

if (!SERVER_ENV.NODE_ENV) {
  throw new Error('❌ NODE_ENV is not defined');
}
