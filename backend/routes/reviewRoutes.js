import express from "express";
import { getReviews, createReview, deleteReview } from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:productId", getReviews);                          // public
router.post("/:productId", protect, createReview);              // logged-in users
router.delete("/:productId/:reviewId", protect, deleteReview);  // owner or admin

export default router;
