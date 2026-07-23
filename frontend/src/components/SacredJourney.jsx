import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SacredJourney.module.css";

function SacredJourney() {
  const navigate = useNavigate();

  return (
    <section className={styles.sacredJourneySection}>
      <div className={styles.sacredContent}>
        <h1 className={styles.sacredTitle}>
          <span className={styles.titleBegin}>Begin Your </span>
          <span className={styles.titleSacred}>Sacred Journey</span>
        </h1>

        <p className={styles.sacredDescription}>
          Most days pass without pause. A simple ritual creates clarity.
        </p>

        <div className={styles.sacredButtons}>
          <button className={styles.btnPreorder} onClick={() => navigate("/products")}>
            Begin with Bhava:
          </button>
        </div>
      </div>
    </section>
  );
}

export default SacredJourney;
