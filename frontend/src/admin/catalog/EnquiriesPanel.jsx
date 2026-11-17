import React, { useCallback, useEffect, useMemo, useState } from "react";
import s from "./AdminCatalog.module.css";
import { fmtDate, useDebounced, useNotice } from "./adminApi";
import { Notice } from "./common";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const STATUS_CLASS = { new: "bWarn", read: "bOk", replied: "bOk" };

async function contactApi(path = "", options = {}) {
  const token = localStorage.getItem("bhava_admin_token");
  const res = await fetch(`${API_BASE}/api/contact${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.success) throw new Error(j.message || `Request failed (${res.status})`);
  return j;
}

/** Admin → Enquiries: service booking requests (Services page) and Contact-page messages in one inbox. */
export default function EnquiriesPanel() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 250).trim().toLowerCase();
  const [notice, say, closeNotice] = useNotice();

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setRows((await contactApi()).contacts || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const setRowStatus = async (row, next) => {
    const prev = row.status;
    setRows((rs) => rs.map((r) => (r._id === row._id ? { ...r, status: next } : r)));
    try {
      await contactApi(`/${row._id}/status`, { method: "PATCH", body: JSON.stringify({ status: next }) });
    } catch (e) {
      setRows((rs) => rs.map((r) => (r._id === row._id ? { ...r, status: prev } : r)));
      say("err", e.message);
    }
  };

  const counts = useMemo(() => ({
    total: rows.length,
    fresh: rows.filter((r) => r.status === "new").length,
    bookings: rows.filter((r) => r.type === "booking").length,
    bookingsNew: rows.filter((r) => r.type === "booking" && r.status === "new").length,
  }), [rows]);

  const shown = useMemo(() => rows.filter((r) => {
    if (type === "booking" && r.type !== "booking") return false;
    if (type === "contact" && r.type === "booking") return false;
    if (status !== "all" && r.status !== status) return false;
    if (dq && ![r.name, r.mobile, r.email, r.service, r.description].some((v) => String(v || "").toLowerCase().includes(dq))) return false;
    return true;
  }), [rows, type, status, dq]);

  return (
    <div className={s.wrap}>
      <Notice notice={notice} onClose={closeNotice} />
      <div className={s.head}>
        <div>
          <h1 className={s.h1}>Enquiries &amp; Bookings</h1>
          <p className={s.sub}>Service booking requests from the Services page and messages from the Contact page. Call or write to the customer, then mark the status.</p>
        </div>
        <div className={s.actions}><button className={`${s.btn} ${s.btnGhost}`} onClick={load} disabled={loading}>{loading ? "Refreshing…" : "Refresh"}</button></div>
      </div>

      <div className={s.cards} style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        <div className={s.card}><div className={s.cardNum}>{counts.total}</div><div className={s.cardLbl}>Total enquiries</div></div>
        <div className={`${s.card} ${counts.fresh ? s.cardWarn : ""}`}><div className={s.cardNum}>{counts.fresh}</div><div className={s.cardLbl}>New (unanswered)</div></div>
        <div className={s.card}><div className={s.cardNum}>{counts.bookings}</div><div className={s.cardLbl}>Service bookings</div></div>
        <div className={`${s.card} ${counts.bookingsNew ? s.cardWarn : ""}`}><div className={s.cardNum}>{counts.bookingsNew}</div><div className={s.cardLbl}>New bookings</div></div>
      </div>

      <div className={s.bar}>
        <input className={`${s.input} ${s.search}`} placeholder="Search name, mobile, email, service, message…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search enquiries" />
        <select className={s.select} value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
          <option value="all">All types</option>
          <option value="booking">Service bookings</option>
          <option value="contact">Contact messages</option>
        </select>
        <select className={s.select} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Status">
          <option value="all">All statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
        </select>
      </div>

      {error && <div className={s.errBox || ""} role="alert" style={{ color: "#a2331f", margin: "0 0 12px" }}>{error}</div>}

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr><th>Received</th><th>Type</th><th>Customer</th><th>Message</th><th>Status</th></tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r._id} style={r.status === "new" ? { background: "#fffaf0" } : undefined}>
                <td style={{ whiteSpace: "nowrap" }}><span className={s.muted}>{fmtDate(r.createdAt)}</span></td>
                <td>
                  {r.type === "booking"
                    ? <><span className={`${s.badge} ${s.bWarn}`}>Booking</span><div className={s.name} style={{ marginTop: 4 }}>{r.service}</div></>
                    : <span className={`${s.badge} ${s.bOk}`}>Message</span>}
                </td>
                <td>
                  <div className={s.name}>{r.name}</div>
                  <div><a href={`tel:+91${r.mobile}`} className={s.mono}>{r.mobile}</a></div>
                  {r.email && <div><a href={`mailto:${r.email}`} className={s.muted}>{r.email}</a></div>}
                </td>
                <td style={{ maxWidth: 360, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{r.description}</td>
                <td>
                  <select
                    className={`${s.select} ${s[STATUS_CLASS[r.status]] || ""}`}
                    value={r.status}
                    onChange={(e) => setRowStatus(r, e.target.value)}
                    aria-label={`Status for ${r.name}`}
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                  </select>
                </td>
              </tr>
            ))}
            {!shown.length && (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: 28 }} className={s.muted}>{loading ? "Loading…" : rows.length ? "No enquiries match these filters." : "No enquiries yet."}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
