import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useCart } from "../context/CartContext";
import { warmupVoiceBackend } from "../utils/voiceBackendWarmup";
import ExpandingSearchDock from "./ui/ExpandingSearchDock";

const SHOP_NAV = [
  { label: "Shop All", to: "/products" },
  { label: "Incense Sticks", to: "/products?category=incense-sticks" },
  { label: "Bamboo-less Incense", to: "/products?category=bamboo-less-incense" },
  { label: "Incense Cones", to: "/products?category=incense-cones" },
  { label: "Sambrani & Camphor", to: "/products?category=sambrani-camphor" },
  { label: "Sacred Beads", to: "/products?category=sacred-beads" },
  { label: "Curated Collections", to: "/products?category=curated-collections" },
];

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const dropdownRef = useRef(null);
  const shopMenuRef = useRef(null);
  const { itemCount } = useCart();

  useEffect(() => {
    const stored = localStorage.getItem("bhava_user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setShopOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (shopMenuRef.current && !shopMenuRef.current.contains(e.target)) {
        setShopOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (!menuOpen && !shopOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShopOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    if (menuOpen) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen, shopOpen]);

  const handleLogout = async () => {
    localStorage.removeItem("bhava_token");
    localStorage.removeItem("bhava_user");
    try {
      const { clearSharedAddressCache } = await import("../account/addressBook");
      clearSharedAddressCache();
    } catch { /* ignore */ }
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  const closeMenu = () => {
    setMenuOpen(false);
    setShopOpen(false);
  };

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div
            className={styles.brandContainer}
            onClick={() => navigate("/")}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/");
            }}
          >
            <img src="/bhava-icon.png" alt="Bhava Logo" className={styles.logo} />
            <h2 className={styles.heading}>
              BHAVA
              <span className={styles.dotsBhava} aria-hidden="true">
                <span className={styles.dotName} />
                <span className={styles.dotName} />
              </span>
            </h2>
            <span className={styles.betaTag} aria-label="Beta">BETA</span>
          </div>

          {menuOpen && (
            <button
              type="button"
              className={styles.backdrop}
              aria-label="Close menu"
              onClick={closeMenu}
            />
          )}

          <div className={`${styles.navPanel} ${menuOpen ? styles.navPanelOpen : ""}`}>
            <ul className={styles.nav}>
              <li className={styles.navItem}>
                <button
                  type="button"
                  className={`${styles.navLink} ${styles.askBhava}`}
                  onClick={() => {
                    closeMenu();
                    warmupVoiceBackend();
                    window.dispatchEvent(new Event("bhava:dialog:open"));
                  }}
                >
                  <span className={styles.askBhavaSparkle} aria-hidden="true">✨</span>
                  <span className={styles.askBhavaText}>Ask Bhava:</span>
                </button>
              </li>
              <li
                ref={shopMenuRef}
                className={`${styles.navItem} ${styles.hasSubmenu} ${shopOpen ? styles.submenuOpen : ""}`}
                onMouseLeave={() => setShopOpen(false)}
              >
                <button
                  type="button"
                  className={`${styles.navLink} ${/^\/(products?|collection)(\/|$)/.test(location.pathname) ? styles.navLinkActive : ""}`}
                  aria-expanded={shopOpen}
                  aria-haspopup="true"
                  onClick={() => setShopOpen((o) => !o)}
                >
                  Products
                </button>
                <ul className={styles.submenu} aria-label="Shop categories">
                  {SHOP_NAV.map((n) => (
                    <li key={n.label}>
                      <Link to={n.to} className={styles.submenuLink} onClick={closeMenu}>
                        {n.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/explore-services") ? styles.navLinkActive : ""}`}
                  to="/explore-services"
                  onClick={closeMenu}
                >
                  Services
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/daily-horoscope") ? styles.navLinkActive : ""}`}
                  to="/daily-horoscope"
                  onClick={closeMenu}
                >
                  Horoscope
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/knowledge") ? styles.navLinkActive : ""}`}
                  to="/knowledge"
                  onClick={closeMenu}
                >
                  Bhakti
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/about") ? styles.navLinkActive : ""}`}
                  to="/about"
                  onClick={closeMenu}
                >
                  About
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/app") ? styles.navLinkActive : ""}`}
                  to="/app"
                  onClick={closeMenu}
                >
                  App
                </Link>
              </li>

              {!user && (
                <li className={`${styles.navItem} ${styles.mobileOnlyCta}`}>
                  <button
                    type="button"
                    className={styles.btnGetStarted}
                    onClick={() => {
                      navigate("/auth");
                      closeMenu();
                    }}
                  >
                    Get Started
                  </button>
                </li>
              )}
            </ul>
          </div>

          <div className={styles.actions}>
            <ExpandingSearchDock
              placeholder="Search products…"
              onSearch={(q) => {
                closeMenu();
                navigate(`/products?q=${encodeURIComponent(q)}`);
              }}
            />

            <button
              type="button"
              className={styles.cartIconBtn}
              onClick={() => navigate("/cart")}
              aria-label="View cart"
            >
              <svg className={styles.cartSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {itemCount > 0 && (
                <span className={styles.cartBadge}>
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </button>

            {user ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                <button
                  type="button"
                  className={styles.avatarBtn}
                  onClick={() => setDropdownOpen((p) => !p)}
                  aria-label="User menu"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
                  ) : (
                    <span className={styles.avatarInitials}>{initials}</span>
                  )}
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className={styles.dropdownAvatarImg} />
                        ) : (
                          <span className={styles.dropdownAvatarInitials}>{initials}</span>
                        )}
                      </div>
                      <div>
                        <p className={styles.dropdownName}>{user.name}</p>
                        <p className={styles.dropdownEmail}>{user.email}</p>
                      </div>
                    </div>

                    <hr className={styles.dropdownDivider} />

                    <nav className={styles.dropdownNav}>
                      <button type="button" className={styles.dropdownItem} onClick={() => { navigate("/account/profile"); setDropdownOpen(false); }}>
                        <span className={styles.dropdownItemIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></svg>
                        </span>
                        My Profile
                      </button>

                      <button type="button" className={styles.dropdownItem} onClick={() => { navigate("/account/orders"); setDropdownOpen(false); }}>
                        <span className={styles.dropdownItemIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></svg>
                        </span>
                        My Orders
                      </button>

                      <button type="button" className={styles.dropdownItem} onClick={() => { navigate("/cart"); setDropdownOpen(false); }}>
                        <span className={styles.dropdownItemIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        </span>
                        My Cart
                        {itemCount > 0 && <span className={styles.dropdownBadge}>{itemCount}</span>}
                      </button>

                      <button type="button" className={styles.dropdownItem} onClick={() => { navigate("/account/addresses"); setDropdownOpen(false); }}>
                        <span className={styles.dropdownItemIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="2.5" /></svg>
                        </span>
                        Saved Addresses
                      </button>

                      <button type="button" className={styles.dropdownItem} onClick={() => { navigate("/contact"); setDropdownOpen(false); }}>
                        <span className={styles.dropdownItemIcon}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                        </span>
                        Help & Support
                      </button>
                    </nav>

                    <hr className={styles.dropdownDivider} />

                    <button type="button" className={styles.dropdownLogout} onClick={handleLogout}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.logoutIcon}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                className={`${styles.btnGetStarted} ${styles.desktopOnlyCta}`}
                onClick={() => navigate("/auth")}
              >
                Get Started
              </button>
            )}

            <button
              type="button"
              className={styles.hamburger}
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`${styles.hamBar} ${menuOpen ? styles.hamBarTop : ""}`} />
              <span className={`${styles.hamBar} ${menuOpen ? styles.hamBarMid : ""}`} />
              <span className={`${styles.hamBar} ${menuOpen ? styles.hamBarBot : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
