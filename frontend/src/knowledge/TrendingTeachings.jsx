import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TrendingTeaching.module.css";
import TrendingDetail from "./TrendingDetail";
import { getDisplayTitle, getSubtitle } from "../utils/categoryMapping";

// eslint-disable-next-line react-refresh/only-export-components
export const trendingRoutes = [
  { path: "trending/:slug", element: <TrendingDetail /> },
];

const CATEGORY = "Sacred Wisdom";

function TrendingTeachings() {
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
        // Map backend tiles to display format
        const mappedTeachings = (json.data || []).map((tile) => ({
          id: tile._id,
          title: tile.title,
          sub: tile.subtitle,
          teacher: tile.summary,
          duration: tile.duration || "10 min",
          sessions: tile.badgeText || "Sessions",
          image: tile.imageUrl ? (tile.imageUrl.startsWith('http') ? tile.imageUrl : `${API_BASE}${tile.imageUrl}`) : "/Timeless%20Wisdom/placeholder.png",
          route: `/knowledge/trending/${tile._id}`,
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

  const scrollLeft = () =>
    trackRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  const scrollRight = () =>
    trackRef.current?.scrollBy({ left: 320, behavior: "smooth" });

  const atStart = scrollPos === 0;
  const atEnd = scrollPos >= 0.99;

  // Left arrow: only show when hovered AND user has scrolled right
  const showLeft = isHovered && !atStart;
  // Right arrow: only show when hovered AND not at end
  const showRight = isHovered && !atEnd;

  return (
    <section className={styles.trendingSection}>
      <div className={styles.trendingBg} />

      {/* Header */}
      <div className={styles.trendingHeader}>
        <div>
          <h2 className={styles.trendingHeading}>{getDisplayTitle(CATEGORY)}</h2>
          <p className={styles.trendingSubheading}>
            {getSubtitle(CATEGORY)}
          </p>
        </div>
      </div>

      {/* Hover zone wraps arrows + track */}
      <div
        className={styles.trendingWrapper}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left arrow */}
        <button
          className={`${styles.arrowBtn} ${showLeft ? styles.arrowVisible : styles.arrowHidden}`}
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          ‹
        </button>

        {/* Scrollable track */}
        <div
          className={styles.trendingTrack}
          data-scroll-container-id="trending-track"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {loading && <p>Loading teachings...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && teachings.length === 0 && <p>No teachings available</p>}
          {teachings.map((t) => (
            <div
              key={t.id}
              data-scroll-id={`trending-${t.id}`}
              className={styles.teachingCard}
              onClick={() => { navigate(t.route); }}
            >
              <div className={styles.teachingThumb}>
                <img loading="lazy" decoding="async"
                  src={t.image}
                  alt={t.title}
                  className={styles.thumbImage}
                />
                <div className={styles.thumbOverlay} />
                <span className={styles.thumbDuration}>{t.duration}</span>
              </div>

              <h4 className={styles.teachingTitle}>{t.title}</h4>
              <p className={styles.teachingSub}>{t.teacher}</p>
              <span className={styles.teachingDuration}>{t.sessions}</span>
            </div>
          ))}
        </div>

        {/* Right arrow */}
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

export default TrendingTeachings;