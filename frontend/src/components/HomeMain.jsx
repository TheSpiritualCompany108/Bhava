import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import styles from "./HomeMain.module.css";
import ScrollDown from "./ScrollDown";

const INTERVAL = 4500;

const slides = [
  { image: "./temple(4).png" },
  {
    image: "./Slide 01.png",
    title: ["A Daily Ritual.", "A Different Life."],
    description:
      "Eleven intentional minutes each day can create remarkable clarity over time. Bhava helps you build a practice that quietly becomes part of who you are.",
    cta: "Begin Your Ritual",
  },
  {
    image: "./Slide 02.png",
    title: ["Objects Made", "For Practice."],
    description:
      "Every Bhava object has one purpose: to support your daily rhythm with simplicity, beauty, and intention.",
    cta: "Explore Ritual Systems",
  },
  {
    image: "./Slide 03.png",
    title: ["Stay With", "The Practice."],
    description:
      "Guided journeys, reflections, and structured challenges help transform occasional devotion into lasting habits.",
    cta: "Explore Bhakti",
  },
  {
    image: "./Slide 04.png",
    title: ["Ancient Wisdom.", "Daily Life."],
    description:
      "Short reflections, timeless teachings, and practical guidance designed to accompany modern living.",
    cta: "Read Today's Reflection",
  },
  {
    image: "./Slide 05.png",
    title: ["Your Ritual,", "Supported Daily."],
    description:
      "Gentle reminders, progress tracking, and guided experiences that encourage consistency without distraction.",
    cta: "Explore the App",
  },
  {
    image: "./Slide 06.png",
    title: ["Practice Together.", "Grow Together."],
    description:
      "Quiet stories, shared experiences, and a community that values consistency over perfection.",
    cta: "Join Bhava",
  },
];

const textVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 0.9, 0.32, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  }),
};

const imageVariants = {
  enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 0.9, 0.32, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? -80 : 80,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
  }),
};

function HomeMain() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);

  const goTo = (next) => {
    setDir(next > current || (current === slides.length - 1 && next === 0) ? 1 : -1);
    setCurrent(next);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      goTo((current + 1) % slides.length);
    }, INTERVAL);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const slide = slides[current];

  return (
    <div className={styles.homeMainHero}>
      <AnimatePresence mode="wait" custom={dir}>
        <motion.img
          key={current}
          src={slide.image}
          alt="Temple Background"
          className={styles.homeMainHeroBgImage}
          custom={dir}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
        />
      </AnimatePresence>

      <div className={styles.homeMainContainer}>
        <AnimatePresence mode="wait" custom={dir}>
          {current === 0 ? (
            <motion.div
              key="hero"
              className={styles.homeMainTextLeft}
              custom={dir}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <h1 className={styles.homeMainHeroTitle}>
                <span className={styles.homeMainElevateText}> Awaken Bhava : Live Divine</span>
                <span className={styles.homeMainHighlight}>Every Day</span>
              </h1>

              <p className={styles.homeMainHeroDescription}>
                A  Simple  Daily  Ritual  System  For <br /> Modern Homes.
              </p>

              <p className={styles.homeMainHeroDescription1}> Ritual is not reserved for special occasions. <br /> It is the quiet return to yourself, every single day. </p>

              <div className={styles.homeMainHeroButtons}>
                <button className={styles.homeMainBtnPrimary}>Begin With Bhava</button>
                <button className={styles.homeMainBtnSecondary}>Explore the System</button>
              </div>

              <ul className={styles.trustPillars}>
                {["Designed for Daily Practice", "Crafted with Intention", "Guided Every Day"].map((label) => (
                  <li key={label}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                    {label}
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key={current}
              className={styles.homeMainTextLeft}
              custom={dir}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <p className={styles.slideLabel}>{slide.label}</p>
              <h2 className={styles.slideTitle}>
                {slide.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>
              <p className={styles.slideDescription}>{slide.description}</p>
              <button type="button" className={styles.slideCta}>
                <span className="material-symbols-outlined">arrow_right_alt</span>
                <span>{slide.cta}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <ul className={styles.slideDots}>
          {slides.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                className={i === current ? styles.dotActive : styles.dot}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => goTo(i)}
              />
            </li>
          ))}
        </ul>

        <ScrollDown />
      </div>
    </div>
  );
}

export default HomeMain;
