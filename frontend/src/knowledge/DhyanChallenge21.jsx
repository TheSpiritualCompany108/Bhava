import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DhyanChallenge21.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const resolveAudioUrl = (url) => (url?.startsWith("http") ? url : API_BASE + url);

const SAVED_KEY = "bhava_saved_practices";
const PRACTICE_SLUG = "dhyan-challenge-21";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [isSaved, setIsSaved] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      return saved.includes(PRACTICE_SLUG);
    } catch {
      return false;
    }
  });
  const [linkCopied, setLinkCopied] = useState(false);
  const audioRef = useRef(null);
  const sequentialRef = useRef(false);
  const playingDayRef = useRef(null);
  const audioMapRef = useRef({});
  audioMapRef.current = audioMap;

  const playDay = (day) => {
    const url = audioMapRef.current[day];
    if (!url) return;
    audioRef.current.src = resolveAudioUrl(url);
    audioRef.current.play();
    playingDayRef.current = day;
    setPlayingDay(day);
  };

  const stopPlayback = () => {
    sequentialRef.current = false;
    playingDayRef.current = null;
    setPlayingDay(null);
  };

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener("timeupdate", () => setCurrentTime(audioRef.current.currentTime));
    audioRef.current.addEventListener("loadedmetadata", () => setTrackDuration(audioRef.current.duration));
    audioRef.current.addEventListener("ended", () => {
      const nextDay = sequentialRef.current
        ? mantras.find((m) => m.number > playingDayRef.current && audioMapRef.current[m.number])?.number
        : null;
      if (nextDay) {
        playDay(nextDay);
      } else {
        stopPlayback();
      }
    });

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
    if (!audioMap[num]) return;

    sequentialRef.current = false; // manual single-track play breaks out of "play all"

    if (playingDay === num) {
      audioRef.current.pause();
      stopPlayback();
      return;
    }

    playDay(num);
  };

  const playAll = () => {
    if (playingDay) {
      audioRef.current.pause();
      stopPlayback();
      return;
    }
    const firstDay = mantras.find((m) => audioMap[m.number])?.number;
    if (!firstDay) return;
    sequentialRef.current = true;
    playDay(firstDay);
  };

  const handleSeek = (e) => {
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleSave = () => {
    let saved = [];
    try {
      saved = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
    } catch {
      saved = [];
    }
    const next = isSaved ? saved.filter((s) => s !== PRACTICE_SLUG) : [...saved, PRACTICE_SLUG];
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    const shareData = {
      title: "21-Day Dhyān Challenge — BHAVA",
      text: "Twenty-one days of guided meditation to transform your consciousness and cultivate lasting stillness.",
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the native share sheet — no action needed
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // clipboard unavailable — nothing more we can do silently
    }
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
              <button className={styles.controlBtn} onClick={playAll}>
                <span className="material-symbols-outlined">{playingDay ? "pause" : "play_arrow"}</span>
                <span className={styles.controlLabel}>{playingDay ? "Pause" : "Play"}</span>
              </button>
              <button className={styles.controlBtn} onClick={toggleSave}>
                <span className="material-symbols-outlined">{isSaved ? "check_circle" : "add_circle"}</span>
                <span className={styles.controlLabel}>{isSaved ? "Saved" : "Save"}</span>
              </button>
              <button className={styles.controlBtn} onClick={handleShare}>
                <span className="material-symbols-outlined">{linkCopied ? "check" : "share"}</span>
                <span className={styles.controlLabel}>{linkCopied ? "Copied!" : "Share"}</span>
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
                    <div className={styles.dayRowTop}>
                      <span className={styles.dayBadge}>Day {m.number}</span>

                      <div className={styles.dayInfo}>
                        <p className={styles.dayTheme}>{m.name}</p>
                        <p className={styles.dayVerse}>{m.deity}</p>
                      </div>

                      <div className={styles.audioRight}>
                        <span className={styles.dayDuration}>
                          {isPlaying ? formatDuration(trackDuration) : formatDuration(durationMap[m.number])}
                        </span>
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

                    {isPlaying && (
                      <div className={styles.seekRow}>
                        <span className={styles.seekTime}>{formatDuration(currentTime)}</span>
                        <input
                          type="range"
                          className={styles.seekBar}
                          min={0}
                          max={trackDuration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className={styles.seekTime}>{formatDuration(trackDuration)}</span>
                      </div>
                    )}
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
