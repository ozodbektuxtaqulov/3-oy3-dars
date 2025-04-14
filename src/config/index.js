export const config = {
  api: {
    port: process.env.PORT,
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  nodeEnv: process.env.NODE_ENV,
};
