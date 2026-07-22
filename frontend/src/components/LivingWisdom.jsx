import { useNavigate } from "react-router-dom";
import styles from "./LivingWisdom.module.css";

const topics = [
  { title: "Karma & Dharma", description: "Right action with a peaceful mind." },
  { title: "Divine Grace", description: "Where effort meets surrender." },
  { title: "Inner Stillness", description: "Beyond thought lies quiet awareness." },
  { title: "Sacred Traditions", description: "Living practices shaped by centuries of devotion." },
  { title: "Festivals", description: "The inner meaning behind every celebration." },
  { title: "Mindful Living", description: "Small acts that transform ordinary days." },
];

function LivingWisdom() {
  const navigate = useNavigate();

  return (
    <section className={styles.section} aria-labelledby="living-wisdom-title">
      <div className={styles.inner}>
        <div className={styles.left}>
          <h2 id="living-wisdom-title" className={styles.title}>
             Daily Practice &amp; Philosophy
          </h2>
          <p className={styles.description}>
            A structured path to integrate timeless philosophy into modern
            daily rhythms. Begin your journey toward consistent daily
            presence.
          </p>
          <button className={styles.beginBtn} onClick={() => navigate("/knowledge")}>
            Begin with Bhava:
          </button>
        </div>

        <div className={styles.grid}>
          {topics.map((topic, i) => (
            <div
              key={topic.title}
              className={`${styles.card} ${i === topics.length - 1 ? styles.cardAccent : ""}`}
            >
              <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className={styles.cardTitle}>{topic.title}</h3>
              <p className={styles.cardDescription}>{topic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LivingWisdom;
