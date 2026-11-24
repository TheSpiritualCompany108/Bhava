import React, { useRef, useState } from "react";
import styles from "./SacredPathways.module.css";

/* ─── Data ─── */
const practicePlans = [
  { title: "14 Days of Devotion",   sub: "How to Pray",                          joined: "145K joined",  image: "/plan1.png", fallback: "#1a1a2a" },
  { title: "For Divine Grace",      sub: "Sovereign Mercy & Scripture Meditation", joined: "184K joined",  image: "/plan2.png", fallback: "#0a1a0a" },
  { title: "Victory Over Vice",     sub: "Victory Over Vice",                    joined: "54.9K joined", image: "/plan3.png", fallback: "#2a1200" },
  { title: "Paths of Purification", sub: "Initiation of Spirit",                 joined: "40.5K joined", image: "/plan4.png", fallback: "#1a1a1a" },
  { title: "Story of All Stories",  sub: "Read Bhagavad Gita Together",          joined: "500K joined",  image: "/plan5.png", fallback: "#1a1a1a" },
  { title: "33 Days to Awakening",  sub: "Divine Consciousness",                 joined: "18.6K joined", image: "/plan6.png", fallback: "#2a1200" },
];

const deepenItems = [
  { title: "Self Realization", image: "/deepen1.png", fallback: "#3a1a2a" },
  { title: "Sacred Union",     image: "/deepen2.png", fallback: "#2a1a3a" },
  { title: "Inner Peace",      image: "/deepen3.png", fallback: "#0a1a2a" },
  { title: "Surrender",        image: "/deepen4.png", fallback: "#1a1a1a" },
  { title: "Divine Love",      image: "/deepen5.png", fallback: "#1a0a0a" },
  { title: "Contemplation",    image: "/deepen6.png", fallback: "#2a1a00" },
  { title: "Sacred Journey",   image: "/deepen7.png", fallback: "#0a1a2a" },
];

const mokshaPaths = [
  { title: "Introduction",   sub: "Gita in a Year: Prologue", sessions: "42 sessions", image: "/moksha1.png", fallback: "#1a1a1a" },
  { title: "Early Vedas",    sub: "Gita in a Year: Section 1", sessions: "28 sessions", image: "/moksha2.png", fallback: "#1a2a2a" },
  { title: "Upanishads",     sub: "Section 2",                 sessions: "52 sessions", image: "/moksha3.png", fallback: "#2a1a2a" },
  { title: "Bhagavad Gita",  sub: "Section 3",                 sessions: "45 sessions", image: "/moksha4.png", fallback: "#2a1a1a" },
  { title: "Yoga Sutras",    sub: "Section 4",                 sessions: "38 sessions", image: "/moksha5.png", fallback: "#1a2a1a" },
  { title: "Puranas",        sub: "Section 5",                 sessions: "45 sessions", image: "/moksha6.png", fallback: "#1a1a2a" },
  { title: "Divine Wisdom",  sub: "Messianic Checkpoint 1",    sessions: "30 sessions", image: "/moksha7.png", fallback: "#1a2a2a" },
];

/* ─── Shared scroll row hook ─── */
function useScrollTrack() {
  const ref = useRef(null);
  const [pos, setPos] = useState(0);
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setPos(max > 0 ? el.scrollLeft / max : 0);
  };
  const scrollLeft  = () => ref.current?.scrollBy({ left: -280, behavior: "smooth" });
  const scrollRight = () => ref.current?.scrollBy({ left: 280,  behavior: "smooth" });
  return { ref, pos, onScroll, scrollLeft, scrollRight };
}

/* ─── Section 1 — Spiritual Practice Plans ─── */
function SpiritualPracticePlans() {
  const { ref, pos, onScroll, scrollLeft, scrollRight } = useScrollTrack();

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <div>
          <h2 className={styles.blockHeading}>Spiritual Practice Plans</h2>
          <p className={styles.blockSubheading}>Structured paths to deepen your Sadhana</p>
        </div>
        <div className={styles.blockRight}>
          <button className={styles.seeAll}>See All →</button>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={scrollLeft}>‹</button>
            <button className={styles.navBtn} onClick={scrollRight}>›</button>
          </div>
        </div>
      </div>

      <div className={styles.track} ref={ref} onScroll={onScroll}>
        {practicePlans.map((item, i) => (
          <div key={i} className={`${styles.card} ${styles.cardTall}`}>
            <div className={styles.cardThumb} style={{ background: item.fallback }}>
              <img loading="lazy" decoding="async" src={item.image} alt={item.title} className={styles.cardImg}
                onError={(e) => { e.target.style.display = "none"; }} />
              <div className={styles.thumbGradient} />
              <button className={styles.startBtn}>Start</button>
              <div className={styles.cardInner}>
                <h4 className={styles.cardTitle}>{item.title}</h4>
                <p className={styles.cardSub}>{item.sub}</p>
                <span className={styles.cardJoined}>{item.joined}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${Math.max(pos * 100, 12)}%` }} />
      </div>
    </div>
  );
}

/* ─── Section 2 — Deepen Your Sadhana ─── */
function DeepenSadhana() {
  const { ref, pos, onScroll, scrollLeft, scrollRight } = useScrollTrack();

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <div>
          <h2 className={styles.blockHeading}>Deepen Your Sādhanā</h2>
          <p className={styles.blockSubheading}>Advanced practices for spiritual growth</p>
        </div>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={scrollLeft}>‹</button>
          <button className={styles.navBtn} onClick={scrollRight}>›</button>
        </div>
      </div>

      <div className={styles.track} ref={ref} onScroll={onScroll}>
        {deepenItems.map((item, i) => (
          <div key={i} className={`${styles.card} ${styles.cardSquare}`}>
            <div className={styles.cardThumb} style={{ background: item.fallback }}>
              <img loading="lazy" decoding="async" src={item.image} alt={item.title} className={styles.cardImg}
                onError={(e) => { e.target.style.display = "none"; }} />
              <div className={styles.thumbGradient} />
              <button className={styles.startBtn}>Start</button>
              <div className={styles.cardInner}>
                <h4 className={styles.cardTitle}>{item.title}</h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${Math.max(pos * 100, 12)}%` }} />
      </div>
    </div>
  );
}

/* ─── Section 3 — Path to Moksha ─── */
function PathToMoksha() {
  const { ref, pos, onScroll, scrollLeft, scrollRight } = useScrollTrack();

  return (
    <div className={styles.block}>
      <div className={styles.blockHeader}>
        <div>
          <h2 className={styles.blockHeading}>Path to Mokṣa</h2>
          <p className={styles.blockSubheading}>Year-long journey through sacred scriptures</p>
        </div>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={scrollLeft}>‹</button>
          <button className={styles.navBtn} onClick={scrollRight}>›</button>
        </div>
      </div>

      <div className={styles.track} ref={ref} onScroll={onScroll}>
        {mokshaPaths.map((item, i) => (
          <div key={i} className={`${styles.card} ${styles.cardBelow}`}>
            <div className={styles.cardThumb} style={{ background: item.fallback }}>
              <img loading="lazy" decoding="async" src={item.image} alt={item.title} className={styles.cardImg}
                onError={(e) => { e.target.style.display = "none"; }} />
              <div className={styles.thumbGradient} />
              <div className={styles.cardInnerBelow}>
                <h4 className={styles.cardTitleBelow}>{item.title}</h4>
                <p className={styles.cardSubBelow}>{item.sub}</p>
              </div>
            </div>
            <span className={styles.cardSessions}>{item.sessions}</span>
          </div>
        ))}
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${Math.max(pos * 100, 12)}%` }} />
      </div>
    </div>
  );
}

/* ─── Main export ─── */
function SacredPathways() {
  return (
    <section className={styles.section}>
      <div className={styles.bg} />
      <SpiritualPracticePlans />
      <DeepenSadhana />
      <PathToMoksha />
    </section>
  );
}

export default SacredPathways;