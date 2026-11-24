import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TrendingDetail.module.css";

const TrendingDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [tile, setTile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedLesson, setExpandedLesson] = useState(null);

  useEffect(() => {
    fetchTile();
  }, [slug]);

  const fetchTile = async () => {
    try {
      setLoading(true);
      setError("");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/tiles/${slug}`);
      const json = await res.json();
      if (res.ok && json.success) {
        setTile(json.data);
      } else {
        setError(json.message || "Teaching not found");
      }
    } catch (err) {
      console.error("Error fetching tile:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  const toggleLesson = (idx) =>
    setExpandedLesson((prev) => (prev === idx ? null : idx));

  if (loading) return <div className={styles.notFound}><div>Loading...</div></div>;
  if (error) return (
    <div className={styles.notFound}>
      <p>{error}</p>
      <button className={styles.backBtn} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
    </div>
  );
  if (!tile) return (
    <div className={styles.notFound}>
      <p>Teaching not found</p>
      <button className={styles.backBtn} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
    </div>
  );

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const imageUrl = tile.imageUrl
    ? (tile.imageUrl.startsWith("http") ? tile.imageUrl : `${API_BASE}${tile.imageUrl}`)
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.layout}>

        {/* ── LEFT PANEL ── */}
        <div className={styles.leftPanel}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>

          <h1 className={styles.title}>{tile.title}</h1>
          {tile.subtitle && <p className={styles.subtitleText}>{tile.subtitle}</p>}

          <div className={styles.imageCard}>
            {/* Blurred image bg — picks up card's colour palette naturally */}
            {imageUrl && (
              <div
                className={styles.imageCardBg}
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
            )}

            {/* Progress */}
            <div className={styles.progressRow}>
              <span className={styles.progressLabel}>Progress</span>
              <div className={styles.progressTrack}>
                <div className={styles.progressFill} />
              </div>
            </div>

            {/* Image */}
            {imageUrl && (
              <img loading="lazy" decoding="async" src={imageUrl} alt={tile.title} className={styles.heroImg} />
            )}

            {/* Controls */}
            <div className={styles.controls}>
              <button className={styles.controlBtn}>
                <span className={styles.controlIcon}>▶</span>
                <span className={styles.controlLabel}>Play</span>
              </button>
              <button className={styles.controlBtn}>
                <span className={styles.controlIcon}>♡</span>
                <span className={styles.controlLabel}>Save</span>
              </button>
              <button className={styles.controlBtn}>
                <span className={styles.controlIcon}>↗</span>
                <span className={styles.controlLabel}>Share</span>
              </button>
            </div>
          </div>

          {(tile.fullDescription || tile.summary) && (
            <p className={styles.description}>
              {tile.fullDescription || tile.summary}
            </p>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className={styles.rightWrapper}>
          {(tile.badgeText || tile.duration) && (
            <p className={styles.sessionsCount}>
              {[tile.badgeText, tile.duration].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className={styles.rightPanel}>
            {tile.lessons && tile.lessons.length > 0 ? (
              tile.lessons.map((lesson, idx) => (
                <div key={lesson.num} className={styles.sessionBlock}>
                  <button
                    className={styles.stageHeader}
                    onClick={() => toggleLesson(idx)}
                  >
                    <span className={styles.stageBadge}>
                      Session {lesson.num}
                    </span>
                    <div className={styles.stageHeaderInfo}>
                      <span className={styles.stageHeaderName}>{lesson.title}</span>
                      <span className={styles.stageHeaderDays}>{lesson.duration}</span>
                    </div>
                    <span className={styles.chevron}>
                      {expandedLesson === idx ? "▲" : "▼"}
                    </span>
                  </button>
                </div>
              ))
            ) : (
              (tile.fullDescription || tile.summary) && (
                <div className={styles.sessionBlock}>
                  <p className={styles.descriptionRight}>
                    {tile.fullDescription || tile.summary}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TrendingDetail;
