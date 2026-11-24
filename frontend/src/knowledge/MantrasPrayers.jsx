import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MantrasPrayers.module.css";

function MantrasPrayers() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      days: "What is a Mantra",
      name: "What is a Mantra?",
      tagline: "A Tool to Guide and Protect the Mind",
      color: "#6E1B21",
      purpose:
        "The word Mantra comes from two Sanskrit roots: Man (Mind) and Tra (Tool or instrument). A mantra is therefore a tool that helps guide and protect the mind. By repeating sacred sounds, the mind gradually becomes focused, peaceful, and aligned with higher awareness.",
      focusAreas: [
        "Man — Mind: the instrument of consciousness",
        "Tra — Tool or instrument: that which protects and guides",
        "Sacred syllables composed to influence consciousness",
        "Chanted aloud, whispered softly, or repeated silently",
        "Creates harmony between body, mind, and spirit",
      ],
      mantras: {
        primary: [
          "Om — the primordial sound representing the universe",
          "Gayatri Mantra — a powerful prayer for wisdom and enlightenment",
        ],
        optional: ["Begin with Om — just 3 repetitions in silence to experience the vibration"],
      },
      innerExperience: [
        "Natural calming of mental activity",
        "Growing awareness of sacred sound",
        "Sense of inner alignment and focus",
        "Mind becoming steady and present",
      ],
      innerNote:
        "Mantras are not merely words — they are spiritual formulas that influence consciousness and inner awareness.",
      transformationGoal: [
        "Understand the meaning of the word Mantra",
        "Choose a mantra that resonates with your intention",
        "Practice with awareness rather than mechanical repetition",
        "Experience the vibrational power of sacred sound",
      ],
      transformationNote:
        "When chanted with devotion and proper pronunciation, mantras create harmony between the body, mind, and spirit.",
    },
    {
      days: "Types",
      name: "Types of Mantras and Prayers",
      tagline: "Each Mantra Serves a Unique Spiritual Purpose",
      color: "#1B4430",
      purpose:
        "Hindu tradition includes many forms of mantras and prayers, each serving a unique spiritual purpose. From ancient Vedic chants to devotional deity mantras, healing chants to meditation sounds, each type carries specific vibrations and spiritual intentions.",
      focusAreas: [
        "Vedic Mantras — ancient chants invoking divine forces and cosmic harmony",
        "Devotional Mantras (Bhakti) — dedicated to specific deities",
        "Healing and Protection Mantras — promote health, remove obstacles",
        "Meditation Mantras — sacred sounds like Om that quiet the mind",
        "Prayer — expressing devotion, gratitude, and surrender to the divine",
      ],
      mantras: {
        primary: [
          "Om Gan Ganapataye Namah — Ganesha, remover of obstacles",
          "Om Shreem Mahalakshmiye Namah — Lakshmi, abundance",
        ],
        optional: [
          "Om Namah Shivaya — Shiva, transformation and liberation",
          "Om Aim Saraswatyai Namah — Saraswati, wisdom and knowledge",
        ],
      },
      innerExperience: [
        "Resonance with specific divine energies",
        "Sense of protection and guidance through sacred sound",
        "Opening of devotional feelings toward the divine",
        "Alignment with the mantra's spiritual quality",
      ],
      innerNote:
        "Each type of mantra carries a distinct vibrational signature aligned with specific divine qualities.",
      transformationGoal: [
        "Identify which type of mantra serves your current spiritual intention",
        "Learn mantras for devotion, healing, protection, and meditation",
        "Understand the deity or quality behind each chant",
        "Develop a varied and personal mantra vocabulary",
      ],
      transformationNote:
        "Prayer transforms ordinary moments into sacred experiences.",
    },
    {
      days: "Practice",
      name: "Commonly Practiced Mantras",
      tagline: "The Most Widely Chanted Sacred Sounds",
      color: "#422868",
      purpose:
        "Some of the most widely chanted mantras carry profound spiritual power and are accessible to all. These sacred sounds are often repeated using a mala (prayer beads) of 108 beads to maintain rhythm and concentration. Each carries a specific vibrational intention.",
      focusAreas: [
        "Om — the primordial sound representing the universe",
        "Gayatri Mantra — a powerful prayer for wisdom and enlightenment",
        "Mahamrityunjaya Mantra — for healing and protection",
        "Om Namah Shivaya — sacred chant dedicated to Lord Shiva",
        "Om Namo Bhagavate Vasudevaya — devotional mantra for Lord Vishnu",
      ],
      mantras: {
        primary: [
          "Gayatri Mantra (21 times daily for wisdom)",
          "Om Namah Shivaya (108 times with mala for devotion)",
        ],
        optional: [
          "Mahamrityunjaya Mantra (11 times for healing)",
          "Om (3 times to open or close any practice)",
        ],
      },
      innerExperience: [
        "Gradual quieting of mental noise with each repetition",
        "Vibration felt in the chest and throat",
        "Sense of divine presence through sacred sound",
        "Growing devotion and focus accumulating over time",
      ],
      innerNote:
        "These mantras are often repeated using a mala to maintain rhythm and concentration.",
      transformationGoal: [
        "Learn at least one mantra by heart with correct pronunciation",
        "Practice daily with a 108-bead mala",
        "Experience the cumulative effect of consistent chanting",
        "Connect personally with a deity through their mantra",
      ],
      transformationNote:
        "Regular mantra chanting creates vibrations that positively influence both the mind and the surrounding environment.",
    },
    {
      days: "Daily Practice",
      name: "Daily Mantra Practice",
      tagline: "Begin with Sincerity and Devotion",
      color: "#8B6914",
      purpose:
        "Anyone can begin chanting mantras with sincerity and devotion. A quiet space, a focused mind, and a few minutes of daily practice are enough to start experiencing the benefits. Understanding the meaning and correct pronunciation of mantras is important to fully experience their spiritual power.",
      focusAreas: [
        "Choose a quiet space and consistent daily time for practice",
        "Learn the accurate chanting technique and Sanskrit pronunciation",
        "Understand the deeper meaning of the mantra you chant",
        "Practice with greater devotion and awareness each day",
        "Use a 108-bead mala to maintain count and concentration",
      ],
      mantras: {
        primary: [
          "Morning: Om (3x), then chosen mantra (108x) with mala",
          "Evening: Gayatri Mantra or a prayer of gratitude",
        ],
        optional: [],
      },
      innerExperience: [
        "Mental calmness and focus deepening over weeks",
        "Reduced stress and emotional reactivity",
        "Positive vibrations throughout the day",
        "Deepening connection with the divine through sound",
      ],
      innerNote:
        "Through consistent practice, mantras become more than just sounds — they become a pathway to inner peace.",
      transformationGoal: [
        "Establish a consistent daily mantra practice",
        "Learn accurate chanting techniques and Sanskrit pronunciation",
        "Practice with greater devotion and awareness",
        "Experience the full spiritual impact of mantra recitation",
      ],
      transformationNote:
        "A quiet space, a focused mind, and a few minutes of daily practice are enough to begin.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Improved Focus",
      description:
        "Regular mantra chanting sharpens mental clarity, focus, and the ability to concentrate without distraction.",
    },
    {
      icon: "",
      title: "Stress Reduction",
      description:
        "The rhythmic repetition of sacred sounds calms the nervous system, reducing stress, anxiety, and emotional tension.",
    },
    {
      icon: "",
      title: "Emotional Balance",
      description:
        "Chanting creates positive vibrations in the mind, cultivating greater emotional stability and inner harmony.",
    },
    {
      icon: "",
      title: "Spiritual Awareness",
      description:
        "Mantra practice deepens the connection with divine energy, expanding spiritual awareness and inner sensitivity.",
    },
    {
      icon: "",
      title: "Divine Connection",
      description:
        "Through mantra, devotees establish a living vibrational connection with the divine presence within and around them.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Mantras & Prayers</h1>
            <p className={styles.heroSubtitle}>
              Discover the Transformative Power of Sacred Sound. Mantras are{" "}
              <em>
                spiritual formulas composed of sacred syllables that influence
                consciousness and connect the devotee with divine energy
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
              Explore Mantras & Prayers
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
              src="../mantrasPrayers.png"
              alt="Mantras & Prayers"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>How Mantra Practice Is Structured</p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Sacred Sound</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From understanding what a mantra is to building a daily practice —
            each pillar deepens your connection with divine energy.
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
            The <span className={styles.maroon}>Mantra Journey</span> in Detail
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
                          Recommended Mantras
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
            <span className={styles.maroon}>Chanting Mantras</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Regular mantra chanting brings many spiritual and mental benefits.
            The rhythmic repetition creates vibrations that positively influence
            both the mind and the surrounding environment.
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
            <h2 className={styles.ctaTitle}>Begin Your Mantra Practice</h2>
            <p className={styles.ctaSubtext}>
              A quiet space, a focused mind, and a few minutes of daily practice
              are enough.
              <br />
              Through consistent practice, mantras become a pathway to inner
              peace and divine connection.
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

export default MantrasPrayers;
