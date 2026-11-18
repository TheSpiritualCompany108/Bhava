import { useEffect, useRef, useState } from "react";
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
    color: "#4A0B1D",
    description:
      "Learn and explore India's sacred knowledge through courses, workshops and well-structured learning experiences.",
    route: "/services",
  },
  {
    id: "retreats",
    image: "/retreats.png",
    icon: "self_improvement",
    title: "Retreats",
    color: "#8A2642",
    description:
      "Step away from the everyday and reconnect within. Join immersive spiritual retreats and mindful experiences.",
    route: "/services",
  },
  {
    id: "creators",
    image: "/creators.png",
    icon: "podcasts",
    title: "Creators",
    color: "#C0671E",
    description:
      "Discover creators who share knowledge, practices, stories and experiences inspired by the Bhava: way.",
    route: "/services",
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
  const sliderRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return undefined;

    const onScroll = () => {
      const card = el.querySelector(`.${styles.card}`);
      if (!card) return;
      const gap = 16;
      const step = card.offsetWidth + gap;
      const next = Math.round(el.scrollLeft / step);
      setActive(Math.max(0, Math.min(serviceCards.length - 1, next)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector(`.${styles.card}`);
    if (!card) return;
    const gap = 16;
    el.scrollTo({ left: i * (card.offsetWidth + gap), behavior: "smooth" });
    setActive(i);
  };

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

        <div className={styles.cardSliderWrap}>
          <div className={styles.cardGrid} ref={sliderRef}>
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

          <div className={styles.sliderDots} role="tablist" aria-label="Service cards">
            {serviceCards.map((card, i) => (
              <button
                key={card.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${card.title}`}
                className={`${styles.sliderDot} ${i === active ? styles.sliderDotOn : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
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
