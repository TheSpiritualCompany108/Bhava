import { Link, useLocation } from "react-router-dom";
import Seo, { siteOrigin, clipDesc } from "../components/Seo";
import { POLICIES } from "./policies";
import styles from "./PolicyPage.module.css";

export default function PolicyPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, "");
  const page = POLICIES[slug];

  if (!page) {
    return (
      <div className={styles.page}>
        <h1>Page not found</h1>
        <Link to="/">← Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Seo
        title={`${page.title} | Bhava`}
        description={clipDesc(page.body[0])}
        canonical={`${siteOrigin()}/${slug}`}
      />
      <p className={styles.kicker}>{page.kicker}</p>
      <h1>{page.title}</h1>
      {page.body.map((p) => <p key={p}>{p}</p>)}
      <p className={styles.note}>This copy is a placeholder for the client. No legal terms are in force until this page is replaced.</p>
      <Link to="/contact">Contact</Link>
      {" · "}
      <Link to="/faq">FAQ</Link>
    </div>
  );
}
