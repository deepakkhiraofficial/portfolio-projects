// --------------------------------------------------
// 🌐 Advanced Express Server Setup (2025 Version)
// Author: Deepak Kushwah (@DeepakKhiraOfficial)
// --------------------------------------------------

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import { PORT, CLIENT_URL, NODE_ENV } from "./config/config.js";
import contactRoutes from "./routes/contactRoutes.js";

// --------------------------------------------------
// 🧠 Environment Setup
// --------------------------------------------------
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, "dist");
const isProd = NODE_ENV === "production";

// --------------------------------------------------
// 🛡️ Global Middlewares
// --------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(isProd ? "tiny" : "dev"));
app.set("trust proxy", 1);

// --------------------------------------------------
// 🌍 Advanced CORS Setup
// --------------------------------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "https://deepakkhiraofficial.netlify.app", // Frontend hosted on Netlify
];

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests without origin (like Postman) or from whitelisted domains
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      console.warn(`❌ CORS Blocked Request from: ${origin}`);
      return cb(new Error(`CORS policy: ${origin} not allowed`));
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// --------------------------------------------------
// 🚦 Rate Limiting
// --------------------------------------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: "Too many requests. Try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// --------------------------------------------------
// 📦 API Routes
// --------------------------------------------------
app.get("/api/health", (_, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy 💚",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ✅ FIX: Use full `/api/contact` prefix
app.use("/api", contactRoutes);

// --------------------------------------------------
// ⚙️ Frontend Build (for Render deployment)
// --------------------------------------------------
if (isProd) {
  // Serve frontend files if in production
  app.use(express.static(DIST_PATH, { maxAge: "1d", etag: true }));

  // Handle SPA routing
  app.get("*", (req, res) => {
    res.sendFile(path.join(DIST_PATH, "index.html"));
  });
}

// --------------------------------------------------
// 🧩 Error Handler (Global)
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// --------------------------------------------------
// 🚀 Start Server
// --------------------------------------------------
app.listen(PORT, () => {
  console.log(`
✅ Server Running → http://localhost:${PORT}
🌍 Environment     → ${NODE_ENV}
🔗 Allowed Origins → ${allowedOrigins.join(", ")}
⚡ Ready to serve frontend & API requests...
`);
});
