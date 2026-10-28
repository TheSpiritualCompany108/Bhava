import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import { useCart } from "../context/CartContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper to resolve image URL
const resolveImageUrl = (url) => {
  if (!url) return "/Products/Home Page Incense.png";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, itemCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [allProducts, setAllProducts] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState("ritual");
  const [toastMessage, setToastMessage] = useState(null);
  const [added, setAdded] = useState(false);
  const [failedImages, setFailedImages] = useState([]);

  // Reset failed images, index and load product data
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setActiveImageIndex(0);
    setFailedImages([]);
    setQty(1);

    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        // Fetch current product
        const res = await fetch(`${API_BASE}/api/tiles/${id}`);
        const json = await res.json();
        if (res.ok && json.success && json.data) {
          setProduct(json.data);
        } else {
          setError(json.message || "Product offering not found.");
        }

        // Fetch catalog for similar products
        const catRes = await fetch(`${API_BASE}/api/tiles?category=Products`);
        const catJson = await catRes.json();
        if (catRes.ok && catJson.success && Array.isArray(catJson.data)) {
          setAllProducts(catJson.data);
        }
      } catch (err) {
        console.error("Failed to load product detail:", err);
        setError("Network error while loading product.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleImageError = (imgUrl) => {
    if (!imgUrl) return;
    setFailedImages((prev) => (prev.includes(imgUrl) ? prev : [...prev, imgUrl]));
  };

  // Consolidate images
  const images = useMemo(() => {
    if (!product) return [];
    const list = [];
    if (product.imageUrl) list.push(product.imageUrl);
    if (product.meta?.additionalImages && Array.isArray(product.meta.additionalImages)) {
      product.meta.additionalImages.forEach((img) => {
        if (img && typeof img === "string" && !list.includes(img)) list.push(img);
      });
    }
    return list.length > 0 ? list : ["/Products/Home Page Incense.png"];
  }, [product]);

  // Valid non-broken images
  const validImages = useMemo(() => {
    const filtered = images.filter((img) => !failedImages.includes(img));
    return filtered.length > 0 ? filtered : images;
  }, [images, failedImages]);

  const safeActiveIndex = activeImageIndex < validImages.length ? activeImageIndex : 0;

  // Compute Similar Products
  const similarProducts = useMemo(() => {
    if (!product || allProducts.length === 0) return [];
    const currentId = String(product._id);
    const currentType = (product.meta?.productType || product.category || "").toUpperCase();
    const currentTitle = (product.title || "").toUpperCase();

    // Filter out current product
    const others = allProducts.filter((p) => String(p._id) !== currentId);

    // Score others by relevance
    const scored = others.map((p) => {
      let score = 0;
      const otherType = (p.meta?.productType || p.category || "").toUpperCase();
      const otherTitle = (p.title || "").toUpperCase();

      if (otherType && currentType && otherType === currentType) score += 5;
      if (otherTitle.includes(currentTitle) || currentTitle.includes(otherTitle)) score += 3;
      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 4).map((s) => s.product);
  }, [product, allProducts]);

  // Handle Add To Cart
  const handleAddToCart = (e) => {
    if (e) e.stopPropagation();
    if (!product) return;

    addToCart({
      productId: product._id || product.handle || product.title,
      title: product.title,
      price: product.badgeText || "₹999",
      image: resolveImageUrl(product.imageUrl || images[0] || ""),
      category: product.meta?.productType || product.category || "Products",
      quantity: qty,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    setToastMessage(`✓ Added ${qty} × "${product.title}" to your sacred cart`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle Buy Now (Add + Navigate to Cart)
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2 style={{ fontFamily: "'Canela', serif", color: "#4A0B1D" }}>Awakening Sacred Offering…</h2>
          <p style={{ color: "#666" }}>Please wait while we connect to the sacred repository.</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={styles.page}>
        <div className={styles.container} style={{ textAlign: "center", padding: "100px 20px" }}>
          <h2 style={{ fontFamily: "'Canela', serif", color: "#4A0B1D" }}>Offering Not Found</h2>
          <p style={{ color: "#666", marginBottom: 24 }}>{error || "The sacred item you are looking for is not available."}</p>
          <button
            onClick={() => navigate("/products")}
            style={{
              background: "#E07B39",
              color: "#fff",
              border: "none",
              padding: "12px 28px",
              borderRadius: 999,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            ← Return to Sacred Catalog
          </button>
        </div>
      </div>
    );
  }

  const displayCategory = product.meta?.productType || product.subtitle || "Sacred Item";
  const displayPrice = product.badgeText || "₹999";
  const comparePrice = product.meta?.compareAtPrice ? `₹${product.meta.compareAtPrice}` : null;

  return (
    <div className={styles.page}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className={styles.toast}>
          <span>{toastMessage}</span>
          <button className={styles.toastLink} onClick={() => navigate("/cart")}>
            View Cart ({itemCount}) →
          </button>
        </div>
      )}

      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Sacred Collections</Link>
          <span>/</span>
          <span className={styles.breadcrumbCurrent}>{product.title}</span>
        </nav>

        {/* Product Showcase */}
        <div className={styles.productShowcase}>
          {/* Left: Gallery */}
          <div className={styles.galleryCol}>
            <div className={styles.mainImageWrapper}>
              <img
                src={resolveImageUrl(validImages[safeActiveIndex] || product.imageUrl)}
                alt={product.title}
                className={styles.mainImage}
                onError={() => handleImageError(validImages[safeActiveIndex])}
              />
              <span className={styles.badgeOverlay}>
                {product.duration || "Handcrafted"}
              </span>
            </div>

            {validImages.length > 1 && (
              <div className={styles.thumbnailRow}>
                {validImages.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    className={`${styles.thumbnailBtn} ${safeActiveIndex === idx ? styles.thumbnailActive : ""}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img
                      src={resolveImageUrl(img)}
                      alt={`Thumbnail ${idx + 1}`}
                      className={styles.thumbnailImg}
                      onError={() => handleImageError(img)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Details & Purchase */}
          <div className={styles.detailsCol}>
            <span className={styles.categoryTag}>{displayCategory}</span>
            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.ratingRow}>
              <span className={styles.stars}>★★★★★</span>
              <span>4.9 / 5.0 (48 Sacred Reviews)</span>
            </div>

            <div className={styles.priceSection}>
              <span className={styles.currentPrice}>{displayPrice}</span>
              {comparePrice && <span className={styles.comparePrice}>{comparePrice}</span>}
              <span className={styles.discountBadge}>Authentic Consecration</span>
              <span className={styles.taxNote}>Inclusive of all taxes · Sacred blessing included</span>
            </div>

            <div className={styles.stockStatus}>
              <span className={styles.stockDot}></span>
              <span>In Stock — Dispatches within 24 hours in ritual packaging</span>
            </div>

            {/* Intention Essence Quote */}
            <div className={styles.intentionBox}>
              <span className={styles.intentionLabel}>Sacred Intention &amp; Essence</span>
              <p className={styles.intentionText}>
                "{product.summary || product.subtitle || "A timeless devotional tool crafted to still the mind and sanctify your home altar."}"
              </p>
            </div>

            {/* Actions: Quantity + Add to Cart + Buy Now */}
            <div className={styles.actionsRow}>
              <div className={styles.qtyWrapper}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.qtyValue}>{qty}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button
                className={`${styles.addToCartBtn} ${added ? styles.addedBtn : ""}`}
                onClick={handleAddToCart}
              >
                {added ? "✓ Added to Sacred Cart" : "Add to Sacred Cart +"}
              </button>

              <button className={styles.buyNowBtn} onClick={handleBuyNow}>
                Buy Now →
              </button>
            </div>

            {/* Trust Badges */}
            <div className={styles.trustGrid}>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🌿</span>
                <span>100% Natural &amp; Pure Botanicals</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🛕</span>
                <span>Temple Blessed &amp; Consecrated</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>📦</span>
                <span>Safe Sacred Protective Packaging</span>
              </div>
              <div className={styles.trustItem}>
                <span className={styles.trustIcon}>🔒</span>
                <span>Secure Bank-Grade Payment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Information Tabs */}
        <section className={styles.infoSection}>
          <div className={styles.tabsHeader}>
            <button
              className={`${styles.tabBtn} ${activeTab === "ritual" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("ritual")}
            >
              The Sacred Ritual
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "story" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("story")}
            >
              Story &amp; Description
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === "specs" ? styles.tabBtnActive : ""}`}
              onClick={() => setActiveTab("specs")}
            >
              Specifications &amp; Purity
            </button>
          </div>

          <div className={styles.tabBody}>
            {activeTab === "ritual" && (
              <div>
                <p>
                  Every Bhava offering is created to support the quiet return to yourself through intentional daily practice.
                </p>
                <div className={styles.ritualSteps}>
                  <div className={styles.stepCard}>
                    <span className={styles.stepNum}>STEP 01</span>
                    <h4 className={styles.stepTitle}>PAUSE &amp; SANCTIFY</h4>
                    <p className={styles.stepDesc}>
                      Take 3 deep, grounding breaths. Hold or place the offering on your altar, letting go of outer distractions.
                    </p>
                  </div>
                  <div className={styles.stepCard}>
                    <span className={styles.stepNum}>STEP 02</span>
                    <h4 className={styles.stepTitle}>AWAKEN INTENTION</h4>
                    <p className={styles.stepDesc}>
                      Light or chant with your chosen sankalpa (intention). Notice the sacred aroma and vibration filling the space.
                    </p>
                  </div>
                  <div className={styles.stepCard}>
                    <span className={styles.stepNum}>STEP 03</span>
                    <h4 className={styles.stepTitle}>SEAL IN DEVOTION</h4>
                    <p className={styles.stepDesc}>
                      Close your ritual with a moment of gratitude. Carry the quiet clarity with you into the rest of your day.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "story" && (
              <div>
                <p>
                  {product.fullDescription || product.summary || product.subtitle || "Handcrafted according to timeless temple traditions."}
                </p>
                <p style={{ marginTop: 14 }}>
                  Our artisans and herbalists follow centuries-old methods rooted in traditional Ayurvedic knowledge and sacred temple recipes.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 32px" }}>
                <div><strong>Category:</strong> {displayCategory}</div>
                <div><strong>Origin:</strong> Handcrafted in India</div>
                <div><strong>Quality Grade:</strong> {product.duration || "Temple Grade"}</div>
                <div><strong>Packaging:</strong> Eco-Friendly Sacred Box</div>
                <div><strong>Care:</strong> Store in a dry, serene space away from direct moisture</div>
                <div><strong>Availability:</strong> Ready to Ship Worldwide</div>
              </div>
            )}
          </div>
        </section>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className={styles.similarSection}>
            <div className={styles.similarHeader}>
              <span className={styles.similarKicker}>Sacred Pairings</span>
              <h2 className={styles.similarTitle}>You May Also Like</h2>
              <p style={{ color: "#666", fontSize: 15, margin: 0 }}>
                Complementary devotional offerings that harmonize with this intention to deepen your practice.
              </p>
            </div>

            <div className={styles.similarGrid}>
              {similarProducts.map((item) => (
                <div
                  key={item._id}
                  style={{
                    background: "#ffffff",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 28px rgba(74,11,29,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.04)";
                  }}
                  onClick={() => navigate(`/product/${item._id || item.handle}`)}
                >
                  <div style={{ width: "100%", aspectRatio: "1/1", overflow: "hidden", background: "#f5f0e6" }}>
                    <img
                      src={resolveImageUrl(item.imageUrl)}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>

                  <div style={{ padding: "18px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#C0671E", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>
                      {item.meta?.productType || item.subtitle || "Sacred Item"}
                    </span>
                    <h4 style={{ fontFamily: "'Canela', serif", fontSize: 17, color: "#221217", margin: "0 0 10px", lineHeight: 1.3 }}>
                      {item.title}
                    </h4>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: "#4A0B1D" }}>
                        {item.badgeText || "₹999"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart({
                            productId: item._id || item.handle || item.title,
                            title: item.title,
                            price: item.badgeText || "₹999",
                            image: resolveImageUrl(item.imageUrl || ""),
                            category: item.meta?.productType || item.category || "Products",
                            quantity: 1,
                          });
                          setToastMessage(`✓ Added "${item.title}" to cart`);
                          setTimeout(() => setToastMessage(null), 3500);
                        }}
                        style={{
                          background: "#E07B39",
                          color: "#fff",
                          border: "none",
                          padding: "7px 14px",
                          borderRadius: 999,
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Add to Cart +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
