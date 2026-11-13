import mongoose from "mongoose";
import { LOW_STOCK_DEFAULT } from "../data/catalogConstants.js";

// Singleton (key: "main")
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    lowStockThreshold: { type: Number, default: LOW_STOCK_DEFAULT, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("CatalogSettings", settingsSchema);
