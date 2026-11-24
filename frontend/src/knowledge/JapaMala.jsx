import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./JapaMala.module.css";

function JapaMala() {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(null);
  const [expandedMantra, setExpandedMantra] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [expandedPhase, setExpandedPhase] = useState(null);

  const japaSteps = [
    {
      step: 1,
      title: "Choose a Mantra",
      duration: "1 Minute",
      phase: "Preparation",
      instructions: [
        "Select a sacred mantra that resonates with your spiritual intention.",
        "Common choices: Om, Om Namah Shivaya, Om Namo Bhagavate Vasudevaya.",
        "For healing: Maha Mrityunjaya Mantra.",
        "For devotion: Hare Krishna or Gayatri Mantra.",
        "Keep the same mantra for the full 108 repetitions.",
      ],
      note: "Consistency with one mantra deepens its vibrational impact over time.",
    },
    {
      step: 2,
      title: "Hold the Mala",
      duration: "1 Minute",
      phase: "Preparation",
      instructions: [
        "Hold the mala in your right hand.",
        "Drape it over your middle finger.",
        "Use your thumb to move from one bead to the next.",
        "Begin with the bead immediately next to the guru bead (the large central bead).",
        "The index finger is traditionally not used to touch the mala.",
      ],
      note: "The right hand is used as it is considered the hand of giving and spiritual action.",
    },
    {
      step: 3,
      title: "Chant the Mantra",
      duration: "Ongoing",
      phase: "Practice",
      instructions: [
        "Sit comfortably with your spine straight.",
        "Close your eyes or keep a soft downward gaze.",
        "Repeat the chosen mantra once, fully and with devotion.",
        "You may chant aloud (Vaikhari), in a whisper (Upamshu), or silently (Manasika).",
        "Feel the meaning and vibration of each repetition.",
      ],
      note: "Silent mental repetition (Manasika Japa) is considered the most powerful form.",
    },
    {
      step: 4,
      title: "Move to the Next Bead",
      duration: "Ongoing",
      phase: "Practice",
      instructions: [
        "After each full mantra repetition, gently move to the next bead using your thumb.",
        "Let the movement be smooth and unhurried.",
        "The rhythm of bead and mantra creates a meditative flow.",
        "If your mind wanders, return your attention to the mantra without judgment.",
      ],
      note: "The physical touch of each bead anchors the mind and prevents distraction.",
    },
    {
      step: 5,
      title: "Complete the Cycle",
      duration: "15–20 Minutes",
      phase: "Completion",
      instructions: [
        "Continue until all 108 beads have been counted — one full mala round.",
        "When you reach the guru bead, do not cross over it.",
        "If continuing for another round, reverse direction to begin again.",
        "After completing, sit quietly for 2–3 minutes in silence.",
        "Offer gratitude for the practice with: Om Shanti Shanti Shanti.",
      ],
      sanskrit: "ॐ शान्तिः शान्तिः शान्तिः",
      meaning: "Om Peace Peace Peace — peace for body, mind, and all existence.",
      note: "One full round of 108 repetitions is considered one complete Japa round.",
    },
  ];

  const mantraCategories = [
    {
      category: "Universal Mantras",
      icon: "",
      phase: "Universal",
      description: "Foundation mantras of the Hindu tradition, used across all lineages and purposes.",
      mantras: ["Om", "Om Shanti Shanti Shanti", "Soham"],
      bestFor: "All practitioners — beginners and advanced alike",
    },
    {
      category: "Shiva Mantras",
      icon: "",
      phase: "Shiva",
      description: "Dedicated to Lord Shiva — the destroyer of ignorance and bestower of liberation.",
      mantras: [
        "Om Namah Shivaya",
        "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam\nUrvaarukamiva Bandhanan Mrityormuksheeya Maamritat",
      ],
      bestFor: "Healing, protection, and liberation from suffering",
    },
    {
      category: "Vishnu / Krishna Mantras",
      icon: "",
      phase: "Vishnu",
      description: "Devoted to Lord Vishnu and Krishna — the preserver and divine love incarnate.",
      mantras: [
        "Om Namo Bhagavate Vasudevaya",
        "Hare Krishna Hare Krishna Krishna Krishna Hare Hare",
        "Hare Rama Hare Rama Rama Rama Hare Hare",
      ],
      bestFor: "Devotion, peace, and connection with divine love",
    },
    {
      category: "Ganesha Mantras",
      icon: "",
      phase: "Ganesha",
      description: "Honouring Lord Ganesha — the remover of obstacles and lord of new beginnings.",
      mantras: [
        "Om Gam Ganapataye Namah",
        "Vakratunda Mahakaya Surya Koti Samaprabha\nNirvighnam Kuru Me Deva Sarva Kaaryeshu Sarvada",
      ],
      bestFor: "New beginnings, removing obstacles, seeking blessings",
    },
    {
      category: "Lakshmi Mantras",
      icon: "",
      phase: "Lakshmi",
      description: "Dedicated to Goddess Lakshmi — bestower of wealth, abundance, and auspiciousness.",
      mantras: [
        "Om Shreem Mahalakshmiye Namah",
        "Om Hreem Shreem Lakshmi Bhyo Namah",
      ],
      bestFor: "Prosperity, abundance, and financial stability",
    },
    {
      category: "Saraswati & Hanuman",
      icon: "",
      phase: "Other",
      description: "Saraswati for wisdom and learning. Hanuman for courage and protection.",
      mantras: [
        "Om Aim Saraswatyai Namah",
        "Om Hanumate Namah",
        "Om Shri Hanumate Namah",
      ],
      bestFor: "Students, seekers, those facing fear or adversity",
    },
  ];

  const sadhanаPhases = [
    {
      phase: "Phase 1",
      days: "Day 1–27",
      title: "Preparation",
      focus: "Discipline and learning",
      practices: ["108 Om chanting daily", "5 minutes silent meditation"],
      goal: "Calm the mind and develop consistency.",
      color: "#0a3a3a",
    },
    {
      phase: "Phase 2",
      days: "Day 28–54",
      title: "Devotional Practice",
      focus: "Increasing spiritual awareness",
      practices: ["Om Namah Shivaya chanting", "Gayatri mantra daily"],
      goal: "Increase spiritual awareness and devotion.",
      color: "#2B6291",
    },
    {
      phase: "Phase 3",
      days: "Day 55–81",
      title: "Deep Mantra Meditation",
      focus: "Concentration and inner peace",
      practices: ["3 mala rounds daily", "Silent mantra meditation"],
      goal: "Deep concentration and lasting inner peace.",
      color: "#1a4a3a",
    },
    {
      phase: "Phase 4",
      days: "Day 82–108",
      title: "Spiritual Integration",
      focus: "Internalising mantra energy",
      practices: ["Personal chosen mantra", "20 minutes meditation"],
      goal: "Internalize mantra energy and awaken deeper awareness.",
      color: "#3a1a0a",
    },
  ];

  const courseModules = [
    {
      module: 1,
      title: "Introduction to Mantras",
      points: ["What is a mantra", "Power of sacred sound vibration", "Importance in Hindu spirituality"],
    },
    {
      module: 2,
      title: "Correct Chanting Method",
      points: ["Pronunciation of Sanskrit mantras", "Rhythm and breathing", "Mental vs vocal chanting"],
    },
    {
      module: 3,
      title: "Japa Mala Meditation",
      points: ["Meaning of 108 beads", "How to hold a mala", "How to count mantra repetitions"],
    },
    {
      module: 4,
      title: "Types of Mantra Practices",
      points: ["Devotional chanting", "Silent mantra meditation", "Group chanting (Kirtan)"],
    },
    {
      module: 5,
      title: "Advanced Mantra Sadhana",
      points: ["Daily mantra discipline", "Chakra mantra meditation", "Long-term mantra practices"],
    },
  ];

  const overviewCards = [
    { icon: "", title: "108 Sacred Beads", description: "Each bead holds one mantra repetition — completing a full circle of devotion and inner stillness." },
    { icon: "", title: "The Power of Japa", description: "Continuous sacred sound repetition gradually moves the mind from distraction to divine focus." },
    { icon: "", title: "Best Time", description: "Early morning or evening — when the mind is naturally receptive and the environment is still." },
    { icon: "", title: "Daily Consistency", description: "Even one mala round daily builds profound spiritual discipline and mental calmness over time." },
  ];

  const benefits = [
    { icon: "", title: "Improves Concentration", description: "Trains the mind to stay anchored on a single sacred focus, building powerful attention." },
    { icon: "", title: "Calms the Mind", description: "The rhythmic repetition of mantra quiets mental chatter and brings deep stillness." },
    { icon: "", title: "Deepens Devotion", description: "Continuous devotional repetition opens the heart and strengthens the spiritual connection." },
    { icon: "", title: "Positive Energy", description: "Sacred sound vibrations create uplifting mental frequencies and spiritual clarity." },
    { icon: "", title: "Builds Discipline", description: "Daily Japa practice develops the willpower and consistency needed for all spiritual growth." },
  ];

  const phaseColor = {
    Preparation: "#2a1a4a",
    Practice: "#0a3a3a",
    Completion: "#C6A14A",
  };

  const mantraColor = {
    Universal: "#1a3a4a",
    Shiva: "#3a1a0a",
    Vishnu: "#1a4a3a",
    Ganesha: "#3a2a0a",
    Lakshmi: "#3a1a2a",
    Other: "#2a1a4a",
  };

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Japa Mala</h1>
            <p className={styles.heroSubtitle}>
              108 beads. One mantra. A sacred journey inward through the ancient
              practice of <em>continuous devotion</em>.
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() => document.getElementById("steps").scrollIntoView({ behavior: "smooth" })}
            >
              Begin the Practice
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{ background: "linear-gradient(to right, #051a1a 0%, #051a1a99 18%, transparent 50%)" }}
            />
            <img loading="lazy" decoding="async" src="/Daily%20Practices/Japa%20Mala.webp" alt="Japa Mala" className={styles.heroImage} />
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section className={styles.overviewSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>At a Glance</p>
          <h2 className={styles.sectionTitle}>
            The Sacred <span className={styles.accent}>Japa Practice</span>
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

      {/* ── 108 Banner ── */}
      <section className={styles.beadsBanner}>
        <div className={styles.container}>
          <div className={styles.beadsInner}>
            <div className={styles.beadsText}>
              <p className={styles.beadsEyebrow}>Sacred Number</p>
              <h3 className={styles.beadsTitle}>Why 108 Beads?</h3>
              <p className={styles.beadsDesc}>
                The number 108 holds deep significance in Hindu spiritual tradition.
              </p>
            </div>
            <div className={styles.beadsGrid}>
              <div className={styles.beadsCard}>
                <span className={styles.beadsCardIcon}></span>
                <h4 className={styles.beadsCardTitle}>108 Upanishads</h4>
                <p className={styles.beadsCardDesc}>Representing the complete body of Vedic spiritual wisdom.</p>
              </div>
              <div className={styles.beadsCard}>
                <span className={styles.beadsCardIcon}></span>
                <h4 className={styles.beadsCardTitle}>108 Energy Pathways</h4>
                <p className={styles.beadsCardDesc}>The number of key nadis (energy channels) in the human body.</p>
              </div>
              <div className={styles.beadsCard}>
                <span className={styles.beadsCardIcon}></span>
                <h4 className={styles.beadsCardTitle}>108 Divine Names</h4>
                <p className={styles.beadsCardDesc}>Most Hindu deities have 108 sacred names and attributes.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className={styles.stepsSection} id="steps">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Guide</p>
          <h2 className={styles.sectionTitle}>
            The <span className={styles.accent}>5 Steps</span> of Japa Mala
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any step to see full instructions for that part of the practice.
          </p>
          <div className={styles.stepsList}>
            {japaSteps.map((s) => (
              <div
                key={s.step}
                className={`${styles.stepRow} ${expandedStep === s.step ? styles.stepRowOpen : ""}`}
                style={{ "--step-color": phaseColor[s.phase] }}
              >
                <button
                  className={styles.stepHeader}
                  onClick={() => setExpandedStep(expandedStep === s.step ? null : s.step)}
                >
                  <span className={styles.stepNumber} style={{ background: phaseColor[s.phase] }}>
                    Step {s.step}
                  </span>
                  <span className={styles.stepTitleText}>{s.title}</span>
                  <span className={styles.stepDuration}>{s.duration}</span>
                  <span className={styles.stepChevron}>{expandedStep === s.step ? "▲" : "▼"}</span>
                </button>
                {expandedStep === s.step && (
                  <div className={styles.stepBody}>
                    <div className={styles.stepBodyGrid}>
                      <div className={styles.stepBlock}>
                        <p className={styles.stepBodyLabel}>Instructions</p>
                        <ul className={styles.stepUl}>
                          {s.instructions.map((inst, i) => <li key={i}>{inst}</li>)}
                        </ul>
                        {s.note && <p className={styles.noteText}> {s.note}</p>}
                      </div>
                      {(s.sanskrit || s.meaning) && (
                        <div className={styles.stepBlock}>
                          {s.sanskrit && (
                            <>
                              <p className={styles.stepBodyLabel}>Peace Mantra</p>
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
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 108 Mantras ── */}
      <section className={styles.mantrasSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Sacred Sounds</p>
          <h2 className={styles.sectionTitle}>
            Mantras for <span className={styles.accent}>Japa Chanting</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Choose from these traditional mantra categories for your daily Japa practice.
          </p>
          <div className={styles.mantrasList}>
            {mantraCategories.map((m, i) => (
              <div
                key={i}
                className={`${styles.mantraRow} ${expandedMantra === i ? styles.mantraRowOpen : ""}`}
              >
                <button
                  className={styles.mantraHeader}
                  onClick={() => setExpandedMantra(expandedMantra === i ? null : i)}
                >
                  <span className={styles.mantraIcon}>{m.icon}</span>
                  <span className={styles.mantraTitleText}>{m.category}</span>
                  <span className={styles.mantraCount}>{m.mantras.length} mantras</span>
                  <span className={styles.stepChevron}>{expandedMantra === i ? "▲" : "▼"}</span>
                </button>
                {expandedMantra === i && (
                  <div className={styles.mantraBody}>
                    <div className={styles.mantraBodyGrid}>
                      <div>
                        <p className={styles.stepBodyLabel}>About</p>
                        <p className={styles.mantraDesc}>{m.description}</p>
                        <p className={styles.stepBodyLabel} style={{ marginTop: "16px" }}>Sacred Mantras</p>
                        <div className={styles.mantraTextList}>
                          {m.mantras.map((mt, j) => (
                            <p key={j} className={styles.mantraText}>{mt}</p>
                          ))}
                        </div>
                      </div>
                      <div className={styles.mantraBestFor}>
                        <p className={styles.stepBodyLabel}>Best For</p>
                        <p className={styles.mantraDesc}>{m.bestFor}</p>
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
            Benefits of <span className={styles.accent}>Japa Meditation</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Regular Japa practice builds a foundation of inner stillness that transforms daily life.
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

      {/* ── 108-Day Sadhana ── */}
      <section className={styles.sadhanaSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Sacred Commitment</p>
          <h2 className={styles.sectionTitle}>
            108-Day Mantra <span className={styles.accent}>Sadhana Program</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A powerful four-phase spiritual program for deepening your mantra practice.
          </p>
          <div className={styles.sadhanaGrid}>
            {sadhanаPhases.map((ph, i) => (
              <div key={i} className={styles.sadhanaCard} style={{ "--phase-color": ph.color }}>
                <div className={styles.sadhanaCardTop} style={{ background: ph.color }}>
                  <span className={styles.sadhanaPhaseLabel}>{ph.phase}</span>
                  <span className={styles.sadhanaDays}>{ph.days}</span>
                  <h3 className={styles.sadhanaTitle}>{ph.title}</h3>
                  <p className={styles.sadhanaFocus}>{ph.focus}</p>
                </div>
                <div className={styles.sadhanaCardBody}>
                  {ph.practices.map((pr, j) => (
                    <div key={j} className={styles.sadhanaPractice}>
                      <span className={styles.sadhanaDot} />
                      {pr}
                    </div>
                  ))}
                  <p className={styles.sadhanaGoal}> {ph.goal}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Course Modules ── */}
      <section className={styles.modulesSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Course</p>
          <h2 className={styles.sectionTitle}>
            Mantra Chanting <span className={styles.accent}>Course Structure</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Five structured modules from beginner introduction to advanced sadhana.
          </p>
          <div className={styles.modulesList}>
            {courseModules.map((m) => (
              <div
                key={m.module}
                className={`${styles.moduleRow} ${expandedModule === m.module ? styles.moduleRowOpen : ""}`}
              >
                <button
                  className={styles.moduleHeader}
                  onClick={() => setExpandedModule(expandedModule === m.module ? null : m.module)}
                >
                  <span className={styles.moduleNumber}>Module {m.module}</span>
                  <span className={styles.moduleTitleText}>{m.title}</span>
                  <span className={styles.stepChevron}>{expandedModule === m.module ? "▲" : "▼"}</span>
                </button>
                {expandedModule === m.module && (
                  <div className={styles.moduleBody}>
                    <ul className={styles.stepUl}>
                      {m.points.map((pt, i) => <li key={i}>{pt}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin Your Japa Practice Today</h2>
            <p className={styles.ctaSubtext}>
              108 beads. One breath. One sacred sound repeated with devotion.
              <br />
              The divine listens in the rhythm of your mantra.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start Japa Meditation</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>
                ← Back to Knowledge
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default JapaMala;
