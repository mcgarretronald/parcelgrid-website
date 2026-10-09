import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Building2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Info,
  Briefcase,
} from 'lucide-react';
import Footer from '../components/Footer';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { JOBS } from '../lib/careers';
import NotFoundPage from './NotFoundPage';

const JobPage: React.FC = () => {
  useScrollToTop();
  const { slug } = useParams<{ slug: string }>();
  const job = JOBS.find((j) => j.slug === slug);

  if (!job) return <NotFoundPage />;

  const title = `${job.title} Job in ${job.location} | ParcelGrid Careers`;
  const description = job.summary;

  const details = [
    { icon: MapPin, label: 'Location', value: job.location },
    { icon: Clock, label: 'Type', value: job.type },
    { icon: Banknote, label: 'Pay', value: job.salary },
    { icon: Building2, label: 'Company', value: 'ParcelGrid' },
    { icon: Briefcase, label: 'Experience', value: job.experience },
  ];

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content={`${job.title} job Nairobi, ParcelGrid careers, careers Kenya, jobs Nairobi`}
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/careers/${job.slug}` : ''} />
      </Helmet>

      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-28 sm:px-8 sm:pb-14 sm:pt-32">
          <Link to="/careers" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-white/70 hover:text-[#E9FF15]">
            <ArrowLeft className="size-4" aria-hidden /> Back to careers
          </Link>
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9FF15] px-3 py-1 text-xs font-semibold text-[#00473E]">
              <MapPin className="size-3.5" aria-hidden /> {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E9FF15] px-3 py-1 text-xs font-semibold text-[#00473E]">
              <Clock className="size-3.5" aria-hidden /> {job.type}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl font-[Sora] text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            {job.title}
          </h1>
          <p className="mt-3 text-lg font-medium text-[#E9FF15]">{job.salary}</p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-[#f7f8f6] py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <aside className="order-first space-y-4 lg:order-last lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl bg-[#00473E] p-6 text-white">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15]">How to apply</p>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{job.applyIntro}</p>

              {job.applyEmail ? (
                <a
                  href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E9FF15] px-5 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
                >
                  <Mail className="size-4" aria-hidden /> Email {job.applyEmail}
                </a>
              ) : (
                <a
                  href="https://wa.me/254745111555"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#E9FF15] px-5 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
                >
                  <MessageCircle className="size-4" aria-hidden /> WhatsApp: 0745 111 555
                </a>
              )}

              {job.applyDeadline && (
                <p className="mt-3 text-center text-xs font-semibold text-[#E9FF15]">
                  Application deadline: {job.applyDeadline}
                </p>
              )}

              <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/10 p-3 text-xs leading-relaxed text-white/85">
                <Info className="mt-0.5 size-4 shrink-0 text-[#E9FF15]" aria-hidden />
                <span>
                  <span className="font-semibold text-white">Please note: </span>
                  {job.applyNote}
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Job details</p>
              <ul className="mt-4 space-y-3.5">
                {details.map((d) => (
                  <li key={d.label} className="flex items-start gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                      <d.icon className="size-4" aria-hidden />
                    </span>
                    <span className="text-sm">
                      <span className="block text-xs text-[#5c6562]">{d.label}</span>
                      <span className="font-medium text-[#111]">{d.value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="space-y-4">
            {job.sections.map((sec) => (
              <div key={sec.id} className="rounded-2xl border border-black/10 bg-white p-5 sm:p-7">
                <h2 className="font-[Sora] text-xl font-semibold tracking-[-0.02em] text-[#111]">{sec.title}</h2>
                {sec.paragraphs?.map((p) => (
                  <p key={p} className="mt-3 text-sm leading-relaxed text-[#3d4542] sm:text-[15px]">
                    {p}
                  </p>
                ))}
                {sec.list && (
                  <ul className="mt-4 space-y-3">
                    {sec.list.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-[#3d4542] sm:text-[15px]">
                        <BadgeCheck className="mt-0.5 size-4 shrink-0 text-[#00473E]" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default JobPage;
