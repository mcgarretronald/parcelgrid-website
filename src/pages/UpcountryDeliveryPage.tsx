import { Link } from "react-router-dom";
import { JsonLd } from '../components/JsonLd';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { Helmet } from "react-helmet-async";
import { ArrowRight, BellRing, MapPin, ShieldCheck, Smartphone, Store, Wallet, Moon } from "lucide-react";
import Footer from "../components/Footer";
import { Reveal } from "../components/Reveal";
import { MiniFaq } from "../components/MiniFaq";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { BRANCHES, mapsLink } from "../lib/branches";
import { faqByIds } from "../lib/faqData";

const PAGE_TITLE = "Upcountry Parcel Delivery Kenya | Next-Day Courier Outside Nairobi | ParcelGrid";
const PAGE_DESCRIPTION =
  "Reliable next-day upcountry parcel delivery to 132 towns across Kenya. Drop off at our Nairobi CBD branches (9 AM–7 PM, Mon–Sat). COD & prepaid supported.";

const CORRIDORS = [
  {
    title: "Rift Valley & Western",
    blurb: "Daily dispatches to commercial and agricultural centres",
    towns: [
      "Nakuru", "Naivasha", "Eldoret", "Kitale", "Kapsabet", "Kakamega", "Bungoma", "Busia",
      "Kisumu", "Kisii", "Homabay", "Migori", "Kericho", "Bomet",
    ],
  },
  {
    title: "Mount Kenya & Central",
    blurb: "Fast transit across the central economic belt",
    towns: [
      "Thika", "Kenol", "Murang'a", "Kerugoya", "Kutus", "Embu", "Runyenjes", "Chuka",
      "Meru", "Nanyuki", "Nyeri", "Karatina", "Nyahururu",
    ],
  },
  {
    title: "Coast & Eastern",
    blurb: "Overnight transit along the Mombasa highway and eastern counties",
    towns: [
      "Machakos", "Kitui", "Kibwezi", "Voi", "Mariakani", "Mombasa CBD", "Nyali", "Bamburi",
      "Mtwapa", "Kilifi", "Malindi", "Ukunda", "Diani",
    ],
  },
];

const ADVANTAGES = [
  {
    icon: Moon,
    title: "Overnight transit",
    body: "Parcels leave Nairobi at night and are expected to arrive the following day.",
  },
  {
    icon: BellRing,
    title: "SMS arrival alerts",
    body: "Your buyer is notified automatically when the parcel arrives and is ready for collection.",
  },
  {
    icon: Wallet,
    title: "COD integration",
    body: "Offer Pay on Delivery upcountry. Buyers pay by M-Pesa at collection and your wallet is credited instantly.",
  },
  {
    icon: ShieldCheck,
    title: "CA-licensed",
    body: "ParcelGrid is licensed by the Communications Authority of Kenya (CA).",
  },
];

const PHASES = [
  {
    label: "Day 1 \u00b7 Nairobi",
    steps: [
      {
        icon: Smartphone,
        title: "Book your parcel",
        body: "Book in the ParcelGrid app or walk in at a Nairobi CBD branch. Enter your customer's name, phone number and pickup station, and choose Prepaid or COD.",
      },
      {
        icon: Store,
        title: "Drop it off in Nairobi",
        body: "Hand the packed parcel to one of our three CBD branches. They are open 9:00 AM to 7:00 PM, Monday to Saturday.",
      },
    ],
  },
  {
    label: "Overnight",
    steps: [
      {
        icon: Moon,
        title: "It travels overnight",
        body: "Your parcel is sorted and dispatched on the night route to your customer's town.",
      },
    ],
  },
  {
    label: "Day 2 \u00b7 Your customer's town",
    steps: [
      {
        icon: BellRing,
        title: "Your buyer is alerted",
        body: "The next day the parcel reaches the pickup station and your buyer gets an SMS with their release code.",
      },
      {
        icon: Wallet,
        title: "Collect and get paid",
        body: "The buyer shows the release code at the station. For COD, the station agent sends an M-Pesa prompt and the funds reach your ParcelGrid wallet instantly.",
      },
    ],
  },
];

const serviceSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Upcountry parcel delivery in Kenya",
  serviceType: "Next-day upcountry parcel delivery",
  description: PAGE_DESCRIPTION,
  areaServed: { "@type": "Country", name: "Kenya" },
  provider: { "@type": "Organization", name: "ParcelGrid", legalName: "Escrow Courier Networks Ltd", url: origin },
  url: `${origin}/services/upcountry-parcel-delivery`,
});

export default function UpcountryDeliveryPage() {
  useScrollToTop();
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta
          name="keywords"
          content="upcountry parcel delivery Kenya, courier services outside Nairobi, next-day parcel delivery Kenya, send parcel to Nakuru, send parcel to Mombasa, send parcel to Kisumu, COD courier Kenya"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={origin ? `${origin}/services/upcountry-parcel-delivery` : ""} />
      </Helmet>
      <JsonLd data={serviceSchema(origin)} />

      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">Upcountry delivery</p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            Next-Day Upcountry Parcel Delivery in Kenya
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
            Daily parcel dispatches to 132 towns outside Nairobi. Drop off at Ronald Ngala, Moi Avenue, or Taveta Road. Your customer gets an SMS when the parcel is ready, and they collect at a pickup station near them.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              to="/book-parcel"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
            >
              Book a Parcel Online <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/pickup-points"
              className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Explore Our Pickup Stations
            </Link>
          </div>
        </div>
      </section>

      {/* Corridors */}
      <Reveal as="section" className="border-b border-black/[0.06] bg-[#f7f8f6] py-14 sm:py-20" aria-labelledby="corridors-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Outside Nairobi network</p>
            <h2 id="corridors-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              Daily dispatches across Kenya&apos;s key routes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6562] sm:text-base">
              We move parcels overnight from Nairobi CBD to pickup stations across 132 commercial centres. Tap a town to see its stations.
            </p>
          </div>

          {/* Origin node + connector bracket */}
          <div className="mt-8 flex flex-col items-center" aria-hidden>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#00473E] px-5 py-2.5 text-sm font-semibold text-white shadow-sm">
              <span className="size-2 rounded-full bg-[#E9FF15]" />
              Nairobi CBD &middot; dispatch point
            </span>
            <span className="h-6 w-0.5 bg-[#00473E]/70" />
          </div>
          <div className="hidden h-8 grid-cols-3 gap-4 md:grid" aria-hidden>
            {[0, 1, 2].map((i) => (
              <div key={i} className="relative">
                {/* horizontal bar across the top, joined through the column gaps */}
                <span
                  className="absolute top-0 h-0.5 bg-[#00473E]/70"
                  style={{
                    left: i === 0 ? "50%" : "-0.5rem",
                    right: i === 2 ? "50%" : "-0.5rem",
                  }}
                />
                {/* drop to the card */}
                <span className="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2 bg-[#00473E]/70" />
              </div>
            ))}
          </div>

          <Reveal as="div" variant="stagger" className="grid gap-4 md:grid-cols-3">
            {CORRIDORS.map((c) => (
              <article
                key={c.title}
                className="flex flex-col rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <span className="rounded-full bg-[#00473E]/[0.07] px-2.5 py-1 text-[11px] font-semibold text-[#00473E]">
                    {c.towns.length}+ towns
                  </span>
                </div>
                <h3 className="mt-4 font-[Sora] text-lg font-semibold text-[#111]">{c.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#5c6562]">{c.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {c.towns.map((town) => (
                    <li key={town}>
                      <Link
                        to={`/pickup-points?station=${encodeURIComponent(town)}`}
                        className="inline-flex min-h-11 items-center rounded-full sm:min-h-8 border border-black/10 bg-[#f7f8f6] px-3 text-xs font-medium text-[#3d4542] transition-colors hover:border-[#00473E] hover:bg-[#00473E] hover:text-white"
                      >
                        {town}
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[#5c6562]">&hellip;and surrounding centres</p>
              </article>
            ))}
          </Reveal>

          <p className="mt-8 text-center text-sm text-[#5c6562]">
            Don&apos;t see your town? Search all 132 on the{" "}
            <Link to="/pickup-points" className="font-semibold text-[#00473E] underline-offset-2 hover:underline">
              stations page
            </Link>
            .
          </p>
        </div>
      </Reveal>

      {/* Why sellers choose us */}
      <Reveal as="section" className="bg-[#071410] py-14 text-white sm:py-20" aria-labelledby="why-title">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15]">Built for growing sellers</p>
            <h2 id="why-title" className="mt-3 font-[Sora] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
              Next-day delivery that keeps your buyers happy
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Upcountry buyers hate waiting days without updates. ParcelGrid cuts delivery delays with structured daily dispatches, automatic customer notifications, and secure collection stations.
            </p>
          </div>
          <Reveal as="ul" variant="stagger" className="grid gap-4 sm:grid-cols-2">
            {ADVANTAGES.map((a) => (
              <li key={a.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                  <a.icon className="size-5" aria-hidden />
                </span>
                <p className="mt-4 font-semibold text-[#E9FF15]">{a.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{a.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Reveal>

      {/* How it works */}
      <Reveal as="section" className="bg-white py-14 sm:py-20" aria-labelledby="how-title">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">How it works</p>
            <h2 id="how-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              How next-day delivery works
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#5c6562] sm:text-base">
              From the moment you drop off a parcel in Nairobi to the moment your buyer collects it, here is exactly what happens.
            </p>
            <div className="mt-6 rounded-2xl bg-[#00473E] p-5 text-white">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15]">The result</p>
              <p className="mt-2 font-[Sora] text-xl font-semibold">Drop off today, collect tomorrow</p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/75">
                Parcels leave Nairobi overnight and are expected to arrive the following day.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {PHASES.map((phase) => (
              <div key={phase.label}>
                <span className="inline-flex rounded-full bg-[#E9FF15] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#00473E]">
                  {phase.label}
                </span>
                <ol className="mt-5">
                  {phase.steps.map((step, i) => {
                    const last = i === phase.steps.length - 1;
                    return (
                      <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0 sm:gap-5">
                        {!last && (
                          <span
                            className="absolute left-[1.35rem] top-12 h-[calc(100%-2.5rem)] w-px bg-[#00473E]/20"
                            aria-hidden
                          />
                        )}
                        <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full bg-[#00473E] text-[#E9FF15]">
                          <step.icon className="size-5" aria-hidden />
                        </span>
                        <div className="flex-1 rounded-2xl border border-black/10 bg-[#f7f8f6] p-4 sm:p-5">
                          <h3 className="font-[Sora] text-base font-semibold text-[#111] sm:text-lg">{step.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-[#5c6562] sm:text-[15px]">{step.body}</p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Drop-off branches */}
      <Reveal as="section" className="border-y border-black/[0.06] bg-[#f7f8f6] py-14 sm:py-20" aria-labelledby="dropoff-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Drop-off points</p>
            <h2 id="dropoff-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              Drop off in Nairobi CBD
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6562] sm:text-base">
              Bring your parcels to any of our three central branches. They are open 9:00 AM to 7:00 PM, Monday to Saturday, and walk-in bookings are welcome.
            </p>
          </div>
          <Reveal as="div" variant="stagger" className="mt-8 grid gap-4 md:grid-cols-3">
            {BRANCHES.map((b, i) => (
              <article key={b.id} className="flex flex-col rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
                <span className="inline-flex w-fit rounded-full bg-[#E9FF15] px-2.5 py-1 text-[11px] font-semibold text-[#00473E]">
                  Branch {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-[Sora] text-lg font-semibold text-[#111]">{b.name.replace(/ Branch$/, "")}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5c6562]">{b.address}</p>
                <a
                  href={mapsLink(b)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-[#00473E] hover:underline sm:mt-auto"
                >
                  Open in Google Maps <ArrowRight className="size-4" aria-hidden />
                </a>
              </article>
            ))}
          </Reveal>
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to="/book-parcel"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#00473E] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#005d4f]"
            >
              Book a Parcel Online <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link
              to="/pickup-points"
              className="inline-flex min-h-12 items-center rounded-full border border-[#00473E]/25 bg-white px-6 text-sm font-semibold text-[#00473E] hover:bg-[#00473E]/5"
            >
              Find a station in 132 towns
            </Link>
          </div>
        </div>
      </Reveal>

      <MiniFaq
        id="upcountry-faq"
        items={faqByIds(["delivery-time", "send-outside-nairobi", "how-cod-works", "tracking"])}
        tone="white"
        kicker="Upcountry delivery"
        description="Timing, sending from outside Nairobi, and how COD works for upcountry buyers."
      />

      <Footer />
    </div>
  );
}
