import express from "express";
import { listMantraAudio } from "../controllers/mantraAudioController.js";

const router = express.Router();

// Public endpoint to list all uploaded mantra audio by day
// GET /api/mantra-audio
router.get("/", listMantraAudio);

export default router;
