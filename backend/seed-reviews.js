// Inserts DEMO reviews for every product (category "Products").
//   node seed-reviews.js          -> add demo reviews (skips products that already have demo ones)
//   node seed-reviews.js --clear  -> remove all demo reviews
import "dotenv/config";
import mongoose from "mongoose";
import Tile from "./models/Tile.js";
import Review from "./models/Review.js";

const DEMO = [
  { name: "Aarti Sharma", rating: 5, title: "Beautiful and calming", body: "The fragrance is soft and truly peaceful. It has become a part of my morning puja and the whole house feels sanctified.", verified: true, daysAgo: 4 },
  { name: "Rohit Mehra", rating: 5, title: "Premium quality", body: "Packaging was neat and the product feels authentic. Exactly as described, will order again for gifting.", verified: true, daysAgo: 12 },
  { name: "Priya Nair", rating: 4, title: "Lovely offering", body: "Very good quality and quick delivery. I wish there were more size options, but overall I am very happy.", verified: true, daysAgo: 25 },
  { name: "Vikram Joshi", rating: 5, title: "Worth every rupee", body: "You can feel the care that goes into making this. My family loved it and it adds a lot to our daily devotion.", verified: false, daysAgo: 41 },
  { name: "Sneha Iyer", rating: 5, title: "Highly recommend", body: "Pure, handcrafted and thoughtfully packed. It arrived well before time and smelled wonderful.", verified: true, daysAgo: 70 },
  { name: "Karan Malhotra", rating: 4, title: "Good experience", body: "Product matches the photos. Great for meditation and evening aarti. Support team was helpful too.", verified: false, daysAgo: 120 },
];

await mongoose.connect(process.env.MONGODB_URL);

if (process.argv.includes("--clear")) {
  const r = await Review.deleteMany({ demo: true });
  console.log(`Removed ${r.deletedCount} demo reviews`);
} else {
  const products = await Tile.find({ category: "Products" }).select("_id title");
  let added = 0;
  for (const p of products) {
    if (await Review.exists({ productId: p._id, demo: true })) continue;
    const docs = DEMO.map((d) => ({
      productId: p._id,
      userId: new mongoose.Types.ObjectId(),
      name: d.name,
      rating: d.rating,
      title: d.title,
      body: d.body,
      verified: d.verified,
      demo: true,
      createdAt: new Date(Date.now() - d.daysAgo * 86400000),
      updatedAt: new Date(),
    }));
    await Review.insertMany(docs, { timestamps: false });
    added += docs.length;
    console.log(`+ ${docs.length} reviews for "${p.title}"`);
  }
  console.log(`Done. Added ${added} demo reviews across ${products.length} products.`);
}
await mongoose.disconnect();
