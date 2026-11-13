import mongoose from "mongoose";

// One document per sellable SKU (fragrance variant / bracelet). Bundles hold no stock of
// their own — purchases deduct the component SKUs listed here.
const inventorySchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Inventory", inventorySchema);
