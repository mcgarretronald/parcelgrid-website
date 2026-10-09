import { Link } from "react-router-dom";
import { JsonLd } from '../components/JsonLd';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  BadgeCheck,
  BellRing,
  Check,
  Moon,
  PackageCheck,
  Store,
  Wallet,
  Zap,
} from "lucide-react";
import Footer from "../components/Footer";
import { Reveal } from "../components/Reveal";
import { MiniFaq } from "../components/MiniFaq";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { COD_FAQ_IDS, faqByIds } from "../lib/faqData";

const PAGE_TITLE = "Pay on Delivery Courier Kenya | Instant M-Pesa COD | ParcelGrid";
const PAGE_DESCRIPTION =
  "Stop losing upcountry sales. Use ParcelGrid's Pay on Delivery (COD) courier services in Kenya. Buyers pay via M-Pesa at pickup, and you get paid instantly.";

const STEPS = [
  {
    icon: Store,
    title: "Book and drop off",
    body: "Declare the item value and drop it off at our Ronald Ngala, Moi Avenue, or Taveta Road branches.",
  },
  {
    icon: Moon,
    title: "Overnight transit",
    body: "We securely ship the parcel overnight to any of our 132 upcountry pickup stations.",
  },
  {
    icon: PackageCheck,
    title: "Buyer inspects and pays",
    body: "The buyer gets an SMS, inspects the parcel at the station, and pays the exact amount by M-Pesa when the station agent sends the prompt.",
  },
  {
    icon: Wallet,
    title: "Instant settlement",
    body: "The moment the M-Pesa payment goes through, the money reaches your ParcelGrid wallet. No waiting days for remittances.",
  },
];

const FEE_ITEMS = ["M-Pesa payment prompts at collection", "Secure wallet remittance", "Automated reconciliation"];

const NOTIFICATIONS = [
  { title: "Drop-off confirmed", body: "Vendors get an instant notification when their parcel is registered at a ParcelGrid drop-off point." },
  { title: "Parcel routed and arrived", body: "Customers receive an SMS or app alert the moment their parcel reaches the pickup station." },
  { title: "Ready for collection", body: "Customers get a reminder that their parcel is ready, with collection hours and the agent's contact." },
  { title: "Collected and paid", body: "Vendors are alerted once the customer collects the parcel. For COD, the alert also confirms payment." },
];

const COMPARE = [
  { label: "Who pays at the station", cod: "The buyer, by M-Pesa", prepaid: "Nobody. The buyer already paid you" },
  { label: "What you pay", cod: "Courier fee, plus the 1.8% handling fee on the collected amount", prepaid: "The courier fee only" },
  { label: "When you get paid", cod: "Instantly, into your ParcelGrid wallet", prepaid: "You were already paid by your customer" },
  { label: "What the buyer needs", cod: "Their release code, and enough M-Pesa balance", prepaid: "Their release code" },
];

const BENEFITS = [
  "You control how your customers pay: prepaid or COD.",
  "No manual chasing of payments. The system links each order with its COD amount.",
  "Instant settlements. Your money is available as soon as the buyer pays.",
];

const serviceSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Pay on Delivery (COD) courier in Kenya",
  serviceType: "Cash on Delivery courier service",
  description: PAGE_DESCRIPTION,
  areaServed: { "@type": "Country", name: "Kenya" },
  provider: { "@type": "Organization", name: "ParcelGrid", legalName: "Escrow Courier Networks Ltd", url: origin },
  url: `${origin}/services/pay-on-delivery-courier-kenya`,
});

export default function PrepaidCODPage() {
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
          content="pay on delivery courier Kenya, cash on delivery Kenya, COD courier service, M-Pesa COD, prepaid courier Kenya, sell upcountry Kenya"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={origin ? `${origin}/services/pay-on-delivery-courier-kenya` : ""} />
      </Helmet>
      <JsonLd data={serviceSchema(origin)} />

      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">Pay on Delivery</p>
          <h1 className="mx-auto mt-4 max-w-3xl font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            Sell Upcountry Safely with Instant Pay on Delivery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Don&apos;t let payment trust issues kill your sales. We deliver the parcel, collect the money by M-Pesa from your buyer, and instantly credit your wallet.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              to="/book-parcel"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
            >
              Book a COD Parcel Now <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 items-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Reveal as="section" className="border-b border-black/[0.06] bg-[#f7f8f6] py-10 sm:py-14">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-4">
          {[
            { v: "Instant", l: "Wallet credit on collection" },
            { v: "1.8%", l: "Handling fee, COD only" },
            { v: "132", l: "Pickup towns" },
            { v: "M-Pesa", l: "Buyer pays at the station" },
          ].map((s) => (
            <div key={s.l} className="min-w-0 bg-white px-3 py-7 text-center sm:px-4 sm:py-9">
              <dt className="font-[Sora] text-2xl font-semibold tracking-tight text-[#00473E] sm:text-3xl">{s.v}</dt>
              <dd className="mt-2 break-words text-xs leading-snug text-[#5c6562] normal-case tracking-normal sm:uppercase sm:tracking-[0.12em]">
                {s.l}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* How it works */}
      <Reveal as="section" id="how-it-works" className="scroll-mt-24 py-14 sm:py-20" aria-labelledby="how-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">How it works</p>
            <h2 id="how-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              How ParcelGrid COD works
            </h2>
          </div>
          <Reveal as="ol" variant="stagger" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative flex flex-col rounded-2xl border border-black/10 bg-[#f7f8f6] p-6">
                <span className="absolute right-5 top-4 font-[Sora] text-4xl font-semibold text-[#00473E]/10" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex size-11 items-center justify-center rounded-full bg-[#00473E] text-[#E9FF15]">
                  <s.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-[Sora] text-lg font-semibold text-[#111]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5c6562]">{s.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Reveal>

      {/* Settlements + fee */}
      <Reveal as="section" id="instant-settlements" className="scroll-mt-24 bg-[#071410] py-14 text-white sm:py-20" aria-labelledby="settle-title">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15]">Instant COD settlements</p>
            <h2 id="settle-title" className="mt-3 font-[Sora] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
              Your money, the moment the buyer pays
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              COD payments are credited to your ParcelGrid wallet instantly. Secure, transparent, and designed to keep your business liquid.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "At collection, our station agent sends an M-Pesa prompt to the buyer for the exact amount you entered.",
                "The COD amount, minus a 1.8% handling fee, reflects in your wallet immediately after payment confirmation.",
                "Transfer from your wallet to your own M-Pesa number anytime. No batch settlements, no waiting.",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm leading-relaxed text-white/85">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#E9FF15]" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                <Zap className="size-5" aria-hidden />
              </span>
              <h3 className="font-[Sora] text-lg font-semibold">What the 1.8% handling fee covers</h3>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              The 1.8% COD handling fee covers payment collection through the M-Pesa prompt our station agents send to the buyer, secure wallet remittance, and the automated reconciliation infrastructure that powers ParcelGrid®. This ensures fast, accurate settlements to vendors without additional withdrawal costs.
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {FEE_ITEMS.map((f) => (
                <li key={f} className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-[#E9FF15]">
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>

      {/* COD vs Prepaid */}
      <Reveal as="section" className="bg-[#f7f8f6] py-14 sm:py-20" aria-labelledby="prepaid-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Prepaid or COD</p>
            <h2 id="prepaid-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              Already got paid upfront? Use Prepaid.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6562] sm:text-base">
              If your customer has already paid for the goods, choose Prepaid when booking. You only pay the courier fee, and the buyer collects with their release code. Whether you need M-Pesa collection on delivery or standard prepaid shipping upcountry, we handle both.
            </p>
          </div>

          {/* Desktop comparison */}
          <div className="mt-10 hidden overflow-hidden rounded-2xl border border-black/10 bg-white md:block">
            <div className="grid grid-cols-[1.1fr_1.4fr_1.4fr] bg-[#00473E] text-sm font-semibold text-white">
              <div className="px-6 py-4" />
              <div className="px-6 py-4">Pay on Delivery (COD)</div>
              <div className="px-6 py-4 text-[#E9FF15]">Prepaid</div>
            </div>
            {COMPARE.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-[1.1fr_1.4fr_1.4fr] text-sm ${i % 2 ? "bg-[#f7f8f6]" : ""}`}>
                <div className="px-6 py-4 font-semibold text-[#111]">{row.label}</div>
                <div className="px-6 py-4 text-[#3d4542]">{row.cod}</div>
                <div className="px-6 py-4 text-[#3d4542]">{row.prepaid}</div>
              </div>
            ))}
          </div>

          {/* Mobile comparison */}
          <div className="mt-10 grid gap-4 md:hidden">
            {[
              { name: "Pay on Delivery (COD)", key: "cod" as const, dark: true },
              { name: "Prepaid", key: "prepaid" as const, dark: false },
            ].map((col) => (
              <div key={col.key} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
                <p className={`px-5 py-3 text-sm font-semibold ${col.dark ? "bg-[#00473E] text-white" : "bg-[#E9FF15] text-[#00473E]"}`}>
                  {col.name}
                </p>
                <dl className="divide-y divide-black/[0.06]">
                  {COMPARE.map((row) => (
                    <div key={row.label} className="px-5 py-3.5">
                      <dt className="text-xs font-semibold text-[#5c6562]">{row.label}</dt>
                      <dd className="mt-0.5 text-sm text-[#111]">{row[col.key]}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Notifications */}
      <Reveal as="section" id="notifications" className="scroll-mt-24 py-14 sm:py-20" aria-labelledby="notify-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Stay informed</p>
            <h2 id="notify-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              Smart SMS and app notifications
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6562] sm:text-base">
              ParcelGrid keeps vendors and customers informed with real-time SMS and app alerts at every delivery stage.
            </p>
          </div>
          <Reveal as="ul" variant="stagger" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {NOTIFICATIONS.map((n) => (
              <li key={n.title} className="rounded-2xl border border-black/10 bg-[#f7f8f6] p-5">
                <span className="flex size-10 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                  <BellRing className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-[Sora] text-base font-semibold text-[#111]">{n.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5c6562]">{n.body}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </Reveal>

      {/* Benefits */}
      <Reveal as="section" className="border-y border-black/[0.06] bg-[#f7f8f6] py-12 sm:py-16" aria-labelledby="benefits-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 id="benefits-title" className="font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
            Vendor benefits
          </h2>
          <Reveal as="ul" variant="stagger" className="mt-6 grid gap-4 md:grid-cols-3">
            {BENEFITS.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-relaxed text-[#3d4542]">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-[#00473E]" aria-hidden />
                {b}
              </li>
            ))}
          </Reveal>
        </div>
      </Reveal>

      <MiniFaq
        id="cod-faq"
        items={faqByIds(COD_FAQ_IDS)}
        tone="white"
        kicker="Pay on Delivery"
        description="How COD collection, payouts and returns work, before you book your first parcel."
      />

      <Footer />
    </div>
  );
}
