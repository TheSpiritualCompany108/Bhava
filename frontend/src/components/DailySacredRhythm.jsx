import styles from "./DailySacredRhythm.module.css";

const pillars = [
  {
    title: "Morning Puja",
    hook: "Light. Offer. Remember.",
    description:
      "Begin the day with stillness before movement. A simple offering creates space for gratitude.",
  },
  {
    title: "Dhyāna",
    hook: "Sit. Breathe. Stay.",
    description:
      "A few quiet minutes become the foundation for everything that follows in your day.",
  },
  {
    title: "Mantra",
    hook: "Sound to Silence.",
    description:
      "Allow sacred syllables to steady the wandering mind and awaken deep inner clarity.",
  },
  {
    title: "Reflection",
    hook: "Gratitude Closes.",
    description:
      "End where you began—resting in soft awareness, deep humility, and ultimate peace.",
  },
];

function DailySacredRhythm() {
  return (
    <section className={styles.section} aria-labelledby="daily-sacred-rhythm-title">
      <div className={styles.inner}>
        <h2 id="daily-sacred-rhythm-title" className={styles.title}>
          Your Daily Sacred Rhythm
        </h2>

        <div className={styles.grid}>
          {pillars.map((pillar, i) => (
            <div key={pillar.title} className={styles.column}>
              <div className={styles.divider} />
              <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.columnTitle}>{pillar.title}</h3>
              <p className={styles.hook}>{pillar.hook}</p>
              <p className={styles.description}>{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DailySacredRhythm;
