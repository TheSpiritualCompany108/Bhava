/** Peek JWT payload (no verify) — used only to spot admin tokens in the customer key. */
function peekJwt(token) {
  try {
    const part = String(token || "").split(".")[1];
    if (!part) return null;
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function isAdminJwt(token) {
  const payload = peekJwt(token);
  return Boolean(payload && (payload.id === "admin" || payload.role === "admin"));
}

/**
 * Admin used to write into `bhava_token` (same key as customers).
 * Move leftover admin JWTs to `bhava_admin_token` so customer APIs work again.
 * Returns a valid customer token, or null if none.
 */
export function getCustomerToken() {
  const token = localStorage.getItem("bhava_token");
  if (!token) return null;
  if (!isAdminJwt(token)) return token;

  if (!localStorage.getItem("bhava_admin_token")) {
    localStorage.setItem("bhava_admin_token", token);
  }
  localStorage.removeItem("bhava_token");
  return null;
}
