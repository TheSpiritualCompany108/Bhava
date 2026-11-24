import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VedicScriptures.module.css";

function VedicScriptures() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      days: "The Vedas",
      name: "The Vedas — Foundation of Knowledge",
      tagline: "Divine Revelation of the Ancient Sages",
      color: "#6E1B21",
      purpose:
        "The Vedas are the earliest sacred texts of Hindu tradition and are considered divine revelations received by ancient sages (Rishis). The word 'Veda' means knowledge. They explore themes such as cosmic order (Rta), spiritual discipline, and harmony between humans and nature.",
      focusAreas: [
        "Rig Veda — hymns praising cosmic forces and divine powers",
        "Yajur Veda — focuses on rituals and ceremonial practices",
        "Sama Veda — known for its melodic chants and devotional hymns",
        "Atharva Veda — philosophical teachings, healing, and everyday wisdom",
        "Cosmic order (Rta) — harmony between humans and nature",
      ],
      mantras: {
        primary: [
          "Recite Vedic hymns with correct Sanskrit pronunciation",
          "Study with an authentic teacher or commentary",
        ],
        optional: ["Begin with Rigvedic hymns to the Sun and cosmic fire"],
      },
      innerExperience: [
        "Awe at the depth and antiquity of the knowledge",
        "Sense of connection to ancient sages and lineages",
        "Appreciation of cosmic order and natural law",
        "Growing reverence for the sacred sound of Sanskrit",
      ],
      innerNote:
        "The Vedas are not merely ancient texts — they are living transmissions of universal wisdom.",
      transformationGoal: [
        "Understand the four Vedas and their distinct themes",
        "Grasp the concept of cosmic order (Rta)",
        "Appreciate the role of ritual and sound in Vedic tradition",
        "Begin exploring Vedic mantras with proper guidance",
      ],
      transformationNote:
        "The Vedas form the eternal foundation upon which all of Hindu philosophy rests.",
    },
    {
      days: "Upanishads",
      name: "The Upanishads — Wisdom of Self-Realization",
      tagline: "The Philosophical Heart of the Vedic Tradition",
      color: "#1B4430",
      purpose:
        "The Upanishads represent the philosophical heart of the Vedic tradition. These texts explore profound questions about existence, consciousness, and the ultimate reality known as Brahman. They encourage seekers to move beyond rituals and discover truth through reflection, inquiry, and direct spiritual experience.",
      focusAreas: [
        "The unity of Atman (individual soul) with Brahman (universal consciousness)",
        "The illusion of material attachment (Maya)",
        "The importance of meditation and inner knowledge",
        "The path toward liberation (Moksha)",
        "Self-inquiry and contemplative practice",
      ],
      mantras: {
        primary: [
          "Tat Tvam Asi — 'Thou art That'",
          "Aham Brahmasmi — 'I am Brahman'",
        ],
        optional: [
          "Begin with Isha, Kena, and Mandukya Upanishads",
          "Silent sitting and contemplative reflection after study",
        ],
      },
      innerExperience: [
        "Deep questioning of the nature of the self",
        "Moments of clarity and inner stillness",
        "Shift from outer seeking to inner discovery",
        "Growing sense of the unity behind all existence",
      ],
      innerNote:
        "The Upanishads are not philosophy to be memorized but truths to be realized.",
      transformationGoal: [
        "Understand Brahman, Atman, and the unity of all existence",
        "Develop a contemplative approach to spiritual study",
        "Move beyond mechanical ritual into inner understanding",
        "Experience glimpses of the truth the Upanishads point to",
      ],
      transformationNote:
        "True understanding of the Upanishads comes from direct experience, not intellectual analysis alone.",
    },
    {
      days: "Puranas",
      name: "The Puranas — Stories That Teach Dharma",
      tagline: "Ancient Narratives of Gods, Cosmos, and Righteous Living",
      color: "#422868",
      purpose:
        "The Puranas are narrative scriptures that explain spiritual principles through stories of gods, sages, and cosmic events. These texts make complex philosophical ideas accessible through storytelling. They describe the creation of the universe, cycles of time, and the importance of righteous living (Dharma).",
      focusAreas: [
        "Stories of Lord Vishnu, Lord Shiva, Goddess Durga, and Lord Krishna",
        "Creation of the universe and cycles of cosmic time",
        "Righteous living (Dharma) through inspiring narratives",
        "Moral lessons and cultural traditions through story",
        "18 major Puranas covering all aspects of sacred knowledge",
      ],
      mantras: {
        primary: [
          "Om Namo Bhagavate Vasudevaya (Vishnu Purana mantra)",
          "Om Namah Shivaya (Shiva Purana mantra)",
        ],
        optional: [
          "Begin with Bhagavata Purana for accessible wisdom",
          "Study Vishnu Purana for creation and cosmic cycles",
        ],
      },
      innerExperience: [
        "Inspiration and devotion through sacred storytelling",
        "Understanding of dharma through relatable narratives",
        "Connection to the divine through the lives of deities",
        "Clarity about the purpose and values of life",
      ],
      innerNote:
        "The Puranas preserve the soul of Hindu culture through the timeless power of story.",
      transformationGoal: [
        "Understand dharma through Puranic narratives",
        "Learn the qualities of the divine through their stories",
        "Grasp the Hindu cosmological view of time and creation",
        "Develop inspiration and devotion through sacred literature",
      ],
      transformationNote:
        "Through inspiring stories and moral lessons, the Puranas help devotees understand spiritual values and cultural traditions.",
    },
    {
      days: "Study Path",
      name: "Commentary & Study Path",
      tagline: "Ancient Wisdom Applied to Modern Life",
      color: "#8B6914",
      purpose:
        "Vedic scriptures often contain symbolic language and deep philosophical concepts. Studying them with expert commentary helps uncover their deeper meanings. Through guided study, readers can understand the historical context, learn correct interpretation of Sanskrit verses, and apply ancient wisdom to everyday decisions.",
      focusAreas: [
        "Study with authentic commentary and qualified guidance",
        "Understand the historical context of each text",
        "Learn the correct interpretation of Sanskrit verses",
        "Apply philosophical insights to modern daily life",
        "Transform scripture study into a journey of self-discovery",
      ],
      mantras: {
        primary: [
          "Begin with Bhagavad Gita — 18 chapters of practical wisdom",
          "Explore major Upanishads with Shankaracharya's commentary",
        ],
        optional: [
          "Join a study group or find a qualified teacher",
          "Practice meditation alongside your scriptural study",
        ],
      },
      innerExperience: [
        "Deeper understanding of Hindu philosophy",
        "Greater clarity about dharma and life purpose",
        "Improved mental focus and self-discipline",
        "Connection to ancient spiritual heritage",
      ],
      innerNote:
        "Scripture study transforms from an intellectual exercise into a path of self-discovery.",
      transformationGoal: [
        "Develop a consistent scripture study practice",
        "Understand key philosophical concepts with clarity",
        "Gain guidance for ethical and meaningful living",
        "Connect ancient wisdom to present-day decisions",
        "Cultivate the curiosity and humility of a true seeker",
      ],
      transformationNote:
        "Through reflection, learning, and contemplation, Vedic wisdom continues to illuminate the path toward truth, harmony, and inner peace.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Deeper Philosophy",
      description:
        "Gain a profound understanding of Hindu philosophy — Brahman, Atman, Dharma, Karma, and Moksha — as living truths.",
    },
    {
      icon: "",
      title: "Clarity of Purpose",
      description:
        "Greater clarity about dharma and life purpose, guiding ethical decisions and meaningful living.",
    },
    {
      icon: "",
      title: "Mental Discipline",
      description:
        "Improved mental focus and self-discipline through the rigorous and contemplative practice of scriptural study.",
    },
    {
      icon: "",
      title: "Spiritual Heritage",
      description:
        "A living connection to thousands of years of accumulated wisdom passed down through an unbroken lineage of sages.",
    },
    {
      icon: "",
      title: "Inner Peace",
      description:
        "The wisdom of the Vedas, Upanishads, and Puranas continues to illuminate the path toward truth, harmony, and inner peace.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Vedic Scriptures</h1>
            <p className={styles.heroSubtitle}>
              Discover the Eternal Wisdom of Ancient India. The Vedic scriptures
              contain{" "}
              <em>
                timeless knowledge about the nature of the universe, the purpose
                of life, and the path toward spiritual liberation
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
              Explore Vedic Wisdom
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
              src="../vedicScriptures.png"
              alt="Vedic Scriptures"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Scriptures Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How the Scriptures Are Structured
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Vedic Knowledge</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From cosmic hymns to philosophical inquiry — each scripture
            illuminates a different facet of eternal wisdom.
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
          <p className={styles.eyebrowCenter}>Complete Study Guide</p>
          <h2 className={styles.sectionTitle}>
            The{" "}
            <span className={styles.maroon}>Vedic Journey</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any scripture to expand its full guide, key teachings, and
            study path.
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
                    Vol. {idx + 1}
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
                        <p className={styles.phaseDetailLabel}>Key Themes</p>
                        <ul className={styles.phaseDetailUl}>
                          {phase.focusAreas.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>
                          Mantras & Study Practices
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
            Why Study{" "}
            <span className={styles.maroon}>Vedic Scriptures</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            The wisdom contained in these scriptures remains timeless, offering
            insight for both spiritual seekers and curious learners.
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
              Begin Your Journey into Vedic Wisdom
            </h2>
            <p className={styles.ctaSubtext}>
              The Vedic scriptures invite us to explore life's deepest questions
              with curiosity and humility.
              <br />
              Through reflection and contemplation, ancient wisdom illuminates
              the path toward truth.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>
                Start Your Vedic Study
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

export default VedicScriptures;
