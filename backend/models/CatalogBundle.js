import mongoose from "mongoose";
import { BUNDLE_STATUSES, HOME_MODULES } from "../data/catalogConstants.js";

const componentSchema = new mongoose.Schema(
  {
    bracelet: { type: Boolean, default: undefined }, // customer-chosen bracelet slot
    product: { type: String }, // product slug (when not a bracelet slot)
    via: { type: String, enum: ["fragrance", "camphor", "pair", "fixed"] },
    variant: { type: String }, // variant key when via === "fixed"
  },
  { _id: false }
);

// The bundle PRICE is never stored: it is always computed from the component products' prices.
const catalogBundleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    group: { type: String, default: "" },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    components: { type: [componentSchema], default: [] },
    status: { type: String, enum: BUNDLE_STATUSES, default: "active", index: true },
    featured: { type: Boolean, default: false }, // the 8 priority launch bundles
    launchPriority: { type: Number, default: null },
    homeModule: { type: String, enum: HOME_MODULES, default: "" },
    sortOrder: { type: Number, default: 0 },
    approvalNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("CatalogBundle", catalogBundleSchema);
