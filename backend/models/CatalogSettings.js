import mongoose from "mongoose";
import { LOW_STOCK_DEFAULT } from "../data/catalogConstants.js";

export const DEFAULT_SHOP_FILTERS = {
  category: true,
  collection: true,
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
    // Optional donation add-on at checkout (all text/amounts Admin-controlled; off until Admin enables it)
    donation: {
      enabled: { type: Boolean, default: false },
      heading: { type: String, default: "Support transformative social work in India" },
      label: { type: String, default: "Donate and make a difference" },
      note: { type: String, default: "" },
      amounts: { type: [Number], default: [10, 20, 50, 100] },
      maxAmount: { type: Number, default: 10000 },
    },
    // Which filter groups appear in the storefront left filter panel (Admin-controllable)
    shopFilters: {
      category: { type: Boolean, default: true },
      collection: { type: Boolean, default: true },
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
