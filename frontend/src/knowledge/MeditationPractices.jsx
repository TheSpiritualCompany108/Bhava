import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MeditationPractices.module.css";

function MeditationPractices() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      days: "Dhyana",
      name: "What is Dhyana (Meditation)?",
      tagline: "The Path to Inner Stillness",
      color: "#6E1B21",
      purpose:
        "In Hindu philosophy, meditation is known as Dhyana. It is one of the important steps of the Eightfold Path of Yoga described by the sage Patanjali. Meditation involves focusing the mind, observing thoughts without attachment, and gradually reaching a state of deep inner stillness.",
      focusAreas: [
        "Dhyana — one of the eight limbs of Patanjali's Yoga",
        "Focusing the mind and observing thoughts without attachment",
        "Moving beyond distractions toward deeper peace and clarity",
        "Realizing the true nature of the self",
        "Experiencing unity with universal consciousness",
      ],
      mantras: {
        primary: [
          "Om (3x) — to begin each meditation session",
          "Observe the natural rhythm of breath without control",
        ],
        optional: ["So Hum — repeat silently with each breath (I am That)"],
      },
      innerExperience: [
        "Growing stillness beneath the activity of the mind",
        "Awareness gently detaching from thoughts and emotions",
        "Sense of expanding inner space and openness",
        "Natural peace arising without effort",
      ],
      innerNote:
        "The goal of meditation is to realize the true nature of the self and experience unity with the universal consciousness.",
      transformationGoal: [
        "Understand Dhyana as a path to self-knowledge",
        "Establish a daily sitting practice even for 10 minutes",
        "Learn to observe thoughts without reacting",
        "Experience glimpses of deeper stillness beneath mental activity",
      ],
      transformationNote:
        "Meditation is not simply a relaxation technique — it is the direct path to self-knowledge.",
    },
    {
      days: "Techniques",
      name: "Traditional Meditation Techniques",
      tagline: "Ancient Methods for Inner Transformation",
      color: "#1B4430",
      purpose:
        "Hindu meditation includes several ancient techniques that guide practitioners toward deeper awareness. From mantra repetition to breath awareness, visualization, and silent meditation — each technique addresses a different aspect of the mind and leads toward stillness.",
      focusAreas: [
        "Mantra Meditation — repeating Om, Gayatri, or Om Namah Shivaya",
        "Breath Meditation (Pranayama) — observing the natural rhythm of breathing",
        "Visualization Meditation — divine forms, sacred symbols, or inner light",
        "Silent Meditation — observing thoughts without judgment",
        "Each technique suits different temperaments and stages of practice",
      ],
      mantras: {
        primary: [
          "Mantra: Om Namah Shivaya or Gayatri Mantra (10–20 min)",
          "Breath: Simple inhalation and exhalation awareness (10 min)",
        ],
        optional: [
          "Visualization: A flame or divine form held gently in the heart",
          "Silent: Observe thoughts as clouds passing through an open sky",
        ],
      },
      innerExperience: [
        "Each technique reveals a different dimension of the mind",
        "Sense of which method resonates with your temperament",
        "Gradual settling of mental activity with regular practice",
        "Deepening of awareness from session to session",
      ],
      innerNote:
        "Each technique addresses a different temperament — explore to find what naturally resonates.",
      transformationGoal: [
        "Learn 2–3 core meditation techniques",
        "Practice each for at least one week to understand its quality",
        "Identify your primary meditation method",
        "Develop a consistent daily routine using your chosen technique",
      ],
      transformationNote:
        "Through consistent practice, meditation becomes a pathway toward inner transformation.",
    },
    {
      days: "Routine",
      name: "Creating a Daily Meditation Routine",
      tagline: "Consistency Over Intensity",
      color: "#422868",
      purpose:
        "A simple meditation routine can be practiced daily with just a few minutes of focused attention. Practicing regularly, even for 10–15 minutes a day, can bring significant benefits. Consistency matters far more than duration or perfection of technique.",
      focusAreas: [
        "Sit comfortably with a straight spine",
        "Close the eyes and relax the body",
        "Focus on breathing or repeat a mantra",
        "Observe thoughts without reacting to them",
        "Slowly return to normal awareness after meditation",
      ],
      mantras: {
        primary: [
          "Morning: 10–15 minutes of breath or mantra meditation",
          "Evening: 5–10 minutes of silent sitting before sleep",
        ],
        optional: [
          "Midday: 5 minutes of breath awareness to reset mental energy",
        ],
      },
      innerExperience: [
        "Gradual deepening of inner calmness with each session",
        "Mind beginning to settle automatically at practice time",
        "Greater awareness and presence carrying into daily activities",
        "Sense of stability and peace growing over weeks",
      ],
      innerNote:
        "Practicing regularly, even for 10–15 minutes a day, can bring significant benefits.",
      transformationGoal: [
        "Establish a fixed daily time and place for meditation",
        "Begin with 10 minutes and increase gradually over weeks",
        "Build the habit of returning to breath when the mind wanders",
        "Notice the positive changes in awareness and emotional balance",
      ],
      transformationNote:
        "Over time, meditation becomes a natural part of daily life, helping individuals develop calmness, wisdom, and divine connection.",
    },
    {
      days: "Yoga Tradition",
      name: "Meditation in the Yoga Tradition",
      tagline: "From Concentration to Samadhi",
      color: "#8B6914",
      purpose:
        "Meditation is deeply connected with the practice of yoga. According to Patanjali's Yoga Sutras, meditation follows concentration (Dharana) and leads toward a state of deep absorption called Samadhi. In this state, the mind becomes completely peaceful, allowing the practitioner to experience spiritual insight and inner harmony.",
      focusAreas: [
        "Dharana — concentration: fixing the mind on a single point",
        "Dhyana — meditation: uninterrupted flow of awareness toward that point",
        "Samadhi — absorption: complete merging with the object of meditation",
        "The Eightfold Path as a systematic approach to liberation",
        "Yoga as the cessation of the fluctuations of the mind (Patanjali)",
      ],
      mantras: {
        primary: [
          "Practice Dharana (fixed attention) to build the foundation for Dhyana",
          "Extend meditation gradually toward natural effortless stillness",
        ],
        optional: [
          "Study Patanjali's Yoga Sutras alongside your daily practice",
          "Attend a meditation or yoga retreat for deeper immersive experience",
        ],
      },
      innerExperience: [
        "Concentration giving way to natural, effortless meditation",
        "Moments of stillness beyond thought and time",
        "Sense of the practitioner dissolving into pure awareness",
        "Connection between physical yoga practice and the meditative goal",
      ],
      innerNote:
        "In Samadhi, the mind becomes completely peaceful, allowing the practitioner to experience spiritual insight and inner harmony.",
      transformationGoal: [
        "Understand the relationship between Dharana, Dhyana, and Samadhi",
        "Practice concentration exercises to build the foundation for meditation",
        "Experience progressively deeper states of stillness over time",
        "Connect your meditation practice to the broader tradition of yoga",
      ],
      transformationNote:
        "By practicing ancient meditation techniques, we learn to balance the mind, purify the heart, and awaken our true inner nature.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Calm and Focused Mind",
      description:
        "Meditation dissolves mental noise and scattered thinking, cultivating a steady, clear awareness that carries through the day.",
    },
    {
      icon: "",
      title: "Reduced Stress",
      description:
        "Regular practice activates deep inner stillness, providing lasting relief from chronic stress, worry, and anxiety.",
    },
    {
      icon: "",
      title: "Emotional Stability",
      description:
        "Meditation cultivates equanimity and inner balance, reducing emotional reactivity and developing compassion for self and others.",
    },
    {
      icon: "",
      title: "Improved Concentration",
      description:
        "Consistent practice sharpens the mind's ability to focus, improving performance and presence in all areas of life.",
    },
    {
      icon: "",
      title: "Spiritual Awareness",
      description:
        "Through meditation, consciousness naturally expands beyond ego identification, revealing the deeper Self and its unity with universal awareness.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Meditation Practices</h1>
            <p className={styles.heroSubtitle}>
              Master Ancient Techniques for Inner Peace and Awareness. Rooted
              in the Vedas and Upanishads, meditation helps individuals{" "}
              <em>
                calm the mind, develop awareness, and connect with their
                inner self
              </em>
              .
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() =>
                document
                  .getElementById("phases")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Meditation Practices
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{
                background:
                  "linear-gradient(to right, #6E1B21 0%, #6E1B2199 18%, transparent 50%)",
              }}
            />
            <img loading="lazy" decoding="async"
              src="../meditation.png"
              alt="Meditation Practices"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How Meditation Practice Is Structured
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Meditative Wisdom</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From understanding Dhyana to integrating meditation into daily
            life — each pillar guides the seeker deeper inward.
          </p>
          <div className={styles.phasesGrid}>
            {phases.map((phase) => (
              <div
                key={phase.name}
                className={styles.phaseCard}
                style={{ borderTop: `3px solid ${phase.color}` }}
              >
                <span
                  className={styles.phaseDays}
                  style={{ color: phase.color }}
                >
                  {phase.days}
                </span>
                <h3 className={styles.phaseTitle}>{phase.name}</h3>
                <p className={styles.phaseTagline}>"{phase.tagline}"</p>
                <p className={styles.phaseDesc}>{phase.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Detailed Breakdown ── */}
      <section className={styles.detailSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Guide</p>
          <h2 className={styles.sectionTitle}>
            The{" "}
            <span className={styles.maroon}>Meditation Journey</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any section to expand its full guide, techniques, and
            spiritual significance.
          </p>

          <div className={styles.phaseDetailList}>
            {phases.map((phase, idx) => (
              <div
                key={phase.name}
                className={`${styles.phaseDetailRow} ${
                  expandedPhase === idx ? styles.phaseDetailRowOpen : ""
                }`}
                style={{ "--phase-color": phase.color }}
              >
                <button
                  className={styles.phaseDetailHeader}
                  onClick={() =>
                    setExpandedPhase(expandedPhase === idx ? null : idx)
                  }
                >
                  <span
                    className={styles.phaseNumber}
                    style={{ background: phase.color }}
                  >
                    Part {idx + 1}
                  </span>
                  <span className={styles.phaseDetailName}>
                    {phase.name}{" "}
                    <span className={styles.phaseDetailDays}>
                      ({phase.days})
                    </span>
                  </span>
                  <span className={styles.phaseDetailTagline}>
                    "{phase.tagline}"
                  </span>
                  <span className={styles.phaseChevron}>
                    {expandedPhase === idx ? "▲" : "▼"}
                  </span>
                </button>

                {expandedPhase === idx && (
                  <div className={styles.phaseDetailBody}>
                    <div className={styles.phaseDetailGrid}>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Key Teachings</p>
                        <ul className={styles.phaseDetailUl}>
                          {phase.focusAreas.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>
                          Practice Instructions
                        </p>
                        <p className={styles.mantraLabel}>Primary:</p>
                        <ul className={styles.phaseDetailUl}>
                          {phase.mantras.primary.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                        {phase.mantras.optional.length > 0 && (
                          <>
                            <p className={styles.mantraLabel}>Optional:</p>
                            <ul className={styles.phaseDetailUl}>
                              {phase.mantras.optional.map((m, i) => (
                                <li key={i}>{m}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>

                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>
                          Inner Experience
                        </p>
                        <ul className={styles.phaseDetailUl}>
                          {phase.innerExperience.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                        <p className={styles.phaseDetailNote}>
                          {phase.innerNote}
                        </p>
                      </div>

                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>
                          Transformation Goal
                        </p>
                        <ul className={styles.phaseDetailUl}>
                          {phase.transformationGoal.map((g, i) => (
                            <li key={i}>{g}</li>
                          ))}
                        </ul>
                        <p className={styles.phaseDetailNote}>
                          {phase.transformationNote}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className={styles.completionSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>What You Gain</p>
          <h2 className={styles.sectionTitle}>
            Benefits of{" "}
            <span className={styles.maroon}>Regular Meditation</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Through consistent practice, meditation becomes a pathway toward
            inner transformation — calming the mind, purifying the heart, and
            awakening spiritual awareness.
          </p>
          <div className={styles.benefitsGrid}>
            {completionBenefits.map((b, i) => (
              <div key={i} className={styles.benefitCard}>
                <span className={styles.benefitIcon}>{b.icon}</span>
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
            <h2 className={styles.ctaTitle}>Begin Your Meditation Journey</h2>
            <p className={styles.ctaSubtext}>
              Anyone can start meditation regardless of age or experience.
              <br />
              Patience, regular practice, and sincerity are the only
              requirements.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>
                Start Meditating Today
              </button>
              <button
                className={styles.btnSecondary}
                onClick={() => navigate("/knowledge")}
              >
                ← Back to Knowledge
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MeditationPractices;