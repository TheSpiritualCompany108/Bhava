import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #1a2a3a 0%, #1a2a3acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "The Meaning of Meditation",
    tagline: "Understanding Dhyana — the practice of awareness",
    color: "#2A3A6A",
    purpose:
      "Meditation, known in Sanskrit as Dhyana, is the practice of focusing the mind and becoming fully aware of the present moment. Rather than allowing the mind to wander through worries and distractions, meditation trains it to remain steady and attentive. The ancient sages taught that true peace does not come from external circumstances but from understanding and calming the inner self.",
    keyTeachings: [
      "Dhyana — the Sanskrit term for meditation, meaning sustained awareness",
      "Meditation trains the mind to remain steady rather than wandering through distraction",
      "Breath Meditation: focusing on the natural rhythm of breathing to calm the mind",
      "Mantra Meditation: repeating sacred sounds such as Om to create mental clarity",
      "Visualization Meditation: focusing on peaceful imagery or sacred symbols",
      "Devotional Meditation: holding the presence of a divine form or spiritual teaching",
      "In Patanjali's Yoga Sutras: concentration, then meditation, then deep absorption (samadhi)",
    ],
    practices: [
      "Day 1: Learn correct meditation posture — spine straight, body relaxed, breath natural",
      "Day 2: 5 minutes of breath awareness — simply observe the inhale and exhale",
      "Day 3: Practice observing thoughts without reacting — let them arise and pass",
      "Day 4: Body relaxation meditation — systematically release tension from head to foot",
      "Day 5–7: Combine breath awareness with silent sitting — increase gradually to 10 minutes",
    ],
    innerExperience: [
      "First experience of the mind becoming quieter through simple breath awareness",
      "Realising how busy the mind actually is — and that observation itself creates space",
      "The body beginning to relax more deeply than usual when given conscious attention",
      "A first glimpse of stillness — brief but unmistakeable — beneath the mental activity",
    ],
    goal: ["Understand what meditation is and why it is a central spiritual practice", "Learn correct posture and preparation for meditation", "Begin a consistent 5–10 minute daily practice", "Experience the first qualities of inner stillness through breath awareness"],
    goalNote: "Meditation is not the absence of thoughts — it is the development of a steady, clear awareness that is not disturbed by thoughts.",
  },
  {
    days: "Module 2",
    name: "21-Day Inner Peace Challenge",
    tagline: "Building a daily meditation habit step by step",
    color: "#1B4430",
    purpose:
      "This 21-day challenge helps beginners build a sustainable daily meditation habit and develop genuine mental calmness. The three weeks progress systematically: calming the mind in Week 1, developing deeper awareness and concentration in Week 2, and entering deep inner peace and spiritual awareness in Week 3. Each day builds naturally on the last.",
    keyTeachings: [
      "Week 1 (Days 1–7): Calming the Mind — relaxation, breathing awareness, silent sitting",
      "Day 1: Introduction to meditation. Day 2: Deep breathing. Day 3: Observing thoughts",
      "Day 4: Body relaxation. Day 5: Breath awareness. Day 6: Silent sitting. Day 7: Gratitude",
      "Week 2 (Days 8–14): Developing Awareness — mindfulness, concentration, loving-kindness",
      "Day 8: Mindfulness of breathing. Day 12: Mantra meditation (Om chanting). Day 13: Loving-kindness",
      "Week 3 (Days 15–21): Deep Inner Peace — inner silence, present-moment awareness, spiritual reflection",
      "Day 15: Inner silence. Day 17: Gratitude. Day 18: Compassion. Day 21: Full session and reflection",
    ],
    practices: [
      "Week 1: Sit for 5–10 minutes each day, focusing only on calming and breath",
      "Week 2: Increase to 10–15 minutes — introduce mantra and emotional observation",
      "Week 3: 15–20 minutes — explore deep silence and presence after mantra practice",
      "Keep a meditation journal: note what arises each day and how the mind responds",
    ],
    innerExperience: [
      "Week 1: First real experience of the mind slowing down through consistent practice",
      "Week 2: Greater ability to observe emotions without being immediately swept into them",
      "Week 3: Moments of genuine inner stillness — quiet, clear, and spacious",
      "Day 21: A sense of having crossed a threshold — meditation is no longer unfamiliar",
    ],
    goal: ["Complete the 21-Day Inner Peace Challenge", "Build a consistent daily meditation habit", "Progress from basic breath awareness to deeper inner stillness", "Experience the cumulative effect of sustained daily practice"],
    goalNote: "Twenty-one days of consistent practice rewires habitual mental patterns — what begins as effort gradually becomes a natural inner resting place.",
  },
  {
    days: "Module 3",
    name: "Types of Meditation",
    tagline: "Five pathways to deeper stillness and awareness",
    color: "#6E1B21",
    purpose:
      "There are many forms of meditation within the Hindu spiritual tradition, each suited to different temperaments and stages of practice. This module explores five primary methods — from breath awareness to mantra meditation to advanced inner silence — and explains how they build upon one another to create a complete and progressive meditation practice.",
    keyTeachings: [
      "Breath Meditation: the foundation — observe the natural breath without control",
      "Mantra Meditation: Om Shanti Shanti Shanti — sacred sound creating inner resonance",
      "Visualization: holding an inner image of divine light, nature, or sacred form",
      "Loving-Kindness (Metta): deliberately extending compassion to self, loved ones, all beings",
      "Silent Meditation: no technique — simply resting in open, undirected awareness",
      "Progression: breath → mantra → visualization → loving-kindness → pure silence",
    ],
    practices: [
      "Practice each type of meditation once across 5 separate sessions",
      "Mantra session: silently repeat 'Om Shanti' for 7 minutes — observe its effect",
      "Visualization session: see a flame of steady golden light in the heart for 5 minutes",
      "Loving-kindness: begin with yourself, extend to loved ones, then to all beings",
      "Silent session: sit for 10 minutes with no technique — simply be present",
    ],
    innerExperience: [
      "Each meditation type revealing a different texture of inner experience",
      "Mantra creating a sense of resonance and containment that breath alone does not provide",
      "Loving-kindness unexpectedly softening long-held emotional contraction",
      "Silent meditation revealing a deep, wordless stillness that technique can point toward but not create",
    ],
    goal: ["Experience all five primary meditation types firsthand", "Identify which forms of meditation suit your temperament most naturally", "Understand how the different methods complement one another", "Begin building a personal practice that draws from multiple methods"],
    goalNote: "No single technique is superior — the right method is the one that most effectively brings the particular practitioner into genuine stillness.",
  },
  {
    days: "Module 4",
    name: "Daily Meditation Routine",
    tagline: "A complete 20-minute practice for lasting inner peace",
    color: "#422868",
    purpose:
      "This final module establishes a complete, sustainable daily meditation routine. The 20-minute practice moves through five stages — preparation, breath awareness, mantra meditation, silent meditation, and closing reflection. Practiced consistently, this routine gradually transforms the quality of daily life, reducing reactivity and expanding the capacity for inner calm and clarity.",
    keyTeachings: [
      "Step 1 — Preparation (3 min): comfortable posture, spine straight, few slow deep breaths",
      "Step 2 — Breath Awareness (5 min): observe natural rhythm of inhale and exhale",
      "Step 3 — Mantra Meditation (7 min): silently repeat Om or Om Shanti Shanti Shanti",
      "Step 4 — Silent Meditation (3 min): release all technique, rest in complete stillness",
      "Step 5 — Closing Reflection (2 min): deep breath, gratitude, gently open eyes",
      "Carry the quality of stillness from practice into the day's activities",
    ],
    practices: [
      "Commit to this 20-minute routine each morning for 30 consecutive days",
      "Choose a consistent time and place — regularity deepens the practice significantly",
      "When the mind wanders, gently return without frustration — this is the practice",
      "After the session, sit quietly for 2 minutes before engaging with daily activity",
    ],
    innerExperience: [
      "First week: resistance and restlessness — the mind objecting to stillness",
      "Second week: the routine becoming familiar — sitting feels natural rather than forced",
      "Third week: the quality of daily life beginning to change — more space between stimulus and response",
      "Fourth week: meditation no longer confined to the cushion — stillness available throughout the day",
    ],
    goal: ["Establish a complete 20-minute daily meditation practice", "Sustain the practice consistently for at least 30 days", "Experience the cumulative effect of daily practice on mental clarity and emotional balance", "Carry the quality of inner stillness into all activities throughout the day"],
    goalNote: "Ultimately, meditation reveals that the peace you are seeking is already present within you — the practice simply removes what covers it.",
  },
];

const benefits = [
  { icon: "", title: "Stress Relief", description: "Consistent meditation significantly reduces stress and anxiety by calming the nervous system." },
  { icon: "", title: "Mental Focus", description: "Daily practice improves concentration and the ability to sustain attention without distraction." },
  { icon: "", title: "Emotional Balance", description: "Develop the capacity to observe emotions without being controlled by them — greater resilience." },
  { icon: "", title: "Self-Awareness", description: "Gain deeper understanding of your own thought patterns, reactions, and inner states." },
  { icon: "", title: "Spiritual Clarity", description: "Experience the stillness at the core of awareness — the foundation of all genuine spiritual understanding." },
];

function InnerPeace() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Latest Teaching · Meditation</p>
            <h1 className={styles.heroTitle}>Inner Peace</h1>
            <p className={styles.heroSubtitle}>
              Meditation for calmness and awareness —{" "}
              <em>a complete guide from the first breath of stillness to a sustained daily practice that transforms the quality of every moment</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>4</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>21</strong> Day Challenge</span>
              <span className={styles.heroMetaItem}><strong>5</strong> Methods</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Latest%20Teachings/Inner%20Peace.webp" alt="Inner Peace" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Meditation Learning Course</p>
          <h2 className={styles.sectionTitle}>Four Modules of <span className={styles.accent}>Inner Stillness</span></h2>
          <p className={styles.sectionSubtitle}>From understanding what meditation is to establishing a complete daily practice — each module brings you closer to the peace that is already within you.</p>
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
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Inner Peace</span> Course in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore its teachings, practices, inner experiences, and spiritual goals.</p>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Daily Meditation</span></h2>
          <p className={styles.sectionSubtitle}>Regular meditation gradually transforms not just the meditation session but the quality of every waking moment — more present, more clear, more at peace.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #1a2a3a 0%, #2a3a6a 60%, #0a1a2a 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin Your Journey to Inner Peace</h2>
            <p className={styles.ctaSubtext}>
              The peace you are seeking is not somewhere else.<br />
              Sit quietly. Breathe. The stillness within is already present — meditation reveals it.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start the 21-Day Challenge</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default InnerPeace;
