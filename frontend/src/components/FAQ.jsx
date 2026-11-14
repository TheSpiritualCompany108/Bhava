import { useState } from "react";
import styles from "./FAQ.module.css";

const categories = [
  {
    icon: "?",
    title: "About Bhava:",
    desc: "Learn more about the company and get the overview of the app and FAQ",
    count: 10,
    faqs: [
      { q: "Are your products temple-blessed and authentic?", a: "Yes. Every product in our collection is sourced directly from verified temple artisans and traditional manufacturers across India. We partner with over 500 temples and certified suppliers to ensure every item carries genuine spiritual intent and purity." },
      { q: "Is Bhava: certified by regulatory bodies?", a: "Yes. Bhava: is registered under FSSAI for all applicable consumable products and complies with BIS standards for incense and dhoop. All certifications are available for review upon request." },
    ],
  },
  {
    icon: "🛒",
    title: "Orders & Shipping",
    desc: "Track your orders, understand delivery timelines and shipping policies",
    count: 8,
    faqs: [
      { q: "How fast is delivery? Do you ship internationally?", a: "Within India, we deliver in 3–5 business days. Express 1–2 day delivery is available in metro cities. We ship internationally to USA, UK, Canada, Australia, Singapore and UAE in 7–14 business days." },
      { q: "What's your return/refund policy?", a: "We offer a hassle-free 7-day return policy on non-consumable products. For consumable items, we accept returns only if the product is damaged or defective upon arrival." },
    ],
  },
  {
    icon: "💳",
    title: "Payments & Pricing",
    desc: "Everything about pricing, offers, payment methods and billing",
    count: 6,
    faqs: [
      { q: "How do your prices compare to retail incense/sambrani?", a: "Because we work directly with artisans and temple cooperatives, our prices are typically 30–45% lower than retail stores for equivalent quality." },
    ],
  },
  {
    icon: "📱",
    title: "Wellness App",
    desc: "Learn about the Bhava: app features, launch dates and subscriptions",
    count: 5,
    faqs: [
      { q: "When is the Wellness App launching?", a: "The Bhava: Wellness App is currently in final beta and is set to launch in Q2 2025 on both iOS and Android. Join our waitlist for 3 months of premium access free at launch." },
    ],
  },
  {
    icon: "🛕",
    title: "Temple Partnerships",
    desc: "Details about our verified temple network and sourcing process",
    count: 7,
    faqs: [
      { q: "How do you verify temple partnerships?", a: "Every temple partner goes through a rigorous vetting process including documentation verification, on-site visits, and regular quality audits to ensure authenticity." },
    ],
  },
  {
    icon: "🎁",
    title: "Subscriptions & Boxes",
    desc: "Monthly sacred boxes, subscription plans and gifting options",
    count: 4,
    faqs: [
      { q: "What is included in the subscription box?", a: "Each monthly box includes temple-sourced incense, malas, oils and sacred items curated around a spiritual theme. Boxes are customizable based on your practice." },
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
              <span className={styles.cardCount}>{cat.count} Articles</span>
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
