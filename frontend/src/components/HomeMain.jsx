import React from "react";
import styles from "./HomeMain.module.css";
import ScrollDown from "./ScrollDown";

function HomeMain() {
  return (
    <div className={styles.homeMainHero}>

      <img
        src="./temple(4).png"
        id="hero-temple-img"
        alt="Temple Background"
        className={styles.homeMainHeroBgImage}
      />

      <div className={styles.homeMainContainer}>
        <div className={styles.homeMainTextLeft}>

          <h1 className={styles.homeMainHeroTitle}>
            <span className={styles.homeMainElevateText}> Awaken Bhava : Live Divine</span>
            <span className={styles.homeMainHighlight}>Every Day</span>
          </h1>

          <p className={styles.homeMainHeroDescription}>
           A  Simple  Daily  Ritual  System  For <br/> Modern Homes.
          </p>

          <p className={styles.homeMainHeroDescription1}> Ritual is not reserved for special occasions. <br /> It is the quiet return to yourself, every single day. </p>

          <div className={styles.homeMainHeroButtons}>
            <button className={styles.homeMainBtnPrimary}>Begin With Bhava</button>
            <button className={styles.homeMainBtnSecondary}>Explore the System</button>
          </div>

            <ScrollDown />

        </div>
      </div>

    </div>
  );
}

export default HomeMain;
