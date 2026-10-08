import { useEffect, useState, type HTMLAttributes, type ReactNode } from "react";
import { JsonLd } from '../components/JsonLd';
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  BadgeCheck,
  Building2,
  MapPin,
  Package,
  Shield,
  Smartphone,
  Truck,
  Wallet,
} from "lucide-react";
import { AnimatedCounter } from "../components/AnimatedCounter";
import Footer from "../components/Footer";
import { LazyGhostFibers } from "../components/LazyShader";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import parcelsImage from "../assets/parcels.webp";

const hubs = [
  {
    name: "City Centre Mall · Ronald Ngala",
    detail: "Shop LG12, Basement, Ronald Ngala Street, Nairobi CBD",
  },
  {
    name: "Iconic Business Plaza · Moi Avenue",
    detail: "Ground Floor, Shop G13 (Between Sasa Mall & Sawa Mall), Nairobi CBD",
  },
  {
    name: "Jithada Shopping Complex · Taveta Road",
    detail: "Ground Floor, Shop F7 (Opposite Samagat Building), Nairobi CBD",
  },
];

const stats: {
  label: string;
  display?: string;
  value?: number;
  suffix?: string;
}[] = [
  { value: 300, suffix: "+", label: "Towns covered" },
  { display: "Next-Day", label: "Upcountry transit" },
  { display: "Instant", label: "M-Pesa COD payouts" },
  { display: "100%", label: "Escrow-protected funds" },
];

const problemFixes = [
  {
    title: "Guaranteed Next-Day Upcountry Transit",
    body: "Daily dispatches across our regional route network.",
  },
  {
    title: "Instant Pay on Delivery (COD)",
    body: "Your buyer inspects the package, pays via M-Pesa on collection, and your money hits your seller wallet the exact same minute.",
  },
  {
    title: "Transparent Tracking",
    body: "Automated SMS notifications keep both sender and recipient informed from dispatch to collection.",
  },
];

const deliverables = [
  {
    title: "Pay on Delivery (COD) Logistics",
    body: "Secure escrow collection with zero remittance delays.",
    icon: Wallet,
  },
  {
    title: "Prepaid Upcountry Delivery",
    body: "Fast, affordable station-to-station shipping for pre-cleared orders.",
    icon: Truck,
  },
  {
    title: "Seller Tools",
    body: "Straightforward mobile app and web portal for tracking, booking walk-ins, and managing wallet withdrawals.",
    icon: Smartphone,
  },
  {
    title: "Over-the-Counter Walk-Ins",
    body: "Drop off packages directly at any of our three CBD branches or active upcountry collection points.",
    icon: Package,
  },
];

function RevealSection({
  children,
  className = "",
  ...rest
}: {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLElement>) {
  const { ref, className: revealClass } = useRevealOnScroll<HTMLElement>();
  return (
    <section ref={ref} className={`reveal ${className} ${revealClass}`} {...rest}>
      {children}
    </section>
  );
}

function SectionKicker({
  children,
  tone = "teal",
}: {
  children: ReactNode;
  tone?: "teal" | "lime";
}) {
  return (
    <p
      className={`about-kicker text-xs font-semibold tracking-[0.22em] uppercase ${
        tone === "lime" ? "text-[#E9FF15]" : "text-[#00473E]"
      }`}
    >
      {children}
    </p>
  );
}

export default function AboutPage() {
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowStickyCta(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const aboutStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ParcelGrid",
    legalName: "Escrow Courier Networks Limited",
    description:
      "CA-licensed courier connecting online sellers to 300+ towns with next-day delivery and instant COD settlements.",
    url: origin,
    logo: origin ? `${origin}/logo.png` : "",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "+254745111555",
      areaServed: "KE",
      availableLanguage: ["English", "Swahili"],
    },
  };

  return (
    <div className="about-page min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>About ParcelGrid | Licensed Courier & Pay on Delivery Partner Kenya</title>
        <meta
          name="title"
          content="About ParcelGrid | Licensed Courier & Pay on Delivery Partner Kenya"
        />
        <meta
          name="description"
          content="Learn about ParcelGrid by Escrow Courier Networks Ltd. CA-licensed courier connecting online sellers to 300+ towns with next-day delivery and instant COD settlements."
        />
        <meta
          name="keywords"
          content="about ParcelGrid, Escrow Courier Networks Ltd, CA licensed courier Kenya, Pay on Delivery Kenya, next-day upcountry delivery, Nairobi CBD courier branches"
        />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={origin ? `${origin}/about` : ""} />
        <meta
          property="og:title"
          content="About ParcelGrid | Licensed Courier & Pay on Delivery Partner Kenya"
        />
        <meta
          property="og:description"
          content="CA-licensed courier connecting online sellers to 300+ towns with next-day delivery and instant COD settlements."
        />
        <meta property="og:image" content={origin ? `${origin}/phone.png` : ""} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About ParcelGrid | Licensed Courier & Pay on Delivery Partner Kenya"
        />
        <meta
          name="twitter:description"
          content="CA-licensed courier connecting online sellers to 300+ towns with next-day delivery and instant COD settlements."
        />
        <link rel="canonical" href={origin ? `${origin}/about` : "/about"} />
      </Helmet>
      <JsonLd data={aboutStructuredData} />

      {/* Hero */}
      <RevealSection
        className="about-hero relative -mt-24 overflow-hidden pb-10 pt-28 sm:pt-32"
        aria-labelledby="about-heading"
      >
        <div className="about-hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="reveal-up flex justify-center">
              <SectionKicker>About ParcelGrid</SectionKicker>
            </div>
            <h1
              id="about-heading"
              className="reveal-up reveal-delay-1 mt-5 font-[Sora] text-4xl font-semibold leading-[1.05] tracking-[-0.045em] text-[#111] sm:text-5xl lg:text-6xl"
            >
              Connecting Kenyan Online Sellers to 300+ Towns with Trust and Speed
            </h1>
            <p className="reveal-up reveal-delay-2 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[#5c6562] sm:text-lg">
              ParcelGrid by Escrow Courier Networks Ltd — CA-licensed courier built for Instagram vendors,
              social commerce sellers, and online businesses shipping beyond Nairobi.
            </p>
          </div>

          <div className="reveal-stagger -mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-12 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0">
            <figure className="about-media w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl bg-[#f4f5f2] sm:w-auto">
              <img decoding="async" fetchPriority="high"
                src={parcelsImage}
                alt="Parcels staged for ParcelGrid upcountry dispatch"
                className="aspect-[4/3] h-full w-full object-cover sm:aspect-[4/5]"
              />
            </figure>
            <figure className="about-media w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl bg-[#f4f5f2] sm:w-auto">
              <img decoding="async" loading="lazy"
                src="/Onlinevendor.jpeg"
                alt="Kenyan online seller preparing parcels for ParcelGrid delivery"
                className="aspect-[4/3] h-full w-full object-cover sm:aspect-[4/5]"
              />
            </figure>
            <figure className="about-media w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl bg-[#f4f5f2] sm:w-auto">
              <img decoding="async" loading="lazy"
                src="/parcel-van-golden-hour.webp"
                alt="ParcelGrid delivery van ready for next-day upcountry routes"
                className="aspect-[4/3] h-full w-full object-cover sm:aspect-[4/5] object-[70%_center]"
              />
            </figure>
          </div>
        </div>
      </RevealSection>

      {/* Who We Are + stats */}
      <RevealSection
        className="border-y border-black/[0.06] bg-[#f7f8f6] py-16 sm:py-20"
        aria-labelledby="who-we-are"
      >
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <div className="reveal-up flex justify-center">
            <SectionKicker>Who We Are</SectionKicker>
          </div>
          <h2
            id="who-we-are"
            className="reveal-up reveal-delay-1 mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl"
          >
            Built for Kenyan online commerce
          </h2>
          <p className="reveal-up reveal-delay-2 mt-6 text-base leading-relaxed text-[#5c6562] sm:text-lg">
            ParcelGrid (operated by Escrow Courier Networks Ltd) is a Communications Authority of Kenya (CA)
            licensed courier service engineered specifically for online businesses, Instagram vendors, and
            social commerce sellers.
          </p>
          <p className="reveal-up reveal-delay-3 mt-4 text-base leading-relaxed text-[#5c6562] sm:text-lg">
            We bridge the gap between Nairobi vendors and upcountry buyers. By combining secure next-day
            delivery to over 300 towns with automated Pay on Delivery (Cash on Delivery), we remove the
            friction, doubt, and payment risk from remote selling in Kenya.
          </p>
        </div>

        <dl className="reveal-stagger mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white px-4 py-8 text-center sm:py-10">
              <dt className="font-[Sora] text-2xl font-semibold tracking-tight text-[#00473E] sm:text-3xl">
                {stat.display ? (
                  stat.display
                ) : (
                  <>
                    <AnimatedCounter to={stat.value ?? 0} duration={1100} />
                    {stat.suffix}
                  </>
                )}
              </dt>
              <dd className="mt-2 text-xs tracking-[0.12em] text-[#5c6562] uppercase">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </RevealSection>

      {/* Why we built — zig zag */}
      <RevealSection className="bg-white py-16 sm:py-24" aria-labelledby="why-built">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div className="reveal-up order-2 lg:order-1">
            <SectionKicker>The problem we solve</SectionKicker>
            <h2
              id="why-built"
              className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl"
            >
              Why We Built ParcelGrid
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#5c6562]">
              Selling online in Kenya comes with two major hurdles: upcountry buyers fear paying before they
              see their package, while sellers fear sending goods without payment.
            </p>
            <p className="mt-4 text-base leading-relaxed text-[#5c6562]">
              Traditional parcel offices and bus shuttles leave packages stranded, offer zero visibility, and
              take days or weeks to remit cash collections.
            </p>
            <p className="mt-6 font-semibold text-[#111]">ParcelGrid was built to fix this:</p>
            <ul className="mt-4 space-y-4">
              {problemFixes.map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                    <BadgeCheck className="size-4" aria-hidden />
                  </span>
                  <div>
                    <p className="font-semibold text-[#111]">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[#5c6562]">{item.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal-scale relative order-1 lg:order-2">
            <div className="about-media overflow-hidden rounded-[1.75rem]">
              <img decoding="async" loading="lazy"
                src="/fleet-delivery.jpg"
                alt="ParcelGrid fleet supporting next-day upcountry delivery"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/40 bg-white/90 p-4 shadow-lg backdrop-blur-md sm:right-auto sm:max-w-[14rem]">
              <p className="font-[Sora] text-2xl font-semibold text-[#00473E]">Same minute</p>
              <p className="mt-1 text-sm text-[#5c6562]">COD funds hit your seller wallet on collection</p>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Trust anchors */}
      <RevealSection
        className="relative overflow-hidden bg-[#071410] py-16 text-white sm:py-24"
        aria-labelledby="trust-anchors"
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <LazyGhostFibers
            lineColor="#00473E"
            glowColor="#0f8f6b"
            speed={0.16}
            scale={2.1}
            rotation={0}
            rotationSpeed={0.14}
            layers={4}
            waveAmplitude={0.012}
            waveFrequency={3}
            waveSpeed={0.12}
            layerSpeed={0.06}
            twist={0.08}
            twistFrequency={5}
            twistSpeed={1}
            lineFrequency={5}
            lineSpacing={2}
            lineSharpness={16}
            glowFalloff={10}
            glowIntensity={1.35}
            brightness={1.7}
            blueBoost={0.8}
            vignette={0.88}
            grain={0.035}
            dpr={1}
          />
          <div className="absolute inset-0 bg-[#071410]/55" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-start gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          <div className="reveal-scale relative">
            <div className="about-media overflow-hidden rounded-[1.75rem]">
              <img decoding="async" loading="lazy"
                src="/Certificate.jpeg"
                alt="Communications Authority of Kenya licensing for ParcelGrid courier operations"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>
            <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#00473E]/90 p-4 backdrop-blur-md sm:right-auto sm:max-w-[16rem]">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15] uppercase">CA Licensed</p>
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                Regulated domestic courier operator — Escrow Courier Networks Ltd
              </p>
            </div>
          </div>

          <div className="reveal-up">
            <SectionKicker tone="lime">Trust anchors</SectionKicker>
            <h2
              id="trust-anchors"
              className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
            >
              Physical Presence & Licensing
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/75">
              We operate with complete regulatory backing and an accessible ground footprint in Nairobi CBD.
            </p>

            <div className="mt-8 space-y-6">
              <div className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E9FF15] text-[#00473E]">
                  <Shield className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">Regulatory Compliance</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    Officially licensed and regulated by the Communications Authority of Kenya (CA) as a
                    recognized domestic courier operator.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E9FF15] text-[#00473E]">
                  <Building2 className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">Nairobi CBD Drop-Off & Dispatch Branches</p>
                  <ul className="reveal-stagger mt-3 space-y-3">
                    {hubs.map((hub) => (
                      <li
                        key={hub.name}
                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-[#E9FF15]/35 hover:bg-white/[0.08]"
                      >
                        <p className="text-sm font-semibold text-[#E9FF15]">{hub.name}</p>
                        <p className="mt-1 text-sm leading-relaxed text-white/70">{hub.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#E9FF15] text-[#00473E]">
                  <MapPin className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold">300+ Nationwide Collection Points</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/70">
                    Verified pickup locations in all major counties and commercial centres across the
                    country.
                  </p>
                  <Link
                    to="/pickup-points"
                    className="mt-1 inline-flex min-h-11 items-center text-sm font-semibold text-[#E9FF15] transition-colors hover:text-white"
                  >
                    Explore pickup points →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* What we deliver */}
      <RevealSection className="bg-[#f7f8f6] py-16 sm:py-24" aria-labelledby="what-we-deliver">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="reveal-up mx-auto max-w-2xl text-center">
            <div className="flex justify-center">
              <SectionKicker>What We Deliver</SectionKicker>
            </div>
            <h2
              id="what-we-deliver"
              className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl"
            >
              Courier services built for sellers
            </h2>
          </div>

          <ul className="reveal-stagger mt-12 grid gap-5 sm:grid-cols-2">
            {deliverables.map((item) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.title}
                  className="rounded-2xl border border-black/[0.06] bg-white p-6 transition-shadow hover:shadow-[0_12px_40px_rgba(0,71,62,0.08)] sm:p-8"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-[#00473E] text-[#E9FF15]">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 font-[Sora] text-lg font-semibold text-[#111]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c6562] sm:text-base">{item.body}</p>
                </li>
              );
            })}
          </ul>

          <div className="reveal-scale about-media relative mt-12 overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,#071410_0%,#00473E_100%)] text-white">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_85%_100%,rgba(233,255,21,0.22),transparent_70%)]"
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-8 px-6 pt-10 sm:px-12 lg:grid-cols-[1.1fr_1fr] lg:pt-0">
              <div className="lg:py-14">
                <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15]">Your ParcelGrid wallet</p>
                <p className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
                  Seller wallet, settled instantly
                </p>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                  Track bookings, manage walk-ins, and withdraw COD funds from one place.
                </p>
              </div>
              <div className="mx-auto flex w-full max-w-[420px] items-end justify-center gap-4 lg:justify-end">
                {[
                  { src: "/app-screens/11-wallet.webp", alt: "ParcelGrid app wallet screen showing balance and COD settlements", offset: "" },
                  { src: "/app-screens/09-parcel-details.webp", alt: "ParcelGrid app parcel details screen with COD amount to collect", offset: "translate-y-8" },
                ].map((shot) => (
                  <div
                    key={shot.src}
                    className={`h-[280px] w-[46%] overflow-hidden rounded-t-[1.75rem] border-[5px] border-b-0 border-[#0b1d18] bg-[#0b1d18] shadow-[0_-12px_40px_-12px_rgba(0,0,0,0.6)] sm:h-[320px] ${shot.offset}`}
                  >
                    <img decoding="async" src={shot.src} alt={shot.alt} width={540} height={1212} loading="lazy" className="block h-auto w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* Bottom CTA */}
      <RevealSection className="bg-white pb-8 pt-4 sm:pb-12" aria-labelledby="about-cta">
        <div className="reveal-up mx-auto max-w-6xl px-5 sm:px-8">
          <div className="overflow-hidden rounded-[1.75rem] bg-[#00473E] px-6 py-14 text-center text-white sm:px-12 sm:py-16">
            <h2 id="about-cta" className="font-[Sora] text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              Ready to scale your deliveries beyond Nairobi?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/80">
              Book a parcel online or visit any of our Nairobi CBD branches on Ronald Ngala St, Moi Ave, or
              Taveta Rd today.
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
                Find Nairobi CBD Branches
              </Link>
            </div>
          </div>
        </div>
      </RevealSection>

      <Footer />

      <div
        className={`about-sticky-cta fixed inset-x-0 bottom-0 z-40 hidden border-t border-black/10 bg-white/95 px-4 py-3 backdrop-blur-md transition-transform duration-300 lg:block ${
          showStickyCta ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <p className="text-sm text-[#5c6562]">
            <span className="font-semibold text-[#111]">Ship with ParcelGrid</span>
            <span className="mx-2 text-black/20">·</span>
            CA-licensed · Instant COD · 300+ towns
          </p>
          <Link
            to="/book-parcel"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#035a4d]"
          >
            Book a Parcel
          </Link>
        </div>
      </div>
    </div>
  );
}
