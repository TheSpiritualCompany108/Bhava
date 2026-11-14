import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VedicHymns.module.css";

function VedicHymns() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      days: "Origins",
      name: "Meaning & Origins of Vedic Hymns",
      tagline: "Ancient Wisdom Preserved Through Sacred Sound",
      color: "#6E1B21",
      purpose:
        "Vedic hymns are among the oldest spiritual teachings in the world, originating from the Vedas composed thousands of years ago by ancient sages known as Rishis. These hymns contain profound spiritual knowledge, divine praises, and powerful chants that guide individuals toward truth, harmony, and enlightenment. They were originally passed down through oral tradition, carefully preserved through precise pronunciation and rhythmic chanting.",
      focusAreas: [
        "The unity of all existence",
        "Harmony between humans and nature",
        "The search for truth and wisdom",
        "The pursuit of inner awakening",
        "Gratitude to the divine forces of nature",
      ],
      mantras: {
        primary: [
          "Begin with Om — the primordial cosmic sound",
          "Practice the Gayatri Mantra for divine illumination",
        ],
        optional: [
          "Explore the Shanti Mantra for inner peace",
          "Study the Maha Mrityunjaya Mantra for protection",
        ],
      },
      innerExperience: [
        "Connection to the ancient wisdom of the Rishis",
        "Sense of harmony with the natural forces of the universe",
        "Inner stillness arising from sacred sound vibration",
        "Deepened reverence for the spiritual heritage of the Vedas",
      ],
      innerNote:
        "Vedic hymns connect modern seekers with the wisdom of ancient sages through the power of sacred sound.",
      transformationGoal: [
        "Understand the spiritual significance of Vedic hymns",
        "Learn the meaning behind key Vedic mantras",
        "Experience the transformative power of sacred sound",
        "Connect with the timeless wisdom of the Vedic tradition",
      ],
      transformationNote:
        "Through regular chanting, the wisdom of the Vedas becomes a source of inspiration, peace, and spiritual growth.",
    },
    {
      days: "Hymns",
      name: "20 Powerful Vedic Hymns",
      tagline: "Sacred Verses for Every Aspect of Spiritual Life",
      color: "#1B4430",
      purpose:
        "The Vedic tradition contains thousands of sacred hymns honoring divine forces such as Agni, Surya, Indra, and Varuna. Among these, 20 powerful hymns serve as the foundation of daily spiritual practice — from the universal Gayatri Mantra to devotional prayers for specific deities. Each mantra carries unique vibrations that align the practitioner with higher states of consciousness.",
      focusAreas: [
        "Gayatri Mantra — divine light and illumination of the intellect",
        "Maha Mrityunjaya — liberation from fear and spiritual freedom",
        "Shanti Mantra — peace and divine guidance for all beings",
        "Asato Ma Sadgamaya — guidance from illusion to truth",
        "Deity mantras for Ganesha, Shiva, Vishnu, Durga, and Lakshmi",
      ],
      mantras: {
        primary: [
          "Om Bhur Bhuvah Swaha — Gayatri Mantra for divine guidance",
          "Om Namah Shivaya — Shiva Panchakshari for consciousness",
        ],
        optional: [
          "Om Gan Ganapataye Namah — for removing obstacles",
          "Lokah Samastah Sukhino Bhava:ntu — for universal peace",
        ],
      },
      innerExperience: [
        "Feeling of divine presence through sacred vibration",
        "Mental clarity and focused awareness during chanting",
        "Emotional peace arising from devotional practice",
        "Sense of alignment with the cosmic order",
      ],
      innerNote:
        "Each mantra carries specific vibrations that correspond to different qualities of consciousness and divine energy.",
      transformationGoal: [
        "Learn at least 5 Vedic mantras with proper meaning",
        "Understand the deity or force each mantra honors",
        "Practice chanting with correct pronunciation",
        "Experience the unique vibration of each sacred hymn",
      ],
      transformationNote:
        "These hymns express gratitude to divine forces and recognize the divine presence throughout the universe.",
    },
    {
      days: "Practice",
      name: "Daily Vedic Chanting Practice",
      tagline: "Seven Minutes to Transform Your Inner World",
      color: "#422868",
      purpose:
        "A simple daily practice of Vedic hymn chanting can profoundly transform the mind and spirit. Chanting Vedic hymns creates powerful vibrations that purify the mind and environment. The sound patterns of Sanskrit words produce rhythmic energy that enhances concentration and spiritual awareness. Even seven minutes of daily chanting builds a foundation for lasting spiritual transformation.",
      focusAreas: [
        "Sit comfortably with straight spine in a quiet place",
        "Begin with deep breathing to center the mind",
        "Chant Om three times to establish sacred vibration",
        "Practice the Gayatri Mantra or Shanti Mantra with full focus",
        "Close with silent absorption of the sacred vibrations",
      ],
      mantras: {
        primary: [
          "Om (3 times) — centering and connecting with cosmic sound",
          "Gayatri Mantra — for divine illumination and clarity",
        ],
        optional: [
          "Asato Ma Sadgamaya — guidance from darkness to light",
          "Om Shanti Shanti Shanti — peace for all dimensions",
        ],
      },
      innerExperience: [
        "Improved mental clarity and focus through regular practice",
        "Emotional balance and deep calmness",
        "Strengthened spiritual connection with the divine",
        "Progressive deepening of awareness over time",
      ],
      innerNote:
        "Even a short daily session can bring clarity, peace, and spiritual upliftment through the power of sacred sound.",
      transformationGoal: [
        "Establish a consistent daily chanting routine",
        "Experience the calming effect of Vedic vibrations",
        "Build familiarity with the sounds and meanings of key mantras",
        "Develop genuine devotion through regular practice",
      ],
      transformationNote:
        "Consistent daily practice is the foundation of all spiritual transformation — begin with just seven minutes.",
    },
    {
      days: "Learning",
      name: "Structured Vedic Learning Path",
      tagline: "From Beginner to Devoted Practitioner",
      color: "#8B6914",
      purpose:
        "The Vedic tradition offers a structured path of learning that takes the seeker from basic understanding to deep spiritual practice. The four Vedas — Rigveda, Yajurveda, Samaveda, and Atharvaveda — each contain distinct wisdom, from hymns praising divine forces to guidelines for sacred ceremonies, melodic chants, and knowledge of healing and daily life.",
      focusAreas: [
        "Rigveda — hymns praising divine forces",
        "Yajurveda — guidelines for rituals and sacred ceremonies",
        "Samaveda — melodic chants used in Vedic worship",
        "Atharvaveda — knowledge of healing and spiritual practices",
        "108 Upanishads — the philosophical heart of Vedic wisdom",
      ],
      mantras: {
        primary: [
          "Begin each study session with Om chanting",
          "Learn one new mantra per week with its full meaning",
        ],
        optional: [
          "Study the Guru Mantra to honor the lineage of teachers",
          "Create daily 5-minute wisdom sessions from Vedic texts",
        ],
      },
      innerExperience: [
        "Growing sense of connection to an ancient spiritual lineage",
        "Intellectual satisfaction from understanding profound teachings",
        "Deepened devotion through knowledge of the tradition",
        "Inspiration to live by Vedic principles of harmony and truth",
      ],
      innerNote:
        "The Vedas teach harmony with nature, spiritual wisdom, righteous living, and the pursuit of truth.",
      transformationGoal: [
        "Understand the structure and purpose of the four Vedas",
        "Learn the philosophical foundation of Vedic wisdom",
        "Apply Vedic principles to daily life and relationships",
        "Develop a lifelong relationship with this sacred tradition",
      ],
      transformationNote:
        "By listening to and understanding these hymns, individuals discover timeless guidance for living a balanced and meaningful life.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Sacred Sound Mastery",
      description:
        "Regular chanting of Vedic hymns develops proper pronunciation and understanding of sacred Sanskrit vibrations.",
    },
    {
      icon: "",
      title: "Mental Clarity",
      description:
        "The rhythmic patterns of Vedic chanting improve focus, concentration, and cognitive clarity through sound vibration.",
    },
    {
      icon: "",
      title: "Spiritual Connection",
      description:
        "Chanting hymns dedicated to divine forces strengthens the practitioner's personal connection with the sacred.",
    },
    {
      icon: "",
      title: "Emotional Balance",
      description:
        "Sanskrit vibrations calm the nervous system, reduce stress, and create deep emotional stability.",
    },
    {
      icon: "",
      title: "Living Tradition",
      description:
        "Every chant preserves an unbroken lineage of wisdom stretching back thousands of years to the ancient Rishis.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Vedic Hymns</h1>
            <p className={styles.heroSubtitle}>
              Among the oldest spiritual teachings in the world, composed by
              ancient sages to guide seekers toward{" "}
              <em>truth, harmony, and enlightenment</em>.
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() =>
                document
                  .getElementById("phases")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Begin Vedic Study
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{
                background:
                  "linear-gradient(to right, #1a3a4a 0%, #1a3a4a99 18%, transparent 50%)",
              }}
            />
            <img
              src="/Daily%20Practices/Vedic%20Hymns.png"
              alt="Vedic Hymns"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How to Approach Vedic Hymn Practice
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Vedic Wisdom</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From origins to daily practice — each pillar builds a deeper
            understanding of this sacred ancient tradition.
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
            <span className={styles.maroon}>Vedic Hymns Path</span> in Detail
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
            The Gifts of{" "}
            <span className={styles.maroon}>Vedic Chanting</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Through consistent practice, the wisdom of the Vedas becomes a
            source of inspiration, peace, and spiritual growth.
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
            <h2 className={styles.ctaTitle}>Begin Your Vedic Journey</h2>
            <p className={styles.ctaSubtext}>
              Ancient mantras await your voice. The sages who composed these
              hymns created a living bridge between humanity and the divine.
              <br />
              Seven minutes a day is all it takes to step onto this sacred path.
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

export default VedicHymns;
