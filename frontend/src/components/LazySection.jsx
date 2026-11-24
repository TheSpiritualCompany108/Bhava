import React, { Suspense, useEffect, useRef, useState } from "react";

/**
 * Renders `children` (typically a React.lazy section) only when it is about to scroll into view,
 * so its JS chunk, API calls and images are not loaded for visitors who never get that far.
 *
 * - `rootMargin`: start loading this far *before* the section is visible (so it is ready by the time you arrive).
 * - `idleAfterMs`: as a safety net the section also loads in the background after this delay, once the browser is idle,
 *   so fast scrollers (and the "jump to anchor / restore scroll" case) never meet an empty gap.
 * - `minHeight`: keeps room for the section meanwhile, so the page does not jump.
 */
export default function LazySection({ children, minHeight = 480, rootMargin = "1200px 0px", idleAfterMs = 2500 }) {
  const ref = useRef(null);
  const [show, setShow] = useState(() => typeof IntersectionObserver === "undefined"); // very old browsers: just show it

  useEffect(() => {
    if (show) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    let idleHandle;
    const reveal = () => setShow(true);
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) reveal();
    }, { rootMargin });
    io.observe(node);
    const timer = setTimeout(() => {
      if ("requestIdleCallback" in window) idleHandle = window.requestIdleCallback(reveal, { timeout: 3000 });
      else reveal();
    }, idleAfterMs);
    return () => {
      io.disconnect();
      clearTimeout(timer);
      if (idleHandle && "cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
    };
  }, [show, rootMargin, idleAfterMs]);

  if (!show) return <div ref={ref} style={{ minHeight }} aria-hidden="true" />;
  return <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>{children}</Suspense>;
}
