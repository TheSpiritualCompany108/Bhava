import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DhyanChallenge21.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const resolveAudioUrl = (url) => (url?.startsWith("http") ? url : API_BASE + url);

const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds)) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
};

const mantras = [
  { number: 1,  name: "Gayatri Mantra",                                    deity: "Savitr (Rig Veda)",  duration: "34 min" },
  { number: 2,  name: "Maha Mrityunjaya Mantra",                           deity: "Shiva (Rig Veda)",   duration: "34 min" },
  { number: 3,  name: "Om (Pranava Mantra)",                               deity: "Supreme Brahman",    duration: "34 min" },
  { number: 4,  name: "Shanti Mantras",                                    deity: "Upanishads",         duration: "34 min" },
  { number: 5,  name: "Guru Mantra (Guru Brahma...)",                      deity: "Guru",               duration: "34 min" },
  { number: 6,  name: "Ganesha Mantra – Om Gam Ganapataye Namah",          deity: "Ganesha",            duration: "34 min" },
  { number: 7,  name: "Shiva Panchakshari – Om Namah Shivaya",             deity: "Shiva",              duration: "34 min" },
  { number: 8,  name: "Vishnu Mantra – Om Namo Narayanaya",                deity: "Vishnu",             duration: "34 min" },
  { number: 9,  name: "Hare Krishna Maha Mantra",                          deity: "Krishna",            duration: "34 min" },
  { number: 10, name: "Rama Taraka Mantra – Shri Ram Jai Ram Jai Jai Ram", deity: "Rama",               duration: "34 min" },
  { number: 11, name: "Hanuman Mantra – Om Hanumate Namah",                deity: "Hanuman",            duration: "34 min" },
  { number: 12, name: "Durga Mantra – Om Dum Durgayei Namah",              deity: "Durga",              duration: "34 min" },
  { number: 13, name: "Lakshmi Mantra – Om Shreem Mahalakshmyai Namah",    deity: "Lakshmi",            duration: "34 min" },
  { number: 14, name: "Saraswati Mantra – Om Aim Saraswatyai Namah",       deity: "Saraswati",          duration: "34 min" },
  { number: 15, name: "Navagraha Mantra",                                  deity: "Nine Planets",       duration: "34 min" },
  { number: 16, name: "Surya Mantra – Om Suryaya Namah",                   deity: "Surya",              duration: "34 min" },
  { number: 17, name: "Aditya Hridayam",                                   deity: "Ramayana",           duration: "34 min" },
  { number: 18, name: "Vishnu Sahasranama",                                deity: "Mahabharata",        duration: "34 min" },
  { number: 19, name: "Shiva Tandava Stotram",                             deity: "Ravana",             duration: "34 min" },
  { number: 20, name: "Hanuman Chalisa",                                   deity: "Tulsidas",           duration: "34 min" },
  { number: 21, name: "Bhagavad Gita Prayer (Sarva Dharma Verse – 18.66)", deity: "Krishna",            duration: "34 min" },
];

const completionBenefits = [
  { title: "Strong Meditation Habit",  description: "A daily practice rooted in discipline, not motivation." },
  { title: "Improved Concentration",   description: "The mind trained to rest, not wander." },
  { title: "Emotional Balance",        description: "Feelings observed, not controlled by." },
  { title: "Breath Control",           description: "Pranayama as a daily tool for nervous system regulation." },
  { title: "Spiritual Grounding",      description: "A deeper, lived connection to your inner self." },
];

function DhyanChallenge21() {
  const navigate = useNavigate();
  const [playingDay, setPlayingDay] = useState(null);
  const [audioMap, setAudioMap] = useState({});
  const [durationMap, setDurationMap] = useState({});
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("ended", () => setPlayingDay(null));

    let cancelled = false;
    fetch(`${API_BASE}/api/dhyan-audio`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!cancelled && json?.success && Array.isArray(json.data)) {
          const map = {};
          json.data.forEach((item) => { map[item.day] = item.audioUrl; });
          setAudioMap(map);

          // Probe each file's real length so the list shows actual runtime
          json.data.forEach((item) => {
            const probe = new Audio(resolveAudioUrl(item.audioUrl));
            probe.addEventListener("loadedmetadata", () => {
              if (cancelled) return;
              setDurationMap((prev) => ({ ...prev, [item.day]: probe.duration }));
            });
          });
        }
      })
      .catch(() => {
        // no audio available yet — play buttons stay inert
      });

    return () => {
      cancelled = true;
      audioRef.current?.pause();
    };
  }, []);

  const togglePlay = (num, e) => {
    e.stopPropagation();
    const url = audioMap[num];
    if (!url) return;

    if (playingDay === num) {
      audioRef.current.pause();
      setPlayingDay(null);
      return;
    }

    audioRef.current.src = resolveAudioUrl(url);
    audioRef.current.play();
    setPlayingDay(num);
  };

  return (
    <div className={styles.page}>

      {/* ── Two-Panel Layout ── */}
      <div className={styles.layout}>

        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>21-Day Dhyān Challenge</h1>

          <div className={styles.imageCard}>
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>Progress</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} />
              </div>
            </div>
            <img
              src="../21 Dhyan Challenge.png"
              alt="21-Day Dhyān Challenge"
              className={styles.heroImg}
            />
            <div className={styles.controls}>
              <button className={styles.controlBtn}>
                <span className="material-symbols-outlined">play_arrow</span>
                <span className={styles.controlLabel}>Play</span>
              </button>
              <button className={styles.controlBtn}>
                <span className="material-symbols-outlined">add_circle</span>
                <span className={styles.controlLabel}>Save</span>
              </button>
              <button className={styles.controlBtn}>
                <span className="material-symbols-outlined">share</span>
                <span className={styles.controlLabel}>Share</span>
              </button>
            </div>
          </div>

          <p className={styles.description}>
            Twenty-one days of guided meditation to transform your consciousness
            and cultivate lasting stillness. Sit, breathe, and return — every
            morning.
          </p>
        </div>

        {/* Right Side */}
        <div className={styles.rightWrapper}>
          <p className={styles.sessionsCount}>21 Sacred Mantras</p>

          <div className={styles.rightPanel}>
            <div className={styles.dayList}>
              {mantras.map((m) => {
                const isPlaying = playingDay === m.number;
                const hasAudio = Boolean(audioMap[m.number]);
                return (
                  <div
                    key={m.number}
                    className={`${styles.dayRow} ${isPlaying ? styles.dayRowActive : ""}`}
                  >
                    <span className={styles.dayBadge}>Day {m.number}</span>

                    <div className={styles.dayInfo}>
                      <p className={styles.dayTheme}>{m.name}</p>
                      <p className={styles.dayVerse}>{m.deity}</p>
                    </div>

                    <div className={styles.audioRight}>
                      {isPlaying && (
                        <div className={styles.waveBar}>
                          <span /><span /><span /><span /><span />
                        </div>
                      )}
                      <span className={styles.dayDuration}>{formatDuration(durationMap[m.number])}</span>
                      <button
                        className={`${styles.playCircleDay} ${isPlaying ? styles.playCircleDayActive : ""}`}
                        onClick={(e) => togglePlay(m.number, e)}
                        disabled={!hasAudio}
                        title={hasAudio ? "" : "Audio not uploaded yet"}
                        style={!hasAudio ? { opacity: 0.35, cursor: "not-allowed" } : undefined}
                      >
                        <span className="material-symbols-outlined">
                          {isPlaying ? "pause" : "play_arrow"}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ── Completion Benefits ── */}
      <section className={styles.completionSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>What You Gain</p>
          <h2 className={styles.sectionTitle}>
            After <span className={styles.accent}>21 Days</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            After completing this 21-Day Dhyan Challenge, you will have established a strong
            meditation habit, improved concentration, emotional balance, breath control,
            and deeper spiritual grounding.
          </p>
          <div className={styles.benefitsGrid}>
            {completionBenefits.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin Your 21-Day Dhyān Practice</h2>
            <p className={styles.ctaSubtext}>
              Commit to 21 mornings. Sit. Breathe. Return.
              <br />The practice will do the rest.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Join the Challenge</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>
                Back to Knowledge
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default DhyanChallenge21;
