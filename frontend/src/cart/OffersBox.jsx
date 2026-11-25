import React, { useEffect, useState } from "react";
import x from "./CartLayout.module.css";
import o from "./Offers.module.css";
import useOffers, { offersActions } from "../hooks/useOffers";
import { inr } from "../shop/shopUtils";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Myntra-style "Coupons" + "Donate" blocks for the price panel. Both are only requests:
 * the server prices them (see /api/catalog/cart) and re-checks everything at checkout.
 * `priced` = the server's pricing response; `donation` = public donation settings (null = Admin has it off).
 */
export default function OffersBox({ priced, donation: cfg }) {
  const offers = useOffers();
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [list, setList] = useState(null);
  const [custom, setCustom] = useState("");
  const subtotal = priced?.subtotal || 0;
  const applied = priced?.coupon;

  useEffect(() => {
    if (!open) return undefined;
    let dead = false;
    fetch(`${API_BASE}/api/catalog/coupons?subtotal=${subtotal}`)
      .then((r) => r.json())
      .then((j) => { if (!dead) setList(j.success ? j.coupons : []); })
      .catch(() => { if (!dead) setList([]); });
    return () => { dead = true; };
  }, [open, subtotal]);

  const apply = (c) => {
    const v = String(c || "").trim();
    if (!v) return;
    offersActions.applyCoupon(v);
    setCode("");
    setOpen(false);
  };

  const donating = offers.donation > 0;
  const preset = cfg?.amounts?.includes(offers.donation);
  const pickDonation = (n) => { setCustom(""); offersActions.setDonation(n); };
  const onCustom = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 6);
    setCustom(digits);
    offersActions.setDonation(digits ? parseInt(digits, 10) : 0);
  };

  return (
    <>
      <section className={o.block} aria-label="Coupons">
        <h3 className={o.h}>COUPONS</h3>
        <div className={o.line}>
          <span className={o.tag} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z" /><circle cx="7.5" cy="7.5" r="1.2" /></svg>
          </span>
          {applied ? (
            <span className={o.appliedTxt}>
              <strong>{applied.code}</strong> applied
              <small>You save {inr(priced.couponDiscount)}</small>
            </span>
          ) : (
            <span className={o.lineTxt}>Apply Coupons</span>
          )}
          {applied ? (
            <button type="button" className={o.ghost} onClick={offersActions.removeCoupon}>REMOVE</button>
          ) : (
            <button type="button" className={o.ghost} onClick={() => setOpen((v) => !v)} aria-expanded={open}>{open ? "CLOSE" : "APPLY"}</button>
          )}
        </div>
        {offers.couponMsg && !applied && <p className={o.err} role="alert">{offers.couponMsg}</p>}

        {open && !applied && (
          <div className={o.panel}>
            <form className={o.codeRow} onSubmit={(e) => { e.preventDefault(); apply(code); }}>
              <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" maxLength={20} aria-label="Coupon code" autoComplete="off" />
              <button type="submit" disabled={!code.trim()}>Apply</button>
            </form>
            {list === null && <p className={o.hint}>Loading offers…</p>}
            {list && list.length === 0 && <p className={o.hint}>No coupons are available right now.</p>}
            {list && list.length > 0 && (
              <ul className={o.list}>
                {list.map((c) => (
                  <li key={c.code} className={c.eligible ? "" : o.off}>
                    <div>
                      <b className={o.codeTag}>{c.code}</b>
                      <span className={o.cTitle}>{c.title || (c.type === "percent" ? `${c.value}% off` : `₹${c.value} off`)}</span>
                      {!c.eligible && (
                        <small>Add {inr(Math.max(0, c.minOrder - subtotal))} more to unlock</small>
                      )}
                    </div>
                    <button type="button" disabled={!c.eligible} onClick={() => apply(c.code)}>APPLY</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      {cfg && (
        <section className={o.block} aria-label="Donation">
          {cfg.heading && <h3 className={o.h}>{cfg.heading.toUpperCase()}</h3>}
          <label className={o.check}>
            <input
              type="checkbox"
              checked={donating}
              onChange={(e) => (e.target.checked ? pickDonation(cfg.amounts?.[0] || 10) : (setCustom(""), offersActions.setDonation(0)))}
            />
            <span>{cfg.label || "Donate and make a difference"}</span>
          </label>
          <div className={o.chips} role="group" aria-label="Donation amount">
            {(cfg.amounts || []).map((n) => (
              <button key={n} type="button" className={offers.donation === n ? o.chipOn : ""} aria-pressed={offers.donation === n} onClick={() => pickDonation(offers.donation === n ? 0 : n)}>
                {inr(n)}
              </button>
            ))}
            <input
              className={`${o.other} ${donating && !preset ? o.chipOn : ""}`}
              inputMode="numeric"
              placeholder="Other ₹"
              aria-label="Other donation amount in rupees"
              value={custom || (donating && !preset ? String(offers.donation) : "")}
              onChange={(e) => onCustom(e.target.value)}
            />
          </div>
          {offers.donation > cfg.maxAmount && <p className={o.err} role="alert">The maximum donation is {inr(cfg.maxAmount)}.</p>}
          {offers.donationMsg && <p className={o.err} role="alert">{offers.donationMsg}</p>}
          {cfg.note && <p className={o.hint}>{cfg.note}</p>}
        </section>
      )}
    </>
  );
}

/** Price rows shared by cart + checkout. Discount rows only appear when the server reports a real discount. */
export function PriceRows({ priced, loading, shipping }) {
  const ready = !!priced;
  const val = (n) => (ready ? inr(n) : loading ? "…" : "—");
  const mrp = priced?.mrpTotal ?? 0;
  const pd = priced?.productDiscount ?? 0;
  const cd = priced?.couponDiscount ?? 0;
  const don = priced?.donation ?? 0;
  const saved = pd + cd;
  return (
    <div className={o.rows}>
      <div className={x.row}><span>Total MRP</span><span>{val(mrp)}</span></div>
      {pd > 0 && <div className={x.row}><span>Discount on MRP</span><span className={o.save}>− {inr(pd)}</span></div>}
      {cd > 0 && <div className={x.row}><span>Coupon Discount{priced?.coupon ? ` (${priced.coupon.code})` : ""}</span><span className={o.save}>− {inr(cd)}</span></div>}
      {don > 0 && <div className={x.row}><span>Donation</span><span>{inr(don)}</span></div>}
      <div className={x.row}>
        <span>Shipping</span>
        <span className={shipping === 0 && ready ? x.free : undefined}>{!ready ? "…" : shipping === 0 ? "FREE" : inr(shipping)}</span>
      </div>
      <div className={`${x.row} ${x.total}`}><span>Total Amount</span><span>{val(priced?.total ?? 0)}</span></div>
      {saved > 0 && <p className={o.saved}>🎉 You will save <strong>{inr(saved)}</strong> on this order</p>}
    </div>
  );
}
