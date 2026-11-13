import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LatestTeachings.module.css";
import { getDisplayTitle, getSubtitle } from "../utils/categoryMapping";

const CATEGORY = "Living Wisdom";

// eslint-disable-next-line react-refresh/only-export-components
function LatestTeachings() {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [teachings, setTeachings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeachings();
  }, []);

  const fetchTeachings = async () => {
    try {
      setLoading(true);
      setError("");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const url = `${API_BASE}/api/tiles?category=${encodeURIComponent(CATEGORY)}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (res.ok && json.success) {
        const mappedTeachings = (json.data || []).map((tile) => ({
          id: tile._id,
          title: tile.title,
          category: tile.subtitle || tile.summary,
          image: tile.imageUrl ? (tile.imageUrl.startsWith('http') ? tile.imageUrl : `${API_BASE}${tile.imageUrl}`) : "/Latest%20Teachings/placeholder.png",
          tagColor: "#3a2a6a",
          color: "#4A0B1D",
          route: `/knowledge/detail/${tile._id}`,
        }));
        setTeachings(mappedTeachings);
      } else {
        console.error("Failed to fetch teachings", json);
        setError(json.message || "Failed to load teachings");
      }
    } catch (err) {
      console.error("Error fetching teachings:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollPos(max > 0 ? el.scrollLeft / max : 0);
  };

  const scrollLeft  = () => trackRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => trackRef.current?.scrollBy({ left: 300,  behavior: "smooth" });

  const atStart = scrollPos === 0;
  const atEnd   = scrollPos >= 0.99;

  const showLeft  = isHovered && !atStart;
  const showRight = isHovered && !atEnd;

  return (
    <section className={styles.section}>
      <div className={styles.bg} />

      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>{getDisplayTitle(CATEGORY)}</h2>
          <p className={styles.subheading}>{getSubtitle(CATEGORY)}</p>
        </div>
      </div>

      <div
        className={styles.wrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className={`${styles.arrowBtn} ${showLeft ? styles.arrowVisible : styles.arrowHidden}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          ‹
        </button>

        <div
          className={styles.track}
          data-scroll-container-id="latest-track"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {loading && <p>Loading teachings...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && teachings.length === 0 && <p>No teachings available</p>}
          {teachings.map((t, i) => (
            <div key={i} data-scroll-id={`latest-${i}`} className={styles.card} onClick={() => { navigate(t.route); }} style={{ cursor: "pointer" }}>
              {/* Image / thumb area */}
              <div className={styles.cardThumb} style={{ backgroundImage: `url(${t.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className={styles.thumbBg} />
                <div className={styles.thumbOverlay} />
                <span className={styles.cardTag} style={{ color: t.tagColor }}>
                  {t.tag}
                </span>
              </div>

              <h4 className={styles.cardTitle}>{t.title}</h4>
              <p className={styles.cardCategory}>{t.category}</p>
            </div>
          ))}
        </div>

        <button
          className={`${styles.arrowBtn} ${showRight ? styles.arrowVisible : styles.arrowHidden}`}
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>

    </section>
  );
}

export default LatestTeachings;
