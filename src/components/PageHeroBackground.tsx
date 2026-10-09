import { LazyPlasma } from './LazyShader';

/**
 * Shared dark page-hero backdrop: brand Plasma + readability scrim.
 * Drop inside any `relative … bg-[#071410]` hero section.
 */
export function PageHeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 opacity-90">
        <LazyPlasma
          color="#E9FF15"
          speed={0.5}
          direction="forward"
          scale={1.2}
          opacity={0.72}
          mouseInteractive={false}
          renderScale={0.42}
          maxDpr={1.25}
          targetFps={36}
          iterations={36}
          className="h-full w-full"
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,rgba(0,71,62,0.35),transparent_65%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#071410]/40 via-[#071410]/55 to-[#071410]/92" />
    </div>
  );
}
