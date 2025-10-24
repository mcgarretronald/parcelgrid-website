import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { Link } from 'react-router-dom';

const OpportunitiesPage: React.FC = () => {
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">Opportunities</h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Become part of our national network — flexible opportunities for shop owners and agents.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Join ParcelGrid® Network</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              ParcelGrid® is a licensed national courier network by Escrow Courier Networks Ltd. 
              We're expanding across Kenya and looking for passionate individuals to join our team.
            </p>
          </div>

          {/* Opportunities Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {/* Pickup Agent Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#00473E] to-[#006644] p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Pickup Agent</h3>
                <p className="text-white/90">Join Kenya's Widest Pickup Point Network</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Overview</h4>
                  <p className="text-gray-600 mb-4">
                    Turn your shop into a trusted collection point where customers pick their prepaid or COD parcels. 
                    Connect with over 400 towns and trading centers across Kenya.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✅</span>
                      <span>Earn 20% commission on every parcel handled</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✅</span>
                      <span>Increase foot traffic to your shop</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✅</span>
                      <span>Free listing on national pickup directory</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✅</span>
                      <span>Automated COD handling via app</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Physical shop open 8 AM - 7 PM</li>
                    <li>• Secure space for parcel storage</li>
                    <li>• Smartphone for ParcelGrid Agent App</li>
                    <li>• Business permit or lease agreement</li>
                  </ul>
                </div>

                <Link 
                  to="/pickup-agent"
                  className="block w-full text-center px-6 py-3 bg-[#00473E] text-white font-semibold rounded-lg shadow hover:brightness-110 transition"
                >
                  Learn More & Apply →
                </Link>
              </div>
            </div>

            {/* Booking Agent Card */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-[#00473E] to-[#006644] p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Booking Agent</h3>
                <p className="text-white/90">Expand Our Drop-Off Network in Nairobi</p>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Overview</h4>
                  <p className="text-gray-600 mb-4">
                    Help vendors and customers send parcels to over 400+ pickup points across Kenya. 
                    Collect parcels, book them on the app, and coordinate dispatch.
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Benefits</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✅</span>
                      <span>Earn 20% commission on courier fees</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✅</span>
                      <span>Weekly payouts to M-Pesa</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✅</span>
                      <span>Full transparency via Agent Wallet</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✅</span>
                      <span>Professional training & support</span>
                    </li>
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Requirements</h4>
                  <ul className="space-y-2 text-gray-600 text-sm">
                    <li>• Located in Nairobi CBD, Ngara, Eastleigh, or Gikomba</li>
                    <li>• At least 20 sq ft of secure storage space</li>
                    <li>• Ground floor operation (9 AM - 7 PM)</li>
                    <li>• Valid business permit</li>
                  </ul>
                </div>

                <Link 
                  to="/booking-agent"
                  className="block w-full text-center px-6 py-3 bg-[#00473E] text-white font-semibold rounded-lg shadow hover:brightness-110 transition"
                >
                  Learn More & Apply →
                </Link>
              </div>
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Why Join ParcelGrid?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#E9FF15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Earn Extra Income</h4>
                <p className="text-gray-600">Generate steady income through commissions with no monthly limits.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#E9FF15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Licensed & Trusted</h4>
                <p className="text-gray-600">Join a fully licensed national courier network with proven track record.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#E9FF15]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Comprehensive Support</h4>
                <p className="text-gray-600">Get training, tools, and ongoing support from our dedicated team.</p>
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
