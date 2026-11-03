import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ReviewsSection.module.css";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PAGE_SIZE = 5;

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d < 1) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d} days ago`;
  const m = Math.floor(d / 30);
  if (m < 12) return `${m} month${m > 1 ? "s" : ""} ago`;
  const y = Math.floor(m / 12);
  return `${y} year${y > 1 ? "s" : ""} ago`;
};

export function Stars({ value, size = 16, interactive = false, onChange, onHover }) {
  return (
    <span className={styles.stars} style={{ fontSize: size }} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`${styles.star} ${n <= value ? styles.starOn : ""} ${interactive ? styles.starClickable : ""}`}
          onClick={interactive ? () => onChange?.(n) : undefined}
          onMouseEnter={interactive ? () => onHover?.(n) : undefined}
          onMouseLeave={interactive ? () => onHover?.(0) : undefined}
          role={interactive ? "button" : undefined}
          aria-label={interactive ? `${n} star${n > 1 ? "s" : ""}` : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsSection({ productId, productTitle, onSummary }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ count: 0, average: 0, breakdown: {} });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("recent");
  const [filterStar, setFilterStar] = useState(0);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const token = localStorage.getItem("bhava_token");
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("bhava_user") || "null");
  } catch {
    currentUser = null;
  }

  const load = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${productId}?sort=${sort}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setReviews(json.reviews);
        setSummary(json.summary);
        onSummary?.(json.summary);
      }
    } catch {
      /* keep empty state */
    } finally {
      setLoading(false);
    }
  }, [productId, sort, onSummary]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [sort, filterStar]);

  const openForm = () => {
    if (!token) {
      navigate("/auth", { state: { from: location.pathname } });
      return;
    }
    setFormOpen(true);
    setFormMsg({ type: "", text: "" });
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setFormMsg({ type: "error", text: "Please tap the stars to rate this product." });
      return;
    }
    if (body.trim().length < 10) {
      setFormMsg({ type: "error", text: "Please write at least 10 characters." });
      return;
    }
    setSubmitting(true);
    setFormMsg({ type: "", text: "" });
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${productId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, title, body }),
      });
      const json = await res.json();
      if (res.status === 401) {
        navigate("/auth", { state: { from: location.pathname } });
        return;
      }
      if (!res.ok || !json.success) {
        setFormMsg({ type: "error", text: json.message || "Could not save your review." });
      } else {
        setFormMsg({ type: "success", text: json.message });
        setRating(0);
        setTitle("");
        setBody("");
        setFormOpen(false);
        setSort("recent");
        setFilterStar(0);
        await load();
      }
    } catch {
      setFormMsg({ type: "error", text: "Unable to connect. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (reviewId) => {
    if (!window.confirm("Remove your review?")) return;
    try {
      const res = await fetch(`${API_BASE}/api/reviews/${productId}/${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) await load();
    } catch {
      /* ignore */
    }
  };

  const shown = (filterStar ? reviews.filter((r) => r.rating === filterStar) : reviews).slice(0, visible);
  const totalFiltered = filterStar ? reviews.filter((r) => r.rating === filterStar).length : reviews.length;
  const pct = (n) => (summary.count ? Math.round(((summary.breakdown?.[n] || 0) / summary.count) * 100) : 0);

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.header}>
        <span className={styles.kicker}>Voices of Devotion</span>
        <h2 className={styles.title}>Customer Reviews</h2>
      </div>

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.scoreBox}>
          <div className={styles.scoreNum}>{summary.count ? summary.average.toFixed(1) : "—"}</div>
          <Stars value={Math.round(summary.average)} size={20} />
          <div className={styles.scoreMeta}>
            {summary.count
              ? `Based on ${summary.count} review${summary.count > 1 ? "s" : ""}`
              : "No reviews yet"}
          </div>
        </div>

        <div className={styles.bars}>
          {[5, 4, 3, 2, 1].map((n) => (
            <button
              key={n}
              type="button"
              className={`${styles.barRow} ${filterStar === n ? styles.barRowActive : ""}`}
              onClick={() => setFilterStar(filterStar === n ? 0 : n)}
              disabled={!summary.count}
              title={`Show ${n}-star reviews`}
            >
              <span className={styles.barLabel}>{n} ★</span>
              <span className={styles.barTrack}>
                <span className={styles.barFill} style={{ width: `${pct(n)}%` }} />
              </span>
              <span className={styles.barCount}>{summary.breakdown?.[n] || 0}</span>
            </button>
          ))}
        </div>

        <div className={styles.ctaBox}>
          <p className={styles.ctaText}>
            {currentUser ? `Share your experience with ${productTitle}.` : "Sign in to share your experience."}
          </p>
          <button type="button" className={styles.writeBtn} onClick={formOpen ? () => setFormOpen(false) : openForm}>
            {formOpen ? "Cancel" : "Write a Review"}
          </button>
        </div>
      </div>

      {formMsg.text && !formOpen && (
        <p className={`${styles.msg} ${formMsg.type === "error" ? styles.msgError : styles.msgSuccess}`}>{formMsg.text}</p>
      )}

      {/* Form */}
      {formOpen && (
        <form className={styles.form} onSubmit={submit}>
          <div className={styles.formRow}>
            <label className={styles.label}>Your rating</label>
            <div className={styles.ratingPicker}>
              <Stars
                value={hoverRating || rating}
                size={30}
                interactive
                onChange={setRating}
                onHover={setHoverRating}
              />
              <span className={styles.ratingHint}>
                {["", "Poor", "Fair", "Good", "Very good", "Excellent"][hoverRating || rating] || "Tap to rate"}
              </span>
            </div>
          </div>
          <div className={styles.formRow}>
            <label className={styles.label} htmlFor="rv-title">Title <span>(optional)</span></label>
            <input
              id="rv-title"
              className={styles.input}
              maxLength={100}
              placeholder="Sum up your experience"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label} htmlFor="rv-body">Your review</label>
            <textarea
              id="rv-body"
              className={styles.textarea}
              rows={4}
              maxLength={2000}
              placeholder="What did you love? How did it feel in your daily practice?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          {formMsg.text && (
            <p className={`${styles.msg} ${formMsg.type === "error" ? styles.msgError : styles.msgSuccess}`}>{formMsg.text}</p>
          )}
          <div className={styles.formActions}>
            <span className={styles.postingAs}>Posting as <strong>{currentUser?.name}</strong></span>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* List */}
      <div className={styles.listHeader}>
        <span className={styles.listCount}>
          {filterStar ? `${totalFiltered} ${filterStar}-star review${totalFiltered !== 1 ? "s" : ""}` : `${summary.count} review${summary.count !== 1 ? "s" : ""}`}
          {filterStar ? (
            <button type="button" className={styles.clearFilter} onClick={() => setFilterStar(0)}>Clear</button>
          ) : null}
        </span>
        <label className={styles.sortWrap}>
          Sort by
          <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </label>
      </div>

      {loading ? (
        <p className={styles.empty}>Loading reviews…</p>
      ) : shown.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyMark}>✦</div>
          <p>
            {filterStar
              ? `No ${filterStar}-star reviews yet.`
              : "Be the first to share how this offering touched your practice."}
          </p>
        </div>
      ) : (
        <ul className={styles.list}>
          {shown.map((r) => (
            <li key={r.id} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.avatar}>{(r.name || "?").trim().charAt(0).toUpperCase()}</div>
                <div className={styles.who}>
                  <span className={styles.name}>
                    {r.name}
                    {r.verified && <span className={styles.verified}>✓ Verified Purchase</span>}
                  </span>
                  <span className={styles.date}>{timeAgo(r.createdAt)}</span>
                </div>
                <Stars value={r.rating} size={15} />
              </div>
              {r.title && <h4 className={styles.cardTitle}>{r.title}</h4>}
              <p className={styles.cardBody}>{r.body}</p>
              {currentUser && String(currentUser.id) === String(r.userId) && (
                <div className={styles.ownRow}>
                  <button type="button" className={styles.linkBtn} onClick={() => { setRating(r.rating); setTitle(r.title); setBody(r.body); setFormOpen(true); window.scrollTo({ top: document.getElementById("reviews").offsetTop - 80, behavior: "smooth" }); }}>
                    Edit
                  </button>
                  <button type="button" className={styles.linkBtn} onClick={() => remove(r.id)}>Delete</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {shown.length < totalFiltered && (
        <div className={styles.moreWrap}>
          <button type="button" className={styles.moreBtn} onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Show more reviews
          </button>
        </div>
      )}
    </section>
  );
}
