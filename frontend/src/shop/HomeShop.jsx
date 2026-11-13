import React from "react";
import { Link } from "react-router-dom";
import s from "./Shop.module.css";
import useCatalog from "../hooks/useCatalog";
import { ProductCard, BundleCard } from "./Cards";
import { getProduct, shippingCopy, bundleInStock } from "./shopUtils";

// Homepage commerce modules, in the order set by the master playbook (Section 9.3):
// 2 Shop by format · 3 Discover the fragrances · 4 Start with a format · 5 Curated collections ·
// 6 Sacred Beads · 7 Complete the ritual · 8 Quality / product information.
// (1 Hero = HomeMain, 10 Footer = Layout. 9 Reviews is omitted until genuine verified reviews exist.)

const FORMATS = [
  { id: "sacred-beads", label: "Sacred Beads", note: "Six bracelets", img: "/Products/Sacred Beads Dhan Yog.jpg" },
  { id: "incense-sticks", label: "Incense Sticks", note: "Sacred Notes", img: "/Products/Format Incense Sticks.jpg", pos: "68% center" },
  { id: "bamboo-less-incense", label: "Bamboo-less Incense", note: "Pure Ritual", img: "/Products/Format Bamboo-less Incense.jpg", pos: "70% center" },
  { id: "incense-cones", label: "Incense Cones", note: "Sacred Ember", img: "/Products/Format Incense Cones.jpg", pos: "70% center" },
  { id: "sambrani-camphor", label: "Sambrani & Camphor", note: "Offering cups & ritual camphor", img: "/Products/Format Sambrani.jpg", pos: "78% center" },
];

function Head({ kicker, title, sub }) {
  return (
    <div className={s.head}>
      <span className={s.kicker}>{kicker}</span>
      <h2 className={s.h2}>{title}</h2>
      {sub && <p className={s.sub}>{sub}</p>}
    </div>
  );
}

export default function HomeShop() {
  const { catalog } = useCatalog();
  if (!catalog) return null; // never block the rest of the homepage

  const starters = [
    "sacred-notes-discovery",
    "pure-ritual-single",
    "sacred-ember",
    "sacred-sambrani-offering-cups",
  ].map((x) => getProduct(catalog, x)).filter(Boolean);
  const byModule = (m) => catalog.bundles
    .filter((b) => b.homeModule === m)
    .sort((a, b) => {
      const aOk = bundleInStock(catalog, a.slug) ? 0 : 1;
      const bOk = bundleInStock(catalog, b.slug) ? 0 : 1;
      if (aOk !== bOk) return aOk - bOk;
      return (a.priority || 99) - (b.priority || 99);
    });
  const collections = byModule("curated").filter((b) => bundleInStock(catalog, b.slug));
  const bracelets = catalog.products.filter((p) => p.category === "sacred-beads");
  const complete = byModule("complete").filter((b) => bundleInStock(catalog, b.slug));

  return (
    <>
      {/* 2 · Shop by format */}
      <section className={`${s.sec} ${s.secAlt}`} aria-labelledby="hs-format">
        <div className={`${s.wrap} ${s.wrapWide}`}>
          <Head kicker="Shop by format" title="Find Your Ritual" />
          <div className={s.formatGrid} id="hs-format">
            {FORMATS.map((f) => (
              <Link key={f.id} to={`/products?category=${f.id}`} className={s.formatTile}>
                <img src={f.img} alt="" loading="lazy" style={f.pos ? { objectPosition: f.pos } : undefined} />
                <span className={s.formatLabel}>{f.label}<small>{f.note}</small></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3 · Discover the fragrances */}
      <section className={s.sec} aria-labelledby="hs-frag">
        <div className={s.wrap}>
          <Head kicker="Discover the fragrances" title="Guggal. Oud. Sandalwood." sub="Three fragrances across our incense formats. Choose the one that feels right for your space." />
          <div className={s.fragGrid} id="hs-frag">
            {Object.values(catalog.fragrances).map((f) => (
              <Link key={f.id} to={`/products?fragrance=${f.id}`} className={s.fragCard}>
                <h3 className={s.fragName}>{f.label}</h3>
                <span className={s.fragShort}>{f.short}</span>
                <p className={s.fragText}>{f.description}</p>
                <span className={s.fragGo}>Ritual {f.label} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · Start with a format */}
      <section className={`${s.sec} ${s.secWhite}`} aria-labelledby="hs-start" hidden={!starters.length}>
        <div className={`${s.wrap} ${s.wrapWide}`}>
          <Head kicker="Start with a format" title="A Sacred Place To Begin" sub="Four formats to begin your ritual — incense, cones and Sambrani." />
          <div className={`${s.grid4} ${s.gridCards}`} id="hs-start">
            {starters.map((p) => (
              <ProductCard key={p.slug} product={p} catalog={catalog} dense />
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Curated collections */}
      <section className={`${s.sec} ${s.secAlt}`} aria-labelledby="hs-coll" hidden={!collections.length}>
        <div className={s.wrap}>
          <Head kicker="Curated Collections" title="Thoughtfully Paired" sub="Each collection costs exactly the sum of what is inside — nothing hidden, nothing crossed out." />
          <div className={s.grid3} id="hs-coll">
            {collections.map((b) => <BundleCard key={b.slug} bundle={b} catalog={catalog} />)}
          </div>
          <div className={s.center}>
            <Link to="/products?category=curated-collections" className={`${s.btn} ${s.btnGhost}`}>View all collections</Link>
          </div>
        </div>
      </section>

      {/* 6 · Sacred Beads */}
      <section className={s.sec} aria-labelledby="hs-beads" hidden={!bracelets.length}>
        <div className={s.wrap}>
          <Head kicker="Sacred Beads" title="Six Bracelets. Six Intentions." sub="10 mm beads strung on a flexible stretch cord for convenient wear." />
          <div className={`${s.grid3} ${s.gridCards}`} id="hs-beads">
            {bracelets.map((p) => (
              <ProductCard key={p.slug} product={p} catalog={catalog} dense />
            ))}
          </div>
        </div>
      </section>

      {/* 7 · Complete the ritual */}
      <section className={`${s.sec} ${s.secAlt}`} aria-labelledby="hs-complete" hidden={!complete.length}>
        <div className={s.wrap}>
          <Head kicker="Complete The Ritual" title="A Fuller Home Ritual" sub="Incense in one fragrance, a traditional Guggal offering and — in the larger set — ritual camphor." />
          <div className={s.grid3} id="hs-complete" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
            {complete.map((b) => <BundleCard key={b.slug} bundle={b} catalog={catalog} />)}
          </div>
        </div>
      </section>

      {/* 8 · Quality / product information (facts from the catalogue only) */}
      <section className={`${s.sec} ${s.secWhite}`} aria-labelledby="hs-trust">
        <div className={s.wrap}>
          <Head kicker="Product Information" title="Clear, From The Start" />
          <div className={s.trustRow} id="hs-trust">
            <div className={s.trustCell}><h3>Sacred Contents</h3><p>Every offering is named with care — so your ritual begins with clarity, devotion, and nothing left unknown.</p></div>
            <div className={s.trustCell}><h3>Your Fragrance, Your Choice</h3><p>Guggal, Oud or Sandalwood — one fragrance per pack, or a pair where listed.</p></div>
            <div className={s.trustCell}><h3>Simple Pricing</h3><p>Prices are inclusive of applicable GST. No coupons or crossed-out prices.</p></div>
            <div className={s.trustCell}><h3>Shipping</h3><p>{shippingCopy(catalog.shipping)}.</p></div>
          </div>
        </div>
      </section>
    </>
  );
}
