// Customer-facing copy that is derived ONLY from facts in the master playbook.
// Items awaiting client approval are rendered with these neutral placeholders (never invented text).

export const PENDING_USE_SAFETY =
  "Product-specific usage, safety and storage instructions are being finalised and will be published here once approved.";
export const PENDING_RETURNS =
  "Our returns, refund and damaged-product policy will be published here once finalised.";
export const PENDING_STORY = "The story for this bracelet is being finalised.";

export const FOOTNOTE_PRICE = "Inclusive of applicable GST.";

// Product-specific FAQs (Section 10.1) — answers restate catalogue facts only.
export function faqsFor(p, catalog) {
  const ship = catalog.shipping;
  const out = [];
  const f = (q, a) => out.push({ q, a });

  switch (p.mode) {
    case "single":
      f("Which fragrances are available?", "Guggal, Oud and Sandalwood. Each pack contains one selected fragrance.");
      break;
    case "pair":
      f("Can I choose two fragrances?", "Yes — choose one of the listed pairs: Guggal + Oud, Guggal + Sandalwood or Oud + Sandalwood. You receive two packs of 21, one of each selected fragrance.");
      break;
    case "all":
      f("Does it contain all three fragrances?", "Yes — 45 sticks in total across Guggal, Oud and Sandalwood. The exact fragrance split will be shared once confirmed.");
      break;
    case "fixed":
      f("Which fragrance is available?", "Guggal only.");
      break;
    case "camphor":
      f("Are the tablets mixed fragrances?", "No. Both tablets in one pack are the same selected fragrance. Guggal and Sandalwood are currently available.");
      f("How many tablets are included?", "Two tablets of 22 g each — 44 g in total.");
      break;
    default:
      break;
  }
  if (p.slug === "pure-ritual-27") f("Does one pack contain all three fragrances?", "No. Each 27-count pack contains one selected fragrance.");
  if (p.mode === "none") {
    f("What is the bead size?", "10 mm.");
    f("Is the bracelet adjustable?", "It is strung on a flexible elastic stretch cord for convenient wear. A numerical fit range will be added once measurements are available.");
  }
  if (p.pack) f("What is included?", p.pack);
  f("When is shipping free?", `Cart value ₹${ship.freeAbove} and above. Below that, shipping is ₹${ship.fee}.`);
  (p.faqs || []).forEach((x) => f(x.q, x.a)); // product-specific FAQs managed in Admin
  return out;
}
