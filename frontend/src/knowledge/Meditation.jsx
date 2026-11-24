import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Meditation.module.css";

function Meditation() {
  const navigate = useNavigate();
  const [expandedStep, setExpandedStep] = useState(null);
  const [expandedType, setExpandedType] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);

  const meditationSteps = [
    {
      step: 1,
      title: "Find a Quiet Place",
      duration: "1 Minute",
      phase: "Preparation",
      instructions: [
        "Choose a calm environment where you will not be disturbed.",
        "Switch off notifications on your phone.",
        "You may light a diya or incense to create a sacred atmosphere.",
        "This sacred space signals your mind that it is time for inner work.",
      ],
      note: "Consistency in place deepens practice over time.",
    },
    {
      step: 2,
      title: "Correct Posture",
      duration: "1 Minute",
      phase: "Preparation",
      instructions: [
        "Sit with your spine straight — this allows energy to flow freely.",
        "Sit cross-legged on the floor (Sukhasana) or comfortably on a chair.",
        "Rest your hands gently on your knees, palms facing upward.",
        "Keep your chin slightly tucked — this aligns the cervical spine.",
      ],
      note: "Correct posture keeps the mind alert without causing tension.",
    },
    {
      step: 3,
      title: "Relax the Body",
      duration: "2 Minutes",
      phase: "Settling",
      instructions: [
        "Close your eyes gently.",
        "Relax your shoulders — let them drop naturally.",
        "Soften the muscles of your face and jaw.",
        "Take 3 slow, deep breaths to signal the body to release tension.",
        "Feel the weight of your body settle into stillness.",
      ],
      note: "Body relaxation is the gateway to mental stillness.",
    },
    {
      step: 4,
      title: "Focus on Breath",
      duration: "5 Minutes",
      phase: "Focus",
      instructions: [
        "Observe your natural breathing without trying to control it.",
        "Notice the cool air entering your nostrils.",
        "Notice the warm air leaving your body.",
        "Feel the gentle rise and fall of your chest or abdomen.",
        "Simply be a witness to your breath — do not alter it.",
      ],
      note: "The breath is the bridge between the body and the mind.",
    },
    {
      step: 5,
      title: "Maintain Awareness",
      duration: "10 Minutes",
      phase: "Meditation",
      instructions: [
        "Whenever thoughts arise, gently return attention to your breath.",
        "Do not fight thoughts — simply observe them and let them pass.",
        "Silently repeat the sacred sound: Om with each exhale.",
        "Allow each repetition to bring deeper calmness.",
        "Remain a witness — calm, present, and undisturbed.",
      ],
      sanskrit: "ॐ",
      meaning: "Om — the primordial sound of creation, representing universal consciousness.",
      note: "Thoughts are natural. The practice is the gentle return to awareness.",
    },
    {
      step: 6,
      title: "Closing the Meditation",
      duration: "2 Minutes",
      phase: "Closing",
      instructions: [
        "Slowly deepen your breathing.",
        "Gently become aware of your body and surroundings.",
        "Move your fingers and toes slowly.",
        "When ready, softly open your eyes.",
        "Chant three times: Om Shanti Shanti Shanti.",
      ],
      sanskrit: "ॐ शान्तिः शान्तिः शान्तिः",
      meaning: "Om Peace Peace Peace — peace for the body, mind, and all of existence.",
      note: "Take a moment of gratitude before resuming your day.",
    },
  ];

  const meditationTypes = [
    {
      title: "Mantra Meditation",
      icon: "",
      phase: "Mantra",
      description: "Repeating sacred sounds like Om or Om Namah Shivaya to focus and elevate the mind.",
      practice: "Silently or softly repeat your chosen mantra in rhythm with your breath. Allow the vibration to fill your awareness.",
      duration: "15–20 minutes",
      bestFor: "Those whose minds are active and need a focal anchor",
    },
    {
      title: "Breath Meditation",
      icon: "",
      phase: "Breath",
      description: "Focusing undivided attention on the natural flow of breathing to cultivate presence.",
      practice: "Observe the breath entering and leaving without controlling it. Notice the pauses between breaths.",
      duration: "10–20 minutes",
      bestFor: "Beginners and those seeking immediate stress relief",
    },
    {
      title: "Visualization Meditation",
      icon: "",
      phase: "Visualization",
      description: "Visualizing divine symbols, inner light, or a chosen deity to awaken devotion and focus.",
      practice: "Close your eyes and hold a clear mental image of a flame, lotus, or divine form. Let it grow vivid and steady.",
      duration: "15–25 minutes",
      bestFor: "Devotees and those with strong visual imagination",
    },
    {
      title: "Silent Awareness Meditation",
      icon: "",
      phase: "Awareness",
      description: "Simply observing all thoughts, sensations, and feelings without judgment or reaction.",
      practice: "Sit in stillness. Observe whatever arises — thoughts, sensations, sounds — as a witness with no attachment.",
      duration: "20–30 minutes",
      bestFor: "Intermediate and advanced practitioners seeking self-inquiry",
    },
  ];

  const challengeWeeks = [
    {
      week: "Week 1",
      theme: "Mind Awareness",
      focus: "Calming the mind",
      days: [
        { range: "Day 1–3", practice: "5 minutes breathing meditation" },
        { range: "Day 4–7", practice: "7 minutes silent observation" },
      ],
      goal: "Develop basic awareness of thoughts.",
      color: "#2a1a4a",
    },
    {
      week: "Week 2",
      theme: "Breath Meditation",
      focus: "Breathing and relaxation",
      days: [
        { range: "Day 8–10", practice: "10 minutes breath awareness" },
        { range: "Day 11–14", practice: "12 minutes meditation" },
      ],
      goal: "Improve concentration and calmness.",
      color: "#1a4a3a",
    },
    {
      week: "Week 3",
      theme: "Mantra Meditation",
      focus: "Sacred sound vibration",
      days: [
        { range: "Day 15–17", practice: "Om chanting meditation" },
        { range: "Day 18–21", practice: "Om Namah Shivaya mantra meditation" },
      ],
      goal: "Deepen spiritual focus.",
      color: "#3a1a0a",
    },
    {
      week: "Week 4",
      theme: "Deep Meditation",
      focus: "Inner silence",
      days: [
        { range: "Day 22–25", practice: "15 minutes silent meditation" },
        { range: "Day 26–30", practice: "20 minutes full meditation" },
      ],
      goal: "Achieve deeper mental stillness.",
      color: "#1a3a4a",
    },
  ];

  const courseModules = [
    {
      module: 1,
      title: "Introduction to Meditation",
      points: ["Meaning of meditation", "Importance in Hindu philosophy", "Benefits for mind and body"],
    },
    {
      module: 2,
      title: "Preparing for Meditation",
      points: ["Correct posture", "Creating a peaceful environment", "Breathing preparation"],
    },
    {
      module: 3,
      title: "Basic Meditation Techniques",
      points: ["Breath meditation", "Mantra meditation", "Body awareness meditation"],
    },
    {
      module: 4,
      title: "Advanced Meditation",
      points: ["Chakra meditation", "Visualization meditation", "Silent awareness meditation"],
    },
    {
      module: 5,
      title: "Integrating Meditation into Daily Life",
      points: ["Morning meditation routine", "Evening reflection practice", "Maintaining discipline and consistency"],
    },
  ];

  const overviewCards = [
    { icon: "", title: "20 Minute Journey", description: "A complete daily dhyana session from preparation to closing peace mantra." },
    { icon: "", title: "6 Guided Steps", description: "From finding stillness to seated awareness — a structured inner journey." },
    { icon: "", title: "Meaning of Dhyana", description: "Dhyana means deep, focused awareness — the 7th limb of Patanjali's Ashtanga Yoga." },
    { icon: "", title: "Best Time", description: "Early morning or evening when the mind is naturally still and receptive." },
  ];

  const benefits = [
    { icon: "", title: "Reduces Stress", description: "Regular meditation lowers cortisol levels and brings lasting calmness to the nervous system." },
    { icon: "", title: "Improves Concentration", description: "Trains the mind to maintain focus, sharpening clarity and decision-making." },
    { icon: "", title: "Emotional Balance", description: "Cultivates equanimity — you respond to life rather than react to it." },
    { icon: "", title: "Self-Awareness", description: "You become the witness of your thoughts, understanding yourself at a deeper level." },
    { icon: "", title: "Spiritual Connection", description: "Over time, meditation opens the door to higher consciousness and inner peace." },
  ];

  const phaseColor = {
    Preparation: "#2a1a4a",
    Settling: "#1a3a4a",
    Focus: "#1a4a3a",
    Meditation: "#2B6291",
    Closing: "#C6A14A",
  };

  const typeColor = {
    Mantra: "#2a1a4a",
    Breath: "#1a4a3a",
    Visualization: "#3a1a2a",
    Awareness: "#1a2a4a",
  };

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <h1 className={styles.heroTitle}>Meditation</h1>
            <p className={styles.heroSubtitle}>
              A complete 20-minute inner journey — where the mind grows still, and
              the <em>soul becomes luminous</em>.
            </p>
            <button
              className={styles.btnJoinHero}
              onClick={() => document.getElementById("steps").scrollIntoView({ behavior: "smooth" })}
            >
              Begin the Guide
            </button>
          </div>
          <div className={styles.heroRight}>
            <div
              className={styles.heroImageOverlay}
              style={{ background: "linear-gradient(to right, #1a0a2e 0%, #1a0a2e99 18%, transparent 50%)" }}
            />
            <img loading="lazy" decoding="async" src="/Daily%20Practices/Meditation.webp" alt="Meditation" className={styles.heroImage} />
          </div>
        </div>
      </section>

      {/* ── Overview ── */}
      <section className={styles.overviewSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>At a Glance</p>
          <h2 className={styles.sectionTitle}>
            Your Daily <span className={styles.accent}>Dhyana Routine</span>
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

      {/* ── Guided Script Banner ── */}
      <section className={styles.scriptBanner}>
        <div className={styles.container}>
          <div className={styles.scriptInner}>
            <div className={styles.scriptText}>
              <p className={styles.scriptEyebrow}>Guided Inner Journey</p>
              <h3 className={styles.scriptTitle}>20-Minute Meditation Script</h3>
              <p className={styles.scriptDesc}>
                A word-for-word guided script ready for practice. Sit, close your eyes, and follow each instruction softly.
              </p>
            </div>
            <div className={styles.scriptScroll}>
              <p className={styles.scriptLine}>Welcome to this sacred meditation session.</p>
              <p className={styles.scriptLine}>Find a comfortable position. Sit with your spine straight.</p>
              <p className={styles.scriptLine}>Close your eyes slowly. Take a deep breath in — and gently release.</p>
              <p className={styles.scriptLine}>Let your body relax. Soften your face, shoulders, and chest.</p>
              <p className={styles.scriptLine}>Bring your attention to your breathing. Observe its natural flow.</p>
              <p className={styles.scriptLine}>Feel the air entering your nose. Feel the air leaving your body.</p>
              <p className={styles.scriptLine}>If the mind wanders — gently return to the breath.</p>
              <p className={styles.scriptLine + " " + styles.scriptMantra}>ॐ &nbsp;&nbsp; ॐ &nbsp;&nbsp; ॐ</p>
              <p className={styles.scriptLine}>Feel the vibration of the mantra within your body.</p>
              <p className={styles.scriptLine}>Allow your thoughts to pass like clouds in the sky.</p>
              <p className={styles.scriptLine}>Continue sitting in stillness. Feel the peace within.</p>
              <p className={styles.scriptLine}>Slowly deepen your breathing. Return to your body.</p>
              <p className={styles.scriptLine}>Gently move your fingers and toes. Open your eyes when ready.</p>
              <p className={styles.scriptLine + " " + styles.scriptMantra}>ॐ शान्तिः शान्तिः शान्तिः</p>
              <p className={styles.scriptLine + " " + styles.scriptClosing}>May peace remain within you throughout the day.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className={styles.stepsSection} id="steps">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Guide</p>
          <h2 className={styles.sectionTitle}>
            The <span className={styles.accent}>6 Steps</span> of Daily Meditation
          </h2>
          <p className={styles.sectionSubtitle}>
            Click any step to expand its full instructions and guidance.
          </p>
          <div className={styles.stepsList}>
            {meditationSteps.map((s) => (
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
                              <p className={styles.stepBodyLabel}>Sacred Sound</p>
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

      {/* ── Types of Meditation ── */}
      <section className={styles.typesSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Hindu Tradition</p>
          <h2 className={styles.sectionTitle}>
            Four <span className={styles.accent}>Types of Meditation</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Ancient traditions offer multiple paths to the same inner stillness.
          </p>
          <div className={styles.typesList}>
            {meditationTypes.map((t, i) => (
              <div
                key={i}
                className={`${styles.typeRow} ${expandedType === i ? styles.typeRowOpen : ""}`}
              >
                <button
                  className={styles.typeHeader}
                  onClick={() => setExpandedType(expandedType === i ? null : i)}
                >
                  <span className={styles.typeIcon}>{t.icon}</span>
                  <span className={styles.typeTitleText}>{t.title}</span>
                  <span className={styles.typeDuration}>{t.duration}</span>
                  <span className={styles.stepChevron}>{expandedType === i ? "▲" : "▼"}</span>
                </button>
                {expandedType === i && (
                  <div className={styles.typeBody}>
                    <div className={styles.typeBodyGrid}>
                      <div>
                        <p className={styles.stepBodyLabel}>Description</p>
                        <p className={styles.typeDesc}>{t.description}</p>
                        <p className={styles.stepBodyLabel} style={{ marginTop: "16px" }}>How to Practice</p>
                        <p className={styles.typeDesc}>{t.practice}</p>
                      </div>
                      <div className={styles.typeBestFor}>
                        <p className={styles.stepBodyLabel}>Best For</p>
                        <p className={styles.typeDesc}>{t.bestFor}</p>
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
            Benefits of <span className={styles.accent}>Regular Meditation</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Daily meditation transforms not just the morning — but the entire way you move through life.
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

      {/* ── 30-Day Challenge ── */}
      <section className={styles.challengeSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Sacred Commitment</p>
          <h2 className={styles.sectionTitle}>
            30-Day <span className={styles.accent}>Meditation Challenge</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            A structured four-week journey from beginner awareness to deep inner stillness.
          </p>
          <div className={styles.challengeGrid}>
            {challengeWeeks.map((w, i) => (
              <div key={i} className={styles.challengeCard} style={{ "--week-color": w.color }}>
                <div className={styles.challengeCardTop} style={{ background: w.color }}>
                  <span className={styles.challengeWeekLabel}>{w.week}</span>
                  <h3 className={styles.challengeTheme}>{w.theme}</h3>
                  <p className={styles.challengeFocus}>{w.focus}</p>
                </div>
                <div className={styles.challengeCardBody}>
                  {w.days.map((d, j) => (
                    <div key={j} className={styles.challengeDay}>
                      <span className={styles.challengeRange}>{d.range}</span>
                      <span className={styles.challengePractice}>{d.practice}</span>
                    </div>
                  ))}
                  <p className={styles.challengeGoal}> {w.goal}</p>
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
            Meditation <span className={styles.accent}>Course Structure</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Five structured modules from introduction to daily integration.
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
            <h2 className={styles.ctaTitle}>Begin Your Meditation Practice Today</h2>
            <p className={styles.ctaSubtext}>
              20 minutes each day. One breath. One moment. One awakening.
              <br />
              The stillness within is waiting.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start Meditating</button>
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

export default Meditation;
