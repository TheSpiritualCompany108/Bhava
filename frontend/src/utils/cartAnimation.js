import gsap from "gsap";

const COLORS = ["#E07B39", "#f0a86f", "#c0671e", "#4A0B1D", "#e89138", "#ffd9b3", "#2e7d52"];
const CART_SELECTOR = 'button[aria-label="View cart"]';
/** Above Quick View modal (z-index 10000) so fly-to-cart stays visible */
const LAYER = 12000;

const reduced = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const mk = (tag, style) => {
  const el = document.createElement(tag);
  Object.assign(el.style, { position: "fixed", pointerEvents: "none", zIndex: LAYER, ...style });
  document.body.appendChild(el);
  return el;
};

// Product thumbnail that arcs up to the navbar cart icon, then the icon "catches" it
function flyToCart(from, image) {
  const run = () => {
    const cart = document.querySelector(CART_SELECTOR);
    if (!cart) return;
    const to = cart.getBoundingClientRect();
    if (to.bottom < 0 || to.top > window.innerHeight) return;

    const size = 54;
    const startX = from.left + from.width / 2 - size / 2;
    const startY = from.top + from.height / 2 - size / 2;
    const endX = to.left + to.width / 2 - size / 2;
    const endY = to.top + to.height / 2 - size / 2;

    const ghost = mk("div", {
      left: `${startX}px`,
      top: `${startY}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "14px",
      background: image ? `#fff url("${image}") center/cover no-repeat` : "#E07B39",
      border: "2px solid #fff",
      boxShadow: "0 10px 28px rgba(74, 11, 29, 0.35)",
      zIndex: LAYER + 1,
    });

    const dur = 0.85;
    const tl = gsap.timeline({ delay: 0.12, onComplete: () => ghost.remove() });
    tl.fromTo(ghost, { scale: 0.2, opacity: 0, rotate: -12 }, { scale: 1, opacity: 1, duration: 0.18, ease: "back.out(2)" }, 0)
      .to(ghost, { x: endX - startX, duration: dur, ease: "power1.inOut" }, 0.1)
      .to(ghost, { y: endY - startY, duration: dur, ease: "power3.in" }, 0.1)
      .to(ghost, { scale: 0.16, rotate: 200, duration: dur, ease: "power2.in" }, 0.1)
      .to(ghost, { opacity: 0, duration: 0.15 }, dur + 0.08);

    tl.add(() => {
      const badge = cart.querySelector("[data-cart-badge]");
      gsap
        .timeline()
        .to(cart, { scale: 1.35, rotation: -14, duration: 0.14, ease: "power2.out" })
        .to(cart, { scale: 1, rotation: 0, duration: 0.7, ease: "elastic.out(1.4, 0.3)" })
        .add(() => gsap.set(cart, { clearProps: "transform" }));
      if (badge) {
        gsap.fromTo(badge, { scale: 2.2 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.2, 0.4)" });
      }
      const ring = mk("span", {
        left: `${to.left}px`,
        top: `${to.top}px`,
        width: `${to.width}px`,
        height: `${to.height}px`,
        borderRadius: "50%",
        border: "2px solid #E07B39",
      });
      gsap.to(ring, { scale: 2.2, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => ring.remove() });
    }, dur + 0.1);
  };

  // Wait 2 frames so React can paint the cart badge after addToCart
  requestAnimationFrame(() => requestAnimationFrame(run));
}

/**
 * Polished "added to cart" animation.
 * Call right after the cart state is updated.
 */
export function playAddToCartAnimation(btn, { image } = {}) {
  if (!btn || reduced()) {
    if (image && btn) {
      const rect = btn.getBoundingClientRect();
      flyToCart(rect, image);
    }
    return;
  }

  const rect = btn.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  gsap
    .timeline({ onComplete: () => gsap.set(btn, { clearProps: "transform" }) })
    .to(btn, { scaleX: 1.07, scaleY: 0.86, duration: 0.1, ease: "power2.in" })
    .to(btn, { scaleX: 1, scaleY: 1, duration: 0.8, ease: "elastic.out(1.4, 0.3)" });

  const sweep = document.createElement("span");
  Object.assign(sweep.style, {
    position: "absolute",
    top: 0,
    left: 0,
    width: "45%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
    pointerEvents: "none",
    transform: "translateX(-130%) skewX(-20deg)",
  });
  const prevOverflow = btn.style.overflow;
  const prevPos = getComputedStyle(btn).position;
  btn.style.overflow = "hidden";
  if (prevPos === "static") btn.style.position = "relative";
  btn.appendChild(sweep);
  gsap.to(sweep, {
    x: rect.width * 3,
    duration: 0.7,
    ease: "power2.inOut",
    delay: 0.05,
    onComplete: () => {
      sweep.remove();
      btn.style.overflow = prevOverflow;
    },
  });

  [0, 0.12].forEach((delay, i) => {
    const ring = mk("span", {
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      borderRadius: "999px",
      border: `${i ? 1.5 : 2.5}px solid ${i ? "#E07B39" : "#2e7d52"}`,
    });
    gsap.fromTo(
      ring,
      { scaleX: 1, scaleY: 1, opacity: 0.9 },
      {
        scaleX: 1.3 + i * 0.12,
        scaleY: 1.9 + i * 0.5,
        opacity: 0,
        duration: 0.75,
        delay,
        ease: "power2.out",
        onComplete: () => ring.remove(),
      }
    );
  });

  const count = 22;
  for (let i = 0; i < count; i++) {
    const sparkle = i % 4 === 0;
    const size = sparkle ? 11 + Math.random() * 9 : 5 + Math.random() * 6;
    const color = COLORS[i % COLORS.length];
    const p = sparkle
      ? mk("i", { left: `${cx}px`, top: `${cy}px`, color, fontStyle: "normal", fontSize: `${size}px`, lineHeight: 1 })
      : mk("i", {
          left: `${cx}px`,
          top: `${cy}px`,
          width: `${size}px`,
          height: `${size}px`,
          background: color,
          borderRadius: Math.random() > 0.45 ? "50%" : "2px",
        });
    if (sparkle) p.textContent = "✦";

    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const dist = 45 + Math.random() * 75;
    const life = 0.6 + Math.random() * 0.3;
    gsap.fromTo(
      p,
      { x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 },
      {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - 18,
        scale: sparkle ? 1.2 : 1,
        rotation: (Math.random() - 0.5) * 540,
        duration: life,
        ease: "expo.out",
      }
    );
    gsap.to(p, {
      y: `+=${28 + Math.random() * 22}`,
      scale: 0,
      opacity: 0,
      duration: 0.5,
      delay: life * 0.7,
      ease: "power2.in",
      onComplete: () => p.remove(),
    });
  }

  gsap.delayedCall(0.03, () => {
    const label = btn.querySelector("[data-label]");
    if (label) {
      gsap.fromTo(
        label,
        { y: 16, opacity: 0, scale: 0.75 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(2.4)" }
      );
    }
  });

  if (image) flyToCart(rect, image);
}
