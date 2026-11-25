import React, { useCallback, useEffect, useState } from "react";
import { toast } from "../toast";
import s from "./AdminCatalog.module.css";
import { api, fmtDate } from "./adminApi";
import { Confirm, ErrorList, Modal } from "./common";

function Field({ label, hint, children, htmlFor }) {
  return (
    <div className={s.field}>
      <label className={s.label} htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <span className={s.hint}>{hint}</span>}
    </div>
  );
}

const toLocal = (d) => (d ? new Date(new Date(d).getTime() - new Date(d).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "");
const BLANK = { code: "", title: "", type: "percent", value: "", maxDiscount: "", minOrder: "", usageLimit: "", perUserLimit: "", startsAt: "", endsAt: "", active: true, visible: true };

function CouponForm({ coupon, onClose, onSaved }) {
  const editing = !!coupon;
  const [f, setF] = useState(editing ? { ...BLANK, ...coupon, startsAt: toLocal(coupon.startsAt), endsAt: toLocal(coupon.endsAt) } : BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const save = async () => {
    setBusy(true); setError(null);
    const body = { ...f, value: Number(f.value), startsAt: f.startsAt ? new Date(f.startsAt).toISOString() : null, endsAt: f.endsAt ? new Date(f.endsAt).toISOString() : null };
    try {
      const j = editing ? await api(`/coupons/${coupon.code}`, { method: "PUT", body }) : await api("/coupons", { method: "POST", body });
      toast.success(j.message || "Coupon saved.");
      onSaved();
    } catch (e) { setError(e); toast.error(e.message || "Could not save the coupon."); } finally { setBusy(false); }
  };
  return (
    <Modal title={editing ? `Edit ${coupon.code}` : "New coupon"} onClose={onClose}
      footer={<>
        <button className={`${s.btn} ${s.btnGhost}`} onClick={onClose} disabled={busy}>Cancel</button>
        <button className={s.btn} onClick={save} disabled={busy}>{busy ? "Saving…" : "Save coupon"}</button>
      </>}>
      <ErrorList error={error} />
      <div className={s.grid2}>
        <Field label="Code" htmlFor="cp-code" hint="Customers type this. Letters, numbers, - or _.">
          <input id="cp-code" className={s.input} value={f.code} disabled={editing} maxLength={20} onChange={(e) => set("code", e.target.value.toUpperCase())} />
        </Field>
        <Field label="Short line shown to customers" htmlFor="cp-title">
          <input id="cp-title" className={s.input} value={f.title} maxLength={120} onChange={(e) => set("title", e.target.value)} placeholder="e.g. 10% off your first ritual" />
        </Field>
        <Field label="Type" htmlFor="cp-type">
          <select id="cp-type" className={s.select} value={f.type} onChange={(e) => set("type", e.target.value)}>
            <option value="percent">Percent off (%)</option>
            <option value="flat">Flat amount off (₹)</option>
          </select>
        </Field>
        <Field label={f.type === "percent" ? "Percent (1–90)" : "Amount (₹)"} htmlFor="cp-val">
          <input id="cp-val" className={s.input} type="number" min="1" step="1" value={f.value} onChange={(e) => set("value", e.target.value)} />
        </Field>
        <Field label="Minimum order (₹)" htmlFor="cp-min" hint="Checked against the bag after product discounts. Empty = none.">
          <input id="cp-min" className={s.input} type="number" min="0" step="1" value={f.minOrder} onChange={(e) => set("minOrder", e.target.value)} />
        </Field>
        <Field label="Total uses allowed" htmlFor="cp-use" hint="Empty = unlimited.">
          <input id="cp-use" className={s.input} type="number" min="0" step="1" value={f.usageLimit} onChange={(e) => set("usageLimit", e.target.value)} />
        </Field>
        <Field label="Uses per customer" htmlFor="cp-pu" hint="Empty = unlimited. 1 = once per customer.">
          <input id="cp-pu" className={s.input} type="number" min="0" step="1" value={f.perUserLimit} onChange={(e) => set("perUserLimit", e.target.value)} />
        </Field>
        <Field label="Starts" htmlFor="cp-s"><input id="cp-s" className={s.input} type="datetime-local" value={f.startsAt} onChange={(e) => set("startsAt", e.target.value)} /></Field>
        <Field label="Ends" htmlFor="cp-e"><input id="cp-e" className={s.input} type="datetime-local" value={f.endsAt} onChange={(e) => set("endsAt", e.target.value)} /></Field>
        <label className={s.check}><input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} /> Active</label>
        <label className={s.check}><input type="checkbox" checked={f.visible} onChange={(e) => set("visible", e.target.checked)} /> Listed under “Apply Coupons” (untick for a secret code)</label>
      </div>
    </Modal>
  );
}

function BulkDiscountCard() {
  const [cats, setCats] = useState([]);
  const [pct, setPct] = useState("");
  const [cat, setCat] = useState("");
  const [busy, setBusy] = useState(false);
  const [ask, setAsk] = useState(null); // "apply" | "clear"
  useEffect(() => { api("/categories").then((j) => setCats(j.items || [])).catch(() => {}); }, []);
  const scope = cat ? `all “${cats.find((c) => c.id === cat)?.label || cat}” products` : "ALL products";
  const run = async () => {
    setBusy(true);
    try {
      const j = await api("/products/bulk-discount", { method: "POST", body: ask === "clear" ? { clear: true, category: cat } : { percent: Number(pct), category: cat } });
      toast.success(j.message);
      setAsk(null);
    } catch (e) { toast.error(e.message || "Could not apply."); setAsk(null); } finally { setBusy(false); }
  };
  const valid = Number.isInteger(Number(pct)) && Number(pct) >= 1 && Number(pct) <= 90;
  return (
    <div className={s.card} style={{ marginBottom: 18 }}>
      <h3 className={s.sect} style={{ marginTop: 0 }}>Product discount (MRP &amp; % off)</h3>
      <p className={s.sub} style={{ marginBottom: 12 }}>
        Set one discount for many products at once. Each product keeps its selling price; its MRP is raised so the customer sees “% OFF”.
        For a single product, edit it in Catalogue (Selling price · Discount % · MRP). If you change a selling price later, update its discount too.
      </p>
      <div className={s.grid2}>
        <Field label="Discount (%)" htmlFor="bd-p"><input id="bd-p" className={s.input} type="number" min="1" max="90" step="1" value={pct} onChange={(e) => setPct(e.target.value)} placeholder="e.g. 11" /></Field>
        <Field label="Apply to" htmlFor="bd-c">
          <select id="bd-c" className={s.select} value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All products</option>
            {cats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button className={s.btn} disabled={!valid} onClick={() => setAsk("apply")}>Apply discount</button>
        <button className={`${s.btn} ${s.btnGhost}`} onClick={() => setAsk("clear")}>Remove discount</button>
      </div>
      {ask && (
        <Confirm
          title={ask === "clear" ? "Remove discount" : "Apply discount"}
          message={ask === "clear" ? `Remove the MRP / discount from ${scope}?` : `Show ${pct}% OFF on ${scope}? Selling prices stay the same; each MRP is set above its selling price.`}
          confirmLabel={ask === "clear" ? "Remove" : "Apply"} busy={busy} onConfirm={run} onCancel={() => setAsk(null)}
        />
      )}
    </div>
  );
}

function DonationCard() {
  const [d, setD] = useState(null);
  const [amounts, setAmounts] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    api("/settings").then((j) => { setD(j.donation); setAmounts((j.donation.amounts || []).join(", ")); }).catch(setError);
  }, []);
  if (!d) return error ? <ErrorList error={error} /> : <div className={s.loading}>Loading…</div>;
  const set = (k, v) => setD((x) => ({ ...x, [k]: v }));
  const save = async () => {
    setBusy(true); setError(null);
    try {
      const j = await api("/settings", { method: "PUT", body: { donation: { ...d, amounts } } });
      setD(j.donation); setAmounts(j.donation.amounts.join(", "));
      toast.success("Donation settings saved.");
    } catch (e) { setError(e); toast.error(e.message || "Could not save."); } finally { setBusy(false); }
  };
  return (
    <div className={s.card} style={{ marginBottom: 18 }}>
      <h3 className={s.sect} style={{ marginTop: 0 }}>Donation at checkout</h3>
      <p className={s.sub} style={{ marginBottom: 12 }}>
        When on, customers can add a donation (₹) to their order. It is added to the order total and recorded on the order. Make sure you have a registered
        recipient and the right receipts before turning this on — you decide who receives the money.
      </p>
      <ErrorList error={error} />
      <label className={s.check} style={{ marginBottom: 12 }}><input type="checkbox" checked={!!d.enabled} onChange={(e) => set("enabled", e.target.checked)} /> Show the donation option on cart and checkout</label>
      <div className={s.grid2}>
        <Field label="Heading" htmlFor="dn-h"><input id="dn-h" className={s.input} value={d.heading} maxLength={120} onChange={(e) => set("heading", e.target.value)} /></Field>
        <Field label="Checkbox label" htmlFor="dn-l"><input id="dn-l" className={s.input} value={d.label} maxLength={120} onChange={(e) => set("label", e.target.value)} /></Field>
        <Field label="Quick amounts (₹, comma separated)" htmlFor="dn-a" hint="Up to 6, e.g. 10, 20, 50, 100"><input id="dn-a" className={s.input} value={amounts} onChange={(e) => setAmounts(e.target.value)} /></Field>
        <Field label="Maximum donation (₹)" htmlFor="dn-m"><input id="dn-m" className={s.input} type="number" min="1" value={d.maxAmount} onChange={(e) => set("maxAmount", e.target.value)} /></Field>
        <Field label="Note under the options (optional)" htmlFor="dn-n"><input id="dn-n" className={s.input} value={d.note} maxLength={300} onChange={(e) => set("note", e.target.value)} placeholder="Who receives it, receipt info…" /></Field>
      </div>
      <div style={{ marginTop: 12 }}><button className={s.btn} onClick={save} disabled={busy}>{busy ? "Saving…" : "Save donation settings"}</button></div>
    </div>
  );
}

export default function OffersPanel() {
  const [rows, setRows] = useState(null);
  const [form, setForm] = useState(null); // null | "new" | coupon
  const [del, setDel] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const load = useCallback(() => api("/coupons").then((j) => setRows(j.coupons)).catch(setError), []);
  useEffect(() => { load(); }, [load]);

  const remove = async () => {
    setBusy(true);
    try { const j = await api(`/coupons/${del.code}`, { method: "DELETE" }); toast.success(j.message); setDel(null); load(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const state = (c) => {
    const now = Date.now();
    if (!c.active) return ["Off", "bOff"];
    if (c.endsAt && now > new Date(c.endsAt)) return ["Expired", "bBad"];
    if (c.startsAt && now < new Date(c.startsAt)) return ["Scheduled", "bWarn"];
    if (c.usageLimit > 0 && c.usedCount >= c.usageLimit) return ["Used up", "bBad"];
    return ["Live", "bOk"];
  };

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <div>
          <h2 style={{ margin: 0 }}>Offers &amp; Donation</h2>
          <p className={s.sub}>Coupons customers can apply in the bag, and the optional donation. Product discounts: set one for many products below, or per product in Catalogue → Edit product.</p>
        </div>
        <div className={s.actions}><button className={s.btn} onClick={() => setForm("new")}>+ New coupon</button></div>
      </div>
      <BulkDiscountCard />
      <DonationCard />
      <ErrorList error={error} />
      {!rows ? <div className={s.loading}>Loading…</div> : rows.length === 0 ? (
        <div className={s.empty}><h3>No coupons yet</h3><p>Create one and it appears under “Apply Coupons” in the bag.</p></div>
      ) : (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Code</th><th>Offer</th><th>Min order</th><th>Used</th><th>Valid</th><th>Status</th><th /></tr></thead>
            <tbody>
              {rows.map((c) => {
                const [lbl, cls] = state(c);
                return (
                  <tr key={c.code}>
                    <td><span className={`${s.mono} ${s.name}`}>{c.code}</span><div className={s.muted}>{c.title}{c.visible ? "" : " · secret code"}</div></td>
                    <td>{c.type === "percent" ? `${c.value}% off${c.maxDiscount ? ` (max ₹${c.maxDiscount})` : ""}` : `₹${c.value} off`}</td>
                    <td className={s.num}>{c.minOrder ? `₹${c.minOrder}` : "—"}</td>
                    <td className={s.num}>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}</td>
                    <td className={s.muted}>{c.startsAt || c.endsAt ? `${c.startsAt ? fmtDate(c.startsAt) : "now"} → ${c.endsAt ? fmtDate(c.endsAt) : "no end"}` : "Always"}</td>
                    <td><span className={`${s.badge} ${s[cls]}`}>{lbl}</span></td>
                    <td><div className={s.rowActions}>
                      <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setForm(c)}>Edit</button>
                      <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => setDel(c)}>Delete</button>
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {form && <CouponForm coupon={form === "new" ? null : form} onClose={() => setForm(null)} onSaved={() => { setForm(null); load(); }} />}
      {del && <Confirm title="Delete coupon" message={`Delete ${del.code}? Orders already placed keep their record. To just stop it, edit and untick Active instead.`} confirmLabel="Delete" danger busy={busy} onConfirm={remove} onCancel={() => setDel(null)} />}
    </div>
  );
}
