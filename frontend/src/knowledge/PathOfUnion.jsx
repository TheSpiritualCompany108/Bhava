import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #0a2a1a 0%, #0a2a1acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "The Philosophy of Union",
    tagline: "Yoga as the realisation of oneness",
    color: "#1A4A2A",
    purpose:
      "The word Yoga comes from the Sanskrit root 'Yuj' — meaning to yoke, to unite. Yoga in its deepest sense is not a physical exercise but a complete philosophical and spiritual system aimed at one goal: the union of the individual self (Jivatman) with the universal self (Paramatman). This module explores what union truly means, why separation is the root of suffering, and how the path of yoga leads the practitioner back to wholeness.",
    keyTeachings: [
      "Yoga — from 'Yuj': to yoke, to unite, to bring together what appears separate",
      "Jivatman — the individual self, appearing separate due to the veil of ego and conditioning",
      "Paramatman — the universal Self, the infinite consciousness in which all existence arises",
      "The root of suffering: the mistaken belief in a separate, isolated self",
      "Yoga as the path of dissolving the false sense of separation and returning to wholeness",
      "Patanjali's Yoga Sutras: 'Yogash chitta vritti nirodhah' — Yoga is the cessation of the fluctuations of the mind",
    ],
    practices: [
      "Sit quietly and ask: 'Who am I apart from my thoughts, roles, and body?' — rest in the question",
      "Observe moments throughout the day when separation feels most acute — what triggers it?",
      "Morning practice: 5 minutes of stillness with the intention of meeting life from wholeness, not lack",
      "Study Patanjali's definition of yoga — contemplate what 'cessation of mind-fluctuations' would feel like",
    ],
    innerExperience: [
      "A first intuition of something vast and still beneath the usual mental activity",
      "Moments when the sense of being separate from life briefly dissolves",
      "Recognition that most suffering involves the feeling of being cut off from something",
      "A quiet but growing orientation toward wholeness rather than accumulation",
    ],
    goal: ["Understand the philosophical meaning of yoga as union", "Recognise the distinction between Jivatman and Paramatman", "Begin orienting daily life toward the experience of connection", "Appreciate why Patanjali placed the cessation of mental fluctuation at the centre of yoga"],
    goalNote: "Yoga does not create union — it reveals the union that has always been present, hidden only by the habit of identifying with the limited self.",
  },
  {
    days: "Module 2",
    name: "The Four Paths of Yoga",
    tagline: "Four roads to the same summit of realisation",
    color: "#2A5A1A",
    purpose:
      "Hindu philosophy offers four primary paths of yoga, each suited to a different human temperament. Jnana Yoga is the path of knowledge and self-inquiry, suited to the contemplative mind. Bhakti Yoga is the path of love and devotion, suited to the emotional heart. Karma Yoga is the path of selfless action, suited to the active nature. Raja Yoga is the path of meditation and self-discipline, suited to the systematic practitioner. All four lead to the same realisation of union.",
    keyTeachings: [
      "Jnana Yoga — the path of knowledge: Who am I? What is real? Self-inquiry as the method",
      "Core practice of Jnana: Neti Neti — 'not this, not this' — eliminating what the self is not",
      "Bhakti Yoga — the path of devotion: surrendering the ego in love for the Divine",
      "In Bhakti, the self dissolves not through analysis but through the overwhelming force of love",
      "Karma Yoga — the path of action: performing duty without attachment to outcome",
      "Raja Yoga — the royal path: Patanjali's Eight Limbs leading to Samadhi",
      "The four paths are complementary — most practitioners draw from more than one",
    ],
    practices: [
      "Jnana: spend 10 minutes in self-inquiry — 'Who is the one who is aware right now?'",
      "Bhakti: chant a divine name with complete attention for 10 minutes",
      "Karma: perform one act of pure seva today — no expectation, no acknowledgement sought",
      "Raja: practice Pratyahara (withdrawal of senses) — sit with eyes closed, ears turned inward for 5 minutes",
    ],
    innerExperience: [
      "Jnana inquiry creating an unusual quality of open, questioning stillness",
      "Bhakti chanting dissolving the boundary between practitioner and the name being chanted",
      "Karma seva revealing how much ordinary action is driven by the need for recognition",
      "Raja practice showing how much energy is continually lost through the outward-flowing senses",
    ],
    goal: ["Understand all four paths of yoga and the temperaments they serve", "Practice each path at least once and observe how each affects awareness", "Identify which path or combination most naturally serves your own nature", "Recognise that all four paths lead to the same realisation through different means"],
    goalNote: "There is no superior path — only the path that is right for this person, at this time, in this life. Wisdom is knowing which road is yours.",
  },
  {
    days: "Module 3",
    name: "Samadhi — The State of Union",
    tagline: "The highest state where the meditator and the meditated become one",
    color: "#1B4430",
    purpose:
      "Samadhi is the pinnacle of the yogic path — the state in which the individual mind dissolves completely into the object of meditation and the sense of a separate meditator disappears. Patanjali describes a progression of increasingly subtle states of Samadhi, culminating in Nirbija Samadhi — the seedless absorption in which even the subtlest trace of separateness is dissolved and pure awareness alone remains.",
    keyTeachings: [
      "Dharana — concentration: holding the mind steadily on a single point",
      "Dhyana — meditation: an unbroken, continuous flow of awareness toward the object",
      "Samadhi — absorption: the merger of subject and object, meditator and meditated",
      "Savikalpa Samadhi — absorption with form: awareness still holds an object of focus",
      "Nirvikalpa Samadhi — formless absorption: pure consciousness without object, subject, or separation",
      "Nirbija Samadhi — seedless: no remaining karmic seed of ego-contraction",
      "Kaivalya — final liberation: the natural state of pure awareness, free from all conditioning",
    ],
    practices: [
      "Practice Dharana: hold attention on the flame of a candle for 5 minutes without wavering",
      "Progress to Dhyana: allow the flame to fill awareness — reduce the gap between observer and observed",
      "After mantra chanting, rest in complete silence for 5 minutes — notice what remains",
      "Contemplate: in deep dreamless sleep, who is present? This points to the witness of Samadhi",
    ],
    innerExperience: [
      "Dharana practice revealing how rarely the mind truly rests on a single point",
      "Moments in deep meditation when time and the sense of 'meditating' momentarily disappear",
      "The silence after chanting carrying a quality different from ordinary quiet — profound, alive, spacious",
      "A growing sense that awareness itself — not its contents — is what you actually are",
    ],
    goal: ["Understand the progression from Dharana through Dhyana to Samadhi", "Experience the preliminary states of Dharana and Dhyana through consistent practice", "Recognise the difference between ordinary silence and the alive stillness of deep meditation", "Understand Kaivalya — liberation — as the natural destination of the yogic path"],
    goalNote: "Samadhi is not an achievement of the ego — it is what remains when the ego's ceaseless activity finally falls quiet. It is your original nature.",
  },
  {
    days: "Module 4",
    name: "Living Union",
    tagline: "Carrying the experience of wholeness into every moment",
    color: "#422868",
    purpose:
      "The final module addresses the most subtle and most practical question: how does the experience of union transform daily life? The realisation of yoga does not withdraw a person from the world — it changes how the world is met. Actions arise without self-seeking. Relationships deepen through genuine presence. Difficulty is met without reactivity. This module provides daily practices for sustaining the quality of union beyond the meditation cushion.",
    keyTeachings: [
      "Sahaja Samadhi — natural, spontaneous absorption: union available in the midst of activity",
      "The awakened person does not withdraw from life — they engage it without the veil of separation",
      "Every relationship becomes deeper when met from presence rather than need",
      "Difficulty is transformed when the self is no longer a fragile identity that must be defended",
      "The practice: notice each moment of contraction — of holding, defending, wanting — as the veil",
      "Return repeatedly to the open, undefended awareness that was glimpsed in meditation",
    ],
    practices: [
      "Morning: 10 minutes of stillness establishing the quality of non-separation for the day",
      "Throughout the day: when tension arises, pause — breathe — ask: 'What am I defending?'",
      "Evening: review one interaction — was it met from fear of separation or from genuine presence?",
      "Once a week: a full day of mindful action — every action offered as practice, nothing excluded",
    ],
    innerExperience: [
      "Daily life revealing itself as the most rigorous and truthful spiritual practice",
      "The gap between 'meditation time' and 'real life' gradually closing",
      "Relationships shifting in quality as the need to be seen and defended lessens",
      "Moments of spontaneous stillness arising in ordinary circumstances — while walking, while listening",
    ],
    goal: ["Understand how the realisation of union transforms the quality of daily life", "Develop daily practices that sustain meditative awareness through activity", "Notice and progressively release the habitual contractions of separation", "Arrive at a lived, natural experience of yoga beyond formal practice times"],
    goalNote: "The union that yoga reveals is not a state you enter and leave — it is the ground of all experience, always present, simply waiting to be recognised.",
  },
];

const benefits = [
  { icon: "", title: "Integration", description: "Experience life as unified and whole rather than fragmented — inner and outer, sacred and ordinary." },
  { icon: "", title: "Equanimity", description: "Meet difficulty and pleasure with increasing steadiness as identification with the limited self relaxes." },
  { icon: "", title: "Presence", description: "Develop genuine presence in relationships — listening and meeting others from openness, not from need." },
  { icon: "", title: "Clarity", description: "Mental clarity deepens as the constant background of self-seeking gradually quiets." },
  { icon: "", title: "Liberation", description: "Move toward Kaivalya — the natural freedom that is the deepest goal of the entire yogic tradition." },
];

function PathOfUnion() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Latest Teaching · Yoga Sutras</p>
            <h1 className={styles.heroTitle}>Path of Union</h1>
            <p className={styles.heroSubtitle}>
              The complete philosophy of yoga as union —{" "}
              <em>from the four paths suited to every temperament, through the states of Samadhi, to the living expression of wholeness in daily life</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>4</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>4</strong> Paths of Yoga</span>
              <span className={styles.heroMetaItem}><strong>Samadhi</strong> Practice</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Latest%20Teachings/Path%20of%20Union.webp" alt="Path of Union" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Yoga Philosophy Course</p>
          <h2 className={styles.sectionTitle}>Four Modules on the <span className={styles.accent}>Path to Union</span></h2>
          <p className={styles.sectionSubtitle}>From the philosophical meaning of yoga to the lived experience of union in daily life — each module takes you deeper into the heart of the tradition.</p>
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
          <p className={styles.eyebrowCenter}>Complete Yoga Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Path of Union</span> in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore its philosophical teachings, practices, inner experiences, and spiritual goals.</p>
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
                        <p className={styles.phaseDetailLabel}>Practices</p>
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
          <h2 className={styles.sectionTitle}>Benefits of the <span className={styles.accent}>Path of Union</span></h2>
          <p className={styles.sectionSubtitle}>The path of yoga is not about gaining something new — it is about recognising what was always present beneath the noise of the separated mind.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #0a2a1a 0%, #1a4a2a 60%, #051510 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Return to Wholeness</h2>
            <p className={styles.ctaSubtext}>
              The separation you feel is not the truth of what you are.<br />
              Yoga is the path home — to the union that was never truly lost.
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

export default PathOfUnion;
