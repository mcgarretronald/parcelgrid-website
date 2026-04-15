const fs = require('fs');
const content = import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Link } from 'react-router-dom';

const CareersPage: React.FC = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-white">
      <Header transparent={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[48vh] sm:min-h-[56vh] lg:min-h-[64vh]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1687422809654-579d81c29d32?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1112)',
            backgroundPosition: 'center right',
            backgroundSize: 'cover',
          }}
        />

        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-[#E9FF15] pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Careers</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Become part of our national network  flexible careers for shop owners and agents.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join ParcelGrid Network</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              ParcelGrid is a licensed national courier network by Escrow Courier Networks Ltd. 
              We're expanding across Kenya and looking for passionate individuals to join our team.
            </p>
          </div>

          {/* Careers Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Pickup Agent Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
              <div className="bg-gradient-to-r from-[#00473E] to-[#006644] p-6 text-white text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#E9FF15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Pickup Agent</h3>
                <p className="text-white/90">Join Kenya's Widest Pickup Point Network</p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6 flex-1">
                  <p className="text-gray-600 mb-6 text-center text-lg">
                    Turn your shop into a trusted collection point where customers pick their prepaid or COD parcels.
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-3 text-center">Your Benefits & Income</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2"></span>
                      <span className="text-sm font-medium text-green-900">20% commission per parcel</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2"></span>
                      <span className="text-sm font-medium text-green-900">Increased foot traffic</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2"></span>
                      <span className="text-sm font-medium text-green-900">Automated COD via app</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2"></span>
                      <span className="text-sm font-medium text-green-900">Free national listing</span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">Requirements summary:</h4>
                  <ul className="space-y-2 text-gray-600 text-sm pl-2 border-l-2 border-green-200">
                    <li> Physical shop open 8 AM - 7 PM</li>
                    <li> Secure space for parcel storage</li>
                    <li> Smartphone for Agent App</li>
                    <li> Business permit or lease agreement</li>
                  </ul>
                </div>

                <Link 
                  to="/pickup-agent"
                  className="block w-full text-center px-6 py-4 bg-[#00473E] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#00362f] transform hover:-translate-y-0.5 transition-all duration-200 mt-auto"
                >
                  View Full Details & Apply 
                </Link>
              </div>
            </div>

            {/* Booking Agent Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
              <div className="bg-gradient-to-r from-[#00473E] to-[#006644] p-6 text-white text-center">
                <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#E9FF15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Booking Agent</h3>
                <p className="text-white/90">Expand Our Drop-Off Network in Nairobi</p>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-6 flex-1">
                  <p className="text-gray-600 mb-6 text-center text-lg">
                    Help vendors drop off parcels efficiently. Collect, book via the app, and coordinate dispatch.
                  </p>

                  <h4 className="font-semibold text-gray-900 mb-3 text-center">Your Benefits & Income</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2"></span>
                      <span className="text-sm font-medium text-green-900">20% commission on fees</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2"></span>
                      <span className="text-sm font-medium text-green-900">Weekly M-Pesa payouts</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2"></span>
                      <span className="text-sm font-medium text-green-900">Full earnings transparency</span>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 flex flex-col items-center text-center">
                      <span className="text-2xl mb-2"></span>
                      <span className="text-sm font-medium text-green-900">Professional training provided</span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-gray-900 mb-3">Requirements summary:</h4>
                  <ul className="space-y-2 text-gray-600 text-sm pl-2 border-l-2 border-green-200">
                    <li> Must be in Nairobi CBD, Ngara, Eastleigh, or Gikomba</li>
                    <li> Min 20 sq ft of secure storage on ground floor</li>
                    <li> Working smartphone processing App</li>
                    <li> Valid business permit required</li>
                  </ul>
                </div>

                <Link 
                  to="/booking-agent"
                  className="block w-full text-center px-6 py-4 bg-[#00473E] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#00362f] transform hover:-translate-y-0.5 transition-all duration-200 mt-auto"
                >
                  View Full Details & Apply 
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#E9FF15] via-[#00473E] to-[#E9FF15]"></div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center mt-2">Why Join ParcelGrid?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center group">
                <div className="w-20 h-20 bg-green-50 group-hover:bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 shadow-sm border border-green-100">
                  <svg className="w-10 h-10 text-[#00473E] group-hover:text-[#E9FF15] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Earn Extra Income</h4>
                <p className="text-gray-600 leading-relaxed text-lg">Generate steady income through commissions with absolutely no monthly limit.</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-green-50 group-hover:bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 shadow-sm border border-green-100">
                  <svg className="w-10 h-10 text-[#00473E] group-hover:text-[#E9FF15] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Licensed & Trusted</h4>
                <p className="text-gray-600 leading-relaxed text-lg">Join a fully licensed national courier network with a proven delivery track record.</p>
              </div>

              <div className="text-center group">
                <div className="w-20 h-20 bg-green-50 group-hover:bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 shadow-sm border border-green-100">
                  <svg className="w-10 h-10 text-[#00473E] group-hover:text-[#E9FF15] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Support</h4>
                <p className="text-gray-600 leading-relaxed text-lg">Get excellent training, marketing tools, and continuous support from our team.</p>
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

fs.writeFileSync('src/pages/CareersPage.tsx', content, 'utf8');
