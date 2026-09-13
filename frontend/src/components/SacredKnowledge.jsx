import { useNavigate } from "react-router-dom";
import styles from "./SacredKnowledge.module.css";
import useHomepageSection, { resolveHomepageImageUrl, PLACEHOLDER_IMAGE } from "../hooks/useHomepageSection";

const cards = [
  {
    id: "texts-temples",
    icon: "auto_stories",
    title: "Sacred Texts + Temples",
    description: "Explore timeless scriptures, sacred temples and profound teachings.",
    cta: "Explore",
    image: "/ayodhya temple.png",
    theme: "maroon",
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
    theme: "maroon",
    route: "/knowledge",
  },
];

function SacredKnowledge() {
  const navigate = useNavigate();
  const overrides = useHomepageSection("sacredKnowledge");
  const items = overrides.items || {};
  const hiddenIds = overrides.hiddenIds || [];
  const extraIds = Array.isArray(overrides.extraIds) ? overrides.extraIds : [];

  const displayCards = [
    ...cards.filter((c) => !hiddenIds.includes(c.id)),
    ...extraIds.map((id) => ({
      id,
      icon: "auto_awesome",
      title: "New Card",
      description: "",
      cta: "Explore",
      image: null,
      theme: "maroon",
      route: "/knowledge",
    })),
  ];

  return (
    <section className={styles.section}>
      <span className={`material-symbols-outlined ${styles.lotusIcon}`}>spa</span>
      <p className={styles.kicker}>{overrides.kicker || "Sacred Knowledge"}</p>
      <h2 className={styles.title}>{overrides.title || "Timeless Wisdom for Everyday Life"}</h2>
      <div className={styles.ornament}>
        <span className={styles.ornamentLine} />
        <span className={styles.ornamentDot} />
        <span className={styles.ornamentLine} />
      </div>
      <p className={styles.subtitle}>
        {overrides.subtitle ||
          "Explore ancient scriptures, inspiring stories, and daily reflections to nourish your mind and soul."}
      </p>

      <div className={styles.grid}>
        {displayCards.map((card) => {
          const o = items[card.id] || {};
          return (
            <div key={card.id} className={`${styles.card} ${styles[card.theme]}`}>
              <div className={styles.cardContent}>
                <span className={styles.iconBadge}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </span>
                <h3 className={styles.cardTitle}>{o.title || card.title}</h3>
                <p className={styles.cardDescription}>{o.description || card.description}</p>
                <button className={styles.cardLink} onClick={() => navigate(card.route)}>
                  {o.cta || card.cta} <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
              <img
                src={o.image ? resolveHomepageImageUrl(o.image) : card.image || PLACEHOLDER_IMAGE}
                alt=""
                className={styles.cardImage}
                aria-hidden="true"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default SacredKnowledge;
