import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Store, Truck, Package } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';

const PickupPointsPage: React.FC = () => {
  // Scroll to top when navigating to this page
  useScrollToTop();

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
        window.setTimeout(() => {
          window.scrollTo({ top, behavior: 'smooth' });
        }, 50);
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-white">
      <Header transparent={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background image (local) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg)' }}
        />

        {/* subtle gradient overlay to keep text readable */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 text-[#E9FF15] pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-20 md:pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Drop Off Easily. Pick Up Anywhere.
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Vendors drop off parcels at our Nairobi branches, and customers collect from 413+ pickup points nationwide.
          </p>
        </div>
      </section>

      {/* Drop-off Locations */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Where to Drop Off
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Convenient locations in Nairobi for easy parcel drop-off
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Moi Avenue Branch */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl p-6 sm:p-8 border border-gray-100 hover:border-[#E9FF15] transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-start space-x-4 sm:space-x-6">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Store className="w-7 h-7 sm:w-8 sm:h-8 text-[#E9FF15]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-2 sm:mb-3">
                    <div className="w-3 h-3 bg-[#E9FF15] rounded-full mr-2 sm:mr-3"></div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Moi Avenue Branch</h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    Iconic Business Plaza, Ground floor, Shop no: G13. Moi avenue. Between sasa mall and Sawa mall.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">📍 Nairobi CBD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Taveta Road Branch */}
            <div className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl p-8 border border-gray-100 hover:border-[#E9FF15] transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Store className="w-8 h-8 text-[#E9FF15]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-[#E9FF15] rounded-full mr-3"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Taveta Road Branch</h3>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                   Jithada Shopping Complex, Ground Floor, Shop no: F7 Taveta Road, Next to Taveta shopping Mall, Opposite Samagat Building.
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium">📍 Nairobi CBD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorial Video was moved into the 'How It Works' section */}

  {/* How It Works */}
  <section id="how-it-works" className="py-16 sm:py-20 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#00473E] rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#E9FF15] rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[#00473E] rounded-full opacity-10"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
              Simple 3-step process from drop-off to customer collection
            </p>
          </div>



          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-0.5 bg-gradient-to-r from-[#00473E] via-[#E9FF15] to-[#00473E] opacity-30"></div>

            <div className="space-y-20 md:space-y-0 md:grid md:grid-cols-3 md:gap-12">
              {/* Step 1 */}
              <div className="text-center group px-6 py-8 md:px-4 md:py-0">
                <div className="relative mb-8 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <Store className="w-10 h-10 sm:w-12 sm:h-12 text-[#E9FF15]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-[#E9FF15] text-[#00473E] rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg">
                    1
                  </div>
                </div>
                <div className="bg-[#E9FF15] text-[#00473E] text-sm sm:text-lg font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block mb-6 sm:mb-6 shadow-md">
                  Drop Off
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-4">
                  Drop Off at Our Nairobi Branches
                </h3>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                  Vendors bring parcels to Moi Avenue or Taveta Road drop-off locations with our easy-to-use system.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center group px-6 py-8 md:px-4 md:py-0">
                <div className="relative mb-8 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <Truck className="w-10 h-10 sm:w-12 sm:h-12 text-[#E9FF15]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-[#E9FF15] text-[#00473E] rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg">
                    2
                  </div>
                </div>
                <div className="bg-[#E9FF15] text-[#00473E] text-sm sm:text-lg font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block mb-6 sm:mb-6 shadow-md">
                  Transport
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-4">
                  We Route & Notify
                </h3>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                  ParcelGrid transports the parcel to the customer's nearest pickup point and sends real-time notifications.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center group px-6 py-8 md:px-4 md:py-0">
                <div className="relative mb-8 sm:mb-8">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <Package className="w-10 h-10 sm:w-12 sm:h-12 text-[#E9FF15]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 sm:w-8 sm:h-8 bg-[#E9FF15] text-[#00473E] rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shadow-lg">
                    3
                  </div>
                </div>
                <div className="bg-[#E9FF15] text-[#00473E] text-sm sm:text-lg font-bold px-4 sm:px-6 py-2 sm:py-3 rounded-full inline-block mb-6 sm:mb-6 shadow-md">
                  Collect
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-4">
                  Customer Collects
                </h3>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                  Customers collect their parcels at their convenience from our nationwide network of pickup agents.
                </p>
              </div>
            </div>

            {/* Video Section - Separate from grid */}
            <div className="mt-16 flex justify-center">
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg mx-auto max-w-4xl bg-black">
                <video
                  controls
                  poster="/parcelgrid logo-04.png"
                  className="w-full h-full object-contain bg-black"
                >
                  <source src="/tutorialvideo.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <DownloadCTA />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PickupPointsPage;
