// Fixed business rules from the Master Catalogue (PDF/Word). Not editable from Admin.

export const SHIPPING = { fee: 50, freeAbove: 501 }; // ₹50 below ₹501; free at ₹501+
export const MAX_LINE_QTY = 20; // per cart line; real limit is also capped by available stock

// "Core incense fragrances: exactly three" — descriptions are the PDF's PROPOSED copy (sample approval pending)
export const FRAGRANCES = {
  guggal: {
    id: "guggal", label: "Guggal", short: "Warm. Earthy. Traditional.",
    character: "Warm, resinous, earthy, subtly balsamic and gently smoky",
    description:
      "A deep, resinous fragrance with earthy warmth and a distinctive traditional character. Guggal brings a rich, familiar aromatic presence to everyday rituals and moments of offering.",
  },
  oud: {
    id: "oud", label: "Oud", short: "Deep. Woody. Distinctive.",
    character: "Deep, woody, rich, resinous and gently smoky",
    description:
      "A rich, deep woody fragrance with a distinctive resinous character. Oud offers a pronounced and sophisticated aromatic profile for those who prefer depth and intensity in their ritual space.",
  },
  sandalwood: {
    id: "sandalwood", label: "Sandalwood", short: "Soft. Warm. Timeless.",
    character: "Smooth, creamy, soft woody, warm and gently sweet",
    description:
      "A smooth, warm woody fragrance with a soft, creamy character. Sandalwood offers a balanced and familiar aromatic experience for everyday moments of prayer, reflection and quiet presence.",
  },
};
export const CORE_FRAGRANCES = ["guggal", "oud", "sandalwood"];
export const CAMPHOR_FRAGRANCES = ["guggal", "sandalwood"]; // Oud camphor NOT confirmed
export const PAIRS = [
  ["guggal", "oud", "GO"],
  ["guggal", "sandalwood", "GS"],
  ["oud", "sandalwood", "OS"],
];
export const SKU_FRAG = { guggal: "GUG", oud: "OUD", sandalwood: "SAN" };
export const PAIR_KEYS = PAIRS.map(([a, b]) => `${a}-${b}`);

export const MODES = ["single", "pair", "all", "fixed", "camphor", "none"];
export const PRODUCT_STATUSES = ["active", "inactive", "archived"];
export const BUNDLE_STATUSES = ["active", "inactive", "archived"];
export const HOME_MODULES = ["", "curated", "complete"];
export const LOW_STOCK_DEFAULT = 5; // configurable in Admin (NOT a PDF value)

const label = (id) => FRAGRANCES[id].label;

/** The only variants a product of a given mode may expose (enforces the PDF fragrance matrix). */
export function allowedVariants(mode) {
  switch (mode) {
    case "single":
      return CORE_FRAGRANCES.map((f) => ({ key: f, label: label(f), fragrances: [f] }));
    case "pair":
      return PAIRS.map(([a, b]) => ({ key: `${a}-${b}`, label: `${label(a)} + ${label(b)}`, fragrances: [a, b] }));
    case "all":
      return [{ key: "all", label: "Guggal + Oud + Sandalwood", fragrances: [...CORE_FRAGRANCES] }];
    case "fixed": // Sambrani: Guggal only, never Oud/Sandalwood
      return [{ key: "guggal", label: "Guggal", fragrances: ["guggal"] }];
    case "camphor":
      return CAMPHOR_FRAGRANCES.map((f) => ({ key: f, label: label(f), fragrances: [f] }));
    case "none":
      return [{ key: "default", label: "One bracelet", fragrances: [] }];
    default:
      return [];
  }
}

// Items still awaiting client approval (shown to admins; nothing here is published as fact)
export const PENDING = [
  "Sacred Notes Triveni: fragrance split of the 45 sticks (total shown only).",
  "Pure Ritual 27: confirm the pack really contains 27 units.",
  "Camphor: Oud camphor not offered until confirmed; revalidate cost for the 44 g pack.",
  "Rose Quartz & Rhodonite: final gemstone photography pending (currently using interim packshot); mixed-stone SKU SB-RQ-RH is live as one listing.",
  "Verified net weights for all formats except Discovery (21 g) and Camphor (44 g).",
  "Fragrance descriptions: approve against final samples.",
  "Product-specific usage, safety and storage instructions.",
  "Bracelet wrist-size range, care instructions and gemstone authenticity documents.",
  "CA-approved HSN / GST mapping — tax and invoicing config must not go live before this.",
  "Shipping threshold basis (before/after discounts, ex-tax or subtotal); dispatch SLA; returns/refund policy.",
  "Barcodes / GTINs — leave blank until issued.",
  "Final product photography (current images are placeholders).",
  "Low-stock threshold is an operational setting, not a PDF value — set it in Inventory → Settings.",
];
