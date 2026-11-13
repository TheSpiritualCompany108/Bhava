import mongoose from "mongoose";

// Append-only audit trail of every stock change.
const stockMovementSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, index: true },
    type: { type: String, enum: ["set", "adjust", "order", "restock", "init"], required: true },
    delta: { type: Number, required: true },
    before: { type: Number, required: true },
    after: { type: Number, required: true },
    reason: { type: String, default: "" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", default: null },
    actor: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
stockMovementSchema.index({ sku: 1, createdAt: -1 });

export default mongoose.model("StockMovement", stockMovementSchema);
