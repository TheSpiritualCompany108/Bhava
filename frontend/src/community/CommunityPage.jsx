import styles from "./CommunityPage.module.css";

const stats = [
  { number: "50K+",  label: "Active Members" },
  { number: "120+",  label: "Countries Represented" },
  { number: "8K+",   label: "Discussions Started" },
  { number: "200+",  label: "Monthly Satsangs" },
];

const discussions = [
  {
    id: 0,
    tag: "MEDITATION",
    title: "How do you maintain consistency in your morning sadhana?",
    excerpt: "I've been struggling to keep a steady daily practice. Would love to hear what routines work for fellow seekers in different time zones.",
    author: "Ananya R.",
    location: "Pune",
    replies: 84,
    likes: 210,
    img: "/Daily Practices/Meditation.png",
  },
  {
    id: 1,
    tag: "BHAKTI",
    title: "Which Bhajan melts your heart every single time?",
    excerpt: "Music has always been my path into devotion. Share the kirtan or bhajan that instantly takes you to a deeper state of surrender.",
    author: "Vikram S.",
    location: "Vrindavan",
    replies: 136,
    likes: 389,
    img: "/Daily Practices/Mantra Chanting.png",
  },
  {
    id: 2,
    tag: "PHILOSOPHY",
    title: "Navigating karma — action without attachment in modern life",
    excerpt: "The Gita's teaching on nishkama karma is profound, yet applying it in corporate and family life feels like a tightrope walk.",
    author: "Deepa M.",
    location: "Bengaluru",
    replies: 97,
    likes: 274,
    img: "/Daily Practices/Gita Reading.png",
  },
  {
    id: 3,
    tag: "RITUALS",
    title: "Tips for setting up a sacred home altar — small spaces welcome!",
    excerpt: "Living in a studio apartment but want a dedicated puja corner. What essentials do you recommend and how do you keep it energetically clean?",
    author: "Rohit K.",
    location: "Singapore",
    replies: 61,
    likes: 193,
    img: "/pujaRituals.png",
  },
  {
    id: 4,
    tag: "YOGA",
    title: "Surya Namaskar at sunrise — experiences from practitioners",
    excerpt: "I recently shifted my practice to the golden hour and the difference is remarkable. Has the time of day changed anything for you?",
    author: "Kavitha N.",
    location: "Chennai",
    replies: 72,
    likes: 241,
    img: "/Daily Practices/Kurya Namaskar.png",
  },
  {
    id: 5,
    tag: "VEDANTA",
    title: "Reading Upanishads alone vs. with a teacher — what's your path?",
    excerpt: "I've been studying the Mandukya Upanishad solo but feel I'm missing layers. Is self-study enough, or is a guru truly essential?",
    author: "Suresh P.",
    location: "Toronto",
    replies: 115,
    likes: 302,
    img: "/Daily Practices/Vedic Hymns.png",
  },
];

const testimonials = [
  {
    text: "Bhava:'s community gave me a spiritual home outside India. The weekly satsangs kept me grounded during the hardest year of my life.",
    author: "Priya Sharma",
    location: "Mumbai → London",
    stars: 5,
  },
  {
    text: "I found my meditation teacher through a Bhava: forum thread. That single connection changed my practice completely.",
    author: "Rajesh Iyer",
    location: "Bengaluru",
    stars: 5,
  },
  {
    text: "The quality of discussions here is unlike anything I've found online. Deep, respectful, and grounded in scripture.",
    author: "Anjali Desai",
    location: "Ahmedabad",
    stars: 5,
  },
  {
    text: "As a Hindu living in Canada, Bhava: Community makes me feel connected to my roots every single day.",
    author: "Arjun Mehta",
    location: "Vancouver",
    stars: 5,
  },
  {
    text: "I joined for the discussions and stayed for the people. The compassion in this community is extraordinary.",
    author: "Sneha Rao",
    location: "Hyderabad",
    stars: 5,
  },
  {
    text: "Monthly virtual satsangs with senior teachers have deepened my understanding of Advaita more than years of solo reading.",
    author: "Kiran Patel",
    location: "New Jersey",
    stars: 5,
  },
];

const events = [
  {
    date: "MAR 08",
    day: "Saturday",
    title: "Mahashivaratri Community Satsang",
    desc: "An all-night virtual celebration with guided meditation, Shiva stotras and community chanting.",
    type: "VIRTUAL",
    img: "/templeBlessed.png",
  },
  {
    date: "MAR 15",
    day: "Saturday",
    title: "Bhagavad Gita Study Circle — Ch. 12",
    desc: "Weekly deep-dive into the Bhakti Yoga chapter with Q&A moderated by a Vedanta scholar.",
    type: "VIRTUAL",
    img: "/Daily Practices/Gita Reading.png",
  },
  {
    date: "/APR 05",
    day: "Saturday",
    title: "Vrindavan Pilgrimage Yatra",
    desc: "Join 40 seekers on a guided 5-day pilgrimage to Vrindavan, Mathura and Govardhan.",
    type: "IN-PERSON",
    img: "/temple.png",
  },
  {
    date: "APR 13",
    day: "Sunday",
    title: "Ugadi Celebrations & Vedic New Year",
    desc: "Cultural programmes, community feast, panchanga shravanam and collective prayer for the new year.",
    type: "HYBRID",
    img: "/festivals.png",
  },
];

function CommunityPage() {
  return (
    <div className={styles.page}>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroBg} />
        <p className={styles.eyebrow}>BHAVA: COMMUNITY</p>
        <h1 className={styles.heroTitle}>
          Where Seekers <span className={styles.accent}>Come Together</span>
        </h1>
        <p className={styles.heroSub}>
          A global community of 50,000+ devotees sharing wisdom, supporting each
          other's sadhana and celebrating the richness of Dharmic life.
        </p>
        <div className={styles.heroBtns}>
          <button className={styles.joinBtn}>Join the Community</button>
          <button className={styles.exploreBtn}>Explore Discussions</button>
        </div>
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

      {/* ── Popular discussions ── */}
      <div className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Discussions</h2>
            <p className={styles.sectionSub}>Real conversations from our global sangha</p>
          </div>
          <div className={styles.discussGrid}>
            {discussions.map((d) => (
              <div key={d.id} className={styles.discussCard}>
                <div className={styles.discussImg}>
                  <img src={d.img} alt={d.title} />
                  <span className={styles.discussTag}>{d.tag}</span>
                </div>
                <div className={styles.discussBody}>
                  <h3 className={styles.discussTitle}>{d.title}</h3>
                  <p className={styles.discussExcerpt}>{d.excerpt}</p>
                  <div className={styles.discussFooter}>
                    <div className={styles.discussAuthor}>
                      <span className={styles.authorDot} />
                      <span className={styles.authorName}>{d.author}</span>
                      <span className={styles.authorLoc}>{d.location}</span>
                    </div>
                    <div className={styles.discussMeta}>
                      <span>{d.replies} replies</span>
                      <span>{d.likes} likes</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Community Stories</h2>
            <p className={styles.sectionSub}>What our members say about their journey</p>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.stars}>
                  {"★".repeat(t.stars)}
                </div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <span className={styles.authorAvatar}>{t.author[0]}</span>
                  <div>
                    <p className={styles.authorNameBold}>{t.author}</p>
                    <p className={styles.authorLocation}>{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Upcoming events ── */}
      <div className={styles.eventsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Upcoming Satsangs & Events</h2>
            <p className={styles.sectionSub}>Connect live with your global sangha</p>
          </div>
          <div className={styles.eventsGrid}>
            {events.map((e, i) => (
              <div key={i} className={styles.eventCard}>
                <div className={styles.eventImg}>
                  <img src={e.img} alt={e.title} />
                  <span className={`${styles.eventType} ${e.type === "IN-PERSON" ? styles.typeInPerson : e.type === "HYBRID" ? styles.typeHybrid : styles.typeVirtual}`}>
                    {e.type}
                  </span>
                </div>
                <div className={styles.eventBody}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventDateNum}>{e.date}</span>
                    <span className={styles.eventDay}>{e.day}</span>
                  </div>
                  <h3 className={styles.eventTitle}>{e.title}</h3>
                  <p className={styles.eventDesc}>{e.desc}</p>
                  <button className={styles.rsvpBtn}>RSVP Free</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Join CTA ── */}
      <div className={styles.ctaBanner}>
        <div className={styles.ctaBg} />
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to Find Your Sangha?</h2>
          <p className={styles.ctaSub}>
            Join 50,000+ seekers from 120+ countries. Membership is free —
            your first satsang awaits.
          </p>
          <div className={styles.ctaInputRow}>
            <input
              type="email"
              placeholder="Enter your email address"
              className={styles.ctaInput}
            />
            <button className={styles.ctaJoinBtn}>Join Free</button>
          </div>
          <p className={styles.ctaNote}>No spam · Leave anytime · Instant access</p>
        </div>
      </div>

    </div>
  );
}

export default CommunityPage;
