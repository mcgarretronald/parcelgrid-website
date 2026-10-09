import { lazy, Suspense, useEffect, useRef, useState, type ComponentProps } from "react";

const GhostFibers = lazy(() => import("./GhostFibers"));
const GradientWaves = lazy(() => import("./GradientWaves"));
const Grainient = lazy(() => import("./Grainient"));
const Plasma = lazy(() => import("./Plasma"));

/**
 * WebGL backgrounds are decorative. Mount when near viewport; skip only when
 * the user prefers reduced motion or asks to save data. Keep ogl out of the
 * initial JS download via lazy import.
 */
function useShaderGate() {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    );
    if (reduce || saveData) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
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

export function LazyGrainient(props: ComponentProps<typeof Grainient>) {
  const [ref, enabled] = useShaderGate();
  return (
    <div ref={ref} className="h-full w-full">
      {enabled && (
        <Suspense fallback={null}>
          <Grainient {...props} />
        </Suspense>
      )}
    </div>
  );
}

export function LazyPlasma(props: ComponentProps<typeof Plasma>) {
  const [ref, enabled] = useShaderGate();
  return (
    <div ref={ref} className="h-full w-full">
      {enabled && (
        <Suspense fallback={null}>
          <Plasma {...props} />
        </Suspense>
      )}
    </div>
  );
}
