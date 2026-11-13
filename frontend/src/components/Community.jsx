import { useEffect, useState } from "react";
import styles from "./Community.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Community() {
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/reviews?verified=1&limit=6`)
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j.success) setReviews(j.reviews || []);
        else if (!cancelled) setReviews([]);
      })
      .catch(() => { if (!cancelled) setReviews([]); });
    return () => { cancelled = true; };
  }, []);

  if (!reviews || reviews.length === 0) return null;

  return (
    <section className={styles.communitySection} aria-labelledby="home-reviews">
      <div className={styles.communityHeader}>
        <p className={styles.kicker}>Verified reviews</p>
        <h2 id="home-reviews" className={styles.communityTitle}>From those who use Bhava</h2>
      </div>

      <div className={styles.grid}>
        {reviews.map((t, i) => (
          <article
            key={t.id || i}
            className={`${styles.testimonialCard} ${i === reviews.length - 1 ? styles.testimonialCardAccent : ""}`}
          >
            <p className={styles.testimonialText}>“{t.body}”</p>
            <p className={styles.testimonialAuthor}>{t.name}{t.verified ? " · Verified" : ""}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Community;
