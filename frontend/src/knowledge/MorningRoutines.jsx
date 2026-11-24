import React, { useRef, useState } from "react";
import styles from "./MorningRoutines.module.css";

const routines = [
  { icon: "", title: "Gītā Dhyāna",   sub: "Gita Contemplation", duration: "10 min", color: "#1e3a5f" },
  { icon: "", title: "Dainika Pūjā",  sub: "Daily Worship",       duration: "20 min", color: "#5f1e2a" },
  { icon: "", title: "Śānti Pāṭha",   sub: "Peace Mantras",        duration: "5 min",  color: "#2b1e5f" },
  { icon: "", title: "Guru Vandana",   sub: "Salutations to the Teacher", duration: "8 min", color: "#3b1e5f" },
  { icon: "", title: "Iṣṭa Devatā",   sub: "Deity Meditation",     duration: "15 min", color: "#1e4a3a" },
];

const playlists = [
  { title: "Morning Playlist",       sub: "Music for the Morning",   image: "/playlist1.png", fallbackColor: "#4a2a1a" },
  { title: "Focus Playlist",         sub: "For Study & Work",        image: "/playlist2.png", fallbackColor: "#1a3a4a" },
  { title: "Adoration, Vol. I",      sub: "Devotional Classics",     image: "/playlist3.png", fallbackColor: "#2a1a4a" },
  { title: "The Sacred Sessions",    sub: "Kirtan & Bhajan",         image: "/playlist4.png", fallbackColor: "#3a3a1a" },
  { title: "Chant Playlist",         sub: "Sacred Mantras",          image: "/playlist5.png", fallbackColor: "#1a4a2a" },
  { title: "Morning Prayer Lofi",    sub: "Peaceful Ambience",        image: "/playlist6.png", fallbackColor: "#2a4a1a" },
  { title: "Mysteries & Meditation", sub: "Contemplative Music",     image: "/playlist7.png", fallbackColor: "#4a1a2a" },
];

function MorningRoutines() {
  const routinesRef = useRef(null);
  const playlistRef = useRef(null);
  const [routineScroll, setRoutineScroll] = useState(0);
  const [playlistScroll, setPlaylistScroll] = useState(0);

  const handleScroll = (ref, setter) => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setter(max > 0 ? el.scrollLeft / max : 0);
  };

  return (
    <section className={styles.morningSection}>
      <div className={styles.morningBg} />

      {/* ── Morning Routines ── */}
      <div className={styles.blockHeader}>
        <div>
          <h2 className={styles.blockHeading}>Morning Routines</h2>
          <p className={styles.blockSubheading}>
            Sacred practices to start your day
          </p>
        </div>
        <div className={styles.headerNav}>
          <button
            className={styles.arrowBtn}
            onClick={() => routinesRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
          >‹</button>
          <button
            className={styles.arrowBtn}
            onClick={() => routinesRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
          >›</button>
        </div>
      </div>

      <div
        className={styles.routinesTrack}
        ref={routinesRef}
        onScroll={() => handleScroll(routinesRef, setRoutineScroll)}
      >
        {routines.map((r, i) => (
          <div
            key={i}
            className={styles.routineCard}
            style={{ background: r.color }}
          >
            <div className={styles.routineIconRow}>
              <span className={styles.routineIcon}>{r.icon}</span>
            </div>
            <h4 className={styles.routineTitle}>{r.title}</h4>
            <p className={styles.routineSub}>{r.sub}</p>
            <span className={styles.routineDuration}>{r.duration}</span>
          </div>
        ))}
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.max(routineScroll * 100, 20)}%` }}
        />
      </div>

      {/* ── Sacred Music ── */}
      <div className={styles.blockHeader} style={{ marginTop: "48px" }}>
        <div>
          <h2 className={styles.blockHeading}>Sacred Music</h2>
          <p className={styles.blockSubheading}>
            Devotional playlists for your spiritual journey
          </p>
        </div>
        <div className={styles.headerNav}>
          <button
            className={styles.arrowBtn}
            onClick={() => playlistRef.current?.scrollBy({ left: -260, behavior: "smooth" })}
          >‹</button>
          <button
            className={styles.arrowBtn}
            onClick={() => playlistRef.current?.scrollBy({ left: 260, behavior: "smooth" })}
          >›</button>
        </div>
      </div>

      <div
        className={styles.playlistTrack}
        ref={playlistRef}
        onScroll={() => handleScroll(playlistRef, setPlaylistScroll)}
      >
        {playlists.map((p, i) => (
          <div key={i} className={styles.playlistCard}>
            <div
              className={styles.playlistThumb}
              style={{ background: p.fallbackColor }}
            >
              <img loading="lazy" decoding="async"
                src={p.image}
                alt={p.title}
                className={styles.playlistImg}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <h4 className={styles.playlistTitle}>{p.title}</h4>
            <p className={styles.playlistSub}>{p.sub}</p>
          </div>
        ))}
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.max(playlistScroll * 100, 12)}%` }}
        />
      </div>
    </section>
  );
}

export default MorningRoutines;