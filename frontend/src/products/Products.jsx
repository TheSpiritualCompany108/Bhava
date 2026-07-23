// import { useState } from "react";
// import { motion } from "framer-motion";
// import styles from "./Products.module.css";
// import { useCart } from "../context/CartContext";

// const products = [
//   {
//     id: 0,
//     category: "INCENSE",
//     title: "Vedic Incense Series",
//     price: "₹1,299",
//     description: "Hand-rolled using 16th-century temple recipes, infused with Himalayan herbs and sacred mantras.",
//     image: "/incense.jpeg",
//   },
//   {
//     id: 1,
//     category: "SAMBRANI",
//     title: "Sacred Sambrani Cups",
//     price: "₹899",
//     description: "Purified resin sambrani with aromatic woods, perfect for daily pujas and sacred rituals.",
//     image: "/incense.jpeg",
//   },
//   {
//     id: 0,
//     category: "INCENSE",
//     title: "Vedic Incense Series",
//     price: "₹1,299",
//     description: "Hand-rolled using 16th-century temple recipes, infused with Himalayan herbs and sacred mantras.",
//     images: ["/incense.jpeg", "/incense.jpeg", "/incense.jpeg"],
//   },
//   {
//     id: 1,
//     category: "SAMBRANI",
//     title: "Sacred Sambrani Cups",
//     price: "₹899",
//     description: "Purified resin sambrani with aromatic woods, perfect for daily pujas and sacred rituals.",
//     images: ["/incense.jpeg", "/incense.jpeg", "/incense.jpeg"],
//   },
//   {
//     id: 2,
//     category: "DHOOP",
//     title: "Meditation Ritual Kit",
//     price: "₹749",
//     description: "Crafted from 108 medicinal herbs, each stick carries the blessing of traditional temple practitioners.",
//     image: "/incense.jpeg",
//   },
//   {
//     id: 3,
//     category: "WELLNESS",
//     title: "Platinum Devotion Box",
//     price: "₹1,599",
//     description: "Ayurvedic blend of coconut and sacred herbs, traditionally used for temple abhishekam.",
//     image: "/anionting.jpeg",
//   },
// ];


// const FILTERS = ["All", "Pooja", "Meditation", "Mala", "Incense", "Scripture", "Yoga"];

// const filterMap = {
//   Pooja:      ["POOJA", "AARTI", "VESSEL", "SACRED WATER"],
//   Meditation: ["MEDITATION", "SOUND HEALING", "LAMP", "MEDITATION KIT"],
//   Mala:       ["MALA BEADS"],
//   Incense:    ["INCENSE", "SAMBRANI", "DHOOP", "FRAGRANCE"],
//   Scripture:  ["SCRIPTURE"],
//   Yoga:       ["YOGA"],
// };

// function FlipCard({ card, onAddToCart }) {
//   const [flipped, setFlipped] = useState(false);
//   const [added, setAdded] = useState(false);

//   const handleAdd = (e) => {
//     e.stopPropagation();
//     onAddToCart(card);
//     setAdded(true);
//     setTimeout(() => setAdded(false), 1800);
//   };

//   return (
//     <div
//       className={styles.cardOuter}
//       onMouseEnter={() => setFlipped(true)}
//       onMouseLeave={() => setFlipped(false)}
//     >
//       <motion.div
//         className={styles.cardInner}
//         animate={{ rotateY: flipped ? 180 : 0 }}
//         transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
//         style={{ transformStyle: "preserve-3d" }}
//       >
//         {/* BACK — image face, visible by default */}
//         <div className={styles.cardBack}>
//           <img src={card.image} alt={card.title} className={styles.cardBackImg} />
//           <div className={styles.cardBackOverlay}>
//             <span className={styles.cardBackCategory}>{card.category}</span>
//             <p className={styles.cardBackTitle}>{card.title}</p>
//           </div>
//         </div>

//         {/* FRONT — details face, revealed on hover flip */}
//         <div className={styles.cardFront}>
//           <div className={styles.cardFrontContent}>
//             <div className={styles.frontTop}>
//               <span className={styles.frontCategory}>{card.category}</span>
//               <h3 className={styles.frontTitle}>{card.title}</h3>
//               <p className={styles.frontPrice}>{card.price}</p>
//             </div>
//             <div className={styles.frontBottom}>
//               <p className={styles.frontDescription}>{card.description}</p>
//               <button
//                 className={`${styles.frontBtn} ${added ? styles.frontBtnAdded : ""}`}
//                 onClick={handleAdd}
//               >
//                 {added ? "✓ Added!" : "Add to Cart"}
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }

// function Products() {
//   const { addToCart } = useCart();
//   const [activeFilter, setActiveFilter] = useState("All");
//   const [addedId, setAddedId] = useState(null);
//   const [hasLoaded, setHasLoaded] = useState({});
//   const [failedCounts, setFailedCounts] = useState({});
//   const intervalRefs = useRef({});

//   const handleAddToCart = (card) => {
//     addToCart({
//       productId: card.id,
//       title: card.title,
//       price: card.price,
//       image: card.images[0] || "",
//       category: card.category,
//       quantity: 1,
//     });
//     setAddedId(card.id);
//     setTimeout(() => setAddedId(null), 1800);
//   };

//   const filtered =
//     activeFilter === "All"
//       ? products
//       : products.filter((p) => filterMap[activeFilter]?.includes(p.category));

//   return (
//     <div className={styles.page}>
//       {/* Hero */}
//       <div className={styles.hero}>
//         <h1 className={styles.heroTitle}>
//           Sacred <span className={styles.heroAccent}>Products</span>
//         </h1>
//         <p className={styles.heroSub}>
//           Authentic spiritual items curated from temples and artisans across India
//         </p>
//       </div>

//       {/* Filters */}
//       <div className={styles.filterRow}>
//         {FILTERS.map((f) => (
//           <button
//             key={f}
//             className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ""}`}
//             onClick={() => setActiveFilter(f)}
//           >
//             {f}
//           </button>
//         ))}
//       </div>

//       {/* Grid */}
//       <div className={styles.container}>
//         <div className={styles.grid}>
//           {filtered.slice(0, 6).map((card) => (
//             <FlipCard
//               key={card.id}
//               className={styles.card}
//               onMouseEnter={() => handleMouseEnter(card.id)}
//               onMouseLeave={() => handleMouseLeave(card.id)}
//             >
//               {/* Image slider */}
//               <div className={styles.imageWrapper}>
//                 <div
//                   className={styles.imageSlider}
//                   style={{ transform: `translateX(-${(activeSlide[card.id] || 0) * 100}%)` }}
//                 >
//                   {card.images.map((src, i) => (
//                     <div key={i} className={styles.imageSlide}>
//                       <img
//                         src={src}
//                         alt={`${card.title} view ${i + 1}`}
//                         onLoad={() => setHasLoaded((p) => ({ ...p, [card.id]: true }))}
//                         onError={() => setFailedCounts((p) => ({ ...p, [card.id]: (p[card.id] || 0) + 1 }))}
//                       />
//                     </div>
//                   ))}
//                 </div>

//                 {/* Add to Cart */}
//                 <button
//                   className={`${styles.addToCart} ${addedId === card.id ? styles.addedToCart : ""}`}
//                   onClick={(e) => { e.stopPropagation(); handleAddToCart(card); }}
//                 >
//                   {addedId === card.id ? "✓ Added!" : "Add to Cart"}
//                 </button>

//                 {/* Dots */}
//                 <div className={styles.dots}>
//                   {card.images.map((_, i) => (
//                     <span
//                       key={i}
//                       className={`${styles.dot} ${(activeSlide[card.id] || 0) === i ? styles.dotActive : ""}`}
//                       onClick={() => handleDotClick(card.id, i)}
//                     />
//                   ))}
//                 </div>
//               </div>
//               {/* If all slides failed to load, show centered message */}
//               {failedCounts[card.id] === card.images.length && (
//                 <div className={styles.comingSoonOverlay}>
//                   <div className={styles.comingSoonText}>Product coming soon</div>
//                 </div>
//               )}

//               {/* Info */}
//               <div className={styles.info}>
//                 <p className={styles.category}>{card.category}</p>
//                 <div className={styles.titleRow}>
//                   <h3 className={styles.title}>{card.title}</h3>
//                   <span className={styles.price}>{card.price}</span>
//                 </div>
//                 <p className={styles.description}>{card.description}</p>
//               </div>
//              </div>
//           ))}
//         </div>
//         {filtered.length >= 6 && (
//           <div style={{ textAlign: "center", margin: "18px 0 48px" , fontSize:"60px", color:"rgb(30, 58, 48)" , fontFamily:"Canela, Cormorant, serif",}} className={styles.comingSoonRow}>
//             Product coming soon
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default Products;


import { useState, useEffect } from "react";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import styles from "./Products.module.css";
import { useCart } from "../context/CartContext";
import { useLocation } from "react-router-dom";
import RitualTierCards, { homeRitualTiers, premiumRitualTiers } from "../components/RitualTierCards";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const CATEGORY = "Products";

// Fallback hardcoded products if API fails
const fallbackProducts = [
  {
    _id: 0,
    category: "INCENSE",
    title: "Vedic Incense Series",
    badgeText: "₹1,299",
    summary: "Hand-rolled using 16th-century temple recipes, infused with Himalayan herbs and sacred mantras.",
    imageUrl: "/Products/Home Page Incense.png",
  },
  {
    _id: 1,
    category: "SAMBRANI",
    title: "Sacred Sambrani Cups",
    badgeText: "₹899",
    summary: "Purified resin sambrani with aromatic woods, perfect for daily pujas and sacred rituals.",
    imageUrl: "/Products/Home Page Sambrani.png",
  },
];

const FILTERS = ["All", "Pooja", "Meditation", "Mala", "Incense", "Scripture", "Yoga"];

const filterMap = {
  Pooja:      ["POOJA", "AARTI", "VESSEL", "SACRED WATER"],
  Meditation: ["MEDITATION", "SOUND HEALING", "LAMP", "MEDITATION KIT"],
  Mala:       ["MALA BEADS"],
  Incense:    ["INCENSE", "SAMBRANI", "DHOOP", "FRAGRANCE"],
  Scripture:  ["SCRIPTURE"],
  Yoga:       ["YOGA"],
  Wellness:   ["WELLNESS"],
};

function FlipCard({ card, onAddToCart }) {
  const [flipped, setFlipped] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(card);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  // Construct full image URL
  const imageUrl = card.imageUrl ? (card.imageUrl.startsWith('http') ? card.imageUrl : `${API_BASE}${card.imageUrl}`) : "/placeholder.png";

  return (
    <div
      className={styles.cardOuter}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <motion.div
        className={styles.cardInner}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* BACK — image face, visible by default */}
        <div className={styles.cardBack}>
          <img src={imageUrl} alt={card.title} className={styles.cardBackImg} />
          <div className={styles.cardBackOverlay}>
            <span className={styles.cardBackCategory}>{card.category}</span>
            <p className={styles.cardBackTitle}>{card.title}</p>
          </div>
        </div>

        {/* FRONT — details face, revealed on hover flip */}
        <div className={styles.cardFront}>
          <div className={styles.cardFrontContent}>
            <div className={styles.frontTop}>
              <span className={styles.frontCategory}>{card.category}</span>
              <h3 className={styles.frontTitle}>{card.title}</h3>
              <p className={styles.frontPrice}>Coming Soon</p>
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

function Products() {
  const { addToCart } = useCart();
  const [activeFilter, setActiveFilter] = useState("All");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError("");
      try {
        const url = `${API_BASE}/api/tiles?category=${encodeURIComponent(CATEGORY)}`;
        const res = await fetch(url);
        const json = await res.json();
        if (res.ok && json.success) {
          setProducts(json.data || fallbackProducts);
        } else {
          console.error("Failed to load products", res.status, json);
          setProducts(fallbackProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message || "Network error");
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    // If navigated with state asking to scroll to an element, perform smooth scroll
    const id = location?.state?.scrollToId;
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        // small timeout to ensure layout has settled
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
      }
    }
  }, [location]);

  const handleAddToCart = (card) => {
    addToCart({
      productId: card._id,
      title: card.title,
      price: card.badgeText,
      image: card.imageUrl || "",
      category: card.category,
      quantity: 1,
    });
  };

  const filtered =
    activeFilter === "All"
      ? products
      : products.filter((p) => filterMap[activeFilter]?.includes(p.category));

  return (
    <div className={styles.page}>
      {loading && <div style={{ padding: 12, background: '#fffbe6', borderRadius: 6, margin: 12 }}>Loading products...</div>}
      {error && <div style={{ padding: 12, background: '#ffe6e6', color: '#900', borderRadius: 6, margin: 12 }}>{error}</div>}

      {/* Hero */}
      <div id="products-hero" className={styles.hero}>
        <h1 className={styles.heroTitle}>
         Our Sacred <span className={styles.heroAccent}>Collections</span>
        </h1>
        <p className={styles.heroSub}>
          Ritual needs the right elements. Each part has a role. Build your practice with Bhava:
        </p>
      </div>

      {/* Ritual system pricing tiers */}
      <div className={styles.tierSection}>
        <RitualTierCards tiers={homeRitualTiers} />
      </div>

      {/* Premium collections */}
      <div className={styles.tierSection}>
        <p className={styles.tierSectionKicker}>Premium Collections</p>
        <h2 className={styles.tierSectionTitle}>
          Elevated Ritual Practice &amp; Signature Systems
        </h2>
        <RitualTierCards tiers={premiumRitualTiers} columns={2} />
        <p className={styles.exploreMore}>
          Explore More Products:{" "}
          <a
            href="https://docs.google.com/document/d/10JZpuzdRjNUkefZWmYT5Z6wU_ohVcnVHkMGUesKaFU/edit?usp=drive_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View the full catalog
          </a>
        </p>
      </div>

      {/* Filters */}
      <div className={styles.filterRow}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${activeFilter === f ? styles.filterActive : ""}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.container}>
        <div className={styles.grid}>
          {filtered.slice(0, 6).map((card) => (
            <FlipCard
              key={card._id}
              card={card}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
        {filtered.length >= 6 && (
          <div className={styles.comingSoonRow}>
            <span className={styles.comingSoonRowProduct}>Product</span>{" "}
            <span className={styles.comingSoonRowSoon}>coming soon</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
