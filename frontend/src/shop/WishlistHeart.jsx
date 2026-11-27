import React, { useRef, useEffect } from "react";
import styles from "./Shop.module.css";
import { useWishlist } from "../context/WishlistContext";
import OmIcon from "../components/OmIcon";
import { heartBurst } from "../utils/heartBurst";

/** Wishlist heart for a product. Place it inside a `position: relative` image box; `style` sets the corner. */
export default function WishlistHeart({ product, style }) {
  const wish = useWishlist();
  const wished = wish.has(product.slug);
  const heartRef = useRef(null);
  const omRef = useRef(null);
  const animate = useRef(false); // true only right after the user adds it (not on first paint of an already-saved item)
  const stop = (e) => e.stopPropagation(); // image boxes have their own click / swipe handlers

  useEffect(() => {
    const heart = heartRef.current;
    const om = omRef.current;
    if (!wished) {
      if (heart) { heart.style.opacity = ""; heart.style.transform = ""; }
      return undefined;
    }
    if (!animate.current) return undefined; // already saved: just show the OM
    animate.current = false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !om || !heart) return undefined;
    let tl;
    let dead = false;
    import("gsap").then(({ gsap }) => {
      if (dead) return;
      tl = gsap.timeline();
      tl.to(heart, { scale: 0.2, opacity: 0, duration: 0.22, ease: "power2.in" }, 0)
        .fromTo(om, { scale: 0.2, rotate: -35, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 0.8, ease: "back.out(2)" }, 0.12)
        .fromTo(om, { filter: "drop-shadow(0 0 0 rgba(224,123,57,0))" }, { filter: "drop-shadow(0 0 5px rgba(224,123,57,0.9))", duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.2);
    });
    return () => { dead = true; if (tl) tl.kill(); };
  }, [wished]);

  return (
    <button
      type="button"
      className={`${styles.heart} ${wished ? styles.heartOn : ""}`}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const adding = !wished;
        wish.toggle(product.slug, product.name);
        if (adding) { animate.current = true; heartBurst(e.currentTarget); }
      }}
      onTouchStart={stop}
      onTouchEnd={stop}
      aria-pressed={wished}
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
    >
      {wished && <span ref={omRef} className={styles.heartOm} aria-hidden="true"><OmIcon size={17} filled /></span>}
      <svg ref={heartRef} className={wished ? styles.heartHidden : ""} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-4.6-9.3-9.1C1.1 8.7 3 5 6.5 5c2 0 3.5 1.2 5.5 3.2C14 6.2 15.5 5 17.5 5 21 5 22.9 8.7 21.3 11.9 19 16.4 12 21 12 21z" /></svg>
    </button>
  );
}
