import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import Footer from '../components/Footer';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Reveal } from '../components/Reveal';
import { CAREER_VALUES, JOBS } from '../lib/careers';

const PAGE_TITLE = 'Careers at ParcelGrid | Courier Jobs in Nairobi, Kenya';
const PAGE_DESCRIPTION =
  'Build the future of logistics in Kenya. Explore open roles at ParcelGrid, a licensed courier network growing fast across 132 towns.';

const CareersPage: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="keywords" content="ParcelGrid careers, courier jobs Nairobi, logistics jobs Kenya, accountant job Nairobi, finance jobs Kenya" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/careers` : ''} />
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <span className="inline-flex rounded-full border border-[#E9FF15]/40 px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-[#E9FF15]">
            We&apos;re hiring
          </span>
          <h1 className="mt-5 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            Be part of our mission
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            We&apos;re looking for passionate people to join us on our mission. We value flat hierarchies, clear communication, and full ownership and responsibility.
          </p>
          <div className="mt-7 flex justify-center">
            <a
              href="#open-roles"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
            >
              See open roles <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* Values */}
      <Reveal as="section" variant="up" className="border-b border-black/[0.06] bg-[#f7f8f6] py-12 sm:py-16" aria-labelledby="values-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">How we work</p>
          <h2 id="values-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
            What we value
          </h2>
          <ul className="reveal-stagger mt-8 grid gap-4 md:grid-cols-3">
            {CAREER_VALUES.map((v, i) => (
              <li key={v.title} className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#E9FF15] font-[Sora] text-sm font-semibold text-[#00473E]">
                  {i + 1}
                </span>
                <p className="mt-4 font-[Sora] text-lg font-semibold text-[#111]">{v.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-[#5c6562]">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Open roles */}
      <Reveal as="section" variant="up" id="open-roles" className="scroll-mt-24 py-14 sm:py-20" aria-labelledby="roles-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Join the team</p>
              <h2 id="roles-title" className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
                All open positions
              </h2>
            </div>
            <p className="text-sm text-[#5c6562]">
              {JOBS.length} open {JOBS.length === 1 ? 'role' : 'roles'}
            </p>
          </div>

          <ul className="mt-8 space-y-4">
            {JOBS.map((job) => (
              <li key={job.slug}>
                <Link
                  to={`/careers/${job.slug}`}
                  className="group block rounded-2xl border border-black/10 bg-white p-5 transition-colors hover:border-[#00473E]/40 sm:p-7"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9FF15] px-3 py-1 text-xs font-semibold text-[#00473E]">
                      <MapPin className="size-3.5" aria-hidden /> {job.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9FF15] px-3 py-1 text-xs font-semibold text-[#00473E]">
                      <Clock className="size-3.5" aria-hidden /> {job.type}
                    </span>
                  </div>
                  <h3 className="mt-4 font-[Sora] text-xl font-semibold tracking-[-0.02em] text-[#111] group-hover:text-[#00473E] sm:text-2xl">
                    {job.title}
                  </h3>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5c6562] sm:text-base">{job.summary}</p>
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#00473E]">{job.salary}</p>
                    <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white transition-colors group-hover:bg-[#005d4f]">
                      View role and apply <ArrowRight className="size-4" aria-hidden />
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Contact */}
      <Reveal as="section" variant="fade" className="bg-[#071410] py-14 text-white sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2 className="font-[Sora] text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
            Questions about working at ParcelGrid?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/70">
            Talk to our team and we will point you in the right direction.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <a
              href="https://wa.me/254745111555"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#00473E] hover:bg-[#d4e614]"
            >
              <MessageCircle className="size-4" aria-hidden /> WhatsApp 0745 111 555
            </a>
            <a
              href="tel:+254794333888"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Phone className="size-4" aria-hidden /> Call 0794 333 888
            </a>
          </div>
        </div>
      </Reveal>

      <Footer />
    </div>
  );
};

export default CareersPage;
