import { useState, useLayoutEffect, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // eslint-disable-line no-unused-vars
import styles from "./ExploreSacredWisdom.module.css";
import PujaRituals from "./PujaRituals";
import VedicScriptures from "./VedicScriptures";
import TempleTraditions from "./TempleTraditions";
import MantrasPrayers from "./MantrasPrayers";
import MeditationPractices from "./MeditationPractices";
import FestivalCelebrations from "./FestivalCelebrations";

// eslint-disable-next-line react-refresh/only-export-components
export const wisdomRoutes = [
  { path: "puja-rituals",           element: <PujaRituals /> },
  { path: "vedic-scriptures",       element: <VedicScriptures /> },
  { path: "temple-traditions",      element: <TempleTraditions /> },
  { path: "mantras-prayers",        element: <MantrasPrayers /> },
  { path: "meditation-practices",   element: <MeditationPractices /> },
  { path: "festivals-celebrations", element: <FestivalCelebrations /> },
];

const WISDOM_GAP = 14;

function visibleCountForWidth(w) {
  if (w < 640) return 1;
  if (w < 900) return 2;
  if (w < 1180) return 3;
  return 4;
}

const knowledgeCategories = [
  {
    id: 1,
    title: "Puja Rituals",
    description: "Learn the sacred art of worship, traditional puja vidhi, and daily ritual practices.",
    route: "/knowledge/puja-rituals",
    image: "./Explore Sacred Wisdom/Puja Rituals.webp",
  },
  {
    id: 2,
    title: "Vedic Scriptures",
    description: "Dive deep into the Vedas, Upanishads, and Puranas with expert commentary and translations.",
    route: "/knowledge/vedic-scriptures",
    image: "./Explore Sacred Wisdom/Vedic Scriptures.webp",
  },
  {
    id: 3,
    title: "Temple Traditions",
    description: "Learn the sacred rituals, architectural significance, and spiritual practices of ancient temples.",
    route: "/knowledge/temple-traditions",
    image: "./Explore Sacred Wisdom/Temple Traditions.webp",
  },
  {
    id: 4,
    title: "Mantras & Prayers",
    description: "Discover the power of sacred mantras with proper pronunciation, meanings, and benefits.",
    route: "/knowledge/mantras-prayers",
    image: "./Explore Sacred Wisdom/Mantras & Prayers.webp",
  },
  {
    id: 5,
    title: "Meditation Practices",
    description: "Master ancient meditation techniques from yoga traditions and spiritual lineages.",
    route: "/knowledge/meditation-practices",
    image: "./Explore Sacred Wisdom/Meditation Practices.webp",
  },
  {
    id: 6,
    title: "Festivals & Celebrations",
    description: "Understand the spiritual significance and traditional observances of Hindu festivals.",
    route: "/knowledge/festivals-celebrations",
    image: "./Explore Sacred Wisdom/Festivals & Celebrations.webp",
  },
];

function WisdomFlipCard({ category, width, navigate }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={styles.wisdomCardOuter}
      data-scroll-id={`knowledge-${category.id}`}
      style={width ? { flex: `0 0 ${width}px`, width } : {}}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
      onClick={() => setFlipped((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setFlipped((v) => !v);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`${category.title} card`}
    >
      <motion.div
        className={styles.wisdomCardInner}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className={styles.wisdomCardBack}>
          <img loading="lazy" decoding="async" src={category.image} alt={category.title} className={styles.wisdomCardBackImg} />
          <div className={styles.wisdomCardBackOverlay}>
            <h3 className={styles.wisdomCardBackTitle}>{category.title}</h3>
          </div>
        </div>

        <div className={styles.wisdomCardFront}>
          <div className={styles.wisdomCardFrontContent}>
            <h3 className={styles.wisdomFrontTitle}>{category.title}</h3>
            <p className={styles.wisdomFrontDesc}>{category.description}</p>
            <button
              type="button"
              className={styles.wisdomFrontBtn}
              onClick={(e) => {
                e.stopPropagation();
                navigate(category.route);
              }}
            >
              Explore More
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ExploreSacredWisdom() {
  const navigate = useNavigate();
  const [wisdomIndex, setWisdomIndex] = useState(0);
  const [wisdomCardW, setWisdomCardW] = useState(0);
  const [visible, setVisible] = useState(4);
  const wisdomRef = useRef(null);

  useLayoutEffect(() => {
    const el = wisdomRef.current;
    if (!el) return undefined;

    const measure = () => {
      const w = el.clientWidth;
      if (w <= 0) return;
      const nextVisible = visibleCountForWidth(w);
      setVisible(nextVisible);
      setWisdomCardW((w - WISDOM_GAP * (nextVisible - 1)) / nextVisible);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const maxIndex = Math.max(0, knowledgeCategories.length - visible);
    setWisdomIndex((i) => Math.min(i, maxIndex));
  }, [visible]);

  const step = Math.max(1, Math.min(2, visible));
  const maxIndex = Math.max(0, knowledgeCategories.length - visible);
  const prevWisdom = () => setWisdomIndex((p) => Math.max(0, p - step));
  const nextWisdom = () => setWisdomIndex((p) => Math.min(maxIndex, p + step));

  return (
    <div className={styles.sacredCollectionSection}>
      <div className={styles.container}>
        <div className={styles.sectionGoldDivider} />
        <h1 className={styles.sectionTitle}>
          <span className={styles.highlight}>Explore</span> Sacred Wisdom
        </h1>
      </div>

      <div className={styles.wisdomSliderWrapper}>
        <div className={styles.wisdomTrackOuter} ref={wisdomRef}>
          <motion.div
            className={styles.wisdomTrack}
            style={{ gap: WISDOM_GAP }}
            animate={{ x: -wisdomIndex * (wisdomCardW + WISDOM_GAP) }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            {knowledgeCategories.map((category) => (
              <WisdomFlipCard
                key={category.id}
                category={category}
                width={wisdomCardW}
                navigate={navigate}
              />
            ))}
          </motion.div>
        </div>

        <button
          type="button"
          className={`${styles.wisdomArrow} ${styles.wisdomArrowLeft}`}
          onClick={prevWisdom}
          disabled={wisdomIndex === 0}
          aria-label="Previous"
        >
          ‹
        </button>

        <button
          type="button"
          className={`${styles.wisdomArrow} ${styles.wisdomArrowRight}`}
          onClick={nextWisdom}
          disabled={wisdomIndex >= maxIndex}
          aria-label="Next"
        >
          ›
        </button>

        <div className={styles.wisdomDots} role="tablist" aria-label="Sacred wisdom slides">
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === wisdomIndex}
              aria-label={`Slide ${i + 1}`}
              className={`${styles.wisdomDot} ${i === wisdomIndex ? styles.wisdomDotOn : ""}`}
              onClick={() => setWisdomIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExploreSacredWisdom;
