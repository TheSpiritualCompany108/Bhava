import express from "express";
import multer from "multer";
import { getReviews, getVerifiedReviews, createReview, deleteReview } from "../controllers/reviewController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 4 },
});

router.get("/", getVerifiedReviews);                            // public homepage
router.get("/:productId", getReviews);                          // public
router.post("/:productId", protect, upload.array("images", 4), createReview); // logged-in users
router.delete("/:productId/:reviewId", protect, deleteReview);  // owner or admin

export default router;
