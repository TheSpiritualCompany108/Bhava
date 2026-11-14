import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SacredCommitments.module.css";
import MantraSadhana108 from "./MantraSadhana108";
import GitaWisdomPath40Day from "./GitaWisdomPath40Day";
import DhyanChallenge21 from "./DhyanChallenge21";

// eslint-disable-next-line react-refresh/only-export-components
export const commitmentRoutes = [
  { path: "108-day-sadhana",     element: <MantraSadhana108 /> },
  { path: "40-day-gita-wisdom",  element: <GitaWisdomPath40Day /> },
  { path: "21-day-dhyan",        element: <DhyanChallenge21 /> },
];

const commitments = [
  {
    title: "108-Day Mantra Sādhana",
    highlights: ["Discipline is built over time.", "A guided daily structure supports you.", "Commit to the practice with Bhava:"],
    buttonText: "Begin the 108-Day Practice",
    color: "#470017",
    image: "/Sacred%20Commitments%20for%20the%20Disciplined%20Soul/108-Day%20Mantra%20Sadhana.png",
    route: "/knowledge/108-day-sadhana",
  },
  {
    title: "40-Day Gita Wisdom Path",
    highlights: ["Understanding takes time.", "A structured path brings clarity.", "Study a little each day with Bhava:"],
    buttonText: "Begin the 40-Day Path",
    color: "#2B6291",
    image: "/Sacred%20Commitments%20for%20the%20Disciplined%20Soul/40%20Day%20Gita%20Wisdom%20Path.png",
    route: "/knowledge/40-day-gita-wisdom",
  },
  {
    title: "21-Day Dhyān Challenge",
    highlights: ["The mind rarely stays still.", "A guided practice creates steadiness.", "Sit with it daily."],
    buttonText: "Begin the 21-Day Practice with Bhava:",
    color: "#351751",
    image: "/Sacred%20Commitments%20for%20the%20Disciplined%20Soul/21%20Dhyan%20Challenge.png",
    route: "/knowledge/21-day-dhyan",
  },
];

function SacredCommitments() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [commitHovered, setCommitHovered] = useState(false);
  const trackOuterRef = useRef(null);
  const [outerWidth, setOuterWidth] = useState(0);

  useEffect(() => {
    const el = trackOuterRef.current;
    if (!el) return;
    setOuterWidth(el.clientWidth);
    const ro = new ResizeObserver(() => setOuterWidth(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const PEEK = 88;
  const GAP = 16;
  const cardWidth = outerWidth ? outerWidth - PEEK - GAP : 0;
  const step = cardWidth + GAP;

  const prevSlide = () => setActiveSlide((p) => Math.max(0, p - 1));
  const nextSlide = () => setActiveSlide((p) => Math.min(commitments.length - 1, p + 1));

  return (
    <section className={styles.commitmentsSection}>
      <div className={styles.commitmentsHeader}>
        <h2 className={styles.commitmentsHeading}>
          <span className={styles.commitmentsHeadingAccent}>A structured practice</span>{" "}
          <span className={styles.commitmentsHeadingPrimary}>makes it possible.</span>
        </h2>
      </div>

      <div
        className={styles.commitTrackWrapper}
        onMouseEnter={() => setCommitHovered(true)}
        onMouseLeave={() => setCommitHovered(false)}
      >
        <div className={styles.commitTrackOuter} ref={trackOuterRef}>
          <div
            className={styles.commitTrack}
            style={{ transform: `translateX(${-activeSlide * step}px)` }}
          >
            {commitments.map((item, idx) => (
              <div
                key={idx}
                className={styles.commitmentCard}
                data-scroll-id={`commit-${idx}`}
                style={{ "--card-color": item.color, width: cardWidth || undefined }}
              >
                <div className={styles.commitCardLeft} style={{ background: item.color }}>
                  <div className={styles.commitCardLeftInner}>
                    <span className={styles.commitSubtitle}>{item.subtitle}</span>
                    <span className={styles.commitDevotees}>{item.devotees}</span>
                    <h3 className={styles.commitTitle}>{item.title}</h3>
                    <p className={styles.commitDescription}>{item.description}</p>
                    <ul className={styles.commitHighlights}>
                      {item.highlights.map((h, i) => (
                        <li key={i}>
                          <span className={styles.commitDot} />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <button
                      className={styles.btnJoinChallenge}
                      onClick={() => { if (item.route) { navigate(item.route); } }}
                    >
                      {item.buttonText || "Join Challenge"}
                    </button>
                  </div>
                </div>

                <div className={styles.commitCardRight} style={{ backgroundColor: item.color }}>
                  <img src={item.image} alt={item.title} className={styles.commitCardImage} />
                  <div
                    className={styles.commitCardImageOverlay}
                    style={{
                      background: `linear-gradient(to right, ${item.color} 0%, ${item.color}99 18%, transparent 50%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={`${styles.commitEdgeArrow} ${styles.commitEdgeArrowLeft} ${
            commitHovered && activeSlide > 0
              ? styles.commitEdgeArrowVisible
              : styles.commitEdgeArrowHidden
          }`}
          onClick={prevSlide}
          aria-label="Previous"
        >
          ‹
        </button>

        <button
          className={`${styles.commitEdgeArrow} ${
            commitHovered && activeSlide < commitments.length - 1
              ? styles.commitEdgeArrowVisible
              : styles.commitEdgeArrowHidden
          }`}
          onClick={nextSlide}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      <div className={styles.commitNavRow}>
        <div className={styles.commitDots}>
          {commitments.map((_, i) => (
            <button
              key={i}
              className={`${styles.commitDot2} ${i === activeSlide ? styles.commitDotActive : ""}`}
              onClick={() => setActiveSlide(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default SacredCommitments;
