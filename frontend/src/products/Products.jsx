import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Products.module.css";
import { useCart } from "../context/CartContext";
import RitualTierCards, {
  homeRitualTiers,
  premiumRitualTiers,
} from "../components/RitualTierCards";
import useHomepageSection, { resolveHomepageImageUrl } from "../hooks/useHomepageSection";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Fallback products if API is unreachable
const FALLBACK_PRODUCTS = [
  {
    _id: "fb-1",
    title: "Vedic Incense Series",
    subtitle: "Sacred Fragrance",
    badgeText: "₹1,299",
    summary:
      "Hand-rolled using 16th-century temple recipes, infused with Himalayan herbs and sacred mantras.",
    imageUrl: "/Products/Home Page Incense.png",
    meta: { productType: "Sacred Incense" },
  },
  {
    _id: "fb-2",
    title: "Sacred Sambrani Cups",
    subtitle: "Natural Resin",
    badgeText: "₹899",
    summary:
      "Purified resin sambrani with aromatic woods, perfect for daily pujas and sacred rituals.",
    imageUrl: "/Products/Home Page Sambrani.png",
    meta: { productType: "Sacred Resins" },
  },
  {
    _id: "fb-3",
    title: "Rudraksha Japa Mala",
    subtitle: "108 Authentic Beads",
    badgeText: "₹749",
    summary:
      "Traditional prayer beads for mantra sadhana and deepening daily meditation practice.",
    imageUrl: "/Products/Home Page mala.png",
    meta: { productType: "Japa Mala" },
  },
  {
    _id: "fb-4",
    title: "Pooja Brass Thali Set",
    subtitle: "Handcrafted Pure Brass",
    badgeText: "₹1,599",
    summary:
      "Traditional brass thali set for temple worship and daily sacred home ceremonies.",
    imageUrl: "/Products/Home Page Brass Thali.png",
    meta: { productType: "Pooja Thali" },
  },
  {
    _id: "fb-5",
    title: "Sacred Anointing Oil",
    subtitle: "Ayurvedic Herbal Blend",
    badgeText: "₹2,499",
    summary:
      "Ayurvedic blend of coconut and sacred herbs, traditionally used for temple abhishekam.",
    imageUrl: "/Products/Home Page Oil.png",
    meta: { productType: "Ritual Oil" },
  },
  {
    _id: "fb-6",
    title: "Platinum Devotion Box",
    subtitle: "Curated Temple Offerings",
    badgeText: "₹4,999",
    summary:
      "Limited edition curated selection—offerings from 12 sacred temples across India.",
    imageUrl: "/Products/Home Page Devotion Box.png",
    meta: { productType: "Ritual Box" },
  },
];

// Helper to resolve image URL
const resolveImageUrl = (url) => {
  if (!url) return "/Products/Home Page Incense.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

// Helper to parse numeric price
const parseNumericPrice = (str) => {
  if (!str) return 0;
  return parseInt(String(str).replace(/[^\d]/g, ""), 10) || 0;
};

// Helper to detect if product belongs to bracelets
const isBraceletProduct = (p) => {
  const typeStr = (p.meta?.productType || p.meta?.type || p.subtitle || p.category || "").toUpperCase();
  const titleStr = (p.title || "").toUpperCase();
  const tagsStr = (p.meta?.tags || "").toUpperCase();
  const summaryStr = (p.summary || "").toUpperCase();
  return (
    typeStr.includes("BRACELET") ||
    titleStr.includes("BRACELET") ||
    tagsStr.includes("BRACELET") ||
    summaryStr.includes("BRACELET") ||
    typeStr.includes("QUARTZ") ||
    titleStr.includes("QUARTZ")
  );
};

// Curated category filter tags - Bracelets elevated right after All Offerings
const CATEGORIES = [
  { id: "ALL", label: "All Offerings" },
  { id: "BRACELETS", label: "Bracelets", match: ["BRACELET", "QUARTZ", "PEARL"] },
  { id: "MALA", label: "Japa Malas", match: ["MALA", "BEAD", "RUDRAKSHA", "TULSI"] },
  { id: "INCENSE", label: "Incense & Sambrani", match: ["INCENSE", "SAMBRANI", "DHOOP", "RESIN"] },
  { id: "PUJA", label: "Puja & Thali", match: ["THALI", "POOJA", "PUJA", "AARTI", "BRASS", "VESSEL"] },
  { id: "OIL", label: "Sacred Oils", match: ["OIL", "ABHISHEKAM", "ANOINTING"] },
  { id: "BOXES", label: "Kits & Boxes", match: ["BOX", "KIT", "SUBSCRIPTION", "SYSTEM"] },
];

export default function Products() {
  const { addToCart, itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [addedIds, setAddedIds] = useState({});

  // Dynamic banner & headings loaded from backend
  const bannerData = useHomepageSection("productsBanner");
  const bannerImgSrc =
    bannerData?.bannerImage || bannerData?.image || bannerData?.items?.banner?.image
      ? resolveHomepageImageUrl(bannerData.bannerImage || bannerData.image || bannerData.items?.banner?.image)
      : "/Slide 02.png";

  const kicker = bannerData?.kicker || "Sacred Vessels & Offerings";
  const title = bannerData?.title || "Our Sacred Collections";
  const subtitle =
    bannerData?.subtitle ||
    "Authentic prayer malas, temple-grade incense, consecrated oils, and ritual thalis handcrafted to ground and elevate your daily devotion.";

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/tiles?category=Products`);
        const json = await res.json();
        if (res.ok && json.success && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        } else {
          setProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Handle Add To Cart with instant feedback
  const handleAddToCart = (item, qty = 1, e) => {
    if (e) e.stopPropagation();

    addToCart({
      productId: item._id || item.handle || item.title,
      title: item.title,
      price: item.badgeText || "₹999",
      image: resolveImageUrl(item.imageUrl) || "",
      category: item.meta?.productType || item.category || "Products",
      quantity: qty,
    });

    // Button visual state
    setAddedIds((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [item._id]: false }));
    }, 2000);

    // Toast feedback
    setToastMessage(`✓ Added "${item.title}" to your sacred cart`);
    setTimeout(() => setToastMessage(null), 3500);

    // Close modal if open
    if (selectedProduct) setSelectedProduct(null);
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category Filter
    if (activeCategory !== "ALL") {
      const activeObj = CATEGORIES.find((c) => c.id === activeCategory);
      if (activeObj && activeObj.match) {
        result = result.filter((p) => {
          const typeStr = (p.meta?.productType || p.meta?.type || p.subtitle || p.category || "").toUpperCase();
          const titleStr = (p.title || "").toUpperCase();
          return activeObj.match.some((keyword) => typeStr.includes(keyword) || titleStr.includes(keyword));
        });
      }
    }

    // Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const title = (p.title || "").toLowerCase();
        const subtitle = (p.subtitle || "").toLowerCase();
        const summary = (p.summary || "").toLowerCase();
        const desc = (p.fullDescription || "").toLowerCase();
        const type = (p.meta?.productType || "").toLowerCase();
        const tags = (p.meta?.tags || "").toLowerCase();
        return (
          title.includes(q) ||
          subtitle.includes(q) ||
          summary.includes(q) ||
          desc.includes(q) ||
          type.includes(q) ||
          tags.includes(q)
        );
      });
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => parseNumericPrice(a.badgeText) - parseNumericPrice(b.badgeText));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => parseNumericPrice(b.badgeText) - parseNumericPrice(a.badgeText));
    } else if (sortBy === "name") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (activeCategory === "ALL" && sortBy === "featured") {
      // In "All Offerings", bring Bracelets to the top
      result.sort((a, b) => {
        const aIsBr = isBraceletProduct(a) ? 1 : 0;
        const bIsBr = isBraceletProduct(b) ? 1 : 0;
        return bIsBr - aIsBr;
      });
    }

    return result;
  }, [products, activeCategory, searchQuery, sortBy]);

  // Compute category count map for pills
  const categoryCounts = useMemo(() => {
    const counts = { ALL: products.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id === "ALL") return;
      const cnt = products.filter((p) => {
        const typeStr = (p.meta?.productType || p.meta?.type || p.subtitle || p.category || "").toUpperCase();
        const titleStr = (p.title || "").toUpperCase();
        return cat.match.some((keyword) => typeStr.includes(keyword) || titleStr.includes(keyword));
      }).length;
      counts[cat.id] = cnt;
    });
    return counts;
  }, [products]);

  // If all products in a category are drafted (count === 0), the category is automatically hidden from the frontend
  const visibleCategories = useMemo(() => {
    return CATEGORIES.filter((cat) => {
      if (cat.id === "ALL") return true;
      return (categoryCounts[cat.id] || 0) > 0;
    });
  }, [categoryCounts]);

  // If the currently selected category becomes drafted / empty, auto-reset to "ALL"
  useEffect(() => {
    if (activeCategory !== "ALL" && (categoryCounts[activeCategory] || 0) === 0) {
      setActiveCategory("ALL");
    }
  }, [categoryCounts, activeCategory]);

  return (
    <div className={styles.page}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span>{toastMessage}</span>
          <button
            className={styles.toastLink}
            onClick={() => navigate("/cart")}
          >
            View Cart ({itemCount}) →
          </button>
        </div>
      )}

      {/* Top Website Banner */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          <img
            src={bannerImgSrc}
            alt="Bhava Sacred Collections Banner"
            className={styles.bannerImg}
          />
        </div>
      </section>

      {/* Headings & Search Outside the Box, Above Categories */}
      <section className={styles.collectionHeaderSection}>
        <div className={styles.collectionHeaderContent}>
          <span className={styles.collectionKicker}>{kicker}</span>
          <h1 className={styles.collectionTitle}>
            {title}
          </h1>
          <p className={styles.collectionSub}>
            {subtitle}
          </p>

          {/* Integrated Search Bar */}
          <div className={styles.searchBarWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search malas, incense, puja thalis, devotion boxes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                className={styles.searchClearBtn}
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className={styles.controlsBar}>
        {/* Category Pills — only shows categories with active products */}
        <div className={styles.categoryPills}>
          {visibleCategories.map((cat) => {
            const count = categoryCounts[cat.id] || 0;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`${styles.pillBtn} ${activeCategory === cat.id ? styles.pillActive : ""}`}
              >
                {cat.label}
                <span className={styles.pillBadge}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Results Meta & Sort */}
        <div className={styles.metaRow}>
          <span className={styles.resultCount}>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "sacred item" : "sacred offerings"}
            {searchQuery && ` for "${searchQuery}"`}
          </span>

          <div className={styles.sortContainer}>
            <label htmlFor="sortSelect" className={styles.sortLabel}>Sort By:</label>
            <select
              id="sortSelect"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="featured">Featured Offerings</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main className={styles.container}>
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#666", fontSize: 16 }}>
            Loading sacred offerings…
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 16, margin: "20px 0" }}>
            <h3 style={{ fontFamily: "'Canela', serif", fontSize: 24, color: "#4A0B1D", marginBottom: 8 }}>
              No sacred offerings found
            </h3>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>
              Try searching with a different term or choose another category filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory("ALL");
                setSearchQuery("");
              }}
              style={{
                background: "#E07B39",
                color: "#fff",
                border: "none",
                padding: "10px 22px",
                borderRadius: 999,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className={styles.grid}>
            {filteredProducts.map((item) => {
              const isAdded = addedIds[item._id];
              const displayCategory = item.meta?.productType || item.subtitle || "Sacred Item";
              const priceDisplay = item.badgeText || "₹999";
              const comparePrice = item.meta?.compareAtPrice ? `₹${item.meta.compareAtPrice}` : null;

              return (
                <div
                  key={item._id}
                  className={styles.productCard}
                  onClick={() => {
                    navigate(`/product/${item._id || item.handle}`);
                  }}
                >
                  {/* Image & Badge */}
                  <div className={styles.imageWrapper}>
                    <img
                      src={resolveImageUrl(item.imageUrl)}
                      alt={item.title}
                      className={styles.cardImg}
                      loading="lazy"
                    />
                    <span className={styles.cardBadge}>
                      {item.duration || "Handcrafted"}
                    </span>
                    <button
                      className={styles.quickViewBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(item);
                        setModalQty(1);
                      }}
                    >
                      Quick View 👁
                    </button>
                  </div>

                  {/* Body */}
                  <div className={styles.cardBody}>
                    <span className={styles.cardType}>{displayCategory}</span>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardExcerpt}>
                      {item.summary || item.subtitle || "Handcrafted with sacred Vedic intention."}
                    </p>

                    {/* Footer / Price & Add Button */}
                    <div className={styles.cardFooter}>
                      <div className={styles.priceWrapper}>
                        <span className={styles.priceText}>{priceDisplay}</span>
                        {comparePrice && (
                          <span className={styles.comparePrice}>{comparePrice}</span>
                        )}
                      </div>

                      <button
                        className={`${styles.addBtn} ${isAdded ? styles.addBtnAdded : ""}`}
                        onClick={(e) => handleAddToCart(item, 1, e)}
                        aria-label={`Add ${item.title} to cart`}
                      >
                        {isAdded ? "✓ Added!" : "Add to Cart +"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Quick View / Detail Modal */}
      {selectedProduct && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.modalClose}
              onClick={() => setSelectedProduct(null)}
              aria-label="Close details"
            >
              ✕
            </button>

            {/* Left Col: Image */}
            <div className={styles.modalImageCol}>
              <img
                src={resolveImageUrl(selectedProduct.imageUrl)}
                alt={selectedProduct.title}
                className={styles.modalMainImg}
              />
            </div>

            {/* Right Col: Details & Actions */}
            <div className={styles.modalDetailsCol}>
              <span className={styles.modalType}>
                {selectedProduct.meta?.productType || selectedProduct.subtitle || "Sacred Item"}
              </span>
              <h2 className={styles.modalTitle}>{selectedProduct.title}</h2>
              <div className={styles.modalPrice}>
                {selectedProduct.badgeText || "₹999"}
                {selectedProduct.meta?.compareAtPrice && (
                  <span style={{ fontSize: 16, color: "#888", textDecoration: "line-through", marginLeft: 10 }}>
                    ₹{selectedProduct.meta.compareAtPrice}
                  </span>
                )}
              </div>

              <div className={styles.modalDesc}>
                {selectedProduct.fullDescription || selectedProduct.summary || selectedProduct.subtitle}
              </div>

              <div className={styles.modalActions}>
                {/* Quantity Controls */}
                <div className={styles.qtyWrapper}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setModalQty((q) => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <span className={styles.qtyValue}>{modalQty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setModalQty((q) => q + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  className={styles.modalAddBtn}
                  onClick={() => handleAddToCart(selectedProduct, modalQty)}
                >
                  Add {modalQty} to Sacred Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Curated Ritual Systems (Clean bottom section) */}
      <section className={styles.curatedSystemsSection}>
        <div className={styles.curatedHeader}>
          <span className={styles.curatedKicker}>Looking For A Complete Practice?</span>
          <h2 className={styles.curatedTitle}>Curated Daily Ritual Systems</h2>
          <p className={styles.curatedSub}>
            Step into structured daily devotional rhythms with our all-in-one guided ritual systems and signature boxes.
          </p>
        </div>

        {/* Tier Cards */}
        <div>
          <RitualTierCards tiers={homeRitualTiers} />
        </div>

        <div style={{ marginTop: 40 }}>
          <h3 style={{ fontFamily: "'Canela', serif", fontSize: 24, color: "#4A0B1D", textAlign: "center", marginBottom: 24 }}>
            Signature &amp; Elevated Collections
          </h3>
          <RitualTierCards tiers={premiumRitualTiers} columns={2} />
        </div>
      </section>
    </div>
  );
}
