import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./DailyPuja.module.css";

function DailyPuja() {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(null);


  const pujaSteps = [
    {
      step: 1,
      title: "Opening Centering – Om Chant",
      duration: "1 Minute",
      phase: "Opening",
      instructions: [
        "Sit comfortably. Close your eyes.",
        "Take 3 deep breaths.",
        "Chant Om (ॐ) slowly — 3 to 9 times.",
        "Let the sound vibrate from the navel to the head.",
        "Feel calmness spreading inside.",
      ],
      sanskrit: "ॐ",
      meaning: "",
      chantTimes: "3 to 9 times",
    },
    {
      step: 2,
      title: "Ganesh Invocation (Obstacle Removal)",
      duration: "2 Minutes",
      phase: "Invocation",
      instructions: [
        "Begin by invoking Lord Ganesha.",
        "Chant the shloka with devotion.",
        "Feel obstacles dissolving with each repetition.",
      ],
      sanskrit:
        "वक्रतुंड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥",
      meaning:
        "O Lord Ganesha, with curved trunk and radiant like millions of suns, remove all obstacles from my life and work.",
      chantTimes: "3 times",
    },
    {
      step: 3,
      title: "Gayatri Mantra",
      duration: "2 Minutes – 11 or 21 Times",
      phase: "Mantras",
      instructions: [
        "Chant slowly with focus on the forehead area.",
        "Feel divine light illuminating your mind.",
        "Synchronize each repetition with your breath.",
      ],
      sanskrit:
        "ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्॥",
      meaning:
        "We meditate on the divine light of the Supreme. May that divine intelligence guide our minds.",
      chantTimes: "11 or 21 times",
    },
    {
      step: 4,
      title: "Mahamrityunjaya Mantra (Healing & Protection)",
      duration: "3 Minutes",
      phase: "Mantras",
      instructions: [
        "Chant slowly with deep reverence.",
        "Feel healing energy flowing through your body.",
        "Visualize Lord Shiva's protective presence.",
      ],
      sanskrit:
        "ॐ त्र्यम्बकं यजामहे\nसुगन्धिं पुष्टिवर्धनम्।\nउर्वारुकमिव बन्धनान्\nमृत्योर्मुक्षीय मामृतात्॥",
      meaning:
        "We worship the three-eyed Lord Shiva. May He free us from fear and suffering, and bless us with immortality of the soul.",
      chantTimes: "5 or 11 times",
    },
    {
      step: 5,
      title: "Universal Peace Prayer",
      duration: "2 Minutes",
      phase: "Prayers",
      instructions: [
        "Chant with an open heart for all beings.",
        "Feel compassion expanding outward.",
        "End with Loka Samasta Sukhino Bhava:ntu.",
      ],
      sanskrit:
        "सर्वे भवन्तु सुखिनः\nसर्वे सन्तु निरामयाः।\nसर्वे भद्राणि पश्यन्तु\nमा कश्चिद् दुःखभाग्भवेत्॥\n\nलोकाः समस्ताः सुखिनो भवन्तु।",
      meaning:
        "May all beings be happy. May all beings be healthy. May all beings see goodness. May no one suffer. May all worlds be happy.",
      chantTimes: "3 times",
    },
    {
      step: 6,
      title: "Hanuman Chalisa",
      duration: "5–7 Minutes",
      phase: "Devotion",
      instructions: [
        "Chant the complete Hanuman Chalisa with devotion.",
        "Feel the strength and courage of Hanuman Ji.",
        "This is the longest segment — stay focused and present.",
        "If reciting from memory, maintain steady rhythm.",
      ],
      sanskrit: "",
      meaning:
        "The Hanuman Chalisa is a 40-verse hymn by Tulsidas praising Lord Hanuman's glory, strength, and devotion to Lord Rama.",
      chantTimes: "1 full recitation",
    },
    {
      step: 7,
      title: "Personal Sankalp (Silent Prayer)",
      duration: "2 Minutes",
      phase: "Personal",
      instructions: [
        "Close your eyes.",
        "Speak in your heart:",
        '"हे भगवान, मुझे सही मार्ग दिखाएँ। मेरे मन को शुद्ध रखें। मेरे कर्म धर्म के अनुसार हों।"',
        "Offer gratitude for: Life, Family, Health, Opportunities.",
        "Take one deep breath.",
      ],
      sanskrit:
        "हे भगवान, मुझे सही मार्ग दिखाएँ।\nमेरे मन को शुद्ध रखें।\nमेरे कर्म धर्म के अनुसार हों।",
      meaning:
        "O God, show me the right path. Keep my mind pure. May my actions be in accordance with dharma.",
      chantTimes: "Silent prayer",
    },
    {
      step: 8,
      title: "Closing Shanti Mantra",
      duration: "1 Minute",
      phase: "Closing",
      instructions: [
        "Chant slowly: ॐ शान्तिः शान्तिः शान्तिः॥",
        "Feel peace in your body.",
        "Feel peace in your mind.",
        "Feel peace in your surroundings.",
      ],
      sanskrit: "ॐ शान्तिः शान्तिः शान्तिः॥",
      meaning:
        "Om Peace Peace Peace — peace for the body, mind, and surroundings.",
      chantTimes: "3 times",
    },
  ];

  const phaseColor = {
    Opening: "#C6A14A",
    Invocation: "#6E1B21",
    Mantras: "#1B4430",
    Prayers: "#422868",
    Devotion: "#8B4513",
    Personal: "#2B6291",
    Closing: "#C6A14A",
  };

  const overviewCards = [
    {
      icon: "",
      title: "Total Duration",
      description: "15–20 minutes of focused spiritual practice each morning.",
    },
    {
      icon: "",
      title: "8 Sacred Steps",
      description:
        "From opening Om chant to closing Shanti Mantra — a complete worship sequence.",
    },
    {
      icon: "",
      title: "For Everyone",
      description:
        "Suitable for all devotees — beginners and advanced practitioners alike.",
    },
    {
      icon: "",
      title: "Best Time",
      description:
        "Brahma Muhurta (4–6 AM) or any fixed morning time before starting your day.",
    },
  ];

  const benefits = [
    {
      icon: "",
      title: "Inner Peace",
      description:
        "Begin each day rooted in calmness and divine connection.",
    },
    {
      icon: "",
      title: "Spiritual Protection",
      description:
        "Mahamrityunjaya and Hanuman Chalisa create a protective shield.",
    },
    {
      icon: "",
      title: "Mental Clarity",
      description:
        "Gayatri Mantra sharpens intellect and guides decision-making.",
    },
    {
      icon: "",
      title: "Emotional Balance",
      description:
        "Gratitude prayer and sankalp cultivate emotional stability.",
    },
    {
      icon: "",
      title: "Spiritual Growth",
      description:
        "Consistent daily practice deepens your connection with the divine.",
    },
  ];

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Daily Puja Vidhi</h1>
            <p className={styles.heroSubtitle}>
              A complete morning worship sequence with sacred mantras, prayers,
              and <em>divine invocations</em> — from Om chant to Shanti Mantra.
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() =>
                document
                  .getElementById("steps")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              View Complete Puja Guide
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{
                background:
                  "linear-gradient(to right, #5a2a1a 0%, #5a2a1a99 18%, transparent 50%)",
              }}
            />
            <img
              src="/Daily%20Practices/Daily%20Puja.png"
              alt="Daily Puja"
              className={styles.heroImage}
            />
          </div>
        </div>
      </section>

      {/* ── Overview Cards ── */}
      <section className={styles.overviewSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>At a Glance</p>
          <h2 className={styles.sectionTitle}>
            Your Daily <span className={styles.accent}>Puja Routine</span>
          </h2>
          <div className={styles.overviewGrid}>
            {overviewCards.map((card, i) => (
              <div key={i} className={styles.overviewCard}>
                <span className={styles.overviewIcon}>{card.icon}</span>
                <h3 className={styles.overviewCardTitle}>{card.title}</h3>
                <p className={styles.overviewCardDesc}>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Step-by-Step Puja Guide ── */}
      <section className={styles.stepsSection} id="steps">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Guide</p>
          <h2 className={styles.sectionTitle}>
            The <span className={styles.accent}>8 Steps</span> of Daily Puja
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any step to expand its full instructions, mantras in Sanskrit,
            and meaning.
          </p>

          <div className={styles.stepsList}>
            {pujaSteps.map((s) => (
              <div
                key={s.step}
                className={`${styles.stepRow} ${
                  expandedStep === s.step ? styles.stepRowOpen : ""
                }`}
                style={{ "--step-color": phaseColor[s.phase] }}
              >
                <button
                  className={styles.stepHeader}
                  onClick={() =>
                    setExpandedStep(expandedStep === s.step ? null : s.step)
                  }
                >
                  <span
                    className={styles.stepNumber}
                    style={{ background: phaseColor[s.phase] }}
                  >
                    Step {s.step}
                  </span>
                  <span className={styles.stepTitleText}>{s.title}</span>
                  <span className={styles.stepDuration}>{s.duration}</span>
                  <span className={styles.stepChevron}>
                    {expandedStep === s.step ? "▲" : "▼"}
                  </span>
                </button>

                {expandedStep === s.step && (
                  <div className={styles.stepBody}>
                    <div className={styles.stepBodyGrid}>
                      {/* Instructions */}
                      <div className={styles.stepBlock}>
                        <p className={styles.stepBodyLabel}>Instructions</p>
                        <ul className={styles.stepUl}>
                          {s.instructions.map((inst, i) => (
                            <li key={i}>{inst}</li>
                          ))}
                        </ul>
                        <p className={styles.chantTimes}>
                           {s.chantTimes}
                        </p>
                      </div>

                      {/* Sanskrit & Meaning */}
                      <div className={styles.stepBlock}>
                        {s.sanskrit && (
                          <>
                            <p className={styles.stepBodyLabel}>
                              Sanskrit Mantra
                            </p>
                            <p className={styles.sanskritText}>{s.sanskrit}</p>
                          </>
                        )}
                        {s.meaning && (
                          <>
                            <p className={styles.stepBodyLabel}>Meaning</p>
                            <p className={styles.meaningText}>{s.meaning}</p>
                          </>
                        )}
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
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>What You Gain</p>
          <h2 className={styles.sectionTitle}>
            Benefits of <span className={styles.accent}>Daily Puja</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A consistent daily puja practice transforms not just your mornings
            but your entire life.
          </p>
          <div className={styles.benefitsGrid}>
            {benefits.map((b, i) => (
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
              Begin Your Daily Puja Practice Today
            </h2>
            <p className={styles.ctaSubtext}>
              15 minutes every morning. One seat. One breath. One prayer.
              <br />
              The divine awaits your devotion.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start Daily Puja</button>
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

export default DailyPuja;
