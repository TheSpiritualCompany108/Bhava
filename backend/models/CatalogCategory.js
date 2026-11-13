import mongoose from "mongoose";

const catalogCategorySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, trim: true, lowercase: true },
    label: { type: String, required: true, trim: true },
    blurb: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("CatalogCategory", catalogCategorySchema);
