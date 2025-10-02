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

// CORS
const allowedOrigins = [CLIENT_URL];
if (NODE_ENV !== "production") allowedOrigins.push("http://localhost:3000");

app.use(
  cors({
    origin: (origin, cb) =>
      !origin || allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error(`CORS policy: ${origin} not allowed`)),
    credentials: true,
  })
);
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// Security + logging
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use("/contact", limiter);

// API routes
app.use("/contact", contactRoutes);

// Serve frontend
app.use(express.static(DIST_PATH));
app.get(/^\/(?!api).*/, (req, res) =>
  res.sendFile(path.join(DIST_PATH, "index.html"))
);

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.message?.startsWith("CORS"))
    return res.status(403).json({ success: false, error: err.message });
  res
    .status(err.status || 500)
    .json({ success: false, error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Frontend served from ${DIST_PATH}`);
  console.log(`✅ CORS enabled for: ${allowedOrigins.join(", ")}`);
  console.log(`✅ Environment: ${NODE_ENV}`);
});
