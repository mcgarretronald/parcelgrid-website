import { LazyGradientWaves } from "./LazyShader";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { APP_STORE_URL, PLAY_STORE_URL } from "../lib/storeLinks";

function PlayStoreIcon() {
  return (
    <svg viewBox="0 0 28.99 31.99" className="size-6 shrink-0" aria-hidden="true">
      <path fill="#4285F4" d="M13.54 15.28.12 29.34a3.66 3.66 0 0 0 5.33 2.16l15.1-8.6Z" />
      <path fill="#34A853" d="m27.11 14.12-6.53-3.72-7.04 6.88 7.04 6.88 6.53-3.72a3.54 3.54 0 0 0 0-6.32z" />
      <path fill="#FBBC04" d="M.12 2.66a3.65 3.65 0 0 0-.12 1.05v24.58a3.65 3.65 0 0 0 .12 1.05l13.42-13.34Z" />
      <path fill="#EA4335" d="m13.54 16 6.04-6.6L5.45.5A3.7 3.7 0 0 0 3.7 0 3.63 3.63 0 0 0 .12 2.66Z" />
    </svg>
  );
}

function AppStoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0" aria-hidden="true">
      <path
        fill="#ffffff"
        d="M16.4 12.6c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-3-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.6 2.2 2.8 2.2 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7 2-.1 2.8-2.1c.6-1 1.1-2 1.4-3.1-3.7-1.4-3.5-5.3-3.5-5.2zM14.6 6.4c.6-.8 1-1.8.9-2.9-.9.1-1.9.6-2.5 1.3-.6.7-1.1 1.7-.9 2.8 1 .1 1.9-.5 2.5-1.2z"
      />
    </svg>
  );
}

export function AppShowcase() {
  const { ref, className } = useRevealOnScroll<HTMLElement>({ threshold: 0.15 });

  return (
    <section
      ref={ref}
      id="value-proposition"
      aria-labelledby="value-proposition-heading"
      className={`app-showcase relative overflow-hidden bg-[#00473E] ${className}`}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <LazyGradientWaves
          horizonColor="#00473E"
          waveColor="#0C5C45"
          crestColor="#E9FF15"
          speed={0.28}
          amplitude={2.4}
          waveScale={0.55}
          waveRatio={0.85}
          swell={26}
          turbulence={14}
          tilt={1.02}
          zoom={1.08}
          height={3.4}
          fogDepth={24}
          detail="medium"
          brightness={1.2}
          opacity={1}
          mouseInteraction
          parallaxStrength={0.35}
          grain
          grainIntensity={0.03}
        />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,71,62,0.28)_0%,rgba(0,71,62,0.05)_38%,transparent_68%)]" />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pb-8 pt-24 text-center sm:pt-28">
        <div className="app-showcase-copy">
          <h2
            id="value-proposition-heading"
            className="font-[Sora] text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-white sm:text-6xl"
          >
            Courier Service for Online Sellers in Kenya
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
            Built for online vendors like you. Expand beyond Nairobi with cash on delivery, instant wallet payouts, and a straightforward app.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-[#E9FF15] px-6 text-base font-semibold text-[#00473E] transition-colors hover:bg-[#d4ee12]"
            >
              <PlayStoreIcon />
              Google Play Store
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl border border-white/80 bg-transparent px-6 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              <AppStoreIcon />
              Download on the App Store
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto h-[26rem] w-full max-w-3xl sm:h-[34rem]">
        <img decoding="async" loading="lazy"
          src="/app-image2.webp"
          alt="ParcelGrid wallet showing a Ksh balance, withdraw button, and completed payments"
          width="390"
          height="844"
          className="app-phone app-phone--back absolute left-[8%] top-6 w-[42%] -rotate-6 rounded-2xl drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)] sm:left-[14%] sm:w-[38%]"
        />
        <img decoding="async" loading="lazy"
          src="/app-image1.webp"
          alt="ParcelGrid home screen with parcel overview and the Send Parcel button"
          width="390"
          height="844"
          className="app-phone app-phone--front absolute right-[6%] top-0 w-[48%] rotate-3 rounded-2xl drop-shadow-[0_28px_48px_rgba(0,0,0,0.5)] sm:right-[16%] sm:w-[42%]"
        />
      </div>
    </section>
  );
}
