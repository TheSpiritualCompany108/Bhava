import React from "react";
import { Link } from "react-router-dom";
import useCatalog from "../hooks/useCatalog";
import { useWishlist } from "../context/WishlistContext";
import { ProductCard } from "../shop/Cards";
import shop from "../shop/Shop.module.css";
import Seo from "../components/Seo";

export default function WishlistPage() {
  const { catalog, loading, error, reload } = useCatalog();
  const { slugs } = useWishlist();
  // only products that still exist in the catalogue
  const products = catalog ? slugs.map((s) => catalog.products.find((p) => p.slug === s)).filter(Boolean) : [];

  return (
    <div className={shop.wrap} style={{ padding: "32px 16px 72px", minHeight: "60vh" }}>
      <Seo title="My Wishlist | Bhava:" description="Products you have saved." canonical={`${window.location.origin}/wishlist`} />
      <h1 className={shop.h2} style={{ textAlign: "center", marginBottom: 22 }}>My Wishlist</h1>
      {loading && <p style={{ textAlign: "center" }}>Loading…</p>}
      {error && <p style={{ textAlign: "center" }}>{error} <button className={shop.btn} onClick={reload}>Try again</button></p>}
      {catalog && products.length === 0 && (
        <div style={{ textAlign: "center" }}>
          <p>Your wishlist is empty. Tap the Om icon on any product to save it here.</p>
          <Link to="/products" className={`${shop.btn} ${shop.btnGhost}`}>Browse the shop</Link>
        </div>
      )}
      {products.length > 0 && (
        <div className={shop.grid}>
          {products.map((p) => <ProductCard key={p.slug} product={p} catalog={catalog} />)}
        </div>
      )}
    </div>
  );
}
