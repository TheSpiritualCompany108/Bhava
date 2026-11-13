import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Products.module.css";
import shop from "../shop/Shop.module.css";
import { useCart } from "../context/CartContext";
import useCatalog from "../hooks/useCatalog";
import { useHomepageSectionState, resolveHomepageImageUrl } from "../hooks/useHomepageSection";
import { ProductCard, BundleCard } from "../shop/Cards";
import { shopTabs, productHasFragrance, bundleHasFragrance } from "../shop/shopUtils";

const FRAGRANCE_FILTERS = ["guggal", "oud", "sandalwood"];

export default function Products() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { catalog, loading, error, reload } = useCatalog();

  const tabs = shopTabs(catalog);
  const tab = tabs.some((t) => t.id === params.get("category")) ? params.get("category") : "all";
  const [showMore, setShowMore] = useState(false);
  const fragrance = FRAGRANCE_FILTERS.includes(params.get("fragrance")) ? params.get("fragrance") : "";
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [toast, setToast] = useState(null);

  const [bannerData, bannerLoaded] = useHomepageSectionState("productsBanner");
  const rawBanner = bannerData?.bannerImage || bannerData?.image || bannerData?.items?.banner?.image;
  const bannerImgSrc = rawBanner ? resolveHomepageImageUrl(rawBanner) : "/Slide 02.png";
  const kicker = bannerData?.kicker || "The Spiritual Company";
  const title = bannerData?.title || "Shop Bhava";
  const subtitle =
    bannerData?.subtitle ||
    "Sacred Beads, incense, Sambrani and camphor — chosen with care for a more considered daily ritual.";

  const setParam = (k, v) => {
    const next = new URLSearchParams(params);
    if (v && v !== "all") next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const q = searchQuery.trim().toLowerCase();
  const q0 = q;

  const items = useMemo(() => {
    if (!catalog) return { products: [], bundles: [] };
    let products = catalog.products.map((p, i) => ({ p, i }));
    let bundles = catalog.bundles.map((b, i) => ({ b, i }));

    if (tab === "curated-collections") products = [];
    else if (tab !== "all") products = products.filter(({ p }) => p.category === tab);
    if (tab !== "all" && tab !== "curated-collections") bundles = [];
    // PDF §6.8: feature the strongest combinations first; the rest are shown only on request / contextually
    if ((tab === "curated-collections" || tab === "all") && !showMore && !q0) bundles = bundles.filter(({ b }) => b.featured);

    if (fragrance) {
      products = products.filter(({ p }) => productHasFragrance(catalog, p, fragrance));
      bundles = bundles.filter(({ b }) => bundleHasFragrance(catalog, b, fragrance));
    }
    if (q) {
      products = products.filter(({ p }) => `${p.name} ${p.tagline} ${p.description} ${p.pack}`.toLowerCase().includes(q));
      bundles = bundles.filter(({ b }) => `${b.name} ${b.tagline} ${b.description}`.toLowerCase().includes(q));
    }

    const cmp = {
      "price-low": (a, b) => a.price - b.price,
      "price-high": (a, b) => b.price - a.price,
      name: (a, b) => a.name.localeCompare(b.name),
    }[sortBy];
    const sortedP = products.map((x) => x.p);
    const sortedB = bundles.map((x) => x.b);
    if (cmp) {
      sortedP.sort(cmp);
      sortedB.sort(cmp);
    } else {
      sortedB.sort((a, b) => (a.featured === b.featured ? (a.featured ? a.priority - b.priority : a.sortOrder - b.sortOrder) : a.featured ? -1 : 1));
    }
    return { products: sortedP, bundles: sortedB };
  }, [catalog, tab, fragrance, q, q0, sortBy, showMore]);

  const total = items.products.length + items.bundles.length;

  return (
    <div className={styles.page}>
      {toast && (
        <div className={styles.toast} role="status">
          <span>✓ Added “{toast}” to your cart</span>
          <button className={styles.toastLink} onClick={() => navigate("/cart")}>
            View Cart ({itemCount}) →
          </button>
        </div>
      )}

      <section className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          <img
            src={bannerImgSrc}
            alt="Bhava — shop sacred beads, incense, Sambrani and camphor"
            className={styles.bannerImg}
            fetchPriority="high"
            style={{ visibility: bannerLoaded ? "visible" : "hidden" }}
          />
        </div>
      </section>

      <section className={styles.collectionHeaderSection}>
        <div className={styles.collectionHeaderContent}>
          <span className={styles.collectionKicker}>{kicker}</span>
          <h1 className={styles.collectionTitle}>{title}</h1>
          <p className={styles.collectionSub}>{subtitle}</p>

          <div className={styles.searchBarWrapper}>
            <span className={styles.searchIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search incense, bracelets, Sambrani, camphor…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
              aria-label="Search products"
            />
            {searchQuery && (
              <button className={styles.searchClearBtn} onClick={() => setSearchQuery("")} aria-label="Clear search">✕</button>
            )}
          </div>
        </div>
      </section>

      <section className={styles.controlsBar}>
        <div className={styles.categoryPills} role="tablist" aria-label="Shop categories">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setParam("category", t.id)}
              className={`${styles.pillBtn} ${tab === t.id ? styles.pillActive : ""}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className={styles.metaRow}>
          <div className={shop.chips} role="group" aria-label="Filter by fragrance">
            <button className={`${shop.chip} ${!fragrance ? shop.chipOn : ""}`} onClick={() => setParam("fragrance", "")}>
              All fragrances
            </button>
            {FRAGRANCE_FILTERS.map((f) => (
              <button
                key={f}
                className={`${shop.chip} ${fragrance === f ? shop.chipOn : ""}`}
                onClick={() => setParam("fragrance", fragrance === f ? "" : f)}
                aria-pressed={fragrance === f}
              >
                {catalog?.fragrances[f]?.label || f}
              </button>
            ))}
          </div>

          <div className={styles.sortContainer}>
            <label htmlFor="sortSelect" className={styles.sortLabel}>Sort By:</label>
            <select id="sortSelect" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={styles.sortSelect}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
        {catalog && (
          <span className={styles.resultCount} style={{ display: "block", marginTop: 10 }}>
            Showing <strong>{total}</strong> {total === 1 ? "item" : "items"}
            {fragrance && ` in ${catalog.fragrances[fragrance].label}`}
          </span>
        )}
      </section>

      <main className={styles.container}>
        {loading && <div className={shop.loadingBox}>Loading the collection…</div>}

        {error && !loading && (
          <div className={shop.loadingBox}>
            <p>{error}</p>
            <button className={shop.btn} onClick={reload}>Try again</button>
          </div>
        )}

        {catalog && total === 0 && (
          <div className={shop.loadingBox}>
            <h3 style={{ fontFamily: "'Canela', serif", fontSize: 24, color: "#4A0B1D", marginBottom: 8 }}>Nothing matches yet</h3>
            <p>Try another category or fragrance.</p>
            <button
              className={shop.btn}
              onClick={() => {
                setSearchQuery("");
                setParams({}, { replace: true });
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        {catalog && items.products.length > 0 && (
          <div className={shop.grid}>
            {items.products.map((p) => (
              <ProductCard key={p.slug} product={p} catalog={catalog} onAdded={setToast} />
            ))}
          </div>
        )}

        {catalog && items.bundles.length > 0 && (
          <section aria-labelledby="collections-h" style={{ marginTop: items.products.length ? 56 : 0 }}>
            <div className={shop.head} style={{ marginBottom: 24 }}>
              <span className={shop.kicker}>Curated Collections</span>
              <h2 id="collections-h" className={shop.h2} style={{ fontSize: 30 }}>Complete the ritual</h2>
              <p className={shop.sub}>
                Each collection is priced at exactly the sum of its products — you always see exactly what is included.
              </p>
            </div>
            <div className={shop.grid3}>
              {items.bundles.map((b) => (
                <BundleCard key={b.slug} bundle={b} catalog={catalog} />
              ))}
            </div>
            {tab === "curated-collections" && !q && catalog.bundles.some((b) => !b.featured) && (
              <div className={shop.center}>
                <button className={`${shop.btn} ${shop.btnGhost}`} onClick={() => setShowMore((v) => !v)}>
                  {showMore ? "Show featured collections only" : "Show more collections"}
                </button>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
