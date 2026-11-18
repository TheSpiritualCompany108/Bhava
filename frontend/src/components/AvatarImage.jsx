import { useState } from "react";

/**
 * Profile photo. Google avatar URLs (lh3.googleusercontent.com) refuse to load when the browser
 * sends our site as the Referer (they answer 403/429), so the referrer is dropped. If the image
 * still fails, the initials fallback is shown instead of a broken-image icon.
 */
export default function AvatarImage({ src, alt, className, fallback }) {
  const [failedSrc, setFailedSrc] = useState("");
  if (!src || failedSrc === src) return fallback;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailedSrc(src)}
    />
  );
}
