import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TempleTraditions.module.css";

function TempleTraditions() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);

  const phases = [
    {
      days: "Purpose",
      name: "Spiritual Purpose of Temples",
      tagline: "Where Divine Energy Concentrates",
      color: "#6E1B21",
      purpose:
        "Hindu temples are not only places of worship but also powerful spiritual centers that preserve ancient traditions, rituals, and wisdom. The temple is considered a sacred space where divine energy is concentrated, helping devotees focus their minds and elevate their consciousness.",
      focusAreas: [
        "Offering prayers and devotion to the deity",
        "Seeking blessings and guidance",
        "Practicing humility and gratitude",
        "Experiencing peace and spiritual clarity",
        "Pausing from daily distractions to reconnect with the divine",
      ],
      mantras: {
        primary: [
          "Om Namah Shivaya — upon entering a Shiva temple",
          "Om Namo Narayanaya — upon entering a Vishnu temple",
        ],
        optional: [
          "Chant the deity's name silently as you approach the sanctum",
        ],
      },
      innerExperience: [
        "Sense of stillness and peace within the sacred space",
        "Heightened awareness and focus",
        "Feeling of being held and supported by the divine",
        "Natural humility and surrender arising",
      ],
      innerNote:
        "Temples remind devotees to pause from daily distractions and reconnect with the divine presence.",
      transformationGoal: [
        "Enter each temple with intention and awareness",
        "Experience genuine devotion and inner peace",
        "Understand the deeper purpose of temple worship",
        "Develop a consistent practice of temple visits",
      ],
      transformationNote:
        "Visiting a temple is more than a ritual — it is an experience that engages the senses, the mind, and the spirit.",
    },
    {
      days: "Architecture",
      name: "Sacred Temple Architecture",
      tagline: "Built According to Cosmic Order",
      color: "#1B4430",
      purpose:
        "Ancient Hindu temples are built according to traditional architectural principles known as Vastu Shastra and Agama Shastra. These guidelines ensure that the temple structure aligns with cosmic energy and natural harmony. Every element of the structure reflects spiritual symbolism and sacred geometry.",
      focusAreas: [
        "Garbhagriha (Sanctum) — heart of the temple, center of spiritual energy",
        "Mandapa (Prayer Hall) — gathering space for prayer, chanting, and rituals",
        "Shikhara or Gopuram — tower symbolizing connection between earth and divine",
        "Pradakshina Path — pathway for circumambulation around the sanctum",
        "Vastu Shastra and Agama Shastra — the sacred sciences of temple design",
      ],
      mantras: {
        primary: [
          "Contemplate the cosmic symbolism in each part of the structure",
          "Walk the Pradakshina Path with silent mantra repetition",
        ],
        optional: [
          "Study the iconography and symbolism of temple sculptures",
        ],
      },
      innerExperience: [
        "Awe at the depth of sacred architectural knowledge",
        "Sense of moving through layers of increasingly sacred space",
        "Connection between the physical structure and inner cosmos",
        "Feeling of cosmic order and harmony within the space",
      ],
      innerNote:
        "The temple is the universe in miniature — earth below, the heavens above, and the divine at the center.",
      transformationGoal: [
        "Understand the spiritual symbolism of each temple element",
        "Appreciate the science of Vastu and Agama Shastra",
        "Move through temple space with greater awareness",
        "See the temple as a three-dimensional sacred diagram",
      ],
      transformationNote:
        "Each part of the temple reflects spiritual symbolism and sacred geometry that guides the devotee inward.",
    },
    {
      days: "Rituals",
      name: "Temple Rituals and Worship",
      tagline: "Living Worship from Before Dawn to After Dusk",
      color: "#422868",
      purpose:
        "Temples follow a structured schedule of daily rituals known as Seva or Puja. These rituals are performed by trained priests who chant sacred mantras and offer items to the deity. They create a powerful atmosphere of devotion and spiritual energy throughout the day.",
      focusAreas: [
        "Abhishekam — ritual bathing of the deity with sacred substances",
        "Archana — offering flowers while chanting the names of the deity",
        "Aarti — waving a lamp before the deity while singing devotional hymns",
        "Prasad Offering — sacred food offered to the deity and distributed as blessings",
        "Daily Seva — the structured schedule from pre-dawn awakening to night rest",
      ],
      mantras: {
        primary: [
          "Participate in Abhishekam on auspicious days",
          "Receive Archana by offering the deity's 108 names",
        ],
        optional: [
          "Attend the morning Aarti for the most powerful darshan",
          "Offer coconut, flowers, or fruits through the temple priest",
        ],
      },
      innerExperience: [
        "Deep sense of reverence during ritual ceremonies",
        "Feeling of divine presence through the sights, sounds, and fragrances",
        "Purification and renewal through participation in Seva",
        "Devotion naturally arising through witnessing sacred rituals",
      ],
      innerNote:
        "The sound of bells, the fragrance of incense, the glow of lamps, and the chanting of mantras create a sacred atmosphere.",
      transformationGoal: [
        "Understand the meaning and purpose of each temple ritual",
        "Participate in at least one Abhishekam or Aarti consciously",
        "Receive prasad with gratitude and reverence",
        "Experience the full atmosphere of daily temple worship",
      ],
      transformationNote:
        "These rituals create a powerful atmosphere of devotion and spiritual energy that transforms all who witness them.",
    },
    {
      days: "Culture",
      name: "Cultural and Devotional Practices",
      tagline: "Preserving Dharma Across Generations",
      color: "#8B6914",
      purpose:
        "Temples also play an important role in preserving Hindu culture and community traditions. Festivals, spiritual gatherings, and religious ceremonies often take place in temples, bringing people together in shared devotion. Through temple traditions, generations continue to learn values such as respect, discipline, compassion, and faith.",
      focusAreas: [
        "Chanting sacred mantras within the temple space",
        "Singing devotional songs (Bhajans) with the community",
        "Meditation and silent prayer in the mandapa",
        "Circumambulation of the sanctum as moving meditation",
        "Listening to spiritual teachings from temple scholars",
      ],
      mantras: {
        primary: [
          "Morning visit during Brahma Muhurta (before 6 AM) for deepest energy",
          "Practice circumambulation (Pradakshina) with silent mantra",
        ],
        optional: [
          "Attend festival celebrations to connect with community and tradition",
          "Sit in silent contemplation for 10 minutes after darshan",
        ],
      },
      innerExperience: [
        "Sense of belonging to a living spiritual community",
        "Connection to the cultural heritage of generations past",
        "Inspiration through shared devotion and sacred celebration",
        "Deepened faith through witnessing tradition preserved and alive",
      ],
      innerNote:
        "Temple traditions continue to guide spiritual seekers toward harmony, wisdom, and divine connection.",
      transformationGoal: [
        "Develop respect for divine wisdom and cultural heritage",
        "Cultivate discipline in spiritual life through regular visits",
        "Experience the power of communal devotion and shared practice",
        "Connect with the living tradition that has endured for millennia",
        "Carry the spirit of the temple into everyday life",
      ],
      transformationNote:
        "By learning about temple traditions, devotees can participate in them with greater awareness and reverence.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Respect for Wisdom",
      description:
        "Temple traditions cultivate deep respect for divine wisdom and the sacred knowledge preserved across thousands of years.",
    },
    {
      icon: "",
      title: "Spiritual Discipline",
      description:
        "Regular temple visits build lasting spiritual discipline and a life aligned with the rhythms of devotion and worship.",
    },
    {
      icon: "",
      title: "Compassion & Service",
      description:
        "The spirit of the temple teaches compassion, humility, and selfless service as expressions of living dharma.",
    },
    {
      icon: "",
      title: "Faith and Devotion",
      description:
        "Through witnessing sacred rituals and receiving prasad, faith deepens into a living, personal devotion.",
    },
    {
      icon: "",
      title: "Inner Peace",
      description:
        "The sacred atmosphere of a temple — bells, incense, lamps, and chanting — creates a profound and lasting inner stillness.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Temple Traditions</h1>
            <p className={styles.heroSubtitle}>
              Understanding the Sacred Practices of Hindu Temples. For
              thousands of years, temples have served as spaces where devotees{" "}
              <em>
                connect with the divine, experience inner peace, and participate
                in rituals that align life with spiritual values
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
              Explore Temple Traditions
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
              src="../templeTraditions.png"
              alt="Temple Traditions"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How Temple Traditions Are Structured
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Temple Life</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From sacred purpose to living culture — each pillar reveals the
            profound depth of Hindu temple tradition.
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
            <span className={styles.maroon}>Temple Tradition</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any section to expand its full guide, practices, and
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
                    Pillar {idx + 1}
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
                        <p className={styles.phaseDetailLabel}>
                          Key Practices
                        </p>
                        <ul className={styles.phaseDetailUl}>
                          {phase.focusAreas.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>
                          Mantras & Devotional Practices
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
            The Living{" "}
            <span className={styles.maroon}>Gifts of Temple Tradition</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Temple traditions continue to guide spiritual seekers toward
            harmony, wisdom, and divine connection.
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
              Experience the Living Tradition
            </h2>
            <p className={styles.ctaSubtext}>
              Visiting a temple is more than a ritual — it is an experience
              that engages the senses, the mind, and the spirit.
              <br />
              By learning these traditions, you participate in them with
              greater awareness and reverence.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>
                Explore Temple Wisdom
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

export default TempleTraditions;