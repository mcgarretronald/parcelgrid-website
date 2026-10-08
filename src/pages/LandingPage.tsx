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
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
  const location = useLocation();

  // Next.js-style Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ParcelGrid',
    description: 'Kenya\'s leading Cash on Delivery (COD) delivery service for online vendors with instant settlements and nationwide coverage',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    logo: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254-XXX-XXXX',
      contactType: 'Customer Service',
      areaServed: 'KE',
      availableLanguage: ['English', 'Swahili']
    },
    sameAs: [
      'https://play.google.com/store/apps/details?id=com.escrow.escrowApp'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressLocality: 'Nairobi'
    }
  };

  const breadcrumbStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: typeof window !== 'undefined' ? window.location.origin : ''
      }
    ]
  };

  const serviceStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Courier and Delivery Service',
    provider: {
      '@type': 'Organization',
      name: 'ParcelGrid'
    },
    areaServed: {
      '@type': 'Country',
      name: 'Kenya'
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: 'https://play.google.com/store/apps/details?id=com.escrow.escrowApp',
      serviceName: 'ParcelGrid Mobile App'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Delivery Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Cash on Delivery (COD)',
            description: 'Instant settlement COD delivery service for online vendors across Kenya. Get paid immediately when customers collect their orders.'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Prepaid Delivery',
            description: 'Secure prepaid parcel delivery to several pickup points nationwide'
          }
        }
      ]
    }
  };

  // Scroll to hash targets (e.g. /#pickup-points) with offset for the fixed header
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
      {/* Next.js-style SEO Head using Helmet */}
      <Helmet>
        {/* Primary Meta Tags */}
        <title>Courier Service for Online Sellers in Kenya | ParcelGrid</title>
        <meta name="title" content="Courier Service for Online Sellers in Kenya | ParcelGrid" />
        <meta name="description" content="Expand your business with ParcelGrid. Cash on Delivery (COD) with instant settlements, nationwide pickup points, and smart notifications. Get started today!" />
        <meta name="keywords" content="COD delivery Kenya, cash on delivery, online vendor delivery, parcel delivery Kenya, instant settlements, pickup points Kenya, Nairobi delivery, Mombasa delivery, Kisumu delivery, Eldoret delivery, nationwide courier, ecommerce delivery Kenya, online business Kenya, vendor delivery service" />
        <meta name="author" content="ParcelGrid" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:title" content="Courier Service for Online Sellers in Kenya | ParcelGrid" />
        <meta property="og:description" content="Expand your business with ParcelGrid. Cash on Delivery (COD) with instant settlements, nationwide pickup points, and smart notifications." />
        <meta property="og:image" content={typeof window !== 'undefined' ? `${window.location.origin}/phone.png` : ''} />
        <meta property="og:site_name" content="ParcelGrid" />
        <meta property="og:locale" content="en_KE" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="twitter:title" content="Courier Service for Online Sellers in Kenya" />
        <meta property="twitter:description" content="Expand your business with ParcelGrid. Cash on Delivery (COD) with instant settlements and nationwide pickup points." />
        <meta property="twitter:image" content={typeof window !== 'undefined' ? `${window.location.origin}/phone.png` : ''} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.origin : ''} />
        
        {/* Mobile Optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <meta name="theme-color" content="#00473E" />
        
        {/* Geo Tags for Local SEO */}
        <meta name="geo.region" content="KE" />
        <meta name="geo.placename" content="Kenya" />
        
        {/* Structured Data */}
      </Helmet>
      <JsonLd data={structuredData} />
      <JsonLd data={breadcrumbStructuredData} />
      <JsonLd data={serviceStructuredData} />

      <LandingHero />

      <AppShowcase />

      <HowItWorks />

      <TrackParcelBand />

      <ServiceHighlights />

      <BuiltForSellers />

      <GoogleReviews />

      <NairobiHubs />

      <HomeFaq />

      <Footer />
    </div>
  );
};

export default LandingPage;

