import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Link } from 'react-router-dom';

const OpportunitiesPage: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Logistics Agent Opportunities in Kenya | ParcelGrid</title>
        <meta name="title" content="Logistics Agent Opportunities in Kenya | ParcelGrid" />
        <meta name="description" content="Earn commissions with ParcelGrid. Partner with us as a booking or pickup agent and turn your shop or business into an active delivery node in your town." />
        <meta name="keywords" content="logistics agent, escrow agent opportunities, delivery business, retail agent, commission business Kenya, booking point" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Partner with ParcelGrid - Agent Opportunities" />
        <meta property="og:description" content="Earn commissions with ParcelGrid. Partner with us as a booking or pickup agent and turn your shop or business into an active delivery node." />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/opportunities` : ''} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[48vh] sm:min-h-[56vh] lg:min-h-[64vh]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1400)',
            backgroundPosition: 'center right',
            backgroundSize: 'cover',
          }}
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-[#E9FF15] pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Logistics Agent Opportunities in Kenya</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Become part of our national network — flexible opportunities for shop owners and agents.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 sm:mb-10">
            All Open Opportunities
          </h2>

          <div className="divide-y divide-gray-200">
            <div className="py-8 border-t border-b border-gray-200 flex flex-col gap-4">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Pickup Agent</h3>
                <p className="text-gray-500 mb-4 leading-relaxed max-w-3xl">
                  Turn your shop into a trusted collection point where customers pick their prepaid or COD parcels.
                  Connect with over 400 towns and trading centers across Kenya.
                </p>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full">Nationwide</span>
                    <span className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full">Flexible</span>
                  </div>
                  <Link
                    to="/pickup-agent"
                    className="inline-flex items-center gap-1 text-gray-900 font-semibold text-lg hover:text-[#00473E] transition-colors duration-150 shrink-0 pt-1"
                  >
                    Apply
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="py-8 border-b border-gray-200 flex flex-col gap-4">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Booking Agent</h3>
                <p className="text-gray-500 mb-4 leading-relaxed max-w-3xl">
                  Help vendors and customers send parcels across Kenya by receiving drops, booking in-app,
                  and coordinating dispatch from your location.
                </p>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full">Nairobi</span>
                    <span className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full">Full-time</span>
                  </div>
                  <Link
                    to="/booking-agent"
                    className="inline-flex items-center gap-1 text-gray-900 font-semibold text-lg hover:text-[#00473E] transition-colors duration-150 shrink-0 pt-1"
                  >
                    Apply
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DownloadCTA />
      <Footer />
    </div>
  );
};

export default OpportunitiesPage;
