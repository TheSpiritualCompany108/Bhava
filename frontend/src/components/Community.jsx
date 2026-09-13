import styles from "./Community.module.css";
import useHomepageSection from "../hooks/useHomepageSection";

const defaultTestimonials = [
  {
    text: "Lighting a lamp has become the moment my family gathers before dinner. It lasts only a minute, yet changes the atmosphere of our home.",
    author: "Priya",
    location: "Mumbai",
  },
  {
    text: "My mornings no longer begin with notifications. They begin with silence.",
    author: "Arjun",
    location: "Bengaluru",
  },
  {
    text: "The quality is incomparable. I've been using Bhava incense for my daily puja and the difference is extraordinary. It's like bringing the temple into my home.",
    author: "Priya Sharma",
    location: "Mumbai",
  },
];

function Community() {
  const overrides = useHomepageSection("community");
  const testimonials =
    Array.isArray(overrides.testimonials) && overrides.testimonials.length > 0
      ? overrides.testimonials
      : defaultTestimonials;

  return (
    <section className={styles.communitySection}>
      <div className={styles.communityHeader}>
        <p className={styles.kicker}>{overrides.kicker || "Community Stories"}</p>
        <h2 className={styles.communityTitle}>{overrides.title || "Living with Bhava :"}</h2>
      </div>

      <div className={styles.grid}>
        {testimonials.map((t, i) => (
          <article
            key={t.author + i}
            className={`${styles.testimonialCard} ${i === testimonials.length - 1 ? styles.testimonialCardAccent : ""}`}
          >
            <span className={styles.quoteMark}>&ldquo;</span>
            <p className={styles.testimonialText}>{t.text}</p>
            <p className={styles.testimonialAuthor}>
              — {t.author}
              <span className={styles.testimonialLocation}>{t.location}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Community;
