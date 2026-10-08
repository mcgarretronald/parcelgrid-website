import { useEffect, useRef, useState } from "react";

type Options = {
  threshold?: number | number[];
  rootMargin?: string;
  /** Wait for the intro splash before revealing (hero / first fold). */
  waitForIntro?: boolean;
};

function isPastOrInView(el: Element) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 40;
}

export function useRevealOnScroll<T extends HTMLElement = HTMLElement>(options: Options = {}) {
  const { threshold = 0.08, rootMargin = "0px 0px -4% 0px", waitForIntro = false } = options;
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(true);
      return;
    }

    let played = false;
    let observer: IntersectionObserver | undefined;
    let raf = 0;

    const play = () => {
      if (played) return;
      played = true;
      setShown(true);
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };

    const check = () => {
      const el = ref.current;
      if (el && isPastOrInView(el)) play();
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        check();
      });
    };

    const observe = () => {
      const el = ref.current;
      if (!el) return () => undefined;

      check();
      if (played) return () => undefined;

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting || isPastOrInView(entry.target))) {
            play();
          }
        },
        { threshold, rootMargin },
      );
      observer.observe(el);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);

      return () => {
        observer?.disconnect();
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        if (raf) cancelAnimationFrame(raf);
      };
    };

    if (waitForIntro && document.querySelector(".intro-splash")) {
      let cleanupObserve: (() => void) | undefined;
      const onIntro = () => {
        cleanupObserve = observe();
      };
      window.addEventListener("parcelgrid-intro-done", onIntro, { once: true });
      return () => {
        window.removeEventListener("parcelgrid-intro-done", onIntro);
        cleanupObserve?.();
      };
    }

    return observe();
  }, [threshold, rootMargin, waitForIntro]);

  return { ref, shown, className: shown ? "is-in" : "" };
}
