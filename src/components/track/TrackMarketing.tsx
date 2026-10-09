import { Link } from "react-router-dom";
import { Building2, MessageCircle, Package, Shield, Truck, Wallet } from "lucide-react";
import { useRevealOnScroll } from "../../hooks/useRevealOnScroll";

const journeyStages = [
  {
    title: "Booked",
    body: "Logged on app, web, or walk-in at Ronald Ngala, Moi Avenue, or Taveta Road.",
    icon: Package,
  },
  {
    title: "Branch Intake",
    body: "Weighed, tagged, and assigned an encrypted tracking ID at our dispatch facility.",
    icon: Building2,
  },
  {
    title: "Upcountry Transit",
    body: "Overnight transit across regional highway routes to 132 towns.",
    icon: Truck,
  },
  {
    title: "Pickup & Settlement",
    body: "Buyer collects at local station. For COD orders, M-Pesa is collected and remitted to the seller instantly.",
    icon: Wallet,
  },
];

const proofs = [
  { value: "132", label: "Towns Covered" },
  { value: "Next-Day", label: "Regional Transit" },
  { value: "Instant", label: "M-Pesa COD Payouts" },
  { value: "CA", label: "Licensed by CA Kenya" },
];

export function TrackEmptyMarketing() {
  const { ref, className } = useRevealOnScroll<HTMLElement>({ threshold: 0.1 });

  return (
    <section ref={ref} className={`reveal bg-[#f7f8f6] py-14 sm:py-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="reveal-up mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.22em] text-[#00473E] uppercase">
            How your parcel moves
          </p>
          <h2 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl">
            How ParcelGrid Moves Your Package
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5c6562]">
            From Nairobi CBD drop-off to upcountry pickup in 4 clear stages:
          </p>
        </div>

        <ol className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {journeyStages.map((stage, index) => {
            const Icon = stage.icon;
            return (
              <li
                key={stage.title}
                className="rounded-2xl border border-black/[0.06] bg-white p-5 sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-[#00473E] text-[#E9FF15]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="font-[Sora] text-xs font-semibold tracking-[0.14em] text-[#00473E] uppercase">
                    Stage {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 font-[Sora] text-lg font-semibold text-[#111]">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5c6562]">{stage.body}</p>
              </li>
            );
          })}
        </ol>

        <dl className="reveal-stagger mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-4">
          {proofs.map((item) => (
            <div key={item.label} className="bg-white px-4 py-8 text-center sm:py-10">
              <dt className="font-[Sora] text-2xl font-semibold tracking-tight text-[#00473E] sm:text-3xl">
                {item.value}
              </dt>
              <dd className="mt-2 text-xs tracking-[0.12em] text-[#5c6562] uppercase">{item.label}</dd>
            </div>
          ))}
        </dl>

        <div className="reveal-up relative mt-12 overflow-hidden rounded-[1.75rem] bg-[#00473E] text-white">
          <div className="absolute inset-0 opacity-40" aria-hidden="true">
            <img decoding="async" loading="lazy"
              src="/parcel-van-golden-hour.webp"
              alt=""
              className="h-full w-full object-cover object-[70%_center]"
            />
            <div className="absolute inset-0 bg-[#00473E]/78" />
          </div>
          <div className="relative z-10 px-6 py-12 text-center sm:px-12 sm:py-14">
            <div className="mx-auto mb-4 inline-flex size-11 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
              <Shield className="size-5" aria-hidden />
            </div>
            <h2 className="font-[Sora] text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Sending Goods to Upcountry Buyers?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">
              Join hundreds of Instagram shops and online vendors using ParcelGrid for next-day upcountry
              deliveries and risk-free Pay on Delivery.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/book-parcel"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#E9FF15] px-7 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4ee12]"
              >
                Book a Parcel Online
              </Link>
              <Link
                to="/pickup-points"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/50 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                View All 132 Pickup Points →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrackSoftSellRail() {
  return (
    <aside className="space-y-5" aria-label="Ship with ParcelGrid">
      <div className="rounded-2xl border border-black/[0.06] bg-[#071410] p-6 text-white">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#E9FF15]">
          Ship with ParcelGrid
        </p>
        <h2 className="mt-3 font-[Sora] text-xl font-semibold tracking-tight">
          Selling online in Kenya?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/75">
          Ship to 132 towns with next-day dispatch and instant M-Pesa COD settlement.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            to="/book-parcel"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#E9FF15] px-5 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4ee12]"
          >
            Book a Parcel Online
          </Link>
          <Link
            to="/pickup-points"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/35 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Find CBD Drop-Off Branches
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-white p-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#00473E]">
          Need tracking help?
        </p>
        <h2 className="mt-3 font-[Sora] text-xl font-semibold tracking-tight text-[#111]">
          Package delayed or status unclear?
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[#5c6562]">
          Reach our central operations desk directly.
        </p>
        <a
          href="https://wa.me/254745111555"
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex w-full flex-col items-center gap-1 rounded-2xl bg-[#00473E] px-4 py-4 text-center text-white transition-colors hover:bg-[#035a4d]"
        >
          <span className="inline-flex items-center gap-2 text-sm font-semibold">
            <MessageCircle className="size-4 shrink-0" aria-hidden />
            WhatsApp Support
          </span>
          <span className="whitespace-nowrap font-[Sora] text-lg font-semibold tracking-tight">
            0745 111 555
          </span>
        </a>
        <p className="mt-4 text-center text-xs leading-relaxed text-[#5c6562]">
          Mon – Sat · 9:00 AM – 7:00 PM
        </p>
      </div>
    </aside>
  );
}
