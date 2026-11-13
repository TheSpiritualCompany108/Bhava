import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountPage.module.css";

const BASE = import.meta.env.VITE_API_URL || "";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "" });
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const stored = localStorage.getItem("bhava_user");
    if (!stored) { navigate("/auth"); return; }
    const u = JSON.parse(stored);
    setUser(u);
    setForm({ name: u.name });
  }, [navigate]);

  const initials = user
    ? user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  const handleSave = async () => {
    if (!form.name.trim() || form.name.trim().length < 2) {
      setMsg({ text: "Name must be at least 2 characters.", type: "error" });
      return;
    }
    setSaving(true);
    setMsg({ text: "", type: "" });
    try {
      const token = localStorage.getItem("bhava_token");
      const res = await fetch(`${BASE}/api/auth/me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("bhava_user", JSON.stringify(data.user));
        setUser(data.user);
        setEditing(false);
        setMsg({ text: "Profile updated successfully!", type: "success" });
      } else {
        setMsg({ text: data.message || "Update failed.", type: "error" });
      }
    } catch {
      setMsg({ text: "Unable to connect. Please try again.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AccountSidebar active="profile" navigate={navigate} />

        <div className={styles.content}>
          <h1 className={styles.pageTitle}>My Profile</h1>

          {/* Avatar */}
          <div className={styles.avatarSection}>
            <div className={styles.bigAvatar}>
              {user.avatar
                ? <img src={user.avatar} alt={user.name} className={styles.bigAvatarImg} />
                : <span className={styles.bigAvatarInitials}>{initials}</span>
              }
            </div>
            <div>
              <p className={styles.avatarName}>{user.name}</p>
              <p className={styles.avatarSince}>Member since {new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</p>
            </div>
          </div>

          {/* Info Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Account Details</h2>
              {!editing && (
                <button className={styles.editBtn} onClick={() => setEditing(true)}>Edit</button>
              )}
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>Full Name</label>
                {editing ? (
                  <input
                    className={styles.fieldInput}
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    autoFocus
                  />
                ) : (
                  <p className={styles.fieldValue}>{user.name}</p>
                )}
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Email Address</label>
                <p className={styles.fieldValue}>{user.email}</p>
                <span className={styles.fieldNote}>Email cannot be changed</span>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Login Method</label>
                <p className={styles.fieldValue} style={{ textTransform: "capitalize" }}>{user.provider}</p>
              </div>

              <div className={styles.field}>
                <label className={styles.fieldLabel}>Account Status</label>
                <span className={styles.badge}>Active</span>
              </div>
            </div>

            {editing && (
              <div className={styles.editActions}>
                <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
                <button className={styles.cancelBtn} onClick={() => { setEditing(false); setForm({ name: user.name }); }}>
                  Cancel
                </button>
              </div>
            )}

            {msg.text && (
              <p className={msg.type === "success" ? styles.successMsg : styles.errorMsg}>
                {msg.text}
              </p>
            )}
          </div>

          {/* Stats row */}
          <div className={styles.statsRow}>
            <div className={styles.statBox} onClick={() => navigate("/account/orders")} style={{ cursor: "pointer" }}>
              <span className={styles.statNum}>—</span>
              <span className={styles.statLabel}>Orders Placed</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNum}>0</span>
              <span className={styles.statLabel}>Saved Addresses</span>
            </div>
            <div className={styles.statBox} onClick={() => navigate("/cart")} style={{ cursor: "pointer" }}>
              <span className={styles.statNum}>Cart</span>
              <span className={styles.statLabel}>View My Cart</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Shared sidebar used by all account pages
export function AccountSidebar({ active, navigate }) {
  const items = [
    { key: "profile",   label: "My Profile",         path: "/account/profile",   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
    { key: "orders",    label: "My Orders",           path: "/account/orders",    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg> },
    { key: "addresses", label: "Saved Addresses",     path: "/account/addresses", icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg> },
    { key: "support",   label: "Help & Support",      path: "/contact",           icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("bhava_token");
    localStorage.removeItem("bhava_user");
    try {
      const { clearSharedAddressCache } = await import("./addressBook");
      clearSharedAddressCache();
    } catch { /* ignore */ }
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      <h3 className={styles.sidebarHeading}>My Account</h3>
      <nav className={styles.sidebarNav}>
        {items.map(item => (
          <button
            key={item.key}
            className={`${styles.sidebarItem} ${active === item.key ? styles.sidebarItemActive : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className={styles.sidebarIcon}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <button className={styles.sidebarLogout} onClick={handleLogout}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 16, height: 16 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        Sign Out
      </button>
    </aside>
  );
}
