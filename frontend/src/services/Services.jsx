import styles from "./Services.module.css";

const services = [
  {
    id: 0,
    icon: "✦",
    tag: "PUJA BOOKING",
    title: "Book a Sacred Puja",
    description:
      "Schedule a traditional puja performed by verified temple priests. Choose from Ganesh Puja, Satyanarayan, Rudrabhishek, and 40+ more rituals performed live or on your behalf.",
    price: "Starting ₹999",
    img: "/pujaRituals.png",
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
    img: "/templeBlessed.png",
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
    img: "/mantrasPrayers.png",
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
    img: "/temple.png",
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
  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <p className={styles.eyebrow}>BHAVA SACRED SERVICES</p>
        <h1 className={styles.heroTitle}>
          Spiritual <span className={styles.accent}>Services</span>
        </h1>
        <p className={styles.heroSub}>
          Authentic Vedic services connecting you to temples, priests and
          teachers across India — from your home or in person.
        </p>
      </div>

      {/* ── Stats strip ── */}
      <div className={styles.statsStrip}>
        {stats.map((s, i) => (
          <div key={i} className={styles.statItem}>
            <span className={styles.statNum}>{s.number}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Services grid ── */}
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>What We Offer</h2>
          <p className={styles.sectionSub}>
            Six sacred pathways to deepen your spiritual practice
          </p>
        </div>

        <div className={styles.grid}>
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
                  <button className={styles.bookBtn}>Book Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ── */}
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

      {/* ── CTA banner ── */}
      <div className={styles.ctaBanner}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Begin Your Sacred Journey Today</h2>
          <p className={styles.ctaSub}>
            Over 50,000 devotees have deepened their practice with Bhava services.
            Your first puja consultation is free.
          </p>
          <div className={styles.ctaBtns}>
            <button className={styles.ctaPrimary}>Get Free Consultation</button>
            <button className={styles.ctaSecondary}>Browse All Services</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Services;
