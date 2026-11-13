import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Community.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

const productLabel = (slug = "") =>
  String(slug)
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "B";

function Stars({ value }) {
  const filled = Math.round(Number(value) || 0);
  return (
    <span className={styles.stars} aria-label={`${filled} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= filled ? styles.starOn : styles.starOff} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewCard({ review, featured = false }) {
  return (
    <article className={`${styles.card} ${featured ? styles.cardFeatured : ""}`}>
      <div className={styles.cardTop}>
        <span className={styles.quoteMark} aria-hidden="true">
          “
        </span>
        <Stars value={review.rating} />
      </div>

      {review.title ? <h3 className={styles.cardTitle}>{review.title}</h3> : null}

      <p className={styles.cardBody}>{review.body}</p>

      <div className={styles.cardMeta}>
        <div className={styles.avatar} aria-hidden="true">
          {initials(review.name)}
        </div>
        <div className={styles.metaText}>
          <p className={styles.author}>{review.name}</p>
          <div className={styles.metaRow}>
            {review.verified && (
              <span className={styles.verified}>
                <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0Zm3.4 5.8-3.6 4.4a.7.7 0 0 1-1.05.05L4.7 8.2a.7.7 0 1 1 1-1l1.5 1.5 3.1-3.8a.7.7 0 0 1 1.1.9Z"
                  />
                </svg>
                Verified ritual
              </span>
            )}
            {review.productId ? (
              <Link className={styles.productLink} to={`/product/${review.productId}`}>
                {productLabel(review.productId)}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function Community() {
  const [reviews, setReviews] = useState(null);
  const [summary, setSummary] = useState({ count: 0, average: 0 });

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE}/api/reviews?verified=1&limit=6`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        if (j.success) {
          setReviews(j.reviews || []);
          setSummary(j.summary || { count: (j.reviews || []).length, average: 0 });
        } else {
          setReviews([]);
        }
      })
      .catch(() => {
        if (!cancelled) setReviews([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { featured, rest } = useMemo(() => {
    if (!reviews?.length) return { featured: null, rest: [] };
    // Prefer unique voices on the homepage (no repeated name/body)
    const seen = new Set();
    const unique = [];
    const sorted = [...reviews].sort(
      (a, b) => (b.rating || 0) - (a.rating || 0) || String(b.body || "").length - String(a.body || "").length,
    );
    for (const r of sorted) {
      const key = `${String(r.name || "").toLowerCase()}|${String(r.body || "").slice(0, 48).toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      unique.push(r);
      if (unique.length >= 5) break;
    }
    return { featured: unique[0] || null, rest: unique.slice(1) };
  }, [reviews]);

  if (!reviews || reviews.length === 0) return null;

  const avg = summary.average || featured?.rating || 5;
  const count = summary.count || reviews.length;

  return (
    <section className={styles.section} aria-labelledby="home-reviews">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.wrap}>
        <header className={styles.header}>
          <p className={styles.kicker}>Lived rituals · Verified voices</p>
          <h2 id="home-reviews" className={styles.title}>
            From Those Who Keep Bhava Close
          </h2>
          <p className={styles.sub}>
            Quiet mornings. Soft smoke. A house that feels a little more sacred — in their own words.
          </p>

          <div className={styles.trustBar} role="group" aria-label="Review trust summary">
            <div className={styles.trustItem}>
              <Stars value={avg} />
              <span className={styles.trustNum}>{Number(avg).toFixed(1)}</span>
              <span className={styles.trustLabel}>average devotion</span>
            </div>
            <span className={styles.trustDivider} aria-hidden="true" />
            <div className={styles.trustItem}>
              <span className={styles.trustNum}>{count}+</span>
              <span className={styles.trustLabel}>verified reflections</span>
            </div>
            <span className={styles.trustDivider} aria-hidden="true" />
            <div className={styles.trustItem}>
              <span className={styles.trustSeal}>✦</span>
              <span className={styles.trustLabel}>from real Bhava orders</span>
            </div>
          </div>
        </header>

        <div className={styles.layout}>
          {featured && <ReviewCard review={featured} featured />}
          <div className={styles.grid}>
            {rest.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Community;
