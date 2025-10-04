import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import { PORT, CLIENT_URL, NODE_ENV } from "./config/config.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_PATH = path.join(__dirname, "dist");

// ----------------------
// Middleware
// ----------------------
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.set("trust proxy", 1);

// ----------------------
// CORS (different for dev & prod)
// ----------------------
const allowedOrigins =
  NODE_ENV === "production"
    ? [CLIENT_URL]
    : ["http://localhost:3000", CLIENT_URL];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) cb(null, true);
      else cb(new Error(`CORS policy: ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ----------------------
// Rate limiter
// ----------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests. Try again later.",
});
app.use("/api", limiter);

// ----------------------
// Routes
// ----------------------
app.use("/api", contactRoutes);

// ----------------------
// Serve frontend build
// ----------------------
app.use(express.static(DIST_PATH));
app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_PATH, "index.html"));
});

// ----------------------
// Error handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("❌", err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, error: err.message || "Something went wrong!" });
});

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Environment: ${NODE_ENV}`);
  console.log(`✅ Allowed Origins: ${allowedOrigins.join(", ")}`);
});
