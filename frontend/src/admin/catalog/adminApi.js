import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/** Admin catalogue API. Throws Error(message) with .errors for field-level problems. */
export async function api(path, { method = "GET", body, form } = {}) {
  const token = localStorage.getItem("bhava_admin_token");
  const headers = { Authorization: `Bearer ${token}` };
  if (!form) headers["Content-Type"] = "application/json";
  let res, j;
  try {
    res = await fetch(`${API_BASE}/api/catalog/admin${path}`, { method, headers, body: form || (body ? JSON.stringify(body) : undefined) });
    j = await res.json();
  } catch {
    throw Object.assign(new Error("Could not reach the server. Nothing was changed."), { errors: [] });
  }
  if (!res.ok || !j.success) throw Object.assign(new Error(j.message || `Request failed (${res.status})`), { errors: j.errors || [], status: res.status });
  return j;
}

export const money = (n) => (n === null || n === undefined ? "—" : `₹${Number(n).toLocaleString("en-IN")}`);
export const imgUrl = (u) => (!u ? "/Products/Home Page Incense.png" : /^https?:/.test(u) ? u : u.startsWith("/uploads") ? API_BASE + u : u);
export const fmtDate = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "—");
export const slugify = (t) => String(t).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function useDebounced(value, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useNotice() {
  const [notice, setNotice] = useState(null);
  useEffect(() => {
    if (notice?.type !== "ok") return undefined;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);
  return [notice, (type, text) => setNotice({ type, text }), () => setNotice(null)];
}


/** Download an image (works for cross-origin /uploads too, via blob). Falls back to opening it in a new tab. */
export async function downloadImage(url, baseName = "image") {
  const abs = imgUrl(url);
  try {
    const res = await fetch(abs);
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const ext = (abs.split("?")[0].match(/\.([a-z0-9]{2,5})$/i)?.[1] || blob.type.split("/")[1] || "png").toLowerCase();
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = `${baseName}.${ext}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(href), 1500);
    return true;
  } catch {
    window.open(abs, "_blank", "noopener");
    return false;
  }
}
