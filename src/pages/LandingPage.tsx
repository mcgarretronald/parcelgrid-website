import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import { FeaturesCarousel } from '../components/FeaturesCarousel';
import Footer from '../components/Footer';
import { Star, ChevronLeft, ChevronRight, Wallet, Bell, MapPin } from 'lucide-react';
import GoogleMap, { useAgentData, MapSearch, AgentLocationsList } from '../components/Map/GoogleMap';
import type { MapControls } from '../components/Map/GoogleMap';

// Map section with external controls
function MapWithControls() {
  const { points } = useAgentData('https://app.escrowcourier.com/user-services/api/agents');
  const mapControlsRef = React.useRef<MapControls | null>(null);

  const handleSelectPoint = (point: any) => {
    if (mapControlsRef.current) {
      mapControlsRef.current.panToPoint(point);
    }
  };

  return (
    <section className="min-h-screen bg-white flex items-center py-16 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-center mb-8 md:mb-8">
          <div className="text-center w-full max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Pickup Points Across Kenya</h2>
            <p className="text-lg text-gray-600 mb-6">Explore our pickup network. Click a marker to see details and contact info.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="w-full h-[70vh] rounded-2xl overflow-hidden">
              <GoogleMap points={points} onMapReady={(controls) => { mapControlsRef.current = controls }} />
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col h-[70vh] gap-6">
            <MapSearch points={points} onSelect={handleSelectPoint} />
            <div className="flex-1 overflow-hidden">
              <AgentLocationsList points={points} onSelect={handleSelectPoint} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const handleCardTouch = (cardId: string) => {
    setActiveCard(activeCard === cardId ? null : cardId);
  };

  const handleCardClick = (route: string, cardId: string) => {
    // On mobile, first touch activates hover effect, second touch navigates
    if (window.innerWidth < 768) {
      if (activeCard === cardId) {
        navigate(route);
      } else {
        handleCardTouch(cardId);
      }
    } else {
      navigate(route);
    }
  };

  return (
    <div className="min-h-screen w-full">
      <HeroCarousel />

      <section className="min-h-screen bg-white flex items-center pt-20 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-4 items-center py-8 md:py-0">
            <div className="flex justify-center md:justify-start">
              <div className="w-full h-full">
                <div className="space-y-6 text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00473E]">BUILT FOR ONLINE VENDORS LIKE YOU.</h3>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-700">Expand beyond Nairobi with Kenya’s broadest delivery infrastructure.</p>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-700">Deliver to 413+ towns and growing, from Nairobi to remote counties.</p>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-700">Cash on Delivery (COD) with instant wallet payouts for vendors.</p>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-700">Prepaid & COD options that build customer trust and drive repeat sales.</p>
                  <p className="text-lg sm:text-xl md:text-2xl text-gray-700">Easy-to-use app with a clean, straightforward design.</p>
                </div>
                <div className="mt-6 flex justify-center md:justify-start">
                  <a href="/download" className="inline-block px-6 py-3 bg-[#e9ff15] text-[#00473E] rounded-lg  transition-colors duration-200 font-semibold">Download App</a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:col-start-2 mt-8 md:mt-0">
              <div className="w-full max-w-sm md:w-80 lg:w-[920px] xl:w-[1200px] md:flex md:items-center md:justify-end md:pr-8">
                <div className="overflow-visible rounded-xl shadow-none group">
                  <img src="/phone.jpeg" alt="Phone screenshot" className="w-full max-h-[60vh] md:max-h-[80vh] h-auto object-contain transform transition-transform duration-500 ease-out group-hover:scale-110 md:origin-right" style={{ willChange: 'transform' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <FeaturesCarousel />
      </section>

      <section className="min-h-screen bg-[#00473E] flex items-center justify-center py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-12 md:mb-24">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">Core Features</h3>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">Key capabilities built for online vendors. Tap any card to learn more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
            <div 
              className={`w-full max-w-sm h-64 mx-auto my-2 md:my-4 cursor-pointer group ${activeCard === 'pickup' ? 'mobile-active' : ''}`} 
              style={{ perspective: '1000px' }} 
              onClick={() => handleCardClick('/pickup-points', 'pickup')}
              onTouchStart={() => window.innerWidth < 768 && handleCardTouch('pickup')}
            >
              <div className="relative w-full h-48 transition-all duration-500">
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-transform duration-700 bg-[#E9FF15] transform translate-y-0 group-hover:-translate-y-1/2 ${activeCard === 'pickup' ? '-translate-y-1/2' : ''}`}>
                  <MapPin className="w-20 h-20 text-[#00473E] mb-4" />
                  <h3 className="text-lg font-bold text-[#00473E] text-center">Drop-Off & Pickup Points</h3>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center p-5 box-border transition-transform duration-800 shadow-2xl bg-white transform translate-y-0 group-hover:translate-y-1/2 ${activeCard === 'pickup' ? 'translate-y-1/2' : ''}`}>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Learn More</h3>
                    <p className="text-gray-600">Discover our pickup points network</p>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#E9FF15]"></div>
                </div>
              </div>
            </div>

            <div 
              className={`w-full max-w-sm h-64 mx-auto my-2 md:my-4 cursor-pointer group ${activeCard === 'prepaid' ? 'mobile-active' : ''}`} 
              style={{ perspective: '1000px' }} 
              onClick={() => handleCardClick('/prepaid-cod', 'prepaid')}
              onTouchStart={() => window.innerWidth < 768 && handleCardTouch('prepaid')}
            >
              <div className="relative w-full h-48 transition-all duration-500">
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-transform duration-700 bg-[#E9FF15] transform translate-y-0 group-hover:-translate-y-1/2 ${activeCard === 'prepaid' ? '-translate-y-1/2' : ''}`}>
                  <div className="w-20 h-20 flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-[#00473E]">KES</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#00473E] text-center">Prepaid & COD Deliveries</h3>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center p-5 box-border transition-transform duration-800 shadow-2xl bg-white transform translate-y-0 group-hover:translate-y-1/2 ${activeCard === 'prepaid' ? 'translate-y-1/2' : ''}`}>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Learn More</h3>
                    <p className="text-gray-600">Explore payment options</p>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#E9FF15]"></div>
                </div>
              </div>
            </div>

            <div 
              className={`w-full max-w-sm h-64 mx-auto my-2 md:my-4 cursor-pointer group ${activeCard === 'settlements' ? 'mobile-active' : ''}`} 
              style={{ perspective: '1000px' }} 
              onClick={() => handleCardClick('/instant-settlements', 'settlements')}
              onTouchStart={() => window.innerWidth < 768 && handleCardTouch('settlements')}
            >
              <div className="relative w-full h-48 transition-all duration-500">
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-transform duration-700 bg-[#E9FF15] transform translate-y-0 group-hover:-translate-y-1/2 ${activeCard === 'settlements' ? '-translate-y-1/2' : ''}`}>
                  <Wallet className="w-20 h-20 text-[#00473E] mb-4" />
                  <h3 className="text-lg font-bold text-[#00473E] text-center">Instant Settlements</h3>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center p-5 box-border transition-transform duration-800 shadow-2xl bg-white transform translate-y-0 group-hover:translate-y-1/2 ${activeCard === 'settlements' ? 'translate-y-1/2' : ''}`}>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Learn More</h3>
                    <p className="text-gray-600">Instant settlement details</p>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#E9FF15]"></div>
                </div>
              </div>
            </div>

            <div 
              className={`w-full max-w-sm h-64 mx-auto my-2 md:my-4 cursor-pointer group ${activeCard === 'notifications' ? 'mobile-active' : ''}`} 
              style={{ perspective: '1000px' }} 
              onClick={() => handleCardClick('/notifications', 'notifications')}
              onTouchStart={() => window.innerWidth < 768 && handleCardTouch('notifications')}
            >
              <div className="relative w-full h-48 transition-all duration-500">
                <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 transition-transform duration-700 bg-[#E9FF15] transform translate-y-0 group-hover:-translate-y-1/2 ${activeCard === 'notifications' ? '-translate-y-1/2' : ''}`}>
                  <Bell className="w-20 h-20 text-[#00473E] mb-4" />
                  <h3 className="text-lg font-bold text-[#00473E] text-center">Smart Notifications</h3>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center p-5 box-border transition-transform duration-800 shadow-2xl bg-white transform translate-y-0 group-hover:translate-y-1/2 ${activeCard === 'notifications' ? 'translate-y-1/2' : ''}`}>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">Learn More</h3>
                    <p className="text-gray-600">Smart notification features</p>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#E9FF15]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MapWithControls />

      <section className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center py-16 md:py-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">Real stories from businesses that have transformed their delivery operations with ParcelGrid.</p>
          </div>

          {(() => {
            const testimonials = [
              {
                quote: "ParcelGrid helped us expand from Nairobi to 15 counties in just 6 months. Their pickup network is incredible!",
                author: "Sarah Mwangi",
                company: "Fashionista Boutique",
                rating: 5,
              },
              {
                quote: "The real-time notifications keep our customers happy and informed. Our repeat purchase rate increased by 40%.",
                author: "John Kimani",
                company: "TechHub Electronics",
                rating: 5,
              },
              {
                quote: "COD delivery made it possible for us to serve customers who don't have mobile money. Game changer!",
                author: "Grace Wanjiku",
                company: "Mama's Kitchen",
                rating: 5,
              },
            ];
            const [idx, setIdx] = React.useState(0);
            React.useEffect(() => {
              const t = setInterval(() => setIdx((p) => (p + 1) % testimonials.length), 6000);
              return () => clearInterval(t);
            }, []);
            return (
              <div className="relative">
                <div className="overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-transform duration-500" style={{ transform: `translateX(-${(idx % 3) * 0}%)` }}>
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                        <div className="flex mb-4">{[...Array(testimonial.rating)].map((_, i) => (<Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />))}</div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                          <div className="text-gray-500 dark:text-gray-400">{testimonial.company}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button aria-label="Prev testimonial" className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => setIdx((p) => (p - 1 + testimonials.length) % testimonials.length)}>
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button aria-label="Next testimonial" className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600" onClick={() => setIdx((p) => (p + 1) % testimonials.length)}>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            );
          })()}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;