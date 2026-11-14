import React, { useState, useEffect } from "react";
import styles from "./BhavaOptionDialog.module.css";
import { warmupVoiceBackend } from "../utils/voiceBackendWarmup";

function BhavaOptionDialog({ isOpen, onClose, onSelectChat, onSelectCall }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      warmupVoiceBackend();
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close dialog">
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className={styles.header}>
          <div className={styles.iconCircle} aria-hidden="true">
            <img
              src="/bhava-icon.png"
              alt=""
              className={styles.brandLogo}
              width={36}
              height={36}
            />
          </div>
          <h3 className={styles.title}>Connect with Bhava:</h3>
          <p className={styles.subtitle}>Choose how you would like to interact with the AI assistant.</p>
        </div>

        <div className={styles.optionsGrid}>
          <button className={styles.optionCard} onClick={onSelectChat}>
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.chatIcon}`}>
                <span className="material-symbols-outlined">chat_bubble</span>
              </div>
              <span className={styles.badge}>Text AI</span>
            </div>
            <h4 className={styles.cardTitle}>Chat with Bhava:</h4>
            <p className={styles.cardDesc}>Text-based instant answers on rituals, sacred items, and practice wisdom.</p>
            <div className={styles.cardAction}>
              <span>Start Chat</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </button>

          <button
            className={styles.optionCard}
            onMouseEnter={warmupVoiceBackend}
            onClick={() => {
              warmupVoiceBackend();
              onSelectCall();
            }}
          >
            <div className={styles.cardHeader}>
              <div className={`${styles.cardIcon} ${styles.callIcon}`}>
                <span className="material-symbols-outlined">call</span>
              </div>
              <span className={styles.badgeLive}>Real-time Voice</span>
            </div>
            <h4 className={styles.cardTitle}>Call with Bhava:</h4>
            <p className={styles.cardDesc}>Live low-latency voice call powered by speech recognition & Neural TTS.</p>
            <div className={styles.cardActionCall}>
              <span>Start Call</span>
              <span className="material-symbols-outlined">mic</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BhavaOptionDialog;
