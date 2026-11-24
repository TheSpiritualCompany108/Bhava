import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #5a2a0a 0%, #5a2a0acc 30%, transparent 65%)";

const phases = [
  {
    days: "Chapters 1–5",
    name: "Setting & The Soul",
    tagline: "From confusion to clarity of the eternal self",
    color: "#8B4A0A",
    purpose:
      "The opening chapters introduce Arjuna's dilemma on the battlefield and Krishna's foundational teachings on the eternal soul. This section establishes the difference between body and soul, duty without attachment, and the path of selfless action.",
    keyChapters: [
      "Ch 1 — Arjuna's Dilemma: the starting point of spiritual awakening",
      "Ch 2 — The Yoga of Knowledge: the soul is eternal and indestructible",
      "Ch 3 — The Yoga of Action: perform duty without attachment to results",
      "Ch 4 — Knowledge and Wisdom: true knowledge removes ignorance",
      "Ch 5 — The Yoga of Renunciation: action without ego leads to peace",
    ],
    coreTeachings: [
      "The soul is eternal — the body may perish but the soul continues",
      "Act with dedication without becoming attached to outcomes",
      "True renunciation is performing action without ego",
      "When we face conflict it becomes an opportunity for wisdom",
    ],
    innerExperience: [
      "Growing understanding of the soul beyond the body",
      "Release from fear through knowledge of the eternal self",
      "Clarity about duty and selfless action",
      "Peace arising from non-attachment to results",
    ],
    goal: ["Overcome fear and confusion about life and death", "Understand the difference between body and soul", "Begin performing duty with detachment", "Experience stillness through right action"],
    goalNote: "These five chapters form the philosophical foundation of the entire Gita.",
  },
  {
    days: "Chapters 6–9",
    name: "Practice & Devotion",
    tagline: "Meditation, realization, and the power of bhakti",
    color: "#6E1B21",
    purpose:
      "These chapters move from philosophy into practice. Krishna teaches meditation to discipline the mind, explains his divine nature, and reveals that simple devotion and faith lead directly to divine grace.",
    keyChapters: [
      "Ch 6 — Dhyana Yoga: meditation helps control the mind",
      "Ch 7 — Knowledge and Realization: everything is connected to the Divine",
      "Ch 8 — The Eternal Divine: remember God at all times for liberation",
      "Ch 9 — Royal Knowledge: devotion and faith lead to divine grace",
    ],
    coreTeachings: [
      "A disciplined mind experiences deep inner peace",
      "Understanding divine presence in everything deepens devotion",
      "Constant remembrance of God brings spiritual freedom",
      "Simple devotion can bring profound spiritual transformation",
    ],
    innerExperience: [
      "Meditation becoming a lived experience, not just a concept",
      "Sense of divine presence in nature and daily life",
      "Devotion arising spontaneously from understanding",
      "Mind becoming steadier with practice",
    ],
    goal: ["Establish a consistent meditation practice", "See the divine presence in all things", "Experience the grace of simple devotion", "Develop remembrance of God throughout the day"],
    goalNote: "Chapter 9 reveals that devotion is the most accessible and powerful path.",
  },
  {
    days: "Chapters 10–13",
    name: "Divine Nature",
    tagline: "The infinite cosmos and the knowing soul",
    color: "#1B4430",
    purpose:
      "Krishna describes his divine glory in all aspects of creation, reveals his cosmic universal form to Arjuna, explains the path of pure devotion, and teaches the distinction between the body (field) and the soul (knower).",
    keyChapters: [
      "Ch 10 — Divine Glory: the universe reflects the Divine",
      "Ch 11 — Universal Form: the Divine is infinite and beyond understanding",
      "Ch 12 — Bhakti Yoga: pure devotion leads to spiritual fulfillment",
      "Ch 13 — The Field and the Knower: the body is the field, soul is the knower",
    ],
    coreTeachings: [
      "Seeing the Divine in nature deepens spiritual awareness",
      "Realizing the vastness of the Divine inspires humility",
      "Sincerity and faith are more important than rituals",
      "True wisdom lies in understanding our spiritual nature",
    ],
    innerExperience: [
      "Awe and humility at the vastness of creation",
      "Devotion becoming unconditional and pure",
      "Clarity about the difference between body and soul",
      "Deep recognition of the divine in all of life",
    ],
    goal: ["Cultivate awe and humility before the Divine", "Practice pure unconditional devotion", "Understand the body as a temporary vehicle", "Recognize the divine presence in all of creation"],
    goalNote: "Chapter 12, Bhakti Yoga, is often considered the heart of the entire Gita.",
  },
  {
    days: "Chapters 14–18",
    name: "Liberation",
    tagline: "Transcending nature and attaining freedom",
    color: "#422868",
    purpose:
      "The final chapters explain the three qualities of nature (gunas), the Supreme Self beyond the physical world, divine vs. demonic tendencies, types of faith, and the ultimate summary — surrender to the Divine leads to liberation.",
    keyChapters: [
      "Ch 14 — The Three Gunas: Sattva, Rajas, Tamas shape human nature",
      "Ch 15 — The Supreme Self: recognize divine presence within for liberation",
      "Ch 16 — Divine and Demonic Qualities: cultivate humility, compassion, truth",
      "Ch 17 — Three Types of Faith: pure faith aligned with wisdom leads to growth",
      "Ch 18 — Moksha: surrender to Divine + selfless duty = liberation",
    ],
    coreTeachings: [
      "Spiritual growth involves moving beyond the three gunas",
      "The Supreme Self is beyond the physical world",
      "Cultivating positive qualities (humility, compassion, truthfulness) leads to progress",
      "By surrendering and acting selflessly, one attains liberation",
    ],
    innerExperience: [
      "Recognition of one's own gunas and their effects",
      "Deepening surrender and trust in the Divine",
      "Acts of service becoming offerings rather than duties",
      "Peace arising from complete surrender",
    ],
    goal: ["Understand how the gunas influence your behavior", "Cultivate divine qualities in daily life", "Practice surrendered action in all things", "Experience the freedom that comes from wisdom and devotion"],
    goalNote: "Chapter 18 summarises the entire Gita: surrender to the Divine, perform your duty, attain liberation.",
  },
];

const benefits = [
  { icon: "", title: "Life's Purpose", description: "Understanding the deeper purpose of life through Krishna's timeless teachings to Arjuna." },
  { icon: "", title: "Inner Strength", description: "Develop inner strength and clarity to face life's moral dilemmas with wisdom and equanimity." },
  { icon: "", title: "Overcome Fear", description: "Overcome fear and confusion through understanding the eternal, indestructible nature of the soul." },
  { icon: "", title: "Devotion & Awareness", description: "Cultivate devotion, spiritual awareness, and a living relationship with the Divine." },
  { icon: "", title: "Balanced Living", description: "Live a balanced and meaningful life by integrating Gita wisdom into every thought and action." },
];

function BhagavadGitaJourney() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${styles.heroHalf}`}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Learning Path · 456K joined</p>
            <h1 className={styles.heroTitle}>Bhagavad Gita Journey</h1>
            <p className={styles.heroSubtitle}>
              A guided exploration of all 18 chapters — from Arjuna's confusion to Krishna's revelation of{" "}
              <em>duty, devotion, knowledge, and the path to liberation</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>18</strong> Chapters</span>
              <span className={styles.heroMetaItem}><strong>4</strong> Sections</span>
              <span className={styles.heroMetaItem}><strong>Daily</strong> Reflection</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Learning%20Paths/Bhagvat%20Gita%20Journey.webp" alt="Bhagavad Gita Journey" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>18 Chapters in 4 Sections</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Gita Journey</span> Structure</h2>
          <p className={styles.sectionSubtitle}>Each section reveals a deeper dimension of spiritual wisdom — from the nature of the soul to the path of liberation.</p>
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

      <section className={styles.detailSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Chapter Guide</p>
          <h2 className={styles.sectionTitle}>All <span className={styles.accent}>18 Chapters</span> in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any section to explore its key chapters, core teachings, and life applications.</p>
          <div className={styles.phaseDetailList}>
            {phases.map((p, idx) => (
              <div key={p.name} className={`${styles.phaseDetailRow} ${expanded === idx ? styles.phaseDetailRowOpen : ""}`}>
                <button className={styles.phaseDetailHeader} onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <span className={styles.phaseNumber} style={{ background: p.color }}>Section {idx + 1}</span>
                  <span className={styles.phaseDetailName}>{p.name} <span className={styles.phaseDetailDays}>({p.days})</span></span>
                  <span className={styles.phaseDetailTagline}>"{p.tagline}"</span>
                  <span className={styles.phaseChevron}>{expanded === idx ? "▲" : "▼"}</span>
                </button>
                {expanded === idx && (
                  <div className={styles.phaseDetailBody}>
                    <div className={styles.phaseDetailGrid}>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Key Chapters</p>
                        <ul className={styles.phaseDetailUl}>{p.keyChapters.map((c, i) => <li key={i}>{c}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Core Teachings</p>
                        <ul className={styles.phaseDetailUl}>{p.coreTeachings.map((t, i) => <li key={i}>{t}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Inner Experience</p>
                        <ul className={styles.phaseDetailUl}>{p.innerExperience.map((e, i) => <li key={i}>{e}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Spiritual Goal</p>
                        <ul className={styles.phaseDetailUl}>{p.goal.map((g, i) => <li key={i}>{g}</li>)}</ul>
                        <p className={styles.phaseDetailNote}>{p.goalNote}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.completionSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>What You Gain</p>
          <h2 className={styles.sectionTitle}>Benefits of the <span className={styles.accent}>Gita Journey</span></h2>
          <p className={styles.sectionSubtitle}>Studying the Bhagavad Gita helps individuals understand the purpose of life, overcome fear, and live with clarity, devotion, and inner strength.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #5a2a0a 0%, #8B4A0A 60%, #3a1a05 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin the Gita Journey Today</h2>
            <p className={styles.ctaSubtext}>
              This journey invites the seeker to transform knowledge into wisdom.<br />
              Apply the teachings of the Gita in daily life and experience the freedom they bring.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start with Chapter 1</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BhagavadGitaJourney;
