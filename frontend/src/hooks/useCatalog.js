import { useEffect, useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Module-level cache so every page shares one catalogue fetch (availability refreshes after TTL / reload).
// The last catalogue is also kept in sessionStorage, so a reload / new page paints instantly from it
// while a fresh copy is fetched in the background (stale-while-revalidate).
const SS_KEY = "bhava_catalog_v1";
const readSession = () => {
  try {
    const raw = sessionStorage.getItem(SS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
let cache = readSession();
let inflight = null;
let fetchedAt = 0; // 0 = whatever is in `cache` came from sessionStorage and still has to be revalidated
const TTL = 60 * 1000;

function fetchCatalog(force = false) {
  if (!force && cache && Date.now() - fetchedAt < TTL) return Promise.resolve(cache);
  if (inflight) return inflight;
  inflight = fetch(`${API_BASE}/api/catalog`)
    .then((r) => r.json())
    .then((j) => {
      if (!j.success) throw new Error(j.message || "Catalogue unavailable");
      cache = j;
      fetchedAt = Date.now();
      try { sessionStorage.setItem(SS_KEY, JSON.stringify(j)); } catch { /* storage full/blocked */ }
      return j;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

/** Starts the catalogue download immediately (called before React renders) so it is ready when the home page needs it. */
export function prefetchCatalog() {
  fetchCatalog(false).catch(() => {});
}

export default function useCatalog() {
  const [catalog, setCatalog] = useState(cache);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(!cache);

  const run = useCallback((force, alive) => {
    fetchCatalog(force)
      .then((c) => alive() && (setCatalog(c), setError("")))
      .catch(() => alive() && setError("We could not load the catalogue. Please check your connection and try again."))
      .finally(() => alive() && setLoading(false));
  }, []);

  useEffect(() => {
    let live = true;
    run(false, () => live);
    return () => {
      live = false;
    };
  }, [run]);

  const reload = () => {
    setLoading(true);
    setError("");
    run(true, () => true);
  };

  return { catalog, loading, error, reload };
}
