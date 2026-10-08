import React from 'react';
import { JsonLd } from '../components/JsonLd';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Lightbulb, Phone, Mail } from 'lucide-react';
import Footer from '../components/Footer';
import { FaqAccordionItem } from '../components/FaqAccordion';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { APP_STORE_URL, PLAY_STORE_URL } from '../lib/storeLinks';
import type { FaqItem } from '../lib/faqData';

type Shot = { file: string; caption: string };
type Step = {
  id: string;
  title: string;
  intro?: string;
  steps: string[];
  ordered?: boolean;
  tip?: string;
  shots?: Shot[];
};

const shot = (file: string, caption: string): Shot => ({ file: `/app-screens/${file}.webp`, caption });

const STEPS: Step[] = [
  {
    id: 'download',
    title: 'Download and create your account',
    steps: [
      'Download ParcelGrid from Google Play or the App Store.',
      'Tap Sign up and register with your business phone number.',
      'Enter the OTP sent to your phone.',
      'Complete your business profile so you can start booking.',
      'If a booking agent referred you, enter their referral code during registration.',
    ],
    ordered: true,
    tip: 'Keep the same phone number you use for M-Pesa. You will need it for withdrawals.',
  },
  {
    id: 'send',
    title: 'Send a parcel',
    steps: [
      'On Home, tap Send Parcel.',
      "Enter the customer's name and phone number.",
      'Choose the destination town or pickup station where the customer will collect.',
      'Add the parcel value, weight and a short description (or pick a special item if it is listed).',
      'Choose the payment type. Prepaid: the customer already paid you, they only collect. COD: enter the exact amount to collect from the customer.',
      'Choose where you will drop the parcel off in Nairobi.',
      'Add photos of the packed parcel if you like. Photos are optional.',
      'Review the details, tap Submit and get your tracking number.',
      'Pay the shipping fee by M-Pesa, then share the receipt with your customer on WhatsApp.',
    ],
    ordered: true,
    shots: [
      shot('02-send-customer', 'Customer details'),
      shot('03-send-parcel-details', 'Parcel details and payment type'),
      shot('04-send-photos-description', 'Photos, condition and description'),
      shot('05-confirm-details', 'Review before submitting'),
      shot('06-confirm-payment', 'COD amount and contents'),
      shot('07-booking-created', 'Booking created with tracking number'),
    ],
  },
  {
    id: 'drop-off',
    title: 'Drop off your parcel',
    steps: [
      'Pack the item securely and label it clearly.',
      'Take it to the drop-off point you selected, for example Iconic Business Plaza on Moi Avenue, Jithada Shopping Complex on Taveta Road, or City Centre Mall on Ronald Ngala Street.',
      'Hand it to ParcelGrid so the status moves to Received by ParcelGrid.',
      "From there, we move it to your customer's pickup station.",
    ],
    ordered: true,
  },
  {
    id: 'track',
    title: 'Track every parcel',
    intro:
      'Open My Parcels to see all your bookings. Use the filter chips (Pending, Returns, In Transit, Ready for Collection, Delivered and more), then tap a parcel to open its Details and Timeline. You will get notifications as the status changes, and customers also get SMS and app alerts with collection details. A normal parcel moves through these statuses (see the full guide below):',
    steps: [
      'Pending',
      'Awaiting Handover',
      'Received by ParcelGrid',
      'In-Transit',
      'Ready for Collection',
      'Delivered',
    ],
    ordered: true,
    shots: [
      shot('08-my-parcels', 'Search and filter your parcels'),
      shot('09-parcel-details', 'Parcel details'),
      shot('10-parcel-timeline', 'Parcel timeline'),
    ],
  },
  {
    id: 'cod',
    title: 'How COD works',
    steps: [
      'You book the parcel as COD and enter the amount to collect.',
      "We deliver it to the customer's nearest pickup point.",
      'At collection, our station agent sends an M-Pesa prompt to the customer for that amount.',
      'After payment succeeds, the parcel is released.',
      'Your money (minus the 1.8% COD handling fee) lands in your ParcelGrid wallet.',
      'Withdraw to M-Pesa anytime from the Wallet tab.',
    ],
    ordered: true,
  },
  {
    id: 'prepaid',
    title: 'How prepaid works',
    steps: [
      'Book as Prepaid after the customer has already paid you.',
      'We deliver to their pickup point.',
      'The customer shows their release code to the agent and collects.',
      'There is no extra payment step at the station.',
    ],
    ordered: true,
  },
  {
    id: 'wallet',
    title: 'Wallet and withdrawals',
    steps: [
      'Open the Wallet tab to see your balance, COD settlements and transaction history.',
      'Tap Withdraw and enter your 4-digit security PIN.',
      'Enter the M-Pesa number to send to and the amount, then tap Continue.',
      'Your funds are sent to M-Pesa.',
    ],
    ordered: true,
    tip: "Check Wallet regularly so you always know what's settled and what's still in transit.",
    shots: [
      shot('11-wallet', 'Balance and transactions'),
      shot('12-withdraw-pin', 'Confirm with your security PIN'),
    ],
  },
  {
    id: 'home',
    title: 'Home overview',
    intro: 'Your Home screen is your daily dashboard. It shows:',
    steps: [
      'A quick search for pickup stations',
      'Promo updates',
      'A status chart of your parcels (double-tap a status to see those parcels)',
      'The Send Parcel button',
    ],
    shots: [shot('01-home', 'Home dashboard')],
  },
  {
    id: 'settings',
    title: 'Settings and support',
    intro: 'From Settings you can:',
    steps: [
      'Manage your profile and businesses',
      'View the pickup station list',
      'Save favourite customers',
      'Switch theme',
      'Open the Help Center and rate the app on the Play Store',
    ],
    shots: [shot('13-settings', 'Settings')],
  },
];

type StatusItem = { name: string; meaning: string; action?: string };
type StatusGroup = { title: string; intro?: string; items: StatusItem[] };

const STATUS_GUIDE: StatusGroup[] = [
  {
    title: 'The normal delivery journey',
    items: [
      {
        name: 'Pending',
        meaning:
          'The parcel has been booked but is not fully ready to move yet. This usually means payment for shipping is still outstanding, or the booking is waiting to be confirmed. Until it leaves Pending, it has not entered the ParcelGrid network.',
        action: 'Complete any open payment (M-Pesa prompt) so the parcel can proceed.',
      },
      {
        name: 'Awaiting Handover',
        meaning: 'The booking is confirmed. ParcelGrid is waiting for you to drop the parcel at your chosen drop-off point.',
        action: 'Take the packed parcel to the selected Nairobi drop-off station and hand it in.',
      },
      {
        name: 'Received by ParcelGrid',
        meaning:
          "The parcel has been received at our drop-off or origin point and is now in ParcelGrid's care. Sorting and onward movement to the destination town can begin.",
      },
      {
        name: 'In-Transit',
        meaning:
          "The parcel is on the way to the customer's destination pickup station. No action needed. Track progress in the app and you'll get updates as it moves.",
      },
      {
        name: 'Ready for Collection',
        meaning:
          "The parcel has arrived at the customer's pickup station and is waiting for them to collect it. Your customer should go to that station with their release code. For COD, they pay via M-Pesa at the station before the parcel is released.",
      },
      {
        name: 'Delivered',
        meaning:
          'The customer has successfully collected the parcel and the order is complete. For COD, settlement should reflect in your ParcelGrid wallet (minus the COD handling fee).',
      },
    ],
  },
  {
    title: 'Return-related statuses',
    intro:
      'Sometimes a parcel cannot be delivered as planned (the customer does not collect, wrong details, a return is requested and so on). These statuses cover that path.',
    items: [
      {
        name: 'Returns',
        meaning:
          'A filter in the app that groups parcels in any return-related stage. Use it to see everything that is returning or has been returned, not just one status.',
      },
      {
        name: 'To Be Returned',
        meaning:
          'The parcel has been marked for return and is waiting to move back through the ParcelGrid network. Collection did not complete as expected, and the return process has started.',
      },
      {
        name: 'Return Initiated',
        meaning:
          'A return has been formally started for this parcel. It is entering the return flow and will be routed back according to ParcelGrid return rules.',
      },
      { name: 'In-Transit to HQ', meaning: "The returned parcel is travelling back toward ParcelGrid's head office or main return point." },
      { name: 'Returned to HQ', meaning: 'The returned parcel has arrived at ParcelGrid head office.' },
      {
        name: 'Returned',
        meaning:
          'The return is complete. The parcel has been returned through the ParcelGrid process. Check the parcel details in the app for next steps or any related settlement notes.',
      },
    ],
  },
  {
    title: 'Other statuses you may see',
    items: [
      {
        name: 'Cancelled',
        meaning:
          'The parcel booking was cancelled and will not be delivered. There is no further movement. If you still need to send the item, create a new booking.',
      },
      {
        name: 'Received at Origin',
        meaning:
          'The parcel has been logged at the origin station, at the start of the network. In most vendor views, the main label you will follow after drop-off is Received by ParcelGrid.',
      },
    ],
  },
];

const TIPS = [
  'Pending for too long usually means the shipping payment was not completed.',
  'After booking, drop off promptly so the parcel leaves Awaiting Handover.',
  'Tell customers when a parcel is Ready for Collection so it does not sit uncollected.',
  'For COD, payment happens at the station when the customer collects, then the funds settle to your wallet.',
  'Use the Returns filter to review all return cases in one place.',
  "Enter the correct customer phone number. It's used for alerts and COD prompts.",
  'For COD, put the exact amount the customer should pay.',
  'Photos are optional, but add clear ones when you can.',
  'Drop off parcels promptly so they leave Nairobi on time.',
  'Share the tracking number or receipt with the customer right after booking.',
  'Check fragile or spill-prone items with the station when you drop them off.',
];

const FAQS: FaqItem[] = [
  {
    id: 'free',
    question: 'Is ParcelGrid free to join?',
    answer: {
      text: 'Yes. Download the app, register, and start sending. You pay shipping when you book. COD has a 1.8% handling fee on collected amounts.',
    },
  },
  {
    id: 'both',
    question: 'Do you do both prepaid and COD?',
    answer: { text: 'Yes. Choose per parcel when booking.' },
  },
  {
    id: 'money',
    question: 'When do I get COD money?',
    answer: {
      text: 'After the customer pays and collects, the amount (minus the handling fee) is credited to your ParcelGrid wallet.',
    },
  },
  {
    id: 'withdraw',
    question: 'How do I withdraw?',
    answer: { text: 'Open Wallet, tap Withdraw, enter your security PIN, then enter your M-Pesa number and the amount.' },
  },
  {
    id: 'collect',
    question: 'Where do customers collect?',
    answer: {
      text: 'At ParcelGrid pickup points in towns across Kenya. You pick the destination station when booking.',
    },
  },
];

const PAGE_TITLE = 'How to Use the ParcelGrid App | Vendor Guide';
const PAGE_DESCRIPTION =
  'A simple guide for online sellers: sign up, send parcels, track them, collect COD and withdraw your money to M-Pesa with the ParcelGrid app.';

const PhoneShot: React.FC<{ item: Shot }> = ({ item }) => (
  <figure className="mx-auto w-full max-w-[220px]">
    <div className="overflow-hidden rounded-[1.6rem] border-[5px] border-[#0b1d18] bg-[#0b1d18] shadow-[0_18px_40px_-18px_rgba(0,0,0,0.5)]">
      <img decoding="async"
        src={item.file}
        alt={`ParcelGrid app: ${item.caption}`}
        width={540}
        height={1212}
        loading="lazy"
        className="block h-auto w-full"
      />
    </div>
    <figcaption className="mt-3 text-center text-xs font-medium text-[#5c6562]">{item.caption}</figcaption>
  </figure>
);

const HowToUseAppPage: React.FC = () => {
  useScrollToTop();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use the ParcelGrid app',
    description: PAGE_DESCRIPTION,
    step: STEPS.map((s, i) => ({
      '@type': 'HowToSection',
      name: s.title,
      position: i + 1,
      itemListElement: s.steps.map((text, j) => ({ '@type': 'HowToStep', position: j + 1, text })),
    })),
  };

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="keywords" content="how to use ParcelGrid app, send parcel Kenya app, COD courier app, vendor guide, withdraw to M-Pesa" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={typeof window !== 'undefined' ? `${window.location.origin}/app-screens/01-home.webp` : ''} />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/how-to-use-app` : ''} />
      </Helmet>
      <JsonLd data={structuredData} />

      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(0,71,62,0.5),transparent_70%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">Vendor Guide</p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            How to Use the ParcelGrid App
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg">
            A simple guide for online sellers, from signing up to sending parcels, collecting COD, and withdrawing your money.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#E9FF15] px-5 text-sm font-semibold text-[#00473E] hover:bg-[#d4e614]"
            >
              Get it on Google Play <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Download on the App Store <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      {/* Intro + contents */}
      <section className="border-b border-black/[0.06] bg-[#f7f8f6] py-10 sm:py-14">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <div>
            <p className="text-base leading-relaxed text-[#3d4542] sm:text-lg">
              ParcelGrid helps you deliver prepaid and Cash on Delivery (COD) orders to pickup points across Kenya. Use the app to book parcels, track them live, get paid into your wallet, and withdraw to M-Pesa.
            </p>
            <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#3d4542]">
              <a href="tel:+254745111555" className="inline-flex items-center gap-1.5 font-semibold text-[#00473E] hover:underline">
                <Phone className="size-4" aria-hidden /> 0745 111 555
              </a>
              <a href="tel:+254794333888" className="inline-flex items-center gap-1.5 font-semibold text-[#00473E] hover:underline">
                <Phone className="size-4" aria-hidden /> 0794 333 888
              </a>
              <a href="mailto:info@escrowcourier.com" className="inline-flex items-center gap-1.5 font-semibold text-[#00473E] hover:underline">
                <Mail className="size-4" aria-hidden /> info@escrowcourier.com
              </a>
            </p>
          </div>
          <nav aria-label="Guide contents" className="rounded-2xl border border-black/10 bg-white p-5">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">In this guide</p>
            <ol className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="inline-flex min-h-11 items-center text-[#3d4542] hover:text-[#00473E] hover:underline">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* Steps */}
      <div>
        {STEPS.map((s, i) => {
          const shots = s.shots ?? [];
          const wide = shots.length > 2;
          const ListTag = s.ordered ? 'ol' : 'ul';
          return (
            <section
              key={s.id}
              id={s.id}
              aria-labelledby={`${s.id}-title`}
              className={`scroll-mt-24 py-12 sm:py-16 ${i % 2 === 0 ? 'bg-white' : 'bg-[#f7f8f6]'}`}
            >
              <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <div
                  className={`grid gap-10 ${
                    !wide && shots.length > 0 ? 'lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:gap-14' : ''
                  }`}
                >
                  <div className="max-w-2xl">
                    <span className="inline-flex size-9 items-center justify-center rounded-full bg-[#E9FF15] font-[Sora] text-sm font-semibold text-[#00473E]">
                      {i + 1}
                    </span>
                    <h2
                      id={`${s.id}-title`}
                      className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl"
                    >
                      {s.title}
                    </h2>
                    {s.intro && <p className="mt-3 text-base leading-relaxed text-[#5c6562]">{s.intro}</p>}
                    <ListTag
                      className={`mt-4 space-y-2.5 pl-5 text-[15px] leading-relaxed text-[#3d4542] marker:font-semibold marker:text-[#00473E] ${
                        s.ordered ? 'list-decimal' : 'list-disc'
                      }`}
                    >
                      {s.steps.map((line) => (
                        <li key={line} className="pl-1">
                          {line}
                        </li>
                      ))}
                    </ListTag>
                    {s.tip && (
                      <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-[#00473E]/15 bg-[#00473E]/[0.05] px-4 py-3 text-sm text-[#3d4542]">
                        <Lightbulb className="mt-0.5 size-4 shrink-0 text-[#00473E]" aria-hidden />
                        <span>
                          <span className="font-semibold text-[#00473E]">Tip: </span>
                          {s.tip}
                        </span>
                      </p>
                    )}
                  </div>

                  {shots.length > 0 && (
                    <div
                      className={`grid gap-6 ${
                        wide ? 'grid-cols-2 sm:grid-cols-3' : shots.length === 2 ? 'grid-cols-2' : 'grid-cols-1'
                      }`}
                    >
                      {shots.map((item) => (
                        <PhoneShot key={item.file} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Status guide */}
      <section id="statuses" className="scroll-mt-24 bg-white py-14 sm:py-20" aria-labelledby="status-guide-title">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">What each status means</p>
          <h2
            id="status-guide-title"
            className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl"
          >
            Parcel status guide
          </h2>
          <div className="mt-10 space-y-12">
            {STATUS_GUIDE.map((group) => (
              <div key={group.title}>
                <h3 className="font-[Sora] text-lg font-semibold text-[#111]">{group.title}</h3>
                {group.intro && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#5c6562]">{group.intro}</p>}
                <ul className="mt-5 grid gap-4 md:grid-cols-2">
                  {group.items.map((item) => (
                    <li key={item.name} className="rounded-2xl border border-black/10 bg-[#f7f8f6] p-5">
                      <span className="inline-flex rounded-full bg-[#E9FF15] px-3 py-1 text-xs font-semibold text-[#00473E]">
                        {item.name}
                      </span>
                      <p className="mt-3 text-sm leading-relaxed text-[#3d4542]">{item.meaning}</p>
                      {item.action && (
                        <p className="mt-2 text-sm leading-relaxed text-[#3d4542]">
                          <span className="font-semibold text-[#00473E]">What to do: </span>
                          {item.action}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="bg-[#071410] py-14 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-xs font-semibold tracking-[0.16em] text-[#E9FF15]">Smoother deliveries</p>
          <h2 className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Quick tips</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TIPS.map((tip) => (
              <li key={tip} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm leading-relaxed text-white/85">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#f7f8f6] py-14 sm:py-20" aria-labelledby="howto-faq-title">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div>
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Quick answers</p>
            <h2 id="howto-faq-title" className="mt-3 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl">
              Common questions
            </h2>
            <Link
              to="/faq"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white hover:bg-[#005d4f]"
            >
              View all FAQs <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <FaqAccordionItem key={item.id} item={item} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-white py-14 text-center sm:py-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <h2 className="font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-[#111] sm:text-4xl">
            Ready to deliver beyond Nairobi?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[#5c6562]">
            Download ParcelGrid, book your first parcel, and grow with prepaid and COD deliveries across Kenya.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#00473E] px-6 text-sm font-semibold text-white hover:bg-[#005d4f]"
            >
              Get it on Google Play <ArrowUpRight className="size-4" aria-hidden />
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-[#00473E]/25 px-6 text-sm font-semibold text-[#00473E] hover:bg-[#00473E]/5"
            >
              Download on the App Store <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowToUseAppPage;
