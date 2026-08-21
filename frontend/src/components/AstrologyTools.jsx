import { useNavigate } from "react-router-dom";
import styles from "./AstrologyTools.module.css";

const tools = [
  {
    id: "kundli-generator",
    icon: "grid_view",
    title: "Kundli Generator",
    description: "Generate your detailed birth chart and explore the positions of planets in your life.",
    cta: "Generate Now",
    image: "/kudli generator.png",
    theme: "purple",
    route: "/kundli-generator",
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
    id: "kundli-matching",
    icon: "favorite",
    title: "Kundli Matching",
    description: "Check compatibility with detailed Ashtakoot matching for a strong bond.",
    cta: "Match Now",
    image: "/kundli matching.png",
    theme: "rose",
  },
  {
    id: "numerology-calculator",
    icon: "numbers",
    title: "Numerology Calculator",
    description: "Discover your life path, destiny number and hidden patterns in your life.",
    cta: "Calculate Now",
    image: "/numerelogy calcultor.png",
    theme: "green",
  },
];

const features = [
  {
    icon: "auto_awesome",
    title: "More Tools Coming Soon",
    description: "Rashi, Moon Sign, Panchang, Horoscope, Muhurat and more.",
  },
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

  return (
    <section className={styles.section}>
      <span className={`material-symbols-outlined ${styles.sparkleIcon}`}>auto_awesome</span>
      <p className={styles.kicker}>Astrology &amp; Spiritual Tools</p>
      <h2 className={styles.title}>Discover Your Cosmic Blueprint</h2>
      <div className={styles.ornament}>
        <span className={styles.ornamentLine} />
        <span className={styles.ornamentDot} />
        <span className={styles.ornamentLine} />
      </div>
      <p className={styles.subtitle}>
        Powerful astrology tools to understand yourself, make better
        decisions and live with clarity.
      </p>

      <div className={styles.grid}>
        {tools.map((tool) => (
          <div key={tool.id} className={`${styles.card} ${styles[tool.theme]}`}>
            <span className={styles.iconBadge}>
              <span className="material-symbols-outlined">{tool.icon}</span>
            </span>
            <h3 className={styles.cardTitle}>{tool.title}</h3>
            <p className={styles.cardDescription}>{tool.description}</p>
            <img src={tool.image} alt="" className={styles.cardImage} aria-hidden="true" />
            <button className={styles.cardLink} onClick={() => navigate(tool.route || "/services")}>
              {tool.cta} <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        ))}
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
