import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useCart } from "../context/CartContext";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { itemCount } = useCart();

  // Read user from localStorage whenever the route changes
  useEffect(() => {
    const stored = localStorage.getItem("bhava_user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bhava_token");
    localStorage.removeItem("bhava_user");
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return false;
    return location.pathname === path;
  };

  // Initials avatar fallback
  const initials = user
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.container}>
        <div className={styles.row} style={{ alignItems: "center" }}>
          <div className={styles.col3}>
            <div
              className={styles.brandContainer}
              onClick={() => navigate("/")}
              style={{ cursor: "pointer" }}
            >
              <img src="/logo(3).png" alt="Bhava Logo" className={styles.logo} />
              <h2 className={styles.heading}>
                BHAVA
                <span className={styles.dotsBhava}>
                  <span className={styles.dotName}></span>
                  <span className={styles.dotName}></span>
                </span>
              </h2>
            </div>
          </div>

          {/* Hamburger — mobile only */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barTop : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barMid : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barBot : ""}`} />
          </button>

          <div className={`${styles.col9} ${menuOpen ? styles.mobileMenuOpen : ""}`}>
            <ul className={`${styles.nav} justify-content-end align-items-center`}>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/products") ? styles.navLinkActive : ""}`}
                  to="/products"
                  onClick={() => setMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/knowledge") ? styles.navLinkActive : ""}`}
                  to="/knowledge"
                  onClick={() => setMenuOpen(false)}
                >
                  Bhakti
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/about") ? styles.navLinkActive : ""}`}
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li className={styles.navItem}>
                <Link
                  className={`${styles.navLink} ${isActive("/app") ? styles.navLinkActive : ""}`}
                  to="/app"
                  onClick={() => setMenuOpen(false)}
                >
                  App
                </Link>
              </li>
              <li className={styles.navItem}>
                {/* <Link
                  className={`${styles.navLink} ${isActive("/community") ? styles.navLinkActive : ""}`}
                  to="/community"
                >
                  Community
                </Link> */}
              </li>

              {/* Cart Icon — only visible when logged in */}
              {user && (
                <li className={styles.navItem}>
                  <button
                    className={styles.cartIconBtn}
                    onClick={() => navigate("/cart")}
                    aria-label="View cart"
                  >
                    <svg className={styles.cartSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                      <line x1="3" y1="6" x2="21" y2="6"/>
                      <path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    {itemCount > 0 && (
                      <span className={styles.cartBadge}>
                        {itemCount > 99 ? "99+" : itemCount}
                      </span>
                    )}
                  </button>
                </li>
              )}

              {/* Auth: show user avatar+dropdown OR Get Started */}
              <li className={styles.navItem}>
                {user ? (
                  <div className={styles.userMenu} ref={dropdownRef}>
                    <button
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
                        {/* User header */}
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

                        {/* Menu items */}
                        <nav className={styles.dropdownNav}>
                          <button className={styles.dropdownItem} onClick={() => { navigate("/account/profile"); setDropdownOpen(false); }}>
                            <span className={styles.dropdownItemIcon}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                            </span>
                            My Profile
                          </button>

                          <button className={styles.dropdownItem} onClick={() => { navigate("/account/orders"); setDropdownOpen(false); }}>
                            <span className={styles.dropdownItemIcon}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>
                            </span>
                            My Orders
                          </button>

                          <button className={styles.dropdownItem} onClick={() => { navigate("/cart"); setDropdownOpen(false); }}>
                            <span className={styles.dropdownItemIcon}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                            </span>
                            My Cart
                            {itemCount > 0 && <span className={styles.dropdownBadge}>{itemCount}</span>}
                          </button>

                          <button className={styles.dropdownItem} onClick={() => { navigate("/account/addresses"); setDropdownOpen(false); }}>
                            <span className={styles.dropdownItemIcon}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                            </span>
                            Saved Addresses
                          </button>

                          <button className={styles.dropdownItem} onClick={() => { navigate("/contact"); setDropdownOpen(false); }}>
                            <span className={styles.dropdownItemIcon}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                            </span>
                            Help & Support
                          </button>
                        </nav>

                        <hr className={styles.dropdownDivider} />

                        <button className={styles.dropdownLogout} onClick={handleLogout}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={styles.logoutIcon}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button className={styles.btnGetStarted} onClick={() => { navigate("/auth"); setMenuOpen(false); }}>
                    Get Started
                  </button>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
