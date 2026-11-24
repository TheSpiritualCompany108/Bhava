import React, { useRef, useState } from "react";
import styles from "./CampaignsForYou.module.css";

const campaigns = [
  {
    creator: "Swami @VedantaPath",
    creatorIcon: "",
    creatorBg: "#3a2a6a",
    contentIcon: "",
    contentBg: "#3a2a6a",
    title: "For Peace in Troubled Lands",
    day: "Day 4 of 7",
    image: "/campaign1.png",
    gradient: "linear-gradient(135deg, #1a1a4a 0%, #3a1a4a 100%)",
    titleColor: "#ffffff",
  },
  {
    creator: "Pandit @SanskritWisdom",
    creatorIcon: "",
    creatorBg: "#6a2a1a",
    contentIcon: "",
    contentBg: "#6a2a1a",
    title: "For Those Suffering Illness",
    day: "Day 6 of 9",
    image: "/campaign2.png",
    gradient: "linear-gradient(135deg, #5a1a0a 0%, #3a0a0a 100%)",
    titleColor: "#f59e42",
  },
  {
    creator: "Guru @DharmicLife",
    creatorIcon: "",
    creatorBg: "#1a4a3a",
    contentIcon: "",
    contentBg: "#1a4a3a",
    title: "For Environmental Healing",
    day: "Day 2 of 5",
    image: "/campaign3.png",
    gradient: "linear-gradient(135deg, #0a3a3a 0%, #0a2a2a 100%)",
    titleColor: "#ffffff",
  },
  {
    creator: "Swami @KrishnaPath",
    creatorIcon: "",
    creatorBg: "#4a2a5a",
    contentIcon: "",
    contentBg: "#4a2a5a",
    title: "For World Peace & Unity",
    day: "Day 1 of 10",
    image: "/campaign4.png",
    gradient: "linear-gradient(135deg, #2a1a4a 0%, #1a1a3a 100%)",
    titleColor: "#ffffff",
  },
];

function CampaignsForYou() {
  const trackRef = useRef(null);
  const [scrollPos, setScrollPos] = useState(0);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setScrollPos(max > 0 ? el.scrollLeft / max : 0);
  };

  const scrollRight = () =>
    trackRef.current?.scrollBy({ left: 760, behavior: "smooth" });

  return (
    <section className={styles.section}>
      <div className={styles.bg} />

      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Campaigns for You</h2>
          <p className={styles.subheading}>Community prayers for global healing</p>
        </div>
        <button className={styles.seeAll}>See All →</button>
      </div>

      <div className={styles.track} data-scroll-container-id="campaigns-track" ref={trackRef} onScroll={handleScroll}>
        {campaigns.map((c, i) => (
          <div key={i} className={styles.card}>
            {/* Left panel */}
            <div className={styles.cardLeft} style={{ background: c.gradient }}>
              <div className={styles.creatorRow}>
                <div
                  className={styles.creatorAvatar}
                  style={{ background: c.creatorBg }}
                >
                  {c.creatorIcon}
                </div>
                <span className={styles.creatorName}>
                  Created by {c.creator}
                </span>
              </div>

              <div
                className={styles.contentIconBox}
                style={{ background: c.contentBg }}
              >
                <span className={styles.contentIconEmoji}>{c.contentIcon}</span>
              </div>

              <h3
                className={styles.cardTitle}
                style={{ color: c.titleColor }}
              >
                {c.title}
              </h3>

              <span className={styles.dayBadge}>{c.day}</span>

              <button className={styles.detailsBtn}>Details</button>
            </div>

            {/* Right image */}
            <div className={styles.cardRight}>
              <img loading="lazy" decoding="async"
                src={c.image}
                alt={c.title}
                className={styles.cardImg}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              {/* Arrow on last visible card */}
              {i === campaigns.length - 1 && (
                <button className={styles.nextArrow} onClick={scrollRight}>→</button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${Math.max(scrollPos * 100, 18)}%` }}
        />
      </div>
    </section>
  );
}

export default CampaignsForYou;