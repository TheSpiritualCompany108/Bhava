import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // Catalog product slug (e.g. "sacred-notes-discovery")
    productId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true, maxlength: 100, default: "" },
    body: {
      type: String,
      required: [true, "Please write a few words about the product"],
      trim: true,
      minlength: [10, "Review must be at least 10 characters"],
      maxlength: 2000,
    },
    // true when the reviewer has an order containing this product
    verified: { type: Boolean, default: false },
    // true for sample reviews inserted by seed-reviews.js (removable with --clear)
    demo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One review per user per product
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
