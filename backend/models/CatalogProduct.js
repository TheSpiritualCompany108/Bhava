import mongoose from "mongoose";
import { MODES, PRODUCT_STATUSES } from "../data/catalogConstants.js";

/** A+ banner modules — shared by products and curated collections. */
export const aplusContentField = {
  type: [
    {
      _id: false,
      type: { type: String, required: true },        // module type key
      layout: { type: String, default: "default" },  // layout variant (e.g. "image-left", "image-right", "3-col", "2-col")
      device: { type: String, default: "desktop" },  // desktop | mobile | all
      order: { type: Number, default: 0 },           // controls render sequence
      // shared optional fields
      headline: { type: String, default: "" },
      subheadline: { type: String, default: "" },
      body: { type: String, default: "" },
      image: { type: String, default: "" },
      // feature_grid / highlight_strip items
      items: {
        type: [{ _id: false, icon: String, title: String, text: String, image: String }],
        default: [],
      },
      // comparison_chart
      columns: { type: [String], default: [] },
      rows: {
        type: [{ _id: false, label: String, values: [String] }],
        default: [],
      },
    },
  ],
  default: [],
};

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

    // ── A+ Content ──────────────────────────────────────────────────────────
    // Each module has: type, layout, order, and type-specific content fields.
    // Supported types: hero_banner | text_image | feature_grid | highlight_strip | brand_story | comparison_chart | faq_block
    aplusContent: aplusContentField,

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
