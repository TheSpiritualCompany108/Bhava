import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #1a1a3a 0%, #1a1a3acc 30%, transparent 65%)";

const phases = [
  {
    days: "Module 1",
    name: "The Law of Karma",
    tagline: "Every action creates a consequence",
    color: "#3A2A6A",
    purpose:
      "Karma comes from the Sanskrit root 'Kri' — meaning action or deed. In Hindu philosophy, every action produces a result that may appear immediately or unfold over time. Actions can be physical, verbal, or mental. Even thoughts and intentions carry karmic weight. Hindu philosophy identifies three distinct types of karma that together shape the experience of every living being.",
    keyTeachings: [
      "Karma — the universal law of cause and effect governing all existence",
      "Every action, word, and thought produces a corresponding result",
      "Sanchita Karma — accumulated karma from all past lives awaiting fruition",
      "Prarabdha Karma — the portion of past karma shaping the present life circumstances",
      "Kriyamana Karma — actions performed in the present that will shape future outcomes",
      "Intention behind an action shapes the quality and depth of its karmic result",
    ],
    practices: [
      "Reflect on the intention behind your actions each morning",
      "Practice mindful speech — observe how words affect others",
      "At day's end, review one action and consider its effect on those around you",
      "Begin a karma journal: record daily actions and the intentions behind them",
    ],
    innerExperience: [
      "Growing awareness of how small choices ripple outward",
      "A sense of personal responsibility replacing the habit of blaming circumstances",
      "Recognition that thoughts themselves carry energy and influence",
      "Deeper sensitivity to the intentions behind your own actions",
    ],
    goal: ["Understand the three types of karma and how they shape experience", "Develop awareness of intention as the seed of karmic result", "Begin observing daily actions with greater mindfulness", "Recognise personal responsibility as a spiritual principle"],
    goalNote: "Karma is not punishment — it is the precise and impartial law of cause and effect, guiding every soul toward greater wisdom.",
  },
  {
    days: "Module 2",
    name: "The Path of Dharma",
    tagline: "Righteous duty as the foundation of harmonious life",
    color: "#5A2A0A",
    purpose:
      "Dharma comes from the Sanskrit root 'Dhri' — to uphold or sustain. Dharma represents the universal moral order that maintains harmony in the world, and also the personal duties and responsibilities each individual must follow according to their role, stage of life, and abilities. Living according to Dharma means acting with honesty, compassion, responsibility, and respect for the wider community.",
    keyTeachings: [
      "Dharma — the universal moral order that sustains harmony in the world",
      "Personal Dharma varies according to one's role, stage of life, and abilities",
      "A teacher's dharma: to guide students with knowledge and care",
      "A parent's dharma: to raise children with love and wisdom",
      "A leader's dharma: to protect and serve society with integrity",
      "Following personal dharma creates balance and contributes to collective well-being",
    ],
    practices: [
      "Identify your primary dharmic roles in life at this moment",
      "Each week, focus on fulfilling one responsibility with complete attention",
      "Practice honesty in one small interaction daily — notice its effect",
      "Reflect: where am I avoiding my dharma? What small step can I take today?",
    ],
    innerExperience: [
      "A growing sense of alignment when acting from duty rather than desire",
      "Relief that comes from taking responsibility rather than avoiding it",
      "Clearer sense of purpose when understanding one's role in the larger order",
      "The quiet dignity that comes from living with integrity",
    ],
    goal: ["Understand dharma as both universal moral law and personal duty", "Identify your own dharmic responsibilities clearly", "Begin making decisions guided by dharmic principles", "Experience the inner stability that comes from right action"],
    goalNote: "Dharma is not rigid law — it is the living truth of righteous action adapted to one's circumstances, wisdom, and stage of life.",
  },
  {
    days: "Module 3",
    name: "Karma & Dharma in Scripture",
    tagline: "Sacred stories that illuminate right action",
    color: "#1B4430",
    purpose:
      "The great Indian epics — the Ramayana and the Mahabharata — are not merely stories but living teachings on karma and dharma. Through the choices made by Rama, Yudhishthira, Karna, and Krishna's teachings to Arjuna in the Bhagavad Gita, these narratives reveal the complexity, beauty, and necessity of right action in the face of genuine moral difficulty.",
    keyTeachings: [
      "Bhagavad Gita — Arjuna's moral dilemma and Krishna's teaching on dutiful action",
      "Perform your duty with dedication, but remain detached from the outcome",
      "Story of Rama — following dharma even when it demanded personal sacrifice and exile",
      "Story of Yudhishthira — steadfast commitment to truth and justice in all circumstances",
      "Story of Karna — the complexity of dharma when loyalty and righteousness conflict",
      "Dharma can be complex; wisdom is required to discern the right path in difficult situations",
    ],
    practices: [
      "Read or listen to Arjuna's dilemma in the Bhagavad Gita (Chapter 1–2)",
      "Study the story of Rama's exile and his response — contemplate the lesson",
      "Reflect on a personal moral dilemma: what would dharma require of you?",
      "Write your understanding of one story's lesson and how it applies to your life today",
    ],
    innerExperience: [
      "Stories becoming mirrors — Arjuna's confusion reflecting your own moments of doubt",
      "Rama's steadiness inspiring courage when facing your own difficult duties",
      "Yudhishthira's integrity revealing where compromise has crept into your own life",
      "A deepened respect for the complexity of dharma in real human situations",
    ],
    goal: ["Study the key scriptural teachings on karma and dharma", "Extract applicable wisdom from the stories of Rama, Yudhishthira, and Karna", "Apply the Gita's teaching on detached action to real personal situations", "Develop moral clarity through engagement with sacred narrative"],
    goalNote: "Sacred stories are not history — they are living teachings designed to illuminate the choices we face in our own lives.",
  },
  {
    days: "Module 4",
    name: "Karma Yoga & Daily Reflection",
    tagline: "Selfless action as the highest spiritual practice",
    color: "#422868",
    purpose:
      "Karma Yoga is the path of selfless action — performing one's duties without attachment to reward or personal gain. This approach transforms every ordinary action into spiritual practice. By offering the results of all actions to the Divine and maintaining a daily reflection system, the practitioner gradually purifies the mind and moves toward freedom from the cycle of karma.",
    keyTeachings: [
      "Karma Yoga — the yoga of selfless action, free from attachment to outcome",
      "Everyday action becomes spiritual practice when performed without ego or desire",
      "Offering results to the Divine: 'I act, but I am not the doer of this action'",
      "Morning Intention: 'Today I will act with honesty, kindness, and awareness'",
      "Midday Awareness: Am I acting with compassion? Are my actions aligned with my values?",
      "Evening Reflection: Did I help someone? Did I act with patience? What can I improve?",
    ],
    practices: [
      "Begin each day with the Karma Yoga intention: offer today's actions to the Divine",
      "Perform one act of selfless service (seva) each day without expectation of recognition",
      "Keep a daily karma reflection journal: intention, midday check-in, evening review",
      "End each day with gratitude: 'May my actions bring peace and harmony to others'",
    ],
    innerExperience: [
      "Actions becoming lighter when released from attachment to their outcome",
      "Seva gradually dissolving the boundary between self-interest and genuine care",
      "Evening reflection creating surprising honesty about where ego still drives action",
      "A growing sense of peace that comes from doing one's best and surrendering the rest",
    ],
    goal: ["Understand and practise Karma Yoga as a daily spiritual path", "Establish a consistent daily karma reflection routine", "Perform at least one act of selfless service each day", "Experience the liberation that comes from acting without attachment"],
    goalNote: "When action is freed from the demand for personal reward, every moment of life becomes an offering — and life itself becomes yoga.",
  },
];

const benefits = [
  { icon: "", title: "Self-Awareness", description: "Develop deeper awareness of your actions, intentions, and their effects on those around you." },
  { icon: "", title: "Ethical Living", description: "Build a life grounded in dharmic principles — honesty, compassion, responsibility, and integrity." },
  { icon: "", title: "Inner Harmony", description: "Experience greater inner peace as alignment between values and actions reduces inner conflict." },
  { icon: "", title: "Spiritual Growth", description: "Progress on the spiritual path by purifying karma through right action and selfless service." },
  { icon: "", title: "Right Action", description: "Develop the wisdom to identify and fulfil your dharma clearly, even in morally complex situations." },
];

function KarmaDharma() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Latest Teaching · Philosophy</p>
            <h1 className={styles.heroTitle}>Karma & Dharma</h1>
            <p className={styles.heroSubtitle}>
              Understanding the philosophy of right action and duty —{" "}
              <em>how every action shapes destiny, and how dharma guides the soul toward righteous and harmonious living</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>4</strong> Modules</span>
              <span className={styles.heroMetaItem}><strong>3</strong> Karma Types</span>
              <span className={styles.heroMetaItem}><strong>Daily</strong> Practice</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Latest%20Teachings/Karma%20Dharma.webp" alt="Karma and Dharma" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Complete Philosophy Learning Course</p>
          <h2 className={styles.sectionTitle}>Four Modules of <span className={styles.accent}>Karma & Dharma</span></h2>
          <p className={styles.sectionSubtitle}>From the law of cause and effect to the daily practice of selfless action — each module deepens your understanding of right living.</p>
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
          <p className={styles.eyebrowCenter}>Complete Study Guide</p>
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Karma & Dharma</span> Course in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any module to explore its key teachings, practices, and spiritual goals.</p>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Karma & Dharma</span> Study</h2>
          <p className={styles.sectionSubtitle}>Understanding karma and dharma transforms the way you experience every action — from burden into offering, from confusion into clarity.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #1a1a3a 0%, #3a2a6a 60%, #0a0a1a 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Live with Karma Awareness</h2>
            <p className={styles.ctaSubtext}>
              Every action is a seed. Every intention is its soil.<br />
              Begin the practice of conscious, dharmic living — one mindful action at a time.
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

export default KarmaDharma;
