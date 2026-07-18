import styles from "./FeaturedRituals.module.css";
import RitualTierCards, { homeRitualTiers } from "./RitualTierCards";

function FeaturedRituals() {
  return (
    <section className={styles.section} aria-labelledby="featured-rituals-title">
      <div className={styles.inner}>
        <p className={styles.kicker}>Systems from ₹501</p>
        <h2 id="featured-rituals-title" className={styles.title}>
          Featured Rituals
        </h2>

        <RitualTierCards tiers={homeRitualTiers} />
      </div>
    </section>
  );
}

export default FeaturedRituals;
