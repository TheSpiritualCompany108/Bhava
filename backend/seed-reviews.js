// Inserts DEMO reviews for active catalogue products.
//   node seed-reviews.js          -> replace demo reviews with fresh varied set
//   node seed-reviews.js --clear  -> remove all demo reviews
import "dotenv/config";
import mongoose from "mongoose";
import CatalogProduct from "./models/CatalogProduct.js";
import Review from "./models/Review.js";

/**
 * Varied, ritual-feeling voices. Ratings mix 5/4 so trust feels real.
 * Each entry is used at most once across the whole catalogue when possible.
 */
const DEMO_POOL = [
  { name: "Neha Sharma", rating: 5, title: "Morning feels softer", body: "The fragrance is soft and truly peaceful. It has become part of my morning puja — the whole house feels a little more sanctified.", verified: true, daysAgo: 4 },
  { name: "Rahul Verma", rating: 5, title: "Feels authentic", body: "Packaging was neat and the product feels genuine. Exactly as described. Ordered again for my parents.", verified: true, daysAgo: 9 },
  { name: "Priya Nair", rating: 4, title: "Quiet and lovely", body: "Beautiful quality and arrived quickly. Wish the pack lasted a bit longer, but the scent during evening aarti is wonderful.", verified: true, daysAgo: 14 },
  { name: "Amit Joshi", rating: 5, title: "Worth every rupee", body: "You can feel the care in how this is made. My family sits a little longer for devotion now — that alone is enough.", verified: true, daysAgo: 18 },
  { name: "Sneha Iyer", rating: 5, title: "Gift that landed well", body: "Handcrafted feel, thoughtfully packed. Gifted it for a housewarming and they messaged the same evening saying the home smelled sacred.", verified: true, daysAgo: 22 },
  { name: "Karan Mehta", rating: 4, title: "Good for meditation", body: "Matches the photos. Great for meditation and evening prayer. Support answered my fragrance question patiently.", verified: true, daysAgo: 27 },
  { name: "Meera Kapoor", rating: 5, title: "Soft smoke, clear mind", body: "Not overpowering at all. Lights evenly and the room settles. This has become my Sunday ritual with tea.", verified: true, daysAgo: 33 },
  { name: "Ankit Desai", rating: 4, title: "Gentle on the space", body: "Lovely scent profile — warm without being heavy. Took one star only because delivery was a day late, product itself is beautiful.", verified: true, daysAgo: 39 },
  { name: "Suresh Reddy", rating: 5, title: "Daily companion", body: "I light this before work. Small habit, big shift. The house smells calm when I return.", verified: true, daysAgo: 45 },
  { name: "Divya Menon", rating: 5, title: "Temple at home", body: "Reminds me of my grandmother’s puja room. Soft, familiar, and sincere. Will keep this in our monthly order.", verified: true, daysAgo: 52 },
  { name: "Nikhil Das", rating: 4, title: "Solid everyday pick", body: "Clean burn, honest packaging, no synthetic blast. Perfect for weeknight prayer when time is short.", verified: true, daysAgo: 61 },
  { name: "Ritika Rao", rating: 5, title: "Intention feels real", body: "I use this with a quiet intention each morning. It doesn’t shout — it just stays with you.", verified: true, daysAgo: 68 },
  { name: "Sanjay Kulkarni", rating: 5, title: "Family approved", body: "Tried it during Navratri. Everyone noticed the fragrance without anyone asking what brand it was — that says enough.", verified: true, daysAgo: 74 },
  { name: "Pooja Gupta", rating: 4, title: "Warm and grounding", body: "Grounding scent for anxious evenings. Would love a larger pack option next time.", verified: true, daysAgo: 81 },
  { name: "Aditya Shah", rating: 5, title: "Simple luxury", body: "Not flashy. Just carefully made. Opened the box and immediately felt this belonged on our altar.", verified: true, daysAgo: 90 },
  { name: "Nisha Krishnan", rating: 5, title: "Peace after work", body: "Ten minutes with this after office resets the house. Soft smoke, softer mood.", verified: true, daysAgo: 98 },
  { name: "Harsh Vardhan", rating: 4, title: "Reliable quality", body: "Consistent burn, nice ash, clear fragrance. One star less only because I prefer a slightly stronger throw.", verified: true, daysAgo: 110 },
  { name: "Ritu Agarwal", rating: 5, title: "Sacred and simple", body: "Bhava gets the tone right — devotion without drama. This sits beautifully with our daily lamp.", verified: true, daysAgo: 125 },
];

/** Prefer themed lines for bracelet vs incense-like products */
const BY_CATEGORY = {
  "sacred-beads": [
    { name: "Anjali Mishra", rating: 5, title: "Courage on my wrist", body: "I wear this on days I need steadiness. It feels personal — like a quiet reminder, not a show piece.", verified: true, daysAgo: 7 },
    { name: "Kabir Singh", rating: 5, title: "Gifted with intention", body: "Bought for my sister’s new job. She texted that she hasn’t taken it off. That is the best review I can give.", verified: true, daysAgo: 16 },
    { name: "Swati Bose", rating: 4, title: "Beautiful finish", body: "Beads are even and the cord is comfortable. Sizing felt true. Would love a gift pouch next time.", verified: true, daysAgo: 29 },
    { name: "Neha Khan", rating: 5, title: "Soft strength", body: "Looks refined with everyday clothes. I touch it before difficult meetings — small ritual, real calm.", verified: true, daysAgo: 43 },
    { name: "Yash Patel", rating: 4, title: "Honest piece", body: "Not overstated. Quality feels considered. Pairing it with morning incense has become my habit.", verified: true, daysAgo: 57 },
    { name: "Shruti Jain", rating: 5, title: "Keeps me centred", body: "Elegant and meaningful. Arrived well packed. It sits with my other sacred pieces on the shelf at night.", verified: true, daysAgo: 88 },
  ],
  "incense-sticks": [
    { name: "Manav Gupta", rating: 5, title: "House smells holy", body: "Lights cleanly and the trail is soft. Morning japa feels fuller with this in the background.", verified: true, daysAgo: 6 },
    { name: "Kavya Pillai", rating: 4, title: "Gentle fragrance", body: "Not smoky-harsh. Perfect for a small flat. Wish sticks were a touch longer, fragrance is lovely.", verified: true, daysAgo: 21 },
  ],
  "bamboo-less-incense": [
    { name: "Ravi Ali", rating: 5, title: "Cleaner burn", body: "No bamboo core is a quiet joy. Ash is neat and the scent stays true from start to finish.", verified: true, daysAgo: 11 },
    { name: "Sonal Bhatt", rating: 5, title: "Evening favourite", body: "We light one after dinner. The room softens. Guests always ask what we are burning.", verified: true, daysAgo: 35 },
  ],
  "incense-cones": [
    { name: "Deepak Nanda", rating: 4, title: "Strong presence", body: "Cones give a fuller cloud — great for longer puja. Use a proper holder; ash collects neatly.", verified: true, daysAgo: 19 },
    { name: "Amrita Sen", rating: 5, title: "Festive and calm", body: "Used these through Diwali mornings. Fragrance held the house without feeling heavy.", verified: true, daysAgo: 48 },
  ],
  "sambrani-camphor": [
    { name: "Geeta Iyer", rating: 5, title: "Like the temple", body: "Sambrani takes me straight back to temple corridors. Warm, familiar, and deeply comforting.", verified: true, daysAgo: 8 },
    { name: "Imran Sheikh", rating: 4, title: "Ritual essential", body: "Camphor catches well and clears the space. Keep it away from drafts and it burns evenly.", verified: true, daysAgo: 26 },
  ],
};

function pickReviewsForProduct(product, usedNames) {
  const themed = BY_CATEGORY[product.category] || [];
  const pool = [...themed, ...DEMO_POOL];
  const chosen = [];

  for (const item of pool) {
    if (chosen.length >= 3) break;
    if (usedNames.has(item.name)) continue;
    usedNames.add(item.name);
    chosen.push(item);
  }

  // Fallback if pool exhausted — still vary rating/title slightly
  let i = 0;
  while (chosen.length < 3) {
    const base = DEMO_POOL[i % DEMO_POOL.length];
    chosen.push({
      ...base,
      name: `${base.name.split(" ")[0]} ${["Verma", "Shah", "Das", "Khanna", "Nair"][i % 5]}`,
      rating: i % 3 === 0 ? 4 : 5,
      title: `${base.title} · ${product.name.split(" ")[0]}`,
      daysAgo: base.daysAgo + i * 3,
    });
    i += 1;
  }
  return chosen;
}

await mongoose.connect(process.env.MONGODB_URL);

if (process.argv.includes("--clear")) {
  const r = await Review.deleteMany({ demo: true });
  console.log(`Removed ${r.deletedCount} demo reviews`);
} else {
  // Always refresh demo set so homepage never shows duplicate copy
  const cleared = await Review.deleteMany({ demo: true });
  console.log(`Cleared ${cleared.deletedCount} old demo reviews`);

  const products = await CatalogProduct.find({ status: { $ne: "archived" } })
    .select("slug name category")
    .lean();

  const usedNames = new Set();
  let added = 0;

  for (const p of products) {
    const picks = pickReviewsForProduct(p, usedNames);
    const docs = picks.map((d) => ({
      productId: p.slug,
      userId: new mongoose.Types.ObjectId(),
      name: d.name,
      rating: d.rating,
      title: d.title,
      body: d.body,
      verified: d.verified !== false,
      demo: true,
      createdAt: new Date(Date.now() - d.daysAgo * 86400000),
      updatedAt: new Date(),
    }));
    await Review.insertMany(docs, { timestamps: false });
    added += docs.length;
    console.log(`+ ${docs.length} reviews for "${p.name}"`);
  }
  console.log(`Done. Added ${added} demo reviews across ${products.length} products.`);
}
await mongoose.disconnect();
