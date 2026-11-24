import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #1a2a4a 0%, #1a2a4acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "Introduction to Vedic Chanting",
    tagline: "Understanding the sacred power of sound",
    color: "#1A2A4A",
    purpose:
      "Vedic chanting is one of the oldest spiritual traditions in the world — preserved for thousands of years through oral transmission from teacher to student. This module introduces the meaning of mantras, the history of the four Vedas, and the spiritual significance of sacred sound vibration.",
    keyTeachings: [
      "The four Vedas: Rig Veda, Yajur Veda, Sama Veda, Atharva Veda",
      "Sound (shabda) as a spiritual force in Vedic philosophy",
      "Mantras — sacred sounds that carry specific vibrations",
      "The purpose of Vedic chanting: purification, harmony, divine connection",
      "Oral tradition — how sacred hymns were preserved for millennia",
    ],
    practices: [
      "Begin with Om — chant 3 times slowly in silence",
      "Listen to recordings of authentic Vedic chanting",
      "Study the meaning behind the sounds you hear",
      "Develop daily 5-minute Om chanting practice",
    ],
    innerExperience: [
      "First experience of the vibration of Om in the chest",
      "Sense of something ancient being awakened",
      "Mind becoming naturally calm during chanting",
      "Curiosity about the depth behind the sounds",
    ],
    goal: ["Understand the spiritual purpose of Vedic chanting", "Connect with the vibrational tradition of sacred sound", "Begin Om chanting practice", "Appreciate the oral lineage of the Vedas"],
    goalNote: "Vedic chanting is not merely recitation — it is a transmission of spiritual energy through sacred vibration.",
  },
  {
    days: "Module 2",
    name: "Pronunciation & Sacred Sound",
    tagline: "Learning Sanskrit tones and Vedic meter",
    color: "#1B4430",
    purpose:
      "Vedic chanting follows precise rules of pronunciation and rhythm. This module teaches the three Vedic tones (swaras), the chandas (meters), and accurate Sanskrit pronunciation — the foundations required for authentic chanting.",
    keyTeachings: [
      "Swara (Tone): Udātta — raised tone, Anudātta — lower tone, Swarita — falling tone",
      "Chandas (Meter): Gayatri, Trishtubh, Anushtubh, Jagati",
      "Correct pronunciation changes the vibration and meaning of mantras",
      "Sanskrit is not just language — it is an acoustic science",
      "Traditional learning requires a teacher for correct transmission",
    ],
    practices: [
      "Practice Sanskrit vowel sounds: a, ā, i, ī, u, ū",
      "Learn the three Vedic tones with simple syllables",
      "Chant Om with Udātta (rising) tone",
      "Study the Gayatri Mantra metre (24 syllables)",
    ],
    innerExperience: [
      "Physical awareness of how different tones resonate in the body",
      "Mind becoming more precise and focused through careful pronunciation",
      "Sense of reverence for the exactness of the tradition",
      "Each syllable becoming a point of mindfulness",
    ],
    goal: ["Learn the three Vedic tones and how to apply them", "Understand Sanskrit pronunciation at a basic level", "Experience how tone changes the quality of vibration", "Develop confidence in chanting basic sacred sounds"],
    goalNote: "Even small changes in pronunciation can alter the meaning and vibrational quality of a mantra — precision is sacred.",
  },
  {
    days: "Module 3",
    name: "The Sacred Mantras",
    tagline: "Chanting the most powerful Vedic hymns",
    color: "#6E1B21",
    purpose:
      "This module introduces the most widely practiced Vedic mantras — from the Gayatri Mantra to the Maha Mrityunjaya Mantra, Shanti Mantra, and Purusha Sukta. These hymns form the living core of the Vedic chanting tradition.",
    keyTeachings: [
      "Gayatri Mantra — prayer to the divine light to illuminate the intellect",
      "Maha Mrityunjaya Mantra — for healing, protection, and liberation",
      "Shanti Mantra — Om Sahana Vavatu: prayer for peace and harmony",
      "Purusha Sukta — hymn describing the cosmic being",
      "Nasadiya Sukta — philosophical hymn about the origin of the universe",
    ],
    practices: [
      "Memorize and chant the Gayatri Mantra daily (21 times minimum)",
      "Learn the Maha Mrityunjaya Mantra (11 times for healing)",
      "Chant the Shanti Mantra to begin or close practice",
      "Listen to the Purusha Sukta and study its meaning",
      "Week 2: 10-minute chanting sessions of Gayatri + Shanti Mantra",
    ],
    innerExperience: [
      "Gayatri Mantra creating a powerful sense of illumination",
      "Mrityunjaya Mantra generating deep protection and healing vibration",
      "Shanti Mantra establishing peace at the beginning and end of practice",
      "Sacred hymns beginning to feel like prayer rather than recitation",
    ],
    goal: ["Learn at least three core Vedic mantras by heart", "Understand the meaning and spiritual purpose of each", "Experience the healing and illuminating qualities of mantra vibration", "Establish a daily mantra chanting routine"],
    goalNote: "These mantras are not just words — they are living vibrations that have been chanted for thousands of years.",
  },
  {
    days: "Module 4–5",
    name: "Advanced Hymns & Meditation Through Chanting",
    tagline: "Deeper hymns and inner spiritual experience",
    color: "#422868",
    purpose:
      "The final modules introduce advanced Vedic hymns (Suktas) and teach how to enter meditation through chanting. When chanting becomes a complete practice, the practitioner experiences spiritual connection beyond words.",
    keyTeachings: [
      "Sri Sukta — sacred hymn to Goddess Lakshmi",
      "Rudra Sukta — powerful hymn dedicated to Lord Shiva",
      "Durga Sukta, Narayana Sukta, Surya Sukta — key Vedic hymns",
      "Breath awareness during chanting deepens the inner experience",
      "Silent mantra meditation after chanting extends the vibration",
    ],
    practices: [
      "Week 3: Sri Sukta and Purusha Sukta (15 minutes daily)",
      "Week 4: Multiple mantras + silent meditation after chanting",
      "Practice group chanting (kirtan/bhajan style)",
      "End each session with 5 minutes of silent mantra repetition",
      "30-Day Vedic Chanting Practice Program: progressive daily sessions",
    ],
    innerExperience: [
      "Advanced hymns opening deeper levels of devotion",
      "Silence after chanting becoming profoundly still",
      "Group chanting creating powerful collective vibration",
      "Meditation arising naturally from sustained chanting",
    ],
    goal: ["Learn advanced Vedic hymns with correct pronunciation", "Experience the silence and stillness after chanting", "Develop a complete integrated chanting-meditation practice", "Carry the sacred vibration into daily life"],
    goalNote: "Through consistent chanting, the sacred sounds become part of you — the vibration lives in your cells and transforms your awareness.",
  },
];

const benefits = [
  { icon: "", title: "Focus & Memory", description: "Vedic chanting improves concentration, memory, and the ability to hold the mind in sustained attention." },
  { icon: "", title: "Stress Relief", description: "The rhythmic breath patterns of chanting calm the nervous system, reducing stress and anxiety naturally." },
  { icon: "", title: "Breath Balance", description: "Chanting balances breathing patterns and improves respiratory function through conscious breath coordination." },
  { icon: "", title: "Spiritual Awareness", description: "Strengthen spiritual awareness and cultivate a living connection with the ancient wisdom of the Vedas." },
  { icon: "", title: "Inner Peace", description: "Create a peaceful mental state through sacred sound — chanting cleanses the environment and the mind simultaneously." },
];

function VedicChanting() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${styles.heroHalf}`}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Learning Path · 156K joined</p>
            <h1 className={styles.heroTitle}>Vedic Chanting</h1>
            <p className={styles.heroSubtitle}>
              Learn sacred hymns from the Vedas — one of the oldest spiritual traditions on Earth,{" "}
              <em>preserved for thousands of years through the living transmission of sacred sound</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>5</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>30</strong> Days</span>
              <span className={styles.heroMetaItem}><strong>50+</strong> Hymns</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Learning%20Paths/Vedic%20Chanting.webp" alt="Vedic Chanting" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Vedic Chanting Learning Course</p>
          <h2 className={styles.sectionTitle}>Five Modules of <span className={styles.accent}>Sacred Sound</span></h2>
          <p className={styles.sectionSubtitle}>From understanding what a mantra is to entering meditation through chanting — each module deepens your connection with the Vedic tradition.</p>
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
          <p className={styles.eyebrowCenter}>Complete Learning Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Vedic Chanting</span> Course in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore its key teachings, chanting practices, and spiritual goals.</p>
          <div className={styles.phaseDetailList}>
            {phases.map((p, idx) => (
              <div key={p.name} className={`${styles.phaseDetailRow} ${expanded === idx ? styles.phaseDetailRowOpen : ""}`}>
                <button className={styles.phaseDetailHeader} onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <span className={styles.phaseNumber} style={{ background: p.color }}>{p.days.split(" ")[0]} {idx + 1}</span>
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
                        <p className={styles.phaseDetailLabel}>Chanting Practice</p>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Vedic Chanting</span></h2>
          <p className={styles.sectionSubtitle}>Regular Vedic chanting provides many benefits — from improved focus and memory to deep spiritual peace. Many practitioners use chanting as their primary daily meditation.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #1a2a4a 0%, #2a3a6a 60%, #0a1a2a 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin Your Vedic Chanting Journey</h2>
            <p className={styles.ctaSubtext}>
              Om — the primordial sound from which all creation arises.<br />
              Join the oldest continuous spiritual tradition on Earth and let sacred sound transform your mind.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start with Om Today</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VedicChanting;
