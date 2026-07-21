import styles from "./FundRaiser.module.css";

function FundRaiser() {
  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          <img
            src="/Diya.png"
            alt="A quiet offering for our Bharat"
            className={styles.image}
          />
        </div>

        <div className={styles.content}>
          <p className={styles.kicker}>A quiet offering for our Bharat</p>
          <h2 className={styles.title}>
            Pray for the Families of Our Jawans and Martyrs
          </h2>

          <p className={styles.body}>
            In remembrance of the soldiers who stand at our borders with
            courage and quiet resolve.
          </p>
          <p className={styles.body}>
            May their families find strength, peace, and protection.
          </p>
          <p className={styles.body}>
            We light a lamp and offer our gratitude to those who guard the
            nation's honour.
          </p>

          <p className={styles.closing}>Jai Hind.</p>
        </div>
      </div>
    </section>
  );
}

export default FundRaiser;
