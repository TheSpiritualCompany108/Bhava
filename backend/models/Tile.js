import mongoose from "mongoose";

const TileSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    category: { type: String, default: "Active Challenges" },
    badgeText: { type: String },
    duration: { type: String },
    summary: { type: String },
    fullDescription: { type: String },
    imageUrl: { type: String },
    handle: { type: String, index: true },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
      index: true,
    },
    lessons: [
      {
        num: Number,
        title: String,
        duration: String,
      },
    ],
    meta: { type: Object },
  },
  { timestamps: true },
);

const Tile = mongoose.model("Tile", TileSchema);
export default Tile;
