import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCatalog from "../../hooks/useCatalog";
import {
  imgSrc,
  inr,
  matchesSearchWords,
  productSearchText,
  bundleSearchText,
} from "../../shop/shopUtils";
import styles from "./ExpandingSearchDock.module.css";

const MAX_RESULTS = 8;

/**
 * Navbar search — expands inline and shows a live product dropdown as you type.
 */
export function ExpandingSearchDock({
  onSearch,
  placeholder = "Search incense, beads, rituals…",
}) {
  const navigate = useNavigate();
  const { catalog } = useCatalog();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef(null);
  const rootRef = useRef(null);

  const close = () => {
    setOpen(false);
    setQuery("");
    setActiveIdx(-1);
  };

  const results = useMemo(() => {
    const q = query.trim();
    if (!q || !catalog) return [];

    const products = (catalog.products || [])
      .filter((p) => matchesSearchWords(productSearchText(catalog, p), q))
      .map((p) => ({
        key: `p:${p.slug}`,
        kind: "product",
        slug: p.slug,
        name: p.name,
        subtitle: p.tagline || catalog.categories?.find((c) => c.id === p.category)?.label || "",
        price: p.price,
        image: p.image,
        to: `/product/${p.slug}`,
      }));

    const bundles = (catalog.bundles || [])
      .filter((b) => matchesSearchWords(bundleSearchText(catalog, b), q))
      .map((b) => ({
        key: `b:${b.slug}`,
        kind: "bundle",
        slug: b.slug,
        name: b.name,
        subtitle: b.tagline || "Collection",
        price: b.price,
        image: b.image,
        to: `/collection/${b.slug}`,
      }));

    return [...products, ...bundles].slice(0, MAX_RESULTS);
  }, [catalog, query]);

  const goToItem = (item) => {
    if (!item) return;
    close();
    navigate(item.to);
  };

  const submit = (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    if (activeIdx >= 0 && results[activeIdx]) {
      goToItem(results[activeIdx]);
      return;
    }
    if (results.length === 1) {
      goToItem(results[0]);
      return;
    }
    if (onSearch) {
      onSearch(q);
      close();
    }
  };

  useEffect(() => {
    setActiveIdx(-1);
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const t = requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    const onPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      cancelAnimationFrame(t);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  const onInputKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? results.length - 1 : i - 1));
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <div ref={rootRef} className={`${styles.dock} ${open ? styles.dockOpen : ""}`}>
      {!open ? (
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setOpen(true)}
          aria-label="Search"
          aria-expanded={false}
        >
          <Search className={styles.icon} strokeWidth={1.8} />
        </button>
      ) : (
        <div className={styles.openWrap}>
          <form className={styles.inlineForm} onSubmit={submit} role="search">
            <Search className={styles.fieldIcon} strokeWidth={1.8} aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={placeholder}
              className={styles.input}
              aria-label="Search products"
              aria-autocomplete="list"
              aria-controls="navbar-search-results"
              autoComplete="off"
            />
            {query ? (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => {
                  setQuery("");
                  setActiveIdx(-1);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <X className={styles.clearIcon} strokeWidth={1.8} />
              </button>
            ) : (
              <button type="button" className={styles.clearBtn} onClick={close} aria-label="Close search">
                <X className={styles.clearIcon} strokeWidth={1.8} />
              </button>
            )}
          </form>

          {showDropdown && (
            <div id="navbar-search-results" className={styles.dropdown} role="listbox">
              {results.length === 0 ? (
                <p className={styles.empty}>No products match “{query.trim()}”</p>
              ) : (
                <ul className={styles.list}>
                  {results.map((item, idx) => (
                    <li key={item.key}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={idx === activeIdx}
                        className={`${styles.item} ${idx === activeIdx ? styles.itemActive : ""}`}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => goToItem(item)}
                      >
                        <img
                          src={imgSrc(item.image)}
                          alt=""
                          className={styles.thumb}
                          loading="lazy"
                        />
                        <span className={styles.itemText}>
                          <span className={styles.itemName}>{item.name}</span>
                          {item.subtitle ? (
                            <span className={styles.itemSub}>{item.subtitle}</span>
                          ) : null}
                        </span>
                        <span className={styles.itemPrice}>{inr(item.price)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                className={styles.seeAll}
                onClick={() => {
                  const q = query.trim();
                  if (!q || !onSearch) return;
                  onSearch(q);
                  close();
                }}
              >
                Search all for “{query.trim()}”
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ExpandingSearchDock;
