import { useEffect, useRef } from "react";

type Options = {
  /** How far the element drifts relative to scroll (0.05–0.25 feels natural). */
  speed?: number;
  /** Max translate in px so motion stays subtle. */
  maxPx?: number;
};

/**
 * Soft scroll parallax for hero / band imagery. Disabled when prefers-reduced-motion.
 */
export function useParallax<T extends HTMLElement = HTMLElement>(options: Options = {}) {
  const { speed = 0.12, maxPx = 48 } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight || 1;
      // 0 when centered-ish in viewport; positive when below, negative when above
      const progress = (rect.top + rect.height * 0.5 - viewH * 0.5) / viewH;
      const y = Math.max(-maxPx, Math.min(maxPx, progress * speed * 100));
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed, maxPx]);

  return ref;
}
