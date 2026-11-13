import mongoose from "mongoose";
import { MODES, PRODUCT_STATUSES } from "../data/catalogConstants.js";

const variantSchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    sku: { type: String, required: true, trim: true, uppercase: true },
    fragrances: { type: [String], default: [] },
    active: { type: Boolean, default: true },
  },
  { _id: false }
);

// MongoDB is the source of truth for the storefront AND Admin. Stock is NOT stored here (see Inventory).
const catalogProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, index: true },
    price: { type: Number, required: true, min: 0 },
    mode: { type: String, enum: MODES, required: true },
    variants: { type: [variantSchema], default: [] },
    status: { type: String, enum: PRODUCT_STATUSES, default: "active", index: true },
    sortOrder: { type: Number, default: 0 },

    format: { type: String, default: "" },
    tagline: { type: String, default: "" }, // short product-card description
    description: { type: String, default: "" },
    intention: { type: String, default: "" },
    pack: { type: String, default: "" }, // key product facts line
    packQuantity: { type: String, default: "" },
    netWeight: { type: String, default: "" }, // only verified weights
    contents: { type: [{ label: String, value: String, _id: false }], default: [] },
    fitNote: { type: String, default: "" },
    materials: { type: String, default: "" },
    usage: { type: String, default: "" },
    safety: { type: String, default: "" },
    storage: { type: String, default: "" },
    faqs: { type: [{ q: String, a: String, _id: false }], default: [] },

    image: { type: String, default: "" },
    gallery: { type: [String], default: [] },
    seoTitle: { type: String, default: "" },
    seoDescription: { type: String, default: "" },

    copyPending: { type: Boolean, default: false },
    approvalNotes: { type: String, default: "" },
    related: {
      upsell: { type: String, default: "" },
      upsellAlt: { type: String, default: "" },
      upsellBundle: { type: String, default: "" },
      crossSell: { type: [String], default: [] },
      bundle: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// A SKU may belong to exactly one variant of one product
catalogProductSchema.index({ "variants.sku": 1 }, { unique: true });

export default mongoose.model("CatalogProduct", catalogProductSchema);
