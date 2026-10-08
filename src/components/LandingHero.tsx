import { Apple, Play } from "lucide-react";
import { Link } from "react-router-dom";
import parcelsImage from "../assets/parcels.webp";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { openStoreForPlatform } from "../lib/storeLinks";
import { AnimatedCounter } from "./AnimatedCounter";

const stats: { value?: number; suffix?: string; display?: string; label: string }[] = [
  { value: 300, suffix: "+", label: "Upcountry Towns Covered" },
  { display: "Next-Day", label: "Reliable Delivery Speed" },
  { display: "Instant", label: "M-Pesa Wallet Settlements" },
];

export function LandingHero() {
  const { ref, className } = useRevealOnScroll<HTMLElement>({
    waitForIntro: true,
    threshold: 0.2,
  });

  return (
    <section
      ref={ref}
      aria-labelledby="hero-heading"
      className={`corp-hero relative min-h-[100svh] overflow-hidden bg-[#041612] ${className}`}
    >
      <img decoding="async" fetchPriority="high"
        src={parcelsImage}
        alt="ParcelGrid parcels loaded for upcountry delivery"
        className="corp-hero-photo absolute inset-0 h-full w-full object-cover object-[72%_center]"
      />
      <div className="corp-hero-veil absolute inset-0 bg-[linear-gradient(90deg,rgba(4,22,18,0.94)_0%,rgba(4,22,18,0.78)_46%,rgba(4,22,18,0.28)_100%)]" />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-10 pt-28 sm:px-8 sm:pb-14 lg:justify-center lg:pb-16 lg:pt-24">
        <div className="corp-hero-copy max-w-xl">
          <p className="mb-5 flex items-start gap-3 text-[11px] font-medium leading-relaxed tracking-[0.14em] text-[#E9FF15] sm:text-xs sm:tracking-[0.16em]">
            <span className="mt-[0.45em] block h-px w-8 shrink-0 bg-[#E9FF15]" />
            <span>
              <span className="block">LICENSED BY COMMUNICATIONS AUTHORITY (CA)</span>
              <span className="mt-1 block">NATIONWIDE COURIER</span>
            </span>
          </p>
          <h1
            id="hero-heading"
            className="font-[Sora] text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
          >
            Fast Upcountry Delivery.
            <span className="block text-[#E9FF15]">Instant Pay on Delivery.</span>
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
            Kenya’s trusted courier for online sellers and businesses. Drop off at our Ronald Ngala, Moi Avenue, or Taveta Road branches. We deliver next-day to 300+ towns. Your customer pays via M-Pesa on collection, and your money hits your wallet instantly.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/book-parcel"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#E9FF15] px-6 text-sm font-semibold tracking-wide text-[#00473E] transition-colors hover:bg-[#d4ee12]"
            >
              Book a Parcel Online
            </Link>
            <button
              type="button"
              onClick={openStoreForPlatform}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/70 px-6 text-sm font-semibold tracking-wide text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <Apple className="size-4" aria-hidden />
              <Play className="size-4" aria-hidden />
              Download Vendor App
            </button>
          </div>
        </div>

        <dl className="corp-hero-stats mt-12 grid max-w-xl grid-cols-1 gap-6 border-t border-white/15 pt-6 sm:mt-16 sm:grid-cols-3 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="min-w-0">
              <dt className="font-[Sora] text-2xl font-semibold tracking-tight text-[#E9FF15] sm:text-3xl lg:text-4xl">
                {stat.display ? (
                  stat.display
                ) : (
                  <>
                    <AnimatedCounter to={stat.value ?? 0} duration={900} />
                    {stat.suffix}
                  </>
                )}
              </dt>
              <dd className="mt-2 text-xs leading-snug text-white/70 normal-case tracking-normal sm:text-[11px] sm:uppercase sm:tracking-[0.14em]">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <a
        href="#value-proposition"
        className="corp-hero-scroll absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 lg:flex"
      >
        Scroll
        <span className="corp-hero-scroll-line block h-8 w-px bg-white/70" aria-hidden="true" />
      </a>
    </section>
  );
}
