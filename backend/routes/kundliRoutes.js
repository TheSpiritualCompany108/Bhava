import express from "express";
import { generateKundli } from "../controllers/kundliController.js";

const router = express.Router();

// Public endpoint for the Kundli Generator page
// POST /api/kundli/generate { fullName, dob: "YYYY-MM-DD", time: "HH:mm", placeOfBirth }
router.post("/generate", generateKundli);

export default router;
