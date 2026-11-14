import styles from "./AppPage.module.css";

function AppPage() {
  return (
    <section className={styles.appSection}>
      <div className={styles.inner}>

        {/* ── Left: text ── */}
        <div className={styles.content}>
          <h2 className={styles.title}>Spirituality</h2>
          <h2 className={styles.titleAccent}><span style={{ color: "#4A0B1D" }}>for inner peace</span></h2>

          <p className={styles.description}>
            Temple wisdom, daily rituals, live darshan and a thriving
            community — all in one beautifully designed app. Available on
            iOS &amp; Android.
          </p>

          <div className={styles.badges}>
            {/* Google Play */}
            <a href="#" className={styles.badge} aria-label="Get it on Google Play">
              <svg className={styles.badgeIcon} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="gp-blue" x1="8.4" x2="38.4" y1="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#32BDEF"/><stop offset="1" stopColor="#1EA2D4"/>
                  </linearGradient>
                  <linearGradient id="gp-green" x1="20" x2="44" y1="24" y2="24" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#6DDC3F"/><stop offset="1" stopColor="#33BA1E"/>
                  </linearGradient>
                  <linearGradient id="gp-yellow" x1="8.4" x2="41" y1="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#FFD844"/><stop offset="1" stopColor="#FFC51C"/>
                  </linearGradient>
                  <linearGradient id="gp-red" x1="8.4" x2="41" y1="12" y2="12" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#F7756E"/><stop offset="1" stopColor="#EC3B3F"/>
                  </linearGradient>
                </defs>
                {/* Body — blue */}
                <path fill="url(#gp-blue)" d="M9.43 44.15C8.57 44.6 8 45 8 45V3s.53.38 1.41.84L31 24 9.43 44.15z"/>
                {/* Right tip — green */}
                <path fill="url(#gp-green)" d="M40.39 29.11C40.95 28.8 44 27 44 24c0-3-3.06-4.8-3.61-5.11L31 24l9.39 5.11z"/>
                {/* Bottom — yellow */}
                <path fill="url(#gp-yellow)" d="M40.39 29.11 31 24 9.43 44.15c.87.46 1.87.63 2.98.38L40.39 29.11z"/>
                {/* Top — red */}
                <path fill="url(#gp-red)" d="M40.39 18.89 12.41 3.47C11.3 3.22 10.3 3.39 9.43 3.85L31 24l9.39-5.11z"/>
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

export default AppPage;
