// server.js
// Production-ready Express + Mongo server bootstrap
// - Use ES modules (node >= 14+ with "type": "module" in package.json)
// - Add your route files (auth, materials) in ./routes/*.js

import "express-async-errors"; // captures async errors automatically
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import winston from "winston";

// Route imports (adjust filenames as needed)
import authRoutes from "./routes/auth.js";
import studyMaterialRoutes from "./routes/studyMaterialRoutes.js";

// -------------------- Setup helpers --------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3500);
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/deepak_portfolio";
const NODE_ENV = process.env.NODE_ENV || "development";

// Configure logger (winston)
const logger = winston.createLogger({
  level: NODE_ENV === "development" ? "debug" : "info",
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : "";
          return `${timestamp} ${level}: ${message} ${metaStr}`;
        })
      ),
    }),
    // Optionally add file transport for production
    // new winston.transports.File({ filename: 'logs/server.log' })
  ],
});

// -------------------- App bootstrap --------------------
const app = express();

// Security middlewares
app.use(
  helmet({
    // If your app serves scripts from dynamic sources, adjust CSP.
    contentSecurityPolicy: NODE_ENV === "production" ? undefined : false,
  })
);
app.use(compression());

// Body limits (we allow small base64 Data-URLs for demo; reduce in prod)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (morgan -> winston)
app.use(morgan(NODE_ENV === "development" ? "tiny" : "combined"));

// CORS configuration: allow production origin and localhost in dev
const allowedOrigins = [
  "https://deepakkhiraofficial.netlify.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

if (process.env.FRONTEND_ORIGIN) {
  allowedOrigins.push(process.env.FRONTEND_ORIGIN);
}
if (NODE_ENV !== "production") {
  allowedOrigins.push("http://localhost:3000", "http://127.0.0.1:3000");
}

// If FRONTEND_ORIGIN is not set and it's production, block unknown origins
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("CORS policy: This origin is not allowed."));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // pre-flight

// Rate limiter (global basic limits)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 120, // limit each IP to 120 requests per windowMs
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", apiLimiter);

// -------------------- Routes --------------------
// Health / readiness endpoints
app.get("/api/health", (req, res) => res.json({ status: "ok", env: NODE_ENV }));
app.get("/api/ready", (req, res) =>
  res.json({ ready: mongoose.connection.readyState === 1 })
);

// API routes
app.use("/api/auth", authRoutes); // auth route file -> handles /login etc
app.use("/api/materials", studyMaterialRoutes); // study materials CRUD

// Expose `uploads/` if you use local storing for small files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve frontend in production (build folder)
if (NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client", "build");
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) =>
    res.sendFile(path.join(clientBuildPath, "index.html"))
  );
}

// -------------------- Error handlers --------------------

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  // Log error
  logger.error(err?.message || "Unknown error", { stack: err?.stack });

  // Known CORS error is thrown by corsOptions
  if (err?.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({ error: err.message });
  }

  // Validation or client errors can set err.status
  const status =
    err.status && Number(err.status) >= 400 && Number(err.status) < 600
      ? err.status
      : 500;

  res.status(status).json({
    error:
      NODE_ENV === "development"
        ? err.message || "Server Error"
        : "Server Error",
    ...(NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
});

// -------------------- MongoDB connection + graceful shutdown --------------------
mongoose.set("strictQuery", true); // optional: avoid deprecation warnings

async function connectMongo() {
  try {
    logger.info("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    logger.info("✅ MongoDB connected successfully");
  } catch (err) {
    logger.error("❌ MongoDB connection failed", err);
    // In production you might want to exit process so a supervisor (pm2, systemd) restarts container
    if (NODE_ENV === "production") process.exit(1);
  }
}

connectMongo();

// Handle SIGINT/SIGTERM for graceful shutdown
function gracefulShutdown(signal) {
  return async () => {
    try {
      logger.info(`Received ${signal}. Closing server...`);
      await mongoose.disconnect();
      logger.info("MongoDB disconnected. Exiting process.");
      process.exit(0);
    } catch (err) {
      logger.error("Error during graceful shutdown", err);
      process.exit(1);
    }
  };
}
process.on("SIGINT", gracefulShutdown("SIGINT"));
process.on("SIGTERM", gracefulShutdown("SIGTERM"));

// Catch unhandled rejections / exceptions
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Rejection", reason);
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught Exception", err);
  // optionally exit
  process.exit(1);
});

// -------------------- Start server --------------------
app.listen(PORT, () => {
  logger.info(
    `🚀 Server running on http://localhost:${PORT} (env: ${NODE_ENV})`
  );
});

export default app;
