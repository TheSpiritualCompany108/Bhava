import { useEffect, useState, useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Module-level cache so every page shares one catalogue fetch (availability refreshes after TTL / reload).
let cache = null;
let inflight = null;
let fetchedAt = 0;
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
      return j;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
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
