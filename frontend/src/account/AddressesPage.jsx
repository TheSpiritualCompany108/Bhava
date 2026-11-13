import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AccountPage.module.css";
import { AccountSidebar } from "./ProfilePage";
import {
  deleteAddressOnServer,
  persistBook,
  syncAddressesFromServer,
} from "./addressBook";

export default function AddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("bhava_token");
    if (!token) { navigate("/auth"); return; }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const book = await syncAddressesFromServer();
        if (!cancelled) setAddresses(book.list);
      } catch {
        if (!cancelled) setError("Unable to load addresses. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [navigate]);

  const setDefault = async (id) => {
    const next = addresses.map((a) => ({ ...a, makeDefault: a.id === id }));
    setAddresses(next);
    persistBook(next, id);
    const { pushAddressesToServer } = await import("./addressBook");
    const saved = await pushAddressesToServer(next);
    setAddresses(saved);
  };

  const remove = async (id) => {
    const next = await deleteAddressOnServer(id);
    setAddresses(next);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <AccountSidebar active="addresses" navigate={navigate} />
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Saved Addresses</h1>
          <p className={styles.pageSubtitle}>
            Addresses you save at checkout show up here for faster delivery next time.
          </p>

          {loading && <p className={styles.loadingText}>Loading addresses...</p>}
          {!loading && error && (
            <div className={styles.errorPanel}>
              <h3 className={styles.errorPanelTitle}>Couldn&apos;t load addresses</h3>
              <p className={styles.errorPanelText}>{error}</p>
            </div>
          )}

          {!loading && !error && addresses.length === 0 && (
            <div className={styles.emptyOrders}>
              <svg viewBox="0 0 64 64" fill="none" className={styles.emptyOrdersIcon}>
                <path d="M32 6C21.5 6 13 14.5 13 25c0 14 19 33 19 33s19-19 19-33C51 14.5 42.5 6 32 6z" stroke="#c9b99a" strokeWidth="2" strokeLinejoin="round"/>
                <circle cx="32" cy="25" r="6" stroke="#c9b99a" strokeWidth="2"/>
              </svg>
              <h3 className={styles.emptyOrdersTitle}>No saved addresses yet</h3>
              <p className={styles.emptyOrdersText}>
                Add a delivery address during checkout and it will appear here automatically.
              </p>
              <button type="button" className={styles.shopBtn} onClick={() => navigate("/products")}>
                Browse Products
              </button>
            </div>
          )}

          {!loading && !error && addresses.length > 0 && (
            <div className={styles.ordersList}>
              {addresses.map((a) => (
                <article key={a.id} className={styles.addressCard}>
                  <div className={styles.addressCardTop}>
                    <div>
                      <p className={styles.addressName}>
                        {a.fullName}
                        {a.makeDefault ? <span className={styles.addressDefault}>Default</span> : null}
                      </p>
                      <p className={styles.addressMeta}>
                        {a.countryCode || "+91"} {a.phone} · {a.addressType || "Home"}
                      </p>
                    </div>
                  </div>
                  <p className={styles.addressLines}>
                    {a.line1}
                    {a.line2 ? `, ${a.line2}` : ""}
                    <br />
                    {a.city}, {a.state} {a.pincode}
                  </p>
                  <div className={styles.addressActions}>
                    {!a.makeDefault && (
                      <button type="button" className={styles.editBtn} onClick={() => setDefault(a.id)}>
                        Make default
                      </button>
                    )}
                    <button type="button" className={styles.cancelBtn} onClick={() => remove(a.id)}>
                      Remove
                    </button>
                    <button type="button" className={styles.shopBtn} onClick={() => navigate("/checkout")}>
                      Use at checkout
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
