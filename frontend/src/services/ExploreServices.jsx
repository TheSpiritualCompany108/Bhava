import { useNavigate } from "react-router-dom";
import styles from "./ExploreServices.module.css";

const promoBands = [
  {
    id: "corporate-gifting",
    image: "/corporate gifting.png",
    title: "Corporate Gifting",
    subtitle: "Meaningful gifts for teams and occasions",
    cta: "Explore Corporate Gifting",
    route: "/products",
  },
  {
    id: "luxury-collection",
    image: "/luxury collection.png",
    title: "Luxury Collection",
    subtitle: "Curated pieces for your sacred space",
    cta: "Explore Collection",
    route: "/products",
  },
];

const serviceCards = [
  {
    id: "sacred-education",
    image: "/sacred education.png",
    icon: "auto_stories",
    title: "Sacred Education",
    color: "#2A1845",
    description:
      "Learn and explore India's sacred knowledge through courses, workshops and well-structured learning experiences.",
    route: "/knowledge",
  },
  {
    id: "retreats",
    image: "/retreats.png",
    icon: "self_improvement",
    title: "Retreats",
    color: "#3D6B4F",
    description:
      "Step away from the everyday and reconnect within. Join immersive spiritual retreats and mindful experiences.",
    route: "/community",
  },
  {
    id: "creators",
    image: "/creators.png",
    icon: "podcasts",
    title: "Creators",
    color: "#C0671E",
    description:
      "Discover creators who share knowledge, practices, stories and experiences inspired by the Bhava way.",
    route: "/community",
  },
];

function PromoBand({ band, navigate }) {
  return (
    <div className={styles.promoBand}>
      <img src={band.image} alt={band.title} className={styles.promoImage} />
      <div className={styles.promoContent}>
        <h3 className={styles.promoTitle}>{band.title}</h3>
        <p className={styles.promoSubtitle}>{band.subtitle}</p>
        <button className={styles.promoBtn} onClick={() => navigate(band.route)}>
          {band.cta} <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}

function ExploreServices() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <PromoBand band={promoBands[0]} navigate={navigate} />

      <section className={styles.servicesSection}>
        <span className={`material-symbols-outlined ${styles.lotusIcon}`}>spa</span>
        <h1 className={styles.sectionTitle}>Services</h1>
        <div className={styles.ornament}>
          <span className={styles.ornamentLine} />
          <span className={styles.ornamentDot} />
          <span className={styles.ornamentLine} />
        </div>
        <p className={styles.sectionSubtitle}>
          Explore meaningful services and experiences designed to enrich your
          spiritual and personal journey.
        </p>

        <div className={styles.cardGrid}>
          {serviceCards.map((card) => (
            <div key={card.id} className={styles.card}>
              <div className={styles.cardImageWrap}>
                <img src={card.image} alt={card.title} className={styles.cardImage} />
                <span className={styles.cardIconBadge} style={{ color: card.color }}>
                  <span className="material-symbols-outlined">{card.icon}</span>
                </span>
              </div>
              <h3 className={styles.cardTitle} style={{ color: card.color }}>
                {card.title}
              </h3>
              <div className={styles.cardDivider} style={{ background: card.color }} />
              <p className={styles.cardDescription}>{card.description}</p>
              <button
                className={styles.cardLink}
                style={{ color: card.color }}
                onClick={() => navigate(card.route)}
              >
                Explore <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          ))}
        </div>

        <button className={styles.exploreAllBtn} onClick={() => navigate("/services")}>
          <span className="material-symbols-outlined">explore</span>
          Explore All Services <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </section>

      <PromoBand band={promoBands[1]} navigate={navigate} />
    </div>
  );
}

export default ExploreServices;
