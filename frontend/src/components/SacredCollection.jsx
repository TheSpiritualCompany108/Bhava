 import { useState, useEffect, useRef, useCallback } from "react";
 import { motion, useMotionValue, animate } from "framer-motion"; // eslint-disable-line no-unused-vars
import styles from "./SacredCollection.module.css";
 import { useCart } from "../context/CartContext";
 const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
 const CATEGORY = "Products";
 const GAP = 12;

// Fallback hardcoded products if API fails
const fallbackCards = [
  {
    _id: 0,
    title: "Vedic Incense Series",
    badgeText: "₹1,299",
    summary: "Hand-rolled using 16th-century temple recipes, infused with Himalayan herbs and sacred mantras.",
    imageUrl: "/uploads/Products/Home Page Incense.png",
  },
  {
    _id: 1,
    title: "Sacred Sambrani Cups",
    badgeText: "₹899",
    summary: "Purified resin sambrani with aromatic woods, perfect for daily pujas and sacred rituals.",
    imageUrl: "/uploads/Products/Home Page Sambrani.png",
  },
  {
    _id: 2,
    title: "Rudraksha Japa Mala",
    badgeText: "₹749",
    summary: "Crafted from 108 medicinal herbs, each stick carries the blessing of traditional temple practitioners.",
    imageUrl: "/uploads/Products/Home Page mala.png",
  },
];

function getVisibleCount() {
  if (typeof window === "undefined") return 3;
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

// ── Individual flip card ──────────────────────────────────────────────────
function FlipCard({ card, width, onAddToCart }) {
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(card);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  // Construct full image URL
  const imageUrl = card.imageUrl ? (card.imageUrl.startsWith('http') ? card.imageUrl : `${API_BASE}${card.imageUrl}`) : "./Products/Home Page Incense.png";

  return (
    <div
      className={styles.cardOuter}
      style={width ? { flex: `0 0 ${width}px`, width } : {}}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className={styles.cardInner}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* BACK — image face (default) */}
        <div className={styles.cardBack}>
          <img
            src={imageUrl}
            alt={card.title}
            className={styles.cardBackImg}
          />
          <div className={styles.cardBackOverlay}>
            <span className={styles.cardBackCategory}>{card.category}</span>
            <p className={styles.cardBackTitle}>{card.title}</p>
          </div>
        </div>

        {/* FRONT — details face (revealed on hover flip) */}
        <div className={styles.cardFront}>
          <div className={styles.cardFrontContent}>
            <div className={styles.frontTop}>
              <span className={styles.frontCategory}>{card.category}</span>
              <h3 className={styles.frontTitle}>{card.title}</h3>
              <p className={styles.frontPrice}>{card.badgeText}</p>
            </div>
            <div className={styles.frontBottom}>
              <p className={styles.frontDescription}>{card.summary}</p>
              <button
                className={`${styles.frontBtn} ${added ? styles.frontBtnAdded : ""}`}
                onClick={handleAdd}
              >
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ── Chevron SVGs ──────────────────────────────────────────────────────────
const ChevronLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Main component ────────────────────────────────────────────────────────
function SacredCollection() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardWidth, setCardWidth] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const cardWidthRef = useRef(0);
  const rawIndexRef = useRef(0);
  const isPausedRef = useRef(false);
  const isSnappingRef = useRef(false);
  const wrapperRef = useRef(null);

  const x = useMotionValue(0);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = `${API_BASE}/api/tiles?category=${encodeURIComponent(CATEGORY)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (res.ok && json.success) {
          setProducts(json.data || fallbackCards);
        } else {
          console.error("Failed to load products", res.status, json);
          setProducts(fallbackCards);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(fallbackCards);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Create looped array from products
  const LOOPED = [...products, ...products];

  const computeX = useCallback(
    (idx) => -(idx * (cardWidthRef.current + GAP)),
    []
  );

  const springTo = useCallback(
    (idx) => {
      animate(x, computeX(idx), {
        type: "spring",
        stiffness: 260,
        damping: 36,
        mass: 1.1,
      });
    },
    [x, computeX]
  );

  const instantTo = useCallback(
    (idx) => {
      x.set(computeX(idx));
    },
    [x, computeX]
  );

  const next = useCallback(() => {
    if (isSnappingRef.current) return;
    rawIndexRef.current += 1;
    springTo(rawIndexRef.current);

    if (rawIndexRef.current >= products.length) {
      isSnappingRef.current = true;
      setTimeout(() => {
        rawIndexRef.current -= products.length;
        instantTo(rawIndexRef.current);
        isSnappingRef.current = false;
      }, 900);
    }
  }, [springTo, instantTo, products.length]);

  const prev = useCallback(() => {
    if (isSnappingRef.current) return;
    if (rawIndexRef.current <= 0) {
      isSnappingRef.current = true;
      rawIndexRef.current = products.length;
      instantTo(rawIndexRef.current);
      setTimeout(() => {
        rawIndexRef.current -= 1;
        springTo(rawIndexRef.current);
        setTimeout(() => { isSnappingRef.current = false; }, 900);
      }, 20);
    } else {
      rawIndexRef.current -= 1;
      springTo(rawIndexRef.current);
    }
  }, [springTo, instantTo, products.length]);

  // Measure card width from wrapper
  useEffect(() => {
    const measure = () => {
      if (!wrapperRef.current) return;
      const w = wrapperRef.current.clientWidth;
      const v = getVisibleCount();
      const cw = (w - GAP * (v - 1)) / v;
      cardWidthRef.current = cw;
      setCardWidth(cw);
      instantTo(rawIndexRef.current);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [instantTo]);

  // Auto-advance
  useEffect(() => {
    if (!cardWidth) return;
    const timer = setInterval(() => {
      if (!isPausedRef.current) next();
    }, 3500);
    return () => clearInterval(timer);
  }, [cardWidth, next]);

  return (
    <div className={styles.sacredCollectionSection}>
      <div className={styles.container}>
        <h1 className={styles.sectionTitle}>
          Our Sacred <span className={styles.highlight}>Collections</span>
        </h1>

        {loading && <div style={{ padding: 12, background: '#fffbe6', borderRadius: 6, marginBottom: 12 }}>Loading products...</div>}

        {!loading && products.length > 0 && (
        <div
          className={styles.sliderContainer}
          onMouseEnter={() => { setIsHovering(true); isPausedRef.current = true; }}
          onMouseLeave={() => { setIsHovering(false); isPausedRef.current = false; }}
        >
          {/* Left arrow */}
          <button
            className={`${styles.arrow} ${styles.arrowLeft} ${isHovering ? styles.arrowVisible : ""}`}
            onClick={prev}
            aria-label="Previous"
          >
            <ChevronLeft />
          </button>

          <div className={styles.sliderWrapper} ref={wrapperRef}>
            <motion.div className={styles.sliderTrack} style={{ x }}>
              {LOOPED.map((card, idx) => (
                <FlipCard
                  key={`${card._id}-${idx}`}
                  card={card}
                  width={cardWidth}
                  onAddToCart={(c) =>
                    addToCart({
                      productId: `home-${c._id}`,
                      title: c.title,
                      price: c.badgeText,
                      image: c.imageUrl,
                      category: c.category,
                      quantity: 1,
                    })
                  }
                />
              ))}
            </motion.div>
          </div>

          {/* Right arrow */}
          <button
            className={`${styles.arrow} ${styles.arrowRight} ${isHovering ? styles.arrowVisible : ""}`}
            onClick={next}
            aria-label="Next"
          >
            <ChevronRight />
          </button>
        </div>
        )}
      </div>
    </div>
  );
}

export default SacredCollection;
