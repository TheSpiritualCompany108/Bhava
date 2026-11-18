import React, { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // eslint-disable-line no-unused-vars
import styles from "./HomeMain.module.css";
import { useHomepageSectionState, resolveHomepageImageUrl } from "../hooks/useHomepageSection";

const INTERVAL = 6000;

const fade = {
  enter: { opacity: 0 },
  center: { opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.6, ease: "easeIn" } },
};

function BannerImage({ slide, index, priority }) {
  const img = (
    <motion.img
      key={slide.id}
      src={slide.src}
      alt={slide.alt || `Bhava: banner ${index + 1}`}
      width={1897}
      height={620}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      draggable={false}
      className={styles.bannerImg}
      variants={fade}
      initial="enter"
      animate="center"
      exit="exit"
    />
  );
  if (!slide.link) return img;
  return /^https?:\/\//i.test(slide.link) ? (
    <a href={slide.link} target="_blank" rel="noopener noreferrer" className={styles.bannerLink}>{img}</a>
  ) : (
    <Link to={slide.link} className={styles.bannerLink}>{img}</Link>
  );
}

// Phones (≤768px) get the slide's separate mobile banner when the admin uploaded one
const MOBILE_QUERY = "(max-width: 768px)";
const subscribeMobile = (cb) => {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getIsMobile = () => window.matchMedia(MOBILE_QUERY).matches;

function HomeMain() {
  const [data, loaded] = useHomepageSectionState("heroBanner");
  const isMobile = useSyncExternalStore(subscribeMobile, getIsMobile, () => false);
  const [current, setCurrent] = useState(0);
  const touchX = useRef(null);

  // Only banners uploaded in Admin → Homepage → Hero / Top Banner are shown (in the admin's order).
  const adminSlides = (Array.isArray(data?.slides) ? data.slides : [])
    .filter((s) => s && s.image)
    .map((s) => {
      const mobileSrc = s.mobileImage ? resolveHomepageImageUrl(s.mobileImage) : "";
      return {
        id: s.id,
        src: isMobile && mobileSrc ? mobileSrc : resolveHomepageImageUrl(s.image),
        portrait: isMobile && !!mobileSrc, // phone artwork is taller than the wide desktop banner
        link: (s.link || "").trim(),
        alt: (s.alt || "").trim(),
      };
    });
  const slides = adminSlides;
  const count = slides.length;

  // The slide list can shrink (admin removed one) — keep `current` valid.
  const index = current < count ? current : 0;

  const go = useCallback((n) => setCurrent(((n % count) + count) % count), [count]);

  useEffect(() => {
    if (count < 2) return undefined;
    const t = setTimeout(() => go(index + 1), INTERVAL);
    return () => clearTimeout(t);
  }, [index, count, go]);

  const onTouchStart = (e) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
  };

  // Nothing uploaded yet → no banner at all (the page simply starts with the next section).
  if (loaded && count === 0) return <h1 className={styles.srOnly}>Bhava: — a simple daily ritual system for modern homes</h1>;

  return (
    <section className={styles.hero} aria-roledescription="carousel" aria-label="Bhava: highlights">
      <h1 className={styles.srOnly}>Bhava: — a simple daily ritual system for modern homes</h1>

      <div className={`${styles.stage} ${count > 0 && slides[index].portrait ? styles.stagePortrait : ""}`} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {/* Wait for the saved slides before painting */}
        {loaded && count > 0 && (
          <AnimatePresence initial={false}>
            <BannerImage key={slides[index].id} slide={slides[index]} index={index} priority={index === 0} />
          </AnimatePresence>
        )}

      </div>

      {loaded && count > 1 && (
        <div className={styles.sliderControls}>
          <button type="button" className={`${styles.navArrow} ${styles.navPrev}`} onClick={() => go(index - 1)} aria-label="Previous slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </button>
          <ul className={styles.slideDots}>
            {slides.map((s, i) => (
              <li key={s.id}>
                <button
                  type="button"
                  className={i === index ? styles.dotActive : styles.dot}
                  aria-label={`Go to slide ${i + 1}`}
                  aria-current={i === index}
                  onClick={() => go(i)}
                />
              </li>
            ))}
          </ul>
          <button type="button" className={`${styles.navArrow} ${styles.navNext}`} onClick={() => go(index + 1)} aria-label="Next slide">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </section>
  );
}

export default HomeMain;
