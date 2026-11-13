import React, { useRef, useState } from "react";
import styles from "./MorningPracticesAndSeekers.module.css";

/* ─── Morning Practices Data ─── */
const morningPractices = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: "Daily Mantras",
    sub: "Sacred Sound",
    desc: "Morning invocations for clarity",
    detail: "15-28 min",
    color: "#3a1a0a",
    iconColor: "#f59e42",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: "Surya Namaskar",
    sub: "Sun Salutation",
    desc: "Physical & spiritual alignment",
    detail: "4-30 min",
    color: "#4a1a1a",
    iconColor: "#e05a6a",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
      </svg>
    ),
    title: "Vedic Hymns",
    sub: "Ancient Wisdom",
    desc: "Listen, reflect, and absorb",
    detail: "5 min",
    color: "#2a1a4a",
    iconColor: "#a06ae0",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      </svg>
    ),
    title: "Pranayama",
    sub: "Breath Control",
    desc: "Awaken vital energy within",
    detail: "10-20 min",
    color: "#4A0B1D",
    iconColor: "#4ae0a0",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    title: "Trataka",
    sub: "Candle Gazing",
    desc: "Focus and inner stillness",
    detail: "7 min",
    color: "#1a2a4a",
    iconColor: "#6aa0e0",
  },
];

/* ─── Spiritual Seekers Data ─── */
const seekerTopics = [
  { icon: "", title: "Understanding Brahman", sub: "Ultimate Reality",   sessions: "8 sessions" },
  { icon: "", title: "Stories from Puranas",  sub: "Ancient Narratives", sessions: "12 sessions" },
  { icon: "", title: "Ayurveda Basics",        sub: "Life Science",       sessions: "6 sessions" },
  { icon: "", title: "Sanskrit Prayers",       sub: "Sacred Language",    sessions: "10 sessions" },
  { icon: "", title: "Karma & Rebirth",        sub: "Vedic Philosophy",   sessions: "9 sessions" },
  { icon: "", title: "Deity Worship",          sub: "Puja Practices",     sessions: "14 sessions" },
];

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

function MorningPracticesAndSeekers() {
  const practicesRef = useRef(null);
  const seekersRef   = useRef(null);
  const [practicesScroll, setPracticesScroll] = useState(0);
  const [seekersScroll,   setSeekersScroll]   = useState(0);

  const handleScroll = (ref, setter) => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setter(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section className={styles.section}>
      <div className={styles.bg} />

      {/* ── Morning Practices ── */}
      <div className={styles.block}>
        <div className={styles.blockHeader}>
          <div>
            <h2 className={styles.blockHeading}>Morning Practices</h2>
            <p className={styles.blockSubheading}>Start your day with sacred routines</p>
          </div>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={() => practicesRef.current?.scrollBy({ left: -380, behavior: "smooth" })}>‹</button>
            <button className={styles.navBtn} onClick={() => practicesRef.current?.scrollBy({ left: 380, behavior: "smooth" })}>›</button>
          </div>
        </div>

        <div
          className={styles.practicesTrack}
          ref={practicesRef}
          onScroll={() => handleScroll(practicesRef, setPracticesScroll)}
        >
          {morningPractices.map((p, i) => (
            <div key={i} className={styles.practiceCard} style={{ background: p.color }}>
              <div className={styles.cardBg} />
              <div className={styles.practiceTop}>
                <div className={styles.practiceIconBox} style={{ color: p.iconColor }}>
                  {p.icon}
                </div>
                <div className={styles.practiceMeta}>
                  <h4 className={styles.practiceTitle}>{p.title}</h4>
                  <p className={styles.practiceSub}>{p.sub}</p>
                </div>
              </div>
              <p className={styles.practiceDesc}>{p.desc}</p>
              <div className={styles.practiceDetail}>
                <span className={styles.detailDot} />
                <span className={styles.detailText}>{p.detail}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${Math.max(practicesScroll * 100, 16)}%` }} />
        </div>
      </div>

      {/* ── For Spiritual Seekers ── */}
      <div className={styles.block} style={{ paddingTop: "32px" }}>
        <div className={styles.blockHeader}>
          <div>
            <h2 className={styles.blockHeading}>For Spiritual Seekers</h2>
            <div className={styles.headingLine} />
          </div>
          <div className={styles.nav}>
            <button className={styles.navBtn} onClick={() => seekersRef.current?.scrollBy({ left: -340, behavior: "smooth" })}>‹</button>
            <button className={styles.navBtn} onClick={() => seekersRef.current?.scrollBy({ left: 340, behavior: "smooth" })}>›</button>
          </div>
        </div>

        <div
          className={styles.seekersTrack}
          ref={seekersRef}
          onScroll={() => handleScroll(seekersRef, setSeekersScroll)}
        >
          {seekerTopics.map((t, i) => (
            <div key={i} className={styles.seekerCard}>
              <div className={styles.seekerIconBox}>
                <UsersIcon />
              </div>
              <h4 className={styles.seekerTitle}>{t.title}</h4>
              <p className={styles.seekerSub}>{t.sub}</p>
              <span className={styles.seekerSessions}>{t.sessions}</span>
            </div>
          ))}
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${Math.max(seekersScroll * 100, 16)}%` }} />
        </div>
      </div>
    </section>
  );
}

export default MorningPracticesAndSeekers;