import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SpiritualChallenges.module.css";

const challenges = [
  {
    id: 1,
    badge1: "108K praying",
    badge2: "Starts in 8 days",
    title: "108-Day Mantra Sadhana",
    description:
      "Join a transformative journey of daily mantra chanting. Commit to 108 days of sacred practice and unlock deeper spiritual connection.",
    color: "#6B1428",
    accent: "#c0671e",
    image: null,
    route: "/knowledge/108-day-sadhana",
  },
  {
    id: 2,
    badge1: "75K participants",
    badge2: "Starts in 15 days",
    title: "40-Day Gita Wisdom Path",
    description:
      "Dive deep into the Bhagavad Gita with daily verse study, reflection, and practical application in modern life.",
    color: "#3b1f6b",
    accent: "#f59e42",
    image: "/gitaChallenge.png",
    route: "/knowledge/40-day-gita-wisdom",
  },
  {
    id: 3,
    badge1: "52K meditating",
    badge2: "Starts in 3 days",
    title: "21-Day Dhyan Challenge",
    description:
      "Establish a powerful daily meditation habit in 21 days. Ancient techniques, modern structure — transform your mind from within.",
    color: "#4A0B1D",
    accent: "#4ade80",
    image: "/dhyanChallenge.png",
    route: "/knowledge/21-day-dhyan",
  },
];

function SpiritualChallenges() {
  const navigate = useNavigate();
  const [scrollPos, setScrollPos] = useState(0);
  const trackRef = useRef(null);

  const handleScroll = (e) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollPos(el.scrollLeft / max);
  };

  const scrollLeft = () => {
    trackRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    trackRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <section className={styles.challengesSection}>
      <div className={styles.challengesBg} />

      <div className={styles.challengesHeader}>
        <div>
          <h2 className={styles.challengesHeading}>Spiritual Challenges</h2>
          <p className={styles.challengesSubheading}>
            Join thousands on their Sadhana journey
          </p>
        </div>
        <div className={styles.headerNav}>
          <button className={styles.arrowBtn} onClick={scrollLeft}>‹</button>
          <button className={styles.arrowBtn} onClick={scrollRight}>›</button>
        </div>
      </div>

      <div
        className={styles.challengesTrack}
        data-scroll-container-id="challenges-track"
        ref={trackRef}
        onScroll={handleScroll}
      >
        {challenges.map((ch) => (
          <div
            key={ch.id}
            className={styles.challengeCard}
            style={{ background: ch.color }}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardBadges}>
                <span className={styles.badge}>{ch.badge1}</span>
                <span className={styles.badge}>{ch.badge2}</span>
              </div>
              <h3
                className={styles.cardTitle}
                style={{ color: ch.accent }}
              >
                {ch.title}
              </h3>
              <p className={styles.cardDesc}>{ch.description}</p>
              <div className={styles.cardButtons}>
                <button 
                  className={styles.btnJoin}
                  onClick={() => navigate(ch.route)}
                >
                  Join Challenge
                </button>
                <button 
                  className={styles.btnDetails}
                  onClick={() => navigate(ch.route)}
                >
                  Details
                </button>
              </div>
            </div>
            {ch.image && (
              <div className={styles.cardImage}>
                <img src={ch.image} alt={ch.title} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${scrollPos * 100}%` }}
        />
      </div>
    </section>
  );
}

export default SpiritualChallenges;