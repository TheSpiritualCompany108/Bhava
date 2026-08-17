import { useNavigate } from "react-router-dom";
import styles from "./SacredKnowledge.module.css";

const cards = [
  {
    id: "texts-temples",
    icon: "auto_stories",
    title: "Sacred Texts + Temples",
    description: "Explore timeless scriptures, sacred temples and profound teachings.",
    cta: "Explore",
    image: "/ayodhya temple.png",
    theme: "purple",
    route: "/knowledge",
  },
  {
    id: "stories-mythology",
    icon: "hourglass_top",
    title: "Stories (Mythology)",
    description: "Dive into inspiring stories from our rich heritage and ancient wisdom.",
    cta: "Explore",
    image: "/lordram.png",
    theme: "orange",
    route: "/knowledge",
  },
  {
    id: "thought-of-day",
    icon: "lightbulb",
    title: "Thought of the Day",
    description: "18 Gita reflections to guide and inspire your day with clarity and purpose.",
    cta: "Read Today's Thought",
    image: "/ink.png",
    theme: "green",
    route: "/knowledge",
  },
];

function SacredKnowledge() {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <span className={`material-symbols-outlined ${styles.lotusIcon}`}>spa</span>
      <p className={styles.kicker}>Sacred Knowledge</p>
      <h2 className={styles.title}>Timeless Wisdom for Everyday Life</h2>
      <div className={styles.ornament}>
        <span className={styles.ornamentLine} />
        <span className={styles.ornamentDot} />
        <span className={styles.ornamentLine} />
      </div>
      <p className={styles.subtitle}>
        Explore ancient scriptures, inspiring stories, and daily reflections
        to nourish your mind and soul.
      </p>

      <div className={styles.grid}>
        {cards.map((card) => (
          <div key={card.id} className={`${styles.card} ${styles[card.theme]}`}>
            <div className={styles.cardContent}>
              <span className={styles.iconBadge}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardDescription}>{card.description}</p>
              <button className={styles.cardLink} onClick={() => navigate(card.route)}>
                {card.cta} <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <img src={card.image} alt="" className={styles.cardImage} aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default SacredKnowledge;
