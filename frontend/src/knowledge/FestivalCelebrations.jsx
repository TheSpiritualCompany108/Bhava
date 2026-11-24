import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./FestivalCelebrations.module.css";

function FestivalCelebrations() {
  const navigate = useNavigate();
  const [expandedPhase, setExpandedPhase] = useState(null);


  const phases = [
    {
      days: "Purpose",
      name: "Spiritual Purpose of Festivals",
      tagline: "Reminders of Spiritual Values and Divine Connection",
      color: "#6E1B21",
      purpose:
        "Each festival carries a deeper spiritual message. Many Hindu festivals symbolize the victory of good over evil, light over darkness, and knowledge over ignorance. Through festivals, devotees express devotion to the divine and reflect on important moral and spiritual lessons.",
      focusAreas: [
        "Strengthening faith and devotion",
        "Remembering divine stories and teachings",
        "Expressing gratitude to the divine",
        "Promoting harmony and positive values",
        "Bringing communities together in shared celebration",
      ],
      mantras: {
        primary: [
          "Chant the deity's mantra associated with the festival",
          "Perform a simple puja on the festival day with intention",
        ],
        optional: [
          "Read the Purana story behind the festival before celebrating",
        ],
      },
      innerExperience: [
        "Renewed faith and devotion through shared celebration",
        "Inspiration from divine stories and their timeless meaning",
        "Sense of belonging to a sacred living tradition",
        "Joy arising naturally through worship and community",
      ],
      innerNote:
        "These occasions remind individuals to reconnect with spirituality and live with compassion and righteousness.",
      transformationGoal: [
        "Understand the spiritual message behind each festival",
        "Approach each celebration with devotion and awareness",
        "Use festivals as opportunities for spiritual renewal",
        "Connect with the divine wisdom that festivals preserve",
      ],
      transformationNote:
        "Hindu festivals remind people of spiritual values such as devotion, righteousness, gratitude, and harmony.",
    },
    {
      days: "Festivals",
      name: "Important Hindu Festivals",
      tagline: "Each Celebration Carries Unique Divine Significance",
      color: "#1B4430",
      purpose:
        "Hindu culture celebrates many festivals throughout the year, each with its own spiritual significance. From the Festival of Lights to the celebration of divine love, each festival invites devotees into a different dimension of the divine and a deeper experience of spiritual values.",
      focusAreas: [
        "Diwali — victory of light over darkness, welcoming prosperity and divine blessings",
        "Holi — joy, love, and triumph of devotion over negativity, the arrival of spring",
        "Navratri & Durga Puja — honoring the divine feminine power and her victory",
        "Ganesh Chaturthi — wisdom, prosperity, and new beginnings",
        "Janmashtami — birth of Lord Krishna, devotion, love, and righteousness",
      ],
      mantras: {
        primary: [
          "Diwali: Om Shreem Mahalakshmiye Namah (Lakshmi mantra)",
          "Navratri: Om Dum Durgaye Namah (Durga mantra)",
        ],
        optional: [
          "Holi: Hare Krishna Hare Krishna Krishna Krishna Hare Hare",
          "Ganesh Chaturthi: Om Gan Ganapataye Namah",
        ],
      },
      innerExperience: [
        "Inspiration through the divine stories behind each festival",
        "Deep devotion arising through communal worship",
        "Sense of the divine becoming tangibly present",
        "Renewal of faith through each sacred celebration",
      ],
      innerNote:
        "Each festival is a doorway into a different dimension of the divine.",
      transformationGoal: [
        "Learn the story and spiritual significance of at least 3 festivals",
        "Celebrate with understanding of the deeper symbolism",
        "Participate in the core ritual of each festival consciously",
        "Share the meaning with family and community",
      ],
      transformationNote:
        "Hindu festivals mark important events from mythology, seasonal changes, and moments of divine significance.",
    },
    {
      days: "Rituals",
      name: "Traditional Festival Rituals",
      tagline: "Devotional Practices That Connect Us to the Divine",
      color: "#422868",
      purpose:
        "Each festival includes rituals and customs that reflect devotion and cultural traditions. These practices help devotees express gratitude and strengthen their connection with the divine. They create an atmosphere of sacred celebration that transforms ordinary days into spiritual milestones.",
      focusAreas: [
        "Performing puja and prayers for the specific festival deity",
        "Lighting lamps and decorating homes with sacred symbols",
        "Chanting sacred mantras associated with the festival",
        "Offering sweets and prasad as symbols of divine grace",
        "Visiting temples and participating in community celebrations",
      ],
      mantras: {
        primary: [
          "Light lamps and chant the festival deity's mantra with devotion",
          "Offer flowers and prasad with gratitude and sincerity",
        ],
        optional: [
          "Fast before major festivals to purify body and mind",
          "Decorate the home with rangoli and sacred symbols",
        ],
      },
      innerExperience: [
        "Deepening sense of the sacred through ritual",
        "Gratitude and joy arising naturally through offering",
        "Feeling of divine presence in the home and heart",
        "Connection to generations who have celebrated in the same way",
      ],
      innerNote:
        "These rituals help devotees express gratitude and strengthen their connection with the divine.",
      transformationGoal: [
        "Learn the core ritual of each major festival",
        "Perform each ritual with understanding and awareness",
        "Experience the sacred atmosphere created by devotional practice",
        "Carry the spirit of the festival into daily life",
      ],
      transformationNote:
        "Rituals transform celebrations from cultural habit into genuine spiritual practice.",
    },
    {
      days: "Community",
      name: "Family, Community & Living Values",
      tagline: "Preserving Spiritual Values Across Generations",
      color: "#8B6914",
      purpose:
        "Hindu festivals are also important social occasions. Families gather to pray, share meals, and celebrate together. Communities organize cultural programs, devotional singing, and charity activities. These celebrations help preserve traditions and pass spiritual values to younger generations.",
      focusAreas: [
        "Families gathering to pray, share meals, and celebrate together",
        "Community programs of devotional singing and cultural celebration",
        "Charity activities and acts of service during festival seasons",
        "Passing spiritual values and stories to younger generations",
        "Creating moments of joy, togetherness, and spiritual reflection",
      ],
      mantras: {
        primary: [
          "Celebrate with family and share prasad with neighbors",
          "Include children in rituals and explain their meaning",
        ],
        optional: [
          "Organize community bhajans (devotional singing) during festivals",
          "Perform an act of charity or service in the spirit of the festival",
        ],
      },
      innerExperience: [
        "Sense of belonging to a living spiritual community",
        "Joy and gratitude through shared celebration",
        "Deepened connection to family, heritage, and tradition",
        "Inspiration to live the values the festivals celebrate",
      ],
      innerNote:
        "Festivals create moments of joy, togetherness, and spiritual reflection.",
      transformationGoal: [
        "Celebrate festivals consciously within your family and community",
        "Use festivals to teach spiritual values to younger generations",
        "Experience the deeper meaning behind each celebration",
        "Live the kindness, humility, and devotion that festivals encourage",
        "Experience festivals as opportunities for spiritual growth and renewal",
      ],
      transformationNote:
        "Hindu festivals continue to inspire devotion, unity, and happiness in the lives of millions of people around the world.",
    },
  ];

  const completionBenefits = [
    {
      icon: "",
      title: "Strengthened Faith",
      description:
        "Each festival renews and deepens faith through devotion, sacred stories, and the experience of divine presence in celebration.",
    },
    {
      icon: "",
      title: "Gratitude & Humility",
      description:
        "Festival practices cultivate genuine gratitude for life's blessings and humility before the divine order.",
    },
    {
      icon: "",
      title: "Community & Unity",
      description:
        "Shared celebration strengthens family bonds and community unity, creating a sense of belonging to a living spiritual tradition.",
    },
    {
      icon: "",
      title: "Spiritual Values",
      description:
        "Festivals teach righteousness, compassion, devotion, and harmony as lived values rather than abstract ideals.",
    },
    {
      icon: "",
      title: "Joy & Renewal",
      description:
        "Hindu festivals inspire joy, happiness, and spiritual renewal in the lives of millions of people around the world.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Festivals & Celebrations</h1>
            <p className={styles.heroSubtitle}>
              Understanding the Spiritual Meaning of Hindu Festivals. These
              vibrant celebrations are deeply rooted in ancient traditions and{" "}
              <em>
                remind people of spiritual values such as devotion,
                righteousness, gratitude, and harmony
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
              Explore Festivals & Celebrations
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
              src="../festivals.png"
              alt="Festivals & Celebrations"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── 4 Pillars Overview ── */}
      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>
            How Hindu Festivals Are Structured
          </p>
          <h2 className={styles.sectionTitle}>
            Four Pillars of{" "}
            <span className={styles.maroon}>Sacred Celebration</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            From spiritual purpose to living community — each pillar reveals
            the profound depth of Hindu festival tradition.
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
            <span className={styles.maroon}>Festival Journey</span> in Detail
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any section to expand its full guide, rituals, and spiritual
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
                          Mantras & Festival Practices
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
            <span className={styles.maroon}>Gifts of Hindu Festivals</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Hindu festivals continue to inspire devotion, unity, and happiness
            in the lives of millions of people around the world.
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
              Celebrate with Understanding
            </h2>
            <p className={styles.ctaSubtext}>
              Beyond rituals and decorations, the true essence of Hindu
              festivals lies in the values they teach.
              <br />
              Live with kindness, humility, and devotion while appreciating the
              blessings of life.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>
                Explore All Festivals
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

export default FestivalCelebrations;
