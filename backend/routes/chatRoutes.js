import express from "express";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

// Public endpoint for the "Guru" chat widget
// POST /api/chat  { messages: [{ role: "user"|"assistant", content: string }] }
router.post("/", chat);

export default router;
