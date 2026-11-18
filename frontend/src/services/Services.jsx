import { useEffect, useRef, useState } from "react";
import styles from "./Services.module.css";
import ServiceBookingModal from "./ServiceBookingModal";

const services = [
  {
    id: 0,
    icon: "✦",
    tag: "PUJA BOOKING",
    title: "Book a Sacred Puja",
    description:
      "Schedule a traditional puja performed by verified temple priests. Choose from Ganesh Puja, Satyanarayan, Rudrabhishek, and 40+ more rituals performed live or on your behalf.",
    price: "Starting ₹999",
    img: "/Explore Sacred Wisdom/Puja Rituals.png",
    highlight: false,
  },
  {
    id: 1,
    icon: "✦",
    tag: "LIVE DARSHAN",
    title: "Virtual Temple Darshan",
    description:
      "Experience live streaming from 200+ sacred temples across India — Tirupati, Kashi Vishwanath, Shirdi, and more. Get prasad delivered home after every darshan.",
    price: "Starting ₹199",
    img: "/Temple Blessed.png",
    highlight: false,
  },
  {
    id: 2,
    icon: "✦",
    tag: "ASTROLOGY",
    title: "Jyotish Consultation",
    description:
      "One-on-one sessions with expert Vedic astrologers. Get personalised kundali analysis, muhurta selection, remedies, gemstone advice and yearly guidance.",
    price: "Starting ₹1,499",
    img: "/astrology calculator.png",
    highlight: true,
  },
  {
    id: 3,
    icon: "✦",
    tag: "COACHING",
    title: "1-on-1 Sadhana Coaching",
    description:
      "Weekly personal sessions with experienced spiritual teachers. Build a custom daily sadhana — pranayama, mantra, dhyana, and lifestyle aligned with your constitution.",
    price: "Starting ₹2,499",
    img: "/Timeless Wisdom/Meditation Guide.png",
    highlight: false,
  },
  {
    id: 4,
    icon: "✦",
    tag: "PILGRIMAGE",
    title: "Sacred Yatra Planning",
    description:
      "Fully curated pilgrimage packages to Char Dham, Kashi, Vrindavan, Tirupati, and Ashtavinayak. Includes transport, stay, guide, and ritual access.",
    price: "Starting ₹8,999",
    img: "/Explore Sacred Wisdom/Temple Traditions.png",
    highlight: false,
  },
  {
    id: 5,
    icon: "✦",
    tag: "SUBSCRIPTION",
    title: "Monthly Ritual Box",
    description:
      "A curated box of 8–12 authentic spiritual products delivered monthly — incense, oils, malas, sacred texts, and seasonal items sourced from temple artisans.",
    price: "Starting ₹899/mo",
    img: "/Learning Paths/Yoga Philosophy.png",
    highlight: false,
  },
];

const steps = [
  {
    num: "01",
    title: "Choose Your Service",
    desc: "Browse our curated spiritual services and select what resonates with your current journey.",
  },
  {
    num: "02",
    title: "Book & Personalise",
    desc: "Pick a time, share intentions and preferences — our team tailors every experience for you.",
  },
  {
    num: "03",
    title: "Receive Sacred Blessings",
    desc: "Attend live or receive recordings, prasad, and follow-up guidance after every session.",
  },
];

const stats = [
  { number: "50K+", label: "Pujas Performed" },
  { number: "200+", label: "Temple Partners" },
  { number: "98%", label: "Devotee Satisfaction" },
  { number: "12+", label: "Years of Tradition" },
];

function Services() {
  const [booking, setBooking] = useState(null);
  const [active, setActive] = useState(0);
  const gridRef = useRef(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return undefined;

    const onScroll = () => {
      const card = el.querySelector(`.${styles.card}`);
      if (!card) return;
      const gap = 16;
      const step = card.offsetWidth + gap;
      const next = Math.round(el.scrollLeft / step);
      setActive(Math.max(0, Math.min(services.length - 1, next)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const goTo = (i) => {
    const el = sliderRef.current;
    if (!el) return;
    const card = el.querySelector(`.${styles.card}`);
    if (!card) return;
    el.scrollTo({ left: i * (card.offsetWidth + 16), behavior: "smooth" });
    setActive(i);
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>BHAVA: SACRED SERVICES</p>
        <h1 className={styles.heroTitle}>
          Spiritual <span className={styles.accent}>Services</span>
        </h1>
        <p className={styles.heroSub}>
          Authentic Vedic services connecting you to temples, priests and
          teachers across India — from your home or in person.
        </p>
      </div>

      <div className={styles.statsStrip}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <span className={styles.statNum}>{s.number}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className={styles.container} ref={gridRef}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What We Offer</h2>
          <p className={styles.sectionSub}>
            Six sacred pathways to deepen your spiritual practice
          </p>
        </div>

        <div className={styles.sliderWrap}>
          <div className={styles.grid} ref={sliderRef}>
            {services.map((s) => (
              <div
                key={s.id}
                className={`${styles.card} ${s.highlight ? styles.cardHighlight : ""}`}
              >
                <div className={styles.cardImg}>
                  <img src={s.img} alt={s.title} />
                  <span className={styles.cardTag}>{s.tag}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardIcon}>{s.icon}</div>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  <p className={styles.cardDesc}>{s.description}</p>
                  <div className={styles.cardFooter}>
                    <button type="button" className={styles.bookBtn} onClick={() => setBooking(s)}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.sliderDots} role="tablist" aria-label="Services">
            {services.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Show ${s.title}`}
                className={`${styles.sliderDot} ${i === active ? styles.sliderDotOn : ""}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.howSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSub}>Three simple steps to sacred connection</p>
          </div>
          <div className={styles.stepsRow}>
            {steps.map((step, i) => (
              <div key={i} className={styles.step}>
                <span className={styles.stepNum}>{step.num}</span>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
                {i < steps.length - 1 && <div className={styles.stepLine} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Begin Your Sacred Journey Today</h2>
          <p className={styles.ctaSub}>
            Over 50,000 devotees have deepened their practice with Bhava: services.
            Your first puja consultation is free.
          </p>
          <div className={styles.ctaBtns}>
            <button
              type="button"
              className={styles.ctaPrimary}
              onClick={() => setBooking({ title: "Free puja consultation", tag: "Free consultation" })}
            >
              Get Free Consultation
            </button>
            <button
              type="button"
              className={styles.ctaSecondary}
              onClick={() => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
            >
              Browse All Services
            </button>
          </div>
        </div>
      </div>

      {booking && <ServiceBookingModal service={booking} onClose={() => setBooking(null)} />}
    </div>
  );
}

export default Services;
