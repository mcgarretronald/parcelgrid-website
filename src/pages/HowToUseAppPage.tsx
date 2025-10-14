import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/Footer';
import DownloadCTA from '../components/DownloadCTA';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { 
  Download, 
  Package, 
  MapPin, 
  Camera, 
  Search, 
  CreditCard, 
  BarChart3, 
  HelpCircle,
  DollarSign
} from 'lucide-react';

const HowToUseAppPage: React.FC = () => {
  useScrollToTop();

  const steps = [
    {
      id: 1,
      title: "Download and Log In",
      icon: Download,
      color: "from-blue-500 to-blue-600",
      items: [
        "Download ParcelGrid from Google Play Store or App Store",
        "Sign up using your business phone number",
        "Allow location access for accurate pickup and delivery mapping",
        "Complete your business profile to access the app dashboard"
      ]
    },
    {
      id: 2,
      title: "Create a New Booking",
      icon: Package,
      color: "from-green-500 to-green-600",
      items: [
        "Tap 'Send Parcel' on your home screen",
        "Enter receiver's name and phone number",
        "Add destination town, parcel description and weight",
        "Choose between Prepaid Delivery or Cash on Delivery (COD)"
      ]
    },
    {
      id: 3,
      title: "Select Drop-off Point",
      icon: MapPin,
      color: "from-purple-500 to-purple-600",
      items: [
        "Choose your preferred drop-off location in Nairobi",
        "Iconic Business Plaza, Moi Avenue",
        "Jitihada Shopping Complex, Taveta Road",
        "Drop off your parcel at the selected point after confirming"
      ]
    },
    {
      id: 4,
      title: "Attach Parcel Photos",
      icon: Camera,
      color: "from-orange-500 to-orange-600",
      items: [
        "Take a clear live photo of the parcel before submission",
        "Upload photo and tap Submit Booking",
        "Receive Parcel ID and tracking code instantly",
        "Share receipt with customer via WhatsApp"
      ]
    },
    {
      id: 5,
      title: "Track Your Parcel",
      icon: Search,
      color: "from-indigo-500 to-indigo-600",
      items: [
        "Go to 'My Parcels' to monitor live updates",
        "Received → In Transit → Ready for Pickup → Delivered",
        "COD parcels: Payment Pending → Paid → Settled",
        "Receive notifications at every stage"
      ]
    },
    {
      id: 6,
      title: "Cash on Delivery (COD)",
      icon: DollarSign,
      color: "from-yellow-500 to-yellow-600",
      items: [
        "Customer receives automatic M-Pesa payment prompt on collection",
        "Status changes to COD Paid after payment",
        "Your amount (minus 1.8% fee) credited to ParcelGrid Wallet",
        "Withdraw directly to your M-Pesa anytime"
      ]
    },
    {
      id: 7,
      title: "Prepaid Parcels",
      icon: CreditCard,
      color: "from-teal-500 to-teal-600",
      items: [
        "Customer simply picks up parcel - no payment required",
        "Customer shows release code sent to their phone",
        "Track collection status in real time",
        "No additional steps needed for prepaid deliveries"
      ]
    },
    {
      id: 8,
      title: "Wallet and Reports",
      icon: BarChart3,
      color: "from-pink-500 to-pink-600",
      items: [
        "Tap Wallet to view COD settlements and referral bonuses",
        "Weekly summaries available in PDF format",
        "Real-time earnings tracking",
        "Instant M-Pesa withdrawals"
      ]
    },
    {
      id: 9,
      title: "Support and Help",
      icon: HelpCircle,
      color: "from-red-500 to-red-600",
      items: [
        "Tap Help/Support from app menu for questions",
        "Chat directly with our support team",
        "24/7 assistance for delivery delays",
        "Comprehensive FAQ section available"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Header transparent={false} />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[48vh] sm:min-h-[56vh] lg:min-h-[64vh]">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=2070)',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
          }}
        />

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-[#E9FF15] pt-20 pb-12 sm:pt-24 sm:pb-16 md:pt-28 md:pb-20 lg:pt-32 lg:pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            How to Use the ParcelGrid App
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 sm:px-0">
            Complete guide for vendors to master ParcelGrid — from booking to delivery tracking
          </p>
        </div>
      </section>


      {/* Main Content */}
      <section id="steps-section" className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Master ParcelGrid in 9 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From downloading the app to managing your earnings - everything you need to know
            </p>
          </div>

          {/* Video Tutorial Section */}
          <div className="mb-16">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#00473E] to-[#006644] px-8 py-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Video Tutorial</h3>
                    <p className="text-green-200">Watch how to use ParcelGrid step by step</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
                  <iframe
                    src="https://drive.google.com/file/d/1-L50wpyK2mI9Gxe6q23CWUGkFx_4L2OS/preview?t=29"
                    className="w-full h-full"
                    allowFullScreen
                    title="ParcelGrid App Tutorial"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-gray-600 text-sm">
                    💡 <strong>Tip:</strong> The video starts at the key demonstration point (0:29). Watch the complete walkthrough to master all ParcelGrid features.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Steps Grid */}
          <div className="grid gap-8 md:gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-[#00473E] to-gray-300 z-0"></div>
                )}

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden relative z-10">
                  <div className="md:flex">
                    
                    {/* Left side - Step Info */}
                    <div className="md:w-1/3 bg-gradient-to-br from-[#00473E] to-[#006644] p-8 text-white">
                      <div className="flex items-start gap-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                          <step.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-green-200 mb-1">Step {step.id}</div>
                          <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                          <div className="w-12 h-1 bg-[#E9FF15] rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Step Details */}
                    <div className="md:w-2/3 p-8">
                      <div className="space-y-4">
                        {step.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="group flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-[#00473E] flex items-center justify-center flex-shrink-0 transition-colors duration-200">
                              <span className="text-sm font-semibold text-gray-600 group-hover:text-white transition-colors duration-200">
                                {itemIndex + 1}
                              </span>
                            </div>
                            <div className="flex-1 pt-1">
                              <p className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200 leading-relaxed">
                                {item}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <DownloadCTA />
      <Footer />
    </div>
  );
};

export default HowToUseAppPage;