import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #2a0a3a 0%, #2a0a3acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "Introduction to Advaita Vedanta",
    tagline: "The philosophy of not-two — one reality, one consciousness",
    color: "#4A1A6A",
    purpose:
      "Advaita Vedanta — from 'a' (not) and 'dvaita' (two) — is the philosophical teaching that reality is fundamentally non-dual. There is only one consciousness, one existence. The appearance of multiplicity — of separate selves, separate objects, separate experiences — is a superimposition upon this single reality. The great sage Adi Shankaracharya systematised this teaching in the 8th century, and it remains one of the most rigorous and liberating philosophical traditions ever formulated.",
    keyTeachings: [
      "Advaita — 'not two': the teaching that only one ultimate reality exists",
      "Brahman — the infinite, undivided, self-luminous consciousness that is the ground of all existence",
      "Atman — the individual self, which Advaita declares is identical to Brahman",
      "Brahman is described as Sat-Chit-Ananda: Being-Consciousness-Bliss",
      "Adi Shankaracharya (788–820 CE) — the master systematiser of Advaita Vedanta",
      "The world of apparent multiplicity arises due to Maya — the power of cosmic illusion",
      "Liberation (Moksha) is not an event — it is the recognition of what was always already true",
    ],
    practices: [
      "Sit quietly and ask: 'Is there awareness present right now?' — note that awareness does not need to be created",
      "Read a passage from Shankara's Vivekachudamani — contemplate one teaching",
      "Observe: does the awareness that perceives your thoughts itself ever change, come, or go?",
      "Memorise the core Advaita formula: 'Brahman alone is real. The world is appearance. The self is Brahman alone.'",
    ],
    innerExperience: [
      "A first intellectual recognition that something in you is always already present — before thought",
      "The surprising discovery that awareness cannot be observed, because it is the observer itself",
      "A subtle shift in the sense of identity — from 'I am this person' toward 'I am that which is aware'",
      "The teachings feeling simultaneously radical and somehow already familiar",
    ],
    goal: ["Understand the core philosophical position of Advaita Vedanta", "Grasp the meaning of Brahman, Atman, and their identity", "Appreciate the historical and philosophical context of Shankara's teaching", "Begin orienting inquiry toward awareness itself rather than its contents"],
    goalNote: "Advaita is not a belief system — it is a direct investigation into the nature of the self and the nature of reality. The investigation itself is the path.",
  },
  {
    days: "Module 2",
    name: "The Mahavakyas — Great Sayings",
    tagline: "Four sentences that contain the entire teaching",
    color: "#6A1B4A",
    purpose:
      "The Mahavakyas are four great statements drawn from the four Vedas, each expressing the non-dual truth in a different way. These are not merely philosophical propositions — they are contemplative tools. When held with sustained attention and meditated upon deeply, each Mahavakya has the power to dissolve the sense of separation and reveal the non-dual awareness that is one's own nature.",
    keyTeachings: [
      "Tat Tvam Asi — 'That Thou Art' (Chandogya Upanishad, Sama Veda)",
      "That = Brahman, the infinite consciousness. Thou = you, the apparent individual. They are one.",
      "Aham Brahmasmi — 'I am Brahman' (Brihadaranyaka Upanishad, Yajur Veda)",
      "The individual declares its identity with the infinite — not as arrogance but as recognition",
      "Prajnanam Brahma — 'Consciousness is Brahman' (Aitareya Upanishad, Rig Veda)",
      "Consciousness is not produced by the brain — consciousness is the very ground of all existence",
      "Ayam Atma Brahma — 'This Self is Brahman' (Mandukya Upanishad, Atharva Veda)",
      "The self of this very moment of experience — not a distant or future self — is Brahman",
    ],
    practices: [
      "Contemplate 'Tat Tvam Asi' for 10 minutes: who is the 'That'? Who is the 'Thou'? Where is the boundary?",
      "Sit with 'Aham Brahmasmi': not as an affirmation but as a question — 'What am I, truly?'",
      "After meditation, rest in 'Prajnanam Brahma': awareness is not in the head — it is everywhere equally",
      "Before sleep, hold 'Ayam Atma Brahma': this awareness that is present now is the eternal reality",
    ],
    innerExperience: [
      "Each Mahavakya creating a unique quality of contemplative opening when held with genuine attention",
      "Tat Tvam Asi producing a sense of the distance between 'me' and 'reality' beginning to close",
      "Aham Brahmasmi revealing that the boundary of 'self' is far less fixed than habitually assumed",
      "Prajnanam Brahma suggesting that consciousness is not localised — it is the space in which everything appears",
    ],
    goal: ["Memorise all four Mahavakyas and their source Upanishads", "Contemplate each Mahavakya as a meditative tool, not a philosophical proposition", "Experience how sustained contemplation of non-dual statements shifts the quality of awareness", "Begin to see the Mahavakyas as mirrors pointing back to the nature of the one who reads them"],
    goalNote: "The Mahavakyas are not teachings to be understood with the mind — they are pointers designed to dissolve the mind's grip on the separate self.",
  },
  {
    days: "Module 3",
    name: "Maya — The Veil of Illusion",
    tagline: "Understanding what conceals the non-dual truth",
    color: "#1B4430",
    purpose:
      "If reality is one, why does the world appear as multiplicity? Advaita Vedanta answers with the concept of Maya — the power by which Brahman appears as the world of names and forms. Maya has two functions: Avarana Shakti (the power to conceal truth) and Vikshepa Shakti (the power to project the appearance of multiplicity). Understanding Maya does not make it disappear — but it removes the belief that the appearance is the ultimate truth.",
    keyTeachings: [
      "Maya — the cosmic power by which one undivided reality appears as a world of many",
      "Maya is neither real (because it depends on Brahman) nor unreal (because it is experienced)",
      "Avarana Shakti — the concealing power: hides the non-dual truth behind the veil of individuality",
      "Vikshepa Shakti — the projecting power: projects the appearance of separate objects and selves",
      "Classic example: rope mistaken for a snake in dim light — the snake never existed, only the rope",
      "Superimposition (Adhyasa): mistaking Atman for the limited ego-body-mind complex",
      "Viveka (discrimination) and Vairagya (dispassion) weaken Maya's hold on the mind",
    ],
    practices: [
      "Notice today where you assumed an appearance to be the full reality — and were later corrected",
      "Contemplate the rope-snake example: what in your life have you mistaken for something it is not?",
      "Practice Viveka: at least once today, pause before reacting and ask 'Is this appearance the truth?'",
      "Journal: what do you most habitually identify as 'yourself'? Body? Thoughts? Roles? Are any of these permanent?",
    ],
    innerExperience: [
      "Growing recognition of how much is assumed rather than actually seen",
      "The surprising lightness that comes from questioning habitual identifications",
      "Moments of noticing the projection before believing it — a new quality of discernment",
      "A deepening dispassion toward appearances — not indifference, but freedom from compulsive belief in them",
    ],
    goal: ["Understand Maya and its two functions: concealment and projection", "Recognise superimposition in personal experience through self-observation", "Develop Viveka — the discriminative wisdom that sees through appearance to reality", "Cultivate Vairagya — dispassion toward appearances — as a natural consequence of clear seeing"],
    goalNote: "Maya is not destroyed — it is seen through. When the light is turned on, the snake resolves into rope. Nothing is destroyed; only the misperception ends.",
  },
  {
    days: "Module 4",
    name: "Neti Neti & Self-Inquiry",
    tagline: "The method of negation and the direct path to the self",
    color: "#422868",
    purpose:
      "Neti Neti — 'not this, not this' — is the classical Advaita method of self-inquiry, systematically negating everything that the self is not until only the pure witness remains. This approach was radically refined by the sage Ramana Maharshi as 'Atma Vichara' — the direct inquiry 'Who am I?' By tracing every thought, sensation, and experience back to its source, the practitioner discovers that what remains when all content is removed is not absence but pure, unqualified awareness.",
    keyTeachings: [
      "Neti Neti — 'not this, not this': the method of systematic negation from the Brihadaranyaka Upanishad",
      "'I am not the body' — the body changes; the witness of change does not",
      "'I am not the mind' — thoughts come and go; the awareness that sees them remains unchanged",
      "'I am not emotions' — feelings arise and pass; what observes them is always present",
      "Ramana Maharshi's Atma Vichara: 'Who am I?' — tracing every thought back to its source",
      "The source of all thoughts is the 'I'-thought — the primary sense of personal existence",
      "When the 'I'-thought is traced to its source, it dissolves — and what remains is pure awareness",
    ],
    practices: [
      "Practice Neti Neti for 10 minutes: systematically negate body, breath, sensations, emotions, thoughts",
      "After each negation, rest in what remains — 'I am not this. What am I?'",
      "Practice 'Who am I?' inquiry: when a thought arises, ask 'To whom does this thought arise?' — trace it back",
      "In moments of strong emotion, pause: 'Who is aware of this feeling?' — find the one who is watching",
    ],
    innerExperience: [
      "Neti Neti practice creating a progressive disidentification from content — increasingly spacious",
      "The 'Who am I?' question not producing an answer but producing a quality of open, alert stillness",
      "A first genuine experience of awareness as background rather than foreground — the witness, not the witnessed",
      "Moments of recognising that what you truly are has never been troubled by any of the thoughts or events passing through it",
    ],
    goal: ["Master the practice of Neti Neti as a systematic inquiry", "Practice Ramana Maharshi's 'Who am I?' method consistently", "Experience the distinction between awareness and its contents directly", "Arrive at a living recognition — however brief — of pure awareness as your true nature"],
    goalNote: "The end of self-inquiry is not a new experience — it is the recognition that you are the awareness in which all experience has always appeared. This has never not been true.",
  },
];

const benefits = [
  { icon: "", title: "Freedom from Fear", description: "When you know yourself as awareness rather than the limited ego, the fear of loss and death loses its grip." },
  { icon: "", title: "Inner Clarity", description: "Non-dual understanding brings profound mental clarity as the noise of self-seeking progressively quiets." },
  { icon: "", title: "Self-Knowledge", description: "Arrive at the deepest possible self-knowledge — not information about yourself, but recognition of what you are." },
  { icon: "", title: "Equanimity", description: "Rest in unchanging awareness beneath the fluctuations of experience — stable, clear, and undisturbed." },
  { icon: "", title: "Liberation", description: "Moksha — not a future attainment but the recognition of what is already present as your own natural condition." },
];

function NonDualWisdom() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Latest Teaching · Advaita</p>
            <h1 className={styles.heroTitle}>Non-Dual Wisdom</h1>
            <p className={styles.heroSubtitle}>
              The philosophy of Advaita Vedanta —{" "}
              <em>from the Mahavakyas and the teaching of Maya, through Neti Neti and self-inquiry, to the direct recognition of your own nature as pure, undivided awareness</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>4</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>4</strong> Mahavakyas</span>
              <span className={styles.heroMetaItem}><strong>Self-Inquiry</strong></span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Latest%20Teachings/Non%20Dual%20Wisdom.webp" alt="Non-Dual Wisdom" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Advaita Vedanta Course</p>
          <h2 className={styles.sectionTitle}>Four Modules of <span className={styles.accent}>Non-Dual Understanding</span></h2>
          <p className={styles.sectionSubtitle}>From the foundational philosophy of Advaita to the direct practice of self-inquiry — each module dissolves another layer of the illusion of separation.</p>
          <div className={styles.phasesGrid}>
            {phases.map((p) => (
              <div key={p.name} className={styles.phaseCard} style={{ borderTop: `3px solid ${p.color}` }}>
                <span className={styles.phaseDays} style={{ color: p.color }}>{p.days}</span>
                <h3 className={styles.phaseTitle}>{p.name}</h3>
                <p className={styles.phaseTagline}>"{p.tagline}"</p>
                <p className={styles.phaseDesc}>{p.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.detailSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Inquiry Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Non-Dual Wisdom</span> Course in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore its key teachings, inquiry practices, inner experiences, and the understanding they point toward.</p>
          <div className={styles.phaseDetailList}>
            {phases.map((p, idx) => (
              <div key={p.name} className={`${styles.phaseDetailRow} ${expanded === idx ? styles.phaseDetailRowOpen : ""}`}>
                <button className={styles.phaseDetailHeader} onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <span className={styles.phaseNumber} style={{ background: p.color }}>Mod {idx + 1}</span>
                  <span className={styles.phaseDetailName}>{p.name} <span className={styles.phaseDetailDays}>({p.days})</span></span>
                  <span className={styles.phaseDetailTagline}>"{p.tagline}"</span>
                  <span className={styles.phaseChevron}>{expanded === idx ? "▲" : "▼"}</span>
                </button>
                {expanded === idx && (
                  <div className={styles.phaseDetailBody}>
                    <div className={styles.phaseDetailGrid}>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Key Teachings</p>
                        <ul className={styles.phaseDetailUl}>{p.keyTeachings.map((t, i) => <li key={i}>{t}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Inquiry Practices</p>
                        <ul className={styles.phaseDetailUl}>{p.practices.map((pr, i) => <li key={i}>{pr}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Inner Experience</p>
                        <ul className={styles.phaseDetailUl}>{p.innerExperience.map((e, i) => <li key={i}>{e}</li>)}</ul>
                      </div>
                      <div className={styles.phaseDetailBlock}>
                        <p className={styles.phaseDetailLabel}>Spiritual Goal</p>
                        <ul className={styles.phaseDetailUl}>{p.goal.map((g, i) => <li key={i}>{g}</li>)}</ul>
                        <p className={styles.phaseDetailNote}>{p.goalNote}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.completionSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>What You Gain</p>
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Non-Dual Wisdom</span></h2>
          <p className={styles.sectionSubtitle}>Advaita Vedanta offers the most radical understanding available to the human mind: that what you are is already free, already whole, already the very ground of existence itself.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #2a0a3a 0%, #4a1a6a 60%, #150520 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Recognise What You Already Are</h2>
            <p className={styles.ctaSubtext}>
              Tat Tvam Asi. That Thou Art.<br />
              The separation you feel is the only thing that has ever needed to end. And it was never ultimately real.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Begin Module 1 Today</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NonDualWisdom;
