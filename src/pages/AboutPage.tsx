import React, { useEffect } from 'react';
import { MapPin, Zap, Shield, DollarSign, Globe, Smartphone } from 'lucide-react';

const AboutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative text-white py-20 md:py-32 overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1624137527136-66e631bdaa0e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687)' }}
        ></div>
         <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#E9FF15]">Building Kenya's Most Reliable Parcel Delivery Infrastructure</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Empowering e-commerce vendors across Kenya with simple, secure, and trusted delivery solutions
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        
        {/* Who We Are */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <div className="inline-block mb-4 px-4 py-2 bg-[#00473E]/10 rounded-full">
              <span className="text-[#00473E] font-semibold">Who We Are</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#00473E] mb-6">
              Licensed & Trusted Nationwide
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              <strong className="text-[#00473E]">ParcelGrid®</strong> is a registered trademark of <strong className="text-[#00473E]">Escrow Courier Networks Limited</strong>, a licensed national courier company regulated by the Communications Authority of Kenya (CA).
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We are building Kenya's most reliable parcel delivery infrastructure, designed for e-commerce vendors, online businesses, and their customers.
            </p>
          </div>
          <div className="bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl p-8 text-white shadow-xl">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-[#E9FF15] rounded-lg p-3 mr-4">
                  <Shield className="w-6 h-6 text-[#00473E]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Licensed by CA</h3>
                  <p className="text-white/80">Fully regulated national courier company</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#E9FF15] rounded-lg p-3 mr-4">
                  <MapPin className="w-6 h-6 text-[#00473E]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">413+ Pickup Points</h3>
                  <p className="text-white/80">Nationwide coverage across Kenya</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-[#E9FF15] rounded-lg p-3 mr-4">
                  <Zap className="w-6 h-6 text-[#00473E]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Instant Settlements</h3>
                  <p className="text-white/80">Real-time payments to M-Pesa</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission & Vision */}
        <section className="bg-gradient-to-br from-gray-50 to-white py-16 -mx-6 px-6 md:-mx-0 md:px-0 md:py-0 md:bg-none">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#00473E] to-[#006644] text-white rounded-2xl p-8 shadow-xl">
              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-[#E9FF15]/20 rounded-full mb-4">
                  <span className="text-[#E9FF15] font-semibold">Our Mission</span>
                </div>
              </div>
              <p className="text-xl leading-relaxed">
                To power the growth of online vendors in Kenya by providing a delivery system that is <strong className="text-[#E9FF15]">simple</strong>, <strong className="text-[#E9FF15]">secure</strong>, and <strong className="text-[#E9FF15]">built on trust</strong>.
              </p>
            </div>
            <div className="bg-[#E9FF15] text-[#00473E] rounded-2xl p-8 shadow-xl">
              <div className="mb-6">
                <div className="inline-block px-4 py-2 bg-[#00473E]/10 rounded-full mb-4">
                  <span className="font-semibold">Our Vision</span>
                </div>
              </div>
              <p className="text-xl leading-relaxed">
                To become Kenya's leading e-commerce logistics infrastructure, empowering <strong>30,000+ vendors</strong> to sell confidently across every county.
              </p>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-[#00473E]/10 rounded-full">
              <span className="text-[#00473E] font-semibold">What We Do</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#00473E] mb-4">Complete Delivery Solutions</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Everything you need to ship, track, and get paid for your e-commerce business</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-[#E9FF15] transition-all hover:shadow-xl group">
              <div className="bg-[#00473E] rounded-lg p-3 w-fit mb-4 group-hover:bg-[#E9FF15] transition-colors">
                <MapPin className="w-6 h-6 text-[#E9FF15] group-hover:text-[#00473E]" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">413+ Pickup Points</h3>
              <p className="text-gray-600">Customers collect parcels conveniently through our growing network across Kenya.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-[#E9FF15] transition-all hover:shadow-xl group">
              <div className="bg-[#00473E] rounded-lg p-3 w-fit mb-4 group-hover:bg-[#E9FF15] transition-colors">
                <MapPin className="w-6 h-6 text-[#E9FF15] group-hover:text-[#00473E]" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Nairobi Drop-Off Branches</h3>
              <ul className="text-gray-600 space-y-1">
                <li>• Moi Avenue (Iconic Business Plaza)</li>
                <li>• Taveta Road (Jitihada Complex)</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-[#E9FF15] transition-all hover:shadow-xl group">
              <div className="bg-[#00473E] rounded-lg p-3 w-fit mb-4 group-hover:bg-[#E9FF15] transition-colors">
                <DollarSign className="w-6 h-6 text-[#E9FF15] group-hover:text-[#00473E]" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Prepaid & COD</h3>
              <p className="text-gray-600">Flexible payment options giving customers choice and vendors security.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-[#E9FF15] transition-all hover:shadow-xl group">
              <div className="bg-[#00473E] rounded-lg p-3 w-fit mb-4 group-hover:bg-[#E9FF15] transition-colors">
                <Zap className="w-6 h-6 text-[#E9FF15] group-hover:text-[#00473E]" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Instant Settlements</h3>
              <p className="text-gray-600">COD payments reflect immediately and withdraw instantly to M-Pesa.</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-100 hover:border-[#E9FF15] transition-all hover:shadow-xl group">
              <div className="bg-[#00473E] rounded-lg p-3 w-fit mb-4 group-hover:bg-[#E9FF15] transition-colors">
                <Smartphone className="w-6 h-6 text-[#E9FF15] group-hover:text-[#00473E]" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-2">Smart Notifications</h3>
              <p className="text-gray-600">Real-time alerts at every stage of the delivery journey.</p>
            </div>

            <div className="bg-gradient-to-br from-[#00473E] to-[#006644] rounded-xl shadow-lg p-6 text-white flex flex-col justify-center items-center text-center">
              <h3 className="font-bold text-2xl mb-2">And Much More!</h3>
              <p className="text-white/90">Track every parcel, automate every payment, control every delivery</p>
            </div>
          </div>
        </section>

        {/* Why Vendors Choose Us */}
        <section className="bg-gray-50 py-16 -mx-6 px-6 rounded-3xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-4 px-4 py-2 bg-[#E9FF15] rounded-full">
              <span className="text-[#00473E] font-semibold">Why Choose ParcelGrid</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#00473E] mb-4">Built for Vendor Success</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Join thousands of vendors who trust ParcelGrid with their deliveries</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-[#E9FF15] rounded-lg p-2 mr-3">
                  <Shield className="w-5 h-5 text-[#00473E]" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Licensed & Trusted</h3>
              </div>
              <p className="text-gray-600">Registered under Escrow Courier Networks Limited and licensed by CA.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-[#E9FF15] rounded-lg p-2 mr-3">
                  <Zap className="w-5 h-5 text-[#00473E]" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Reliable Cash Flow</h3>
              </div>
              <p className="text-gray-600">1.8% COD handling fee with secure collection and instant wallet payouts.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-[#E9FF15] rounded-lg p-2 mr-3">
                  <DollarSign className="w-5 h-5 text-[#00473E]" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Affordable & Transparent</h3>
              </div>
              <p className="text-gray-600">Simple pricing with no hidden costs or surprises.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-[#E9FF15] rounded-lg p-2 mr-3">
                  <Globe className="w-5 h-5 text-[#00473E]" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Nationwide Reach</h3>
              </div>
              <p className="text-gray-600">Sell across Kenya without opening new branches.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-[#E9FF15] rounded-lg p-2 mr-3">
                  <Smartphone className="w-5 h-5 text-[#00473E]" />
                </div>
                <h3 className="font-bold text-lg text-gray-900">Tech-Enabled</h3>
              </div>
              <p className="text-gray-600">Every parcel tracked, every payment automated, complete control.</p>
            </div>

            <div className="bg-gradient-to-br from-[#E9FF15] to-[#d4e614] rounded-xl p-6 flex flex-col justify-center">
              <h3 className="font-bold text-2xl text-[#00473E] mb-2">30,000+</h3>
              <p className="text-[#00473E]/80 font-medium">Vendors empowered across Kenya</p>
            </div>
          </div>
        </section>
        {/* Join Us */}
        <section className="relative overflow-hidden">
          <div className="relative bg-gradient-to-br from-[#00473E] via-[#006644] to-[#00473E] rounded-3xl p-8 md:p-16 text-center">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E9FF15] rounded-full opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#E9FF15] rounded-full opacity-10 blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="inline-block mb-4 px-4 py-2 bg-[#E9FF15] rounded-full">
                <span className="text-[#00473E] font-semibold">Get Started</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to Scale Up your Business?</h2>
              <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto">
                Whether you're running a thrift store, boutique, online shop, or selling on Instagram, TikTok, or WhatsApp — ParcelGrid makes deliveries and cash collection seamless.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="https://play.google.com/store/apps/details?id=com.escrow.escrowApp" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-[#E9FF15] text-[#00473E] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#d4e614] transition-all transform hover:scale-105 shadow-lg"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Download the App
                </a>
                <a 
                  href="/pickup-points"
                  className="inline-flex items-center bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                >
                  Find Pickup Points
                </a>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20">
                <div>
                  <div className="text-3xl font-bold text-[#E9FF15] mb-1">413+</div>
                  <div className="text-white/80 text-sm">Pickup Points</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#E9FF15] mb-1">30K+</div>
                  <div className="text-white/80 text-sm">Active Vendors</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#E9FF15] mb-1">24/7</div>
                  <div className="text-white/80 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>      </div>
    </div>
  );
};

export default AboutPage;
