import React, { useRef, useState } from "react";
import styles from "./CommunityVoicesAndAncientVerses.module.css";

/* ─── Community Voices ─── */
const voices = [
  {
    quote: "Bhava: helps me stay rooted in my dharma, reminds me of the eternal truths that shape my inner world even while navigating modern life.",
    name: "Priya",
    date: "February 3, 2026",
    gradient: "linear-gradient(135deg, rgba(60,20,80,0.75) 0%, rgba(120,40,60,0.65) 100%)",
    quoteColor: "#9a6ae0",
  },
  {
    quote: "Through Bhava:'s teachings, I've discovered the profound connection between ancient wisdom and my everyday challenges. It's transformative.",
    name: "Arjun",
    date: "January 28, 2026",
    gradient: "linear-gradient(135deg, rgba(20,40,80,0.75) 0%, rgba(20,80,100,0.65) 100%)",
    quoteColor: "#6a9ae0",
  },
  {
    quote: "The depth of knowledge presented here is unmatched. Bhava: makes the complex teachings of our tradition accessible and meaningful.",
    name: "Lakshmi",
    date: "February 1, 2026",
    gradient: "linear-gradient(135deg, rgba(80,40,10,0.75) 0%, rgba(120,80,10,0.65) 100%)",
    quoteColor: "#e0a030",
  },
  {
    quote: "Every morning I begin with Bhava:. The mantras and teachings have created a stillness in me that I carry throughout the entire day.",
    name: "Rohan",
    date: "January 20, 2026",
    gradient: "linear-gradient(135deg, rgba(10,60,40,0.75) 0%, rgba(20,80,60,0.65) 100%)",
    quoteColor: "#40c080",
  },
  {
    quote: "I grew up disconnected from my Hindu roots. Bhava: brought me back — gently, beautifully, and with so much wisdom and love.",
    name: "Meera",
    date: "February 8, 2026",
    gradient: "linear-gradient(135deg, rgba(60,10,60,0.75) 0%, rgba(100,20,80,0.65) 100%)",
    quoteColor: "#c060c0",
  },
  {
    quote: "As a seeker new to Vedanta, I was overwhelmed. Bhava: broke everything down in a way that felt profound yet completely practical.",
    name: "Dev",
    date: "January 15, 2026",
    gradient: "linear-gradient(135deg, rgba(20,20,60,0.75) 0%, rgba(40,40,100,0.65) 100%)",
    quoteColor: "#7080e0",
  },
];

/* ─── Ancient Verses ─── */
const verses = [
  {
    quote: '"From the unreal, lead me to the Real. From darkness, lead me to Light. From death, lead me to Immortality."',
    source: "BṚHADĀRAṆYAKA UPANIṢAD 1.3.28",
  },
  {
    quote: '"Tat tvam asi — That thou art. The Self within you is the same as the Ultimate Reality pervading all existence."',
    source: "CHĀNDOGYA UPANIṢAD 6.8.7",
  },
  {
    quote: '"Ayam ātmā brahma — This Self is Brahman. The individual soul and the universal soul are ultimately one and the same."',
    source: "MĀṆḌUKYA UPANIṢAD 1.2",
  },
  {
    quote: '"Ekam sat viprā bahudhā vadanti — Truth is one; the wise call it by many names."',
    source: "ṚGVEDA 1.164.46",
  },
  {
    quote: '"Know the Self as the lord of the chariot, and the body as the chariot. Know the intellect as the charioteer."',
    source: "KAṬHA UPANIṢAD 1.3.3",
  },
];

function CommunityVoicesAndAncientVerses() {
  const voicesRef = useRef(null);
  const versesRef = useRef(null);
  const [voicesScroll,  setVoicesScroll]  = useState(0);
  const [verseIdx,      setVerseIdx]      = useState(0);
  const [voicesHovered, setVoicesHovered] = useState(false);

  const handleScroll = (ref, setter) => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setter(max > 0 ? el.scrollLeft / max : 0);
  };

  const scrollVoicesLeft  = () => voicesRef.current?.scrollBy({ left: -480, behavior: "smooth" });
  const scrollVoicesRight = () => voicesRef.current?.scrollBy({ left: 480,  behavior: "smooth" });

  const voicesAtStart   = voicesScroll === 0;
  const voicesAtEnd     = voicesScroll >= 0.99;
  const showVoicesLeft  = voicesHovered && !voicesAtStart;
  const showVoicesRight = voicesHovered && !voicesAtEnd;

  const prevVerse = () => setVerseIdx((i) => (i - 1 + verses.length) % verses.length);
  const nextVerse = () => setVerseIdx((i) => (i + 1) % verses.length);

  return (
    <>
      {/* ══ Community Voices ══ */}
      <section className={styles.voicesSection}>
        <div className={styles.bg} />

        <div className={styles.voicesHeader}>
          <h2 className={styles.voicesHeading}>Community Voices</h2>
        </div>

        <div
          className={styles.voicesWrapper}
          onMouseEnter={() => setVoicesHovered(true)}
          onMouseLeave={() => setVoicesHovered(false)}
        >
          <button
            className={`${styles.voicesArrowBtn} ${showVoicesLeft ? styles.voicesArrowVisible : styles.voicesArrowHidden}`}
            onClick={scrollVoicesLeft}
            aria-label="Scroll left"
          >
            ‹
          </button>

          <div
            className={styles.voicesTrack}
            ref={voicesRef}
            onScroll={() => handleScroll(voicesRef, setVoicesScroll)}
          >
            {voices.map((v, i) => (
              <div key={i} className={styles.voiceCard} style={{ background: v.gradient }}>
                <div className={styles.voiceCardBg} />
                <div className={styles.quoteIcon} style={{ color: v.quoteColor }}>"</div>
                <p className={styles.voiceQuote}>{v.quote}</p>
                <div className={styles.voiceAuthor}>
                  <strong className={styles.voiceName}>{v.name}</strong>
                  <span className={styles.voiceDate}>{v.date}</span>
                </div>
              </div>
            ))}
          </div>

          <button
            className={`${styles.voicesArrowBtn} ${showVoicesRight ? styles.voicesArrowVisible : styles.voicesArrowHidden}`}
            onClick={scrollVoicesRight}
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${Math.max(voicesScroll * 100, 12)}%` }} />
        </div>
      </section>

      {/* ══ Ancient Verses ══ */}
      <section className={styles.versesSection}>
        <div className={styles.bg} />

        <div className={styles.versesHeader}>
          <h2 className={styles.versesHeading}>Ancient Verses</h2>
          <p className={styles.versesSubheading}>Wisdom from the Upanishads</p>
        </div>

        <div className={styles.verseWrap}>
          <div className={styles.verseCard}>
            <div className={styles.verseCardBg} />
            <div className={styles.verseQuoteIcon}>"</div>
            <p className={styles.verseQuote}>{verses[verseIdx].quote}</p>
            <div className={styles.verseDivider} />
            <span className={styles.verseSource}>{verses[verseIdx].source}</span>
          </div>

          {/* Next arrow — at right edge of verseWrap */}
          <button className={styles.verseNextArrow} onClick={nextVerse}>›</button>

          {/* Dots */}
          <div className={styles.verseDots}>
            {verses.map((_, i) => (
              <button
                key={i}
                className={`${styles.verseDot} ${i === verseIdx ? styles.verseDotActive : ""}`}
                onClick={() => setVerseIdx(i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default CommunityVoicesAndAncientVerses;