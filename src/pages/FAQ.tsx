import React, { useMemo, useState } from 'react';
import { JsonLd } from '../components/JsonLd';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { MessageCircle, Search, SearchX } from 'lucide-react';
import Footer from '../components/Footer';
import { FaqAccordionItem } from '../components/FaqAccordion';
import { FAQ_TOPICS, faqAnswerToText } from '../lib/faqData';
import { useScrollToTop } from '../hooks/useScrollToTop';

const ALL = 'all';

const FAQ: React.FC = () => {
  useScrollToTop();
  const [topic, setTopic] = useState<string>(ALL);
  const [query, setQuery] = useState('');

  const faqStructuredData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_TOPICS.flatMap((t) => t.items).map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: faqAnswerToText(item.answer) },
      })),
    }),
    [],
  );

  const q = query.trim().toLowerCase();
  const visibleTopics = useMemo(
    () =>
      FAQ_TOPICS.filter((t) => topic === ALL || t.id === topic)
        .map((t) => ({
          ...t,
          items: q
            ? t.items.filter(
                (item) =>
                  item.question.toLowerCase().includes(q) ||
                  faqAnswerToText(item.answer).toLowerCase().includes(q),
              )
            : t.items,
        }))
        .filter((t) => t.items.length > 0),
    [topic, q],
  );
  const total = FAQ_TOPICS.reduce((n, t) => n + t.items.length, 0);

  const topicButton = (id: string, label: string, count: number) => {
    const active = topic === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => setTopic(id)}
        aria-pressed={active}
        className={`inline-flex min-h-11 shrink-0 items-center rounded-full px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap lg:w-full lg:justify-between lg:whitespace-normal lg:rounded-none lg:border-l-2 lg:bg-transparent lg:px-4 lg:py-2.5 lg:font-medium ${
          active
            ? 'bg-[#00473E] text-white lg:border-[#00473E] lg:bg-transparent lg:text-[#111]'
            : 'border border-black/10 bg-white text-[#00473E] hover:bg-[#00473E]/5 lg:border-0 lg:border-l-2 lg:border-transparent lg:text-[#5c6562] lg:hover:text-[#111]'
        }`}
      >
        <span className="min-w-0">{label}</span>
        <span className="ml-2 hidden shrink-0 text-xs text-[#9aa3a0] lg:inline">{count}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>Courier Service FAQs & Answers | ParcelGrid</title>
        <meta name="title" content="Courier Service FAQs & Answers | ParcelGrid" />
        <meta name="description" content="Answers on Pay on Delivery, next-day upcountry delivery, Nairobi CBD drop-off branches, M-Pesa withdrawals and pickup stations with ParcelGrid Kenya." />
        <meta name="keywords" content="ParcelGrid FAQ, COD delivery questions, pickup stations Kenya, instant settlements, delivery times Kenya, parcel delivery help, vendor support Kenya, how COD works" />
        <meta name="robots" content="index, follow" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:title" content="Courier Service FAQs & Answers | ParcelGrid" />
        <meta property="og:description" content="Answers on Pay on Delivery, upcountry delivery times, drop-off branches and M-Pesa withdrawals." />
        <meta property="og:image" content={typeof window !== 'undefined' ? `${window.location.origin}/phone.png` : ''} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Courier Service FAQs & Answers" />
        <meta property="twitter:description" content="Answers on Pay on Delivery, upcountry delivery times, drop-off branches and M-Pesa withdrawals." />
        <meta property="twitter:image" content={typeof window !== 'undefined' ? `${window.location.origin}/phone.png` : ''} />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/faq` : ''} />
      </Helmet>
      <JsonLd data={faqStructuredData} />

      {/* Hero — -mt-24 cancels root main padding so the dark band sits under the fixed header */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(0,71,62,0.5),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-12 pt-28 text-center sm:px-8 sm:pb-14 sm:pt-32">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">Help Centre</p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            Frequently Asked Questions
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            Everything about sending parcels, Pay on Delivery, pickup stations and getting paid with ParcelGrid.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="bg-[#f7f8f6] py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)] xl:gap-14">
          {/* Sidebar — min-w-0 so topic chips scroll instead of widening the page */}
          <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <label className="flex min-w-0 items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-2.5 shadow-sm focus-within:border-[#00473E] focus-within:ring-2 focus-within:ring-[#00473E]/15">
              <Search className="size-5 shrink-0 text-[#5c6562]" aria-hidden />
              <span className="sr-only">Search questions</span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions"
                className="min-h-11 min-w-0 w-full bg-transparent text-sm text-[#111] outline-none placeholder:text-[#9aa3a0]"
              />
            </label>

            <nav
              aria-label="FAQ topics"
              className="mt-4 flex w-full min-w-0 gap-2 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:mt-6 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-y lg:border-black/10 lg:py-3 [&::-webkit-scrollbar]:hidden"
            >
              {topicButton(ALL, 'All Topics', total)}
              {FAQ_TOPICS.map((t) => topicButton(t.id, t.title, t.items.length))}
            </nav>

            <div className="mt-6 hidden rounded-2xl border border-black/10 bg-white p-5 lg:block">
              <p className="font-[Sora] text-base font-semibold text-[#111]">Still have a question?</p>
              <p className="mt-1 text-sm leading-relaxed text-[#5c6562]">
                If you didn&apos;t find your answer, reach out and our team will help.
              </p>
              <Link
                to="/contact"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#005d4f]"
              >
                Contact Support
              </Link>
              <a
                href="https://wa.me/254745111555"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[#00473E]/25 bg-white px-5 text-sm font-semibold text-[#00473E] hover:bg-[#00473E]/5"
              >
                <MessageCircle className="size-4" aria-hidden /> WhatsApp us
              </a>
            </div>
          </aside>

          {/* Questions */}
          <div className="min-w-0 space-y-10">
            {visibleTopics.length === 0 ? (
              <div className="rounded-2xl border border-black/10 bg-white px-6 py-14 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-[#00473E] text-[#E9FF15]">
                  <SearchX className="size-6" aria-hidden />
                </div>
                <p className="mt-4 font-[Sora] text-lg font-semibold text-[#111]">No matching questions</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-[#5c6562]">
                  Try a different word, or ask our team directly and we&apos;ll answer you.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setTopic(ALL);
                    }}
                    className="inline-flex min-h-11 items-center rounded-full border border-[#00473E]/25 bg-white px-4 text-sm font-semibold text-[#00473E]"
                  >
                    Clear search
                  </button>
                  <Link
                    to="/contact"
                    className="inline-flex min-h-11 items-center rounded-full bg-[#00473E] px-4 text-sm font-semibold text-white"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            ) : (
              visibleTopics.map((t, ti) => (
                <section key={t.id} aria-labelledby={`topic-${t.id}`}>
                  <h2
                    id={`topic-${t.id}`}
                    className="inline-flex rounded-full bg-[#E9FF15] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#00473E]"
                  >
                    {t.title}
                  </h2>
                  <div className="mt-4 space-y-3">
                    {t.items.map((item, i) => (
                      <FaqAccordionItem
                        key={`${topic}-${q}-${item.id}`}
                        item={item}
                        defaultOpen={ti === 0 && i === 0 && !q}
                      />
                    ))}
                  </div>
                </section>
              ))
            )}

            {/* Mobile support card */}
            <div className="rounded-2xl border border-black/10 bg-white p-5 lg:hidden">
              <p className="font-[Sora] text-base font-semibold text-[#111]">Still have a question?</p>
              <p className="mt-1 text-sm text-[#5c6562]">If you didn&apos;t find your answer, reach out.</p>
              <Link
                to="/contact"
                className="mt-4 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;
