import dotenv from "dotenv";
dotenv.config();

export const {
  EMAIL_USER,
  EMAIL_PASS,
  PORT,
  CLIENT_URL,
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
} = process.env;
export default {
  EMAIL_USER,
  EMAIL_PASS,
  PORT: PORT || 5000,
  CLIENT_URL: CLIENT_URL || "http://localhost:3000",
  NODE_ENV: NODE_ENV || "development",
  REDIS_HOST: REDIS_HOST || "127.0.0.1",
  REDIS_PORT: REDIS_PORT || 6379,
};