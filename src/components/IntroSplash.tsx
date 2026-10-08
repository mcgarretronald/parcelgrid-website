import { useEffect, useRef, useState } from "react";
import lockup from "../assets/brand/parcelgrid-lockup.png";

type IntroSplashProps = {
  onComplete: () => void;
};

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [leaving, setLeaving] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const exitDelay = reduce ? 200 : 550;
    const doneDelay = reduce ? 250 : 1000;

    const exitTimer = window.setTimeout(() => {
      setLeaving(true);
      window.dispatchEvent(new Event("parcelgrid-intro-done"));
    }, exitDelay);
    const doneTimer = window.setTimeout(() => {
      document.body.style.overflow = previousOverflow;
      window.history.scrollRestoration = previousRestoration;
      if (!window.location.hash) window.scrollTo(0, 0);
      onCompleteRef.current();
    }, doneDelay);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = previousOverflow;
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  return (
    <div className={`intro-splash${leaving ? " intro-splash--out" : ""}`} role="presentation">
      <div className="intro-splash__glow" aria-hidden="true" />
      <img decoding="async"
        src={lockup}
        width={100}
        height={100}
        alt="ParcelGrid, The Ecocommerce Courier"
        className="intro-splash__logo"
      />
    </div>
  );
}
