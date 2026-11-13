/** Per-user address book (checkout + account). Never share across accounts. */

export const ADDR_LIST_KEY = "bhava_saved_addresses"; // legacy global — cleared on read
export const ADDR_SEL_KEY = "bhava_selected_address_id";
export const ADDR_LEGACY_KEY = "bhava_saved_address";
export const ADDR_OWNER_KEY = "bhava_address_owner_id";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function blankAddress(name = "") {
  return {
    fullName: name,
    countryCode: "+91",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "Home",
    makeDefault: true,
  };
}

/** Common dial codes for the checkout phone field. */
export const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA / Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+33", label: "France (+33)" },
  { code: "+81", label: "Japan (+81)" },
  { code: "+86", label: "China (+86)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+880", label: "Bangladesh (+880)" },
  { code: "+94", label: "Sri Lanka (+94)" },
];

function currentUserId() {
  try {
    const u = JSON.parse(localStorage.getItem("bhava_user") || "null");
    return u?.id ? String(u.id) : "";
  } catch {
    return "";
  }
}

function listKey(userId) {
  return userId ? `${ADDR_LIST_KEY}__${userId}` : ADDR_LIST_KEY;
}

function selKey(userId) {
  return userId ? `${ADDR_SEL_KEY}__${userId}` : ADDR_SEL_KEY;
}

/** Drop unscoped legacy keys so the next account never inherits them. */
export function clearSharedAddressCache() {
  localStorage.removeItem(ADDR_LIST_KEY);
  localStorage.removeItem(ADDR_SEL_KEY);
  localStorage.removeItem(ADDR_LEGACY_KEY);
  localStorage.removeItem(ADDR_OWNER_KEY);
}

export function clearAddressBookForUser(userId = currentUserId()) {
  if (!userId) {
    clearSharedAddressCache();
    return;
  }
  localStorage.removeItem(listKey(userId));
  localStorage.removeItem(selKey(userId));
}

export function loadAddressBook(userId = currentUserId()) {
  // Global keys are unsafe across accounts — never reuse them.
  clearSharedAddressCache();

  if (!userId) return { list: [], selectedId: "" };

  try {
    const list = JSON.parse(localStorage.getItem(listKey(userId)) || "[]");
    if (Array.isArray(list) && list.length) {
      const sel =
        localStorage.getItem(selKey(userId)) ||
        list.find((a) => a.makeDefault)?.id ||
        list[0].id;
      return { list, selectedId: sel };
    }
  } catch {
    /* ignore */
  }
  return { list: [], selectedId: "" };
}

export function persistBook(list, selectedId, userId = currentUserId()) {
  if (!userId) return;
  localStorage.setItem(listKey(userId), JSON.stringify(list));
  const sel = selectedId || list.find((a) => a.makeDefault)?.id || list[0]?.id || "";
  if (sel) localStorage.setItem(selKey(userId), sel);
  else localStorage.removeItem(selKey(userId));
}

function authHeaders() {
  const token = localStorage.getItem("bhava_token");
  return token
    ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
    : { "Content-Type": "application/json" };
}

/**
 * Server is source of truth for the logged-in user.
 * Never upload another account's local addresses into this user's book.
 */
export async function syncAddressesFromServer() {
  const userId = currentUserId();
  clearSharedAddressCache();

  if (!userId) return { list: [], selectedId: "" };

  try {
    const res = await fetch(`${API_BASE}/api/auth/addresses`, { headers: authHeaders() });
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      clearAddressBookForUser(userId);
      return { list: [], selectedId: "" };
    }

    if (!res.ok || !data.success) {
      // Keep only this user's local cache — do not invent addresses from elsewhere
      return loadAddressBook(userId);
    }

    const server = Array.isArray(data.addresses) ? data.addresses : [];
    const selectedId =
      server.find((a) => a.makeDefault)?.id || server[0]?.id || "";
    persistBook(server, selectedId, userId);
    return { list: server, selectedId };
  } catch {
    return loadAddressBook(userId);
  }
}

export async function pushAddressesToServer(list) {
  const userId = currentUserId();
  if (!userId) return list;

  try {
    const res = await fetch(`${API_BASE}/api/auth/addresses`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ addresses: list }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success && Array.isArray(data.addresses)) {
      const selectedId =
        data.addresses.find((a) => a.makeDefault)?.id || data.addresses[0]?.id || "";
      persistBook(data.addresses, selectedId, userId);
      return data.addresses;
    }
  } catch {
    /* local cache still holds this user's edits */
  }
  persistBook(list, list.find((a) => a.makeDefault)?.id || list[0]?.id || "", userId);
  return list;
}

export async function deleteAddressOnServer(id) {
  const userId = currentUserId();
  if (!userId) return [];

  try {
    const res = await fetch(`${API_BASE}/api/auth/addresses/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success && Array.isArray(data.addresses)) {
      const selectedId = data.addresses.find((a) => a.makeDefault)?.id || data.addresses[0]?.id || "";
      persistBook(data.addresses, selectedId, userId);
      return data.addresses;
    }
  } catch {
    /* fall through to local delete */
  }
  const { list } = loadAddressBook(userId);
  const next = list.filter((a) => a.id !== id);
  if (next.length && !next.some((a) => a.makeDefault)) next[0].makeDefault = true;
  persistBook(next, next[0]?.id || "", userId);
  return next;
}
