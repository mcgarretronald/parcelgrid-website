import React, { useState, useEffect } from 'react';
import { JsonLd } from '../components/JsonLd';
import { PageHeroBackground } from '../components/PageHeroBackground';
import { Helmet } from 'react-helmet-async';
import { Reveal } from '../components/Reveal';
import { Phone, Mail, Clock, MessageCircle, BadgeCheck, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';
import Footer from '../components/Footer';
import { BRANCHES, SUPPORT_EMAIL, mapsLink } from '../lib/branches';

type SenderType = 'online_seller' | 'individual_sender' | 'recipient_tracking';

const SENDER_OPTIONS: { value: SenderType; label: string }[] = [
  { value: 'online_seller', label: 'Online Seller / Business' },
  { value: 'individual_sender', label: 'Individual Sender' },
  { value: 'recipient_tracking', label: 'Recipient Tracking Parcel' },
];

const CONTACT_ENDPOINTS = import.meta.env.DEV
  ? ['/contact-api', '/api/contact']
  : ['/api/contact', '/contact-api'];

const PAGE_TITLE = 'Contact ParcelGrid Courier | Nairobi CBD Branches & Support';
const PAGE_DESCRIPTION =
  'Visit ParcelGrid courier branches in Nairobi CBD: City Centre Mall Shop LG12 (Ronald Ngala), Iconic Business Plaza Shop G13 (Moi Ave), and Jithada Complex Shop F7 (Taveta Rd). Call 0745 111 555.';

const buildSchema = (origin: string) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${origin}/#organization`,
      name: 'ParcelGrid',
      legalName: 'Escrow Courier Networks Ltd',
      url: origin,
      email: SUPPORT_EMAIL,
      telephone: '+254745111555',
      contactPoint: [
        { '@type': 'ContactPoint', telephone: '+254745111555', contactType: 'customer service', areaServed: 'KE', availableLanguage: ['en', 'sw'] },
        { '@type': 'ContactPoint', telephone: '+254794333888', contactType: 'customer service', areaServed: 'KE', availableLanguage: ['en', 'sw'] },
      ],
    },
    ...BRANCHES.map((b) => ({
      '@type': 'LocalBusiness',
      '@id': `${origin}/contact#${b.id}`,
      name: `ParcelGrid – ${b.name}`,
      description: `Courier and parcel delivery branch: ${b.services.join(', ')}.`,
      url: `${origin}/contact`,
      telephone: `+${b.phoneIntl}`,
      email: SUPPORT_EMAIL,
      parentOrganization: { '@id': `${origin}/#organization` },
      address: {
        '@type': 'PostalAddress',
        streetAddress: b.address.replace(/, Nairobi CBD$/, ''),
        addressLocality: 'Nairobi',
        addressRegion: 'Nairobi County',
        addressCountry: 'KE',
      },
      geo: { '@type': 'GeoCoordinates', latitude: b.geo.lat, longitude: b.geo.lng },
      hasMap: mapsLink(b),
      openingHoursSpecification: [
        { '@type': 'OpeningHoursSpecification', dayOfWeek: b.hoursSpec.days, opens: b.hoursSpec.opens, closes: b.hoursSpec.closes },
      ],
    })),
  ],
});

const inputClass =
  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#111] placeholder:text-[#9aa3a0] outline-none transition-colors focus:border-[#00473E] focus:ring-2 focus:ring-[#00473E]/15';
type FieldErrors = Partial<Record<'name' | 'phone' | 'senderType' | 'message', string>>;

const isValidKenyanPhone = (raw: string) => /^(?:\+?254|0)[17]\d{8}$/.test(raw.replace(/[\s\-()]/g, ''));

const validate = (d: { name: string; phone: string; senderType: string; message: string }): FieldErrors => {
  const errors: FieldErrors = {};
  const name = d.name.trim();
  const message = d.message.trim();
  if (!name) errors.name = 'Please enter your full name.';
  else if (name.length < 2) errors.name = 'Your name looks too short.';
  if (!d.phone.trim()) errors.phone = 'Please enter your phone number.';
  else if (!/^[+\d\s\-()]+$/.test(d.phone)) errors.phone = 'Phone number can only contain digits.';
  else if (!isValidKenyanPhone(d.phone)) errors.phone = 'Enter a valid Kenyan number, e.g. 0712 345 678.';
  if (!d.senderType) errors.senderType = 'Please choose who you are.';
  if (!message) errors.message = 'Please write your message.';
  else if (message.length < 5) errors.message = 'Message must be at least 5 characters.';
  else if (message.length > 2000) errors.message = 'Message must be 2000 characters or fewer.';
  return errors;
};

const SERVER_ERROR_FIELD: Record<string, keyof FieldErrors> = {
  INVALID_NAME: 'name',
  INVALID_PHONE: 'phone',
  INVALID_SENDER_TYPE: 'senderType',
  INVALID_MESSAGE: 'message',
};

const labelClass = 'mb-2 block text-sm font-semibold text-[#111]';

const errorBorder = 'border-red-500 focus:border-red-500 focus:ring-red-500/20 bg-red-50/40';
const okBorder = 'border-black/10';

const FieldError: React.FC<{ id: string; message?: string }> = ({ id, message }) =>
  message ? (
    <p id={id} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-600">
      <AlertCircle className="size-3.5 shrink-0" aria-hidden />
      {message}
    </p>
  ) : null;

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<{ name: string; phone: string; senderType: SenderType | ''; message: string; website: string }>({
    name: '',
    phone: '',
    senderType: '',
    message: '',
    website: '', // honeypot — hidden from real users
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [activeMap, setActiveMap] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const next = { ...formData, [name]: value };
    setFormData(next);
    // Re-validate live once a field has been touched, so errors clear as soon as they're fixed
    if (touched[name] || errors[name as keyof FieldErrors]) setErrors(validate(next));
    if (status === 'error') setStatus('idle');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
    setErrors(validate(formData));
  };

  const fieldIds: Record<keyof FieldErrors, string> = { name: 'name', phone: 'phone', senderType: 'sender-group', message: 'message' };
  const focusField = (key: keyof FieldErrors) => {
    const el = document.getElementById(fieldIds[key]);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    (el?.querySelector('input') ?? el)?.focus?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const found = validate(formData);
    setErrors(found);
    setTouched({ name: true, phone: true, senderType: true, message: true });
    const firstInvalid = (['name', 'phone', 'senderType', 'message'] as const).find((k) => found[k]);
    if (firstInvalid) {
      setStatus('error');
      setErrorMessage('Please fix the highlighted fields and try again.');
      focusField(firstInvalid);
      return;
    }
    setStatus('sending');
    setErrorMessage('');

    const payload = {
      fullName: formData.name,
      phone: formData.phone,
      senderType: formData.senderType,
      message: formData.message,
      website: formData.website,
      sourcePage: '/contact',
    };

    let lastError = 'We could not reach our servers. Check your connection and try again, or call 0745 111 555.';
    for (const endpoint of CONTACT_ENDPOINTS) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.success) {
          setStatus('success');
          setFormData({ name: '', phone: '', senderType: '', message: '', website: '' });
          return;
        }
        // 4xx = validation / rate limit: show the server's message, don't try other endpoints
        if (res.status >= 400 && res.status < 500 && res.status !== 404) {
          const field = SERVER_ERROR_FIELD[data?.error];
          if (field) {
            setErrors({ [field]: data?.message || 'Please check this field.' });
            setStatus('error');
            setErrorMessage('Please fix the highlighted field and try again.');
            focusField(field);
            return;
          }
          lastError = res.status === 429
            ? 'You have sent too many messages. Please wait a few minutes or call 0745 111 555.'
            : data?.message || lastError;
          break;
        }
      } catch {
        // network failure — try next endpoint
      }
    }
    setErrorMessage(lastError);
    setStatus('error');
  };

  const schema = buildSchema(typeof window !== 'undefined' ? window.location.origin : '');

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta name="keywords" content="contact parcelgrid, courier Nairobi CBD, Ronald Ngala courier, Moi Avenue courier, Taveta Road courier, escrow courier phone, WhatsApp courier Kenya" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/contact` : ''} />
      </Helmet>
      <JsonLd data={schema} />

      {/* Hero */}
      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-16 sm:pt-32">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">Contact & Support</p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            Contact ParcelGrid &amp; Find Our Nairobi CBD Branches
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-relaxed text-white/75 sm:text-lg">
            Need to drop off a parcel, track a package, or ask about Pay on Delivery? Visit our central branches or speak directly with our team.
          </p>
        </div>
      </section>

      {/* Branches + map */}
      <Reveal as="section" variant="up" className="border-b border-black/[0.06] bg-[#f7f8f6] py-12 sm:py-16" id="branches">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Central branches</p>
            <h2 className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
              Our Nairobi CBD Branches
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#5c6562] sm:text-base">
              Walk in to book, drop off or dispatch. Every branch is open Monday to Saturday.
            </p>
          </div>

          <div className="reveal-stagger mt-8 grid gap-4 md:grid-cols-3">
            {BRANCHES.map((b) => (
              <article key={b.id} className="flex flex-col rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
                <span className="inline-flex w-fit rounded-full bg-[#E9FF15] px-2.5 py-1 text-[11px] font-semibold text-[#00473E]">
                  {b.street}
                </span>
                <h3 className="mt-4 font-[Sora] text-lg font-semibold text-[#111]">{b.name}</h3>
                <address className="mt-2 text-sm not-italic leading-relaxed text-[#5c6562]">{b.address}</address>
                <p className="mt-3 flex items-start gap-2 text-sm text-[#3d4542]">
                  <Clock className="mt-0.5 size-4 shrink-0 text-[#00473E]" aria-hidden />
                  {b.hours}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`tel:+${b.phoneIntl}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00473E]/20 bg-white px-4 text-sm font-semibold text-[#00473E] hover:bg-[#00473E]/5"
                  >
                    <Phone className="size-4" aria-hidden /> {b.phone}
                  </a>
                  <a
                    href={`https://wa.me/${b.phoneIntl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00473E]/20 bg-white px-4 text-sm font-semibold text-[#00473E] hover:bg-[#00473E]/5"
                  >
                    <MessageCircle className="size-4" aria-hidden /> WhatsApp
                  </a>
                </div>
                <p className="mt-4 text-xs font-medium leading-relaxed text-[#00473E]">
                  Services: {b.services.join(', ')}
                </p>
                <a
                  href={mapsLink(b)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#00473E] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#005d4f] sm:mt-auto"
                >
                  Open in Google Maps <ArrowUpRight className="size-4" aria-hidden />
                </a>
              </article>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white">
            <div
              role="tablist"
              aria-label="Nairobi CBD branch maps"
              className="flex overflow-x-auto overscroll-x-contain bg-[#f4f5f2] sm:grid sm:grid-cols-3 sm:overflow-visible"
            >
              {BRANCHES.map((b, i) => {
                const selected = activeMap === i;
                return (
                  <button
                    key={b.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setActiveMap(i)}
                    className={`min-w-[7.5rem] shrink-0 border-b px-3 py-3.5 text-left transition-colors sm:min-w-0 sm:px-5 sm:py-4 ${
                      selected
                        ? 'border-[#E9FF15] bg-white text-[#071410]'
                        : 'border-black/10 bg-[#f4f5f2] text-[#5d6b68] hover:text-[#071410]'
                    } ${i > 0 ? 'border-l border-l-black/10' : ''}`}
                  >
                    <span className="block truncate text-sm font-semibold">{b.tab}</span>
                    <span className="mt-0.5 hidden truncate text-xs text-[#5d6b68] sm:block">{b.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="h-[360px] bg-[#f4f5f2] sm:h-[440px]">
              <iframe
                key={BRANCHES[activeMap].id}
                title={`Map: ${BRANCHES[activeMap].name}`}
                src={BRANCHES[activeMap].mapSrc}
                className="h-full w-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Support + form */}
      <Reveal as="section" variant="up" className="py-12 sm:py-16" id="message">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.16em] text-[#00473E]">Quick enquiries</p>
              <h2 className="mt-3 font-[Sora] text-2xl font-semibold tracking-[-0.03em] text-[#111] sm:text-3xl">
                General Support
              </h2>
            </div>
            <div className="space-y-4 rounded-2xl border border-black/10 bg-[#f7f8f6] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                  <Phone className="size-4" aria-hidden />
                </span>
                <div className="text-sm">
                  <p className="font-semibold text-[#111]">Phone</p>
                  <a href="tel:+254745111555" className="inline-flex min-h-11 items-center font-medium text-[#00473E] hover:underline">0745 111 555</a>
                  <span className="mx-1.5 text-[#9aa3a0]">/</span>
                  <a href="tel:+254794333888" className="inline-flex min-h-11 items-center font-medium text-[#00473E] hover:underline">0794 333 888</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                  <MessageCircle className="size-4" aria-hidden />
                </span>
                <div className="text-sm">
                  <p className="font-semibold text-[#111]">WhatsApp</p>
                  <a href="https://wa.me/254745111555" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium text-[#00473E] hover:underline">0745 111 555</a>
                  <span className="mx-1.5 text-[#9aa3a0]">/</span>
                  <a href="https://wa.me/254794333888" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-medium text-[#00473E] hover:underline">0794 333 888</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E9FF15] text-[#00473E]">
                  <Mail className="size-4" aria-hidden />
                </span>
                <div className="text-sm">
                  <p className="font-semibold text-[#111]">Email</p>
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="inline-flex min-h-11 items-center font-medium text-[#00473E] hover:underline">{SUPPORT_EMAIL}</a>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/15 bg-[#00473E] p-5 text-white sm:p-6">
              <BadgeCheck className="size-6 text-[#E9FF15]" aria-hidden />
              <p className="mt-3 text-xs font-semibold tracking-[0.16em] text-[#E9FF15] uppercase">CA Licensed</p>
              <p className="mt-2 text-sm leading-relaxed text-white/90">
                Officially Licensed Courier Operator by the Communications Authority of Kenya (CA) — Escrow Courier Networks Ltd.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-5 sm:p-8">
            <h2 className="font-[Sora] text-xl font-semibold tracking-[-0.03em] text-[#111] sm:text-2xl">
              Send us a message
            </h2>
            <p className="mt-2 text-sm text-[#5c6562]">We reply on the phone number you give us.</p>

            {status === 'success' ? (
              <div role="status" className="mt-6 rounded-xl border border-[#00473E]/15 bg-[#00473E]/[0.04] p-6">
                <p className="font-[Sora] text-lg font-semibold text-[#00473E]">Thank you — we have your message.</p>
                <p className="mt-1 text-sm text-[#3d4542]">Our team will contact you on the phone number you provided.</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-4 inline-flex min-h-11 items-center rounded-full border border-[#00473E]/25 bg-white px-4 text-sm font-semibold text-[#00473E]"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="relative mt-6 space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} onBlur={handleBlur} maxLength={120} className={`${inputClass} ${errors.name ? errorBorder : okBorder}`} placeholder="Your full name" autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
                    <FieldError id="name-error" message={errors.name} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>Phone Number</label>
                    <input type="tel" inputMode="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} onBlur={handleBlur} maxLength={20} className={`${inputClass} ${errors.phone ? errorBorder : okBorder}`} placeholder="0712 345 678" autoComplete="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'phone-error' : undefined} />
                    <FieldError id="phone-error" message={errors.phone} />
                  </div>
                </div>

                <fieldset>
                  <legend className={labelClass}>Are you a:</legend>
                  <div id="sender-group" className="flex flex-wrap gap-2">
                    {SENDER_OPTIONS.map((opt) => {
                      const selected = formData.senderType === opt.value;
                      return (
                        <label
                          key={opt.value}
                          className={`inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-[#00473E]/30 ${
                            selected
                              ? 'bg-[#00473E] text-white'
                              : `border bg-white text-[#00473E] hover:bg-[#00473E]/5 ${errors.senderType ? 'border-red-400' : 'border-black/10'}`
                          }`}
                        >
                          <input
                            type="radio"
                            name="senderType"
                            value={opt.value}
                            checked={selected}
                            onChange={(e) => {
                              const next = { ...formData, senderType: e.target.value as SenderType };
                              setFormData(next);
                              setErrors(validate(next));
                              if (status === 'error') setStatus('idle');
                            }}
                            className="sr-only"
                          />
                          {opt.label}
                        </label>
                      );
                    })}
                  </div>
                  <FieldError id="sender-error" message={errors.senderType} />
                </fieldset>

                <div>
                  <label htmlFor="message" className={labelClass}>Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} onBlur={handleBlur} maxLength={2000} rows={5} className={`${inputClass} resize-y ${errors.message ? errorBorder : okBorder}`} placeholder="Tell us how we can help you..." aria-invalid={!!errors.message} aria-describedby={errors.message ? 'message-error' : undefined} />
                  <FieldError id="message-error" message={errors.message} />
                </div>

                {/* Honeypot — bots fill this, people never see it */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleInputChange} />
                </div>

                {status === 'error' && (
                  <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                    <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" aria-hidden />
                    <p>{errorMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#00473E] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#005d4f] disabled:opacity-60"
                >
                  {status === 'sending' && <Loader2 className="size-4 animate-spin" aria-hidden />}
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>

      <Footer />
    </div>
  );
};

export default ContactPage;
