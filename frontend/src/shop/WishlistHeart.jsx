import React from "react";
import styles from "./Shop.module.css";
import { useWishlist } from "../context/WishlistContext";
import { heartBurst } from "../utils/heartBurst";

/** Wishlist heart for a product. Place it inside a `position: relative` image box; `style` sets the corner. */
export default function WishlistHeart({ product, style }) {
  const wish = useWishlist();
  const wished = wish.has(product.slug);
  const stop = (e) => e.stopPropagation(); // image boxes have their own click / swipe handlers
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
        if (adding) heartBurst(e.currentTarget);
      }}
      onTouchStart={stop}
      onTouchEnd={stop}
      aria-pressed={wished}
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s-7-4.6-9.3-9.1C1.1 8.7 3 5 6.5 5c2 0 3.5 1.2 5.5 3.2C14 6.2 15.5 5 17.5 5 21 5 22.9 8.7 21.3 11.9 19 16.4 12 21 12 21z" /></svg>
    </button>
  );
}
