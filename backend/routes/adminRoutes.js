import express from "express";
import multer from "multer";
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
import {
  upsertMantraAudio,
  listMantraAudio,
  deleteMantraAudio,
} from "../controllers/mantraAudioController.js";
import {
  upsertDhyanAudio,
  listDhyanAudio,
  deleteDhyanAudio,
} from "../controllers/dhyanAudioController.js";
import protect, { adminOnly } from "../middleware/authMiddleware.js";
import { adminLogin } from "../controllers/adminAuthController.js";

const router = express.Router();

// Memory storage: files are held as a buffer and uploaded to Vercel Blob
// in the controller, since the serverless filesystem is read-only.
const upload = multer({ storage: multer.memoryStorage() });

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

// 108-Day Mantra Sādhana audio — admin protected
router.get("/mantra-audio", protect, adminOnly, listMantraAudio);
router.put(
  "/mantra-audio/:day",
  protect,
  adminOnly,
  upload.single("audio"),
  upsertMantraAudio,
);
router.delete("/mantra-audio/:day", protect, adminOnly, deleteMantraAudio);

// 21-Day Dhyan Challenge audio — admin protected
router.get("/dhyan-audio", protect, adminOnly, listDhyanAudio);
router.put(
  "/dhyan-audio/:day",
  protect,
  adminOnly,
  upload.single("audio"),
  upsertDhyanAudio,
);
router.delete("/dhyan-audio/:day", protect, adminOnly, deleteDhyanAudio);

export default router;
