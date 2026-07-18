import styles from "./RitualTierCards.module.css";

export const homeRitualTiers = [
  {
    name: "Shubh Yatra",
    price: "₹501",
    tag: "Pocket Ritual",
    tagline: "Carry presence wherever life takes you.",
    description: "Designed for travel, work, and pocket-sized daily practice.",
    items: [
      "Tiger Eye & Rudraksha",
      "Gomti Chakra & Tulsi",
      "White Camphor (30g)",
      "Dhoop Cones & Chalisa",
      "7-Day Challenge & QR",
    ],
    practice: null,
    badge: null,
  },
  {
    name: "Daily Starter",
    price: "₹1,100",
    tag: "11-Day System",
    tagline: "Begin your daily rhythm.",
    description: "Everything needed to establish an effortless 11-minute ritual.",
    items: [
      "11 Ready Ghee Diyas",
      "11 Premium Agarbatti",
      "Mini Bhava Pyramid (80mm)",
      "Kumkum & Pooja Oil",
      "Guided Ritual Card",
    ],
    practice: "11 mins · 11 days · 1 habit",
    badge: null,
  },
  {
    name: "Daily Ritual Kit",
    price: "₹2,100",
    tag: "Complete Kit",
    tagline: "Your Complete Daily Ritual.",
    description: "Designed to make beautiful consistency effortless.",
    items: [
      "21 Ghee Diyas & Agarbatti",
      "Bhava Pyramid (110mm)",
      "Brass Bell & Small Shankh",
      "Chandan, Kumkum & Camphor",
      "Guided 3-Step Ritual Card",
    ],
    practice: "11 mins everyday · 21-day journey",
    badge: "MOST POPULAR",
  },
];

export const premiumRitualTiers = [
  {
    name: "Extended Ritual System",
    price: "₹3,100",
    tag: "Coming Soon",
    tagline: "More time. More depth. More presence.",
    description: "Everything from Daily Kit, enhanced with:",
    items: [
      "31-Day Ritual Cycle",
      "Premium Pyramid (130–140 mm)",
      "Larger Brass Bell & Larger Shankh",
      "Premium Sandalwood & Camphor (150 g)",
      "Premium Crafted Gift Packaging",
    ],
    practice: null,
    badge: null,
    comingSoon: true,
  },
  {
    name: "Signature Ritual",
    price: "₹5,100",
    tag: "Flagship · Coming Soon",
    tagline: "The complete, ultimate Bhava experience.",
    description: "Beautiful homes and meaningful gifting includes:",
    items: [
      "51 Ready Diyas & 51 Premium Agarbatti",
      "51 Dhoop Cones / Sambrani Cups",
      "Signature Pyramid (150–160 mm) & Brass Diya",
      "Premium Bell & Dakshinavarti Shankh",
      "Premium Ganga Jal & Camphor (200 g)",
      "Luxury Signature Gift Packaging",
    ],
    practice: null,
    badge: null,
    comingSoon: true,
  },
];

function RitualTierCards({ tiers, columns = 3 }) {
  return (
    <div className={styles.grid} style={{ "--columns": columns }}>
      {tiers.map((tier) => (
        <div key={tier.name} className={`${styles.card} ${tier.badge ? styles.cardAccent : ""}`}>
          {tier.badge && <span className={styles.badge}>{tier.badge}</span>}

          <h3 className={styles.name}>{tier.name}</h3>
          <p className={styles.priceRow}>
            <span className={styles.price}>{tier.price}</span>
            <span className={styles.tagDivider}>|</span>
            <span className={styles.tag}>{tier.tag}</span>
          </p>

          <p className={styles.tagline}>{tier.tagline}</p>
          <p className={styles.description}>{tier.description}</p>

          <p className={styles.itemsLabel}>What's Inside:</p>
          <ul className={styles.items}>
            {tier.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          {tier.practice && (
            <div className={styles.practice}>
              <span className={styles.practiceLabel}>Practice:</span>
              <span>{tier.practice}</span>
            </div>
          )}

          {tier.comingSoon && <span className={styles.comingSoon}>Coming Soon</span>}
        </div>
      ))}
    </div>
  );
}

export default RitualTierCards;
