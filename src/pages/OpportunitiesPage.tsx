import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, BadgeCheck, Mail, MessageCircle, Package, Phone, Store } from 'lucide-react';
import Footer from '../components/Footer';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { FaqAccordionItem } from '../components/FaqAccordion';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Reveal } from '../components/Reveal';
import { AGENT_PROCESS, AGENT_ROLES, type AgentRole } from '../lib/agentRoles';
import type { FaqItem } from '../lib/faqData';

const PAGE_TITLE = 'Become a ParcelGrid Courier Agent Kenya | Pickup & Booking';
const PAGE_DESCRIPTION =
  'Earn 20% commission as a ParcelGrid pickup or booking agent. Turn your shop into a trusted collection or drop-off point on a licensed national courier network.';

const STATS = [
  { value: '20%', label: 'Commission on courier fees' },
  { value: '132', label: 'Towns on the network' },
  { value: 'M-Pesa', label: 'Wallet payouts' },
  { value: '0', label: 'Cash handled for COD' },
];

const FAQS: FaqItem[] = [
  {
    id: 'agent-commission',
    question: 'How much do agents earn?',
    answer: {
      text: 'Both agent types earn 20% commission. Pickup Agents earn it on the net courier fee for every parcel collected at their point. Booking Agents earn it on the courier fee (excluding VAT) for every parcel they book. Earnings are credited to your ParcelGrid Agent Wallet and can be withdrawn to M-Pesa.',
    },
  },
  {
    id: 'agent-cash',
    question: 'Do I handle customers’ cash for COD parcels?',
    answer: {
      text: 'No. Customer payments for COD parcels are settled automatically through ParcelGrid systems, so you do not handle cash directly.',
    },
  },
  {
    id: 'agent-start',
    question: 'How long until I can start?',
    answer: {
      text: 'After customer care reviews your details you will get a training invite. Once you are trained and activated, you start receiving parcels within days.',
    },
  },
];

/** Shows a generated photo if it exists, otherwise a branded panel. */
const AgentImage: React.FC<{ src: string; alt: string; className?: string; priority?: boolean }> = ({ src, alt, className = '', priority = false }) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative flex items-center justify-center overflow-hidden bg-[#00473E] ${className}`}
      >
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_30%,rgba(233,255,21,0.18),transparent_70%)]"
          aria-hidden
        />
        <div className="relative flex size-20 items-center justify-center rounded-3xl bg-[#E9FF15] text-[#00473E]">
          <Package className="size-10" aria-hidden />
        </div>
      </div>
    );
  }
  return <img src={src} alt={alt} decoding="async" {...(priority ? { fetchPriority: "high" as const } : { loading: "lazy" as const })} onError={() => setFailed(true)} className={`object-cover ${className}`} />;
};

const OpportunitiesPage: React.FC = () => {
  useScrollToTop();
  const [searchParams, setSearchParams] = useSearchParams();
  const roleId = searchParams.get('role') === 'booking' ? 'booking' : 'pickup';
  const role = AGENT_ROLES.find((r) => r.id === roleId) as AgentRole;

  const selectRole = (next: AgentRole['id'], scroll = false) => {
    setSearchParams({ role: next }, { replace: true, preventScrollReset: true });
    if (scroll) {
      requestAnimationFrame(() =>
        document.getElementById('apply')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
      );
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="keywords" content="ParcelGrid agent, pickup agent Kenya, booking agent Kenya, courier agent commission, logistics business Kenya" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/opportunities` : ''} />
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-28 sm:px-8 sm:pb-16 sm:pt-32 lg:grid-cols-2 lg:gap-14">
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">Partner with ParcelGrid</p>
            <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
              Become a ParcelGrid Agent
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg lg:mx-0">
              Turn your shop into a collection or drop-off point on a licensed national courier network, and earn commission on every parcel.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-2 lg:justify-start">
              <button
                type="button"
                onClick={() => selectRole('pickup', true)}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
              >
                Pickup Agent requirements <ArrowRight className="size-4" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => selectRole('booking', true)}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Booking Agent requirements
              </button>
            </div>
          </div>
          <div className="relative">
            <AgentImage
              priority
              src="/agent/agent-hero.webp"
              alt="A ParcelGrid agent handing a parcel to a customer at a shop counter"
              className="aspect-[4/3] w-full rounded-3xl border border-white/10"
            />
            <div className="absolute -bottom-4 left-4 rounded-2xl border border-white/15 bg-[#00473E]/95 p-4 backdrop-blur-md sm:left-6">
              <p className="font-[Sora] text-2xl font-semibold text-[#E9FF15]">20%</p>
              <p className="text-xs text-white/80">commission on every parcel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <Reveal as="section" variant="up" className="border-b border-black/[0.06] bg-[#f7f8f6] py-10 sm:py-14">
        <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 px-0 sm:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white px-4 py-7 text-center sm:py-9">
              <dt className="font-[Sora] text-2xl font-semibold tracking-tight text-[#00473E] sm:text-3xl">{s.value}</dt>
              <dd className="mt-2 text-xs uppercase tracking-[0.12em] text-[#5c6562]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      {/* Roles */}
      <Reveal as="section" variant="up" className="py-14 sm:py-20" aria-labelledby="roles-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Two ways to partner</p>
            <h2 id="roles-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              Choose how you want to earn
            </h2>
          </div>
          <div className="reveal-stagger mt-8 grid gap-6 md:grid-cols-2">
            {AGENT_ROLES.map((r) => (
              <article key={r.id} className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white">
                <AgentImage
                  src={`/agent/${r.id}-agent.webp`}
                  alt={r.id === 'pickup' ? 'A customer collecting a parcel from a ParcelGrid pickup agent' : 'A booking agent booking a parcel in the ParcelGrid app'}
                  className="aspect-[16/9] w-full"
                />
                <div className="flex flex-1 flex-col p-5 sm:p-6">
                  <div className="flex flex-wrap gap-2">
                    {r.tags.map((t) => (
                      <span key={t} className="rounded-full bg-[#E9FF15] px-2.5 py-1 text-[11px] font-semibold text-[#00473E]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-4 flex items-center gap-2 font-[Sora] text-xl font-semibold text-[#111]">
                    {r.id === 'pickup' ? <Store className="size-5 text-[#00473E]" aria-hidden /> : <Package className="size-5 text-[#00473E]" aria-hidden />}
                    {r.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5c6562]">{r.summary}</p>
                  <ul className="mt-4 space-y-2">
                    {r.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-[#3d4542]">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#00473E]" aria-hidden />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto pt-7">
                    <button
                      type="button"
                      onClick={() => selectRole(r.id, true)}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#005d4f]"
                    >
                      See requirements <ArrowRight className="size-4" aria-hidden />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Process */}
      <Reveal as="section" variant="up" className="bg-[#071410] py-14 text-white sm:py-20" aria-labelledby="process-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15]">How it works</p>
          <h2 id="process-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            From first call to first commission
          </h2>
          <ol className="reveal-stagger mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {AGENT_PROCESS.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#E9FF15] font-[Sora] text-sm font-semibold text-[#00473E]">
                  {i + 1}
                </span>
                <p className="mt-4 font-semibold text-white">{step.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>

      {/* Role details + apply */}
      <Reveal as="section" variant="up" id="apply" className="scroll-mt-24 bg-[#f7f8f6] py-14 sm:py-20" aria-labelledby="apply-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Requirements and how to join</p>
          <h2 id="apply-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
            {role.name}
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-relaxed text-[#5c6562]">{role.tagline}</p>

          <div role="tablist" aria-label="Agent roles" className="mt-6 flex flex-wrap gap-2">
            {AGENT_ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                role="tab"
                aria-selected={role.id === r.id}
                onClick={() => selectRole(r.id)}
                className={`inline-flex min-h-11 items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  role.id === r.id
                    ? 'bg-[#00473E] text-white'
                    : 'border border-black/10 bg-white text-[#00473E] hover:bg-[#00473E]/5'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              {role.sections.map((sec) => {
                const ListTag = sec.ordered ? 'ol' : 'ul';
                return (
                  <div key={`${role.id}-${sec.id}`} className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
                    <h3 className="font-[Sora] text-lg font-semibold text-[#111]">{sec.title}</h3>
                    {sec.body && <p className="mt-2 text-sm leading-relaxed text-[#3d4542] sm:text-[15px]">{sec.body}</p>}
                    {sec.list && (
                      <ListTag
                        className={`mt-3 space-y-2 pl-5 text-sm leading-relaxed text-[#3d4542] marker:font-semibold marker:text-[#00473E] sm:text-[15px] ${
                          sec.ordered ? 'list-decimal' : 'list-disc'
                        }`}
                      >
                        {sec.list.map((line) => (
                          <li key={line} className="pl-1">
                            {line}
                          </li>
                        ))}
                      </ListTag>
                    )}
                  </div>
                );
              })}
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-[#00473E]/20 bg-[#00473E] p-6 text-white">
                <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15]">Ready to join?</p>
                <p className="mt-2 font-[Sora] text-lg font-semibold">Contact customer care</p>
                <p className="mt-2 text-sm leading-relaxed text-white/80">{role.applyNote}</p>
                <div className="mt-5 space-y-2">
                  <a
                    href={`https://wa.me/254745111555?text=${encodeURIComponent(`Hello ParcelGrid, I would like to become a ${role.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E9FF15] px-5 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
                  >
                    <MessageCircle className="size-4" aria-hidden /> WhatsApp 0745 111 555
                  </a>
                  <a
                    href="tel:+254745111555"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <Phone className="size-4" aria-hidden /> Call 0745 111 555
                  </a>
                  <a
                    href="tel:+254794333888"
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <Phone className="size-4" aria-hidden /> Call 0794 333 888
                  </a>
                  <a
                    href="mailto:info@escrowcourier.com"
                    className="inline-flex min-h-11 w-full items-center justify-center gap-2 text-sm font-medium text-white/80 hover:text-[#E9FF15]"
                  >
                    <Mail className="size-4" aria-hidden /> info@escrowcourier.com
                  </a>
                </div>
              </div>
              <div className="mt-4 rounded-2xl border border-black/10 bg-white p-6">
                <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Quick facts</p>
                <ul className="mt-3 space-y-2.5">
                  {role.quickFacts.map((fact) => (
                    <li key={fact} className="flex items-start gap-2 text-sm text-[#3d4542]">
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#00473E]" aria-hidden />
                      {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </Reveal>

      {/* FAQ */}
      <Reveal as="section" variant="up" className="bg-white py-14 sm:py-20" aria-labelledby="agent-faq-title">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Quick answers</p>
            <h2 id="agent-faq-title" className="mt-3 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl">
              Agent questions
            </h2>
            <Link
              to="/contact"
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-[#00473E]/25 px-5 text-sm font-semibold text-[#00473E] hover:bg-[#00473E]/5"
            >
              Talk to our team
            </Link>
          </div>
          <div className="reveal-stagger space-y-3">
            {FAQS.map((item, i) => (
              <FaqAccordionItem key={item.id} item={item} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </Reveal>

      <Footer />
    </div>
  );
};

export default OpportunitiesPage;
