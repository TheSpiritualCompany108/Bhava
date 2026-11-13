import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #1a3a3a 0%, #1a3a3acc 30%, transparent 65%)";

const phases = [
  {
    days: "Chapter 1 — 51 Sutras",
    name: "Samadhi Pada",
    tagline: "Understanding the mind and the path of concentration",
    color: "#4A0B1D",
    purpose:
      "The first chapter introduces the concept of yoga and explains the nature of the mind. Patanjali opens with the famous sutra 'Yoga Chitta Vritti Nirodha' — yoga is the stilling of the movements of the mind. When the mind becomes calm, the true self is revealed.",
    keyTeachings: [
      "Yoga Chitta Vritti Nirodha — yoga is the stilling of the mind's fluctuations",
      "Understanding the five types of mental activities (vrittis)",
      "Practice (abhyasa) and non-attachment (vairagya) as the two foundations",
      "Concentration (dharana) as the gateway to meditation",
      "Samadhi — the state of deep spiritual absorption",
    ],
    practices: [
      "Study the nature of the mind and its fluctuations",
      "Begin a simple breath awareness practice",
      "Observe thoughts without attachment",
      "Introduce 5 minutes of silent meditation daily",
    ],
    innerExperience: [
      "First recognition of the mind's constant movement",
      "Brief moments of stillness in meditation",
      "Understanding that the observer is different from thought",
      "Growing ability to watch thoughts rather than be caught in them",
    ],
    goal: ["Understand the philosophical basis of yoga", "Begin disciplining the mind through breath awareness", "Experience the difference between thinking and witnessing", "Establish the foundation for deeper practice"],
    goalNote: "Yoga Chitta Vritti Nirodha — this single sutra contains the entire science of yoga.",
  },
  {
    days: "Chapter 2 — 55 Sutras",
    name: "Sadhana Pada",
    tagline: "The Eight Limbs — practical yoga discipline",
    color: "#1B4430",
    purpose:
      "The second chapter is the heart of Patanjali's practical teaching. It introduces the Eight Limbs of Yoga (Ashtanga) — a complete system for physical, mental, and spiritual development from ethical living to the threshold of meditation.",
    keyTeachings: [
      "Yama — ethical principles: non-violence, truthfulness, non-stealing, self-control, non-possessiveness",
      "Niyama — personal discipline: cleanliness, contentment, self-discipline, self-study, surrender to Divine",
      "Asana — physical postures: preparing the body for meditation",
      "Pranayama — breath control: regulating the life force within",
      "Pratyahara — withdrawal of the senses: turning attention inward",
      "Dharana — concentration: focusing the mind on a single point",
    ],
    practices: [
      "Study and apply Yama principles in daily interactions",
      "Establish Niyama disciplines in your morning routine",
      "Practice asana for physical stability and ease",
      "Learn alternate nostril breathing (Nadi Shodhana)",
      "Practice Pratyahara by reducing screen and sensory input",
    ],
    innerExperience: [
      "Ethical living naturally calming the mind",
      "Contentment (santosha) reducing inner restlessness",
      "Breath control creating immediate mental clarity",
      "Withdrawal of senses revealing inner spaciousness",
    ],
    goal: ["Apply the ethical foundations of Yama in all relationships", "Establish daily Niyama practices", "Develop physical ease for extended meditation", "Experience the quieting effect of Pratyahara"],
    goalNote: "The Eight Limbs are not sequential stages — they are practiced simultaneously as an integrated way of life.",
  },
  {
    days: "Chapter 3 — 56 Sutras",
    name: "Vibhuti Pada",
    tagline: "Advanced meditation and spiritual powers",
    color: "#422868",
    purpose:
      "The third chapter describes the advanced states of meditation — Dharana, Dhyana, and Samadhi combined as Samyama. Patanjali describes extraordinary abilities (siddhis) that may arise from deep concentration, but warns not to be distracted by them.",
    keyTeachings: [
      "Dharana (concentration) + Dhyana (meditation) + Samadhi = Samyama",
      "Samyama on any object reveals its deepest nature",
      "Siddhis — extraordinary abilities arising from deep meditation",
      "Heightened perception, deep intuition, and expanded consciousness",
      "Patanjali warns: siddhis are obstacles to liberation if pursued",
    ],
    practices: [
      "Practice extended Dharana sessions (20 minutes of focused attention)",
      "Allow Dhyana to arise from sustained Dharana",
      "Apply Samyama to understand the nature of the mind",
      "Practice without seeking extraordinary results",
    ],
    innerExperience: [
      "Concentration becoming effortless and sustained",
      "Meditation arising naturally from deep focus",
      "Occasional glimpses of expanded awareness",
      "Detachment from spiritual experiences themselves",
    ],
    goal: ["Develop sustained concentration (Dharana)", "Allow meditation (Dhyana) to arise naturally", "Practice without attachment to spiritual powers", "Experience the stillness at the heart of Samyama"],
    goalNote: "Patanjali advises that extraordinary abilities should not distract the seeker from the ultimate goal of liberation.",
  },
  {
    days: "Chapter 4 — 34 Sutras",
    name: "Kaivalya Pada",
    tagline: "Liberation — the ultimate goal of yoga",
    color: "#8B6914",
    purpose:
      "The final chapter describes Kaivalya — the state of complete freedom and liberation. In this state, the practitioner transcends all limitations of the mind and realizes their true spiritual nature. The soul rests in its own pure awareness.",
    keyTeachings: [
      "Kaivalya — liberation, the soul resting in its pure nature",
      "The practitioner transcends the limitations of mind (chitta)",
      "Liberation is not an achievement but a recognition of what always was",
      "Freedom comes from complete detachment from the mind",
      "The soul (purusha) recognizes its eternal independence from nature (prakriti)",
    ],
    practices: [
      "21-Day Yoga Philosophy Program: Week 3 advanced practices",
      "Deep meditation with awareness of the witness",
      "Self-inquiry: 'Who is aware of the mind?'",
      "Living yoga philosophy — integrating wisdom into every action",
      "Final meditation session: rest in pure awareness",
    ],
    innerExperience: [
      "The witness consciousness becoming stable",
      "Actions performed without sense of personal doership",
      "Profound peace that is not dependent on circumstances",
      "Recognition that liberation is already present",
    ],
    goal: ["Experience the witness consciousness through deep meditation", "Live yoga philosophy as a natural way of being", "Integrate detachment and clarity into everyday life", "Realize that Kaivalya is the natural state of the soul"],
    goalNote: "Kaivalya is not a distant goal — it is the recognition of what the soul already is, always has been.",
  },
];

const benefits = [
  { icon: "", title: "Stress Reduction", description: "Reduce stress and anxiety through the systematic practice of pranayama, meditation, and ethical living." },
  { icon: "", title: "Mental Clarity", description: "Improve mental clarity and concentration through the sustained practice of the Eight Limbs of Yoga." },
  { icon: "", title: "Discipline", description: "Develop discipline and self-awareness through Yama and Niyama — the ethical and personal foundations of yoga." },
  { icon: "", title: "Compassion", description: "Cultivate compassion and balance in all relationships through the application of non-violence (ahimsa)." },
  { icon: "", title: "Spiritual Depth", description: "Deepen spiritual understanding and move toward Kaivalya — the natural state of freedom and pure awareness." },
];

function YogaPhilosophy() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Learning Path · 342K joined</p>
            <h1 className={styles.heroTitle}>Yoga Philosophy</h1>
            <p className={styles.heroSubtitle}>
              The wisdom of Patanjali's Yoga Sutras — a complete system for{" "}
              <em>stilling the mind, developing discipline, and realizing the true nature of the self</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>196</strong> Sutras</span>
              <span className={styles.heroMetaItem}><strong>4</strong> Chapters</span>
              <span className={styles.heroMetaItem}><strong>8</strong> Limbs of Yoga</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img src="/Learning%20Paths/Yoga%20Philosophy.png" alt="Yoga Philosophy" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>The Yoga Sutras of Patanjali</p>
          <h2 className={styles.sectionTitle}>Four Chapters of <span className={styles.accent}>Yoga Science</span></h2>
          <p className={styles.sectionSubtitle}>From understanding the mind to experiencing liberation — Patanjali's four chapters form the most complete practical guide to inner transformation.</p>
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
          <p className={styles.eyebrowCenter}>Complete Sutra Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Yoga Sutras</span> in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any chapter to explore its key sutras, the Eight Limbs, and their practical application.</p>
          <div className={styles.phaseDetailList}>
            {phases.map((p, idx) => (
              <div key={p.name} className={`${styles.phaseDetailRow} ${expanded === idx ? styles.phaseDetailRowOpen : ""}`}>
                <button className={styles.phaseDetailHeader} onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <span className={styles.phaseNumber} style={{ background: p.color }}>Ch {idx + 1}</span>
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
                        <p className={styles.phaseDetailLabel}>Daily Practices</p>
                        <ul className={styles.phaseDetailUl}>{p.practices.map((pr, i) => <li key={i}>{pr}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Inner Experience</p>
                        <ul className={styles.phaseDetailUl}>{p.innerExperience.map((e, i) => <li key={i}>{e}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Goal</p>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Yoga Philosophy</span></h2>
          <p className={styles.sectionSubtitle}>Yoga is not only physical exercise but a complete path for achieving harmony between the body, mind, and spirit through Patanjali's timeless science.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #1a3a3a 0%, #2a5a5a 60%, #0a2020 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin the Yoga Philosophy Journey</h2>
            <p className={styles.ctaSubtext}>
              Yoga Chitta Vritti Nirodha — still the mind and reveal the true self.<br />
              Spiritual growth is a gradual process that requires patience, dedication, and consistent practice.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start with Sutra 1</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default YogaPhilosophy;
