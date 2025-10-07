import React from 'react';
import { Package, Truck, Bell, Wallet, Check, MapPin, Zap } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';

const SmartNotificationsPage: React.FC = () => {
  // Scroll to top when navigating to this page
  useScrollToTop();

  // Animations removed: page will render statically without entrance animations

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20 md:pt-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1683117927786-f146451082fb?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        />
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#E9FF15] mb-6">
            Always In the Loop.
          </h1>
          
          <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            ParcelGrid keeps both vendors and customers informed with real-time SMS and app alerts at every delivery stage.
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00473E] mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay informed at every step with our comprehensive notification system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Step 1 */}
            <div className="step-card">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="relative">
                    <Package className="w-8 h-8 text-[#00473E]" />
                    <Check className="w-4 h-4 text-[#00473E] absolute -top-1 -right-1 bg-[#E9FF15] rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-[#00473E] text-white text-sm font-bold px-3 py-1 rounded-full">01</span>
                </div>
                <h3 className="text-xl font-bold text-[#00473E] mb-4">
                  Parcel Drop-Off Confirmed
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Vendors get an instant notification when their parcel is registered at a ParcelGrid drop-off point.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="relative">
                    <Truck className="w-8 h-8 text-[#00473E]" />
                    <MapPin className="w-4 h-4 text-[#00473E] absolute -top-1 -right-1 bg-[#E9FF15] rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-[#00473E] text-white text-sm font-bold px-3 py-1 rounded-full">02</span>
                </div>
                <h3 className="text-xl font-bold text-[#00473E] mb-4">
                  Parcel Routed & Arrived
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Customers receive an SMS/app alert the moment their parcel reaches the pickup point.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-8 h-8 text-[#00473E]" />
                </div>
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-[#00473E] text-white text-sm font-bold px-3 py-1 rounded-full">03</span>
                </div>
                <h3 className="text-xl font-bold text-[#00473E] mb-4">
                  Ready for Collection
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Customers get a reminder that their parcel is ready for pickup, including collection hours and the agent's contact.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="step-card">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 text-center h-full">
                <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="relative">
                    <Wallet className="w-8 h-8 text-[#00473E]" />
                    <Check className="w-4 h-4 text-[#00473E] absolute -top-1 -right-1 bg-[#E9FF15] rounded-full" />
                  </div>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <span className="bg-[#00473E] text-white text-sm font-bold px-3 py-1 rounded-full">04</span>
                </div>
                <h3 className="text-xl font-bold text-[#00473E] mb-4">
                  Parcel Collected & Payment Made
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Vendors receive an alert once the customer has picked up the parcel. If it's COD, the notification also confirms the payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Benefits Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#00473E] to-[#005d4f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Vendor Benefits
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Smart notifications that work for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Benefit 1 */}
            <div className="benefit-card">
              <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-2xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#E9FF15] rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#00473E]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Less customer chasing
                    </h3>
                    <p className="text-gray-200 leading-relaxed">
                      No "Where is my parcel?" calls. Customers stay informed automatically.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="benefit-card">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#E9FF15] rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#00473E]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Full visibility
                    </h3>
                    <p className="text-gray-200 leading-relaxed">
                      Vendors track every milestone until delivery is complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="benefit-card">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#E9FF15] rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#00473E]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Customer confidence
                    </h3>
                    <p className="text-gray-200 leading-relaxed">
                      Buyers trust sellers who provide transparent updates.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="benefit-card">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#E9FF15] rounded-lg flex items-center justify-center">
                      <Zap className="w-6 h-6 text-[#00473E]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      Stronger relationships
                    </h3>
                    <p className="text-gray-200 leading-relaxed">
                      Better communication builds repeat business.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download CTA Section */}
      <DownloadCTA />

      <Footer />

  {/* No animation styles - page is static */}
    </div>
  );
};

export default SmartNotificationsPage;
