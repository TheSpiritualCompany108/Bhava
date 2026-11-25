import React from "react";
import styles from "./Shop.module.css";
import { useWishlist } from "../context/WishlistContext";
import OmIcon from "../components/OmIcon";
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
      <OmIcon size={17} filled />
    </button>
  );
}
