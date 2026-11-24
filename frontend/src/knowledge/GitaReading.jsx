import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GitaReading.module.css";

function GitaReading() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);


  const phases = [
    {
      days: "Purpose",
      name: "Why Read the Bhagavad Gita Daily",
      tagline: "Timeless Wisdom for Every Challenge of Life",
      color: "#6E1B21",
      purpose:
        "The Bhagavad Gita is one of the most sacred spiritual texts in Hindu philosophy, containing timeless teachings given by Lord Krishna to Arjuna on the battlefield of Kurukshetra. Reading a verse daily brings clarity to the mind and direction to life. Even a few minutes of reflection on its teachings can inspire spiritual growth and balanced living. The Gita offers practical guidance for everyday challenges that is as relevant today as it was thousands of years ago.",
      focusAreas: [
        "Self-awareness and understanding one's true nature",
        "Inner peace through alignment with dharma",
        "Discipline and focus in thought and action",
        "Spiritual understanding of life's deeper purpose",
        "Balanced decision-making rooted in wisdom",
      ],
      mantras: {
        primary: [
          "Begin each reading with Om to set sacred intention",
          "Read slowly — one verse per day with full attention",
        ],
        optional: [
          "Chant Om Namo Bhagavate Vasudevaya before reading",
          "Close with Om Shanti Shanti Shanti after reflection",
        ],
      },
      innerExperience: [
        "Clarity arising as the Gita's wisdom illuminates daily challenges",
        "Growing sense of direction and purpose through daily reflection",
        "Inner peace that comes from aligning with timeless teaching",
        "Deepening connection with Lord Krishna as divine teacher",
      ],
      innerNote:
        "Through its wisdom, the Gita teaches how to live a meaningful and righteous life with clarity, purpose, and compassion.",
      transformationGoal: [
        "Establish a daily Gita reading habit of even five minutes",
        "Understand how the Gita's teachings apply to your own life",
        "Experience the mental clarity that comes from daily wisdom",
        "Develop a personal relationship with this sacred scripture",
      ],
      transformationNote:
        "By reading a small passage each day, we gradually absorb the wisdom of the Gita and learn to approach life with calmness and devotion.",
    },
    {
      days: "Teachings",
      name: "Core Teachings of the Bhagavad Gita",
      tagline: "Four Paths to Truth, Liberation, and Inner Peace",
      color: "#2B6291",
      purpose:
        "The Bhagavad Gita presents four interconnected paths to spiritual liberation — Dharma, Karma Yoga, Bhakti Yoga, and Jnana Yoga. Each path suits a different temperament and stage of spiritual development, yet all lead to the same destination: union with the divine and liberation from suffering. Understanding these four paths gives the practitioner a complete map of the spiritual life.",
      focusAreas: [
        "Dharma — performing responsibilities with sincerity and integrity",
        "Karma Yoga — acting without attachment to the results of action",
        "Bhakti Yoga — developing devotion and surrender to the divine",
        "Jnana Yoga — seeking knowledge of the true nature of the Self",
        "Integration of all four paths in balanced spiritual living",
      ],
      mantras: {
        primary: [
          "Karmanye vadhikaraste ma phaleshu kadachana — act without attachment",
          "Yoga karmasu kaushalam — yoga is excellence in action",
        ],
        optional: [
          "Yada yada hi dharmasya glanir bhavati — on the decline of righteousness",
          "Sarva dharman parityajya mam ekam sharanam vraja — total surrender",
        ],
      },
      innerExperience: [
        "Understanding of how to act rightly without anxiety about outcomes",
        "Heart opening to devotion and surrender through Bhakti path",
        "Intellect clarifying through Jnana as the Self is understood",
        "Life becoming more harmonious as Dharma guides choices",
      ],
      innerNote:
        "These teachings help individuals live with clarity, purpose, and compassion in every area of life.",
      transformationGoal: [
        "Understand the four yogic paths taught in the Gita",
        "Identify which path resonates most with your nature",
        "Apply at least one teaching to a current life situation",
        "Experience how Gita wisdom creates clarity and peace",
      ],
      transformationNote:
        "The Gita does not prescribe one path for all — it offers four paths so each seeker can find their own way to truth.",
    },
    {
      days: "Practice",
      name: "Daily Gita Reading Practice",
      tagline: "Five Minutes That Can Illuminate Your Entire Day",
      color: "#1B4430",
      purpose:
        "A simple five-minute daily practice of Gita reading can bring profound insight and transformation. The key is consistency and reflection — not rushing through verses but sitting with one verse and allowing its wisdom to permeate the mind and heart. Over time, these daily reflections deepen understanding and strengthen spiritual awareness, turning the Gita into a living guide rather than a text on a shelf.",
      focusAreas: [
        "Find a quiet place and sit comfortably with straight spine",
        "Take deep breaths to calm the mind before reading",
        "Read one verse from the Bhagavad Gita slowly and clearly",
        "Reflect on its meaning and how it applies to your life today",
        "Spend a moment in silence absorbing the teaching fully",
      ],
      mantras: {
        primary: [
          "Read verse 2.47 — the foundation of Karma Yoga practice",
          "Reflect with the question: How can I act without attachment today?",
        ],
        optional: [
          "Keep a Gita journal to record daily reflections and insights",
          "Share one verse weekly with family or a spiritual friend",
        ],
      },
      innerExperience: [
        "Mind becoming calmer and clearer through consistent reflection",
        "Growing ability to apply ancient wisdom to modern challenges",
        "Sense of being guided by a timeless and loving teacher",
        "Spiritual awareness naturally deepening through daily contact with the text",
      ],
      innerNote:
        "Even five minutes of daily reflection can illuminate the path toward inner growth and spiritual fulfillment.",
      transformationGoal: [
        "Read at least one verse from the Gita every single day",
        "Develop the habit of applying each verse's teaching to real life",
        "Build a personal practice that spans the full 18 chapters",
        "Experience the Gita as a living guide rather than an historical text",
      ],
      transformationNote:
        "True happiness comes from inner awareness and spiritual understanding — the Gita is the map to both.",
    },
    {
      days: "Journey",
      name: "40-Day Gita Wisdom Journey",
      tagline: "Walk the Timeless Path of the Bhagavad Gita",
      color: "#422868",
      purpose:
        "The 40-Day Gita Wisdom Journey is a structured program that takes the seeker through the Bhagavad Gita's 18 chapters across four weeks, culminating in a final week of integration and application. The journey covers the story of Kurukshetra, the four yogic paths, the nature of consciousness, and the supreme teaching of surrender. By Day 40, the practitioner carries the Gita's wisdom as a living guide in daily life.",
      focusAreas: [
        "Week 1 — Understanding the Context: Kurukshetra, Arjuna's dilemma, Dharma",
        "Week 2 — Path of Action: Karma Yoga, acting without attachment, duty",
        "Week 3 — Path of Devotion: Bhakti Yoga, surrender, faith, divine love",
        "Week 4 — Path of Wisdom: Understanding the Self, consciousness, liberation",
        "Final Days — Living the Gita: Applying all teachings to everyday life",
      ],
      mantras: {
        primary: [
          "Study one Gita chapter per session with reflection questions",
          "Apply each week's theme to your work, relationships, and inner life",
        ],
        optional: [
          "Join satsang sessions for expert guidance on each chapter",
          "Use daily reflection prompts to personalize each verse's teaching",
        ],
      },
      innerExperience: [
        "Progressive deepening of wisdom across all 40 days",
        "Heart and mind aligning as devotion and knowledge integrate",
        "Sense of the Gita's teachings becoming your own living wisdom",
        "A transformed relationship with action, devotion, and the divine",
      ],
      innerNote:
        "Walk the timeless path of the Bhagavad Gita and let ancient wisdom illuminate your dharma.",
      transformationGoal: [
        "Complete all 18 chapters with daily reading and reflection",
        "Understand the complete map of the spiritual life the Gita provides",
        "Emerge from 40 days with the Gita as a personal spiritual compass",
        "Live the teachings of the Gita with calmness, courage, and devotion",
      ],
      transformationNote:
        "The Bhagavad Gita is not only a philosophical text but also a guide for living a peaceful and balanced life.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Daily Wisdom",
      description:
        "Each verse offers practical spiritual guidance that brings clarity and direction to the challenges of daily life.",
    },
    {
      icon: "",
      title: "Inner Peace",
      description:
        "The Gita's teachings on non-attachment and dharma create a lasting inner calm that is unshaken by external circumstances.",
    },
    {
      icon: "",
      title: "Right Action",
      description:
        "Karma Yoga teaches how to act with full effort and zero attachment to outcomes — the foundation of a meaningful life.",
    },
    {
      icon: "",
      title: "Divine Devotion",
      description:
        "Bhakti Yoga opens the heart to genuine love and surrender, transforming every action into an offering to the divine.",
    },
    {
      icon: "",
      title: "Self-Knowledge",
      description:
        "Jnana Yoga illuminates the true nature of the Self, dissolving false identification and revealing the eternal within.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Gita Reading</h1>
            <p className={styles.heroSubtitle}>
              Lord Krishna's timeless teachings on duty, devotion, wisdom, and
              the path to{" "}
              <em>inner peace, right action, and spiritual liberation</em>.
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() =>
                document
                  .getElementById("phases")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Begin the Gita Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{
                background:
                  "linear-gradient(to right, #1a4a3a 0%, #1a4a3a99 18%, transparent 50%)",
              }}
            />
            <img loading="lazy" decoding="async"
              src="/Daily%20Practices/Gita%20Reading.webp"
              alt="Gita Reading"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How to Approach the Bhagavad Gita
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Gita Wisdom</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From purpose to 40-day journey — each pillar opens a deeper
            dimension of this sacred and timeless scripture.
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
            <span className={styles.maroon}>Gita Reading Path</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any section to expand its full guide, key verses, and
            spiritual teachings.
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
                          Verses & Practice
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
            The Living Gifts of{" "}
            <span className={styles.maroon}>Gita Wisdom</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            The Bhagavad Gita is not only a philosophical text but also a guide
            for living a peaceful, balanced, and purposeful life.
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
              Let Ancient Wisdom Light Your Path
            </h2>
            <p className={styles.ctaSubtext}>
              The Bhagavad Gita has guided millions through life's greatest
              challenges for thousands of years. Its wisdom is waiting for you.
              <br />
              Begin with one verse, one reflection, one day at a time.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>
                Begin the 40-Day Journey
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

export default GitaReading;
