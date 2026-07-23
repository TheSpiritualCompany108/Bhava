// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";
// import authRoutes from "./routes/authRoutes.js";
// import contactRoutes from "./routes/contactRoutes.js";
// import cartRoutes from "./routes/cartRoutes.js";
// import orderRoutes from "./routes/orderRoutes.js";
// import careerRoutes from "./routes/careerRoutes.js";
// import missionRoutes from "./routes/missionRoutes.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ── Middleware ────────────────────────────────────────────────
// const corsOptions = {
//   origin: [
//     "http://localhost:5173",
//     "http://localhost:3000",
//     process.env.CLIENT_URL,
//   ].filter(Boolean),
//   credentials: true,
// };
// app.use(cors(corsOptions));
// app.options("*", cors(corsOptions));
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// // ── Routes ────────────────────────────────────────────────────
// app.use("/api/auth", authRoutes);
// app.use("/api/contact", contactRoutes);
// app.use("/api/cart", cartRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/career", careerRoutes);
// app.use("/api/mission", missionRoutes);

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ success: true, message: "Bhava API is running" });
// });

// // 404 fallback
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: "Route not found" });
// });

// // Global error handler
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: "Internal server error" });
// });

// // ── Database + Start ─────────────────────────────────────────
// mongoose
//   .connect(process.env.MONGODB_URL)
//   .then(() => {
//     console.log("Connected to MongoDB");
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("MongoDB connection error:", err.message);
//     process.exit(1);
//   });

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import careerRoutes from "./routes/careerRoutes.js";
import tilesRoutes from "./routes/tilesRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://bhava-fkv3.vercel.app",
  "https://bhava-beige.vercel.app",
  "https://bhavaglobal.com",
  "https://www.bhavaglobal.com",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Create uploads directory if it doesn't exist
const uploadsPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

// serve uploaded files from backend/uploads
app.use("/uploads", express.static(uploadsPath));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/career", careerRoutes);
app.use("/api/tiles", tilesRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Bhava API is running" });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

// ── Database + Start ─────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
export default app;