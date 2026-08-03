import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createTile,
  listTiles,
  getTile,
  updateTile,
  deleteTile,
} from "../controllers/tileController.js";
import {
  createQuote,
  listQuotes,
  getQuote,
  updateQuote,
  deleteQuote,
} from "../controllers/quoteController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import { adminLogin } from "../controllers/adminAuthController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, "..", "uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({ storage });

// Admin login (unprotected)
router.get("/", (req, res) =>
  res.json({ success: true, message: "Admin router mounted" }),
);
// Helpful GET so visiting the URL in a browser doesn't return the global 404
router.get("/login", (req, res) =>
  res.json({
    success: true,
    message:
      "Use POST /api/admin/login with {email,password} JSON to authenticate",
  }),
);
router.post("/login", adminLogin);

// List / Create (admin protected)
router.get("/tiles", protect, adminOnly, listTiles);
router.post("/tiles", protect, adminOnly, upload.single("image"), createTile);

// Read / Update / Delete
router.get("/tiles/:id", protect, adminOnly, getTile);
router.put(
  "/tiles/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateTile,
);
router.delete("/tiles/:id", protect, adminOnly, deleteTile);

// Quotes (Today's Reflection) — admin protected
router.get("/quotes", protect, adminOnly, listQuotes);
router.post("/quotes", protect, adminOnly, createQuote);
router.get("/quotes/:id", protect, adminOnly, getQuote);
router.put("/quotes/:id", protect, adminOnly, updateQuote);
router.delete("/quotes/:id", protect, adminOnly, deleteQuote);

export default router;
