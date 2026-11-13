// One-off: set Freshwater Pearl Bracelet to the catalogue price ₹1,101. Does not touch stock.
import dotenv from "dotenv";
import mongoose from "mongoose";
import CatalogProduct from "./models/CatalogProduct.js";

dotenv.config();
await mongoose.connect(process.env.MONGODB_URL);
const r = await CatalogProduct.updateOne(
  { slug: "freshwater-pearl-bracelet" },
  { $set: { price: 1101 } }
);
const doc = await CatalogProduct.findOne({ slug: "freshwater-pearl-bracelet" }, "slug name price").lean();
console.log(JSON.stringify({ matched: r.matchedCount, modified: r.modifiedCount, product: doc }, null, 2));
await mongoose.disconnect();
