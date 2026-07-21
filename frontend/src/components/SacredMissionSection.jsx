// import React from 'react'
// import styles from './SacredMissionSection.module.css'

// export default function SacredMissionSection() {
//   return (
//     <section className={styles.sacredMission} aria-labelledby="sacred-mission-title">
//       <div className={styles.container}>
//         <div className={styles.textCol}>
//           <h2 id="sacred-mission-title" className={styles.title}>Our Sacred Mission</h2>
//           <p className={styles.body}>
//             Bhava is redefining the spiritual economy by honoring ancient wisdom through premium,
//             authentic products. We believe that spirituality deserves the same craftsmanship and
//             excellence as any luxury category.
//           </p>

//           <p className={styles.body}>
//             Every product carries the energy of intention—sourced from temple partnerships,
//             blessed by traditional practitioners, and designed for modern devotees who refuse to
//             compromise on quality or authenticity.
//           </p>

//           <p className={styles.body}>
//             We are building a movement where faith, commerce, and sustainability align—creating
//             sacred spaces in every home, every heart, and every ritual.
//           </p>
//         </div>

//         <div className={styles.imageCol} aria-hidden>
//           <div
//             className={styles.image}
//             role="img"
//             aria-label="Illustration for Our Sacred Mission"
//           />
//         </div>
//       </div>
//     </section>
//   )
// }

import React from "react";
import styles from "./SacredMissionSection.module.css";

export default function SacredMissionSection() {
  return (
    <section
      className={styles.sacredMission}
      aria-labelledby="sacred-mission-title"
    >
      <div className={styles.container}>
        <div className={styles.textCol}>
          <p className={styles.kicker}>Our Sacred Mission</p>
          <h2 id="sacred-mission-title" className={styles.title}>
            Living Presence
          </h2>
          <p className={styles.body}>
            Devotion has become occasional. Structure returns it gently to
            daily life. At Bhava, we do not create products; we design quiet
            systems for presence.
          </p>
          <ul className={styles.list}>
            <li>A single flame offered at dawn.</li>
            <li>The slow turning of beads between fingers.</li>
            <li>Smoke that rises and carries the mind home.</li>
          </ul>
          <p className={styles.body}>
            These small, repeated acts shape clarity, transforming scattered
            days into something steadier.
          </p>
          <p className={styles.closing}>
            Consistency is the quiet teacher. Stay with the practice.
          </p>
        </div>

        <div className={styles.imageCol}>
          <img
            src="/Sacred Mission.png"
            className={styles.image}
            alt="Praying figure illustration"
          />
        </div>
      </div>
    </section>
  );
}
