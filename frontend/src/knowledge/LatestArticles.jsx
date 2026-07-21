import React, { useRef, useState } from "react";
import styles from "./LatestArticles.module.css";

const articles = [
  {
    brand: "Bhava:",
    tag: "#SACRED26",
    title: "Mahāśivarātri 2026",
    sub: "The Great Night of Shiva",
    type: null,
    image: "/article1.png",
    fallback: "#2a1a3a",
    titleColor: "#ffffff",
  },
  {
    brand: "Bhava:",
    tag: null,
    title: "Divine Consciousness",
    sub: "Podcast",
    type: "Podcast",
    image: "/article2.png",
    fallback: "#3a0a0a",
    titleColor: "#ffffff",
  },
  {
    brand: "Bhava:",
    tag: null,
    title: "Reflections on Being",
    sub: "Podcast",
    type: "Podcast",
    image: "/article3.png",
    fallback: "#0a1a3a",
    titleColor: "#f59e42",
  },
  {
    brand: "Bhava:",
    tag: null,
    title: "Mother Divine: History, Power, Prayers",
    sub: "Article",
    type: "Article",
    image: "/article4.png",
    fallback: "#2a1a0a",
    titleColor: "#ffffff",
  },
  {
    brand: "Bhava:",
    tag: null,
    title: "The Science of Karma",
    sub: "Article",
    type: "Article",
    image: "/article5.png",
    fallback: "#1a2a1a",
    titleColor: "#ffffff",
  },
  {
    brand: "Bhava:",
    tag: null,
    title: "Vedic Astrology Basics",
    sub: "Podcast",
    type: "Podcast",
    image: "/article6.png",
    fallback: "#1a1a3a",
    titleColor: "#ffffff",
  },
];

function LatestArticles() {
  const trackRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollPos(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section className={styles.section}>
      <div className={styles.bg} />

      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Latest Articles</h2>
          <p className={styles.subheading}>
            Insights and wisdom from our community
          </p>
        </div>
        <div className={styles.nav}>
          <button
            className={styles.navBtn}
            onClick={() =>
              trackRef.current?.scrollBy({ left: -280, behavior: "smooth" })
            }
          >
            ‹
          </button>
          <button
            className={styles.navBtn}
            onClick={() =>
              trackRef.current?.scrollBy({ left: 280, behavior: "smooth" })
            }
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.track} data-scroll-container-id="latest-articles-track" ref={trackRef} onScroll={handleScroll}>
        {articles.map((a, i) => (
          <div key={i} className={styles.card}>
            <div
              className={styles.cardThumb}
              style={{ background: a.fallback }}
            >
              <img
                src={a.image}
                alt={a.title}
                className={styles.cardImg}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <div className={styles.thumbOverlay} />

              {/* Top labels */}
              <div className={styles.topRow}>
                <span className={styles.brandLabel}>{a.brand}</span>
                {a.tag && <span className={styles.tagLabel}>{a.tag}</span>}
              </div>

              {/* Bottom content */}
              <div className={styles.bottomContent}>
                <h4
                  className={styles.cardTitle}
                  style={{ color: a.titleColor }}
                >
                  {a.title}
                </h4>
                <p className={styles.cardSub}>{a.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.max(scrollPos * 100, 14)}%` }}
        />
      </div>
    </section>
  );
}

export default LatestArticles;