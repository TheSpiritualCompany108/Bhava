/** Small particle burst + pop on the wishlist heart (GSAP, loaded on demand so it never weighs on first paint). */
const COLORS = ["#4A0B1D", "#E07B39", "#F3C56B", "#C0671E"];

export async function heartBurst(btn) {
  if (!btn || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { gsap } = await import("gsap");
  gsap.fromTo(btn, { scale: 0.7 }, { scale: 1, duration: 0.5, ease: "elastic.out(1.2, 0.4)" });

  const host = btn.parentElement; // the image box (position: relative)
  if (!host) return;
  const hb = btn.getBoundingClientRect();
  const pb = host.getBoundingClientRect();
  const cx = hb.left - pb.left + hb.width / 2;
  const cy = hb.top - pb.top + hb.height / 2;
  const count = 12;
  for (let i = 0; i < count; i++) {
    const dot = document.createElement("span");
    const size = 4 + Math.random() * 4;
    Object.assign(dot.style, {
      position: "absolute", left: `${cx - size / 2}px`, top: `${cy - size / 2}px`, width: `${size}px`, height: `${size}px`,
      borderRadius: i % 3 === 0 ? "2px" : "50%", background: COLORS[i % COLORS.length], pointerEvents: "none", zIndex: 4,
    });
    host.appendChild(dot);
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
    const dist = 22 + Math.random() * 22;
    gsap.to(dot, {
      x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0.3,
      duration: 0.6 + Math.random() * 0.25, ease: "power2.out", onComplete: () => dot.remove(),
    });
    gsap.fromTo(dot, { opacity: 1, scale: 1 }, { opacity: 1, scale: 1, duration: 0 });
  }
}
