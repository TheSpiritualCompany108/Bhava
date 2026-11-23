import { useRef } from "react";
import Seo, { siteOrigin } from "./Seo";
import styles from "./Career.module.css";

function Career() {
  const jobsRef = useRef(null);

  const jobListings = [
    {
      id: 1,
      title: "Artisan & Sourcing Specialist",
      type: "Full-Time",
      location: "Bengaluru / Hybrid",
      description: "Partner with traditional temple artisans, incense crafters and brass casters across sacred regions of India.",
    },
    {
      id: 2,
      title: "Community & Satsang Coordinator",
      type: "Part-Time",
      location: "Remote",
      description: "Nurture our spiritual community, moderate thoughtful discussions and coordinate guided ritual sessions.",
    },
    {
      id: 3,
      title: "Frontend Experience Engineer",
      type: "Full-Time",
      location: "Remote",
      description: "Craft serene, fast and mindful digital experiences for our web platform using React and modern tooling.",
    },
  ];

  const handleApply = (title) => {
    const subject = encodeURIComponent(`Application for ${title} at Bhava:`);
    const body = encodeURIComponent(
      `Hi Bhava Careers Team,\n\nI am excited to apply for the ${title} position at Bhava:.\n\nName:\nPhone:\nLinkedIn / Portfolio:\n\nA brief note on why I want to work with Bhava:\n\nThank you!`
    );
    window.location.href = `mailto:careers@bhavaglobal.com?subject=${subject}&body=${body}`;
  };

  const scrollToJobs = () => {
    jobsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={styles.careerPage}>
      <Seo
        title="Careers at Bhava: | The Spiritual Company"
        description="Join our sacred mission. Build thoughtful digital tools and authentic artisanal rituals for modern homes."
        canonical={`${siteOrigin()}/career`}
      />
      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>Join Our Mission</h1>
        <p>
          Be part of a team dedicated to preserving sacred Indian traditions,
          mindful living, and authentic craftsmanship.
        </p>
        <button className={styles.applyBtn} type="button" onClick={scrollToJobs}>
          View Open Positions
        </button>
      </section>

      {/* Why Join Us */}
      <section className={styles.whySection}>
        <h2>Why Work With Us?</h2>
        <div className={styles.cards}>
          <div className={styles.card}>
            <h3>Purpose-Driven Work</h3>
            <p>Every creation brings peace, reflection and sacred intention to daily homes.</p>
          </div>
          <div className={styles.card}>
            <h3>Mindful Culture</h3>
            <p>We honor contemplative pacing, thoughtful design and deep mutual respect.</p>
          </div>
          <div className={styles.card}>
            <h3>Growth &amp; Learning</h3>
            <p>Immerse yourself in authentic Vedic knowledge and cutting-edge craft.</p>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className={styles.jobsSection} ref={jobsRef} id="open-positions">
        <h2>Open Positions</h2>
        <div className={styles.jobList}>
          {jobListings.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.jobInfo}>
                <h3>{job.title}</h3>
                <p>{job.description}</p>
                <div className={styles.tags}>
                  <span className={styles.tag}>{job.type}</span>
                  <span className={styles.tag}>{job.location}</span>
                </div>
              </div>
              <button
                className={styles.applyBtn}
                type="button"
                onClick={() => handleApply(job.title)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Career;