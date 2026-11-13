import React, { useCallback, useEffect, useState } from "react";
import s from "./AdminCatalog.module.css";
import { api, money, imgUrl, useDebounced, useNotice, slugify } from "./adminApi";
import { Notice, Confirm, ErrorList, StatusBadge, Modal, ImageLightbox } from "./common";
import ProductForm from "./ProductForm";
import QrDialog from "./QrDialog";

const STOCK_BADGE = { in: ["In stock", "bOk"], low: ["Low stock", "bWarn"], out: ["Out of stock", "bBad"] };

function CategoriesDialog({ onClose, onChanged }) {
  const [items, setItems] = useState([]);
  const [draft, setDraft] = useState({ label: "", blurb: "" });
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState("");
  const load = useCallback(() => api("/categories").then((j) => setItems(j.items)).catch(setError), []);
  useEffect(() => { load(); }, [load]);

  const save = async (c, patch) => {
    setError(null);
    try {
      const j = await api(`/categories/${c.id}`, { method: "PUT", body: { ...c, ...patch } });
      setMsg(j.message);
      await load();
      onChanged();
    } catch (e) { setError(e); }
  };
  const add = async () => {
    setError(null);
    try {
      const j = await api("/categories", { method: "POST", body: { id: slugify(draft.label), label: draft.label, blurb: draft.blurb, sortOrder: items.length + 1 } });
      setMsg(j.message);
      setDraft({ label: "", blurb: "" });
      await load();
      onChanged();
    } catch (e) { setError(e); }
  };
  return (
    <Modal title="Categories" onClose={onClose}>
      <p className={s.hint} style={{ marginTop: 0 }}>The storefront navigation tabs come from these categories (PDF §9.1). A category with active products cannot be hidden.</p>
      <ErrorList error={error} />
      {msg && <div className={`${s.notice} ${s.nOk}`}>✓ {msg}</div>}
      {items.map((c) => (
        <div key={c.id} className={`${s.rowEdit} ${s.kv}`}>
          <input className={s.input} defaultValue={c.label} onBlur={(e) => e.target.value !== c.label && save(c, { label: e.target.value })} aria-label="Category name" />
          <input className={s.input} defaultValue={c.blurb} onBlur={(e) => e.target.value !== c.blurb && save(c, { blurb: e.target.value })} aria-label="Description" />
          <label className={s.check}><input type="checkbox" checked={c.active} onChange={(e) => save(c, { active: e.target.checked })} /> Active</label>
        </div>
      ))}
      <div className={s.sect}>Add category</div>
      <div className={`${s.rowEdit} ${s.kv}`}>
        <input className={s.input} placeholder="Name" value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
        <input className={s.input} placeholder="Short description" value={draft.blurb} onChange={(e) => setDraft({ ...draft, blurb: e.target.value })} />
        <button className={s.btn} onClick={add} disabled={!draft.label.trim()}>Add</button>
      </div>
    </Modal>
  );
}

export default function ProductsPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, say, closeNotice] = useNotice();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [form, setForm] = useState(null); // {slug?}
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showCats, setShowCats] = useState(false);
  const [preview, setPreview] = useState(null); // { images, start }
  const [qrProduct, setQrProduct] = useState(null); // { slug, name }
  const q = useDebounced(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api(`/products?${new URLSearchParams({ search: q, status, category })}`));
    } catch (e) { setError(e); } finally { setLoading(false); }
  }, [q, status, category]);
  useEffect(() => { load(); }, [load]);

  const run = async (fn, okMsg) => {
    setBusy(true);
    try {
      const j = await fn();
      say("ok", okMsg || j.message);
      setConfirm(null);
      await load();
    } catch (e) {
      say("err", e.message);
      setConfirm(null);
    } finally { setBusy(false); }
  };

  const setStatusOf = (p, st) => run(() => api(`/products/${p.slug}/status`, { method: "PATCH", body: { status: st } }));
  const askArchive = (p) => setConfirm({ title: "Archive product?", message: `"${p.name}" will be hidden from the storefront. Its orders, SKUs and stock history are preserved, and you can restore it any time.`, label: "Archive", action: () => setStatusOf(p, "archived") });
  const askDelete = (p) => setConfirm({ title: "Permanently delete?", message: `Delete "${p.name}" permanently? This only works if no order, collection or recommendation references it and all its stock is 0. Archive instead if unsure.`, label: "Delete permanently", danger: true, action: () => run(() => api(`/products/${p.slug}`, { method: "DELETE" })) });
  const askSync = () => setConfirm({
    title: "Sync approved catalogue?",
    message: "Adds any approved product, collection or category that is missing from the database, and creates 0-stock records for new SKUs. Existing products, edits and stock are never overwritten.",
    label: "Run sync",
    action: () => run(() => api("/sync", { method: "POST", body: {} })),
  });

  const items = data?.items || [];
  const emptyDb = data && items.length === 0 && !q && !status && !category;

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <div>
          <h2 className={s.h1}>Catalogue products</h2>
          <p className={s.sub}>The single place to manage every product, variant and SKU. Saved changes go straight to MongoDB and are live on the storefront immediately.</p>
        </div>
        <div className={s.actions}>
          <button className={`${s.btn} ${s.btnGhost}`} onClick={() => setShowCats(true)}>Categories</button>
          <button className={`${s.btn} ${s.btnGhost}`} onClick={askSync}>Sync approved catalogue</button>
          <button className={s.btn} onClick={() => setForm({})}>+ Add product</button>
        </div>
      </div>

      <Notice notice={notice} onClose={closeNotice} />
      <ErrorList error={error} />

      <div className={s.bar}>
        <input className={`${s.input} ${s.search}`} type="search" placeholder="Search name, slug or SKU…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search products" />
        <select className={s.select} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {data?.categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select className={s.select} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="">Active + inactive</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="archived">Archived</option>
        </select>
      </div>

      {loading && !data && <p className={s.loading}>Loading products…</p>}
      {emptyDb && (
        <div className={s.empty}>
          <h3>No products in the database yet</h3>
          <p>Load the approved catalogue (15 products, 30 collections) with one click — nothing existing is ever overwritten.</p>
          <button className={s.btn} onClick={askSync}>Sync approved catalogue</button>
        </div>
      )}
      {data && items.length === 0 && !emptyDb && <div className={s.empty}><h3>No products match</h3><p>Try clearing the search or filters.</p></div>}

      {items.length > 0 && (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Product</th><th>Category</th><th className={s.num}>Price</th><th>SKUs</th><th className={s.num}>Units</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.slug}>
                  <td data-label="Product">
                    <div style={{ display: "flex", gap: 10, alignItems: "center", textAlign: "left" }}>
                      <button type="button" className={s.thumbBtn} title="Preview / download image" aria-label={`Preview ${p.name} image`}
                        onClick={() => setPreview({ images: [p.image, ...(p.gallery || [])].filter(Boolean).map((u, k) => ({ url: u, name: k === 0 ? p.slug : `${p.slug}-${k + 1}` })), start: 0 })}>
                        <img className={s.thumb} src={imgUrl(p.image)} alt="" loading="lazy" />
                      </button>
                      <div><div className={s.name}>{p.name}</div><div className={s.muted}>{p.slug}{p.copyPending ? " · copy pending approval" : ""}</div></div>
                    </div>
                  </td>
                  <td data-label="Category">{data.categories.find((c) => c.id === p.category)?.label || p.category}</td>
                  <td data-label="Price" className={`${s.num} ${s.name}`}>{money(p.price)}</td>
                  <td data-label="SKUs"><span className={s.mono}>{p.variants.map((v) => v.sku).join(", ")}</span></td>
                  <td data-label="Units" className={s.num}>{p.totalUnits}</td>
                  <td data-label="Stock"><span className={`${s.badge} ${s[STOCK_BADGE[p.stockStatus][1]]}`}>{STOCK_BADGE[p.stockStatus][0]}</span></td>
                  <td data-label="Status"><StatusBadge status={p.status} /></td>
                  <td data-label="">
                    <div className={s.rowActions}>
                      <button className={`${s.btn} ${s.btnSm}`} onClick={() => setForm({ slug: p.slug })}>Edit</button>
                      <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setQrProduct({ slug: p.slug, name: p.name })}>Generate QR</button>
                      {p.status === "active" && <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setStatusOf(p, "inactive")} disabled={busy}>Deactivate</button>}
                      {p.status !== "active" && <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setStatusOf(p, "active")} disabled={busy}>{p.status === "archived" ? "Restore" : "Activate"}</button>}
                      {p.status !== "archived" && <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => askArchive(p)}>Archive</button>}
                      <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => askDelete(p)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && <p className={s.hint} style={{ marginTop: 10 }}>{items.length} product(s) shown. Set stock quantities in the Inventory section.</p>}

      {form && data && (
        <ProductForm slug={form.slug} meta={data} onClose={() => setForm(null)} onSaved={(msg) => { setForm(null); say("ok", msg); load(); }} />
      )}
      {preview && preview.images.length > 0 && <ImageLightbox images={preview.images} start={preview.start} onClose={() => setPreview(null)} />}
      {qrProduct && <QrDialog product={qrProduct} onClose={() => setQrProduct(null)} />}
      {showCats && <CategoriesDialog onClose={() => setShowCats(false)} onChanged={load} />}
      {confirm && <Confirm title={confirm.title} message={confirm.message} confirmLabel={confirm.label} danger={confirm.danger} busy={busy} onConfirm={confirm.action} onCancel={() => setConfirm(null)} />}
    </div>
  );
}
