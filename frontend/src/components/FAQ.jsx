import { InlineBack } from "./PageBack";
import { useState } from "react";
import Seo, { siteOrigin } from "./Seo";
import styles from "./FAQ.module.css";

const categories = [
  {
    icon: "✦",
    title: "About Bhava:",
    desc: "Learn more about our spiritual philosophy, artisans and purity standards",
    faqs: [
      { q: "Are your products temple-blessed and authentic?", a: "Yes. Every product in our collection is sourced directly from verified temple artisans and traditional manufacturers across India. We partner with certified suppliers to ensure every item carries genuine spiritual intent and purity." },
      { q: "Is Bhava: certified by regulatory bodies?", a: "Yes. Bhava: complies with applicable BIS standards for incense and dhoop, and all packaging details are transparently displayed." },
      { q: "Are your incense sticks bamboo-less and charcoal-free?", a: "Yes. Our Sacred Notes discovery collection includes pure bamboo-less dhoop sticks made with natural herbs, resins, and botanical extracts without toxic burning chemicals or black charcoal." },
    ],
  },
  {
    icon: "📦",
    title: "Orders & Shipping",
    desc: "Track your orders, understand delivery timelines and shipping policies",
    faqs: [
      { q: "How fast is delivery across India?", a: "Within India, standard delivery takes 3–5 business days. Express delivery in metro cities typically arrives within 1–2 business days." },
      { q: "What are your shipping charges?", a: "We offer FREE standard delivery on all prepaid and COD orders above ₹501. For orders below ₹501, a nominal shipping fee of ₹50 applies." },
      { q: "How can I track my order?", a: "Once dispatched, you will receive a tracking link via email and SMS. You can also view real-time status in your Account under 'My Orders'." },
      { q: "What is your return and refund policy?", a: "We offer a hassle-free 7-day return policy on non-consumable items (like sacred bead bracelets and brass burners). For incense and camphor, we replace any item damaged in transit immediately." },
    ],
  },
  {
    icon: "💳",
    title: "Payments & Pricing",
    desc: "Everything about payment options, Cash on Delivery and security",
    faqs: [
      { q: "What payment methods do you accept?", a: "We accept all major UPI apps (Google Pay, PhonePe, Paytm), credit/debit cards (Visa, MasterCard, RuPay), Net Banking, and Cash on Delivery (COD) across serviceable Indian pincodes." },
      { q: "Is Cash on Delivery (COD) available?", a: "Yes, Cash on Delivery is supported on most domestic orders. You can select Cash on Delivery at checkout." },
      { q: "How do your prices compare to retail stores?", a: "Because we work directly with traditional artisans and craft cooperatives, our prices reflect authentic quality without excessive middleman markups." },
    ],
  },
  {
    icon: "📱",
    title: "Wellness App",
    desc: "Learn about the upcoming Bhava: app features and rituals",
    faqs: [
      { q: "When is the Bhava: App launching?", a: "The Bhava: Wellness App is currently in final private beta and is scheduled to launch on Google Play and the App Store. Early members will receive complimentary premium ritual guidance." },
      { q: "What features will the app include?", a: "The app offers daily personalized Vedic rituals, mantra sadhana timer with mala counters, temple live darshan, and an interactive spiritual community." },
    ],
  },
  {
    icon: "🛕",
    title: "Temple Traditions",
    desc: "Details about our verified sacred heritage and natural sourcing",
    faqs: [
      { q: "How do you source your sacred resins and woods?", a: "We source our Guggal, Loban, and natural Sandalwood directly from traditional forest cooperatives and ethical sustainable harvesters in India." },
      { q: "Are the sacred bead bracelets genuine gemstones?", a: "Yes, every bracelet uses authentic, untreated natural semi-precious stones (such as Tiger Eye, Amethyst, and Sandalwood) hand-knotted for durability and comfort." },
    ],
  },
  {
    icon: "🎁",
    title: "Gifting & Subscriptions",
    desc: "Monthly sacred boxes, corporate gifting and custom ritual sets",
    faqs: [
      { q: "Do you offer corporate or bulk spiritual gifting?", a: "Yes! We curate customized luxury ritual hampers for corporate gifting, weddings, housewarming (Griha Pravesh) and festive occasions. Reach out to us via our Contact page for corporate inquiries." },
      { q: "Can I send a gift directly to a friend with a message?", a: "Yes, simply enter the recipient's shipping address during checkout and contact our support team if you would like a personalized blessing note included." },
    ],
  },
];

function FAQ() {
  const [query, setQuery] = useState("");
  const [activeCard, setActiveCard] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);

  const filtered = categories.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.desc.toLowerCase().includes(query.toLowerCase())
  );

  const activeCat = categories[activeCard];

  return (
    <section className={styles.faqSection}>
      <Seo
        title="Frequently Asked Questions | Bhava:"
        description="Find answers to common questions about orders, shipping, payment methods, returns and authentic temple products."
        canonical={`${siteOrigin()}/faq`}
      />
      <div style={{ marginBottom: 22 }}><InlineBack fallback="/" /></div>
      {/* Header */}
      <h1 className={styles.title}>Have Questions ? Let us Help!</h1>

      {/* Search */}
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Search for Articles"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveCard(null); }}
        />
      </div>

      {/* Category grid */}
      {activeCard === null ? (
        <div className={styles.grid}>
          {filtered.map((cat, i) => (
            <div key={i} className={styles.card} onClick={() => { setActiveCard(categories.indexOf(cat)); setOpenFaq(null); }}>
              <div className={styles.cardIcon}>{cat.icon}</div>
              <h3 className={styles.cardTitle}>{cat.title}</h3>
              <p className={styles.cardDesc}>{cat.desc}</p>
              <span className={styles.cardCount}>{cat.faqs.length} Article{cat.faqs.length !== 1 ? "s" : ""}</span>
            </div>
          ))}
        </div>
      ) : (
        /* Expanded FAQ list for selected category */
        <div className={styles.faqDetail}>
          <button className={styles.backBtn} onClick={() => { setActiveCard(null); setOpenFaq(null); }}>
            ← Back to all topics
          </button>
          <div className={styles.detailHeader}>
            <span className={styles.detailIcon}>{activeCat.icon}</span>
            <div>
              <h2 className={styles.detailTitle}>{activeCat.title}</h2>
              <p className={styles.detailDesc}>{activeCat.desc}</p>
            </div>
          </div>
          <div className={styles.faqList}>
            {activeCat.faqs.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ""}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className={styles.faqQuestion}>
                  <span>{faq.q}</span>
                  <span className={`${styles.faqToggle} ${openFaq === i ? styles.faqToggleOpen : ""}`}>▼</span>
                </div>
                {openFaq === i && (
                  <div className={styles.faqAnswer}><p>{faq.a}</p></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default FAQ;
