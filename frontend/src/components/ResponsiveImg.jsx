import React from "react";
import { imgSrc, imgWebpSrc } from "../shop/shopUtils";

/**
 * Product/marketing image with optional WebP source, width/height, and lazy loading.
 * Falls back to the original when no sibling .webp exists (browser skips broken type).
 */
export default function ResponsiveImg({
  src,
  alt = "",
  width,
  height,
  sizes = "(max-width: 480px) 90vw, (max-width: 900px) 45vw, 400px",
  loading = "lazy",
  className,
  style,
  decoding = "async",
}) {
  const resolved = imgSrc(src);
  const webp = imgWebpSrc(src);
  const srcSet = resolved ? `${resolved} 1x` : undefined;

  const img = (
    <img
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      srcSet={srcSet}
      loading={loading}
      decoding={decoding}
      className={className}
      style={style}
    />
  );

  if (!webp) return img;

  return (
    <picture>
      <source srcSet={webp} type="image/webp" sizes={sizes} />
      {img}
    </picture>
  );
}
