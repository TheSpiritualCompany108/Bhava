import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Aarti.module.css";

function Aarti() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);


  const phases = [
    {
      days: "Significance",
      name: "Spiritual Significance of Aarti",
      tagline: "The Light That Removes Darkness and Ignorance",
      color: "#B5451B",
      purpose:
        "Aarti is a sacred ritual performed in Hindu tradition to honor and worship the divine. It involves offering light from a lamp to the deity while chanting prayers or devotional songs. The light symbolizes the removal of darkness and ignorance, bringing spiritual illumination and blessings. In Hindu philosophy, light represents knowledge, purity, and divine presence — offering a lamp signifies surrendering our ego and inviting divine wisdom into our lives.",
      focusAreas: [
        "Light as a symbol of knowledge, purity, and divine presence",
        "The flame representing the removal of darkness and ignorance",
        "Surrendering the ego by offering the lamp to the divine",
        "Awakening the inner light that exists within every being",
        "Evening Aarti creating an atmosphere of peace and devotion",
      ],
      mantras: {
        primary: [
          "Om Jai Jagdish Hare — the universal Aarti of Lord Vishnu",
          "Om Jai Shiv Omkara — honoring Lord Shiva's supreme consciousness",
        ],
        optional: [
          "Jai Ambe Gauri — the Aarti of Goddess Durga",
          "Jai Ganesh Deva — for wisdom and the removal of obstacles",
        ],
      },
      innerExperience: [
        "Sense of the divine presence becoming tangible through the flame",
        "Ego softening and surrendering as the lamp is offered",
        "Inner light awakening in response to the external flame",
        "Peace and devotion naturally arising through the ritual",
      ],
      innerNote:
        "Through the flame of the lamp, we symbolically awaken the divine light that already exists within us.",
      transformationGoal: [
        "Understand the spiritual symbolism behind each element of Aarti",
        "Perform Aarti with conscious awareness of its inner meaning",
        "Experience the shift in consciousness that devotional offering creates",
        "Establish a daily Aarti practice to sanctify the home",
      ],
      transformationNote:
        "Aarti reminds us that divine wisdom guides us through the darkness of life — every flame is a beacon of grace.",
    },
    {
      days: "Elements",
      name: "Sacred Elements Used in Aarti",
      tagline: "Each Object Carries a Deep Spiritual Symbolism",
      color: "#6E1B21",
      purpose:
        "Every element used in the Aarti ceremony carries deep spiritual symbolism that transforms a simple lamp offering into a complete act of worship. Understanding the meaning behind each sacred object deepens the experience of the ritual and elevates it from cultural habit to genuine spiritual practice. When performed with this understanding, even the simplest Aarti becomes a powerful act of devotion.",
      focusAreas: [
        "Diya (Oil Lamp) — represents divine light and the guru's grace",
        "Incense (Agarbatti) — symbolizes purification of the environment",
        "Flowers — offered as a sign of devotion, beauty, and respect",
        "Bell (Ghanti) — creates sacred vibrations that purify the space",
        "Camphor flame — represents the complete burning of ego and impurities",
      ],
      mantras: {
        primary: [
          "Ring the bell three times before beginning to purify the space",
          "Light the camphor and offer it with the mantra: Om Namah Shivaya",
        ],
        optional: [
          "Offer flowers with the intention of surrendering all beauty to the divine",
          "Light incense with gratitude for the purification of mind and home",
        ],
      },
      innerExperience: [
        "Each element becoming a teacher of a different spiritual truth",
        "Ritual deepening as the symbolism of each object becomes clear",
        "Sense of creating a sacred space through conscious offering",
        "Gratitude arising naturally as the elements are prepared with care",
      ],
      innerNote:
        "Each element contributes to creating a spiritual and devotional atmosphere that purifies both the space and the heart.",
      transformationGoal: [
        "Learn the spiritual meaning of each element used in Aarti",
        "Prepare each element with conscious intention and gratitude",
        "Transform the ritual from habit into conscious devotional practice",
        "Experience how objects become sacred when offered with awareness",
      ],
      transformationNote:
        "When performed with understanding, even the simplest Aarti becomes a complete act of worship and self-offering.",
    },
    {
      days: "Practice",
      name: "10-Minute Evening Aarti Practice",
      tagline: "A Simple Ritual That Sanctifies the Home and Heart",
      color: "#1B4430",
      purpose:
        "A short Aarti ritual can easily be performed at home every evening, creating a daily anchor of peace, devotion, and gratitude. The practice involves preparing the sacred space, offering light to the deity, chanting devotional prayers, and sitting in silent gratitude. Even ten minutes of daily Aarti can uplift the mind, strengthen faith, and bring a deep sense of calm and spiritual renewal to the entire family.",
      focusAreas: [
        "Preparation — light a diya and place it before the deity or sacred image",
        "Centering — close the eyes and take deep breaths to settle the mind",
        "Offering — hold the lamp and move it in slow circular motions",
        "Chanting — sing or recite common Aarti prayers with devotion",
        "Closing — sit quietly in gratitude and receive the flame's blessing",
      ],
      mantras: {
        primary: [
          "Om Jai Jagdish Hare — the universal Aarti prayer",
          "Jai Ganesh Deva — begin with Ganesha for auspicious start",
        ],
        optional: [
          "Om Jai Lakshmi Mata — for prosperity and abundance blessings",
          "Aarti Kunj Bihari Ki — devotional Aarti of Lord Krishna",
        ],
      },
      innerExperience: [
        "Peaceful atmosphere created in the home through the ritual",
        "Mind naturally quieting as the chanting begins",
        "Sense of divine grace and blessing through the flame offering",
        "Gratitude arising effortlessly at the close of each session",
      ],
      innerNote:
        "After completing Aarti, place hands over the flame and gently touch eyes or forehead — receiving divine blessings.",
      transformationGoal: [
        "Perform evening Aarti daily for 21 consecutive days",
        "Experience the transformation in home atmosphere through regular practice",
        "Bring the whole family together in this sacred daily ritual",
        "Carry the peace and gratitude of Aarti into the rest of the evening",
      ],
      transformationNote:
        "Even a simple evening Aarti can uplift the mind and bring a sense of calm and gratitude to all who are present.",
    },
    {
      days: "Famous",
      name: "10 Famous Aarti Prayers",
      tagline: "Devotional Songs Sung Across India for Centuries",
      color: "#2B6291",
      purpose:
        "The Aarti tradition has produced some of the most beloved devotional songs in Hindu culture, sung by millions across India and the world every day. These Aartis honor different deities — from Lord Vishnu and Lord Shiva to Goddess Durga, Ganesha, Lakshmi, Saraswati, and Surya. Each Aarti carries the accumulated devotion of countless generations and creates a powerful field of sacred energy when sung with feeling and intention.",
      focusAreas: [
        "Om Jai Jagdish Hare — universal Aarti of Lord Vishnu",
        "Om Jai Shiv Omkara — Aarti of Lord Shiva",
        "Jai Ambe Gauri — Aarti of Goddess Durga",
        "Jai Ganesh Deva — Aarti of Lord Ganesha, remover of obstacles",
        "Aarti Kunj Bihari Ki — devotional Aarti of Lord Krishna",
      ],
      mantras: {
        primary: [
          "Om Jai Jagdish Hare — begin here as the universal Aarti",
          "Om Jai Lakshmi Mata — for evening Lakshmi puja and prosperity",
        ],
        optional: [
          "Hanuman Aarti — Aarti Kije Hanuman Lala Ki for courage and devotion",
          "Jai Saraswati Mata — for wisdom, knowledge, and creative inspiration",
        ],
      },
      innerExperience: [
        "Each Aarti resonating with the qualities of its presiding deity",
        "Accumulated devotion of generations felt through the sacred songs",
        "Voice becoming an instrument of worship through singing",
        "Home and heart filled with the divine presence of the worshipped deity",
      ],
      innerNote:
        "The tradition of Aarti has preserved these devotional songs across centuries — each one is a living spiritual inheritance.",
      transformationGoal: [
        "Learn at least three Aartis by heart for daily practice",
        "Understand the meaning and deity behind each Aarti",
        "Sing with full voice and devotion, not just mechanical repetition",
        "Experience how singing transforms worship into joyful spiritual union",
      ],
      transformationNote:
        "Through the light of Aarti, we remember that divine wisdom guides us through the darkness of life.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Sacred Home",
      description:
        "Regular Aarti creates a sanctified atmosphere in the home, filling it with positive energy, peace, and divine presence.",
    },
    {
      icon: "",
      title: "Deepened Devotion",
      description:
        "The daily act of offering light to the divine strengthens faith and cultivates genuine love and devotion.",
    },
    {
      icon: "",
      title: "Purified Environment",
      description:
        "The bell, incense, and sacred chanting of Aarti purify the home's energy and create a space for spiritual growth.",
    },
    {
      icon: "",
      title: "Family Unity",
      description:
        "Evening Aarti brings families together in shared devotion, creating bonds of love rooted in spiritual practice.",
    },
    {
      icon: "",
      title: "Inner Peace",
      description:
        "The ritual of Aarti calms the mind, dissolves the stress of the day, and fills the heart with gratitude and peace.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Aarti</h1>
            <p className={styles.heroSubtitle}>
              A sacred ritual of offering divine light — removing darkness and
              ignorance, bringing{" "}
              <em>spiritual illumination, devotion, and blessings</em> to the
              home and heart.
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() =>
                document
                  .getElementById("phases")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              Begin Aarti Practice
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{
                background:
                  "linear-gradient(to right, #4a2a0a 0%, #4a2a0a99 18%, transparent 50%)",
              }}
            />
            <img loading="lazy" decoding="async"
              src="/Daily%20Practices/Aarti.webp"
              alt="Aarti"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How Aarti Practice Is Structured
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Sacred Offering</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From spiritual significance to famous prayers — each pillar
            deepens your understanding and experience of this sacred daily ritual.
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
            <span className={styles.maroon}>Aarti Practice</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any section to expand its full guide, prayers, and spiritual
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
                          Aartis & Practice
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
            <span className={styles.maroon}>Daily Aarti</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Evening Aarti creates an atmosphere of peace, devotion, and
            spiritual reflection that transforms the home into a sacred space.
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
              Light the Lamp of Devotion
            </h2>
            <p className={styles.ctaSubtext}>
              Every evening is an opportunity to return to the sacred. A single
              flame, offered with love, is enough to fill a home with grace.
              <br />
              Begin your daily Aarti practice today and let the divine light
              guide you.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>
                Begin Daily Aarti
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

export default Aarti;
