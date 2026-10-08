import { Link } from "react-router-dom";
import { CircleCheck } from "lucide-react";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";

const points = [
  {
    title: "Instant M-Pesa COD Payouts",
    body: "Funds hit your seller wallet the second your buyer collects and pays upcountry.",
  },
  {
    title: "Next-Day Upcountry Delivery",
    body: "Daily departures from Nairobi CBD to major towns, trading centres, and regional counties.",
  },
  {
    title: "Smart SMS Tracking for Buyers",
    body: "We send collection alerts and pin directions so buyers actually pick up their parcels on time.",
  },
  {
    title: "CA Licensed & Escrow-Protected",
    body: "Fully registered by the Communications Authority of Kenya with dedicated parcel security.",
  },
];

export function BuiltForSellers() {
  const { ref, className } = useRevealOnScroll();

  return (
    <section
      ref={ref}
      className={`reveal relative overflow-hidden ${className}`}
      aria-labelledby="built-for-sellers-heading"
    >
      <img decoding="async" loading="lazy"
        src="/parcel-van-golden-hour.webp"
        alt="ParcelGrid courier van delivering upcountry parcels from Nairobi at golden hour"
        className="reveal-scale absolute inset-0 h-full w-full object-cover object-[78%_center]"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#071410]/92 via-[#071410]/80 to-[#071410]/55"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="reveal-up max-w-xl">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">
            BUILT FOR ONLINE SELLERS &amp; KENYAN BUSINESSES
          </p>
          <h2
            id="built-for-sellers-heading"
            className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            Grow Your Business Beyond Nairobi Without the Delivery Headaches
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/75 sm:text-base">
            Most upcountry buyers prefer to pay when they see their item. ParcelGrid bridges the trust gap between you and your customers with verified pickup points across 300+ towns, automated SMS updates, and zero-delay M-Pesa settlements.
          </p>

          <ul className="reveal-stagger mt-8 space-y-4">
            {points.map((point) => (
              <li key={point.title} className="flex gap-3 text-sm leading-relaxed text-white/85 sm:text-[15px]">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#E9FF15]" strokeWidth={1.75} aria-hidden="true" />
                <p>
                  <span className="font-semibold text-white">{point.title}: </span>
                  {point.body}
                </p>
              </li>
            ))}
          </ul>

          <Link
            to="/pickup-points"
            className="mt-8 inline-flex items-center rounded-md bg-[#E9FF15] px-5 py-3 text-sm font-semibold text-[#071410] transition-colors hover:bg-[#f4ff6a]"
          >
            Explore Our Pickup Points
          </Link>
        </div>
      </div>
    </section>
  );
}
