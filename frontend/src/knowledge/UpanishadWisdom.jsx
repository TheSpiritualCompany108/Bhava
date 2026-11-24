import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LearningPathPage.module.css";

const HERO_GRADIENT = "linear-gradient(to right, #2a1a5a 0%, #2a1a5acc 30%, transparent 65%)";

const phases = [
  {
    days: "Week 1",
    name: "Foundations of Vedantic Wisdom",
    tagline: "Understanding Atman, Brahman, and their unity",
    color: "#2A1A5A",
    purpose:
      "The Upanishads are the culmination of Vedic knowledge — Vedanta. This first week lays the philosophical foundation: what is Brahman (ultimate reality), what is Atman (the true self), and what does their unity mean for spiritual life.",
    keyTeachings: [
      "Upanishad means 'sitting near the teacher' — direct transmission of wisdom",
      "Brahman — the infinite, formless ultimate reality beyond time and space",
      "Atman — the eternal soul, pure consciousness, beyond birth and death",
      "Unity of Atman and Brahman — the individual self is one with the universe",
      "Self-realization is the ultimate purpose of spiritual life",
    ],
    practices: [
      "Day 1 — Introduction to the Upanishads and their place in the Vedas",
      "Day 2 — Understanding Brahman as ultimate reality",
      "Day 3 — Understanding Atman as the true self",
      "Day 4 — The unity of Atman and Brahman",
      "Day 5 — The purpose of spiritual knowledge",
      "Day 6 — Meditation and contemplation as methods",
      "Day 7 — Silent reflection and meditation practice",
    ],
    innerExperience: [
      "Questioning the nature of the self for the first time",
      "Sense of something deeper than the body and mind",
      "Meditation revealing glimpses of stillness",
      "Growing curiosity about the nature of consciousness",
    ],
    goal: ["Build strong Vedantic foundations", "Understand the nature of Brahman and Atman", "Begin meditation as a tool for self-inquiry", "Experience the philosophical depth of the Upanishads"],
    goalNote: "These foundational concepts form the basis for everything that follows in the Upanishadic tradition.",
  },
  {
    days: "Week 2",
    name: "The Principal Upanishads",
    tagline: "Ten sacred texts that reveal the nature of reality",
    color: "#1B4430",
    purpose:
      "The ten principal Upanishads are the most widely studied texts in Vedantic philosophy. Each one explores a unique dimension of consciousness, the self, and ultimate reality through dialogue between sages and students.",
    keyTeachings: [
      "Isha Upanishad — see the divine presence in all things",
      "Kena Upanishad — the ultimate reality is beyond ordinary perception",
      "Katha Upanishad — the soul is eternal (story of Nachiketa and Yama)",
      "Mundaka Upanishad — true knowledge is the realization of Brahman",
      "Mandukya Upanishad — Om and the four states of consciousness",
      "Chandogya Upanishad — Tat Tvam Asi (You are That)",
      "Brihadaranyaka Upanishad — self-realization leads to ultimate freedom",
    ],
    practices: [
      "Day 8 — Isha Upanishad: divine presence in all things",
      "Day 9 — Kena Upanishad: the power behind the mind and senses",
      "Day 10 — Katha Upanishad: the mystery of death and the eternal soul",
      "Day 11 — Prashna Upanishad: six questions about life and consciousness",
      "Day 12 — Mundaka Upanishad: worldly vs. spiritual knowledge",
      "Day 13 — Mandukya Upanishad: Om and the four states",
      "Day 14 — Meditation on Om",
    ],
    innerExperience: [
      "Stories like Nachiketa deepening the understanding of the soul",
      "Om meditation creating direct experience of stillness",
      "Philosophical statements striking the heart directly",
      "Recognition that the self is vast and not limited",
    ],
    goal: ["Study the core philosophical content of the 10 Upanishads", "Understand consciousness through multiple Upanishadic lenses", "Practice Om meditation for direct experience", "Connect ancient stories to personal spiritual insight"],
    goalNote: "The Chandogya Upanishad's statement 'Tat Tvam Asi — You are That' summarizes the entire Upanishadic teaching.",
  },
  {
    days: "Week 3",
    name: "Advanced Wisdom",
    tagline: "Layers of existence and consciousness explored",
    color: "#422868",
    purpose:
      "The third week explores deeper philosophical layers — the five sheaths of existence (Taittiriya), the origin of consciousness (Aitareya), and the most comprehensive Upanishad (Brihadaranyaka). These teachings prepare the seeker for self-realization.",
    keyTeachings: [
      "Taittiriya — the five layers of existence: body, energy, mind, wisdom, bliss",
      "Aitareya — consciousness is the essence of reality and origin of the universe",
      "Chandogya — Tat Tvam Asi: the soul is one with ultimate reality",
      "Brihadaranyaka — the oldest and most comprehensive philosophical discussion",
      "The four Mahavakyas — great sayings summarizing Vedantic truth",
    ],
    practices: [
      "Day 15 — Taittiriya: five layers of human existence",
      "Day 16 — Aitareya: origin of universe and consciousness",
      "Day 17 — Chandogya: 'Tat Tvam Asi' in depth",
      "Day 18 — Brihadaranyaka: self and ultimate freedom",
      "Day 19 — The Four Mahavakyas: Tat Tvam Asi, Aham Brahmasmi, Prajnanam Brahma, Ayam Atma Brahma",
      "Day 20 — Applying Upanishad wisdom in daily life",
      "Day 21 — Final reflection and deep meditation",
    ],
    innerExperience: [
      "Recognition of the five layers in one's own experience",
      "Contemplation of 'I am Brahman' opening new dimensions",
      "Mahavakyas landing with a direct inner knowing",
      "Meditation becoming naturally deeper",
    ],
    goal: ["Understand the five-layered model of human existence", "Contemplate and internalize the four Mahavakyas", "Apply Upanishadic wisdom to overcome fear and attachment", "Experience the stillness that reveals the true self"],
    goalNote: "The Mahavakyas are not just philosophical statements — they are direct pointers to self-realization.",
  },
  {
    days: "Ongoing",
    name: "Living Upanishad Wisdom",
    tagline: "Transforming knowledge into lived awareness",
    color: "#8B6914",
    purpose:
      "The Upanishads are not merely academic texts — they are invitations to transform ordinary experience into self-realization. This phase provides 100 daily wisdom lessons and a 365-day quote system to keep the teachings alive.",
    keyTeachings: [
      "The Self is eternal and beyond death",
      "True happiness comes from inner realization, not external things",
      "Knowledge removes ignorance like light removes darkness",
      "The universe is filled with divine presence",
      "Meditation reveals the true nature of the self",
      "The mind becomes peaceful through wisdom",
    ],
    practices: [
      "Daily Upanishad wisdom lesson (100 lessons available)",
      "Daily quote from the Upanishads (365-day system)",
      "Morning meditation with Mahavakya contemplation",
      "Self-inquiry: Who am I? — the fundamental Vedantic question",
    ],
    innerExperience: [
      "Teachings naturally arising in daily situations",
      "Stillness becoming the natural background of awareness",
      "Compassion deepening through understanding unity",
      "Less reactivity, more witnessing awareness",
    ],
    goal: ["Integrate Upanishadic wisdom into everyday consciousness", "Develop a daily practice of self-inquiry", "Experience the unity of all existence", "Live with the awareness that Atman is Brahman"],
    goalNote: "Through contemplation and meditation on these teachings, one moves closer to self-realization and spiritual freedom.",
  },
];

const benefits = [
  { icon: "", title: "Self-Knowledge", description: "Understand the nature of consciousness and your true self beyond the body and mind." },
  { icon: "", title: "Spiritual Awareness", description: "Develop deep spiritual awareness through study, meditation, and self-inquiry." },
  { icon: "", title: "Overcome Fear", description: "Overcome fear and attachment by understanding the eternal, indestructible nature of the self." },
  { icon: "", title: "Inner Peace", description: "Cultivate profound inner peace and wisdom through regular contemplation of the Upanishadic teachings." },
  { icon: "", title: "Liberation", description: "Move toward self-realization and the ultimate freedom that comes from knowing 'Aham Brahmasmi.'" },
];

function UpanishadWisdom() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className={styles.page}>
      <section className={`${styles.hero} ${styles.heroHalf}`}>
        <div className={styles.heroOverlay} style={{ background: HERO_GRADIENT }} />
        <div className={styles.heroSplit}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Learning Path · 198K joined</p>
            <h1 className={styles.heroTitle}>Upanishad Wisdom</h1>
            <p className={styles.heroSubtitle}>
              Teachings from the Principal Upanishads — exploring the nature of{" "}
              <em>consciousness, the eternal self, and the ultimate reality known as Brahman</em>.
            </p>
            <div className={styles.heroMeta}>
              <span className={styles.heroMetaItem}><strong>10</strong> Upanishads</span>
              <span className={styles.heroMetaItem}><strong>21</strong> Days</span>
              <span className={styles.heroMetaItem}><strong>4</strong> Mahavakyas</span>
            </div>
            <button className={styles.btnJoinHero} onClick={() => document.getElementById("phases").scrollIntoView({ behavior: "smooth" })}>
              Begin the Journey
            </button>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImageOverlay} style={{ background: HERO_GRADIENT }} />
            <img loading="lazy" decoding="async" src="/Learning%20Paths/Upanishad%20Wisdom.webp" alt="Upanishad Wisdom" className={styles.heroImage} />
          </div>
        </div>
      </section>

      <section className={styles.phasesSection} id="phases">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>21-Day Upanishad Learning Course</p>
          <h2 className={styles.sectionTitle}>Four Stages of <span className={styles.accent}>Vedantic Study</span></h2>
          <p className={styles.sectionSubtitle}>From philosophical foundations to living the teachings — each week deepens your understanding of the ultimate nature of reality.</p>
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
          <h2 className={styles.sectionTitle}>The <span className={styles.accent}>Upanishads</span> in Detail</h2>
          <p className={styles.sectionSubtitle}>Click any stage to explore its key teachings, daily practices, and spiritual goals.</p>
          <div className={styles.phaseDetailList}>
            {phases.map((p, idx) => (
              <div key={p.name} className={`${styles.phaseDetailRow} ${expanded === idx ? styles.phaseDetailRowOpen : ""}`}>
                <button className={styles.phaseDetailHeader} onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <span className={styles.phaseNumber} style={{ background: p.color }}>Stage {idx + 1}</span>
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
                        <p className={styles.phaseDetailLabel}>Daily Practice</p>
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
          <h2 className={styles.sectionTitle}>Benefits of <span className={styles.accent}>Upanishad Study</span></h2>
          <p className={styles.sectionSubtitle}>The teachings of the Upanishads remain deeply relevant in the modern world. They encourage individuals to look beyond material success and discover deeper meaning.</p>
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

      <section className={styles.ctaSection} style={{ background: "linear-gradient(135deg, #2a1a5a 0%, #422868 60%, #1a0a3a 100%)" }}>
        <div className={styles.container}>
          <div className={styles.ctaInner}>
            <h2 className={styles.ctaTitle}>Begin the Upanishad Journey</h2>
            <p className={styles.ctaSubtext}>
              Aham Brahmasmi — I am Brahman.<br />
              Through contemplation and meditation, move closer to self-realization and spiritual freedom.
            </p>
            <div className={styles.ctaButtons}>
              <button className={styles.btnPrimary}>Start Day 1 Today</button>
              <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UpanishadWisdom;
