import "./AuroraBackground.css";

/** Decorative CSS aurora for dark sections (no WebGL). */
export function AuroraBackground() {
  return (
    <div className="aurora-root" aria-hidden="true">
      <div className="aurora-base" />
      <div className="aurora-band aurora-band--a" />
      <div className="aurora-band aurora-band--b" />
      <div className="aurora-band aurora-band--c" />
      <div className="aurora-stars" />
      <div className="aurora-scrim" />
    </div>
  );
}
