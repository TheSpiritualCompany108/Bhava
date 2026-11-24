import React, { useRef, useState } from "react";
import styles from "./PrayersForKids.module.css";

const kidsContent = [
  { title: "Shlokas for Kids",   sub: "Simple Sanskrit Verses", lessons: "12 lessons", image: "/kids1.png", fallback: "#2a3a1a", gold: false },
  { title: "Bedtime Prayers",    sub: "Evening Rituals",         lessons: "10 lessons", image: "/kids2.png", fallback: "#1a1a2a", gold: true  },
  { title: "Festival Songs",     sub: "Celebration & Joy",       lessons: "15 lessons", image: "/kids3.png", fallback: "#0d0d1f", gold: false },
  { title: "Mythology Stories",  sub: "Tales with Morals",       lessons: "20 lessons", image: "/kids4.png", fallback: "#2a1a1a", gold: false },
  { title: "Morning Routine",    sub: "Start the Day Right",     lessons: "8 lessons",  image: "/kids5.png", fallback: "#1f1f10", gold: false },
  { title: "Values in Song",     sub: "Character Building",      lessons: "14 lessons", image: "/kids6.png", fallback: "#0f2a1f", gold: false },
];

function PrayersForKids() {
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
          <h2 className={styles.heading}>Prayers for Kids</h2>
          <p className={styles.subheading}>Introducing children to Dharmic values</p>
        </div>
        <div className={styles.nav}>
          <button className={styles.navBtn} onClick={() => trackRef.current?.scrollBy({ left: -280, behavior: "smooth" })}>‹</button>
          <button className={styles.navBtn} onClick={() => trackRef.current?.scrollBy({ left: 280, behavior: "smooth" })}>›</button>
        </div>
      </div>

      <div className={styles.track} data-scroll-container-id="prayers-kids-track" ref={trackRef} onScroll={handleScroll}>
        {kidsContent.map((item, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.thumb} style={{ background: item.fallback }}>
              <img loading="lazy" decoding="async" src={item.image} alt={item.title} className={styles.img} onError={(e) => { e.target.style.display = "none"; }} />
              <div className={styles.overlay} />
            </div>
            <h4 className={styles.cardTitle} style={{ color: item.gold ? "#f59e42" : "#ffffff" }}>{item.title}</h4>
            <p className={styles.cardSub}>{item.sub}</p>
            <span className={styles.cardLessons}>{item.lessons}</span>
          </div>
        ))}
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${Math.max(scrollPos * 100, 14)}%` }} />
      </div>

      {/* Kids Devotion Journey Banner */}
      <div className={styles.bannerWrap}>
        <div className={styles.banner}>
          <div className={styles.bannerLeft}>
            <div className={styles.badges}>
              <span className={styles.badge}>23K praying</span>
              <span className={styles.badgeGold}>Starts in 11 days</span>
            </div>
            <h3 className={styles.bannerTitle}>Kids' Devotion Journey</h3>
            <p className={styles.bannerDesc}>
              A 40-day spiritual adventure designed for children to discover the beauty of Dharma through stories, music, and prayers.
            </p>
            <div className={styles.bannerBtns}>
              <button className={styles.btnJoin}>Join Challenge</button>
              <button className={styles.btnDetails}>Details</button>
            </div>
          </div>
          <div className={styles.bannerRight}>
            <img loading="lazy" decoding="async" src="/kidsDevotion.png" alt="Kids Devotion" className={styles.bannerImg} onError={(e) => { e.target.style.display = "none"; }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PrayersForKids;