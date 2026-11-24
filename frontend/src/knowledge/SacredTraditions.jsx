import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #2a1a0a 0%, #2a1a0acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "The Meaning of Sacred Rituals",
    tagline: "Understanding Hindu ritual as conscious spiritual action",
    color: "#5A3A0A",
    purpose:
      "Rituals, known as Karma Kanda in the Vedic tradition, are sacred actions performed with devotion and awareness. In Hindu philosophy, rituals are not merely external acts — they are meaningful practices that guide individuals toward discipline, devotion, and inner awareness. Through these traditions, spiritual wisdom has been preserved and transmitted across thousands of years.",
    keyTeachings: [
      "Karma Kanda — the Vedic path of ritual action performed with sacred intention",
      "Rituals are not superstition but symbolic practice carrying deep spiritual meaning",
      "Lamp (Diya) — represents divine light illuminating the darkness of ignorance",
      "Incense — represents purification of the environment and the mind",
      "Flowers — symbolise the offering of devotion and beauty to the Divine",
      "Water — represents purity, clarity, and the washing away of impurity",
      "Rituals strengthen devotion, maintain cultural heritage, and create spiritual discipline",
    ],
    practices: [
      "Light a lamp each morning as a symbol of welcoming divine light into the day",
      "Before any ritual action, pause for 30 seconds of conscious intention",
      "Study the symbolic meaning behind one ritual object each day this week",
      "Perform a simple daily puja: lamp, flowers, mantra, gratitude — 10 minutes",
    ],
    innerExperience: [
      "The lamp lighting becoming more than habit — a genuine moment of inner connection",
      "Ritual objects losing their ordinariness and becoming carriers of spiritual meaning",
      "A growing sense of reverence that naturally quiets the mind",
      "The first experience of ritual creating spiritual discipline without force",
    ],
    goal: ["Understand the philosophical meaning behind Hindu ritual practice", "Recognise the symbolism embedded in common ritual objects and actions", "Begin a daily puja with conscious intention", "Experience ritual as a path to inner awareness rather than mere external performance"],
    goalNote: "The true purpose of ritual is not to please an external deity but to cultivate the inner qualities of gratitude, humility, and devotion.",
  },
  {
    days: "Module 2",
    name: "Common Hindu Practices",
    tagline: "Puja, Aarti, Mantra, and the sacred fire",
    color: "#6E1B21",
    purpose:
      "Several rituals form the living heart of Hindu daily and communal practice. Daily Puja, Aarti, Mantra Chanting, and Yajna (fire ritual) each carry distinct spiritual significance and together provide a complete framework for integrating devotion, purification, and divine awareness into both household and temple life.",
    keyTeachings: [
      "Daily Puja: light a lamp, offer flowers and incense, chant mantras, offer prasadam",
      "Aarti: waving a lamp before the deity — removes darkness, invites divine light",
      "Aarti performed during morning and evening prayers — a transition into sacred time",
      "Mantra Chanting: Om, Gayatri Mantra, Maha Mrityunjaya Mantra — purification and focus",
      "Yajna (Havan): sacred fire ritual — offerings of ghee, herbs, and grain into fire",
      "Yajna symbolises purification and transformation — the fire burns what is impure",
      "Each practice serves as a gateway from ordinary consciousness to devotional awareness",
    ],
    practices: [
      "Learn and chant the Gayatri Mantra each morning — begin with 11 repetitions",
      "Perform Aarti at home each evening — a simple lamp, a sincere heart, and a devotional song",
      "Attend a Yajna or Havan at a local temple — observe the symbolism and significance",
      "Establish a weekly practice: designate one morning for more extended puja",
    ],
    innerExperience: [
      "Aarti revealing how powerfully a simple ritual can shift mental and emotional state",
      "Mantra chanting progressively calming the mind — each repetition deepening the effect",
      "The Yajna fire carrying a primal quality — ancient, transforming, deeply settling",
      "Daily puja becoming the anchor point of the day — the one moment of genuine inner contact",
    ],
    goal: ["Learn the correct practice of daily Puja, Aarti, and Mantra Chanting", "Understand the spiritual significance of the Yajna fire ritual", "Establish consistent morning and evening ritual practices", "Experience how ritual practice transforms the quality of daily awareness"],
    goalNote: "Ritual practiced with awareness is not repetition — it is renewal. Each performance is an opportunity to arrive more fully in the sacred present.",
  },
  {
    days: "Module 3",
    name: "The 16 Samskaras",
    tagline: "Sacred ceremonies marking the journey of a human life",
    color: "#1B4430",
    purpose:
      "In Hindu tradition, Samskaras are 16 sacred ceremonies that guide a person from conception through death, connecting every major life transition to spiritual meaning. These rituals help purify the mind, mark important milestones with conscious intention, and link individual life to the universal spiritual order. They remind us that every stage of life is sacred.",
    keyTeachings: [
      "Garbhadhana — conception ritual: prayer for a virtuous and healthy child",
      "Namakarana — naming ceremony: the child receives a spiritually meaningful name",
      "Nishkramana — first outing: the child's first connection with the natural world",
      "Annaprashana — first feeding of solid food: a rite of nourishment and gratitude",
      "Vidyarambha — beginning of learning and education",
      "Upanayana — sacred thread ceremony: initiation into spiritual education",
      "Vivaha — marriage: sacred union of two individuals and families",
      "Antyeshti — funeral rites: honouring the departed soul and its spiritual journey",
    ],
    practices: [
      "Study all 16 samskaras and the spiritual significance behind each one",
      "Reflect on which samskaras you have passed through — what was their effect on your life?",
      "If raising children, consider how to incorporate meaningful ritual into their milestones",
      "Research a samskara that is relevant to your current life stage",
    ],
    innerExperience: [
      "Recognition that life's milestones are not merely social events but spiritual thresholds",
      "A renewed sense of the sacredness of one's own birth, education, and relationships",
      "Gratitude for the tradition that has preserved these markers of human dignity",
      "A deeper understanding of why cultural continuity and ritual memory matter",
    ],
    goal: ["Understand all 16 Samskaras and the life stages they accompany", "Recognise how ritual transforms life transitions into conscious spiritual passages", "Connect your own life history to the Samskara tradition", "Appreciate the wisdom of marking every stage of life with sacred intention"],
    goalNote: "The Samskaras teach that from the first breath to the last, every moment of human life is worthy of acknowledgement and consecration.",
  },
  {
    days: "Module 4",
    name: "Daily Ritual Practice System",
    tagline: "365 days of living in sacred rhythm",
    color: "#422868",
    purpose:
      "The final module establishes a complete daily ritual system that integrates sacred practice into the natural rhythm of each day. Morning ritual, midday awareness, evening prayer, and night reflection together create a continuous thread of spiritual consciousness woven through ordinary life. When practiced consistently over a year, this system profoundly transforms the quality of daily experience.",
    keyTeachings: [
      "Morning Ritual: rise before sunrise, gratitude prayer, light a lamp, chant mantra, short meditation",
      "Midday Awareness: pause and reflect — Are my thoughts positive? Am I acting with kindness?",
      "Evening Ritual: before sunset — light a lamp, chant prayers, perform Aarti",
      "Night Reflection: express gratitude, review the day, pray for guidance before sleeping",
      "365-day practice: every day holds the possibility of sacred connection",
      "Weekly rhythm: each day of the week carries its own spiritual quality and associated deity",
    ],
    practices: [
      "Commit to the complete Morning Ritual for 10–15 minutes every day for 30 days",
      "Set a midday mindfulness pause: one conscious question mid-afternoon",
      "End each day with the night reflection before sleeping — never omit this",
      "Track your practice for 30 days — note the cumulative effect on daily awareness",
    ],
    innerExperience: [
      "The morning ritual gradually shifting from obligation to genuine longing",
      "Midday pause revealing how easily ordinary life pulls awareness away from what matters",
      "Evening Aarti becoming a natural closing ceremony — the day completed with grace",
      "Night reflection creating a deep quality of peace that persists into sleep and morning",
    ],
    goal: ["Establish all four elements of the daily ritual system", "Sustain the complete practice consistently for at least 30 days", "Experience how daily ritual creates a sense of sacred rhythm and spiritual continuity", "Arrive at a relationship with time itself that feels consecrated rather than merely passing"],
    goalNote: "When every part of the day is held within a ritual framework, life stops being a series of random events and becomes a continuous spiritual practice.",
  },
];

const benefits = [
  { icon: "", title: "Spiritual Discipline", description: "Ritual creates reliable structure for spiritual practice, building discipline without rigidity." },
  { icon: "", title: "Cultural Heritage", description: "Connect with thousands of years of living tradition and the wisdom it carries forward." },
  { icon: "", title: "Devotion", description: "Regular ritual practice deepens devotion naturally — each action becoming an offering." },
  { icon: "", title: "Mindfulness", description: "Sacred ritual teaches conscious action — every gesture performed with full awareness." },
  { icon: "", title: "Community", description: "Shared rituals bind families and communities through common sacred experience." },
];

function SacredTraditions() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Latest Teaching · Rituals</p>
            <h1 className={styles.heroTitle}>Sacred Traditions</h1>
            <p className={styles.heroSubtitle}>
              Understanding Hindu rituals and the wisdom they carry —{" "}
              <em>from the meaning of daily puja to the 16 Samskaras that consecrate every stage of human life</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>4</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>16</strong> Samskaras</span>
              <span className={styles.heroMetaItem}><strong>365</strong> Day Practice</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Latest%20Teachings/Sacred%20Traditions.webp" alt="Sacred Traditions" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Hindu Ritual Learning Course</p>
          <h2 className={styles.sectionTitle}>Four Modules of <span className={styles.accent}>Sacred Living</span></h2>
          <p className={styles.sectionSubtitle}>From the meaning of ritual symbolism to a complete daily practice system — each module deepens your relationship with the sacred traditions of Hindu life.</p>
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
          <p className={styles.eyebrowCenter}>Complete Ritual Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Sacred Traditions</span> Course in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore its teachings, ritual practices, inner experiences, and spiritual goals.</p>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Sacred Traditions</span></h2>
          <p className={styles.sectionSubtitle}>Sacred ritual is not a relic of the past — it is a living technology for transforming ordinary time into sacred experience.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #2a1a0a 0%, #5a3a0a 60%, #1a0a05 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Live in Sacred Rhythm</h2>
            <p className={styles.ctaSubtext}>
              Every morning holds an invitation to begin with light and intention.<br />
              Sacred traditions are not obligations — they are doorways. Step through.
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

export default SacredTraditions;
