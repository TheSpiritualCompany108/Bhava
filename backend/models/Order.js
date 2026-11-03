import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed, required: true }, // Number (legacy) or Tile ObjectId string
  title:     { type: String, required: true },
  price:     { type: String, required: true },
  priceNum:  { type: Number, required: true },
  image:     { type: String, default: "" },
  category:  { type: String, default: "" },
  quantity:  { type: Number, required: true, min: 1, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,   // null = guest pre-order
    },
    // For guest pre-orders from SacredJourney CTA
    guestEmail: { type: String, default: "" },
    guestName:  { type: String, default: "" },
    guestMobile:{ type: String, default: "" },

    type: {
      type: String,
      enum: ["preorder", "order"],
      default: "preorder",
    },

    items: [orderItemSchema],

    // Pre-order fixed amount (SacredJourney ₹1,299 CTA)
    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    // Shipping address (optional at pre-order stage)
    address: {
      fullName: { type: String, default: "" },
      phone:    { type: String, default: "" },
      line1:   { type: String, default: "" },
      line2:   { type: String, default: "" },
      city:    { type: String, default: "" },
      state:   { type: String, default: "" },
      pincode: { type: String, default: "" },
    },

    // Price breakdown for checkout orders
    pricing: {
      subtotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      shipping: { type: Number, default: 0 },
      total:    { type: Number, default: 0 },
    },

    paymentMethod: { type: String, enum: ["cod", "online"], default: "cod" },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },

    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
