import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MantraChanting.module.css";

function MantraChanting() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);


  const phases = [
    {
      days: "Meaning",
      name: "The Meaning of Mantra Chanting",
      tagline: "A Sacred Tool That Protects and Guides the Mind",
      color: "#6E1B21",
      purpose:
        "Mantra chanting is one of the most powerful spiritual practices in Hindu tradition. It involves the rhythmic repetition of sacred sounds or divine names to calm the mind, purify the heart, and connect with higher consciousness. In ancient Vedic teachings, sound is considered a form of divine energy. The word Mantra combines two Sanskrit roots — Man (mind) and Tra (instrument or protection) — making it a tool that protects and guides the mind toward peace and clarity.",
      focusAreas: [
        "Man = Mind, Tra = Instrument — a tool that protects the mind",
        "Sacred sound as a form of divine energy in Vedic teaching",
        "Rhythmic repetition to calm and focus the mind",
        "Moving from distraction toward inner silence and awareness",
        "Building steady, concentrated spiritual practice",
      ],
      mantras: {
        primary: [
          "Om — the primordial cosmic sound, foundation of all chanting",
          "Om Namah Shivaya — the five-syllable mantra of Lord Shiva",
        ],
        optional: [
          "Gayatri Mantra — for divine illumination and intellect",
          "Om Namo Bhagavate Vasudevaya — for devotion to Vishnu",
        ],
      },
      innerExperience: [
        "Mind becoming steady and focused through repetition",
        "Sense of moving from mental noise toward inner silence",
        "Early experiences of the mantra's calming vibration",
        "Growing devotion as the practice deepens",
      ],
      innerNote:
        "By repeating sacred sounds regularly, the mind becomes steady and focused — this is the foundation of all mantra practice.",
      transformationGoal: [
        "Understand the spiritual basis of mantra chanting",
        "Learn the meaning of the Sanskrit roots Man and Tra",
        "Choose one primary mantra to commit to",
        "Begin regular chanting with clear intention",
      ],
      transformationNote:
        "Mantra chanting helps practitioners move from distraction toward inner silence and spiritual awareness.",
    },
    {
      days: "108",
      name: "The Sacred Power of 108 Repetitions",
      tagline: "Aligning with the Universe's Ordering Frequency",
      color: "#2B6291",
      purpose:
        "In Hindu spiritual tradition, 108 is considered a sacred number with cosmic significance. Many mantra practices involve repeating a mantra 108 times using a mala (prayer beads). The number 108 symbolizes spiritual completeness and cosmic harmony. Chanting a mantra 108 times allows the practitioner to enter a deeper state of concentration, devotion, and alignment with the cosmic order.",
      focusAreas: [
        "108 energy lines that connect the heart to the universe",
        "108 Upanishads representing the complete library of Vedantic wisdom",
        "108 beads in a mala for maintaining meditation rhythm",
        "Earth-Sun distance as 108 times the Sun's diameter",
        "Spiritual completeness and cosmic harmony in the number 108",
      ],
      mantras: {
        primary: [
          "Choose one mantra and repeat it 108 times with mala beads",
          "Move one bead per repetition to maintain steady rhythm",
        ],
        optional: [
          "Begin with 27 repetitions and progress toward 108",
          "Chant in the morning before activity for maximum clarity",
        ],
      },
      innerExperience: [
        "Deeper concentration achieved through the rhythm of 108",
        "Sense of spiritual completeness at the end of each round",
        "Mind settling naturally as repetitions continue",
        "Experience of the mantra becoming self-sustaining",
      ],
      innerNote:
        "Chanting a mantra 108 times allows the practitioner to enter a deeper state of concentration and devotion.",
      transformationGoal: [
        "Complete one full round of 108 repetitions",
        "Learn to use a mala to maintain count during practice",
        "Experience the shift in consciousness that 108 repetitions creates",
        "Understand the cosmic significance of this sacred number",
      ],
      transformationNote:
        "108 is not just a number — it is the universe's blueprint encoded in sacred geometry, planetary cycles, and ancient yogic science.",
    },
    {
      days: "Practice",
      name: "How to Practice Mantra Chanting",
      tagline: "Simple Steps for Powerful Spiritual Results",
      color: "#1B4430",
      purpose:
        "Mantra chanting can be practiced by anyone in a quiet and peaceful environment. The practice combines correct posture, breath awareness, and focused intention to create a powerful spiritual experience. With regular practice, mantra chanting becomes a deep meditation that brings inner peace, mental clarity, and spiritual transformation. The key is consistency — even fifteen minutes daily creates profound change over time.",
      focusAreas: [
        "Sit comfortably with a straight spine in a quiet place",
        "Take several deep breaths to relax and center the mind",
        "Choose a sacred mantra such as Om, Om Namah Shivaya, or Gayatri",
        "Repeat the mantra slowly and rhythmically with full focus",
        "Use a 108-bead mala to keep count if desired",
      ],
      mantras: {
        primary: [
          "Om Namah Shivaya — ideal for beginners and advanced practitioners",
          "Gayatri Mantra — for clarity, wisdom, and divine guidance",
        ],
        optional: [
          "Om Gan Ganapataye Namah — for removing obstacles at the start",
          "Hare Krishna Maha Mantra — for devotion and liberation",
        ],
      },
      innerExperience: [
        "Improved focus and concentration building with each session",
        "Reduction in stress and mental tension through sacred sound",
        "Positive vibrations arising naturally in the mind and body",
        "Enhanced spiritual awareness through regular devotion",
      ],
      innerNote:
        "Focus on the sound and vibration of the mantra — allow the mind to settle naturally as chanting continues.",
      transformationGoal: [
        "Establish a consistent daily chanting practice",
        "Build from short sessions to sustained 15-minute practice",
        "Experience the calming effect of mantra vibration on the mind",
        "Develop discipline and devotion through steady repetition",
      ],
      transformationNote:
        "Over time, chanting becomes a powerful meditation practice that brings inner peace and clarity of mind.",
    },
    {
      days: "Sadhana",
      name: "108-Day Mantra Sadhana Program",
      tagline: "Four Phases of Progressive Spiritual Deepening",
      color: "#422868",
      purpose:
        "The 108-Day Mantra Sadhana is a structured program of progressive spiritual practice divided into four phases. Each phase builds upon the previous, taking the practitioner from foundational calm to advanced spiritual awareness. This is ideal for those who wish to experience the full transformative power of mantra chanting through sustained, disciplined practice over 108 consecutive days.",
      focusAreas: [
        "Phase 1 (Days 1–27): Foundation — Om chanting 108 times, calm mind",
        "Phase 2 (Days 28–54): Devotion — Om Namah Shivaya, Gayatri Mantra 21 times",
        "Phase 3 (Days 55–81): Energy Activation — Mahamrityunjaya 108 times",
        "Phase 4 (Days 82–108): Spiritual Awareness — silent meditation and self-awareness",
        "Daily meditation alongside each phase's mantra practice",
      ],
      mantras: {
        primary: [
          "Phase 1: Om (108 times) with 10 minutes meditation",
          "Phase 3: Om Tryambakam Yajamahe (Mahamrityunjaya) for healing",
        ],
        optional: [
          "Phase 4: Om Namo Bhagavate Vasudevaya for devotion and liberation",
          "Add Gayatri Mantra (21 times) in Phase 2 for illumination",
        ],
      },
      innerExperience: [
        "Progressive deepening of awareness across all four phases",
        "Healing and emotional balance achieved through Phase 3",
        "Profound inner stillness cultivated through sustained practice",
        "Self-awareness and spiritual growth through 108 days of discipline",
      ],
      innerNote:
        "108 consecutive days of practice creates the inner stillness from which all great devotion flows.",
      transformationGoal: [
        "Complete the full 108-day sadhana with consistency",
        "Experience the transformation that sustained practice creates",
        "Develop unshakeable inner stillness and spiritual awareness",
        "Emerge from the sadhana with a lifelong daily practice",
      ],
      transformationNote:
        "With consistent practice, the sound of the mantra begins to resonate deeply within — guiding the practitioner toward calmness, devotion, and higher awareness.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Focused Mind",
      description:
        "Regular mantra chanting trains the mind to concentrate deeply, reducing mental scatter and building powerful inner focus.",
    },
    {
      icon: "",
      title: "Spiritual Awareness",
      description:
        "Consistent practice awakens a natural awareness of the divine presence within and around all things.",
    },
    {
      icon: "",
      title: "Stress Reduction",
      description:
        "Sacred sound vibrations calm the nervous system, dissolve mental tension, and create lasting emotional peace.",
    },
    {
      icon: "",
      title: "Inner Discipline",
      description:
        "The commitment to daily chanting builds the spiritual discipline that supports every other area of sadhana.",
    },
    {
      icon: "",
      title: "Devotional Heart",
      description:
        "Mantra chanting naturally deepens devotion, opening the heart to the experience of divine love and grace.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Mantra Chanting</h1>
            <p className={styles.heroSubtitle}>
              One of the most powerful spiritual practices in Hindu tradition —
              rhythmic repetition of sacred sounds to{" "}
              <em>calm the mind, purify the heart, and connect with higher consciousness</em>.
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() =>
                document
                  .getElementById("phases")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Begin Mantra Practice
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{
                background:
                  "linear-gradient(to right, #2a1a5a 0%, #2a1a5a99 18%, transparent 50%)",
              }}
            />
            <img loading="lazy" decoding="async"
              src="/Daily%20Practices/Mantra%20Chanting.webp"
              alt="Mantra Chanting"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How Mantra Chanting Practice Is Structured
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Sacred Chanting</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From understanding the power of sacred sound to completing a
            108-day sadhana — each pillar deepens your practice.
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
            <span className={styles.maroon}>Mantra Chanting Path</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any section to expand its full guide, mantras, and spiritual
            significance.
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
                          Mantras & Practice
                        </p>
                        <p className={styles.mantraLabel}>Primary:</p>
                        <ul className={styles.phaseDetailUl}>
                          {phase.mantras.primary.map((m, i) => (
                            <li key={i}>{m}</li>
                          ))}
                        </ul>
                        {phase.mantras.optional.length > 0 && (
                          <>
                            <p className={styles.mantraLabel}>Recommended:</p>
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
            The Power of{" "}
            <span className={styles.maroon}>Sacred Sound Practice</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            With consistent practice, the sound of the mantra begins to resonate
            deeply within, guiding the practitioner toward calmness and higher awareness.
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
            <h2 className={styles.ctaTitle}>
              Experience the Power of Sacred Sound
            </h2>
            <p className={styles.ctaSubtext}>
              Mantra chanting is more than repetition — it is a spiritual
              journey. With consistent practice, harmony between mind, body, and
              spirit becomes your natural state.
              <br />
              Begin with one mantra, one round, one day at a time.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>
                Start Chanting Today
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

export default MantraChanting;
