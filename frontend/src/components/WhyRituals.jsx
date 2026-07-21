import styles from "./WhyRituals.module.css";

const introLines = [
  "Modern life teaches speed.",
  "Ritual teaches return.",
  "Every day asks something of us.",
];

const qualities = ["Attention.", "Patience.", "Presence."];

const outroLines = [
  "A simple daily practice creates a gentle pause between doing and being.",
  "It is not about perfection.",
];

const closingLine = "It is about returning—again and again—to what matters.";

function WhyRituals() {
  return (
    <section className={styles.ritualSection} aria-labelledby="why-rituals-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <h2 className={styles.title1} style={{ color: "#3e0918" }}>
            Why Ritual Matters ?
          </h2>

          <div className={styles.body}>
            {introLines.map((line) => (
              <p key={line}>{line}</p>
            ))}

            <ul className={styles.qualityList}>
              {qualities.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            {outroLines.map((line) => (
              <p key={line}>{line}</p>
            ))}

            <p style={{ color: "#E07B39", fontStyle: "italic" }}>{closingLine}</p>
          </div>
        </div>

        <div className={styles.imageShell}>
          <img
            className={styles.image}
            src="/whyrituals.png"
            alt="A person seated in a calm ritual practice with incense and candles"
          />
        </div>
      </div>
    </section>
  );
}

export default WhyRituals;
