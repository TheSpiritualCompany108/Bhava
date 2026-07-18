import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import { useNavigate } from "react-router-dom";
import styles from "./HeroCarousel.module.css";

const INTERVAL = 5000;

const slides = [
  {
    label: "Daily Ritual",
    title: ["A Daily Ritual.", "A Different Life."],
    description:
      "Eleven intentional minutes each day can create remarkable clarity over time. Bhava helps you build a practice that quietly becomes part of who you are.",
    cta: "Begin Your Ritual",
    route: "/products",
  },
  {
    label: "Sacred Objects",
    title: ["Objects Made", "For Practice."],
    description:
      "Every Bhava object has one purpose: to support your daily rhythm with simplicity, beauty, and intention.",
    cta: "Explore Ritual Systems",
    route: "/products",
  },
  {
    label: "Guided Practices",
    title: ["Stay With", "The Practice."],
    description:
      "Guided journeys, reflections, and structured challenges help transform occasional devotion into lasting habits.",
    cta: "Explore Bhakti",
    route: "/knowledge",
  },
  {
    label: "Daily Reflections",
    title: ["Ancient Wisdom.", "Daily Life."],
    description:
      "Short reflections, timeless teachings, and practical guidance designed to accompany modern living.",
    cta: "Read Today's Reflection",
    route: "/knowledge",
  },
  {
    label: "Bhava App",
    title: ["Your Ritual,", "Supported Daily."],
    description:
      "Gentle reminders, progress tracking, and guided experiences that encourage consistency without distraction.",
    cta: "Explore the App",
    route: "/app",
  },
  {
    label: "Community",
    title: ["Practice Together.", "Grow Together."],
    description:
      "Quiet stories, shared experiences, and a community that values consistency over perfection.",
    cta: "Join Bhava",
    route: "/community",
  },
];

const variants = {
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

const ChevronLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function HeroCarousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState(1);
  const isPaused = useRef(false);

  const go = (next) => {
    setDir(next > current || (current === slides.length - 1 && next === 0) ? 1 : -1);
    setCurrent(next);
  };

  const prev = () => go((current - 1 + slides.length) % slides.length);
  const next = () => go((current + 1) % slides.length);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isPaused.current) return;
      setCurrent((c) => {
        setDir(1);
        return (c + 1) % slides.length;
      });
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section
      className={styles.section}
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
    >
      <img src="./temple(4).png" alt="" className={styles.bgImage} aria-hidden />
      <div className={styles.overlay} aria-hidden />

      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous">
        <ChevronLeft />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next">
        <ChevronRight />
      </button>

      <div className={styles.inner}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={current}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className={styles.content}
          >
            <p className={styles.label}>{slide.label}</p>
            <h2 className={styles.title}>
              {slide.title.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <p className={styles.description}>{slide.description}</p>
            <button className={styles.cta} onClick={() => navigate(slide.route)}>
              {slide.cta}
              <span className={styles.ctaArrow}>→</span>
            </button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={styles.dots}>
        {slides.map((s, i) => (
          <button
            key={s.label}
            className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}: ${s.label}`}
          />
        ))}
      </div>
    </section>
  );
}

export default HeroCarousel;
