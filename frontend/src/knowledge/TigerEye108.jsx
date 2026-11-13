import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./TigerEye108.module.css";

function TigerEye108() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedTile, setSelectedTile] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (location.state?.tile) {
      setSelectedTile(location.state.tile);
    }
  }, [location]);

  const pillars = [
    {
      number: "01",
      thinker: "Philip Kotler",
      concept: "4Ps of Sacred Marketing",
      description:
        "Product: Tiger Eye mala & ritual kits as sacred tools. Price: an investment in dharma, not a cost. Place: every channel where seekers already gather. Promotion: content that teaches before it sells — education as the highest form of marketing.",
      icon: "",
    },
    {
      number: "02",
      thinker: "Seth Godin",
      concept: "Tribe over Traffic",
      description:
        "We do not chase algorithms — we build a tribe of 10,000+ devoted seekers. A tribe connected by shared belief in sacred discipline. When the tribe moves, the market follows. The Spiritual Company is the leader of this tribe.",
      icon: "",
    },
    {
      number: "03",
      thinker: "Al Ries & Jack Trout",
      concept: "Category Ownership",
      description:
        "In every market, only one brand owns a position in the mind. The Spiritual Company owns 'Sacred Discipline' — the intersection of ancient Vedic practice and modern lifestyle. No competitor occupies this space.",
      icon: "",
    },
    {
      number: "04",
      thinker: "Vedic Science",
      concept: "The 108 Frequency",
      description:
        "108 is encoded in nature itself: the Earth–Sun distance is 108× the Sun's diameter. The Moon–Earth distance is 108× the Moon's diameter. 108 beads on the mala, 108 Upanishads, 108 sacred sites. It is the universe's ordering code.",
      icon: "",
    },
    {
      number: "05",
      thinker: "Crystal Science",
      concept: "Tiger Eye's Power",
      description:
        "Tiger Eye resonates at the frequency of focused will. It activates the solar plexus (Manipura) and root chakra (Muladhara), building the stability needed for consistent sadhana. Roman soldiers carried it into battle. Vedic warriors wore it for unshakeable clarity.",
      icon: "",
    },
    {
      number: "06",
      thinker: "Civilizational Vision",
      concept: "Beyond Product — A Movement",
      description:
        "The Spiritual Company is not selling crystals. It is rebuilding the culture of sacred discipline in a distracted age. Every Tiger Eye mala sold is a vow taken. Every 108-second ritual practiced is a neuron rewired toward dharma.",
      icon: "",
    },
  ];

  const ritualSteps = [
    {
      step: 1,
      title: "Hold the Tiger Eye",
      duration: "18 seconds",
      instruction:
        "Take your Tiger Eye mala or stone in your left hand. Close your eyes. Feel the weight — this is the weight of discipline made physical.",
    },
    {
      step: 2,
      title: "Set the Sankalpa",
      duration: "18 seconds",
      instruction:
        "Whisper or think your single most important intention for the day. Not a list — one clear dharmic aim. The Tiger Eye absorbs and amplifies it.",
    },
    {
      step: 3,
      title: "108 Breaths of Awareness",
      duration: "54 seconds",
      instruction:
        "Take slow, conscious breaths while gently feeling the stone's surface. You need not count — simply breathe until the nervous system settles. The stone calibrates with each exhale.",
    },
    {
      step: 4,
      title: "Seal with Gratitude",
      duration: "18 seconds",
      instruction:
        "Place the stone at your heart center. Say internally: 'I act with clarity, I move with dharma.' Place it on your altar or keep it visible as an anchor throughout the day.",
    },
  ];

  const contentPillars = [
    {
      title: "Vedic Science of Crystals",
      description:
        "Content educating seekers on the authentic Vedic and Ayurvedic basis for crystal usage. Not metaphysical fluff — scientific, traditional, grounded evidence.",
      posts: ["Why 108 is encoded in nature", "Tiger Eye in ancient warfare", "Chakra science explained simply", "Mala bead meditation science"],
      color: "#4A0B1D",
    },
    {
      title: "Emotional Depth Stories",
      description:
        "Real testimonials and transformation narratives from devotees whose lives changed through sacred discipline. Emotional resonance builds the tribe faster than any ad.",
      posts: ["'I found stillness in 108 days'", "How Tiger Eye helped me leave a toxic career", "My morning ritual at 4am", "From anxiety to clarity: a devotee's story"],
      color: "#7A1F25",
    },
    {
      title: "Product as Ritual Tool",
      description:
        "Every product demonstration shows the Tiger Eye mala or kit in use within a real ritual context. We sell the practice, not just the product.",
      posts: ["How to activate your Tiger Eye", "Setting up a home altar", "108-second morning ritual demo", "Travel altar with Tiger Eye guide"],
      color: "#4A2D73",
    },
    {
      title: "Civilizational Provocation",
      description:
        "Bold, thought-provoking content that challenges distracted modern life and invites seekers to choose the path of sacred discipline. Content that sparks conversation.",
      posts: ["Why every ancient culture used 108", "The death of discipline in the modern age", "What your phone is doing to your sadhana", "The warrior's morning vs the consumer's morning"],
      color: "#2C4A1E",
    },
  ];

  const products = [
    {
      name: "Tiger Eye Mala — 108 Beads",
      tagline: "The Complete Sacred Discipline Tool",
      description: "Authentic 108-bead Tiger Eye mala, hand-knotted with red thread. Each bead is 8mm, natural stone. Comes with a ritual activation guide and silk pouch.",
      benefit: "For the seeker who commits to daily japa and sadhana.",
      price: "Sacred Investment",
    },
    {
      name: "Tiger Eye Bracelet — 27 Beads",
      tagline: "Discipline on Your Wrist",
      description: "27-bead Tiger Eye bracelet (27 × 4 = 108). Wearable throughout the day as a constant reminder of your sankalpa and dharmic intention.",
      benefit: "For the modern devotee — office, travel, everywhere.",
      price: "Daily Anchor",
    },
    {
      name: "108 Ritual Starter Kit",
      tagline: "Your Complete Sacred Discipline System",
      description: "Includes: Tiger Eye pocket stone, 108-page guided sadhana journal, incense set (108 sticks), ritual activation card, and The Spiritual Company seal.",
      benefit: "For the seeker beginning the path of structured devotion.",
      price: "Complete System",
    },
  ];

  return (
    <div className={styles.tigerEyePage}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleLine1}>108</span> <span className={styles.heroTitleAnd}>&</span> <span className={styles.heroTitleLine2}>Tiger Eye</span>
          </h1>
          <p className={styles.heroSubtitle}>
            The universe's ordering code meets the stone of disciplined warriors.
            <br />
            <em>This is not wellness — this is civilizational renewal.</em>
          </p>
          <div className={styles.heroCtas}>
            <button className={styles.btnPrimary} onClick={() => document.getElementById("ritual").scrollIntoView({ behavior: "smooth" })}>
              Learn the 108-Second Ritual
            </button>
            <button className={styles.btnSecondary} onClick={() => document.getElementById("pillars").scrollIntoView({ behavior: "smooth" })}>
              The Strategic Core
            </button>
          </div>
        </div>
      </section>

      {/* ── Complete Sacred System Content ── */}
      <section className={styles.completeSystemSection}>
        <div className={styles.container}>
          {selectedTile ? (
            // Show only selected tile content
            <div className={styles.systemGrid}>
              <div className={styles.systemLeft}>
                {selectedTile.eyebrow && (
                  <p className={styles.systemEyebrow}>{selectedTile.eyebrow}</p>
                )}
                <h2 className={styles.systemTitle}>{selectedTile.title}</h2>
                <div className={styles.systemContent}>
                  <p>{selectedTile.description}</p>
                </div>
              </div>

              <div className={styles.systemRight}>
                <div className={styles.factsCard}>
                  <h3 className={styles.factsTitle}>Sacred Facts at a Glance</h3>
                  <ul className={styles.factsList}>
                    {selectedTile.highlights?.map((fact, idx) => (
                      <li key={idx}>{fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            // Show all content by default
            <>
          {/* Tile 1: Why 108 and Tiger Eye Are the Ultimate Spiritual Power Pair */}
          <div className={styles.systemGrid}>
            <div className={styles.systemLeft}>
              <p className={styles.systemEyebrow}>SACRED STRATEGY</p>
              <h2 className={styles.systemTitle}>Why 108 and Tiger Eye Are the Ultimate Spiritual Power Pair</h2>
              <div className={styles.systemContent}>
                <p>
                  108 appears in the distance between the Earth and Sun (108 · the Sun's diameter), in the 108 Upanishads, 108 sacred sites, 108 beads of the mala — it is the universe's ordering frequency. When you work with 108, you align yourself with the cosmic rhythm.
                </p>
                <p>
                  Tiger Eye is the stone of the disciplined warrior. Ancient Roman soldiers carried it into battle for protection. In Vedic tradition it harmonises the solar plexus and root chakras, building the unshakeable stability needed for long-term sadhana. It transforms fear into focused action and scattered energy into laser-precision.
                </p>
                <p>
                  Combined, they are the 108·Tiger Eye System — a daily ritual protocol of just 108 seconds that regulates the nervous system, anchors intention, and creates the inner stillness from which all great devotion flows.
                </p>
              </div>
            </div>

            <div className={styles.systemRight}>
              <div className={styles.factsCard}>
                <h3 className={styles.factsTitle}>Sacred Facts at a Glance</h3>
                <ul className={styles.factsList}>
                  <li>108 Upanishads — The complete library of Vedantic wisdom</li>
                  <li>108 × Sun Diameter — Earth–Sun distance, cosmic proof</li>
                  <li>Tiger Eye Chakras — Solar plexus · Root, power & grounding</li>
                  <li>108-Second Ritual — Nervous system reset protocol</li>
                  <li>Godin's Tribe — 10,000 · devoted seekers, not mass marketing</li>
                  <li>6 Pillars — Kotler · Godin · Ries · Trout strategic core</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tile 4: From Stones to Symbolic Infrastructure */}
          <div className={styles.systemGrid} style={{ marginTop: "60px" }}>
            <div className={styles.systemLeft}>
              <p className={styles.systemEyebrow}>108 · TIGER EYE · MODERN DHARMA</p>
              <h2 className={styles.systemTitle}>From Stones to Symbolic Infrastructure</h2>
              <div className={styles.systemContent}>
                <p>
                  In Hindu civilization, 108 appears again and again as a signal of wholeness — in malas, temple canons, sacred name-garlands, and cosmic mappings.
                </p>
                <p>
                  108 (Order) · Tiger Eye (Power) becomes a daily dharmic operating system — how do I feel spiritually protected and aligned while navigating chaos, money, family, and ambition?
                </p>
              </div>
            </div>

            <div className={styles.systemRight}>
              <div className={styles.factsCard}>
                <h3 className={styles.factsTitle}>The System Components</h3>
                <ul className={styles.factsList}>
                  <li>Order (108): structure, completion, and cosmic order.</li>
                  <li>Power (Tiger Eye): courage, protection, and grounded focus.</li>
                  <li>Daily 108-Second Ritual: stillness, breath, and touch of the anchor stone.</li>
                  <li>Tribe and Movement: a 108 Tribe that wears, counts, posts, and lives by 108.</li>
                </ul>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </section>

      {/* ── What Is 108 ── */}
      <section className={styles.introSection}>
        <div className={styles.container}>
          <div className={styles.introGrid}>
            <div className={styles.introBlock}>
              <p className={styles.eyebrow}>The Sacred Number</p>
              <h2 className={styles.blockTitle}>What Is 108?</h2>
              <p className={styles.blockText}>
                108 is not a random number. It is a civilizational constant — encoded in the cosmos, in the body, and
                in every great spiritual tradition on Earth.
              </p>
              <ul className={styles.factList}>
                <li><span className={styles.factIcon}></span> The Earth–Sun distance is exactly <strong>108×</strong> the Sun's diameter</li>
                <li><span className={styles.factIcon}></span> The Moon–Earth distance is <strong>108×</strong> the Moon's diameter</li>
                <li><span className={styles.factIcon}></span> <strong>108 beads</strong> on the Vedic mala — one for each name of the Divine</li>
                <li><span className={styles.factIcon}></span> <strong>108 Upanishads</strong> — the complete library of Vedantic revelation</li>
                <li><span className={styles.factIcon}></span> <strong>108 sacred sites</strong> (Shakti Peethas) across the Indian subcontinent</li>
                <li><span className={styles.factIcon}></span> <strong>108 energy channels</strong> meet at the heart chakra (Anahata)</li>
              </ul>
            </div>

            <div className={styles.introBlock}>
              <p className={styles.eyebrow}>The Discipline Stone</p>
              <h2 className={styles.blockTitle}>What Is Tiger Eye?</h2>
              <p className={styles.blockText}>
                Tiger Eye is not a crystal for wishing — it is a stone for doing. Across three millennia, it has been
                the stone of warriors, kings, and those who build empires of the spirit.
              </p>
              <ul className={styles.factList}>
                <li><span className={styles.factIcon}></span> Roman soldiers wore Tiger Eye for <strong>protection in battle</strong></li>
                <li><span className={styles.factIcon}></span> Activates <strong>Manipura</strong> (solar plexus) — the seat of willpower</li>
                <li><span className={styles.factIcon}></span> Grounds through <strong>Muladhara</strong> (root chakra) — stability under pressure</li>
                <li><span className={styles.factIcon}></span> Transforms <strong>scattered energy</strong> into laser-focused action</li>
                <li><span className={styles.factIcon}></span> Calms the <strong>nervous system</strong> — clarity over anxiety</li>
                <li><span className={styles.factIcon}></span> In Vedic tradition: the <strong>stone of disciplined sadhana</strong></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Strategic Core (6 Pillars) ── */}
      <section className={styles.pillarsSection} id="pillars">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>The Spiritual Company's Framework</p>
          <h2 className={styles.sectionTitle}>
            The <span className={styles.gold}>6 Strategic Pillars</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Built on the greatest marketing minds of the modern era, fused with ancient Vedic intelligence.
          </p>

          <div className={styles.pillarsGrid}>
            {pillars.map((pillar) => (
              <div key={pillar.number} className={styles.pillarCard}>
                <div className={styles.pillarHeader}>
                  <span className={styles.pillarNumber}>{pillar.number}</span>
                  <span className={styles.pillarIcon}>{pillar.icon}</span>
                </div>
                <p className={styles.pillarThinker}>{pillar.thinker}</p>
                <h3 className={styles.pillarConcept}>{pillar.concept}</h3>
                <p className={styles.pillarDescription}>{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The 108-Second Ritual ── */}
      <section className={styles.ritualSection} id="ritual">
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Daily Practice</p>
          <h2 className={styles.sectionTitle}>
            The <span className={styles.gold}>108-Second Ritual</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            The most powerful daily practice takes less than two minutes. Here is the complete system.
          </p>

          <div className={styles.ritualGrid}>
            {ritualSteps.map((item) => (
              <div key={item.step} className={styles.ritualCard}>
                <div className={styles.ritualStepBadge}>Step {item.step}</div>
                <div className={styles.ritualDuration}>{item.duration}</div>
                <h3 className={styles.ritualStepTitle}>{item.title}</h3>
                <p className={styles.ritualInstruction}>{item.instruction}</p>
              </div>
            ))}
          </div>

          <div className={styles.ritualNote}>
            <p>
              <strong>Total time: 108 seconds.</strong> Practice every morning, ideally between 4–6am (Brahma Muhurta).
              The cumulative effect over 108 days is what the ancient rishis called <em>sadhana siddhi</em> — the perfection of practice.
            </p>
          </div>
        </div>
      </section>

      {/* ── Content Pillars ── */}
      <section className={styles.contentPillarsSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>60-Day Content Strategy</p>
          <h2 className={styles.sectionTitle}>
            The <span className={styles.gold}>4 Content Pillars</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Every post, reel, and story from The Spiritual Company flows from one of these four pillars.
          </p>

          <div className={styles.contentPillarsTabs}>
            <div className={styles.tabButtons}>
              {contentPillars.map((p, i) => (
                <button
                  key={i}
                  className={`${styles.tabBtn} ${activeTab === i ? styles.tabBtnActive : ""}`}
                  onClick={() => setActiveTab(i)}
                >
                  {p.title}
                </button>
              ))}
            </div>

            <div className={styles.tabContent} style={{ borderTop: `3px solid ${contentPillars[activeTab].color}` }}>
              <h3 className={styles.tabContentTitle} style={{ color: contentPillars[activeTab].color }}>
                {contentPillars[activeTab].title}
              </h3>
              <p className={styles.tabContentDescription}>{contentPillars[activeTab].description}</p>
              <div className={styles.tabPostGrid}>
                {contentPillars[activeTab].posts.map((post, i) => (
                  <div key={i} className={styles.postChip} style={{ borderColor: contentPillars[activeTab].color }}>
                    "{post}"
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ── */}
      <section className={styles.productsSection}>
        <div className={styles.container}>
          <p className={styles.eyebrowCenter}>Sacred Tools</p>
          <h2 className={styles.sectionTitle}>
            The <span className={styles.gold}>Tiger Eye Collection</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Not merchandise. Sacred instruments for the disciplined path.
          </p>

          <div className={styles.productsGrid}>
            {products.map((product, i) => (
              <div key={i} className={styles.productCard}>
                <div className={styles.productImagePlaceholder}>
                  <span className={styles.productStoneIcon}></span>
                </div>
                <div className={styles.productBody}>
                  <p className={styles.productTagline}>{product.tagline}</p>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <p className={styles.productDesc}>{product.description}</p>
                  <p className={styles.productBenefit}>{product.benefit}</p>
                  <button className={styles.productBtn}>Explore This Tool</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Godin Tribe Section ── */}
      <section className={styles.tribeSection}>
        <div className={styles.container}>
          <div className={styles.tribeInner}>
            <p className={styles.eyebrowCenter} style={{ color: "rgba(247,243,236,0.6)" }}>Seth Godin's Insight, Applied to Dharma</p>
            <h2 className={styles.tribeTitleLarge}>
              "People like us<br />do things like this."
            </h2>
            <p className={styles.tribeSubtext}>
              The Spiritual Company does not sell to everyone. We serve a tribe — seekers who have chosen discipline
              over distraction, dharma over dopamine, sacred practice over empty performance.
              <br /><br />
              When you hold a Tiger Eye mala, you are not buying a crystal. You are declaring membership in a
              10,000-year-old lineage of devoted practitioners. You are saying: <em>"I am someone who shows up. Every day. For 108 days."</em>
            </p>
            <div className={styles.tribeStats}>
              <div className={styles.tribeStat}>
                <span className={styles.tribeStatNumber}>108</span>
                <span className={styles.tribeStatLabel}>Days of commitment</span>
              </div>
              <div className={styles.tribeStat}>
                <span className={styles.tribeStatNumber}>10K+</span>
                <span className={styles.tribeStatLabel}>Devoted seekers</span>
              </div>
              <div className={styles.tribeStat}>
                <span className={styles.tribeStatNumber}>1</span>
                <span className={styles.tribeStatLabel}>Sankalpa at a time</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <h2 className={styles.ctaTitle}>Begin Your 108-Day Discipline Path</h2>
          <p className={styles.ctaSubtext}>
            Choose your Tiger Eye tool. Learn the ritual. Join the tribe.
            <br />The path of sacred discipline starts with a single 108-second morning.
          </p>
          <div className={styles.ctaButtons}>
            <button className={styles.btnPrimary} onClick={() => navigate("/products")}>
              Shop Tiger Eye Collection
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate("/knowledge")}>
              ← Back to Knowledge
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}

export default TigerEye108;
