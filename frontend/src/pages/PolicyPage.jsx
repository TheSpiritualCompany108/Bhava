import { Link, useLocation } from "react-router-dom";
import Seo, { siteOrigin, clipDesc } from "../components/Seo";
import { POLICIES } from "./policies";
import { InlineBack } from "../components/PageBack";
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
        title={`${page.title} | Bhava:`}
        description={clipDesc(page.sections[0].p[0])}
        canonical={`${siteOrigin()}/${slug}`}
      />
      <InlineBack fallback="/" />
      <p className={styles.kicker}>{page.kicker}</p>
      <h1>{page.title}</h1>
      {page.updated && <p className={styles.note}>Last updated: {page.updated}</p>}
      {page.sections.map((sec, i) => (
        <section key={i} className={styles.sec}>
          {sec.h && <h2>{sec.h}</h2>}
          {sec.p?.map((x) => <p key={x}>{x}</p>)}
          {sec.list && <ul>{sec.list.map((x) => <li key={x}>{x}</li>)}</ul>}
        </section>
      ))}
      <Link to="/contact">Contact</Link>
      {" · "}
      <Link to="/faq">FAQ</Link>
    </div>
  );
}
