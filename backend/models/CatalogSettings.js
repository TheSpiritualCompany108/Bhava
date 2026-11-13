import mongoose from "mongoose";
import { LOW_STOCK_DEFAULT } from "../data/catalogConstants.js";

export const DEFAULT_SHOP_FILTERS = {
  category: true,
  fragrance: true,
  format: true,
  price: true,
  intention: true,
  availability: true,
};

// Singleton (key: "main")
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    lowStockThreshold: { type: Number, default: LOW_STOCK_DEFAULT, min: 0 },
    // Which filter groups appear in the storefront left filter panel (Admin-controllable)
    shopFilters: {
      category: { type: Boolean, default: true },
      fragrance: { type: Boolean, default: true },
      format: { type: Boolean, default: true },
      price: { type: Boolean, default: true },
      intention: { type: Boolean, default: true },
      availability: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("CatalogSettings", settingsSchema);
