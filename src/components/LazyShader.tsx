import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from "react";

const GhostFibers = lazy(() => import("./GhostFibers"));
const GradientWaves = lazy(() => import("./GradientWaves"));

/**
 * WebGL backgrounds are decorative and expensive. Only mount one when the user is near it, and skip it
 * entirely on small screens, with reduced-motion, or when the browser asks to save data. This also keeps
 * the WebGL library (ogl) out of the initial JavaScript download.
 */
function useShaderGate() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
    const small = window.innerWidth < 768;
    if (reduce || saveData || small) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, enabled] as const;
}

export function LazyGhostFibers(props: ComponentProps<typeof GhostFibers>) {
  const [ref, enabled] = useShaderGate();
  return (
    <div ref={ref} className="h-full w-full">
      {enabled && (
        <Suspense fallback={null}>
          <GhostFibers {...props} />
        </Suspense>
      )}
    </div>
  );
}

export function LazyGradientWaves(props: ComponentProps<typeof GradientWaves>) {
  const [ref, enabled] = useShaderGate();
  return (
    <div ref={ref} className="h-full w-full">
      {enabled && (
        <Suspense fallback={null}>
          <GradientWaves {...props} />
        </Suspense>
      )}
    </div>
  );
}
