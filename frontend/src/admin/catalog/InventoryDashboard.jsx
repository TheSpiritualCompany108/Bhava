import React, { useCallback, useEffect, useMemo, useState } from "react";
import s from "./AdminCatalog.module.css";
import { api, imgUrl, fmtDate, useDebounced, useNotice } from "./adminApi";
import { Notice, Modal, ErrorList, ImageLightbox } from "./common";

const STATUS = { in: ["In stock", "bOk"], low: ["Low stock", "bWarn"], out: ["Out of stock", "bBad"] };

function StockDialog({ row, onClose, onDone }) {
  const [mode, setMode] = useState("set");
  const [value, setValue] = useState(String(row.stock));
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const n = Number(value);
  const result = mode === "set" ? n : row.stock + n;
  const valid = Number.isInteger(n) && (mode === "set" ? n >= 0 : n !== 0 && result >= 0 && reason.trim().length > 0);

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const j = mode === "set"
        ? await api("/inventory", { method: "PUT", body: { sku: row.sku, stock: n, reason } })
        : await api("/inventory/adjust", { method: "POST", body: { sku: row.sku, delta: n, reason } });
      onDone(j.message);
    } catch (e) {
      setError(e);
      setBusy(false);
    }
  };

  return (
    <Modal title={`Update stock — ${row.sku}`} onClose={onClose} small
      footer={<>
        <button className={`${s.btn} ${s.btnGhost}`} onClick={onClose} disabled={busy}>Cancel</button>
        <button className={s.btn} onClick={save} disabled={!valid || busy}>{busy ? "Saving…" : "Save"}</button>
      </>}>
      <ErrorList error={error} />
      <p style={{ margin: "0 0 12px", fontSize: 13.5 }}><b>{row.productName}</b>{row.variantLabel !== "—" ? ` · ${row.variantLabel}` : ""}<br /><span className={s.muted}>Current stock: {row.stock}</span></p>
      <div className={s.tabs}>
        <button className={`${s.tab} ${mode === "set" ? s.tabOn : ""}`} onClick={() => { setMode("set"); setValue(String(row.stock)); }}>Set quantity</button>
        <button className={`${s.tab} ${mode === "adjust" ? s.tabOn : ""}`} onClick={() => { setMode("adjust"); setValue(""); }}>Adjust (+ / −)</button>
      </div>
      <div className={s.field}>
        <label className={s.label} htmlFor="stk-val">{mode === "set" ? "New stock quantity (physical count)" : "Change by (e.g. 10 or -2)"}</label>
        <input id="stk-val" className={s.input} type="number" step="1" value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
      </div>
      <div className={s.field} style={{ marginTop: 10 }}>
        <label className={s.label} htmlFor="stk-reason">Reason {mode === "adjust" ? "(required)" : "(optional)"}</label>
        <input id="stk-reason" className={s.input} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={mode === "adjust" ? "e.g. Received from supplier / damaged" : "e.g. Physical stock count"} maxLength={300} />
      </div>
      {Number.isInteger(n) && value !== "" && (
        <p className={s.hint} style={{ marginTop: 10 }}>
          Result: <b>{result}</b> units{result < 0 ? " — this would make stock negative and will be refused." : ""}
        </p>
      )}
    </Modal>
  );
}

function BulkStockDialog({ rows, onClose, onDone }) {
  const [qtyMap, setQtyMap] = useState(() => Object.fromEntries(rows.map((r) => [r.sku, String(r.stock)])));
  const [fillAll, setFillAll] = useState("");
  const [reason, setReason] = useState("Bulk stock count");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const items = rows.map((r) => ({ sku: r.sku, stock: Number(qtyMap[r.sku]) }));
  const valid = items.length > 0 && items.every((i) => Number.isInteger(i.stock) && i.stock >= 0);

  const applyFill = () => {
    const n = Number(fillAll);
    if (!Number.isInteger(n) || n < 0) return;
    setQtyMap(Object.fromEntries(rows.map((r) => [r.sku, String(n)])));
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      const j = await api("/inventory/bulk", {
        method: "PUT",
        body: { items, reason },
      });
      onDone(j.message);
    } catch (e) {
      setError(e);
      setBusy(false);
    }
  };

  return (
    <Modal
      title={`Bulk update stock — ${rows.length} SKU${rows.length === 1 ? "" : "s"}`}
      onClose={onClose}
      footer={<>
        <button className={`${s.btn} ${s.btnGhost}`} onClick={onClose} disabled={busy}>Cancel</button>
        <button className={s.btn} onClick={save} disabled={!valid || busy}>
          {busy ? "Saving…" : `Update ${rows.length} SKU${rows.length === 1 ? "" : "s"}`}
        </button>
      </>}
    >
      <ErrorList error={error} />
      <p className={s.hint} style={{ marginTop: 0 }}>
        Set a new absolute quantity for each selected SKU. Use “Apply to all” to fill the same count everywhere, then tweak individual rows if needed.
      </p>

      <div className={s.bulkFill}>
        <label className={s.label} htmlFor="bulk-fill">Apply same qty to all</label>
        <div className={s.bulkFillRow}>
          <input
            id="bulk-fill"
            className={s.input}
            type="number"
            min="0"
            step="1"
            value={fillAll}
            onChange={(e) => setFillAll(e.target.value)}
            placeholder="e.g. 20"
          />
          <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={applyFill} disabled={!Number.isInteger(Number(fillAll)) || Number(fillAll) < 0}>
            Apply to all
          </button>
        </div>
      </div>

      <div className={s.field} style={{ marginTop: 12 }}>
        <label className={s.label} htmlFor="bulk-reason">Reason (optional)</label>
        <input id="bulk-reason" className={s.input} value={reason} onChange={(e) => setReason(e.target.value)} maxLength={300} />
      </div>

      <div className={s.bulkTableWrap}>
        <table className={s.moves}>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Current</th>
              <th>New stock</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.sku}>
                <td>
                  <b>{r.productName}</b>
                  {r.variantLabel !== "—" ? <div className={s.muted}>{r.variantLabel}</div> : null}
                </td>
                <td className={s.mono}>{r.sku}</td>
                <td>{r.stock}</td>
                <td>
                  <input
                    className={s.input}
                    style={{ width: 96 }}
                    type="number"
                    min="0"
                    step="1"
                    value={qtyMap[r.sku] ?? ""}
                    onChange={(e) => setQtyMap((m) => ({ ...m, [r.sku]: e.target.value }))}
                    aria-label={`New stock for ${r.sku}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Modal>
  );
}

function HistoryDialog({ row, onClose }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    api(`/inventory/${encodeURIComponent(row.sku)}/movements`).then((j) => setItems(j.items)).catch(setError);
  }, [row.sku]);
  return (
    <Modal title={`Stock history — ${row.sku}`} onClose={onClose}>
      <ErrorList error={error} />
      {!items && !error && <p className={s.loading}>Loading…</p>}
      {items && items.length === 0 && <p className={s.muted}>No stock movements recorded yet.</p>}
      {items && items.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table className={s.moves}>
            <thead><tr><th>When</th><th>Type</th><th>Change</th><th>Before → After</th><th>Reason</th></tr></thead>
            <tbody>
              {items.map((m) => (
                <tr key={m._id}>
                  <td>{fmtDate(m.createdAt)}</td><td>{m.type}</td>
                  <td className={m.delta >= 0 ? s.plus : s.minus}>{m.delta > 0 ? `+${m.delta}` : m.delta}</td>
                  <td>{m.before} → {m.after}</td><td>{m.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
}

export default function InventoryDashboard() {
  const [summary, setSummary] = useState(null);
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, say, closeNotice] = useNotice();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [active, setActive] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState(null);
  const [dialog, setDialog] = useState(null); // {type:'stock'|'history'|'bulk', row?}
  const [threshold, setThreshold] = useState("");
  const [selected, setSelected] = useState(() => new Set());
  const q = useDebounced(search, 300);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ search: q, category, stockStatus, active, sort, order, page, limit });
      const [list, sum] = await Promise.all([api(`/inventory?${params}`), api("/inventory/summary")]);
      setData(list);
      setSummary(sum);
      setThreshold((t) => (t === "" ? String(sum.lowStockThreshold) : t));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [q, category, stockStatus, active, sort, order, page, limit]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [q, category, stockStatus, active, sort, order, limit]);
  useEffect(() => { setSelected(new Set()); }, [q, category, stockStatus, active, sort, order, page, limit]);
  useEffect(() => { api("/categories").then((j) => setCategories(j.items)).catch(() => {}); }, []);

  const pageSkus = useMemo(() => (data?.items || []).map((r) => r.sku), [data]);
  const allPageSelected = pageSkus.length > 0 && pageSkus.every((sku) => selected.has(sku));
  const selectedRows = useMemo(
    () => (data?.items || []).filter((r) => selected.has(r.sku)),
    [data, selected],
  );

  const toggleSku = (sku) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  };

  const togglePage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageSkus.forEach((sku) => next.delete(sku));
      else pageSkus.forEach((sku) => next.add(sku));
      return next;
    });
  };

  const saveThreshold = async () => {
    try {
      const j = await api("/settings", { method: "PUT", body: { lowStockThreshold: Number(threshold) } });
      say("ok", j.message);
      load();
    } catch (e) { say("err", e.message); }
  };

  const cards = summary && [
    ["Total products", summary.totalProducts, "", summary.definitions.totalProducts],
    ["Sellable SKUs / variants", summary.totalSkus, "", summary.definitions.totalSkus],
    ["In stock", summary.inStock, s.cardGood, summary.definitions.inStock],
    ["Low stock", summary.lowStock, s.cardWarn, summary.definitions.lowStock],
    ["Out of stock", summary.outOfStock, s.cardBad, summary.definitions.outOfStock],
    ["Total available units", summary.totalUnits, "", summary.definitions.totalUnits],
  ];

  return (
    <div className={s.wrap}>
      <div className={s.head}>
        <div>
          <h2 className={s.h1}>Inventory</h2>
          <p className={s.sub}>Live stock per SKU, straight from the database. Collections hold no stock of their own — a purchase deducts every component SKU, and any collection with an out-of-stock component is blocked automatically.</p>
        </div>
        <div className={s.actions}>
          <button
            className={s.btn}
            disabled={selected.size === 0}
            onClick={() => setDialog({ type: "bulk" })}
            title={selected.size === 0 ? "Select SKUs in the table first" : `Update ${selected.size} selected SKUs`}
          >
            Bulk update stock{selected.size ? ` (${selected.size})` : ""}
          </button>
          <button className={`${s.btn} ${s.btnGhost}`} onClick={load} disabled={loading}>↻ Refresh</button>
        </div>
      </div>

      <Notice notice={notice} onClose={closeNotice} />
      <ErrorList error={error} />

      {cards && (
        <div className={s.cards}>
          {cards.map(([label, n, cls, tip]) => (
            <div key={label} className={`${s.card} ${cls}`} title={tip}>
              <div className={s.cardNum}>{n.toLocaleString("en-IN")}</div>
              <div className={s.cardLbl}>{label}</div>
            </div>
          ))}
        </div>
      )}
      {summary && summary.unlinkedInventoryRecords > 0 && (
        <div className={`${s.notice} ${s.nErr}`}>⚠ {summary.unlinkedInventoryRecords} inventory record(s) are not linked to any product variant and are excluded from the totals.</div>
      )}

      <div className={s.bar}>
        <input className={`${s.input} ${s.search}`} type="search" placeholder="Search product, SKU or fragrance…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search inventory" />
        <select className={s.select} value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select className={s.select} value={stockStatus} onChange={(e) => setStockStatus(e.target.value)} aria-label="Stock status">
          <option value="">All stock levels</option><option value="in">In stock</option><option value="low">Low stock</option><option value="out">Out of stock</option>
        </select>
        <select className={s.select} value={active} onChange={(e) => setActive(e.target.value)} aria-label="Active status">
          <option value="">Active + inactive</option><option value="active">Active only</option><option value="inactive">Inactive only</option>
        </select>
        <select className={s.select} value={`${sort}:${order}`} onChange={(e) => { const [a, b] = e.target.value.split(":"); setSort(a); setOrder(b); }} aria-label="Sort">
          <option value="name:asc">Name A–Z</option><option value="name:desc">Name Z–A</option>
          <option value="stock:asc">Stock: low → high</option><option value="stock:desc">Stock: high → low</option>
          <option value="updated:desc">Recently updated</option><option value="updated:asc">Least recently updated</option>
        </select>
      </div>

      {summary && (
        <div className={s.bar} style={{ fontSize: 13 }}>
          <label htmlFor="thr" className={s.label}>Low-stock threshold</label>
          <input id="thr" className={s.input} style={{ width: 80 }} type="number" min="0" value={threshold} onChange={(e) => setThreshold(e.target.value)} />
          <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={saveThreshold} disabled={String(summary.lowStockThreshold) === threshold}>Save</button>
          <span className={s.hint}>Operational setting (not from the catalogue document): SKUs with 1–{summary.lowStockThreshold} units are “low”.</span>
        </div>
      )}

      {selected.size > 0 && (
        <div className={s.bulkBar}>
          <span><b>{selected.size}</b> SKU{selected.size === 1 ? "" : "s"} selected</span>
          <div className={s.rowActions}>
            <button className={`${s.btn} ${s.btnSm}`} onClick={() => setDialog({ type: "bulk" })}>Bulk update stock</button>
            <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setSelected(new Set())}>Clear selection</button>
          </div>
        </div>
      )}

      {loading && !data && <p className={s.loading}>Loading inventory…</p>}
      {data && data.total === 0 && (
        <div className={s.empty}>
          <h3>{summary?.totalSkus === 0 ? "No SKUs yet" : "No SKUs match these filters"}</h3>
          <p>{summary?.totalSkus === 0 ? "Add products in Catalogue (or sync the approved catalogue) and their SKUs will appear here." : "Try clearing the search or filters."}</p>
        </div>
      )}

      {data && data.total > 0 && (
        <>
          <div className={s.tableWrap}>
            <table className={s.table}>
              <thead>
                <tr>
                  <th className={s.checkCol}>
                    <input
                      type="checkbox"
                      checked={allPageSelected}
                      onChange={togglePage}
                      aria-label="Select all SKUs on this page"
                    />
                  </th>
                  <th>Product</th><th>Category</th><th>Variant</th><th>SKU</th><th className={s.num}>Available</th><th className={s.num}>Reserved</th><th>Status</th><th>Active</th><th>Last updated</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((r) => (
                  <tr key={r.sku} className={selected.has(r.sku) ? s.rowSelected : undefined}>
                    <td data-label="Select" className={s.checkCol}>
                      <input
                        type="checkbox"
                        checked={selected.has(r.sku)}
                        onChange={() => toggleSku(r.sku)}
                        aria-label={`Select ${r.sku}`}
                      />
                    </td>
                    <td data-label="Product">
                      <div style={{ display: "flex", gap: 10, alignItems: "center", textAlign: "left" }}>
                        <button type="button" className={s.thumbBtn} title="Preview / download image" aria-label={`Preview ${r.productName} image`}
                          onClick={() => r.image && setPreview([{ url: r.image, name: r.productSlug }])}>
                          <img className={s.thumb} src={imgUrl(r.image)} alt="" loading="lazy" />
                        </button>
                        <div><div className={s.name}>{r.productName}</div><div className={s.muted}>{r.productSlug}</div></div>
                      </div>
                    </td>
                    <td data-label="Category">{r.categoryLabel}</td>
                    <td data-label="Variant">{r.variantLabel}</td>
                    <td data-label="SKU" className={s.mono}>{r.sku}</td>
                    <td data-label="Available" className={`${s.num} ${s.name}`}>{r.stock}</td>
                    <td data-label="Reserved" className={s.num} title="Reservations are not used — stock is deducted atomically at checkout.">{r.reserved}</td>
                    <td data-label="Status"><span className={`${s.badge} ${s[STATUS[r.stockStatus][1]]}`}>{STATUS[r.stockStatus][0]}</span></td>
                    <td data-label="Active"><span className={`${s.badge} ${r.active ? s.bOk : s.bOff}`}>{r.active ? "Active" : "Inactive"}</span></td>
                    <td data-label="Last updated">{fmtDate(r.updatedAt)}</td>
                    <td data-label="">
                      <div className={s.rowActions}>
                        <button className={`${s.btn} ${s.btnSm}`} onClick={() => setDialog({ type: "stock", row: r })}>Update stock</button>
                        <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setDialog({ type: "history", row: r })}>History</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={s.pager}>
            <span>Showing {(data.page - 1) * data.limit + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total} SKUs</span>
            <div>
              <select className={s.select} value={limit} onChange={(e) => setLimit(Number(e.target.value))} aria-label="Rows per page">
                {[10, 25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
              </select>
              <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} disabled={data.page <= 1} onClick={() => setPage(data.page - 1)}>← Prev</button>
              <span>Page {data.page} / {data.pages}</span>
              <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} disabled={data.page >= data.pages} onClick={() => setPage(data.page + 1)}>Next →</button>
            </div>
          </div>
        </>
      )}

      {dialog?.type === "stock" && (
        <StockDialog row={dialog.row} onClose={() => setDialog(null)} onDone={(msg) => { setDialog(null); say("ok", msg); load(); }} />
      )}
      {dialog?.type === "bulk" && selectedRows.length > 0 && (
        <BulkStockDialog
          rows={selectedRows}
          onClose={() => setDialog(null)}
          onDone={(msg) => {
            setDialog(null);
            setSelected(new Set());
            say("ok", msg);
            load();
          }}
        />
      )}
      {dialog?.type === "history" && <HistoryDialog row={dialog.row} onClose={() => setDialog(null)} />}
      {preview && <ImageLightbox images={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}
