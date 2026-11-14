import React, { useEffect, useRef, useState } from "react";
import s from "./AdminCatalog.module.css";
import { api, imgUrl, slugify } from "./adminApi";
import { Modal, ErrorList, ImageLightbox } from "./common";

const EMPTY = {
  slug: "", name: "", category: "", price: "", mode: "single", status: "active", format: "", tagline: "", description: "", intention: "",
  pack: "", packQuantity: "", netWeight: "", fitNote: "", materials: "", usage: "", safety: "", storage: "", contents: [], faqs: [],
  image: "", gallery: [], seoTitle: "", seoDescription: "", copyPending: false, approvalNotes: "", sortOrder: 0,
  related: { upsell: "", upsellAlt: "", upsellBundle: "", crossSell: [], bundle: "" },
};

function Field({ label, hint, error, full, children, htmlFor }) {
  return (
    <div className={`${s.field} ${full ? s.full : ""}`}>
      <label className={s.label} htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && <span className={s.hint}>{hint}</span>}
      {error && <span className={s.errText}>{error}</span>}
    </div>
  );
}

/** Add / edit a catalogue product. Variants are limited to the approved fragrance matrix for the chosen type. */
export default function ProductForm({ slug, meta, onClose, onSaved }) {
  const editing = !!slug;
  const [form, setForm] = useState(EMPTY);
  const [variants, setVariants] = useState({}); // key -> {included, sku, active, existing}
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);
  const [lightbox, setLightbox] = useState(null); // start index into [main, ...gallery]
  const fileRef = useRef(null);
  const galRef = useRef(null);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setRel = (k, v) => setForm((f) => ({ ...f, related: { ...f.related, [k]: v } }));

  const allowed = meta.allowedVariants[form.mode] || [];
  const fieldErr = (name) => error?.errors?.find((e) => e.field === name)?.message;

  useEffect(() => {
    if (!editing) return;
    api(`/products/${slug}`).then(({ item }) => {
      setForm({ ...EMPTY, ...item, price: String(item.price), related: { ...EMPTY.related, ...(item.related || {}) } });
      setVariants(Object.fromEntries(item.variants.map((v) => [v.key, { included: true, sku: v.sku, active: v.active !== false, existing: true }])));
      setLoading(false);
    }).catch((e) => { setError(e); setLoading(false); });
  }, [editing, slug]);

  const changeMode = (mode) => { set("mode", mode); setVariants({}); };

  const upload = async (file, target) => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const { url } = await api("/upload", { method: "POST", form: fd });
      if (target === "main") set("image", url);
      else set("gallery", [...form.gallery, url].slice(0, 10));
    } catch (e) { setError(e); } finally { setUploading(false); }
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    const body = {
      ...form,
      price: Number(form.price),
      variants: allowed.filter((a) => variants[a.key]?.included).map((a) => ({ key: a.key, sku: variants[a.key].sku, active: variants[a.key].active !== false })),
    };
    try {
      const j = editing ? await api(`/products/${slug}`, { method: "PUT", body }) : await api("/products", { method: "POST", body });
      onSaved(j.message);
    } catch (e) {
      setError(e);
      setBusy(false);
      document.querySelector("[data-modal-top]")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const isBracelet = form.mode === "none";
  const rel = form.related;
  const otherProducts = meta.products.filter((p) => p.slug !== form.slug);

  return (
    <Modal title={editing ? `Edit product — ${form.name || slug}` : "Add product"} onClose={onClose}
      footer={<>
        <button className={`${s.btn} ${s.btnGhost}`} onClick={onClose} disabled={busy}>Cancel</button>
        <button className={s.btn} onClick={save} disabled={busy || loading || uploading}>{busy ? "Saving…" : editing ? "Save changes" : "Create product"}</button>
      </>}>
      <div data-modal-top />
      {loading ? <p className={s.loading}>Loading product…</p> : (
        <>
          <ErrorList error={error} />

          <div className={s.sect}>Basics</div>
          <div className={s.grid2}>
            <Field label="Exact catalogue product name" error={fieldErr("name")} htmlFor="pf-name">
              <input id="pf-name" className={`${s.input} ${fieldErr("name") ? s.invalid : ""}`} value={form.name} maxLength={120}
                onChange={(e) => { set("name", e.target.value); if (!editing && !slugTouched) set("slug", slugify(e.target.value)); }} />
            </Field>
            <Field label="URL slug" error={fieldErr("slug")} hint={editing ? "Cannot be changed after creation." : "Lowercase letters, numbers and hyphens."} htmlFor="pf-slug">
              <input id="pf-slug" className={`${s.input} ${fieldErr("slug") ? s.invalid : ""}`} value={form.slug} disabled={editing} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value); }} />
            </Field>
            <Field label="Category" error={fieldErr("category")} htmlFor="pf-cat">
              <select id="pf-cat" className={`${s.select} ${fieldErr("category") ? s.invalid : ""}`} value={form.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select…</option>
                {meta.categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Selling price (₹, approved MRP)" error={fieldErr("price")} hint="Inclusive of applicable GST. Collection prices follow automatically." htmlFor="pf-price">
              <input id="pf-price" className={`${s.input} ${fieldErr("price") ? s.invalid : ""}`} type="number" min="0" step="1" value={form.price} onChange={(e) => set("price", e.target.value)} />
            </Field>
            <Field label="Variant type" error={fieldErr("mode")} hint={editing ? "Cannot be changed after creation." : "Decides which fragrance variants are allowed (approved matrix only)."} htmlFor="pf-mode">
              <select id="pf-mode" className={s.select} value={form.mode} disabled={editing} onChange={(e) => changeMode(e.target.value)}>
                <option value="single">One fragrance (Guggal / Oud / Sandalwood)</option>
                <option value="pair">Fragrance pair (approved pairs only)</option>
                <option value="all">All three fragrances (fixed pack)</option>
                <option value="fixed">Guggal only (Sambrani)</option>
                <option value="camphor">Camphor (Guggal / Sandalwood)</option>
                <option value="none">No fragrance (bracelet / single item)</option>
              </select>
            </Field>
            <Field label="Status" error={fieldErr("status")} htmlFor="pf-status">
              <select id="pf-status" className={s.select} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="active">Active (live on storefront)</option><option value="inactive">Inactive (hidden)</option><option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Product format" hint="e.g. Incense sticks, Cones, Cups, Tablets, Bracelet" htmlFor="pf-format">
              <input id="pf-format" className={s.input} value={form.format} maxLength={60} onChange={(e) => set("format", e.target.value)} />
            </Field>
            <Field label="Display order" hint="Lower numbers appear first." htmlFor="pf-sort">
              <input id="pf-sort" className={s.input} type="number" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
            </Field>
          </div>

          <div className={s.sect}>Variants &amp; SKUs — every sellable variant has its own SKU and stock</div>
          {fieldErr("variants") && <div className={s.errText} style={{ marginBottom: 8 }}>{fieldErr("variants")}</div>}
          {allowed.map((a) => {
            const v = variants[a.key] || { included: false, sku: "", active: true, existing: false };
            const upd = (patch) => setVariants((cur) => ({ ...cur, [a.key]: { ...v, ...patch } }));
            return (
              <div key={a.key} className={`${s.variantRow} ${v.included && !v.active ? s.variantOff : ""}`}>
                <input type="checkbox" checked={v.included} disabled={v.existing} onChange={(e) => upd({ included: e.target.checked })} aria-label={`Include ${a.label}`} />
                <span><b>{a.label}</b>{v.existing && <span className={s.hint}> · existing</span>}</span>
                <input className={`${s.input} ${s.mono}`} placeholder="SKU (e.g. SN-DIS-GUG)" value={v.sku} disabled={v.existing || !v.included} maxLength={31}
                  onChange={(e) => upd({ sku: e.target.value.toUpperCase() })} aria-label={`SKU for ${a.label}`} />
                <label className={s.check}><input type="checkbox" checked={v.active} disabled={!v.included} onChange={(e) => upd({ active: e.target.checked })} /> Active</label>
              </div>
            );
          })}
          <span className={s.hint}>Existing SKUs are locked (they are linked to stock and past orders) — deactivate a variant instead. New variants start at 0 stock.</span>

          <div className={s.sect}>Descriptions</div>
          <div className={s.grid2}>
            <Field label="Short description (product card)" full htmlFor="pf-tag"><input id="pf-tag" className={s.input} value={form.tagline} maxLength={200} onChange={(e) => set("tagline", e.target.value)} /></Field>
            <Field label="Full description" full hint="Use approved catalogue copy only — no medical, healing or guaranteed-outcome claims." htmlFor="pf-desc">
              <textarea id="pf-desc" className={s.textarea} rows={4} value={form.description} maxLength={4000} onChange={(e) => set("description", e.target.value)} />
            </Field>
            {isBracelet && <Field label="Intention" htmlFor="pf-int"><input id="pf-int" className={s.input} value={form.intention} maxLength={300} onChange={(e) => set("intention", e.target.value)} /></Field>}
            {isBracelet && <Field label="Fit note" hint='Approved wording: "Strung on a flexible stretch cord for convenient wear."' htmlFor="pf-fit"><input id="pf-fit" className={s.input} value={form.fitNote} maxLength={300} onChange={(e) => set("fitNote", e.target.value)} /></Field>}
            <Field label="Key product facts line" hint="Shown on cards, e.g. “21 sticks; 21 g net weight; one fragrance per pack.”" full htmlFor="pf-pack"><input id="pf-pack" className={s.input} value={form.pack} maxLength={300} onChange={(e) => set("pack", e.target.value)} /></Field>
          </div>

          <div className={s.sect}>Pack details</div>
          <div className={s.grid2}>
            <Field label="Pack quantity" hint="e.g. 21 sticks · 42 units (2 packs × 21)" htmlFor="pf-pq"><input id="pf-pq" className={s.input} value={form.packQuantity} maxLength={120} onChange={(e) => set("packQuantity", e.target.value)} /></Field>
            <Field label="Net weight (verified only)" hint="Leave blank until the weight is confirmed." htmlFor="pf-nw"><input id="pf-nw" className={s.input} value={form.netWeight} maxLength={60} onChange={(e) => set("netWeight", e.target.value)} /></Field>
          </div>
          <div style={{ marginTop: 10 }}>
            <span className={s.label}>Additional pack contents</span>
            {form.contents.map((c, i) => (
              <div key={i} className={`${s.rowEdit} ${s.kv}`}>
                <input className={s.input} placeholder="Label" value={c.label} onChange={(e) => set("contents", form.contents.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                <input className={s.input} placeholder="Value" value={c.value} onChange={(e) => set("contents", form.contents.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))} />
                <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => set("contents", form.contents.filter((_, j) => j !== i))} aria-label="Remove row">✕</button>
              </div>
            ))}
            <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => set("contents", [...form.contents, { label: "", value: "" }])}>+ Add row</button>
          </div>

          <div className={s.sect}>Usage, safety &amp; materials (approved text only)</div>
          <div className={s.grid2}>
            <Field label="Usage instructions" full htmlFor="pf-use"><textarea id="pf-use" className={s.textarea} rows={3} value={form.usage} onChange={(e) => set("usage", e.target.value)} /></Field>
            <Field label="Safety information" full htmlFor="pf-safe"><textarea id="pf-safe" className={s.textarea} rows={3} value={form.safety} onChange={(e) => set("safety", e.target.value)} /></Field>
            <Field label="Storage" htmlFor="pf-sto"><textarea id="pf-sto" className={s.textarea} rows={2} value={form.storage} onChange={(e) => set("storage", e.target.value)} /></Field>
            <Field label="Materials / ingredients" hint="Only where approved / supported by supplier documents." htmlFor="pf-mat"><textarea id="pf-mat" className={s.textarea} rows={2} value={form.materials} onChange={(e) => set("materials", e.target.value)} /></Field>
          </div>

          <div className={s.sect}>Images</div>
          <div className={s.imgs}>
            {form.image && <div className={s.imgBox}><img src={imgUrl(form.image)} alt="Main" title="Click to preview / download" onClick={() => setLightbox(0)} /><button className={s.imgX} onClick={() => set("image", "")} aria-label="Remove main image">✕</button></div>}
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files[0], "main"); e.target.value = ""; }} />
            <button className={`${s.btn} ${s.btnGhost}`} onClick={() => fileRef.current.click()} disabled={uploading}>{uploading ? "Uploading…" : form.image ? "Replace main image" : "Upload main image"}</button>
          </div>
          <div className={s.hint} style={{ margin: "6px 0 12px" }}>Main image: {form.image || "none"}</div>
          <span className={s.label}>Gallery (front, close-up, packaging, contents, scale)</span>
          <div className={s.imgs} style={{ marginTop: 6 }}>
            {form.gallery.map((g, i) => (
              <div key={g + i} className={s.imgBox}><img src={imgUrl(g)} alt={`Gallery ${i + 1}`} title="Click to preview / download" onClick={() => setLightbox((form.image ? 1 : 0) + i)} /><button className={s.imgX} onClick={() => set("gallery", form.gallery.filter((_, j) => j !== i))} aria-label="Remove image">✕</button></div>
            ))}
            <input ref={galRef} type="file" accept="image/*" hidden onChange={(e) => { upload(e.target.files[0], "gallery"); e.target.value = ""; }} />
            <button className={`${s.btn} ${s.btnGhost}`} onClick={() => galRef.current.click()} disabled={uploading || form.gallery.length >= 10}>+ Add gallery image</button>
          </div>

          <div className={s.sect}>FAQs (product-specific)</div>
          {form.faqs.map((f, i) => (
            <div key={i} className={s.rowEdit} style={{ border: "1px solid #eee3d3", borderRadius: 8, padding: 8 }}>
              <input className={s.input} placeholder="Question" value={f.q} maxLength={200} onChange={(e) => set("faqs", form.faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} />
              <textarea className={s.textarea} rows={2} placeholder="Answer" value={f.a} maxLength={1500} onChange={(e) => set("faqs", form.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} />
              <div><button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => set("faqs", form.faqs.filter((_, j) => j !== i))}>Remove FAQ</button></div>
            </div>
          ))}
          <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => set("faqs", [...form.faqs, { q: "", a: "" }])}>+ Add FAQ</button>
          <div className={s.hint} style={{ marginTop: 4 }}>Quantity, fragrance, contents and shipping FAQs are generated automatically from the product data.</div>

          <div className={s.sect}>SEO</div>
          <div className={s.grid2}>
            <Field label={`SEO title (${form.seoTitle.length}/70)`} full htmlFor="pf-st"><input id="pf-st" className={s.input} maxLength={70} value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} placeholder="Defaults to “Product name | Bhava:”" /></Field>
            <Field label={`SEO description (${form.seoDescription.length}/170)`} full htmlFor="pf-sd"><textarea id="pf-sd" className={s.textarea} rows={2} maxLength={170} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} placeholder="Defaults to the short description" /></Field>
          </div>

          <div className={s.sect}>Recommendations (PDF §8.2)</div>
          {fieldErr("related") && <div className={s.errText} style={{ marginBottom: 8 }}>{fieldErr("related")}</div>}
          <div className={s.grid2}>
            <Field label="Primary upsell product" htmlFor="pf-up"><select id="pf-up" className={s.select} value={rel.upsell} onChange={(e) => setRel("upsell", e.target.value)}><option value="">None</option>{otherProducts.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></Field>
            <Field label="Alternative (“Also available”) product" htmlFor="pf-upa"><select id="pf-upa" className={s.select} value={rel.upsellAlt} onChange={(e) => setRel("upsellAlt", e.target.value)}><option value="">None</option>{otherProducts.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select></Field>
            <Field label="Relevant collection (shown on the product page)" htmlFor="pf-b"><select id="pf-b" className={s.select} value={rel.bundle} onChange={(e) => setRel("bundle", e.target.value)}><option value="">None</option>{meta.bundles.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}</select></Field>
            <Field label="Upsell collection" htmlFor="pf-ub"><select id="pf-ub" className={s.select} value={rel.upsellBundle} onChange={(e) => setRel("upsellBundle", e.target.value)}><option value="">None</option>{meta.bundles.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}</select></Field>
            <Field label="Cross-sell products (up to 6)" full>
              <div className={s.pickGrid}>
                {otherProducts.map((p) => (
                  <label key={p.slug} className={s.check}>
                    <input type="checkbox" checked={rel.crossSell.includes(p.slug)} disabled={!rel.crossSell.includes(p.slug) && rel.crossSell.length >= 6}
                      onChange={(e) => setRel("crossSell", e.target.checked ? [...rel.crossSell, p.slug] : rel.crossSell.filter((x) => x !== p.slug))} /> {p.name}
                  </label>
                ))}
              </div>
            </Field>
          </div>

          <div className={s.sect}>Approval tracking</div>
          <label className={s.check}><input type="checkbox" checked={form.copyPending} onChange={(e) => set("copyPending", e.target.checked)} /> Product copy is still awaiting client approval (shows a neutral “being finalised” note)</label>
          <Field label="Approval notes (internal)" htmlFor="pf-an"><textarea id="pf-an" className={s.textarea} rows={2} value={form.approvalNotes} onChange={(e) => set("approvalNotes", e.target.value)} /></Field>
        </>
      )}
      {lightbox !== null && (
        <ImageLightbox
          images={[form.image, ...form.gallery].filter(Boolean).map((u, k) => ({ url: u, name: `${form.slug || "product"}${k ? `-${k + 1}` : ""}` }))}
          start={lightbox} onClose={() => setLightbox(null)} />
      )}
    </Modal>
  );
}
