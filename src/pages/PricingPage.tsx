import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Route, Scale, ShieldCheck, Wallet } from 'lucide-react';
import Footer from '../components/Footer';
import { Reveal } from '../components/Reveal';
import { JsonLd } from '../components/JsonLd';
import { MiniFaq } from '../components/MiniFaq';
import { RateCalculator } from '../components/pricing/RateCalculator';
import { SpecialItemsRates } from '../components/pricing/SpecialItemsRates';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { PRICING_FAQ_IDS, faqByIds } from '../lib/faqData';

const PAGE_TITLE =
  'Courier Prices Kenya | Affordable Parcel Delivery Rates & Calculator | ParcelGrid';
const PAGE_DESCRIPTION =
  'Check affordable courier services Kenya rates instantly. Live ParcelGrid fee calculator for drop-off, pickup town, weight bands and special items — transparent next-day upcountry pricing without WhatsApp quote spam.';

const HOW_IT_WORKS = [
  {
    icon: Route,
    title: 'Route Matters',
    body: "Prices depend on the exact distance between your drop-off branch (like our Ronald Ngala, Moi Ave, or Taveta Rd hubs) and the buyer's upcountry station.",
  },
  {
    icon: Scale,
    title: 'Weight Bands',
    body: 'Ordinary parcels are priced in simple, predictable weight tiers (like 0–2kg or 2.1–5kg) to keep your business margins safe.',
  },
  {
    icon: Wallet,
    title: 'Pay on Delivery',
    body: "Need to collect cash from your buyer? Use our COD service. You pay the standard shipping fee, plus a small escrow handling percentage on the item's value.",
  },
];

export default function PricingPage() {
  useScrollToTop();

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://escrowcourier.com';

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta
          name="keywords"
          content="affordable courier services Kenya, courier prices Kenya, parcel delivery rates Kenya, how much to send parcel Nakuru, ParcelGrid pricing, upcountry courier fee calculator"
        />
        <link rel="canonical" href={`${origin}/pricing`} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={`${origin}/pricing`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'ParcelGrid courier pricing calculator',
          description: PAGE_DESCRIPTION,
          url: `${origin}/pricing`,
          isPartOf: { '@type': 'WebSite', name: 'ParcelGrid', url: origin },
        }}
      />

      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(0,71,62,0.55),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">
            Courier prices · Kenya
          </p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
            Affordable Courier Rates for Upcountry Delivery
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75">
            Use our live calculator to check exact delivery fees across 300+ towns in Kenya — then
            book with confidence and close sales faster.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#rate-calculator"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#111]"
            >
              Open calculator
            </a>
            <Link
              to="/book-parcel"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              Book a parcel
            </Link>
          </div>
        </div>
      </section>

      <section
        id="rate-calculator"
        className="scroll-mt-28 border-b border-black/[0.06] bg-[#f7f8f6] py-12 sm:py-16"
        aria-labelledby="calculator-heading"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E] uppercase">
              Live rates
            </p>
            <h2
              id="calculator-heading"
              className="mt-2 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl"
            >
              Live Rate Calculator
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5c6562] sm:text-base">
              Build your quote in seconds based on actual transit routes.
            </p>
          </Reveal>
          <div className="mt-8">
            <RateCalculator />
          </div>
        </div>
      </section>

      <Reveal as="section" className="py-14 sm:py-20" aria-labelledby="how-pricing-heading">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E] uppercase">
            Transparent pricing
          </p>
          <h2
            id="how-pricing-heading"
            className="mt-2 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl"
          >
            What Decides Your Courier Fee?
          </h2>
          <ul className="mt-10 grid gap-6 sm:grid-cols-3">
            {HOW_IT_WORKS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="rounded-2xl border border-black/[0.06] bg-[#fafbfa] p-5">
                  <Icon className="size-5 text-[#00473E]" aria-hidden />
                  <h3 className="mt-3 font-[Sora] text-base font-semibold text-[#111]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c6562]">{item.body}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </Reveal>

      <section
        className="border-y border-black/[0.06] bg-[#f7f8f6] py-14 sm:py-20"
        aria-labelledby="specials-heading"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E] uppercase">
            Special items
          </p>
          <h2
            id="specials-heading"
            className="mt-2 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl"
          >
            Heavy &amp; Bulky Items
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5c6562] sm:text-base">
            Shipping cookers, TVs, fridges, or mattresses? Oversized goods need special handling.
            Choose drop-off and destination below to see live rates for your route.
          </p>

          <div className="mt-8">
            <SpecialItemsRates />
          </div>
        </div>
      </section>

      <Reveal as="section" className="py-14 sm:py-20" aria-labelledby="trust-heading">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <ShieldCheck className="mx-auto size-8 text-[#00473E]" aria-hidden />
          <h2
            id="trust-heading"
            className="mt-4 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl"
          >
            Built for Busy Online Sellers
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#5c6562] sm:text-base">
            Transparent pricing means no more guesswork. Give your Instagram and e-commerce buyers
            instant, accurate delivery quotes so they can buy with confidence.
          </p>
        </div>
      </Reveal>

      <MiniFaq
        id="pricing-faq"
        items={faqByIds(PRICING_FAQ_IDS)}
        tone="light"
        kicker="Pricing questions"
        heading="Transparent rates, clear answers"
        description="How fees are calculated, how Pay on Delivery works alongside shipping, and how you pay the courier fee."
      />

      <section className="bg-[#071410] py-14 sm:py-16">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
            Got your rate? Book and pay by M-Pesa
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
            Prepaid online booking uses the same transparent fee you just calculated. COD available
            when your buyer pays on collection.
          </p>
          <Link
            to="/book-parcel"
            className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#111]"
          >
            Book This Parcel
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
