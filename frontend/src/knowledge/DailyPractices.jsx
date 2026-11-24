import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DailyPractices.module.css";
import { getDisplayTitle, getSubtitle } from "../utils/categoryMapping";

// eslint-disable-next-line react-refresh/only-export-components
export const dailyPracticeRoutes = [
  { path: "daily-puja",         element: <div>Daily Puja</div> },
  { path: "meditation",         element: <div>Meditation</div> },
  { path: "japa-mala",          element: <div>Japa Mala</div> },
  { path: "vedic-hymns",        element: <div>Vedic Hymns</div> },
  { path: "mantra-chanting",    element: <div>Mantra Chanting</div> },
  { path: "surya-namaskar",     element: <div>Surya Namaskar</div> },
  { path: "gita-reading",       element: <div>Gita Reading</div> },
  { path: "aarti",              element: <div>Aarti</div> },
  { path: "karma-dharma",       element: <div>Karma Dharma</div> },
  { path: "divine-grace",       element: <div>Divine Grace</div> },
  { path: "inner-peace",        element: <div>Inner Peace</div> },
  { path: "sacred-traditions",  element: <div>Sacred Traditions</div> },
  { path: "path-of-union",      element: <div>Path of Union</div> },
  { path: "non-dual-wisdom",    element: <div>Non-Dual Wisdom</div> },
];

const practices = [
  { img: "/Daily%20Practices/Daily%20Puja.webp",      title: "Morning Puja",      sub: "Begin the day in devotion and gratitude.",       detail: "15–28 min",       color: "#5a2a1a", route: "/knowledge/daily-puja" },
  { img: "/Daily%20Practices/Mantra%20Chanting.webp", title: "Mantra Chanting",   sub: "Sacred sound that steadies the mind",          detail: "108 repetitions", color: "#2a1a5a", route: "/knowledge/mantra-chanting" },
  { img: "/Daily%20Practices/Vedic%20Hymns.webp",     title: "Vedic Hymns",       sub: "Ancient verses that invoke the divine.",        detail: "7 min",           color: "#1a3a4a", route: "/knowledge/vedic-hymns" },
  { img: "/Daily%20Practices/Kurya%20Namaskar.webp",  title: "Surya Namaskar",    sub: "Salute the rising sun and awaken the body.",        detail: "12 rounds",       color: "#5a1a2a", route: "/knowledge/surya-namaskar" },
  { img: "/Daily%20Practices/Gita%20Reading.webp",    title: "Gita Reflection",   sub: "Daily wisdom from the Bhagavad Gita.",           detail: "5 min",           color: "#1a4a3a", route: "/knowledge/gita-reading" },
  { img: "/Daily%20Practices/Aarti.webp",             title: "Sacred Aarti",      sub: "Offer light in gratitude at day’s end.", detail: "10 min",          color: "#4a2a0a", route: "/knowledge/aarti" },
  { img: "/Daily%20Practices/Meditation.webp",        title: "Dhyana Meditation",  sub: "Enter the stillness within.",       detail: "20 min",          color: "#2a1a4a", route: "/knowledge/meditation" },
  { img: "/Daily%20Practices/Japa%20Mala.webp",       title: "Japa Mala",         sub: "Repetition that deepens devotion.",       detail: "108 beads",       color: "#0a3a3a", route: "/knowledge/japa-mala" },
];

const CATEGORY = "Daily Sacred";

function DailyPractices() {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [practices, setPractices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPractices();
  }, []);

  const fetchPractices = async () => {
    try {
      setLoading(true);
      setError("");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const url = `${API_BASE}/api/tiles?category=${encodeURIComponent(CATEGORY)}`;
      const res = await fetch(url);
      const json = await res.json();
      
      if (res.ok && json.success) {
        // Map backend tiles to display format
        const mappedPractices = (json.data || []).map((tile, i) => ({
          id: tile._id,
          img: tile.imageUrl ? (tile.imageUrl.startsWith('http') ? tile.imageUrl : `${API_BASE}${tile.imageUrl}`) : "/Daily%20Practices/placeholder.png",
          title: tile.title,
          sub: tile.subtitle || tile.summary,
          detail: tile.duration || "Time varies",
          color: "#5a2a1a",
          route: `/knowledge/detail/${tile._id}`,
        }));
        setPractices(mappedPractices);
      } else {
        console.error("Failed to fetch practices", json);
        setError(json.message || "Failed to load practices");
      }
    } catch (err) {
      console.error("Error fetching practices:", err);
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

  const scrollLeft  = () => trackRef.current?.scrollBy({ left: -340, behavior: "smooth" });
  const scrollRight = () => trackRef.current?.scrollBy({ left: 340,  behavior: "smooth" });

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
          data-scroll-container-id="daily-track"
          ref={trackRef}
          onScroll={handleScroll}
        >
          {loading && <p>Loading practices...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {!loading && practices.length === 0 && <p>No practices available</p>}
          {practices.map((p, i) => (
            <div
              key={i}
              className={styles.card}
              data-scroll-id={`daily-${i}`}
              onClick={() => { if (p.route) { navigate(p.route); } }}
              style={{ cursor: p.route ? 'pointer' : 'default' }}
            >
              <div className={styles.cardThumb}>
                <img loading="lazy" decoding="async"
                  src={p.img}
                  alt={p.title}
                  className={styles.thumbImg}
                />
                <div className={styles.thumbOverlay} />
              </div>

              <h4 className={styles.cardTitle}>{p.title}</h4>
              <p className={styles.cardSub}>{p.sub}</p>
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

export default DailyPractices;
