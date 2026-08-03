import express from "express";
import { getLiveQuotes } from "../controllers/quoteController.js";

const router = express.Router();

// Public endpoint to get the quotes to rotate through on the homepage
// GET /api/quotes/active
router.get("/active", getLiveQuotes);

export default router;
