import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Tile/section images may be an absolute Vercel Blob URL (new uploads) or a
// relative /uploads path (legacy files bundled with the backend).
export const resolveHomepageImageUrl = (url) =>
  url?.startsWith("http") ? url : `${API_BASE}${url}`;

// Shown for an admin-created card/slide that hasn't had an image uploaded
// yet, so the layout never shows a broken image.
export const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#ece4da'/><text x='50%' y='50%' font-size='120' text-anchor='middle' dominant-baseline='middle' fill='#c9b8a0'>&#10022;</text></svg>",
  );

// Cached across mounts so navigating between pages doesn't re-fetch the
// same section content every time.
const cache = {};

// Fetches admin-edited overrides for a homepage section (e.g. "hero",
// "sacredKnowledge"). Returns {} until loaded — callers should merge this
// on top of their own hardcoded defaults rather than treating it as the
// full content, so the site still renders correctly with nothing saved.
export default function useHomepageSection(key) {
  const [data, setData] = useState(cache[key] || {});

  useEffect(() => {
    if (cache[key]) {
      setData(cache[key]);
      return;
    }
    let alive = true;
    fetch(`${API_BASE}/api/homepage/${key}`)
      .then((res) => res.json())
      .then((json) => {
        if (!alive) return;
        const value = json.success ? json.data || {} : {};
        cache[key] = value;
        setData(value);
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [key]);

  return data;
}
