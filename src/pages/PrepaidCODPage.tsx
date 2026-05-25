import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Smartphone, CreditCard, Truck, MessageSquare, UserCheck, Wallet, Key, Clock, CheckCircle } from 'lucide-react';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';

const PrepaidCODPage: React.FC = () => {
  // Scroll to top when navigating to this page
  useScrollToTop();
  const [, setIsVisible] = useState(false);
  const benefitsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.3, // Trigger when 30% of the section is visible
        rootMargin: '-50px 0px', // Start animation 50px before the section comes into view
      }
    );

    if (benefitsRef.current) {
      observer.observe(benefitsRef.current);
    }

    return () => {
      if (benefitsRef.current) {
        observer.unobserve(benefitsRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>COD & Prepaid Courier Services in Kenya | ParcelGrid</title>
        <meta name="title" content="COD & Prepaid Courier Services in Kenya | ParcelGrid" />
        <meta name="description" content="Choose between flexible Cash on Delivery (COD) and prepaid shipping. Build buyer trust with secure nation-wide deliveries and instant seller settlements." />
        <meta name="keywords" content="cash on delivery Kenya, COD courier service, prepaid shipping, parcel delivery shop, secure online vendor, e-commerce delivery" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Flexible COD & Prepaid Courier Services" />
        <meta property="og:description" content="Choose between flexible Cash on Delivery (COD) and prepaid shipping. Build buyer trust with secure nation-wide deliveries." />
        <link rel="canonical" href={typeof window !== 'undefined' ? `${window.location.origin}/prepaid-cod` : ''} />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-20 pb-20 sm:pt-24 sm:pb-20 md:pt-20 md:pb-32 overflow-hidden min-h-[70vh] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1655720360377-b97f6715e1ae?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
          }}
        />
        
        {/* Slightly dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#E9FF15] mb-6">
              COD and Prepaid Courier Service for Online Sellers
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 leading-relaxed">
              Vendors choose how each parcel will be paid—either prepaid upfront or Cash on Delivery (COD) at the pickup point. 
              ParcelGrid ensures smooth handling for both.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps for both prepaid and COD deliveries
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center text-[#00473E] font-bold text-xl mr-4">
                    1
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Vendor Books the Parcel
                  </h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  In the ParcelGrid app, the vendor selects either Prepaid or Cash on Delivery (COD) for the shipment.
                </p>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl flex items-center justify-center">
                  <Smartphone className="w-16 h-16 text-[#E9FF15]" />
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center text-[#00473E] font-bold text-xl mr-4">
                    2
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    For COD Parcels
                  </h3>
                </div>
                <div className="space-y-4">
                  <p className="text-lg text-gray-600 leading-relaxed">
                    The app prompts the vendor to enter the exact amount to be collected from the customer.
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    This amount is linked to the order in the system.
                  </p>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl flex items-center justify-center">
                  <CreditCard className="w-16 h-16 text-[#E9FF15]" />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center text-[#00473E] font-bold text-xl mr-4">
                    3
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    We Route & Notify
                  </h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  ParcelGrid transports the parcel to the customer's nearest pickup point and sends them an SMS/app notification with collection details.
                </p>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl flex items-center justify-center relative">
                  <Truck className="w-12 h-12 text-[#E9FF15]" />
                  <MessageSquare className="w-8 h-8 text-[#E9FF15] absolute -top-2 -right-2" />
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center text-[#00473E] font-bold text-xl mr-4">
                    4
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Customer Pays & Collects
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">Prepaid:</p>
                    <p className="text-gray-600">The customer shows their release code and collects instantly.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">COD:</p>
                    <p className="text-gray-600">The pickup agent triggers an M-Pesa STK prompt for the customer to pay the amount specified by the vendor. Once payment is successful, the parcel is released.</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-16 h-16 text-[#E9FF15]" />
                </div>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-[#E9FF15] rounded-full flex items-center justify-center text-[#00473E] font-bold text-xl mr-4">
                    5
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Instant Settlement to Vendor
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">Prepaid:</p>
                    <p className="text-gray-600">Vendor's funds remain secured and visible in their account.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <p className="font-semibold text-gray-900 mb-2">COD:</p>
                    <p className="text-gray-600">The payment reflects instantly in the vendor's ParcelGrid wallet, minus the handling fee. Vendors can withdraw anytime.</p>
                  </div>
                </div>
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#00473E] to-[#006644] rounded-2xl flex items-center justify-center">
                  <Wallet className="w-16 h-16 text-[#E9FF15]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vendor Benefits Section */}
      <section 
        ref={benefitsRef}
        className="relative py-16 overflow-hidden"
      >
        {/* Background Image with Fixed Attachment */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/6694570/pexels-photo-6694570.jpeg')`
          }}
        />
        
        {/* Slightly dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>
        
        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-200 mb-4">
              Vendor Benefits
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Key className="w-8 h-8 text-[#E9FF15]" />
              </div>
              <p className="text-lg font-semibold text-[#00473E]">
                You control how your customers pay—prepaid or COD.
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-[#E9FF15]" />
              </div>
              <p className="text-lg font-semibold text-[#00473E]">
                No manual chasing of payments—system links each order with its COD amount.
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-8 text-center shadow-lg">
              <div className="w-16 h-16 bg-[#00473E] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-[#E9FF15]" />
              </div>
              <p className="text-lg font-semibold text-[#00473E]">
                Instant settlements—your money is available immediately after delivery.
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

export default PrepaidCODPage;
