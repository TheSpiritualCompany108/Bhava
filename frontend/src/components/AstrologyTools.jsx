import { useNavigate } from "react-router-dom";
import styles from "./AstrologyTools.module.css";
import useHomepageSection, { resolveHomepageImageUrl, PLACEHOLDER_IMAGE } from "../hooks/useHomepageSection";

const tools = [
  {
    id: "kundli-generator",
    icon: "grid_view",
    title: "Kundli Generator",
    description: "Generate your detailed birth chart and explore the positions of planets in your life.",
    cta: "Generate Now",
    image: "/kudli generator.png",
    theme: "maroon",
    route: "/kundli-generator",
  },
  {
    id: "kundli-matching",
    icon: "favorite",
    title: "Kundli Matching",
    description: "Check compatibility with detailed Ashtakoot matching for a strong bond.",
    cta: "Match Now",
    image: "/kundli matching.png",
    theme: "orange",
  },
  {
    id: "astrology-calculator",
    icon: "explore",
    title: "Astrology Calculator",
    description: "Calculate your sun sign, moon sign, ascendant and more with accurate insights.",
    cta: "Calculate Now",
    image: "/astrology calculator.png",
    theme: "orange",
  },
  {
    id: "numerology-calculator",
    icon: "numbers",
    title: "Numerology Calculator",
    description: "Discover your life path, destiny number and hidden patterns in your life.",
    cta: "Calculate Now",
    image: "/numerelogy calcultor.png",
    theme: "maroon",
  },
];

const features = [
  {
    icon: "verified_user",
    title: "Authentic & Accurate",
    description: "Based on ancient wisdom and trusted calculations.",
  },
  {
    icon: "touch_app",
    title: "Easy to Use",
    description: "Simple steps and instant results you can understand.",
  },
  {
    icon: "lock",
    title: "100% Secure",
    description: "Your data is private and always protected.",
  },
];

function AstrologyTools() {
  const navigate = useNavigate();
  const overrides = useHomepageSection("astrologyTools");
  const items = overrides.items || {};
  const hiddenIds = overrides.hiddenIds || [];
  const extraIds = Array.isArray(overrides.extraIds) ? overrides.extraIds : [];

  const displayTools = [
    ...tools.filter((t) => !hiddenIds.includes(t.id)),
    ...extraIds.map((id) => ({
      id,
      icon: "auto_awesome",
      title: "New Card",
      description: "",
      cta: "Explore",
      image: null,
      theme: "maroon",
      route: "/services",
    })),
  ];

  return (
    <section className={styles.section}>
      <span className={`material-symbols-outlined ${styles.sparkleIcon}`}>auto_awesome</span>
      <p className={styles.kicker}>{overrides.kicker || "Astrology & Spiritual Tools"}</p>
      <h2 className={styles.title}>{overrides.title || "Discover Your Cosmic Blueprint"}</h2>
      <div className={styles.ornament}>
        <span className={styles.ornamentLine} />
        <span className={styles.ornamentDot} />
        <span className={styles.ornamentLine} />
      </div>
      <p className={styles.subtitle}>
        {overrides.subtitle ||
          "Powerful astrology tools to understand yourself, make better decisions and live with clarity."}
      </p>

      <div className={styles.grid}>
        {displayTools.map((tool) => {
          const o = items[tool.id] || {};
          return (
            <div key={tool.id} className={`${styles.card} ${styles[tool.theme]}`}>
              <span className={styles.iconBadge}>
                <span className="material-symbols-outlined">{tool.icon}</span>
              </span>
              <h3 className={styles.cardTitle}>{o.title || tool.title}</h3>
              <p className={styles.cardDescription}>{o.description || tool.description}</p>
              <img
                src={o.image ? resolveHomepageImageUrl(o.image) : tool.image || PLACEHOLDER_IMAGE}
                alt=""
                className={styles.cardImage}
                aria-hidden="true"
              />
              <button className={styles.cardLink} onClick={() => navigate(tool.route || "/services")}>
                {o.cta || tool.cta} <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          );
        })}
      </div>

      <div className={styles.featureBar}>
        {features.map((f) => (
          <div key={f.title} className={styles.featureItem}>
            <span className={`material-symbols-outlined ${styles.featureIcon}`}>{f.icon}</span>
            <div className={styles.featureText}>
              <p className={styles.featureTitle}>{f.title}</p>
              <p className={styles.featureDesc}>{f.description}</p>
            </div>
          </div>
        ))}
        <button className={styles.exploreAllBtn} onClick={() => navigate("/services")}>
          Explore All Tools <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </section>
  );
}

export default AstrologyTools;
