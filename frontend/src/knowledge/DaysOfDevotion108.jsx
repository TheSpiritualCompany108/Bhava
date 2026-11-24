import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const ACCENT = "#8B1A5A";
const HERO_GRADIENT = "linear-gradient(to right, #5a1a3a 0%, #5a1a3acc 30%, transparent 65%)";

const phases = [
  {
    days: "Day 1–27",
    name: "Awakening Devotion",
    tagline: "Build a daily spiritual routine",
    color: "#8B1A5A",
    purpose:
      "The first phase focuses on creating awareness and developing a simple daily devotional routine. This phase helps calm the mind, establish spiritual discipline, and open the heart to devotion.",
    dailyPractices: [
      "Morning gratitude prayer",
      "5 minutes silent meditation",
      "Chanting Om — 21 times",
      "Reading a short verse from sacred scriptures",
    ],
    weeklyFocus: [
      "Week 1 — Awareness of breath",
      "Week 2 — Gratitude and prayer",
      "Week 3 — Introduction to mantra chanting",
    ],
    innerExperience: [
      "Growing stillness in the morning mind",
      "Natural inclination toward gratitude",
      "First experience of mantra vibration",
      "Emerging sense of spiritual discipline",
    ],
    outcome: ["Develop spiritual discipline", "Establish a consistent morning routine", "Open the heart to devotion", "Experience the peace of silence"],
    outcomeNote: "This phase plants the seed of bhakti that will grow through the remaining 81 days.",
  },
  {
    days: "Day 28–54",
    name: "Building Daily Bhakti",
    tagline: "Deepen devotional practice",
    color: "#6E1B21",
    purpose:
      "In this stage, devotional practices become deeper and more structured. This phase strengthens spiritual focus and develops a stronger connection with the chosen deity or divine form.",
    dailyPractices: [
      "Lighting a diya or incense during prayer",
      "Chanting a chosen mantra with Japa Mala",
      "10–15 minutes meditation",
      "Listening to devotional bhajans or kirtans",
    ],
    weeklyFocus: [
      "Japa Mala mantra chanting",
      "Read one verse from Bhagavad Gita",
      "Suggested mantras: Om Namah Shivaya, Om Namo Bhagavate Vasudevaya, Gayatri Mantra",
    ],
    innerExperience: [
      "Deepening emotional connection with the Divine",
      "Japa Mala becoming a natural anchor",
      "Bhajans opening the devotional heart",
      "Sense of sacred space forming each morning",
    ],
    outcome: ["Build emotional connection with the Divine", "Establish Japa Mala practice", "Develop a stronger devotional focus", "Feel the rhythm of daily bhakti"],
    outcomeNote: "Devotion becomes structured and feels natural, no longer effortful.",
  },
  {
    days: "Day 55–81",
    name: "Inner Transformation",
    tagline: "Spiritual growth and awareness",
    color: "#422868",
    purpose:
      "The third phase encourages deeper self-reflection and spiritual awareness. This phase cultivates inner peace, self-discipline, and spiritual clarity through deepening meditation and sacred study.",
    dailyPractices: [
      "15–20 minutes meditation",
      "Chanting sacred mantras — Gayatri Mantra, Om Namah Shivaya",
      "Reading teachings from Bhagavad Gita or Upanishads",
      "Practicing kindness and compassion in daily life",
    ],
    weeklyFocus: [
      "Self-reflection journal",
      "Gratitude practice",
      "Compassion toward others",
      "108 mantra chanting sessions",
    ],
    innerExperience: [
      "Deep stillness during meditation",
      "Clarity of mind and emotional balance",
      "Compassion extending naturally to others",
      "Feeling the teachings become lived experience",
    ],
    outcome: ["Mental clarity and inner peace", "Self-discipline becomes effortless", "Spiritual awareness expands", "Devotion integrates into all actions"],
    outcomeNote: "The practitioner begins to notice devotion shaping their thoughts and interactions naturally.",
  },
  {
    days: "Day 82–108",
    name: "Living Devotion",
    tagline: "Integrate devotion into life",
    color: "#8B6914",
    purpose:
      "The final phase integrates devotion into everyday life. Every action becomes an offering to the Divine. Devotion becomes a way of life — natural, effortless, and all-encompassing.",
    dailyPractices: [
      "20 minutes meditation",
      "Mantra chanting using Japa Mala",
      "Reflection on personal growth and gratitude",
      "Offering selfless service (Seva)",
    ],
    weeklyFocus: [
      "Living with awareness",
      "Helping others as sacred service",
      "Practicing kindness in every interaction",
      "Surrender of actions to the Divine",
    ],
    innerExperience: [
      "Devotion as a continuous background awareness",
      "Service becoming a source of joy",
      "Deep gratitude for ordinary moments",
      "Sense of unity with the Divine in all things",
    ],
    outcome: ["Devotion becomes a natural lifestyle", "Every action is offered to the Divine", "Inner peace is steady and effortless", "Seva (service) deepens spiritual connection"],
    outcomeNote: "At the end of 108 days, the practitioner does not 'complete' the journey — they become it.",
  },
];

const benefits = [
  { icon: "", title: "Inner Peace", description: "Greater inner peace and emotional balance cultivated through consistent daily devotional practice." },
  { icon: "", title: "Mindfulness", description: "Improved concentration and mindfulness through mantra chanting and structured meditation." },
  { icon: "", title: "Spiritual Connection", description: "A stronger, more personal connection with the Divine through bhakti and daily prayer." },
  { icon: "", title: "Reduced Stress", description: "Reduced stress and anxiety as devotional practices calm the mind and nervous system." },
  { icon: "", title: "Purpose & Gratitude", description: "A deeper sense of purpose and gratitude as devotion transforms the way you experience life." },
];

function DaysOfDevotion108() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={`${styles.hero} ${styles.heroHalf}`}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Learning Path · 287K joined</p>
            <h1 className={styles.heroTitle}>108 Days of Devotion</h1>
            <p className={styles.heroSubtitle}>
              A sacred 108-day journey to develop a deep and consistent connection with the Divine through{" "}
              <em>bhakti, mantra, meditation, scripture, and selfless service</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>4</strong> Phases</span>
              <span className={styles.heroMetaItem}><strong>108</strong> Days</span>
              <span className={styles.heroMetaItem}><strong>Daily</strong> Practice</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Learning%20Paths/108%20Days%20of%20Devotion.webp" alt="108 Days of Devotion" className={styles.heroImage} />
          </div>
        </div>
      </section>

      {/* Phases Overview */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Structure of the Journey</p>
          <h2 className={styles.sectionTitle}>Four Phases of <span className={styles.accent}>Sacred Devotion</span></h2>
          <p className={styles.sectionSubtitle}>
            Each phase builds upon the last — from awakening awareness to living bhakti as a way of life.
          </p>
          <div className={styles.phasesGrid}>
            {phases.map((p) => (
              <div key={p.name} className={styles.phaseCard} style={{ borderTop: `3px solid ${p.color}` }}>
                <span className={styles.phaseDays} style={{ color: p.color }}>{p.days}</span>
                <h3 className={styles.phaseTitle}>{p.name}</h3>
                <p className={styles.phaseTagline}>"{p.tagline}"</p>
                <p className={styles.phaseDesc}>{p.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Accordion */}
      <section className={styles.detailSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>108-Day Plan</span> in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any phase to expand its full daily practices, weekly focus, and transformation goals.</p>
          <div className={styles.phaseDetailList}>
            {phases.map((p, idx) => (
              <div key={p.name} className={`${styles.phaseDetailRow} ${expanded === idx ? styles.phaseDetailRowOpen : ""}`}>
                <button className={styles.phaseDetailHeader} onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <span className={styles.phaseNumber} style={{ background: p.color }}>Phase {idx + 1}</span>
                  <span className={styles.phaseDetailName}>{p.name} <span className={styles.phaseDetailDays}>({p.days})</span></span>
                  <span className={styles.phaseDetailTagline}>"{p.tagline}"</span>
                  <span className={styles.phaseChevron}>{expanded === idx ? "▲" : "▼"}</span>
                </button>
                {expanded === idx && (
                  <div className={styles.phaseDetailBody}>
                    <div className={styles.phaseDetailGrid}>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Daily Practices</p>
                        <ul className={styles.phaseDetailUl}>{p.dailyPractices.map((d, i) => <li key={i}>{d}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Weekly Focus</p>
                        <ul className={styles.phaseDetailUl}>{p.weeklyFocus.map((w, i) => <li key={i}>{w}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Inner Experience</p>
                        <ul className={styles.phaseDetailUl}>{p.innerExperience.map((e, i) => <li key={i}>{e}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Transformation Goal</p>
                        <ul className={styles.phaseDetailUl}>{p.outcome.map((o, i) => <li key={i}>{o}</li>)}</ul>
                        <p className={styles.phaseDetailNote}>{p.outcomeNote}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.completionSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>What You Gain</p>
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>108 Days of Devotion</span></h2>
          <p className={styles.sectionSubtitle}>Practicing devotion consistently for 108 days brings many spiritual and mental benefits. Over time, devotion becomes natural and effortless.</p>
          <div className={styles.benefitsGrid}>
            {benefits.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                <span className={styles.benefitIcon}>{b.icon}</span>
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection} style={{ background: `linear-gradient(135deg, #5a1a3a 0%, #8B1A5A 60%, #3a0a25 100%)` }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin Your 108-Day Sacred Commitment</h2>
            <p className={styles.ctaSubtext}>
              This journey is not about perfection but about building a sincere daily connection with the Divine presence in life.<br />
              Through prayer, meditation, and devotion, this journey gradually transforms the mind and heart.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start Day 1 Today</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DaysOfDevotion108;
