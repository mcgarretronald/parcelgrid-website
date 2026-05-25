import React from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Link } from 'react-router-dom';

const CareersPage: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>Join Our Courier Service Team in Kenya | ParcelGrid</title>
        <meta name="title" content="Join Our Courier Service Team in Kenya | ParcelGrid" />
        <meta name="description" content="Build the future of logistics. Explore open job opportunities, internships, and career roles at ParcelGrid. Join a fast-growing Kenyan e-commerce partner." />
        <meta name="keywords" content="logistics careers, parcelgrid jobs, escrow courier hiring, logistics officer, customer relations job Nairobi, courier jobs Kenya" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Careers at ParcelGrid - Build the Future of Logistics" />
        <meta property="og:description" content="Build the future of logistics. Explore open job opportunities, internships, and career roles at ParcelGrid. Join a fast-growing team." />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/careers` : ''} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#f0e6e0' }}>
        {/* Background image — right half, fading into the cream bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80)',
            backgroundPosition: 'center right',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            maskImage: 'linear-gradient(to right, transparent 25%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.85) 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 25%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.85) 100%)',
          }}
        />
        {/* Colour tint over the image to keep the warm cream tone */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, #f0e6e0 25%, rgba(240,190,170,0.30) 55%, rgba(210,140,120,0.15) 100%)',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-36 sm:pb-20">
          <span className="inline-block border border-gray-800 text-gray-800 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            We're hiring!
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-5 leading-tight">
            Be part of our mission
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl leading-relaxed">
            We're looking for passionate people to join us on our mission. We value
            flat hierarchies, clear communication, and full ownership and responsibility.
          </p>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h4 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 sm:mb-10">
            All Open Positions
          </h4>

          <div className="divide-y divide-gray-200">
            {/* Vendor Growth Officer */}
            <div className="py-8 border-t border-b border-gray-200 flex flex-col gap-4">
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  <Link
                    to="/careers/vendor-growth-officer"
                    className="hover:text-[#00473E] transition-colors duration-150"
                  >
                    Vendor Growth and Customer Relations Officer
                  </Link>
                </h3>
                <p className="text-gray-500 mb-4 leading-relaxed max-w-2xl">
                  Help ParcelGrid grow its vendor base across Kenya. You will cold-call prospects, visit shops,
                  onboard new vendors, train them on our services, and create social media content to drive sign-ups.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Nairobi
                    </span>
                    <span className="inline-flex items-center gap-1.5 border border-gray-300 text-gray-600 text-sm px-3 py-1 rounded-full">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Full-time
                    </span>
                  </div>
                  <div className="flex sm:items-center gap-3 pt-1 sm:pt-0 flex-col sm:flex-row justify-center sm:justify-end">
                    <Link
                      to="/careers/vendor-growth-officer"
                      className="sm:hidden flex justify-center items-center gap-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                      More Details
                    </Link>
                    <Link
                      to="/careers/vendor-growth-officer"
                      className="hidden sm:inline-flex items-center gap-1 text-gray-900 font-semibold text-lg hover:text-[#00473E] transition-colors duration-150 shrink-0"
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
        </div>
      </section>

      <DownloadCTA />
      <Footer />
    </div>
  );
};

export default CareersPage;