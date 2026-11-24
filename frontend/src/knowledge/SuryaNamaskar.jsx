import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SuryaNamaskar.module.css";

function SuryaNamaskar() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      days: "Significance",
      name: "Spiritual Significance of Surya Namaskar",
      tagline: "Salutation to the Source of Life, Energy, and Wisdom",
      color: "#B5451B",
      purpose:
        "Surya Namaskar, meaning 'Salutation to the Sun,' is an ancient yogic practice that combines movement, breath, and devotion. In Hindu tradition, the Sun (Surya) is honored as the source of life, energy, and wisdom. Practicing Surya Namaskar is a way to express gratitude to the Sun and awaken inner vitality. This sequence of twelve postures creates a harmonious flow between body and breath, and prepares the mind for meditation and spiritual awareness.",
      focusAreas: [
        "The Sun as the source of life, energy, and divine wisdom",
        "Expressing gratitude to Surya through movement and breath",
        "Harmonizing body, breath, and consciousness in one practice",
        "Awakening inner vitality and preparing the mind for meditation",
        "Practicing at sunrise to receive positive energy and spiritual balance",
      ],
      mantras: {
        primary: [
          "Om Suryaya Namah — salutation to the divine Sun",
          "Om Mitraya Namah — honoring the Sun as cosmic friend",
        ],
        optional: [
          "Om Ravaye Namah — to the radiant one who shines for all",
          "Gayatri Mantra — for divine illumination through solar energy",
        ],
      },
      innerExperience: [
        "Sense of gratitude and reverence for the life-giving Sun",
        "Body awakening with energy and vitality through the sequence",
        "Mind settling naturally as breath and movement synchronize",
        "Feeling of connection with the cosmic life force",
      ],
      innerNote:
        "Practicing Surya Namaskar at sunrise is believed to bring positive energy, clarity of mind, and spiritual balance.",
      transformationGoal: [
        "Understand the spiritual significance of honoring the Sun",
        "Experience how movement and devotion can be combined",
        "Develop a morning practice that energizes body and spirit",
        "Begin each day with gratitude and sacred intention",
      ],
      transformationNote:
        "Surya Namaskar is not only a physical exercise but a spiritual practice that connects the practitioner with the universal life force.",
    },
    {
      days: "12 Steps",
      name: "The 12 Sacred Postures",
      tagline: "A Flowing Sequence of Body, Breath, and Devotion",
      color: "#1B4430",
      purpose:
        "A complete round of Surya Namaskar includes twelve postures performed in a flowing sequence. Each posture flows naturally into the next, guided by the rhythm of the breath. Completing the sequence on both sides forms one full round. Many practitioners perform 12 rounds each morning, creating a simple routine that activates the body, calms the mind, and generates a sense of gratitude for the new day.",
      focusAreas: [
        "Pranamasana (Prayer Pose) — centering the mind in prayer",
        "Hasta Uttanasana (Raised Arms) — opening the chest, receiving divine energy",
        "Padahastasana (Forward Bend) — stretching the spine, releasing tension",
        "Ashwa Sanchalanasana (Equestrian Pose) — stepping forward with strength",
        "Bhujangasana (Cobra Pose) — lifting the heart, opening the spine",
      ],
      mantras: {
        primary: [
          "Synchronize each posture with an inhale or exhale",
          "Move with awareness — the breath is the teacher",
        ],
        optional: [
          "Chant one Surya Mantra with each of the 12 postures",
          "Begin and end each round with a moment of stillness",
        ],
      },
      innerExperience: [
        "Body becoming fluid and energized through the flowing sequence",
        "Mind settling into the rhythm of breath and movement",
        "Natural meditation arising through the repetition of rounds",
        "A sense of completeness and renewal at the end of practice",
      ],
      innerNote:
        "With regular practice, Surya Namaskar becomes a powerful discipline that nurtures physical health, mental balance, and spiritual awareness.",
      transformationGoal: [
        "Learn all 12 postures and their correct form",
        "Practice the full sequence with smooth breath synchronization",
        "Build from 3 rounds to 12 rounds over time",
        "Experience the meditative quality of flowing movement",
      ],
      transformationNote:
        "Completing the sequence on both sides forms one round — begin with 3 rounds and progress gradually.",
    },
    {
      days: "Mantras",
      name: "The 12 Sacred Surya Mantras",
      tagline: "Divine Names That Transform Each Posture into Prayer",
      color: "#2B6291",
      purpose:
        "Each of the 12 postures in Surya Namaskar can be accompanied by a sacred mantra dedicated to Surya. These mantras honor different qualities of the Sun — as friend, radiance, illuminator, nourisher, and cosmic womb. Chanting these mantras while moving transforms the physical sequence into a complete act of devotion. The practitioner simultaneously strengthens the body, calms the breath, and aligns the mind with divine energy.",
      focusAreas: [
        "Om Mitraya Namah — honoring the Sun as universal friend",
        "Om Ravaye Namah — to the radiant one who illuminates all",
        "Om Suryaya Namah — to the divine Sun, source of life",
        "Om Bhanave Namah — to the one who shines with divine light",
        "Om Hiranyagarbhaya Namah — to the golden cosmic womb",
      ],
      mantras: {
        primary: [
          "Om Suryaya Namah — the essential Surya salutation",
          "Om Adityaya Namah — to the primordial solar deity",
        ],
        optional: [
          "Om Bhaskaraya Namah — to the one who leads to enlightenment",
          "Om Arkaya Namah — to the one worthy of praise and worship",
        ],
      },
      innerExperience: [
        "Each posture becoming infused with devotional intention",
        "The mantra creating a meditative anchor within movement",
        "Sense of the divine solar energy entering through practice",
        "Movement becoming prayer — body and spirit unified",
      ],
      innerNote:
        "Chanting Surya Mantras while practicing helps cultivate devotion and mindfulness throughout the sequence.",
      transformationGoal: [
        "Learn all 12 Surya Mantras with their meanings",
        "Assign one mantra to each posture in the sequence",
        "Experience the transformation of exercise into devotion",
        "Carry the spirit of solar worship into daily awareness",
      ],
      transformationNote:
        "When mantras and movement unite, Surya Namaskar becomes a complete spiritual practice of body, breath, and devotion.",
    },
    {
      days: "Challenge",
      name: "30-Day Surya Namaskar Challenge",
      tagline: "Building Strength, Rhythm, and Spiritual Discipline",
      color: "#422868",
      purpose:
        "The 30-Day Surya Namaskar Challenge is a progressive program designed to build physical strength, energetic vitality, and spiritual discipline. Over four weeks, the practitioner gradually increases from 3 rounds per day to a full 12 rounds, while integrating mantra chanting and meditation. By Day 30, the practice becomes a natural daily discipline that creates lasting transformation.",
      focusAreas: [
        "Week 1 (Days 1–7): Beginner — 3 to 5 rounds, learning posture and breathing",
        "Week 2 (Days 8–14): Strength Building — 6 to 8 rounds, flexibility and endurance",
        "Week 3 (Days 15–21): Energy Activation — 9 to 10 rounds, rhythm and mantras",
        "Week 4 (Days 22–30): Full Practice — 11 to 12 rounds, meditation through movement",
        "Daily consistency as the foundation of all transformation",
      ],
      mantras: {
        primary: [
          "Week 1–2: Practice the sequence with breath awareness first",
          "Week 3–4: Add Surya Mantras to each posture",
        ],
        optional: [
          "End each session with Om Shanti Shanti Shanti",
          "Begin with Gayatri Mantra to set sacred intention",
        ],
      },
      innerExperience: [
        "Physical strength and flexibility growing week by week",
        "Energy levels rising naturally through consistent practice",
        "Mind settling into stillness through the rhythm of movement",
        "Deep sense of gratitude and discipline by Day 30",
      ],
      innerNote:
        "With regular practice, Surya Namaskar activates the body, calms the mind, and creates a sense of gratitude for each new day.",
      transformationGoal: [
        "Complete all 30 days without interruption",
        "Progress from 3 rounds to a full 12 rounds per session",
        "Integrate mantra chanting into the movement practice",
        "Establish Surya Namaskar as a lifelong morning ritual",
      ],
      transformationNote:
        "The 30-Day Challenge transforms Surya Namaskar from an exercise into a spiritual discipline that energizes every area of life.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Vital Energy",
      description:
        "Daily Surya Namaskar awakens and sustains vital energy throughout the day, replacing fatigue with natural vitality.",
    },
    {
      icon: "",
      title: "Body & Flexibility",
      description:
        "The 12 postures strengthen muscles, improve joint health, and develop full-body flexibility over time.",
    },
    {
      icon: "",
      title: "Breath Mastery",
      description:
        "Synchronizing breath with movement develops pranayama awareness and improves overall respiratory health.",
    },
    {
      icon: "",
      title: "Morning Devotion",
      description:
        "Starting each day with Surya Namaskar creates a sacred morning ritual that sets a spiritual tone for all activities.",
    },
    {
      icon: "",
      title: "Mental Clarity",
      description:
        "The meditative rhythm of Surya Namaskar calms the mind, reducing stress and building lasting mental clarity.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Surya Namaskar</h1>
            <p className={styles.heroSubtitle}>
              An ancient yogic practice that combines movement, breath, and
              devotion — honoring the Sun as the{" "}
              <em>source of life, energy, and wisdom</em>.
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() =>
                document
                  .getElementById("phases")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Begin Sun Salutation
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{
                background:
                  "linear-gradient(to right, #5a1a2a 0%, #5a1a2a99 18%, transparent 50%)",
              }}
            />
            <img loading="lazy" decoding="async"
              src="/Daily%20Practices/Kurya%20Namaskar.webp"
              alt="Surya Namaskar"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How Surya Namaskar Practice Is Structured
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Sun Salutation</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From spiritual significance to the 30-day challenge — each pillar
            deepens your relationship with this ancient practice.
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
            <span className={styles.maroon}>Surya Namaskar Path</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any section to expand its full guide, postures, mantras, and
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
            The Gifts of{" "}
            <span className={styles.maroon}>Daily Sun Salutation</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            With regular practice, Surya Namaskar becomes a powerful discipline
            that nurtures physical health, mental balance, and spiritual awareness.
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
              Greet the Sun with Devotion
            </h2>
            <p className={styles.ctaSubtext}>
              Every morning is an invitation to express gratitude for the gift
              of life. Twelve postures, one sacred breath at a time.
              <br />
              Begin the 30-Day Challenge and let the Sun transform you from
              within.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>
                Start the 30-Day Challenge
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

export default SuryaNamaskar;
