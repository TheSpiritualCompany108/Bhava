import express from "express";
import { getReviews, getVerifiedReviews, createReview, deleteReview } from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getVerifiedReviews);                            // public homepage
router.get("/:productId", getReviews);                          // public
router.post("/:productId", protect, createReview);              // logged-in users
router.delete("/:productId/:reviewId", protect, deleteReview);  // owner or admin

export default router;
