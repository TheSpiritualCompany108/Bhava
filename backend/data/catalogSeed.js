// ─────────────────────────────────────────────────────────────────────────────
// APPROVED CATALOGUE SEED — source: Master Catalogue, Pricing & Website Merchandising Playbook
// (PDF + Word). This file is ONLY a bootstrap/migration source. At runtime MongoDB is the source
// of truth; the sync process (services/catalogService.js → syncCatalog) inserts what is missing
// and NEVER overwrites existing products, bundles or stock.
// Do not add data that is not in the document.
// ─────────────────────────────────────────────────────────────────────────────
import { CORE_FRAGRANCES, CAMPHOR_FRAGRANCES, PAIRS, SKU_FRAG, FRAGRANCES, allowedVariants } from "./catalogConstants.js";

export const SEED_CATEGORIES = [
  { id: "incense-sticks", label: "Incense Sticks", blurb: "Sacred Notes — Discovery, Duo and Triveni.", sortOrder: 1 },
  { id: "bamboo-less-incense", label: "Bamboo-less Incense", blurb: "Pure Ritual — Single, Twin and 27.", sortOrder: 2 },
  { id: "incense-cones", label: "Incense Cones", blurb: "Sacred Ember — a distinctive cone format.", sortOrder: 3 },
  { id: "sambrani-camphor", label: "Sambrani & Camphor", blurb: "Offering cups and ritual camphor.", sortOrder: 4 },
  { id: "sacred-beads", label: "Sacred Beads", blurb: "Five bracelets, each with its own intention — including a Rose Quartz & Rhodonite mixed-stone piece.", sortOrder: 5 },
];

const IMG = {
  sticks: "/Products/Home Page Incense.png",
  bambooless: "/Products/Product Incense 2.png",
  cones: "/Products/Product Incense 3.png",
  sambrani: "/Products/Home Page Sambrani.png",
  camphor: "/Products/Product Sambrani 2.png",
  bracelet: "/Products/Home Page mala.png",
}; // placeholders — final packshot photography pending

const variants = (mode, prefixOrSkus) =>
  allowedVariants(mode).map((v) => ({ ...v, active: true, sku: typeof prefixOrSkus === "string" ? skuFor(prefixOrSkus, v) : prefixOrSkus[v.key] }));
function skuFor(prefix, v) {
  const pair = PAIRS.find(([a, b]) => `${a}-${b}` === v.key);
  if (pair) return `${prefix}-${pair[2]}`;
  return `${prefix}-${SKU_FRAG[v.key]}`;
}

const base = { status: "active", faqs: [], seoTitle: "", seoDescription: "", materials: "", usage: "", safety: "", storage: "", gallery: [], netWeight: "", fitNote: "", intention: "", copyPending: false, approvalNotes: "" };

// ── 15 products (Section 2.1 / 5.1) ──────────────────────────────────────────
export const SEED_PRODUCTS = [
  {
    ...base, slug: "sacred-notes-discovery", name: "Sacred Notes Discovery", category: "incense-sticks", price: 251, mode: "single", sortOrder: 1,
    format: "Incense sticks", variants: variants("single", "SN-DIS"), tagline: "A fragrance to begin with.",
    description: "A considered introduction to everyday fragrance rituals. Choose Guggal, Oud or Sandalwood and bring a moment of pause, presence and familiarity into your daily routine.",
    pack: "21 sticks; 21 g net weight; one fragrance per pack.", packQuantity: "21 sticks", netWeight: "21 g",
    contents: [{ label: "Fragrance", value: "One selected fragrance per pack" }], image: IMG.sticks,
    related: { upsell: "sacred-notes-duo", upsellAlt: "", crossSell: ["pure-ritual-single", "sacred-ember"], bundle: "the-classic-pair" },
  },
  {
    ...base, slug: "sacred-notes-duo", name: "Sacred Notes Duo", category: "incense-sticks", price: 501, mode: "pair", sortOrder: 2,
    format: "Incense sticks", variants: variants("pair", "SN-DUO"), tagline: "Two fragrances. One considered ritual.",
    description: "Two fragrances. More ways to shape the atmosphere of your daily ritual. Choose a pair from Guggal, Oud and Sandalwood and move between two distinct fragrance experiences.",
    pack: "42 sticks; two packs of 21; one selected pair.", packQuantity: "42 sticks (2 packs × 21)",
    contents: [{ label: "Fragrances", value: "Your selected pair — one pack of each" }], image: IMG.sticks,
    related: { upsell: "sacred-notes-triveni", upsellAlt: "", crossSell: ["sacred-ember"], bundle: "the-fragrance-and-flame-pair" },
  },
  {
    ...base, slug: "sacred-notes-triveni", name: "Sacred Notes Triveni", category: "incense-sticks", price: 501, mode: "all", sortOrder: 3,
    format: "Incense sticks", variants: variants("all", { all: "SN-TRI" }), tagline: "Three fragrances. One discovery.",
    description: "Three fragrances brought together in one discovery pack: Guggal, Oud and Sandalwood. Explore the range and discover the fragrance that feels right for your space.",
    pack: "45 sticks total; all three fragrances.", packQuantity: "45 sticks in total", // fragrance-wise split NOT confirmed — never publish one
    contents: [{ label: "Fragrances", value: "Guggal, Oud and Sandalwood" }], image: IMG.sticks,
    related: { upsell: "", upsellAlt: "", crossSell: ["pure-ritual-single", "sacred-ember"], bundle: "the-three-format-discovery" },
    approvalNotes: "Fragrance-wise split of the 45 sticks is not confirmed — do not publish one.",
  },
  {
    ...base, slug: "pure-ritual-single", name: "Pure Ritual Single", category: "bamboo-less-incense", price: 351, mode: "single", sortOrder: 4,
    format: "Bamboo-less incense", variants: variants("single", "PR-SGL"), tagline: "A more considered incense ritual.",
    description: "A bamboo-less incense format for a more considered everyday ritual. Choose Guggal, Oud or Sandalwood and create a familiar moment of pause in your space.",
    pack: "21 units; one fragrance per pack.", packQuantity: "21 units",
    contents: [{ label: "Fragrance", value: "One selected fragrance per pack" }], image: IMG.bambooless,
    related: { upsell: "pure-ritual-twin", upsellAlt: "pure-ritual-27", crossSell: ["sacred-notes-discovery"], bundle: "the-classic-pair" },
  },
  {
    ...base, slug: "pure-ritual-twin", name: "Pure Ritual Twin", category: "bamboo-less-incense", price: 701, mode: "pair", sortOrder: 5,
    format: "Bamboo-less incense", variants: variants("pair", "PR-TWIN"), tagline: "Two packs. More room for ritual.",
    description: "Two packs, two fragrance experiences. Choose your preferred pair of Guggal, Oud and Sandalwood for greater flexibility in your daily ritual.",
    pack: "42 units; two packs of 21; one selected pair.", packQuantity: "42 units (2 packs × 21)",
    contents: [{ label: "Fragrances", value: "Your selected pair — one pack of each" }], image: IMG.bambooless,
    related: { upsell: "", upsellAlt: "pure-ritual-27", crossSell: ["sacred-ember"], bundle: "the-pure-ritual-pair" },
  },
  {
    ...base, slug: "pure-ritual-27", name: "Pure Ritual 27", category: "bamboo-less-incense", price: 501, mode: "single", sortOrder: 6,
    format: "Bamboo-less incense", variants: variants("single", "PR-27"), tagline: "27 units. One chosen fragrance.",
    description: "A 27-count bamboo-less incense pack in your chosen fragrance. Choose Guggal, Oud or Sandalwood and keep your preferred ritual within reach.",
    pack: "27 units; one fragrance per pack.", packQuantity: "27 units",
    contents: [{ label: "Fragrance", value: "One selected fragrance per pack" }], image: IMG.bambooless,
    related: { upsell: "", upsellAlt: "", crossSell: ["sacred-notes-discovery", "sacred-ember"], bundle: "the-pure-ritual-fragrance-pair" },
    approvalNotes: "Confirm the pack really contains 27 units / sticks.",
  },
  {
    ...base, slug: "sacred-ember", name: "Sacred Ember", category: "incense-cones", price: 401, mode: "single", sortOrder: 7,
    format: "Cones", variants: variants("single", "SE"), tagline: "A different expression of fragrance.",
    description: "A distinctive cone format for moments when you want to bring fragrance into your space. Available in Guggal, Oud and Sandalwood.",
    pack: "21 cones; one fragrance per pack.", packQuantity: "21 cones",
    contents: [{ label: "Fragrance", value: "One selected fragrance per pack" }], image: IMG.cones,
    related: { upsell: "", upsellAlt: "", crossSell: ["sacred-notes-discovery", "pure-ritual-single"], bundle: "the-fragrance-and-flame-pair" },
  },
  {
    ...base, slug: "sacred-sambrani-offering-cups", name: "Sacred Sambrani Offering Cups", category: "sambrani-camphor", price: 501, mode: "fixed", sortOrder: 8,
    format: "Cups", variants: variants("fixed", { guggal: "SSC-21-GUG" }), tagline: "A traditional Guggal offering.",
    description: "Guggal Sambrani cups for a traditional offering and a considered ritual at home. A dedicated Guggal product designed to complement your regular puja and offering routine.",
    pack: "21 cups; Guggal only.", packQuantity: "21 cups",
    contents: [{ label: "Fragrance", value: "Guggal only" }], image: IMG.sambrani,
    related: { upsell: "", upsellAlt: "", crossSell: ["camphor-ritual-duo"], bundle: "the-sacred-smoke-pair" },
  },
  {
    ...base, slug: "camphor-ritual-duo", name: "Camphor Ritual Duo", category: "sambrani-camphor", price: 351, mode: "camphor", sortOrder: 9,
    format: "Tablets", variants: variants("camphor", { guggal: "CRD-44-GUG", sandalwood: "CRD-44-SAN" }), tagline: "Two tablets. One fragrance.",
    description: "Two 22 g camphor tablets in one selected fragrance. Both tablets in the pack are of the same fragrance, keeping the pack composition consistent.",
    pack: "2 × 22 g; 44 g total; Guggal or Sandalwood.", packQuantity: "2 tablets × 22 g", netWeight: "44 g total",
    contents: [{ label: "Fragrance", value: "One selected fragrance — both tablets identical" }], image: IMG.camphor,
    related: { upsell: "", upsellAlt: "", crossSell: ["sacred-sambrani-offering-cups"], bundle: "the-sacred-smoke-pair" },
    approvalNotes: "Oud camphor not offered until confirmed. Revalidate cost for the 44 g pack.",
  },
  // ── Bracelets (Section 4.1) — Rose Quartz + Rhodonite = one mixed-stone SKU (SB-RQ-RH)
  ...[
    { slug: "tiger-eye-bracelet", name: "Tiger Eye Bracelet", sku: "SB-TE", tag: "Courage to move.", desc: "Traditionally associated with strength, confidence, focus and grounded action, Tiger Eye serves as a reminder to meet uncertainty with courage, remain focused and turn intention into action.", intention: "I choose courage over hesitation.", cross: ["sacred-notes-discovery", "pure-ritual-single"], bundle: "the-personal-ritual-pair" },
    { slug: "evil-eye-bracelet", name: "Evil Eye Bracelet", sku: "SB-EE", tag: "Keep what matters close.", desc: "Traditionally associated with guarding against envy, ill will and unwanted attention, the Evil Eye symbol serves as a reminder to protect your attention, boundaries and peace.", intention: "I choose what deserves my energy.", cross: ["sacred-sambrani-offering-cups", "camphor-ritual-duo"], bundle: "the-protection-and-peace-collection" },
    { slug: "dhan-yog-bracelet", name: "Dhan Yog Bracelet", sku: "SB-DY", tag: "Prosperity with purpose.", desc: "Dhan means wealth; Yog speaks to union, connection and alignment. Dhan Yog is a reminder to create value, exercise discipline, grow what you have and use prosperity with purpose.", intention: "I choose to create, grow and use wealth wisely.", cross: ["sacred-notes-discovery", "sacred-sambrani-offering-cups"], bundle: "the-intention-and-abundance-collection" },
    { slug: "freshwater-pearl-bracelet", name: "Freshwater Pearl Bracelet", sku: "SB-FP", tag: "Calm mind. Clearer perspective.", desc: "Traditionally associated with purity, wisdom and emotional balance, freshwater pearl is a reminder to remain centred, respond with clarity and bring grace to everyday relationships.", intention: "I choose calm presence in every relationship.", cross: ["sacred-notes-discovery", "camphor-ritual-duo"], bundle: "the-everyday-sacred-set" },
    {
      slug: "rose-quartz-rhodonite-bracelet",
      name: "Rose Quartz & Rhodonite Bracelet",
      sku: "SB-RQ-RH",
      tag: "Love. Heal. Harmonise.",
      desc: "A beautiful combination of Rose Quartz and Rhodonite. This bracelet brings together unconditional love, emotional healing and inner balance. It is a reminder to be kinder to yourself.",
      intention: "I choose love, healing and harmony in all my relationships.",
      cross: ["sacred-notes-discovery", "pure-ritual-single"],
      bundle: "the-personal-ritual-pair",
      image: "/Products/Product mala 1.png",
    },
  ].map((b, i) => ({
    ...base, slug: b.slug, name: b.name, category: "sacred-beads", price: 1101, mode: "none", sortOrder: 10 + i, format: "Bracelet",
    variants: variants("none", { default: b.sku }),
    tagline: b.tag, description: b.desc, intention: b.intention, copyPending: false,
    pack: "One bracelet; 10 mm beads.", packQuantity: "One bracelet; 10 mm beads",
    contents: [{ label: "Bead size", value: "10 mm" }, { label: "Cord", value: "Flexible elastic / stretch cord" }],
    fitNote: "Strung on a flexible stretch cord for convenient wear.",
    image: b.image || IMG.bracelet,
    related: { upsell: "", upsellAlt: "", crossSell: b.cross, bundle: b.bundle, upsellBundle: "the-dual-intention" },
    approvalNotes: b.sku === "SB-RQ-RH" ? "Combined mixed-stone bracelet per master (one listing, one SKU SB-RQ-RH). Do not split into standalone RQ/RH pages." : "",
  })),
];

// ── 30 bundles (Section 6.1–6.6) — prices are COMPUTED from components, never stored ──
const B = { bracelet: true };
const F = (product) => ({ product, via: "fragrance" });
const C = (product = "camphor-ritual-duo") => ({ product, via: "camphor" });
const P = (product) => ({ product, via: "pair" });
const X = (product, variant) => ({ product, via: "fixed", variant });
const DISC = "sacred-notes-discovery", PRS = "pure-ritual-single", EMB = "sacred-ember", P27 = "pure-ritual-27";
const SAM = X("sacred-sambrani-offering-cups", "guggal");
const G1 = "Bracelet collection", G2 = "Incense & ritual collection", G3 = "Bracelet + incense", G4 = "Bracelet + cones / multi-format",
  G5 = "Bracelet + Sambrani / Camphor", G6 = "Premium multi-category collection";

// [no, slug, name, group, components, selection-logic text (from the document), priority(6.8), homeModule]
const B_ROWS = [
  [1, "the-dual-intention", "The Dual Intention", G1, [B, B], "Any 2 different bracelets. Select 2 different bracelet SKUs.", 6, ""],
  [2, "the-triple-intention", "The Triple Intention", G1, [B, B, B], "Any 3 different bracelets. Select 3 different bracelet SKUs.", 0, ""],
  [3, "the-complete-bead-collection", "The Complete Bead Collection", G1, ["tiger-eye-bracelet", "evil-eye-bracelet", "dhan-yog-bracelet", "freshwater-pearl-bracelet", "rose-quartz-rhodonite-bracelet"].map((s) => X(s, "default")), "All 5 bracelets. Fixed collection.", 0, ""],
  [4, "the-classic-pair", "The Classic Pair", G2, [F(DISC), F(PRS)], "Sacred Notes Discovery + Pure Ritual Single. Select one fragrance; same fragrance in both formats.", 1, "curated"],
  [5, "the-fragrance-and-flame-pair", "The Fragrance & Flame Pair", G2, [F(DISC), F(EMB)], "Sacred Notes Discovery + Sacred Ember. Select one fragrance; same fragrance in both formats.", 0, ""],
  [6, "the-pure-ritual-pair", "The Pure Ritual Pair", G2, [F(PRS), F(EMB)], "Pure Ritual Single + Sacred Ember. Select one fragrance; same fragrance in both formats.", 0, ""],
  [7, "the-three-format-discovery", "The Three-Format Discovery", G2, [F(DISC), F(PRS), F(EMB)], "Sacred Notes Discovery + Pure Ritual Single + Sacred Ember. Select one fragrance once; apply to all three formats.", 2, "curated"],
  [8, "the-sacred-smoke-pair", "The Sacred Smoke Pair", G2, [SAM, C()], "Guggal Sambrani Cups + Camphor Ritual Duo. Sambrani fixed to Guggal; select one Camphor fragrance. Both Camphor tablets match.", 3, "curated"],
  [9, "the-complete-fragrance-ritual", "The Complete Fragrance Ritual", G2, [F(DISC), F(PRS), F(EMB), SAM], "Sacred Notes Discovery + Pure Ritual Single + Sacred Ember + Guggal Sambrani Cups. Same chosen fragrance across the three incense formats; Sambrani fixed to Guggal.", 4, "complete"],
  [10, "the-complete-home-ritual-set", "The Complete Home Ritual Set", G2, [F(DISC), F(PRS), F(EMB), SAM, C()], "Complete Fragrance Ritual + Camphor Ritual Duo. Select Camphor fragrance independently; both Camphor tablets match.", 8, "complete"],
  [11, "the-pure-ritual-fragrance-pair", "The Pure Ritual Fragrance Pair", G2, [F(P27), F(DISC)], "Pure Ritual 27 + Sacred Notes Discovery. Select one fragrance; same fragrance in both products.", 0, ""],
  [12, "the-pure-ritual-27-and-ember-pair", "The Pure Ritual 27 & Ember Pair", G2, [F(P27), F(EMB)], "Pure Ritual 27 + Sacred Ember. Select one fragrance; same fragrance in both formats.", 0, ""],
  [13, "the-extended-three-format-ritual", "The Extended Three-Format Ritual", G2, [F(DISC), F(P27), F(EMB)], "Sacred Notes Discovery + Pure Ritual 27 + Sacred Ember. Select one fragrance once; same fragrance across all three formats.", 0, ""],
  [14, "the-personal-ritual-pair", "The Personal Ritual Pair", G3, [B, F(DISC)], "Any 1 bracelet + Sacred Notes Discovery. Select 1 bracelet and 1 fragrance.", 5, ""],
  [15, "the-sacred-living-pair", "The Sacred Living Pair", G3, [B, F(PRS)], "Any 1 bracelet + Pure Ritual Single. Select 1 bracelet and 1 fragrance.", 0, ""],
  [16, "the-fragrance-and-intention-set", "The Fragrance & Intention Set", G3, [B, P("sacred-notes-duo")], "Any 1 bracelet + Sacred Notes Duo. Select 1 bracelet and 1 fragrance pair.", 0, ""],
  [17, "the-inner-stillness-set", "The Inner Stillness Set", G3, [B, P("pure-ritual-twin")], "Any 1 bracelet + Pure Ritual Twin. Select 1 bracelet and 1 fragrance pair.", 0, ""],
  [18, "the-threefold-intention-set", "The Threefold Intention Set", G3, [B, X("sacred-notes-triveni", "all")], "Any 1 bracelet + Sacred Notes Triveni. Select 1 bracelet; Triveni contains all three fragrances.", 0, ""],
  [19, "the-pure-ritual-27-intention-set", "The Pure Ritual 27 Intention Set", G3, [B, F(P27)], "Any 1 bracelet + Pure Ritual 27. Select 1 bracelet and 1 Pure Ritual 27 fragrance.", 0, ""],
  [20, "the-sacred-ember-pair", "The Sacred Ember Pair", G4, [B, F(EMB)], "Any 1 bracelet + Sacred Ember. Select 1 bracelet and 1 cone fragrance.", 0, ""],
  [21, "the-intention-and-flame-set", "The Intention & Flame Set", G4, [B, F(EMB), F(DISC)], "Any 1 bracelet + Sacred Ember + Sacred Notes Discovery. Same fragrance across both incense formats.", 0, ""],
  [22, "the-complete-ember-collection", "The Complete Ember Collection", G4, [B, F(EMB), F(PRS)], "Any 1 bracelet + Sacred Ember + Pure Ritual Single. Same fragrance across both incense formats.", 0, ""],
  [23, "the-sacred-offering-set", "The Sacred Offering Set", G5, [B, SAM], "Any 1 bracelet + Guggal Sambrani Cups. Select 1 bracelet; Sambrani fixed to Guggal.", 7, ""],
  [24, "the-auspicious-moments-set", "The Auspicious Moments Set", G5, [B, C()], "Any 1 bracelet + Camphor Ritual Duo. Select 1 bracelet and one Camphor fragrance.", 0, ""],
  [25, "the-sacred-home-collection", "The Sacred Home Collection", G5, [B, SAM, C()], "Any 1 bracelet + Guggal Sambrani Cups + Camphor Ritual Duo. Select 1 bracelet and one Camphor fragrance; Sambrani fixed to Guggal.", 0, ""],
  [26, "the-everyday-sacred-set", "The Everyday Sacred Set", G6, [B, F(DISC), C()], "Any 1 bracelet + Sacred Notes Discovery + Camphor Ritual Duo. Select bracelet, Notes fragrance and Camphor fragrance independently.", 0, ""],
  [27, "the-sacred-space-collection", "The Sacred Space Collection", G6, [B, F(PRS), F(EMB), SAM], "Any 1 bracelet + Pure Ritual Single + Sacred Ember + Guggal Sambrani Cups. Same fragrance for Pure Ritual and Ember; Sambrani fixed to Guggal.", 0, ""],
  [28, "the-intention-and-abundance-collection", "The Intention & Abundance Collection", G6, [X("dhan-yog-bracelet", "default"), X(DISC, "guggal"), SAM, C()], "Dhan Yog Bracelet + Sacred Notes Discovery + Guggal Sambrani Cups + Camphor Ritual Duo. Notes fixed to Guggal for this bundle; Sambrani fixed to Guggal; select Camphor fragrance.", 0, ""],
  [29, "the-protection-and-peace-collection", "The Protection & Peace Collection", G6, [X("evil-eye-bracelet", "default"), X(PRS, "guggal"), SAM, C()], "Evil Eye Bracelet + Pure Ritual Single + Guggal Sambrani Cups + Camphor Ritual Duo. Pure Ritual fixed to Guggal; Sambrani fixed to Guggal; select Camphor fragrance.", 0, ""],
  [30, "the-complete-ritual-and-intention-set", "The Complete Ritual & Intention Set", G6, [B, F(DISC), F(PRS), F(EMB), SAM, C()], "Any 1 bracelet + Sacred Notes Discovery + Pure Ritual Single + Sacred Ember + Guggal Sambrani Cups + Camphor Ritual Duo. Same fragrance across Notes, Pure Ritual and Ember; Sambrani fixed to Guggal; select Camphor independently.", 0, ""],
];

// Document prices (Section 6.1–6.6) — used ONLY by tests/sync to prove computed price == document price
export const DOCUMENT_BUNDLE_PRICES = {
  "the-dual-intention": 2202, "the-triple-intention": 3303, "the-complete-bead-collection": 5505, "the-classic-pair": 602,
  "the-fragrance-and-flame-pair": 652, "the-pure-ritual-pair": 752, "the-three-format-discovery": 1003, "the-sacred-smoke-pair": 852,
  "the-complete-fragrance-ritual": 1504, "the-complete-home-ritual-set": 1855, "the-pure-ritual-fragrance-pair": 752,
  "the-pure-ritual-27-and-ember-pair": 902, "the-extended-three-format-ritual": 1153, "the-personal-ritual-pair": 1352,
  "the-sacred-living-pair": 1452, "the-fragrance-and-intention-set": 1602, "the-inner-stillness-set": 1802, "the-threefold-intention-set": 1602,
  "the-pure-ritual-27-intention-set": 1602, "the-sacred-ember-pair": 1502, "the-intention-and-flame-set": 1753, "the-complete-ember-collection": 1853,
  "the-sacred-offering-set": 1602, "the-auspicious-moments-set": 1452, "the-sacred-home-collection": 1953, "the-everyday-sacred-set": 1703,
  "the-sacred-space-collection": 2354, "the-intention-and-abundance-collection": 2204, "the-protection-and-peace-collection": 2304,
  "the-complete-ritual-and-intention-set": 2956,
};

export const SEED_BUNDLES = B_ROWS.map(([no, slug, name, group, components, description, priority, homeModule]) => ({
  slug, name, group, components, description, tagline: "", sortOrder: no,
  status: "active", featured: priority > 0, launchPriority: priority > 0 ? priority : null, homeModule, approvalNotes: "",
}));

export { FRAGRANCES, CORE_FRAGRANCES, CAMPHOR_FRAGRANCES };
