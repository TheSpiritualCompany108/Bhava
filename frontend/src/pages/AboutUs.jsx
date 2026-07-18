import { useNavigate } from "react-router-dom";
import styles from "./AboutUs.module.css";

const corePillars = [
  {
    title: "Ritual Objects",
    description:
      "Thoughtfully crafted vessels that transform ordinary moments into intentional daily rituals.",
    cta: "Explore Collections",
    route: "/products",
  },
  {
    title: "Structured Practices",
    description:
      "Guided journeys, daily prompts, and reflections designed to gently deepen your spiritual rhythm.",
    cta: "Begin a Practice",
    route: "/knowledge",
  },
  {
    title: "Sacred Wisdom",
    description:
      "Ancient teachings translated into everyday understanding through reflections and meditations.",
    cta: "Read Today's Reflection",
    route: "/knowledge",
  },
  {
    title: "Bhava Companion",
    description:
      "A quiet digital companion for daily rhythm with practices, audio reminders, and journaling support.",
    cta: "Discover the App",
    route: "/app",
  },
  {
    title: "Community",
    description:
      "A growing circle choosing presence over distraction through shared stories and guided gatherings.",
    cta: "Meet the Community",
    route: "/community",
  },
  {
    title: "Sacred Living",
    description:
      "Bring absolute intentionality into daily routines, mornings, gifting, hospitality, and celebrations.",
    cta: "Explore Lifestyle",
    route: "/knowledge",
  },
];

const craftingCards = [
  {
    title: "Designed for Daily Practice",
    description: "Every object exists to support a rhythm, not decorate a shelf.",
    cta: "Learn More",
    route: "/products",
  },
  {
    title: "Crafted with Intention",
    description:
      "Every material, fragrance, form, and finish are considered together to create quiet moments of presence.",
    cta: "Explore Design",
    route: "/products",
  },
  {
    title: "Guided Beyond the Object",
    description:
      "Every ritual is accompanied by guidance, reflections, and structured practices through Bhava.",
    cta: "Begin Practice",
    route: "/knowledge",
  },
];

const experienceColumns = [
  { title: "Objects", description: "Tactile creations that invite intentional, daily practice." },
  { title: "Guidance", description: "Clear instruction that offers deep clarity and confidence." },
  { title: "Journeys", description: "Structured pathways designed to help habits take root." },
  { title: "Community", description: "A shared space that inspires quiet, lifelong growth." },
];

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      {/* Belief + Our Story */}
      <section className={styles.heroSection} aria-labelledby="about-hero-title">
        <div className={styles.inner}>
          <p className={styles.kicker}>About Bhava</p>
          <h1 id="about-hero-title" className={styles.heroTitle}>
            Quiet Rituals. Meaningful Lives.
          </h1>

          <div className={styles.beliefGrid}>
            <div className={styles.beliefCol}>
              <h3 className={styles.colHeading}>The Belief</h3>
              <p className={styles.body}>
                Bhava was created from a simple belief: that the sacred
                belongs in everyday life.
              </p>
              <p className={styles.body}>
                Not only in moments of celebration, but in the quiet rhythm of
                each morning, each evening, and every pause in between.
              </p>
            </div>

            <div className={styles.beliefImageWrapper}>
              <img src="/incense.jpeg" alt="Incense burning in a quiet corner" className={styles.beliefImage} />
            </div>

            <div className={styles.beliefCol}>
              <h3 className={styles.colHeading}>Our Story</h3>
              <p className={styles.body}>
                Modern life offers constant movement. Yet beneath the pace
                remains a universal longing—for presence, clarity, and
                connection.
              </p>
              <p className={styles.body}>
                Bhava exists to help make that return possible by inviting
                stillness into ordinary moments through thoughtfully crafted
                objects and guided practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy + Core beliefs */}
      <section className={styles.philosophySection} aria-labelledby="philosophy-title">
        <div className={styles.inner}>
          <div className={styles.philosophyGrid}>
            <div>
              <p className={styles.kicker}>The Foundation</p>
              <h2 id="philosophy-title" className={styles.sectionTitle}>Our Philosophy</h2>
              <p className={styles.body}>Ritual creates rhythm.</p>
              <p className={styles.body}>Rhythm creates consistency.</p>
              <p className={styles.body}>Consistency shapes character.</p>
              <p className={styles.bodyAccent}>Character transforms life.</p>
            </div>

            <div>
              <p className={styles.kicker}>The Core</p>
              <h2 className={styles.sectionTitle}>What We Believe</h2>
              <ul className={styles.beliefList}>
                <li>Presence is cultivated through repetition.</li>
                <li>Beauty encourages attention.</li>
                <li>Simplicity invites consistency.</li>
                <li>Ritual belongs in every home.</li>
                <li>Wisdom is meant to be lived.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Six Core Pillars */}
      <section className={styles.pillarsSection} aria-labelledby="pillars-title">
        <div className={styles.inner}>
          <p className={styles.kicker}>An Intentional Ecosystem</p>
          <h2 id="pillars-title" className={styles.sectionTitle}>The Six Core Pillars of Bhava</h2>

          <div className={styles.pillarsGrid}>
            {corePillars.map((pillar, i) => (
              <div key={pillar.title} className={styles.pillarCard}>
                <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarDescription}>{pillar.description}</p>
                <button className={styles.pillarLink} onClick={() => navigate(pillar.route)}>
                  {pillar.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Crafting Moments of Presence */}
      <section className={styles.craftingSection} aria-labelledby="crafting-title">
        <div className={styles.inner}>
          <h2 id="crafting-title" className={styles.kickerLarge}>Crafting Moments of Presence</h2>

          <div className={styles.craftingGrid}>
            {craftingCards.map((card, i) => (
              <div key={card.title} className={styles.craftingCard}>
                <span className={styles.number}>{String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.pillarTitle}>{card.title}</h3>
                <p className={styles.pillarDescription}>{card.description}</p>
                <button className={styles.pillarLink} onClick={() => navigate(card.route)}>
                  {card.cta} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Bhava Experience */}
      <section className={styles.experienceSection} aria-labelledby="experience-title">
        <div className={styles.inner}>
          <p className={styles.kickerCentered}>The Bhava Experience</p>
          <h2 id="experience-title" className={styles.experienceTitle}>
            An Ecosystem for Intentional Living
          </h2>

          <div className={styles.experienceDivider} />

          <div className={styles.experienceGrid}>
            {experienceColumns.map((col) => (
              <div key={col.title} className={styles.experienceCol}>
                <h3 className={styles.experienceColTitle}>{col.title}</h3>
                <p className={styles.pillarDescription}>{col.description}</p>
              </div>
            ))}
          </div>

          <p className={styles.experienceClosing}>
            Together, they form an ecosystem designed to make spiritual
            practice feel sustainable, personal, and deeply integrated into
            daily life.
          </p>

          <p className={styles.experienceTagline}>
            Awaken Bhava. <span className={styles.dot}>•</span> Live Divine.{" "}
            <span className={styles.dot}>•</span> Every Day.
          </p>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
