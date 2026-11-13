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

export default function Seo({ title, description, canonical, image, jsonLd, type = "website" }) {
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
    return () => {
      document.title = prev;
    };
  }, [title, description, canonical, image, json, type]);
  return null;
}

export const siteOrigin = () => (typeof window !== "undefined" ? window.location.origin : "https://bhavaglobal.com");

export function clipDesc(text, fallback) {
  const raw = String(text || fallback || "").replace(/\s+/g, " ").trim();
  if (raw.length <= 160) return raw;
  return `${raw.slice(0, 157).trim()}…`;
}
