import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./TileDetail.module.css";

const TileDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tile, setTile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSessions, setOpenSessions] = useState({});

  const toggleSession = (num) => {
    setOpenSessions((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  useEffect(() => {
    fetchTile();
  }, [id]);

  const fetchTile = async () => {
    try {
      setLoading(true);
      setError("");
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const url = `${API_BASE}/api/tiles/${id}`;
      const res = await fetch(url);
      const json = await res.json();

      if (res.ok && json.success) {
        setTile(json.data);
      } else {
        setError(json.message || "Tile not found");
      }
    } catch (err) {
      console.error("Error fetching tile:", err);
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.notFound}><div>Loading...</div></div>;
  if (error) return (
    <div className={styles.notFound}>
      <p>{error}</p>
      <button className={styles.backBtn} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
    </div>
  );
  if (!tile) return (
    <div className={styles.notFound}>
      <p>Tile not found</p>
      <button className={styles.backBtn} onClick={() => navigate("/knowledge")}>← Back to Knowledge</button>
    </div>
  );

  return (
    <div className={styles.detailPage}>
      {/* Hero Section - left card + right sessions */}
      <div className={styles.detailHero}>
        <div className={styles.heroOverlay}></div>

        <div className={styles.heroSplit} style={{ display: 'flex', alignItems: 'flex-start', gap: '48px' }}>

          {/* Left column: title/meta above card */}
          <div className={styles.heroCardWrap}>
            <button className={styles.backBtn} onClick={() => navigate(-1)}>
              ← Back
            </button>
            {tile.category && <div className={styles.heroSub}>{tile.category}</div>}
            <h1 className={styles.heroTitle}>{tile.title}</h1>
            {tile.duration && (
              <div className={styles.heroMeta}>
                <span>{tile.duration}</span>
                {tile.badgeText && (
                  <>
                    <span className={styles.dot}>•</span>
                    <span>{tile.badgeText}</span>
                  </>
                )}
              </div>
            )}

            <div className={styles.heroCardInnerWrap}>
              <div className={styles.heroCardBox}>
                <div className={styles.cardTop}>
                  <span className={styles.progressLabel}>Progress</span>
                  <div className={styles.cardProgressWrap}>
                    <div className={styles.cardProgress} style={{width: '28%'}} />
                  </div>
                </div>

                {tile.imageUrl && (
                  <img loading="lazy" decoding="async"
                    src={tile.imageUrl.startsWith('http') ? tile.imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${tile.imageUrl}`}
                    alt={tile.title}
                    className={styles.cardImage}
                  />
                )}

                <div className={styles.cardFooterDark}>
                  <div className={styles.cardActionsCol}>
                    <button className={styles.iconBtn} aria-label="Play">▶</button>
                    <div className={styles.iconLabel}>Play</div>
                  </div>
                  <div className={styles.cardActionsCol}>
                    <button className={styles.iconBtn} aria-label="Save">♡</button>
                    <div className={styles.iconLabel}>Save</div>
                  </div>
                  <div className={styles.cardActionsCol}>
                    <button className={styles.iconBtn} aria-label="Share">⤴</button>
                    <div className={styles.iconLabel}>Share</div>
                  </div>
                </div>
              </div>

              {tile.fullDescription && (
                <p className={styles.heroDescription}>{tile.fullDescription}</p>
              )}
            </div>
          </div>

          {/* Right column: sessions list */}
          <div className={styles.heroSessionsPanel}>
            <div className={styles.sessionsHeader}>
              <p className={styles.sessionsCount}>{tile.lessons ? `${tile.lessons.length} sessions · ${tile.duration || ''}` : ''}</p>
            </div>

            {tile.lessons && tile.lessons.length > 0 && (
              <div className={styles.sessionsList}>
                {tile.lessons.map((lesson) => (
                  <div
                    key={lesson.num}
                    className={styles.sessionItem}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSession(lesson.num)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') toggleSession(lesson.num);
                    }}
                  >
                    <span className={styles.sessionBadge}>Session {lesson.num}</span>
                    <span className={styles.sessionTitle}>{lesson.title}</span>
                    <span className={styles.sessionDuration}>{lesson.duration}</span>
                    <button
                      className={styles.sessionToggle}
                      aria-expanded={!!openSessions[lesson.num]}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSession(lesson.num);
                      }}
                    >
                      {openSessions[lesson.num] ? '▲' : '▼'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Body Section */}
      {/* <div className={styles.detailBody}>
        <div className={styles.detailContainer}>
          {tile.fullDescription && (
            <div className={styles.detailDescription}>
              {tile.fullDescription}
            </div>
          )} */}

          {/* {tile.lessons && tile.lessons.length > 0 && (
            <>
              <h2 className={styles.lessonsHeading}>Sessions</h2>
              <div className={styles.lessonsList}>
                {tile.lessons.map((lesson) => (
                  <div key={lesson.num} className={styles.lessonItem}>
                    <span className={styles.lessonNum}>{String(lesson.num).padStart(2, "0")}</span>
                    <span className={styles.lessonTitle}>{lesson.title}</span>
                    <span className={styles.lessonDuration}>{lesson.duration}</span>
                  </div>
                ))}
              </div>
            </>
          )} */}

          {/* {tile.summary && !tile.fullDescription && (
            <div className={styles.detailDescription}>
              {tile.summary}
            </div>
          )} */}
        </div>
      // </div>
    // </div>
  );
};

export default TileDetail;
