import React, { useState } from "react";
import styles from "./NotSureWhereToStart.module.css";

const plans = [
  {
    icon: "",
    iconBg: "#c0671e",
    title: "14 Days of Prayer",
    sub: "How to Pray",
    desc: "A transformative journey into the heart of devotion. Learn ancient prayer practices and connect deeply with the Divine.",
    joined: "23K joined",
    image: "/start1.png",
    gradient: "linear-gradient(135deg, #2a1a5a 0%, #6a1a4a 100%)",
  },
  {
    icon: "",
    iconBg: "#255c3f",
    title: "7-Day Meditation Reset",
    sub: "Stillness Practice",
    desc: "Recalibrate your mind and nervous system with seven days of guided ancient meditation techniques from the Yoga tradition.",
    joined: "41K joined",
    image: "/start2.png",
    gradient: "linear-gradient(135deg, #1a3a2a 0%, #0a2a3a 100%)",
  },
  {
    icon: "",
    iconBg: "#8B5E1a",
    title: "21-Day Mantra Initiation",
    sub: "Sacred Sound",
    desc: "Begin your mantra practice from scratch. Proper pronunciation, meaning, and daily commitment to 108 repetitions.",
    joined: "67K joined",
    image: "/start3.png",
    gradient: "linear-gradient(135deg, #3a2a0a 0%, #5a1a0a 100%)",
  },
  {
    icon: "",
    iconBg: "#9c2a3a",
    title: "Daily Puja Foundations",
    sub: "Ritual Basics",
    desc: "Set up your home altar and establish a daily puja practice that takes just 10 minutes but transforms the whole day.",
    joined: "89K joined",
    image: "/start4.png",
    gradient: "linear-gradient(135deg, #3a0a1a 0%, #1a0a3a 100%)",
  },
];

function NotSureWhereToStart() {
  const [current, setCurrent] = useState(0);

  const goPrev = () => setCurrent((p) => (p - 1 + plans.length) % plans.length);
  const goNext = () => setCurrent((p) => (p + 1) % plans.length);

  const plan = plans[current];

  return (
    <section className={styles.section}>
      <div className={styles.bg} />

      <div className={styles.header}>
        <div>
          <h2 className={styles.heading}>Not Sure Where to Start?</h2>
          <p className={styles.subheading}>
            Begin your spiritual journey with these guided experiences
          </p>
        </div>
      </div>

      <div className={styles.cardWrap}>
        <div className={styles.card} style={{ background: plan.gradient }}>
          {/* Left content */}
          <div className={styles.cardLeft}>
            <div className={styles.joinedBadge}>
              <span className={styles.joinedDot} />
              {plan.joined}
            </div>

            <div
              className={styles.iconBox}
              style={{ background: plan.iconBg }}
            >
              <span className={styles.iconEmoji}>{plan.icon}</span>
            </div>

            <h3 className={styles.cardTitle}>{plan.title}</h3>
            <p className={styles.cardSub}>{plan.sub}</p>
            <p className={styles.cardDesc}>{plan.desc}</p>

            <div className={styles.cardBtns}>
              <button className={styles.btnStart}>Start Plan</button>
              <button className={styles.btnDetails}>Details</button>
            </div>
          </div>

          {/* Right image */}
          <div className={styles.cardRight}>
            <img loading="lazy" decoding="async"
              src={plan.image}
              alt={plan.title}
              className={styles.cardImg}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            {/* Next arrow */}
            <button className={styles.nextArrow} onClick={goNext}>
              →
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          {plans.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NotSureWhereToStart;