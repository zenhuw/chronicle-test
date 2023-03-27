import 'dotenv/config';

export = {
  port: process.env.PORT,
  env: 'production',
  secretKey: process.env.SECRET_KEY,
  cors: {
    origin: 'http://localhost:8080',
    credentials: true
  },
  redis: {
    url: process.env.REDIS_URL
  },
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOWMS),
    max: Number(process.env.RATE_LIMIT_MAX)
  }
};
