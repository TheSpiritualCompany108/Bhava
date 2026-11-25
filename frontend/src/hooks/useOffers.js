import { useSyncExternalStore } from "react";

// Coupon code + donation the customer picked. Only a request: the server validates both and
// re-prices every time (cart page, checkout and order), so nothing here is trusted for money.
const KEY = "bhava_offers";
const listeners = new Set();

const read = () => {
  try {
    const o = JSON.parse(localStorage.getItem(KEY) || "{}");
    return {
      couponCode: typeof o.couponCode === "string" ? o.couponCode.slice(0, 20) : "",
      donation: Number.isInteger(o.donation) && o.donation > 0 ? o.donation : 0,
    };
  } catch {
    return { couponCode: "", donation: 0 };
  }
};

let state = { ...read(), couponMsg: "", donationMsg: "" }; // *Msg: transient server explanations, never stored
const snap = () => state;

function set(patch) {
  state = { ...state, ...patch };
  try { localStorage.setItem(KEY, JSON.stringify({ couponCode: state.couponCode, donation: state.donation })); } catch { /* private mode */ }
  listeners.forEach((l) => l());
}
const subscribe = (l) => { listeners.add(l); return () => listeners.delete(l); };

export const offersActions = {
  applyCoupon: (code) => set({ couponCode: String(code || "").trim().toUpperCase().slice(0, 20), couponMsg: "" }),
  removeCoupon: () => set({ couponCode: "", couponMsg: "" }),
  setDonation: (n) => set({ donation: Number.isInteger(n) && n > 0 ? n : 0, donationMsg: "" }),
  /** Called by the pricing hook when the server rejected the stored coupon/donation. */
  couponRejected: (msg) => set({ couponCode: "", couponMsg: msg }),
  donationRejected: (msg) => set({ donation: 0, donationMsg: msg }),
  clearAll: () => set({ couponCode: "", donation: 0, couponMsg: "", donationMsg: "" }),
};

export default function useOffers() {
  return useSyncExternalStore(subscribe, snap, snap);
}
