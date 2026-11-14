import styles from "./AppSection.module.css";

function AppSection() {
  return (
    <section className={styles.appSection}>
      <div className={styles.inner}>

        {/* ── Left: text ── */}
        <div className={styles.content}>
          <h2 className={styles.title}>
            Spirituality
          </h2>
          <h2 className={styles.titleAccent}>
            For Inner Peace
          </h2> 

          <p className={styles.description}>
            Temple wisdom, daily rituals, live darshan and a thriving
            community — all in one beautifully designed app. Available on
            iOS &amp; Android.
          </p>

          <div className={styles.badges}>
            {/* Google Play */}
            <a href="#" className={styles.badge} aria-label="Get it on Google Play">
              <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.76c.39.22.84.22 1.22 0L16.5 16.5l-3.18-3.18L3.18 23.76zM20.82 10.26 17.7 8.46l-3.54 3.54 3.54 3.54 3.15-1.82a1.75 1.75 0 0 0 0-3.46zM2.01 1.2A1.75 1.75 0 0 0 1.5 2.5v19a1.75 1.75 0 0 0 .51 1.3L13.26 12 2.01 1.2zm2.39-.96L15.84 11.5l-3.18-3.18L4.4.24z"/>
              </svg>
              <span className={styles.badgeText}>
                <span className={styles.badgeSub}>GET IT ON</span>
                <span className={styles.badgeMain}>Google Play</span>
              </span>
            </a>

            {/* App Store */}
            <a href="#" className={styles.badge} aria-label="Download on the App Store">
              <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className={styles.badgeText}>
                <span className={styles.badgeSub}>Download on the</span>
                <span className={styles.badgeMain}>App Store</span>
              </span>
            </a>
          </div>
        </div>

        {/* ── Right: phone mockups ── */}
        <div className={styles.visual}>
          <img
            src="/App mockups.png"
            alt="Bhava: App Mockup"
            className={styles.mockupImg}
          />
        </div>

      </div>
    </section>
  );
}

export default AppSection;
