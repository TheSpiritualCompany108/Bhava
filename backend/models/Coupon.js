import mongoose from "mongoose";

// Admin-managed discount codes. Amounts are always re-checked on the server at pricing and at checkout.
const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, default: "", trim: true },        // short line shown to customers, e.g. "10% off your first ritual"
    type: { type: String, enum: ["percent", "flat"], required: true },
    value: { type: Number, required: true, min: 1 },         // percent (1-90) or rupees
    maxDiscount: { type: Number, default: 0, min: 0 },       // percent coupons: cap in rupees (0 = no cap)
    minOrder: { type: Number, default: 0, min: 0 },          // minimum selling subtotal in rupees
    active: { type: Boolean, default: true },
    visible: { type: Boolean, default: true },               // listed under "Apply Coupons" (false = secret code, type to use)
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
    usageLimit: { type: Number, default: 0, min: 0 },        // total redemptions (0 = unlimited)
    perUserLimit: { type: Number, default: 0, min: 0 },      // per customer (0 = unlimited)
    usedCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
