import React from 'react';
import { Smartphone, CreditCard, Shield, Zap, Users, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';

const InstantSettlementsPage: React.FC = () => {
  // Scroll to top when navigating to this page
  useScrollToTop();
  
  // No entrance animation: vendor benefits render immediately

  return (
    <div className="min-h-screen bg-white">
      <Header transparent={false} />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 md:pt-20 md:pb-32 overflow-hidden min-h-[60vh] sm:min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')`
          }}
        />
        
        {/* Slightly dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#E9FF15] mb-4 sm:mb-6">
              Cash Flow You Can Trust
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed px-2 sm:px-0">
              COD payments are credited to your ParcelGrid wallet instantly—secure, transparent, and designed to keep your business liquid.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-[#00473E] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#E9FF15] rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#00473E] rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Three simple steps to instant, secure settlements
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute left-1/2 top-24 bottom-24 w-0.5 bg-gradient-to-b from-[#E9FF15] via-[#00473E] to-[#E9FF15] transform -translate-x-1/2"></div>

            <div className="space-y-16 sm:space-y-24">
              {/* Step 1 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                  <div className="mb-6 sm:mb-8 lg:mb-0">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 relative">
                      <div className="absolute -top-6 left-6 sm:left-8 w-12 h-12 bg-gradient-to-r from-[#E9FF15] to-[#B8CC12] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-[#00473E] font-bold text-xl">1</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 mt-2">
                        Customer Pays COD at Pickup Point
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        At the time of collection, the customer receives an M-Pesa STK prompt for the exact amount the vendor entered.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                  <div className="order-1 lg:order-2 mb-8 lg:mb-0">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 relative">
                      <div className="absolute -top-6 right-8 w-12 h-12 bg-gradient-to-r from-[#00473E] to-[#006644] rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-[#E9FF15] font-bold text-xl">2</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 mt-2">
                        Instant Credit to Vendor Wallet
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        The COD amount, minus a 1.8% handling fee, reflects in the vendor's ParcelGrid wallet immediately after payment confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
                  <div className="mb-8 lg:mb-0">
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200 relative">
                      <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xl">3</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 mt-2">
                        Withdraw to M-Pesa Instantly
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        Vendors can transfer money from their ParcelGrid wallet to their own M-Pesa number anytime—no delays, no waiting for batch settlements.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the Fee Covers Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What the 1.8% Handling Fee Covers
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Your small fee ensures COD runs smoothly, securely, and with real-time settlements:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Customer Payment Processing
              </h3>
              <p className="text-gray-600 text-center">
                Facilitates the secure collection of money from the customer at the pickup point through M-Pesa STK push.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Fraud Prevention & Security
              </h3>
              <p className="text-gray-600 text-center">
                Covers the systems that verify payments instantly before parcels are released.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                <Smartphone className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Instant Wallet Updates
              </h3>
              <p className="text-gray-600 text-center">
                Funds are credited to your ParcelGrid wallet in real-time, ensuring accurate balances.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Seamless Vendor Payouts
              </h3>
              <p className="text-gray-600 text-center">
                Supports instant money transfer from your ParcelGrid wallet to your M-Pesa account, with no hidden costs or delays.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg md:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                Support & Compliance
              </h3>
              <p className="text-gray-600 text-center">
                Funds handling, customer payment disputes, and vendor support are all included to keep COD reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Benefits Section */}
      <section 
        className="relative py-16 sm:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-[#E9FF15] rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-[#00473E] rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-[#E9FF15] rounded-full blur-2xl"></div>
        </div>

        {/* Dotted Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="60" height="60" viewBox="0 0 60 60" className="absolute inset-0 w-full h-full">
            <defs>
              <pattern id="dots" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="2" fill="#00473E"/>
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Vendor Benefits
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Experience the power of instant settlements with complete transparency
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Benefit 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Immediate Liquidity</h3>
              <p className="text-gray-600 leading-relaxed">
                Your money reflects the moment a customer pays. No waiting periods, no delays.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <TrendingUp className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Transparent & Fair Fees</h3>
              <p className="text-gray-600 leading-relaxed">
                Only 1.8% handling fee, clearly explained. No hidden costs, no surprises.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Smartphone className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">M-Pesa Convenience</h3>
              <p className="text-gray-600 leading-relaxed">
                Direct wallet-to-M-Pesa payouts with no waiting. Access your funds anytime.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#E9FF15] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-[#00473E]" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Complete Peace of Mind</h3>
              <p className="text-gray-600 leading-relaxed">
                Every COD transaction is secure, tracked, and guaranteed.
              </p>
            </div>
          </div>
        </div>


      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DownloadCTA />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default InstantSettlementsPage;
