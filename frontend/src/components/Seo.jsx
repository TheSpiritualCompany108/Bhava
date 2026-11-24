import { useEffect } from "react";

function upsertMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!data) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function Seo({ title, description, canonical, image, jsonLd, type = "website", noindex = false }) {
  const json = jsonLd ? JSON.stringify(jsonLd) : "";
  useEffect(() => {
    const prev = document.title;
    if (title) document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertLink("canonical", canonical);
    upsertJsonLd("bhava-jsonld", json ? JSON.parse(json) : null);
    // The app is a SPA, so unknown URLs answer HTTP 200; noindex stops them being indexed as soft-404s.
    if (noindex) upsertMeta("name", "robots", "noindex, follow");
    return () => {
      document.title = prev;
      if (noindex) document.head.querySelector('meta[name="robots"]')?.remove();
    };
  }, [title, description, canonical, image, json, type, noindex]);
  return null;
}

// One canonical host everywhere (matches robots.txt, sitemap and the JSON-LD in index.html); falls back to the current origin on localhost.
export const siteOrigin = () => {
  const fixed = import.meta.env.VITE_SITE_URL;
  if (fixed) return String(fixed).replace(/\/+$/, "");
  return typeof window !== "undefined" ? window.location.origin : "https://www.bhavaglobal.com";
};

export function clipDesc(text, fallback) {
  const raw = String(text || fallback || "").replace(/\s+/g, " ").trim();
  if (raw.length <= 160) return raw;
  return `${raw.slice(0, 157).trim()}…`;
}
