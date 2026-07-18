import styles from "./DailyReflectionInfo.module.css";

const points = [
  {
    title: "Today's Reflection & Meaning",
    description:
      "Every day offers a carefully translated Gita verse paired with a contemporary, practical explanation to cultivate quiet focus and mental clarity.",
  },
  {
    title: "How to Live It Today",
    description:
      "Translate theory into action with immediate, simple daily practices designed to integrate spiritual teachings smoothly into modern routines.",
  },
  {
    title: "Save & Share Reflections",
    description:
      "Build your personal archive of wisdom by saving meaningful insights, or easily share daily lessons with friends and family to grow together.",
  },
];

function DailyReflectionInfo() {
  return (
    <section className={styles.section} aria-labelledby="daily-reflection-info-title">
      <div className={styles.inner}>
        <p className={styles.kicker}>Daily Reflections</p>
        <h2 id="daily-reflection-info-title" className={styles.title}>
          Bringing Ancient Wisdom to Daily Life
        </h2>

        <ol className={styles.list}>
          {points.map((point, i) => (
            <li key={point.title} className={styles.item}>
              <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className={styles.itemTitle}>{point.title}</h3>
                <p className={styles.itemDescription}>{point.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default DailyReflectionInfo;
