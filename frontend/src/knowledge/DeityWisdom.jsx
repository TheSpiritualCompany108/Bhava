import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #4a0a0a 0%, #4a0a0acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "Understanding Devatā",
    tagline: "The divine as symbolic expressions of one reality",
    color: "#4A0A0A",
    purpose:
      "In Hindu philosophy, Devatā refers to divine beings representing different aspects of the universal reality — Brahman. Deities are not separate gods competing with each other but symbolic expressions of one supreme consciousness. Each represents a unique cosmic function such as creation, protection, wisdom, or transformation.",
    keyTeachings: [
      "Ekam Sat Vipra Bahudha Vadanti — Truth is one, sages describe it in many ways",
      "Devatā comes from 'Div' — to shine or illuminate",
      "All deities are expressions of the same supreme consciousness (Brahman)",
      "Worship of a deity becomes a path to developing those same qualities within",
      "Devotion to Devatās cultivates love, humility, and spiritual awareness",
    ],
    deities: [
      "Brahma — Creator of the universe: knowledge and creativity",
      "Vishnu — Preserver: balance, protection, compassion",
      "Shiva — Transformer: spiritual awakening, meditation, detachment",
    ],
    symbolism: [
      "Deities are symbolic maps of cosmic and human consciousness",
      "Their attributes (vahanas, weapons, mudras) convey philosophical teachings",
      "Understanding symbolism transforms ritual into spiritual insight",
    ],
    goal: ["Understand the philosophical basis of Hindu deity worship", "Recognize deities as expressions of one supreme reality", "Begin developing the qualities each deity represents", "Experience worship as a path to inner transformation"],
    goalNote: "The ultimate purpose of understanding Devatās is spiritual growth — not external ritual but inner cultivation.",
  },
  {
    days: "Module 2",
    name: "The Trimurti & Major Deities",
    tagline: "Creation, preservation, transformation — and beyond",
    color: "#6E1B21",
    purpose:
      "The Trimurti — Brahma, Vishnu, and Shiva — represents the three primary cosmic forces. This module also explores the major goddesses and powerful deities that form the living heart of Hindu spiritual practice.",
    keyTeachings: [
      "Brahma — Creation: origin of knowledge and existence",
      "Vishnu — Preservation: his avatars (Rama, Krishna, Narasimha) restore dharma",
      "Shiva — Transformation: destroyer of ignorance, the supreme yogi",
      "Goddess Lakshmi — Prosperity: material and spiritual abundance, harmony",
      "Goddess Saraswati — Wisdom: knowledge, learning, music, creativity",
      "Goddess Durga — Strength: divine courage and protection against negativity",
      "Ganesha — Remover of obstacles: wisdom, new beginnings, clarity",
      "Hanuman — Devotion and strength: faith, service, loyalty",
    ],
    deities: [
      "Ganesha's elephant head — wisdom and intelligence",
      "Shiva's third eye — higher awareness beyond the ordinary",
      "Saraswati's veena — harmony between knowledge and expression",
      "Vishnu's discus — protection and cosmic order",
    ],
    symbolism: [
      "Each deity's form is a teaching in symbolic language",
      "Attributes represent qualities we cultivate through devotion",
      "Stories of deities illustrate universal spiritual truths",
    ],
    goal: ["Know the role and significance of the Trimurti", "Understand the spiritual meaning behind major goddesses", "Learn the symbolism of Ganesha, Hanuman, and key deities", "Begin devotional practice with a chosen deity"],
    goalNote: "50 Hindu deities are explained in detail — each represents a divine quality that exists within every human being.",
  },
  {
    days: "Module 3",
    name: "Devotional Stories & Mythology",
    tagline: "Sacred stories that carry timeless wisdom",
    color: "#1B4430",
    purpose:
      "Stories of the deities are not mere mythology — they are teachings in narrative form. Each story carries a universal spiritual lesson about wisdom, devotion, surrender, and the triumph of dharma. This module brings the Devatās alive through their sacred narratives.",
    keyTeachings: [
      "Ganesha and Kartikeya — wisdom vs. speed: Ganesha's insight wins",
      "Hanuman crossing the ocean — faith and devotion give immense power",
      "Krishna and the Bhagavad Gita — perform duty without attachment",
      "Narasimha — the Divine appears in forms we don't expect",
      "Churning of the Ocean — great things arise through collective effort and surrender",
    ],
    deities: [
      "Story of Ganesha — True wisdom comes from understanding deeper truth",
      "Story of Hanuman — Faith and devotion give immense inner power",
      "Story of Krishna — Perform duty without attachment to results",
      "Avatars of Vishnu — The Divine restores balance in times of crisis",
    ],
    symbolism: [
      "Each story contains layers of symbolic meaning",
      "Stories are best understood through meditation and contemplation",
      "Applying story lessons to daily life transforms understanding into wisdom",
    ],
    goal: ["Study key stories of Ganesha, Hanuman, Krishna, and Vishnu", "Extract the spiritual lessons embedded in each narrative", "Apply story wisdom to real-life situations and relationships", "Experience how mythology becomes lived spiritual teaching"],
    goalNote: "Devotional stories are the bridge between philosophical teaching and lived spiritual experience.",
  },
  {
    days: "Module 4",
    name: "Daily Deity Practice",
    tagline: "Integrating Devatā wisdom into everyday life",
    color: "#422868",
    purpose:
      "The final module provides a complete daily devotional routine centered on the Devatās. Through mantra chanting, meditation, morning prayer, and evening reflection, the practitioner cultivates the divine qualities of each deity in their own life.",
    keyTeachings: [
      "Daily practice: light diya, chant Om 11 times, offer gratitude prayer",
      "Monday — Shiva meditation: transformation and inner silence",
      "Tuesday — Hanuman prayer: devotion, discipline, and strength",
      "Wednesday — Ganesha mantra: wisdom and removing obstacles",
      "Thursday — Vishnu devotion: preservation, balance, compassion",
      "Friday — Lakshmi prayer: abundance, harmony, and gratitude",
      "Saturday — Shani reflection: patience, karma, and discipline",
      "Sunday — Surya meditation: vitality, clarity, and divine light",
    ],
    deities: [
      "Evening reflection: Did I practice kindness?",
      "Evening reflection: Did I remain calm and patient?",
      "Evening reflection: What spiritual lesson did I learn today?",
      "End practice with: Om Shanti Shanti Shanti",
    ],
    symbolism: [
      "Each day's deity quality becomes a lens for that day's experiences",
      "Weekly rotation covers the full spectrum of divine qualities",
      "Mantra chanting anchors the quality in awareness",
    ],
    goal: ["Establish a complete daily devotional routine", "Connect with a different divine quality each day of the week", "Experience how deity contemplation transforms daily consciousness", "Cultivate the divine qualities of the Devatās within yourself"],
    goalNote: "The wisdom of the Devatās teaches that all divine qualities already exist within every human being. Devotion awakens them.",
  },
];

const benefits = [
  { icon: "", title: "Inner Qualities", description: "Cultivate positive divine qualities — wisdom, courage, compassion, creativity — through focused deity practice." },
  { icon: "", title: "Devotion", description: "Develop love, humility, and devotional awareness through mantra, temple practice, and sacred stories." },
  { icon: "", title: "Deeper Understanding", description: "Understand the profound philosophical and symbolic teachings embedded in Hindu mythology and deity symbolism." },
  { icon: "", title: "Divine Connection", description: "Experience a living connection with the divine presence through consistent daily devotional practice." },
  { icon: "", title: "Self-Realization", description: "Realize that the divine qualities of the Devatās already exist within you — devotion awakens what is already there." },
];

function DeityWisdom() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${styles.heroHalf}`}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Learning Path · 523K joined</p>
            <h1 className={styles.heroTitle}>Deity Wisdom</h1>
            <p className={styles.heroSubtitle}>
              Understanding Devatā in Hindu spiritual tradition — where{" "}
              <em>each deity is a symbolic expression of one supreme consciousness and a path to inner transformation</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>50+</strong> Deities</span>
              <span className={styles.heroMetaItem}><strong>4</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>Daily</strong> Practice</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Learning%20Paths/Deity%20Wisdom.webp" alt="Deity Wisdom" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Hindu Mythology Learning Course</p>
          <h2 className={styles.sectionTitle}>Four Modules of <span className={styles.accent}>Divine Wisdom</span></h2>
          <p className={styles.sectionSubtitle}>From the philosophical meaning of Devatā to a daily devotional practice — each module brings you closer to the divine qualities within yourself.</p>
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
          <p className={styles.eyebrowCenter}>Complete Deity Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Devatā Wisdom</span> Course in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore its deities, teachings, symbolism, and devotional practices.</p>
          <div className={styles.phaseDetailList}>
            {phases.map((p, idx) => (
              <div key={p.name} className={`${styles.phaseDetailRow} ${expanded === idx ? styles.phaseDetailRowOpen : ""}`}>
                <button className={styles.phaseDetailHeader} onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <span className={styles.phaseNumber} style={{ background: p.color }}>Mod {idx + 1}</span>
                  <span className={styles.phaseDetailName}>{p.name} <span className={styles.phaseDetailDays}>({p.days})</span></span>
                  <span className={styles.phaseDetailTagline}>"{p.tagline}"</span>
                  <span className={styles.phaseChevron}>{expanded === idx ? "▲" : "▼"}</span>
                </button>
                {expanded === idx && (
                  <div className={styles.phaseDetailBody}>
                    <div className={styles.phaseDetailGrid}>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Key Teachings</p>
                        <ul className={styles.phaseDetailUl}>{p.keyTeachings.map((t, i) => <li key={i}>{t}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Deities Covered</p>
                        <ul className={styles.phaseDetailUl}>{p.deities.map((d, i) => <li key={i}>{d}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Symbolism</p>
                        <ul className={styles.phaseDetailUl}>{p.symbolism.map((s, i) => <li key={i}>{s}</li>)}</ul>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Deity Wisdom</span></h2>
          <p className={styles.sectionSubtitle}>Through devotion and contemplation, individuals learn to cultivate positive qualities, develop inner discipline, and experience the divine presence both within and throughout the universe.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #4a0a0a 0%, #6E1B21 60%, #2a0505 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin the Deity Wisdom Journey</h2>
            <p className={styles.ctaSubtext}>
              The divine qualities represented by the Devatās already exist within you.<br />
              Devotion and understanding awaken what was always present.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start with Module 1</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DeityWisdom;
