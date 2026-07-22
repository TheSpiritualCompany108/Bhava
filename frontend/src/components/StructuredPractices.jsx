import { useNavigate } from "react-router-dom";
import styles from "./StructuredPractices.module.css";

const practices = [
  {
    title: "108-Day Mantra Sādhana",
    hook: "One mantra. 108 days.",
    description:
      "Daily audio guidance, reflections, and gentle reminders transform repetition into devotion.",
    route: "/knowledge/108-day-sadhana",
  },
  {
    title: "40-Day Gita Wisdom Path",
    hook: "One verse. Read & reflect.",
    description:
      "Allow timeless wisdom to become lived, daily understanding through slow, meditative study.",
    route: "/knowledge/40-day-gita-wisdom",
  },
  {
    title: "21-Day Dhyāna Journey",
    hook: "Introduction to stillness.",
    description:
      "Designed for everyday life, featuring guided sessions that build gradually over three weeks.",
    route: "/knowledge/21-day-dhyan",
  },
];

function StructuredPractices() {
  const navigate = useNavigate();

  return (
    <section className={styles.section} aria-labelledby="structured-practices-title">
      <div className={styles.inner}>
        <h2 id="structured-practices-title" className={styles.title}>
          Structured Practices
        </h2>

        <div className={styles.grid}>
          {practices.map((practice, i) => {
            const isLast = i === practices.length - 1;
            return (
              <div
                key={practice.title}
                className={`${styles.card} ${isLast ? styles.cardAccent : ""}`}
                onClick={() => navigate(practice.route)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === "Enter") navigate(practice.route); }}
              >
                <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.cardTitle}>{practice.title}</h3>
                <p className={styles.hook}>{practice.hook}</p>
                <p className={styles.description}>{practice.description}</p>
                <button
                  className={styles.exploreBtn}
                  onClick={(e) => { e.stopPropagation(); navigate(practice.route); }}
                >
                  Begin with Bhava:
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StructuredPractices;
