import styles from "./ProductSpecification.module.css";

function ProductSpecification() {
  const specs = [
    {
      id: 0,
      title: "Temple Blessed",
      description: "Most rituals feel disconnected today. Sourced from living temple traditions. Bring this into your daily ritual.",
      image: "/Temple Blessed.webp"
    },
    {
      id: 1,
      title: "100% Authentic",
      description: "Most rituals feel disconnected today. Sourced from living temple traditions. Bring this into your daily ritual.",
      image: "/Authetic.webp"
    },
    {
      id: 2,
      title: "Premium Quality",
      description: "Ritual deserves consistency. Made with care and precision. Stay with the practice",
      image: "/Premium Quality.webp"
    }
  ];

  return (
    <div className={styles.productSpecificationSection}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.row}>
          {specs.map((spec) => (
            <div key={spec.id} className={styles.col}>
              <div className={styles.specCard}>
                <div className={styles.specImageContainer}>
                  <img loading="lazy" decoding="async" src={spec.image} alt={spec.title} />
                </div>
                <div className={styles.specContent}>
                  <h3 className={styles.specTitle}>{spec.title}</h3>
                  <p className={styles.specDescription}>{spec.description}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductSpecification;
