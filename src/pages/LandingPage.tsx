import React, { useEffect } from 'react';
import { JsonLd } from '../components/JsonLd';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { LandingHero } from '../components/LandingHero';
import { AppShowcase } from '../components/AppShowcase';
import { HowItWorks } from '../components/HowItWorks';
import { TrackParcelBand } from '../components/TrackParcelBand';
import { BuiltForSellers } from '../components/BuiltForSellers';
import { NairobiHubs } from '../components/NairobiHubs';
import { HomeFaq } from '../components/HomeFaq';
import { GoogleReviews } from '../components/GoogleReviews';
import { ServiceHighlights } from '../components/ServiceHighlights';
import { CourierSeoBand } from '../components/CourierSeoBand';
import Footer from '../components/Footer';
import { HOME_FAQ, faqAnswerToText } from '../lib/faqData';

const SITE = 'https://escrowcourier.com';
const PAGE_TITLE = 'Courier Services Kenya | Next-Day Upcountry & Pay on Delivery | ParcelGrid';
const PAGE_DESCRIPTION =
  'Courier services Kenya for online sellers: next-day delivery to 132 towns, Pay on Delivery with instant M-Pesa, and prepaid booking. Drop off at Ronald Ngala, Moi Ave or Taveta Rd. CA-licensed.';

const LandingPage: React.FC = () => {
  const location = useLocation();
  const origin = typeof window !== 'undefined' ? window.location.origin : SITE;

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'CourierService'],
    '@id': `${SITE}/#organization`,
    name: 'ParcelGrid',
    legalName: 'Escrow Courier Networks Ltd',
    alternateName: ['ParcelGrid Courier', 'Escrow Courier'],
    description:
      'Licensed courier services in Kenya for online sellers — next-day upcountry delivery, Pay on Delivery (COD) with instant M-Pesa settlements, and prepaid parcel booking.',
    url: SITE,
    logo: `${SITE}/brand/parcelgrid-mark.png`,
    image: `${SITE}/share_banner.jpg`,
    email: 'info@escrowcourier.com',
    telephone: '+254745111555',
    priceRange: '$$',
    currenciesAccepted: 'KES',
    paymentAccepted: 'M-Pesa, Cash',
    areaServed: { '@type': 'Country', name: 'Kenya' },
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'City Centre Mall, Shop LG12, Ronald Ngala Street',
      addressLocality: 'Nairobi',
      addressCountry: 'KE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.28599,
      longitude: 36.82491,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00',
    },
    sameAs: [
      'https://www.facebook.com/p/ParcelGrid-61582861464189/',
      'https://www.instagram.com/parcelgrid/',
      'https://www.tiktok.com/@parcelgrid',
      'https://play.google.com/store/apps/details?id=com.escrow.escrowApp',
      'https://apps.apple.com/ke/app/parcelgrid-deliver-beyond-nrbi/id6749815954',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+254745111555',
        contactType: 'customer service',
        areaServed: 'KE',
        availableLanguage: ['en', 'sw'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+254794333888',
        contactType: 'customer service',
        areaServed: 'KE',
        availableLanguage: ['en', 'sw'],
      },
    ],
  };

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE}/#courier-services`,
    name: 'Courier Services Kenya — Upcountry Delivery & Pay on Delivery',
    serviceType: 'Courier and parcel delivery',
    provider: { '@id': `${SITE}/#organization` },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    description: PAGE_DESCRIPTION,
    url: SITE,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'ParcelGrid courier services',
      itemListElement: [
        {
          '@type': 'Offer',
          url: `${SITE}/services/upcountry-parcel-delivery`,
          itemOffered: {
            '@type': 'Service',
            name: 'Next-day upcountry parcel delivery',
            description:
              'Courier delivery from Nairobi CBD drop-off branches to pickup stations in 132 towns across Kenya.',
          },
        },
        {
          '@type': 'Offer',
          url: `${SITE}/services/pay-on-delivery-courier-kenya`,
          itemOffered: {
            '@type': 'Service',
            name: 'Pay on Delivery (COD) courier Kenya',
            description:
              'Cash on Delivery courier with M-Pesa collection at pickup and instant seller wallet settlement.',
          },
        },
        {
          '@type': 'Offer',
          url: `${SITE}/pricing`,
          itemOffered: {
            '@type': 'Service',
            name: 'Affordable courier rates Kenya',
            description: 'Transparent courier prices by weight, route and special items with a live fee calculator.',
          },
        },
      ],
    },
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faqAnswerToText(item.answer),
      },
    })),
  };

  const websiteLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: 'ParcelGrid',
    description: PAGE_DESCRIPTION,
    inLanguage: 'en-KE',
    publisher: { '@id': `${SITE}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE}/track?tracking={tracking_number}`,
      },
      'query-input': 'required name=tracking_number',
    },
  };

  useEffect(() => {
    if (!location.hash) return;

    const scrollToHash = () => {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (!el) return;
      const header = document.querySelector('header');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    };

    if (document.querySelector('.intro-splash')) {
      window.addEventListener('parcelgrid-intro-done', scrollToHash, { once: true });
      return () => window.removeEventListener('parcelgrid-intro-done', scrollToHash);
    }

    const timer = window.setTimeout(scrollToHash, 50);
    return () => window.clearTimeout(timer);
  }, [location]);

  return (
    <div className="min-h-screen w-full">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="title" content={PAGE_TITLE} />
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta
          name="keywords"
          content="courier services Kenya, courier Nairobi, upcountry delivery Kenya, parcel delivery Kenya, COD courier Kenya, Pay on Delivery Kenya, cheap courier Kenya, Nairobi courier, Mombasa courier, Nakuru courier, Eldoret courier, Kisumu courier, ecommerce delivery Kenya, online seller courier"
        />
        <meta name="author" content="ParcelGrid by Escrow Courier Networks Ltd" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <meta name="geo.region" content="KE-110" />
        <meta name="geo.placename" content="Nairobi" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${origin}/`} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:image" content={`${origin}/share_banner.jpg`} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ParcelGrid" />
        <meta property="og:locale" content="en_KE" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta name="twitter:image" content={`${origin}/share_banner.jpg`} />

        <link rel="canonical" href={`${origin}/`} />
        <meta name="theme-color" content="#00473E" />
      </Helmet>
      <JsonLd data={organizationLd} />
      <JsonLd data={serviceLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={websiteLd} />

      <LandingHero />

      <AppShowcase />

      <HowItWorks />

      <TrackParcelBand />

      <ServiceHighlights />

      <BuiltForSellers />

      <GoogleReviews />

      <NairobiHubs />

      <CourierSeoBand />

      <HomeFaq />

      <Footer />
    </div>
  );
};

export default LandingPage;
