import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
export const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
export const REDIS_PORT = process.env.REDIS_PORT || 6379;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASS = process.env.EMAIL_PASS;
export const NODE_ENV = process.env.NODE_ENV || "development";
