import React from "react";
import styles from "../products/Products.module.css";
import {
  FORMAT_FILTERS, PRICE_FILTERS, INTENTION_FILTERS,
} from "./shopUtils";

const FRAGRANCE_FILTERS = ["guggal", "oud", "sandalwood"];

function Section({ title, children }) {
  return (
    <div className={styles.filterSection}>
      <h3 className={styles.filterSectionTitle}>{title}</h3>
      <div className={styles.filterOptions}>{children}</div>
    </div>
  );
}

function Opt({ active, onClick, children }) {
  return (
    <button
      type="button"
      className={`${styles.filterOpt} ${active ? styles.filterOptOn : ""}`}
      aria-pressed={active}
      onClick={onClick}
    >
      <span className={styles.filterCheck} aria-hidden="true">{active ? "✓" : ""}</span>
      <span>{children}</span>
    </button>
  );
}

/**
 * Left-side shop filters. Visibility of each group is Admin-controlled via catalog.shopFilters.
 */
export default function FilterDrawer({
  open,
  onClose,
  catalog,
  shopFilters,
  tabs,
  values,
  onSet,
  onClear,
  activeCount,
}) {
  const f = shopFilters || {};
  const { tab, fragrance, format, priceRange, intention, availability } = values;

  return (
    <>
      <div
        className={`${styles.filterBackdrop} ${open ? styles.filterBackdropOpen : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside
        className={`${styles.filterDrawer} ${open ? styles.filterDrawerOpen : ""}`}
        aria-hidden={!open}
        aria-label="Shop filters"
      >
        <div className={styles.filterDrawerHead}>
          <div>
            <p className={styles.filterKicker}>Refine</p>
            <h2 className={styles.filterDrawerTitle}>Filters</h2>
          </div>
          <button type="button" className={styles.filterClose} onClick={onClose} aria-label="Close filters">✕</button>
        </div>

        <div className={styles.filterDrawerBody}>
          {f.category !== false && (
            <Section title="Category">
              {tabs.map((t) => (
                <Opt key={t.id} active={tab === t.id} onClick={() => onSet("category", t.id === "all" ? "" : t.id)}>
                  {t.label}
                </Opt>
              ))}
            </Section>
          )}

          {f.fragrance !== false && (
            <Section title="Fragrance">
              <Opt active={!fragrance} onClick={() => onSet("fragrance", "")}>All fragrances</Opt>
              {FRAGRANCE_FILTERS.map((id) => (
                <Opt key={id} active={fragrance === id} onClick={() => onSet("fragrance", fragrance === id ? "" : id)}>
                  {catalog?.fragrances?.[id]?.label || id}
                </Opt>
              ))}
            </Section>
          )}

          {f.format !== false && (
            <Section title="Format">
              <Opt active={!format} onClick={() => onSet("format", "")}>All formats</Opt>
              {FORMAT_FILTERS.map((x) => (
                <Opt key={x.id} active={format === x.id} onClick={() => onSet("format", format === x.id ? "" : x.id)}>
                  {x.label}
                </Opt>
              ))}
            </Section>
          )}

          {f.price !== false && (
            <Section title="Price">
              <Opt active={!priceRange} onClick={() => onSet("price", "")}>All prices</Opt>
              {PRICE_FILTERS.map((x) => (
                <Opt key={x.id} active={priceRange === x.id} onClick={() => onSet("price", priceRange === x.id ? "" : x.id)}>
                  {x.label}
                </Opt>
              ))}
            </Section>
          )}

          {f.intention !== false && (
            <Section title="Intention">
              <Opt active={!intention} onClick={() => onSet("intention", "")}>All intentions</Opt>
              {INTENTION_FILTERS.map((x) => (
                <Opt key={x.id} active={intention === x.id} onClick={() => onSet("intention", intention === x.id ? "" : x.id)}>
                  {x.label}
                </Opt>
              ))}
            </Section>
          )}

          {f.availability !== false && (
            <Section title="Availability">
              <Opt active={!availability} onClick={() => onSet("availability", "")}>All</Opt>
              <Opt active={availability === "in-stock"} onClick={() => onSet("availability", availability === "in-stock" ? "" : "in-stock")}>
                In stock
              </Opt>
            </Section>
          )}
        </div>

        <div className={styles.filterDrawerFoot}>
          <button type="button" className={styles.filterClearBtn} onClick={onClear} disabled={activeCount === 0}>
            Clear all
          </button>
          <button type="button" className={styles.filterApplyBtn} onClick={onClose}>
            Show results
          </button>
        </div>
      </aside>
    </>
  );
}

export function FilterIconButton({ open, onClick, activeCount }) {
  return (
    <button
      type="button"
      className={`${styles.filterIconBtn} ${open ? styles.filterIconBtnOn : ""}`}
      onClick={onClick}
      aria-expanded={open}
      aria-controls="shop-filters"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="8" y1="12" x2="20" y2="12" />
        <line x1="12" y1="18" x2="20" y2="18" />
        <circle cx="6" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="10" cy="18" r="2" fill="currentColor" stroke="none" />
        <circle cx="14" cy="6" r="2" fill="currentColor" stroke="none" />
      </svg>
      <span>Filters</span>
      {activeCount > 0 && <span className={styles.filterBadge}>{activeCount}</span>}
    </button>
  );
}
