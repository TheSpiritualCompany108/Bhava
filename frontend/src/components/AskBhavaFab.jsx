import React from "react";
import styles from "./AskBhavaFab.module.css";
import { warmupVoiceBackend } from "../utils/voiceBackendWarmup";

/** Floating Ask Bhava: control — opens chat / voice option dialog. */
export default function AskBhavaFab() {
  const open = () => {
    warmupVoiceBackend();
    window.dispatchEvent(new Event("bhava:dialog:open"));
  };

  return (
    <button
      type="button"
      className={styles.fab}
      onClick={open}
      aria-label="Ask Bhava:"
    >
      <span className={styles.ring} aria-hidden="true" />
      <span className={styles.logoWrap} aria-hidden="true">
        <img src="/bhava-icon.png" alt="" className={styles.logo} width={40} height={40} />
      </span>
      <span className={styles.label}>Ask Bhava:</span>
    </button>
  );
}
