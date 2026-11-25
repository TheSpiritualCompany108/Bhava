import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";
import OmIcon from "./OmIcon";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import ExpandingSearchDock from "./ui/ExpandingSearchDock";
import AvatarImage from "./AvatarImage";
import { getCustomerToken } from "../utils/customerAuth";

const SHOP_NAV = [
  { label: "Incense Sticks", to: "/products?category=incense-sticks" },
  { label: "Bamboo-less Incense", to: "/products?category=bamboo-less-incense" },
  { label: "Incense Cones", to: "/products?category=incense-cones" },
  { label: "Sambrani", to: "/products?category=sambrani" },
  { label: "Camphor", to: "/products?category=camphor" },
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
  const wishCount = useWishlist().count;
  const [wishPulse, setWishPulse] = useState(false);
  const previousWishCount = useRef(wishCount);
  const wishIconRef = useRef(null);
  const cartIconRef = useRef(null);

  useEffect(() => {
    if (wishCount <= previousWishCount.current) {
      previousWishCount.current = wishCount;
      return undefined;
    }

    previousWishCount.current = wishCount;
    setWishPulse(false);
    const frame = window.requestAnimationFrame(() => setWishPulse(true));
    const timer = window.setTimeout(() => setWishPulse(false), 650);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [wishCount]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    let cancelled = false;
    let gsap;
    let om;
    let cart;
    import("gsap").then((module) => {
      if (cancelled) return;
      gsap = module.default || module.gsap;
      om = gsap.timeline({ repeat: -1, repeatDelay: 1.1 })
        .to(wishIconRef.current, { y: -1.5, scale: 1.1, rotation: -5, duration: 0.42, ease: "power1.out" })
        .to(wishIconRef.current, { y: 0, scale: 1, rotation: 0, duration: 0.58, ease: "sine.inOut" });
      cart = gsap.timeline({ repeat: -1, repeatDelay: 1.35, delay: 0.45 })
        .to(cartIconRef.current, { y: -2, rotation: 4, duration: 0.36, ease: "power1.out" })
        .to(cartIconRef.current, { y: 0, rotation: 0, duration: 0.52, ease: "sine.inOut" });
    }).catch(() => {});

    return () => {
      cancelled = true;
      om?.kill();
      cart?.kill();
      gsap?.set([wishIconRef.current, cartIconRef.current], { clearProps: "transform" });
    };
  }, []);

  useEffect(() => {
    // Drop stale admin JWT from the customer token key (shared-key bug).
    getCustomerToken();
    const stored = localStorage.getItem("bhava_user");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setShopOpen(false);
    window.dispatchEvent(new Event("guru:close"));
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

  const dismissChat = () => {
    window.dispatchEvent(new Event("guru:close"));
  };

  const closeMenu = () => {
    dismissChat();
    setMenuOpen(false);
    setShopOpen(false);
  };

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <div
            className={styles.brandContainer}
            onClick={() => {
              dismissChat();
              navigate("/");
            }}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                dismissChat();
                navigate("/");
              }
            }}
          >
            <img src="/bhava-icon.webp" alt="Bhava: Logo" className={styles.logo} width={49} height={70} />
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
                  onClick={() => {
                    // Mouse / mobile panel: Products opens the full catalogue. Touch screens with the desktop
                    // layout have no hover, so a tap there opens the category list instead.
                    const canHover = window.matchMedia("(hover: hover)").matches;
                    const mobilePanel = window.matchMedia("(max-width: 1100px)").matches;
                    if (canHover || mobilePanel) { closeMenu(); navigate("/products"); }
                    else setShopOpen((o) => !o);
                  }}
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
              onOpen={dismissChat}
              onSearch={(q) => {
                dismissChat();
                closeMenu();
                navigate(`/products?q=${encodeURIComponent(q)}`);
              }}
            />

            <button
              type="button"
              className={`${styles.cartIconBtn} ${wishPulse ? styles.wishPulse : ""}`}
              onClick={() => {
                dismissChat();
                navigate("/wishlist");
              }}
              aria-label={`Wishlist${wishCount ? `, ${wishCount} saved` : ""}`}
            >
              <span ref={wishIconRef} className={styles.iconMotion}>
                <OmIcon className={`${styles.cartSvg} ${styles.wishSvg}`} size={22} filled />
              </span>
              <span className={styles.cartBadge} data-empty={wishCount === 0 ? "1" : "0"} aria-hidden={wishCount === 0}>
                {wishCount > 99 ? "99+" : wishCount}
              </span>
            </button>

            <button
              type="button"
              className={styles.cartIconBtn}
              onClick={() => {
                dismissChat();
                navigate("/cart");
              }}
              aria-label="View cart"
            >
              <svg ref={cartIconRef} className={styles.cartSvg} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <span
                className={styles.cartBadge}
                data-cart-badge
                data-empty={itemCount === 0 ? "1" : "0"}
                aria-hidden={itemCount === 0}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            </button>

            {user ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                <button
                  type="button"
                  className={styles.avatarBtn}
                  onClick={() => {
                    dismissChat();
                    setDropdownOpen((p) => !p);
                  }}
                  aria-label="User menu"
                >
                  <AvatarImage
                    src={user.avatar}
                    alt={user.name}
                    className={styles.avatarImg}
                    fallback={<span className={styles.avatarInitials}>{initials}</span>}
                  />
                </button>

                {dropdownOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownAvatar}>
                        <AvatarImage
                          src={user.avatar}
                          alt={user.name}
                          className={styles.dropdownAvatarImg}
                          fallback={<span className={styles.dropdownAvatarInitials}>{initials}</span>}
                        />
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

                      <button type="button" className={styles.dropdownItem} onClick={() => { navigate("/wishlist"); setDropdownOpen(false); }}>
                        <span className={styles.dropdownItemIcon}>
                          <OmIcon size={20} />
                        </span>
                        My Wishlist
                        {wishCount > 0 && <span className={styles.dropdownBadge}>{wishCount}</span>}
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
                onClick={() => {
                  dismissChat();
                  navigate("/auth");
                }}
              >
                Get Started
              </button>
            )}

            <button
              type="button"
              className={styles.hamburger}
              onClick={() => {
                dismissChat();
                setMenuOpen((p) => !p);
              }}
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
