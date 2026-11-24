import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PujaRituals.module.css";

function PujaRituals() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      days: "Purpose",
      name: "Purpose of Puja",
      tagline: "Invite the Divine Into Your Life",
      color: "#6E1B21",
      purpose:
        "Puja is performed to invite divine energy into our lives and align our thoughts and actions with dharma. It allows devotees to slow down, reflect, and reconnect with the sacred. Puja reminds us that the divine presence exists not only in temples but also within our own hearts.",
      focusAreas: [
        "Gratitude for life and blessings",
        "Discipline in daily spiritual practice",
        "Mindfulness and devotion",
        "Respect for cosmic order",
        "Reconnect with the sacred",
      ],
      mantras: {
        primary: ["Om (silent or aloud)", "Personal prayer of intention"],
        optional: ["Offer your day to the divine at the altar"],
      },
      innerExperience: [
        "Sense of calm and clarity",
        "Feeling of gratitude",
        "Awareness of divine presence",
        "Slowing down of the mind",
      ],
      innerNote:
        "Puja reminds us that the divine presence exists not only in temples but also within our own hearts.",
      transformationGoal: [
        "Daily devotional intention",
        "Conscious reconnection with the divine",
        "Alignment with dharma",
        "Sense of inner peace",
      ],
      transformationNote:
        "Purpose transforms puja from ritual into living devotion.",
    },
    {
      days: "Elements",
      name: "Essential Elements",
      tagline: "Symbols of Purity and Devotion",
      color: "#1B4430",
      purpose:
        "Traditional puja rituals involve symbolic offerings that represent purity, devotion, and surrender. Each element carries a deeper spiritual meaning beyond the physical act — from the lamp that removes darkness and awakens knowledge, to the flowers that symbolize love and surrender of the ego.",
      focusAreas: [
        "Diya (Lamp) — removal of darkness and awakening of knowledge",
        "Incense (Agarbatti) — purifies the environment, prayers rising to divine",
        "Flowers — love, purity, and surrender of the ego",
        "Water (Kalash or Panchamrit) — purification and life energy",
        "Fruits and Prasad — gratitude for nature's abundance",
      ],
      mantras: {
        primary: [
          "Arrange each item with awareness and intention",
          "Understand the symbolism of each offering",
        ],
        optional: ["Dedicate each element as you place it on the altar"],
      },
      innerExperience: [
        "Each offering deepens awareness",
        "Physical elements become inner surrender",
        "Senses engage with the sacred",
        "Space becomes spiritually charged",
      ],
      innerNote:
        "Each offering carries a deeper spiritual meaning beyond the physical act.",
      transformationGoal: [
        "Understand the symbolism behind each element",
        "Arrange the altar with intention and care",
        "Move from mechanical action to mindful offering",
        "Feel the sacredness within each item",
      ],
      transformationNote:
        "When we understand each offering, puja becomes a conscious act of devotion.",
    },
    {
      days: "Steps",
      name: "Basic Steps of Puja",
      tagline: "The Sacred Ritual Path",
      color: "#422868",
      purpose:
        "Although rituals may vary by region and deity, a simple puja generally follows six essential steps. Each step has its own spiritual significance. Puja becomes more powerful when performed with awareness and devotion rather than as a mechanical routine.",
      focusAreas: [
        "Step 1 — Preparation: clean the space and arrange the altar",
        "Step 2 — Invocation (Avahan): invite the divine presence through mantra",
        "Step 3 — Offering Rituals: offer flowers, water, incense, light, and food",
        "Step 4 — Mantra Chanting: recite sacred mantras with devotion",
        "Step 5 — Aarti: wave the lamp in circular motion while singing hymns",
        "Step 6 — Prasad Distribution: offer blessed food as divine grace",
      ],
      mantras: {
        primary: [
          "Om",
          "Gayatri Mantra",
          "Mahamrityunjaya Mantra",
          "Om Namah Shivaya",
        ],
        optional: ["Vishnu or Durga mantras depending on the deity"],
      },
      innerExperience: [
        "Growing sense of reverence at each step",
        "Mind becomes focused and still",
        "Space transforms into sacred ground",
        "Devotion arises naturally through the ritual",
      ],
      innerNote:
        "When performed with awareness, each step becomes a meditation in itself.",
      transformationGoal: [
        "Complete a full puja with confidence and clarity",
        "Understand the meaning and purpose of each step",
        "Chant mantras with correct pronunciation",
        "Experience the spiritual atmosphere of worship",
      ],
      transformationNote:
        "Puja becomes powerful when performed with awareness and devotion.",
    },
    {
      days: "Daily Practice",
      name: "Daily Puja Practice",
      tagline: "Transform the Ordinary Into Sacred",
      color: "#8B6914",
      purpose:
        "Regular puja practice can bring profound changes in a person's inner life. When performed with sincerity, even a short daily puja can transform the atmosphere of the home and mind. You do not need elaborate arrangements to begin — a simple lamp, a quiet space, and sincere devotion are enough.",
      focusAreas: [
        "Set a consistent time each day for your practice",
        "Start with a simple lamp and a quiet, clean space",
        "Learn the meaning behind each offering you make",
        "Gradually deepen your spiritual practice over time",
        "Carry the spirit of devotion beyond the altar into daily life",
      ],
      mantras: {
        primary: [
          "Morning: Light lamp, chant Om, offer flowers with gratitude",
          "Evening: Perform aarti and close with a prayer of gratitude",
        ],
        optional: [],
      },
      innerExperience: [
        "Mental calmness and focus",
        "Emotional stability throughout the day",
        "Positive energy throughout the home",
        "Strengthened faith and devotion",
        "Deeper spiritual discipline over time",
      ],
      innerNote: "Everyday moments become sacred acts of devotion.",
      transformationGoal: [
        "Establish a consistent daily worship routine",
        "Bring peace and harmony into the home",
        "Cultivate lasting devotion and faith",
        "Purify the mind through regular practice",
        "Connect with ancient spiritual wisdom",
      ],
      transformationNote:
        "A simple lamp, a quiet space, and sincere devotion are enough to begin.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Mental Calmness",
      description:
        "Regular puja brings mental clarity, focus, and a quiet mind that is no longer scattered by daily distractions.",
    },
    {
      icon: "",
      title: "Emotional Stability",
      description:
        "Devotional practice softens emotional reactions, bringing greater balance and inner harmony to daily life.",
    },
    {
      icon: "",
      title: "Spiritual Discipline",
      description:
        "Consistency in puja builds lasting spiritual discipline, transforming worship into a natural daily rhythm.",
    },
    {
      icon: "",
      title: "Positive Energy",
      description:
        "Sacred rituals infuse the home with positive energy, creating an atmosphere of peace and divine presence.",
    },
    {
      icon: "",
      title: "Strengthened Devotion",
      description:
        "Through daily puja, faith deepens and devotion grows into a living connection with the divine.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Puja Rituals</h1>
            <p className={styles.heroSubtitle}>
              Learn the Sacred Art of Worship. Through offerings, prayers, and
              chants, puja creates a{" "}
              <em>
                spiritual connection between the individual soul and the
                universal consciousness
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
              Explore Puja Rituals
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
              src="../pujaRituals.png"
              alt="Puja Rituals"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>How Puja Is Structured</p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Sacred Worship</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From purpose to daily practice — each pillar deepens your
            connection with the divine.
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
            The <span className={styles.maroon}>Puja Journey</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any section to expand its full guide, offerings, and
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
                        <p className={styles.phaseDetailLabel}>Key Practices</p>
                        <ul className={styles.phaseDetailUl}>
                          {phase.focusAreas.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>
                          Mantras & Offerings
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
            Spiritual{" "}
            <span className={styles.maroon}>Benefits of Daily Puja</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            When performed with sincerity, even a short daily puja can
            transform the atmosphere of the home and mind.
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
            <h2 className={styles.ctaTitle}>Begin Your Puja Practice</h2>
            <p className={styles.ctaSubtext}>
              A simple lamp, a quiet space, and sincere devotion are enough.
              <br />
              Through puja, everyday moments become sacred acts of devotion.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary} onClick={() => navigate("/products")}>
                Start Your Daily Puja
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

export default PujaRituals;
