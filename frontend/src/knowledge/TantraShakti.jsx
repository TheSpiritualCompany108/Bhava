import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #3a1a0a 0%, #3a1a0acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "Introduction to Tantra & Shakti",
    tagline: "Understanding sacred energy and the cosmic principles",
    color: "#3A1A0A",
    purpose:
      "Tantra is an ancient spiritual tradition within Hindu philosophy that focuses on understanding and awakening the inner spiritual energy present in every human being — Shakti. The universe is seen as the union of Shiva (pure consciousness) and Shakti (divine creative power). Tantra is often misunderstood, but in its true form it is a spiritual path of transformation, awareness, and energy balance.",
    keyTeachings: [
      "Tantra means 'to weave' — the integration of consciousness and energy",
      "Shiva — pure consciousness: the unchanging ground of all existence",
      "Shakti — divine energy: the dynamic creative force animating all creation",
      "Their union creates and sustains the entire universe",
      "The purpose of Tantra: awaken dormant spiritual energy and unite it with higher consciousness",
    ],
    practices: [
      "Study the meaning of Tantra beyond popular misconceptions",
      "Contemplate the Shiva-Shakti principle in your own experience",
      "Begin awareness meditation: observe the energy of consciousness within",
      "Introduction to the ten Mahavidya Goddesses",
    ],
    innerExperience: [
      "Recognition of two principles — stillness and movement — in personal experience",
      "Growing awareness of energy in the body during meditation",
      "Shakti beginning to feel like a lived reality, not just philosophy",
      "Profound respect for the feminine divine principle",
    ],
    goal: ["Understand the philosophical basis of Tantra", "Recognize Shiva and Shakti as cosmic principles and personal realities", "Begin working with energy awareness in meditation", "Approach sacred energy practices with proper intention and understanding"],
    goalNote: "Tantra's true meaning is transformation of consciousness — every moment of awareness is a tantric practice.",
  },
  {
    days: "Module 2",
    name: "Shakti & the Ten Mahavidyas",
    tagline: "The ten forms of divine feminine energy",
    color: "#6E1B21",
    purpose:
      "Shakti represents the divine feminine energy that animates all creation. She manifests in ten powerful goddess forms known as the Mahavidyas — each representing a different aspect of cosmic energy, spiritual transformation, and awakened consciousness.",
    keyTeachings: [
      "Kali — transformation and liberation from ego and ignorance",
      "Tara — compassion, wisdom, and spiritual guidance",
      "Tripura Sundari (Lalita) — beauty, harmony, balance of spiritual and material",
      "Bhuvaneshwari — cosmic space containing all of existence",
      "Chinnamasta — sacrifice and transformation of energy; control of desires",
      "Bhairavi — fierce spiritual discipline and determination",
      "Dhumavati — wisdom of hardship; detachment and deeper understanding",
      "Bagalamukhi — power to control negative forces; protection",
      "Matangi — goddess of knowledge, speech, and creativity",
      "Kamala — form of Lakshmi; abundance and spiritual wealth",
    ],
    practices: [
      "Study each of the ten Mahavidyas and the quality she represents",
      "Meditate on one Mahavidya per day in a 10-day cycle",
      "Chant seed mantras (Bija Mantras) associated with each goddess",
      "Reflect: which Mahavidya quality is most needed in your life now?",
    ],
    innerExperience: [
      "Each Mahavidya evoking a distinct quality of energy in practice",
      "Kali's fierce quality burning through mental obstacles",
      "Tara's compassion softening the heart",
      "Recognition of the full spectrum of divine feminine qualities within",
    ],
    goal: ["Know all ten Mahavidyas and the cosmic energy they represent", "Experience each goddess quality through meditation and mantra", "Understand the full spectrum of Shakti as cosmic and personal energy", "Develop devotional relationship with the Divine Feminine"],
    goalNote: "The Mahavidyas are not external goddesses but cosmic energies that exist within every being — devotion awakens them.",
  },
  {
    days: "Module 3",
    name: "Kundalini & the Chakra System",
    tagline: "Awakening the dormant spiritual energy within",
    color: "#1B4430",
    purpose:
      "One of the central teachings of Tantra is Kundalini — a dormant spiritual energy coiled at the base of the spine. Through meditation and practice, this energy rises through seven energy centers (chakras), bringing higher awareness, inner peace, and spiritual insight.",
    keyTeachings: [
      "Kundalini — dormant spiritual energy coiled at the base of the spine",
      "Seven chakras: Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown",
      "Muladhara — stability and grounding; Anahata — love and compassion",
      "Vishuddha — communication and truth; Ajna — intuition and insight",
      "Sahasrara — spiritual awareness and union with consciousness",
      "Balancing chakras maintains harmony between physical and spiritual aspects",
    ],
    practices: [
      "21-Day Chakra Balancing Practice",
      "Days 1–2: Root Chakra — grounding meditation",
      "Days 3–4: Sacral Chakra — creativity and emotional awareness",
      "Days 5–7: Solar Plexus — confidence and personal strength",
      "Days 8–10: Heart Chakra — compassion and gratitude practice",
      "Days 11–14: Throat Chakra — mindful communication",
      "Days 15–17: Third Eye — intuition and insight meditation",
      "Days 18–21: Crown Chakra — spiritual connection and awareness",
    ],
    innerExperience: [
      "Grounding meditation creating stability and calm",
      "Heart chakra practice naturally opening compassion",
      "Third eye meditation bringing intuitive clarity",
      "Crown meditation creating profound stillness and expansion",
    ],
    goal: ["Understand the seven chakra system and its relationship to awareness", "Complete the 21-Day Chakra Balancing Practice", "Experience emotional balance and improved concentration", "Develop awareness of subtle energy in your own body"],
    goalNote: "Kundalini awakening is not a dramatic event — it is a gradual deepening of awareness as each chakra is purified.",
  },
  {
    days: "Module 4",
    name: "Tantric Practices",
    tagline: "Mantra, yantra, breath, and sacred meditation",
    color: "#422868",
    purpose:
      "Tantra includes several sacred practices designed to awaken and balance spiritual energy. This module provides practical techniques: mantra chanting with seed syllables, yantra meditation with sacred geometry, breath practices, and visualization — the complete toolkit of the tantric practitioner.",
    keyTeachings: [
      "Mantra chanting: Om, Om Namah Shivaya, Om Aim Hreem Kleem (seed mantras)",
      "Bija Mantras for chakras: Lam (Root), Vam (Sacral), Ram (Solar Plexus), Yam (Heart), Ham (Throat), Om (Third Eye), Silence (Crown)",
      "Yantra — sacred geometric diagrams as visual meditation tools",
      "Sri Yantra — the most powerful yantra, symbolizing union of Shiva and Shakti",
      "Pranayama: alternate nostril breathing, slow rhythmic and deep meditative breathing",
    ],
    practices: [
      "Kundalini Awakening Meditation Program — 4 stages over 4 weeks",
      "Stage 1 (Week 1): Preparation — breath meditation and gentle body awareness",
      "Stage 2 (Week 2): Energy Awareness — chakra meditation, visualizing energy in the spine",
      "Stage 3 (Week 3): Mantra Activation — chanting Bija Mantras for each chakra",
      "Stage 4 (Week 4): Deep Meditation — silent meditation, visualization of rising energy",
    ],
    innerExperience: [
      "Bija Mantras creating immediate resonance in specific body regions",
      "Sri Yantra meditation focusing the mind with extraordinary clarity",
      "Alternate nostril breathing creating profound energetic balance",
      "Silent meditation revealing stillness at the core of all energy",
    ],
    goal: ["Practice mantra chanting with Bija Mantras for each chakra", "Use yantra meditation to develop focused inner vision", "Complete the 4-stage Kundalini Awakening Meditation Program", "Experience the integration of consciousness and energy in daily life"],
    goalNote: "When practiced with discipline and understanding, Tantra reveals that the entire universe — including you — is Shiva-Shakti in union.",
  },
];

const benefits = [
  { icon: "", title: "Self-Awareness", description: "Deeper self-awareness as you learn to observe the energy within your own body, mind, and consciousness." },
  { icon: "", title: "Emotional Balance", description: "Improved emotional balance through chakra work, breath practices, and the cultivation of Shakti energy." },
  { icon: "", title: "Mental Clarity", description: "Increased mental clarity and focus through mantra chanting and yantra meditation practices." },
  { icon: "", title: "Spiritual Awakening", description: "Spiritual awakening as Kundalini energy rises and each chakra is purified through dedicated practice." },
  { icon: "", title: "Divine Connection", description: "Stronger connection with divine energy as the practitioner recognizes Shakti as both cosmic and personal reality." },
];

function TantraShakti() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Learning Path · 89K joined</p>
            <h1 className={styles.heroTitle}>Tantra & Shakti</h1>
            <p className={styles.heroSubtitle}>
              Understanding sacred energy practices — the ancient path of{" "}
              <em>awakening Kundalini, balancing the chakras, and uniting consciousness with divine energy</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>4</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>10</strong> Mahavidyas</span>
              <span className={styles.heroMetaItem}><strong>7</strong> Chakras</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Learning%20Paths/Tantra%20%26%20Shakti.png" alt="Tantra and Shakti" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Tantra Learning Course</p>
          <h2 className={styles.sectionTitle}>Four Modules of <span className={styles.accent}>Sacred Energy</span></h2>
          <p className={styles.sectionSubtitle}>From understanding Shakti philosophy to awakening Kundalini — each module takes you deeper into the transformative science of consciousness and energy.</p>
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
          <p className={styles.eyebrowCenter}>Complete Practice Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Tantra & Shakti</span> Path in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore the Mahavidyas, chakra practices, mantra techniques, and spiritual goals.</p>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Tantra & Shakti</span> Practice</h2>
          <p className={styles.sectionSubtitle}>When practiced with discipline and understanding, tantric practices transform everyday awareness into a deeper, more vibrant spiritual experience.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #3a1a0a 0%, #6a2a10 60%, #1a0a05 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Awaken the Shakti Within</h2>
            <p className={styles.ctaSubtext}>
              Shiva without Shakti is inert. Shakti without Shiva is blind.<br />
              Through devotion, meditation, and conscious awareness, the sacred energy of Shakti awakens within you.
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

export default TantraShakti;
