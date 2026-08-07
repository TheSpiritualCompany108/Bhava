import express from "express";
import { listDhyanAudio } from "../controllers/dhyanAudioController.js";

const router = express.Router();

// Public endpoint to list all uploaded 21-Day Dhyan Challenge audio by day
// GET /api/dhyan-audio
router.get("/", listDhyanAudio);

export default router;
