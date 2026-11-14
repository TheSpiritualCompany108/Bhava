import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ReviewsSection.module.css";
import { getCustomerToken } from "../utils/customerAuth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PAGE_SIZE = 5;
const MAX_IMAGES = 4;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const imgUrl = (src) => {
  if (!src) return "";
  if (/^https?:\/\//i.test(src) || src.startsWith("blob:") || src.startsWith("data:")) return src;
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
};

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
  const filled = Math.round(Number(value) || 0);
  return (
    <span className={styles.stars} style={{ fontSize: size }} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`${styles.star} ${n <= filled ? styles.starOn : ""} ${interactive ? styles.starClickable : ""}`}
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
  const onSummaryRef = useRef(onSummary);
  onSummaryRef.current = onSummary;

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
  const [photos, setPhotos] = useState([]); // { file, preview }
  const [lightbox, setLightbox] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });
  const fileInputRef = useRef(null);

  const token = getCustomerToken();
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
      const res = await fetch(`${API_BASE}/api/reviews/${encodeURIComponent(productId)}?sort=${sort}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setReviews(json.reviews || []);
        setSummary(json.summary || { count: 0, average: 0, breakdown: {} });
        onSummaryRef.current?.(json.summary);
      }
    } catch {
      /* keep empty state */
    } finally {
      setLoading(false);
    }
  }, [productId, sort]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [sort, filterStar]);

  const clearPhotos = useCallback(() => {
    setPhotos((prev) => {
      prev.forEach((p) => URL.revokeObjectURL(p.preview));
      return [];
    });
  }, []);

  const openForm = () => {
    const customerToken = getCustomerToken();
    if (!customerToken) {
      navigate("/auth", {
        state: {
          from: location.pathname,
          info: "Sign in with your customer account to leave a review.",
        },
      });
      return;
    }
    setFormOpen(true);
    setFormMsg({ type: "", text: "" });
  };

  const closeForm = () => {
    setFormOpen(false);
    clearPhotos();
  };

  const onPickPhotos = (e) => {
    const picked = Array.from(e.target.files || []);
    e.target.value = "";
    if (!picked.length) return;
    setFormMsg({ type: "", text: "" });
    setPhotos((prev) => {
      const room = MAX_IMAGES - prev.length;
      if (room <= 0) {
        setFormMsg({ type: "error", text: `You can add up to ${MAX_IMAGES} photos.` });
        return prev;
      }
      const next = [...prev];
      for (const file of picked.slice(0, room)) {
        if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
          setFormMsg({ type: "error", text: "Photos must be JPG, PNG or WebP." });
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          setFormMsg({ type: "error", text: "Each photo must be under 5 MB." });
          continue;
        }
        next.push({ file, preview: URL.createObjectURL(file) });
      }
      return next;
    });
  };

  const removePhoto = (idx) => {
    setPhotos((prev) => {
      const copy = [...prev];
      const [gone] = copy.splice(idx, 1);
      if (gone?.preview) URL.revokeObjectURL(gone.preview);
      return copy;
    });
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
      const customerToken = getCustomerToken();
      if (!customerToken) {
        setFormMsg({
          type: "error",
          text: "Please sign in with your customer account to review.",
        });
        navigate("/auth", {
          state: {
            from: location.pathname,
            info: "Sign in with your customer account to leave a review.",
          },
        });
        return;
      }

      const fd = new FormData();
      fd.append("rating", String(rating));
      fd.append("title", title);
      fd.append("body", body);
      photos.forEach((p) => fd.append("images", p.file));

      const res = await fetch(`${API_BASE}/api/reviews/${encodeURIComponent(productId)}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${customerToken}` },
        body: fd,
      });
      const json = await res.json();
      if (res.status === 401) {
        navigate("/auth", { state: { from: location.pathname } });
        return;
      }
      if (res.status === 403) {
        setFormMsg({
          type: "error",
          text: json.message || "Please sign in with your customer account to review.",
        });
        return;
      }
      if (!res.ok || !json.success) {
        setFormMsg({ type: "error", text: json.message || "Could not save your review." });
      } else {
        setFormMsg({ type: "success", text: json.message });
        setRating(0);
        setTitle("");
        setBody("");
        clearPhotos();
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

  const myReview = currentUser
    ? reviews.find((r) => String(r.userId) === String(currentUser.id))
    : null;
  const alreadyReviewed = Boolean(myReview);

  const shown = (filterStar ? reviews.filter((r) => r.rating === filterStar) : reviews).slice(0, visible);
  const totalFiltered = filterStar ? reviews.filter((r) => r.rating === filterStar).length : reviews.length;
  const pct = (n) => (summary.count ? Math.round(((summary.breakdown?.[n] || 0) / summary.count) * 100) : 0);
  const avgLabel = summary.count ? summary.average.toFixed(2) : "0.00";

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.header}>
        <span className={styles.kicker}>Voices of Devotion</span>
        <h2 className={styles.title}>Customer Reviews</h2>
      </div>

      <div className={styles.summary}>
        <div className={styles.scoreBox}>
          <Stars value={summary.count ? summary.average : 0} size={20} />
          <div className={styles.scoreLine}>
            <strong>{avgLabel}</strong> out of 5
          </div>
          <div className={styles.scoreMeta}>
            Based on {summary.count} review{summary.count !== 1 ? "s" : ""}
            {summary.count > 0 && <span className={styles.metaCheck} aria-hidden>✓</span>}
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
              <Stars value={n} size={11} />
              <span className={styles.barTrack}>
                <span className={styles.barFill} style={{ width: `${pct(n)}%` }} />
              </span>
              <span className={styles.barCount}>{summary.breakdown?.[n] || 0}</span>
            </button>
          ))}
        </div>

        <div className={styles.ctaBox}>
          {alreadyReviewed ? (
            <p className={styles.alreadyNote}>You already reviewed this product.</p>
          ) : (
            <button type="button" className={styles.writeBtn} onClick={formOpen ? closeForm : openForm}>
              {formOpen ? "Cancel" : "Write a review"}
            </button>
          )}
        </div>
      </div>

      {formMsg.text && !formOpen && (
        <p className={`${styles.msg} ${formMsg.type === "error" ? styles.msgError : styles.msgSuccess}`}>{formMsg.text}</p>
      )}

      {formOpen && !alreadyReviewed && (
        <form className={styles.form} onSubmit={submit}>
          <div className={styles.formRow}>
            <label className={styles.label}>Your rating</label>
            <div className={styles.ratingPicker}>
              <Stars value={hoverRating || rating} size={30} interactive onChange={setRating} onHover={setHoverRating} />
              <span className={styles.ratingHint}>
                {["", "Poor", "Fair", "Good", "Very good", "Excellent"][hoverRating || rating] || "Tap to rate"}
              </span>
            </div>
          </div>
          <div className={styles.formRow}>
            <label className={styles.label} htmlFor="rv-title">
              Title <span>(optional)</span>
            </label>
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
            <label className={styles.label} htmlFor="rv-body">
              Your review
            </label>
            <textarea
              id="rv-body"
              className={styles.textarea}
              rows={4}
              maxLength={2000}
              placeholder={`What did you love about ${productTitle || "this product"}?`}
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>
              Photos <span>optional · up to {MAX_IMAGES}</span>
            </label>
            <div className={styles.photoRow}>
              {photos.map((p, i) => (
                <div key={p.preview} className={styles.photoThumb}>
                  <img src={p.preview} alt={`Upload preview ${i + 1}`} />
                  <button type="button" className={styles.photoRemove} onClick={() => removePhoto(i)} aria-label="Remove photo">
                    ×
                  </button>
                </div>
              ))}
              {photos.length < MAX_IMAGES && (
                <button
                  type="button"
                  className={styles.photoAdd}
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Add photos"
                >
                  <span aria-hidden>+</span>
                  Add photo
                </button>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              hidden
              onChange={onPickPhotos}
            />
          </div>
          {formMsg.text && (
            <p className={`${styles.msg} ${formMsg.type === "error" ? styles.msgError : styles.msgSuccess}`}>{formMsg.text}</p>
          )}
          <div className={styles.formActions}>
            <span className={styles.postingAs}>
              Posting as <strong>{currentUser?.name}</strong>
            </span>
            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      <div className={styles.listHeader}>
        <label className={styles.sortWrap}>
          <select className={styles.sortSelect} value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort reviews">
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </label>
        {filterStar ? (
          <button type="button" className={styles.clearFilter} onClick={() => setFilterStar(0)}>
            Clear {filterStar}-star filter
          </button>
        ) : null}
      </div>

      {loading ? (
        <p className={styles.empty}>Loading reviews…</p>
      ) : shown.length === 0 ? (
        <div className={styles.empty}>
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
              <div className={styles.cardMeta}>
                <Stars value={r.rating} size={16} />
                <span className={styles.date}>{timeAgo(r.createdAt)}</span>
              </div>
              <div className={styles.who}>
                <span className={styles.userIcon} aria-hidden>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </span>
                <span className={styles.name}>{r.name}</span>
                {r.verified && <span className={styles.verified}>Verified</span>}
              </div>
              {r.title && <h4 className={styles.cardTitle}>{r.title}</h4>}
              <p className={styles.cardBody}>{r.body}</p>
              {Array.isArray(r.images) && r.images.length > 0 && (
                <div className={styles.reviewGallery}>
                  {r.images.map((src, i) => (
                    <button
                      key={`${r.id}-${i}`}
                      type="button"
                      className={styles.reviewThumb}
                      onClick={() => setLightbox(imgUrl(src))}
                      aria-label={`Open review photo ${i + 1}`}
                    >
                      <img src={imgUrl(src)} alt="" loading="lazy" />
                    </button>
                  ))}
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

      {lightbox && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label="Review photo" onClick={() => setLightbox("")}>
          <button type="button" className={styles.lightboxClose} aria-label="Close" onClick={() => setLightbox("")}>
            ×
          </button>
          <img src={lightbox} alt="Review photo" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  );
}
