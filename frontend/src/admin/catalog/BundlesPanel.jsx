import React, { useCallback, useEffect, useMemo, useState } from "react";
import s from "./AdminCatalog.module.css";
import { api, money, useDebounced, useNotice, slugify } from "./adminApi";
import { Notice, Confirm, ErrorList, StatusBadge, Modal } from "./common";

const VIA_FOR_MODE = { single: ["fragrance", "fixed"], pair: ["pair", "fixed"], camphor: ["camphor", "fixed"], all: ["fixed"], fixed: ["fixed"], none: ["fixed"] };
const VIA_LABEL = { fragrance: "Customer's fragrance (shared)", camphor: "Customer's camphor fragrance", pair: "Customer's fragrance pair", fixed: "Fixed variant" };
const EMPTY = { slug: "", name: "", group: "", tagline: "", description: "", status: "active", featured: false, launchPriority: "", homeModule: "", sortOrder: 0, approvalNotes: "", components: [{ bracelet: true }] };

function BundleForm({ slug, bundle, products, onClose, onSaved }) {
  const editing = !!slug;
  const [form, setForm] = useState(bundle ? { ...EMPTY, ...bundle, launchPriority: bundle.launchPriority ?? "" } : EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const pmap = useMemo(() => Object.fromEntries(products.map((p) => [p.slug, p])), [products]);
  const fieldErr = (n) => error?.errors?.find((e) => e.field === n)?.message;

  const setComp = (i, patch) => set("components", form.components.map((c, j) => (j === i ? patch : c)));
  const bracelets = products.filter((p) => p.mode === "none");

  // Live price + what the customer must choose (derived exactly like the server does)
  const price = form.components.reduce((sum, c) => (c.bracelet ? sum + Math.max(0, ...bracelets.map((b) => b.price)) : sum + (pmap[c.product]?.price || 0)), 0);
  const needs = {
    fragrance: form.components.some((c) => c.via === "fragrance"),
    camphor: form.components.some((c) => c.via === "camphor"),
    pair: form.components.some((c) => c.via === "pair"),
    bracelets: form.components.filter((c) => c.bracelet).length,
  };
  const picks = [needs.fragrance && "a fragrance", needs.pair && "a fragrance pair", needs.camphor && "a camphor fragrance", needs.bracelets > 0 && (needs.bracelets === 1 ? "1 bracelet" : `${needs.bracelets} different bracelets`)].filter(Boolean);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const body = { ...form, launchPriority: form.featured ? Number(form.launchPriority) || null : null };
      const j = editing ? await api(`/bundles/${slug}`, { method: "PUT", body }) : await api("/bundles", { method: "POST", body });
      onSaved(j.message);
    } catch (e) { setError(e); setBusy(false); }
  };

  return (
    <Modal title={editing ? `Edit collection — ${form.name}` : "Add collection"} onClose={onClose}
      footer={<>
        <button className={`${s.btn} ${s.btnGhost}`} onClick={onClose} disabled={busy}>Cancel</button>
        <button className={s.btn} onClick={save} disabled={busy}>{busy ? "Saving…" : editing ? "Save changes" : "Create collection"}</button>
      </>}>
      <ErrorList error={error} />
      <div className={s.grid2}>
        <div className={s.field}>
          <label className={s.label} htmlFor="bf-name">Name</label>
          <input id="bf-name" className={`${s.input} ${fieldErr("name") ? s.invalid : ""}`} value={form.name} maxLength={120} onChange={(e) => { set("name", e.target.value); if (!editing) set("slug", slugify(e.target.value)); }} />
          {fieldErr("name") && <span className={s.errText}>{fieldErr("name")}</span>}
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="bf-slug">URL slug</label>
          <input id="bf-slug" className={`${s.input} ${fieldErr("slug") ? s.invalid : ""}`} value={form.slug} disabled={editing} onChange={(e) => set("slug", e.target.value)} />
          {fieldErr("slug") && <span className={s.errText}>{fieldErr("slug")}</span>}
        </div>
        <div className={s.field}><label className={s.label} htmlFor="bf-group">Group</label><input id="bf-group" className={s.input} value={form.group} onChange={(e) => set("group", e.target.value)} /></div>
        <div className={s.field}>
          <label className={s.label} htmlFor="bf-status">Status</label>
          <select id="bf-status" className={s.select} value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="active">Active (available)</option><option value="inactive">Inactive (hidden)</option><option value="archived">Archived</option>
          </select>
        </div>
        <div className={`${s.field} ${s.full}`}>
          <label className={s.label} htmlFor="bf-desc">Description (contents &amp; selection logic)</label>
          <textarea id="bf-desc" className={s.textarea} rows={3} value={form.description} maxLength={2000} onChange={(e) => set("description", e.target.value)} />
        </div>
        <div className={s.field}><label className={s.label} htmlFor="bf-tag">Tagline (optional)</label><input id="bf-tag" className={s.input} value={form.tagline} maxLength={200} onChange={(e) => set("tagline", e.target.value)} /></div>
        <div className={s.field}><label className={s.label} htmlFor="bf-sort">Catalogue number / order</label><input id="bf-sort" className={s.input} type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} /></div>
      </div>

      <div className={s.sect}>Launch featuring (PDF §6.8 — max 8)</div>
      {fieldErr("featured") && <div className={s.errText} style={{ marginBottom: 6 }}>{fieldErr("featured")}</div>}
      <div className={s.grid2}>
        <label className={s.check}><input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} /> Featured / promoted at launch</label>
        <div className={s.field}>
          <label className={s.label} htmlFor="bf-prio">Launch priority (1 = strongest)</label>
          <input id="bf-prio" className={s.input} type="number" min="1" disabled={!form.featured} value={form.launchPriority} onChange={(e) => set("launchPriority", e.target.value)} />
        </div>
        <div className={s.field}>
          <label className={s.label} htmlFor="bf-home">Homepage module</label>
          <select id="bf-home" className={s.select} value={form.homeModule} onChange={(e) => set("homeModule", e.target.value)}>
            <option value="">Not on homepage</option><option value="curated">Curated collections</option><option value="complete">Complete the ritual</option>
          </select>
        </div>
      </div>

      <div className={s.sect}>Components &amp; quantities</div>
      {fieldErr("components") && <div className={s.errText} style={{ marginBottom: 6 }}>{fieldErr("components")}</div>}
      {form.components.map((c, i) => {
        const p = pmap[c.product];
        return (
          <div key={i} className={s.variantRow} style={{ gridTemplateColumns: "minmax(0,1.3fr) minmax(0,1.3fr) minmax(0,1fr) auto" }}>
            <select className={s.select} value={c.bracelet ? "__bracelet" : c.product || ""} aria-label={`Component ${i + 1} product`}
              onChange={(e) => (e.target.value === "__bracelet" ? setComp(i, { bracelet: true }) : setComp(i, { product: e.target.value, via: (VIA_FOR_MODE[pmap[e.target.value]?.mode] || ["fixed"])[0], variant: undefined }))}>
              <option value="">Select product…</option>
              <option value="__bracelet">Any bracelet (customer chooses)</option>
              {products.map((x) => <option key={x.slug} value={x.slug}>{x.name} — {money(x.price)}</option>)}
            </select>
            {c.bracelet ? <span className={s.muted}>Customer picks one bracelet (no duplicates)</span> : (
              <select className={s.select} value={c.via || ""} aria-label={`Component ${i + 1} selection`}
                onChange={(e) => setComp(i, { product: c.product, via: e.target.value, variant: e.target.value === "fixed" ? p?.variants[0]?.key : undefined })}>
                {(VIA_FOR_MODE[p?.mode] || ["fixed"]).map((v) => <option key={v} value={v}>{VIA_LABEL[v]}</option>)}
              </select>
            )}
            {!c.bracelet && c.via === "fixed" ? (
              <select className={s.select} value={c.variant || ""} onChange={(e) => setComp(i, { ...c, variant: e.target.value })} aria-label="Fixed variant">
                {(p?.variants || []).map((v) => <option key={v.key} value={v.key}>{v.label}</option>)}
              </select>
            ) : <span />}
            <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => set("components", form.components.filter((_, j) => j !== i))} aria-label="Remove component">✕</button>
          </div>
        );
      })}
      <div className={s.actions}>
        <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => set("components", [...form.components, { product: "", via: "fragrance" }])}>+ Add product</button>
        <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => set("components", [...form.components, { bracelet: true }])}>+ Add bracelet slot</button>
      </div>
      <p className={s.hint}>Each component is quantity 1 per collection. Fragrance-linked components share one customer choice (same fragrance across formats).</p>

      <div className={s.preview} style={{ marginTop: 12 }}>
        <div>Computed price: <b>{money(price)}</b> <span className={s.muted}>— always the exact sum of the component prices (no discount, no compare-at price).</span></div>
        <div>Customer selects: <b>{picks.length ? picks.join(", ") : "nothing — fixed collection"}</b></div>
      </div>
      <div className={s.field} style={{ marginTop: 12 }}>
        <label className={s.label} htmlFor="bf-an">Approval notes (internal)</label>
        <textarea id="bf-an" className={s.textarea} rows={2} value={form.approvalNotes} onChange={(e) => set("approvalNotes", e.target.value)} />
      </div>
    </Modal>
  );
}

export default function BundlesPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, say, closeNotice] = useNotice();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [form, setForm] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const q = useDebounced(search, 250);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try { setData(await api("/bundles")); } catch (e) { setError(e); } finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const act = async (fn) => {
    setBusy(true);
    try { const j = await fn(); say("ok", j.message); await load(); } catch (e) { say("err", e.message); } finally { setBusy(false); setConfirm(null); }
  };
  const patch = (b, body) => act(() => api(`/bundles/${b.slug}`, { method: "PATCH", body }));

  const items = (data?.items || []).filter((b) => (!status || b.status === status) && (!featuredOnly || b.featured) && (!q || `${b.name} ${b.contentsText}`.toLowerCase().includes(q.toLowerCase())));
  const featuredCount = data?.featuredCount || 0;

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <div>
          <h2 className={s.h1}>Curated collections (bundles)</h2>
          <p className={s.sub}>All 30 approved collections live here. Prices are computed from the component products — never discounted. Only 8 priority collections are featured at launch; the others stay available for contextual recommendations.</p>
        </div>
        <div className={s.actions}><button className={s.btn} onClick={() => setForm({})}>+ Add collection</button></div>
      </div>

      <Notice notice={notice} onClose={closeNotice} />
      <ErrorList error={error} />

      <div className={s.cards} style={{ gridTemplateColumns: "repeat(4, minmax(0,1fr))" }}>
        <div className={s.card}><div className={s.cardNum}>{data?.items.length ?? "—"}</div><div className={s.cardLbl}>Collections</div></div>
        <div className={`${s.card} ${s.cardGood}`}><div className={s.cardNum}>{featuredCount}/8</div><div className={s.cardLbl}>Featured at launch</div></div>
        <div className={s.card}><div className={s.cardNum}>{data ? data.items.filter((b) => b.status === "active").length : "—"}</div><div className={s.cardLbl}>Active</div></div>
        <div className={`${s.card} ${s.cardWarn}`}><div className={s.cardNum}>{data ? data.items.filter((b) => b.status === "active" && !b.purchasable).length : "—"}</div><div className={s.cardLbl}>Active but unavailable (component out of stock)</div></div>
      </div>

      <div className={s.bar}>
        <input className={`${s.input} ${s.search}`} type="search" placeholder="Search name or component…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search collections" />
        <select className={s.select} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status"><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option></select>
        <label className={s.check}><input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} /> Featured only</label>
      </div>

      {loading && !data && <p className={s.loading}>Loading collections…</p>}
      {data && items.length === 0 && <div className={s.empty}><h3>{data.items.length === 0 ? "No collections yet" : "No collections match"}</h3><p>{data.items.length === 0 ? "Use “Sync approved catalogue” in Catalogue products to load the 30 approved collections." : "Try clearing the filters."}</p></div>}

      {items.length > 0 && (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>#</th><th>Collection</th><th>Components</th><th className={s.num}>Price</th><th>Launch</th><th>Status</th><th>Available</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.slug}>
                  <td data-label="#" className={s.muted}>{b.sortOrder}</td>
                  <td data-label="Collection"><div className={s.name} style={{ textAlign: "left" }}>{b.name}</div><div className={s.muted}>{b.group}{b.homeModule ? ` · home: ${b.homeModule}` : ""}</div></td>
                  <td data-label="Components" style={{ maxWidth: 320, fontSize: 12.5 }}>{b.contentsText}</td>
                  <td data-label="Price" className={`${s.num} ${s.name}`}>{money(b.price)}</td>
                  <td data-label="Launch">{b.featured ? <span className={`${s.badge} ${s.bStar}`}>★ Priority {b.launchPriority ?? "—"}</span> : <span className={s.muted}>—</span>}</td>
                  <td data-label="Status"><StatusBadge status={b.status} /></td>
                  <td data-label="Available"><span className={`${s.badge} ${b.purchasable ? s.bOk : s.bOff}`}>{b.purchasable ? "Yes" : "No"}</span></td>
                  <td data-label="">
                    <div className={s.rowActions}>
                      <button className={`${s.btn} ${s.btnSm}`} onClick={() => setForm({ slug: b.slug, bundle: b })}>Edit</button>
                      {b.status === "active"
                        ? <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} disabled={busy} onClick={() => patch(b, { status: "inactive", featured: false })}>Deactivate</button>
                        : <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} disabled={busy} onClick={() => patch(b, { status: "active" })}>Activate</button>}
                      {b.status === "active" && (b.featured
                        ? <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} disabled={busy} onClick={() => patch(b, { featured: false })}>Unfeature</button>
                        : <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} disabled={busy} onClick={() => patch(b, { featured: true, launchPriority: b.launchPriority || featuredCount + 1 })}>Feature</button>)}
                      <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => setConfirm({ b })}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && data && <BundleForm slug={form.slug} bundle={form.bundle} products={data.products} onClose={() => setForm(null)} onSaved={(m) => { setForm(null); say("ok", m); load(); }} />}
      {confirm && (
        <Confirm title="Permanently delete collection?" danger busy={busy} confirmLabel="Delete permanently"
          message={`Delete "${confirm.b.name}"? This is blocked if past orders or product recommendations reference it — deactivate it instead if unsure.`}
          onConfirm={() => act(() => api(`/bundles/${confirm.b.slug}`, { method: "DELETE" }))} onCancel={() => setConfirm(null)} />
      )}
    </div>
  );
}
