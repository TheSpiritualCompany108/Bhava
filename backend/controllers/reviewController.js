import mongoose from "mongoose";
import Review from "../models/Review.js";
import CatalogProduct from "../models/CatalogProduct.js";
import User from "../models/User.js";
import Order from "../models/Order.js";

const SORTS = {
  recent: { createdAt: -1 },
  highest: { rating: -1, createdAt: -1 },
  lowest: { rating: 1, createdAt: -1 },
};

const slugOf = (v) => String(v || "").trim().toLowerCase();

const buildSummary = (reviews) => {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;
  reviews.forEach((r) => {
    breakdown[r.rating] += 1;
    sum += r.rating;
  });
  const count = reviews.length;
  return {
    count,
    average: count ? Math.round((sum / count) * 100) / 100 : 0,
    breakdown,
  };
};

const shape = (r) => ({
  id: r._id,
  userId: r.userId,
  name: r.name,
  rating: r.rating,
  title: r.title,
  body: r.body,
  verified: r.verified,
  productId: r.productId || "",
  createdAt: r.createdAt,
});

// GET /api/reviews?verified=1&limit=6 — homepage (verified only)
export const getVerifiedReviews = async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 6, 1), 12);
    const filter = { verified: true };
    const [reviews, allVerified] = await Promise.all([
      Review.find(filter).sort({ rating: -1, createdAt: -1 }).limit(limit).lean(),
      Review.find(filter).select("rating").lean(),
    ]);
    res.json({
      success: true,
      summary: buildSummary(allVerified),
      reviews: reviews.map(shape),
    });
  } catch {
    res.status(500).json({ success: false, message: "Could not load reviews" });
  }
};

// GET /api/reviews/:productId?sort=recent|highest|lowest  (productId = catalog slug)
export const getReviews = async (req, res) => {
  try {
    const productId = slugOf(req.params.productId);
    if (!productId) {
      return res.status(400).json({ success: false, message: "Invalid product" });
    }
    const sort = SORTS[req.query.sort] || SORTS.recent;

    const all = await Review.find({ productId }).sort(sort).lean();
    res.json({
      success: true,
      summary: buildSummary(all),
      reviews: all.map(shape),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not load reviews" });
  }
};

// POST /api/reviews/:productId  (protected)  body: { rating, title, body }
export const createReview = async (req, res) => {
  try {
    const productId = slugOf(req.params.productId);
    if (!productId) {
      return res.status(400).json({ success: false, message: "Invalid product" });
    }
    if (!mongoose.isValidObjectId(req.userId)) {
      return res.status(403).json({ success: false, message: "Please sign in with a customer account to review." });
    }

    const rating = Number(req.body.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Please select a rating from 1 to 5 stars" });
    }

    const [product, user] = await Promise.all([
      CatalogProduct.findOne({ slug: productId, status: { $ne: "archived" } }).select("slug name"),
      User.findById(req.userId).select("name"),
    ]);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const hasOrdered = await Order.exists({
      userId: req.userId,
      status: { $ne: "cancelled" },
      $or: [
        { "items.slug": product.slug },
        { "items.components.productSlug": product.slug },
        { "items.title": product.name },
      ],
    });

    const payload = {
      rating,
      title: (req.body.title || "").trim(),
      body: (req.body.body || "").trim(),
      name: user.name,
      verified: Boolean(hasOrdered),
    };

    // Upsert: a user can update their own review
    const existing = await Review.findOne({ productId, userId: req.userId });
    let review;
    let created = false;
    if (existing) {
      Object.assign(existing, payload);
      review = await existing.save();
    } else {
      review = await Review.create({ ...payload, productId, userId: req.userId });
      created = true;
    }

    const all = await Review.find({ productId }).lean();
    res.status(created ? 201 : 200).json({
      success: true,
      message: created ? "Thank you for sharing your experience!" : "Your review has been updated.",
      review: shape(review),
      summary: buildSummary(all),
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    res.status(500).json({ success: false, message: "Could not save your review" });
  }
};

// DELETE /api/reviews/:productId/:reviewId  (protected: owner or admin)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    const isOwner = String(review.userId) === String(req.userId);
    if (!isOwner && req.userRole !== "admin") {
      return res.status(403).json({ success: false, message: "Not allowed" });
    }
    await review.deleteOne();
    res.json({ success: true, message: "Review removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not delete review" });
  }
};
