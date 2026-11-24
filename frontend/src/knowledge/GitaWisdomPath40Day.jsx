import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GitaWisdomPath40Day.module.css";
import { useRitualPlan } from "../hooks/useRitualPlan";
import { RitualPlanBar, RitualPlanModal, RitualDayTracker, isDayLocked } from "../components/RitualPlanner";

const PLAN_KEY = "bhava_ritual_plan_gita40";

const stages = [
  {
    id: 1,
    name: "Understanding Dharma",
    tagline: "The Foundation of Right Living",
    dayRange: "Day 1–10",
    color: "#295F8A",
    purpose:
      "Understand the fundamental principles of life's purpose and your inner conflicts. This stage introduces the core teachings of the Bhagavad Gita.",
    universalMessage:
      "Every human faces internal battles. The Gita shows that confusion is the beginning of wisdom.",
    days: [
      { day: 1,  theme: "Human struggle and inner conflict",  verse: "BG 1.28–30", duration: "12:30" },
      { day: 2,  theme: "Seeking divine guidance",            verse: "BG 2.7",     duration: "11:45" },
      { day: 3,  theme: "Nature of the eternal soul",         verse: "BG 2.20",    duration: "13:10" },
      { day: 4,  theme: "Duty above emotion",                 verse: "BG 2.31",    duration: "10:55" },
      { day: 5,  theme: "Balance in success and failure",     verse: "BG 2.38",    duration: "12:20" },
      { day: 6,  theme: "Right action without attachment",    verse: "BG 2.47",    duration: "14:05" },
      { day: 7,  theme: "Calm mind and clear vision",         verse: "BG 2.50",    duration: "11:30" },
      { day: 8,  theme: "Control of the senses",              verse: "BG 2.58",    duration: "12:45" },
      { day: 9,  theme: "Overcoming desire and anger",        verse: "BG 3.37",    duration: "13:00" },
      { day: 10, theme: "Living with discipline",             verse: "BG 6.5",     duration: "11:50" },
    ],
  },
  {
    id: 2,
    name: "Karma & Discipline",
    tagline: "Action Without Attachment",
    dayRange: "Day 11–20",
    color: "#295F8A",
    purpose:
      "Learn the art of selfless action and discipline. Perform your duties with complete focus while releasing attachment to outcomes.",
    universalMessage:
      "Discipline is the bridge between intention and transformation. Action without ego is the secret of peace.",
    days: [
      { day: 11, theme: "Karma Yoga — selfless service",       verse: "BG 3.19",    duration: "13:20" },
      { day: 12, theme: "Leading by example",                  verse: "BG 3.21",    duration: "12:00" },
      { day: 13, theme: "Selfless work and ego-free action",   verse: "BG 3.30",    duration: "11:40" },
      { day: 14, theme: "Mind as friend or enemy",             verse: "BG 6.6",     duration: "14:10" },
      { day: 15, theme: "Meditation and mental stability",     verse: "BG 6.11–15", duration: "13:50" },
      { day: 16, theme: "Moderation in all aspects of life",  verse: "BG 6.17",    duration: "12:15" },
      { day: 17, theme: "Focus and sustained awareness",       verse: "BG 6.26",    duration: "11:55" },
      { day: 18, theme: "Building inner strength",             verse: "BG 6.35",    duration: "12:35" },
      { day: 19, theme: "Devotion expressed through action",   verse: "BG 9.27",    duration: "13:05" },
      { day: 20, theme: "Faith and unwavering determination",  verse: "BG 9.22",    duration: "11:25" },
    ],
  },
  {
    id: 3,
    name: "Knowledge & Self-Realization",
    tagline: "Seeing the Divine in All",
    dayRange: "Day 21–30",
    color: "#295F8A",
    purpose:
      "Transcend the ego and experience divine presence. Open your perception to the sacred nature of existence and your true identity.",
    universalMessage:
      "True knowledge is realizing that the divine exists in all beings and your true self is beyond the body.",
    days: [
      { day: 21, theme: "Divine presence everywhere",               verse: "BG 10.20",  duration: "13:30" },
      { day: 22, theme: "God reflected in nature",                  verse: "BG 10.41",  duration: "12:10" },
      { day: 23, theme: "Universal vision and cosmic perspective",  verse: "BG 11.8",   duration: "14:20" },
      { day: 24, theme: "Awe and humility before the infinite",     verse: "BG 11.12",  duration: "13:45" },
      { day: 25, theme: "Detachment from ego",                      verse: "BG 13.7–8", duration: "12:50" },
      { day: 26, theme: "Understanding the cycle of nature",        verse: "BG 13.22",  duration: "11:35" },
      { day: 27, theme: "Three Gunas — energetic qualities",        verse: "BG 14.5",   duration: "13:15" },
      { day: 28, theme: "Transcending limited qualities",           verse: "BG 14.20",  duration: "12:40" },
      { day: 29, theme: "Divine consciousness within",              verse: "BG 15.7",   duration: "11:20" },
      { day: 30, theme: "Life as an inverted tree",                 verse: "BG 15.1",   duration: "13:55" },
    ],
  },
  {
    id: 4,
    name: "Devotion & Surrender",
    tagline: "Freedom Through Surrender",
    dayRange: "Day 31–40",
    color: "#295F8A",
    purpose:
      "Complete your journey by surrendering to the divine. True freedom comes from releasing the illusion of ego and accepting divine will.",
    universalMessage:
      "Surrender is not weakness but freedom. When we release the ego's grip, we find lasting victory.",
    days: [
      { day: 31, theme: "Faith shapes your destiny",                    verse: "BG 17.3",  duration: "12:25" },
      { day: 32, theme: "Purity of body, speech, and intention",        verse: "BG 17.14", duration: "13:40" },
      { day: 33, theme: "Power of selfless charity",                    verse: "BG 17.20", duration: "11:15" },
      { day: 34, theme: "Releasing ego's false control",                verse: "BG 18.16", duration: "12:55" },
      { day: 35, theme: "True wisdom sees unity in diversity",          verse: "BG 18.20", duration: "14:00" },
      { day: 36, theme: "Courage through steady determination",         verse: "BG 18.33", duration: "13:25" },
      { day: 37, theme: "Lasting happiness from within",                verse: "BG 18.37", duration: "11:50" },
      { day: 38, theme: "Living your authentic path",                   verse: "BG 18.47", duration: "12:35" },
      { day: 39, theme: "Surrender to divine will",                     verse: "BG 18.66", duration: "13:10" },
      { day: 40, theme: "Victory through wisdom and righteousness",     verse: "BG 18.78", duration: "14:30" },
    ],
  },
];

const completionBenefits = [
  {
    title: "Ancient Wisdom Applied",
    description:
      "Transform 2,500-year-old teachings into practical guidance for modern life challenges.",
  },
  {
    title: "Inner Clarity",
    description:
      "Move from confusion to confidence through understanding your dharma and life's true purpose.",
  },
  {
    title: "Liberation from Ego",
    description:
      "Release the burden of control and perfectionism by embracing surrender and divine trust.",
  },
  {
    title: "Spiritual Awakening",
    description:
      "Recognize the divine presence within yourself and in all beings around you.",
  },
  {
    title: "Transformed Living",
    description:
      "Live with purpose, discipline, and compassion — becoming the wisest version of yourself.",
  },
];

function GitaWisdomPath40Day() {
  const navigate = useNavigate();
  const [expandedStage, setExpandedStage] = useState(null);
  const [playingDay, setPlayingDay] = useState(null);
  const ritual = useRitualPlan(PLAN_KEY, "40-Day Gita Wisdom Path");

  const toggleStage = (idx) => {
    setExpandedStage(expandedStage === idx ? null : idx);
  };

  const togglePlay = (dayNum, e) => {
    e.stopPropagation();
    setPlayingDay(playingDay === dayNum ? null : dayNum);
  };

  return (
    <div className={styles.page}>

      {/* ── Two-Panel Layout ── */}
      <div className={styles.layout}>

        {/* Left Panel */}
        <div className={styles.leftPanel}>
          <h1 className={styles.title}>40-Day Gita Wisdom Path</h1>

          <div className={styles.imageCard}>
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>Progress</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} />
              </div>
            </div>
            <img loading="lazy" decoding="async"
              src="../40 Day Gita Wisdom Path.webp"
              alt="40-Day Gita Wisdom Path"
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
            Journey through the timeless teachings of the Bhagavad Gita over
            40 sacred days. Transform confusion into clarity, attachment into
            freedom, and ego into divine consciousness.
          </p>
        </div>

        {/* Right Side */}
        <div className={styles.rightWrapper}>
          <p className={styles.sessionsCount}>4 Stages · 40 Days</p>

          <RitualPlanBar ritual={ritual} />

          <div className={styles.rightPanel}>
            {stages.map((stage, idx) => (
              <div key={stage.id} className={styles.sessionBlock}>

                {/* Stage Header — clickable */}
                <button
                  className={styles.stageHeader}
                  onClick={() => toggleStage(idx)}
                >
                  <span
                    className={styles.stageBadge}
                    style={{ background: stage.color }}
                  >
                    Stage {stage.id}
                  </span>
                  <div className={styles.stageHeaderInfo}>
                    <span className={styles.stageHeaderName}>{stage.name}</span>
                    <span className={styles.stageHeaderDays}>{stage.dayRange}</span>
                  </div>
                  <span className={styles.stageHeaderTagline}>
                    "{stage.tagline}"
                  </span>
                  <span className={styles.chevron}>
                    {expandedStage === idx ? "▲" : "▼"}
                  </span>
                </button>

                {/* Expanded Day-wise Audio List */}
                {expandedStage === idx && (
                  <div className={styles.dayListWrapper}>
                    <p className={styles.stagePurposeInline}>{stage.purpose}</p>

                    <div className={styles.dayList}>
                      {stage.days.map((d) => {
                        const isPlaying = playingDay === d.day;
                        const isLocked = isDayLocked(ritual, d.day);
                        return (
                          <div
                            key={d.day}
                            className={`${styles.dayRow} ${isPlaying ? styles.dayRowActive : ""}`}
                          >
                            <div className={styles.dayRowTop}>
                              <span className={styles.dayBadge}>Day {d.day}</span>

                              <div className={styles.dayInfo}>
                                <p className={styles.dayTheme}>{d.theme}</p>
                                <p className={styles.dayVerse}>{d.verse}</p>
                              </div>

                              <div className={styles.audioRight}>
                                {isPlaying && (
                                  <div className={styles.waveBar}>
                                    <span /><span /><span /><span /><span />
                                  </div>
                                )}
                                <span className={styles.dayDuration}>{d.duration}</span>
                                <button
                                  className={`${styles.playCircleDay} ${isPlaying ? styles.playCircleDayActive : ""}`}
                                  onClick={(e) => togglePlay(d.day, e)}
                                  disabled={isLocked}
                                  title={isLocked ? "Complete the previous day to unlock" : ""}
                                  style={isLocked ? { opacity: 0.35, cursor: "not-allowed" } : undefined}
                                >
                                  <span className="material-symbols-outlined">
                                    {isLocked ? "lock" : isPlaying ? "pause" : "play_arrow"}
                                  </span>
                                </button>
                              </div>
                            </div>

                            <RitualDayTracker ritual={ritual} day={d.day} />
                          </div>
                        );
                      })}
                    </div>

                    <p className={styles.universalMsgInline}>
                      "{stage.universalMessage}"
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>

      </div>

      <RitualPlanModal ritual={ritual} />

      {/* ── Completion Benefits ── */}
      <section className={styles.completionSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            After <span className={styles.accent}>40 Days</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Following the 40-Day Gita Wisdom Path, you will emerge with a
            deeper understanding of your purpose, greater peace in your heart,
            and a transformed perspective on life.
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
            <h2 className={styles.ctaTitle}>Begin Your 40-Day Gita Wisdom Path</h2>
            <p className={styles.ctaSubtext}>
              40 days. One verse at a time. One reflection at a time.
              <br />
              The transformation begins when you open your heart.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start the Challenge</button>
              <button
                className={styles.btnSecondary}
                onClick={() => navigate("/knowledge")}
              >
                Back to Knowledge
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default GitaWisdomPath40Day;
