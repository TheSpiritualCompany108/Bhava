import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #3a1a2a 0%, #3a1a2acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "Understanding Bhakti & Divine Grace",
    tagline: "The path of love and surrender to the Divine",
    color: "#6A2A3A",
    purpose:
      "Divine Grace refers to the blessings and compassion that flow from the Divine toward sincere devotees. Grace is not something that can be demanded or forced — it flows naturally when a person lives with sincerity, humility, and devotion. Bhakti, the path of devotion, teaches that the Divine is not distant but present within every living being and in every aspect of the universe.",
    keyTeachings: [
      "Divine Grace — the benevolent influence of the Divine that supports spiritual growth",
      "Grace flows naturally when a person lives with sincerity, humility, and faith",
      "Bhakti — the path of love and devotion toward the Divine",
      "Devotion can be expressed through prayer, chanting, service, meditation, and song",
      "The Divine is not distant but present within every being and throughout creation",
      "Sincerity of heart is more important than elaborate ritual",
    ],
    practices: [
      "Begin each morning by acknowledging the Divine presence within and around you",
      "Chant one divine name or mantra with full attention for 5 minutes",
      "Offer one simple prayer of gratitude before eating or sleeping",
      "Throughout the day, pause and remind yourself: 'The Divine is present in this moment'",
    ],
    innerExperience: [
      "A quiet sense of not being alone — the first subtle experience of divine support",
      "Gratitude arising spontaneously as grace is recognised in ordinary moments",
      "Heart becoming softer and more open through consistent devotional awareness",
      "The sense that life is guided rather than merely driven by personal effort",
    ],
    goal: ["Understand the meaning of divine grace and how it is cultivated", "Begin a personal devotional practice grounded in sincerity", "Recognise moments of grace in daily life", "Approach the Divine with love rather than fear or obligation"],
    goalNote: "Grace is not earned through perfect ritual — it is attracted by the sincerity of love and the humility of genuine surrender.",
  },
  {
    days: "Module 2",
    name: "Nine Forms of Devotion — Navadha Bhakti",
    tagline: "Nine doorways into divine love",
    color: "#3A2A6A",
    purpose:
      "Traditional teachings describe nine forms of devotion — Navadha Bhakti — each representing a different way of expressing love for the Divine. These nine forms together offer a complete map of the devotional heart, from listening and singing to service and ultimate surrender. Every devotee naturally inclines toward one or more of these expressions, and all are equally valid paths.",
    keyTeachings: [
      "Shravana — listening to sacred teachings, stories, and the names of the Divine",
      "Kirtana — singing the praises of the Divine with love and full attention",
      "Smarana — constant remembrance of the Divine in thought and heart",
      "Pada-sevana — serving the Divine through service to others",
      "Archana — worship and prayer offered with flowers, light, and devotion",
      "Vandana — prostration and expressions of humility before the Divine",
      "Dasya — servitude: approaching the Divine as a devoted servant",
      "Sakhya — friendship: cultivating an intimate personal relationship with the Divine",
      "Atma-nivedana — complete surrender of the self to the Divine will",
    ],
    practices: [
      "Identify which form of Navadha Bhakti resonates most deeply with your nature",
      "Practice one form daily for one week — observe how it affects the heart",
      "Listen to sacred kirtans or teachings (Shravana) for 15 minutes each day",
      "Try Smarana: set three reminders throughout the day to simply remember the Divine",
    ],
    innerExperience: [
      "Each form of devotion evoking a distinct quality of love and presence",
      "Kirtana dissolving mental chatter through the joy of sacred song",
      "Smarana creating a continuous thread of awareness connecting daily life to the Divine",
      "Atma-nivedana — even partial surrender — bringing profound relief and peace",
    ],
    goal: ["Know all nine forms of Navadha Bhakti and their qualities", "Identify and develop the devotional forms most natural to you", "Experience how different forms of devotion affect the heart and mind", "Begin moving from external practice toward inner devotional awareness"],
    goalNote: "All nine forms of Navadha Bhakti flow toward the same ocean — the experience of divine love as the deepest reality of one's own existence.",
  },
  {
    days: "Module 3",
    name: "Stories of Great Devotees",
    tagline: "Lives that reveal the power of pure devotion",
    color: "#1B4430",
    purpose:
      "The stories of great devotees are among the most powerful teachings in Hindu tradition. Meera Bai, Prahlada, and Hanuman each demonstrate through lived experience what pure devotion looks like — its courage, its joy, its unwavering quality in the face of opposition. These are not distant ideals but living examples of what becomes possible when the heart is completely given.",
    keyTeachings: [
      "Meera Bai — princess who surrendered everything to her devotion to Krishna through song",
      "True devotion transcends all social, familial, and cultural obstacles",
      "Prahlada — a child whose faith in Vishnu remained fearless even against his own father's opposition",
      "Faith and devotion protect the sincere devotee — divine support appears when human support fails",
      "Hanuman — the perfect expression of devotion through unwavering service and loyalty to Rama",
      "Selfless service offered from love is the highest form of devotion",
    ],
    practices: [
      "Read or listen to the story of Meera Bai — let her love for Krishna inspire your own practice",
      "Reflect on Prahlada: where in your life does devotion require courage?",
      "Study Hanuman's example of service — perform one act of devoted service today",
      "Write a short reflection: which devotee's story speaks most directly to your own experience?",
    ],
    innerExperience: [
      "Meera Bai's fearless love revealing how much your own devotion is still held back by self-consciousness",
      "Prahlada's story awakening courage — the sense that faith is stronger than opposition",
      "Hanuman's complete self-offering inspiring a deeper quality of service in daily life",
      "Stories dissolving abstraction: devotion becomes real, human, and possible",
    ],
    goal: ["Study the three great stories of devotion and the lessons each carries", "Apply the courage of Meera Bai, the faith of Prahlada, and the service of Hanuman", "Identify where in your own life devotion calls for greater courage or surrender", "Allow sacred stories to deepen and personalise your own devotional practice"],
    goalNote: "Great devotees are not historical figures alone — they are mirrors showing what the human heart becomes when it turns completely toward the Divine.",
  },
  {
    days: "Module 4",
    name: "Living with Devotion",
    tagline: "Bringing bhakti into every moment of daily life",
    color: "#422868",
    purpose:
      "The final module establishes a complete devotional routine that weaves bhakti into the fabric of everyday life. Through morning devotion, midday awareness, evening prayer, and a weekly practice rotating through different divine qualities, devotion gradually becomes not a separate activity but the very tone and quality of how one moves through the world.",
    keyTeachings: [
      "Morning devotion: light a lamp, chant Om or a mantra, offer a prayer of gratitude",
      "Midday awareness: Am I acting with kindness? Am I mindful of my actions?",
      "Evening prayer: chant a calming mantra, reflect on the day, express gratitude",
      "Monday — Shiva devotion: transformation and inner silence",
      "Tuesday — Hanuman prayer: devotion, discipline, and strength",
      "Wednesday — Ganesha worship: wisdom and removing obstacles",
      "Thursday — Vishnu devotion: preservation, balance, and compassion",
      "Friday — Lakshmi prayer: abundance, harmony, and gratitude",
      "Saturday — Shani reflection: patience, karma, and discipline",
      "Sunday — Surya meditation: vitality, clarity, and divine light",
    ],
    practices: [
      "Establish a 10–15 minute morning devotional practice and maintain it for 30 days",
      "Set a midday mindfulness reminder: one conscious pause to remember the Divine",
      "Before sleeping: chant Om Shanti three times, express gratitude, pray for guidance",
      "Follow the weekly deity rotation — let each day carry a different quality of awareness",
    ],
    innerExperience: [
      "Morning practice beginning to feel like meeting rather than obligation",
      "The weekly deity rotation creating a rich variety of devotional qualities throughout the week",
      "Evening prayer becoming a natural completion — the day offered back to the Divine",
      "Life itself gradually beginning to feel like a continuous act of devotion",
    ],
    goal: ["Establish a consistent daily devotional routine", "Connect with different divine qualities through the weekly practice", "Experience how devotion transforms the texture of ordinary daily life", "Arrive at a state where bhakti is not a practice but a way of being"],
    goalNote: "When devotion becomes continuous — not confined to prayer time — the practitioner begins to see the Divine in every face, every moment, every experience.",
  },
];

const benefits = [
  { icon: "", title: "Inner Peace", description: "Devotional practice calms the mind and dissolves anxiety, creating a stable foundation of peace." },
  { icon: "", title: "Compassion", description: "Bhakti softens the heart, naturally cultivating deeper compassion and empathy toward others." },
  { icon: "", title: "Faith", description: "Regular devotion builds genuine faith — a trust in divine wisdom that sustains you through difficulty." },
  { icon: "", title: "Spiritual Connection", description: "Experience a living, personal relationship with the Divine through consistent devotional practice." },
  { icon: "", title: "Purpose", description: "Devotion gives every action meaning, transforming ordinary life into a continuous spiritual offering." },
];

function DivineGrace() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${styles.heroHalf}`}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Latest Teaching · Devotion</p>
            <h1 className={styles.heroTitle}>Divine Grace</h1>
            <p className={styles.heroSubtitle}>
              The path of Bhakti — where{" "}
              <em>sincere devotion, humility, and love attract divine grace and guide the heart toward lasting peace and spiritual fulfillment</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>4</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>9</strong> Forms of Devotion</span>
              <span className={styles.heroMetaItem}><strong>Daily</strong> Practice</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Latest%20Teachings/Divine%20Grace.webp" alt="Divine Grace" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Bhakti Yoga Learning Course</p>
          <h2 className={styles.sectionTitle}>Four Modules of <span className={styles.accent}>Divine Devotion</span></h2>
          <p className={styles.sectionSubtitle}>From understanding the meaning of bhakti to establishing a complete daily devotional life — each module opens the heart further to divine love.</p>
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
          <p className={styles.eyebrowCenter}>Complete Devotion Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Divine Grace</span> Course in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore its teachings, devotional forms, sacred stories, and daily practices.</p>
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
                        <p className={styles.phaseDetailLabel}>Practices</p>
                        <ul className={styles.phaseDetailUl}>{p.practices.map((pr, i) => <li key={i}>{pr}</li>)}</ul>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Divine Grace</span> Practice</h2>
          <p className={styles.sectionSubtitle}>The path of devotion does not ask for perfection — it asks for sincerity. Through consistent bhakti, the heart naturally opens to grace.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #3a1a2a 0%, #6a2a3a 60%, #1a0a12 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Open the Heart to Divine Grace</h2>
            <p className={styles.ctaSubtext}>
              Grace is not far away. It is closer than breath.<br />
              Begin with sincerity, offer your heart, and let devotion reveal what was always present.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Begin Module 1 Today</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DivineGrace;
