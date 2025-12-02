import React, { useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import { FeaturesCarousel } from '../components/FeaturesCarousel';
import Footer from '../components/Footer';
import { Wallet, Bell, MapPin } from 'lucide-react';
import GoogleMap, { useAgentData, MapSearch, AgentLocationsList } from '../components/Map/GoogleMap';
import type { MapControls } from '../components/Map/GoogleMap';

// Map section with external controls
function MapWithControls() {
  const { points } = useAgentData();
  const mapControlsRef = React.useRef<MapControls | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectPoint = (point: any) => {
    if (mapControlsRef.current) {
      mapControlsRef.current.panToPoint(point);
    }
  };

  return (
    <section id="pickup-points" className="min-h-screen bg-white flex items-center py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="text-center w-full max-w-3xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4">Pickup Points Across Kenya</h2>
            <p className="text-base md:text-lg text-gray-600 mb-4 md:mb-6">Explore our pickup network. Click a marker to see details and contact info.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
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

        {/* Delivery Network */}
        <div className="mt-16">
          <div className="text-center mb-8 md:mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">Our Delivery Network</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {/* Mombasa Route */}
            <div className="bg-[#00473E] rounded-2xl p-6 hover:bg-[#006644] transition-all duration-300 shadow-xl hover:shadow-2xl">
              <h4 className="text-lg font-bold text-[#E9FF15] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Mombasa Route
              </h4>
              <ul className="space-y-2 text-white text-sm">
                <li>Mlolongo</li>
                <li>Athi River</li>
                <li>Kyumvi</li>
                <li>Salama</li>
                <li>Sultan Hamud</li>
                <li>Emali</li>
                <li>Kibwezi</li>
                <li>Voi</li>
                <li>Mariakani</li>
                <li>Mazeras</li>
                <li>Miritini</li>
                <li>Changawe</li>
                <li className="font-bold text-[#E9FF15] text-base">Mombasa Town</li>
              </ul>
            </div>

            {/* Nakuru Route */}
            <div className="bg-[#00473E] rounded-2xl p-6 hover:bg-[#006644] transition-all duration-300 shadow-xl hover:shadow-2xl">
              <h4 className="text-lg font-bold text-[#E9FF15] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Nakuru Route
              </h4>
              <ul className="space-y-2 text-white text-sm">
                <li>Limuru</li>
                <li>Kimende</li>
                <li>Mai Mahiu</li>
                <li>Naivasha</li>
                <li>Gilgil</li>
                <li>Kikopey</li>
                <li>Lanet</li>
                <li className="font-bold text-[#E9FF15] text-base">Nakuru Town</li>
              </ul>
            </div>

            {/* Eldoret Route */}
            <div className="bg-[#00473E] rounded-2xl p-6 hover:bg-[#006644] transition-all duration-300 shadow-xl hover:shadow-2xl">
              <h4 className="text-lg font-bold text-[#E9FF15] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Eldoret Route
              </h4>
              <ul className="space-y-2 text-white text-sm">
                <li>Nakuru</li>
                <li>Salagaa</li>
                <li>Mau Summit</li>
                <li>Molo</li>
                <li>Timboroa</li>
                <li>Burnt Forest</li>
                <li className="font-bold text-[#E9FF15] text-base">Eldoret Town</li>
              </ul>
            </div>

            {/* Kisumu Route */}
            <div className="bg-[#00473E] rounded-2xl p-6 hover:bg-[#006644] transition-all duration-300 shadow-xl hover:shadow-2xl">
              <h4 className="text-lg font-bold text-[#E9FF15] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Kisumu Route
              </h4>
              <ul className="space-y-2 text-white text-sm">
                <li>Nakuru</li>
                <li>Londiani</li>
                <li>Chepseon</li>
                <li>Kericho</li>
                <li>Kapsoit</li>
                <li>Awasi</li>
                <li>Ahero</li>
                <li className="font-bold text-[#E9FF15] text-base">Kisumu Town</li>
              </ul>
            </div>

            {/* Meru Route */}
            <div className="bg-[#00473E] rounded-2xl p-6 hover:bg-[#006644] transition-all duration-300 shadow-xl hover:shadow-2xl">
              <h4 className="text-lg font-bold text-[#E9FF15] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Meru Route
              </h4>
              <ul className="space-y-2 text-white text-sm">
                <li>Thika</li>
                <li>Kabati</li>
                <li>Kenol</li>
                <li>Makuyu</li>
                <li>Makutano Junction</li>
                <li>Mwea Town</li>
                <li>Embu</li>
                <li>Runyenjes</li>
                <li>Chuka</li>
                <li>Chogoria</li>
                <li>Nkubu</li>
                <li className="font-bold text-[#E9FF15] text-base">Meru Town</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const storiesContainerRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  // Auto-play/pause video based on visibility
  useEffect(() => {
    const videoSection = videoSectionRef.current;
    const iframe = document.getElementById('landing-video-iframe') as HTMLIFrameElement;
    
    if (!videoSection || !iframe) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video section is visible - play video with muted audio
            try {
              iframe.contentWindow?.postMessage(
                '{"event":"command","func":"playVideo","args":""}',
                '*'
              );
              iframe.contentWindow?.postMessage(
                '{"event":"command","func":"mute","args":""}',
                '*'
              );
            } catch (error) {
              console.log('Could not control video playback:', error);
            }
          } else {
            // Video section is out of view - pause video
            try {
              iframe.contentWindow?.postMessage(
                '{"event":"command","func":"pauseVideo","args":""}',
                '*'
              );
            } catch (error) {
              console.log('Could not pause video:', error);
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
      }
    );

    observer.observe(videoSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Scroll to hash targets (e.g. /#pickup-points) with offset for the fixed header
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        // header is fixed; compute its height to offset the scroll
        const header = document.querySelector('header');
        const headerHeight = header ? header.getBoundingClientRect().height : 0;
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
        // small timeout to ensure layout is ready
        window.setTimeout(() => {
          window.scrollTo({ top, behavior: 'smooth' });
        }, 50);
      }
    }
  }, [location]);

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  const handleMouseEnter = () => {
    // No-op for desktop hover
  };

  const scrollLeft = () => {
    if (storiesContainerRef.current) {
      storiesContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (storiesContainerRef.current) {
      storiesContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen w-full">
      <HeroCarousel />

      <section className="min-h-screen bg-white flex items-center py-4 md:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 items-center py-2 md:py-0">
            <div className="flex justify-center md:justify-start">
              <div className="w-full h-full">
                <div className="space-y-3 md:space-y-6 text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#00473E]">BUILT FOR ONLINE VENDORS LIKE YOU.</h3>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">Expand beyond Nairobi with Kenya's broadest delivery infrastructure.</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">Deliver to all major towns and growing, from Nairobi to remote counties.</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">Cash on Delivery (COD) with instant wallet payouts for vendors.</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">Prepaid & COD options that build customer trust and drive repeat sales.</p>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700">Easy-to-use app with a clean, straightforward design.</p>
                </div>
                <div className="mt-3 md:mt-6 flex justify-center md:justify-start">
                  <a href="https://play.google.com/store/apps/details?id=com.escrow.escrowApp" className="inline-block px-6 py-3 bg-[#e9ff15] text-[#00473E] rounded-lg  transition-colors duration-200 font-semibold">Download App</a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center md:col-start-2 mt-3 md:mt-0">
              <div className="w-full max-w-sm md:w-80 lg:w-[920px] xl:w-[1200px] md:flex md:items-center md:justify-end md:pr-8">
                <div className="overflow-visible rounded-xl shadow-none group">
                  <img src="/phone.png" alt="Phone screenshot" className="w-full max-h-[50vh] md:max-h-[80vh] h-auto object-contain transform transition-transform duration-500 ease-out group-hover:scale-110 md:origin-right" style={{ willChange: 'transform' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Video Section */}
      <section ref={videoSectionRef} className="py-6 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-3 md:mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-1.5 md:mb-2">Who We Are & What We Do</h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">Watch this short video to learn more about ParcelGrid and how we help online sellers scale across Kenya.</p>
          </div>

          <div className="w-full mt-3 md:mt-6 flex justify-center">
            <div className="w-full max-w-4xl aspect-video rounded-lg overflow-hidden shadow-lg">
              {/* Google Drive preview embed - use the file id in the preview URL */}
              <iframe
                id="landing-video-iframe"
                title="ParcelGrid Overview Video"
                src="https://drive.google.com/file/d/1gmlf_I9Ij9cLuJzMuUVuh0Y9WHG1Jyka/preview"
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <FeaturesCarousel />
      </section>

      <section className="bg-[#00473E] py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 md:mb-6">Core Features</h3>
            <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto">Key capabilities built for online vendors. Tap any card to learn more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {/* Pickup Points Card */}
            <div className="w-full max-w-sm mx-auto cursor-pointer group">
              {/* Mobile Design - Simple Card Layout */}
              <div className="md:hidden bg-[#E9FF15] rounded-lg shadow-lg p-4">
                <div className="text-center mb-3">
                  <MapPin className="w-12 h-12 text-[#00473E] mx-auto mb-2" />
                  <h3 className="text-base font-bold text-[#00473E]">Drop-Off & Pickup Points</h3>
                </div>
                <button 
                  onClick={() => navigate('/pickup-points')}
                  className="w-full bg-white text-[#00473E] py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </button>
              </div>
              
              {/* Desktop Design - Keep Original Animation */}
              <div 
                className="hidden md:block"
                style={{ perspective: '1000px' }} 
                onClick={() => handleCardClick('/pickup-points')}
                onMouseEnter={handleMouseEnter}
              >
                <div className="relative w-full h-48 transition-all duration-500 rounded-lg shadow-lg" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-700 bg-[#E9FF15] rounded-lg shadow-lg transform translate-y-0 group-hover:-translate-y-20 group-hover:shadow-2xl">
                    <MapPin className="w-20 h-20 text-[#00473E] mb-4" />
                    <h3 className="text-lg font-bold text-[#00473E] text-center">Drop-Off & Pickup Points</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-5 box-border transition-all duration-700 bg-white rounded-lg shadow-lg transform translate-y-0 group-hover:translate-y-20 group-hover:shadow-2xl">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">Learn More</h3>
                      <p className="text-gray-600">Discover our pickup points network</p>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#E9FF15]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prepaid & COD Card */}
            <div className="w-full max-w-sm mx-auto cursor-pointer group">
              {/* Mobile Design - Simple Card Layout */}
              <div className="md:hidden bg-[#E9FF15] rounded-lg shadow-lg p-4">
                <div className="text-center mb-3">
                  <div className="w-12 h-12 flex items-center justify-center mx-auto mb-2">
                    <span className="text-3xl font-bold text-[#00473E]">KES</span>
                  </div>
                  <h3 className="text-base font-bold text-[#00473E]">Prepaid & COD Deliveries</h3>
                </div>
                <button 
                  onClick={() => navigate('/prepaid-cod')}
                  className="w-full bg-white text-[#00473E] py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </button>
              </div>
              
              {/* Desktop Design - Keep Original Animation */}
              <div 
                className="hidden md:block"
                style={{ perspective: '1000px' }} 
                onClick={() => handleCardClick('/prepaid-cod')}
                onMouseEnter={handleMouseEnter}
              >
                <div className="relative w-full h-48 transition-all duration-500 rounded-lg shadow-lg" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-700 bg-[#E9FF15] rounded-lg shadow-lg transform translate-y-0 group-hover:-translate-y-20 group-hover:shadow-2xl">
                    <div className="w-20 h-20 flex items-center justify-center mb-4">
                      <span className="text-5xl font-bold text-[#00473E]">KES</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#00473E] text-center">Prepaid & COD Deliveries</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-5 box-border transition-all duration-700 bg-white rounded-lg shadow-lg transform translate-y-0 group-hover:translate-y-20 group-hover:shadow-2xl">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">Learn More</h3>
                      <p className="text-gray-600">Explore payment options</p>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#E9FF15]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instant Settlements Card */}
            <div className="w-full max-w-sm mx-auto cursor-pointer group">
              {/* Mobile Design - Simple Card Layout */}
              <div className="md:hidden bg-[#E9FF15] rounded-lg shadow-lg p-4">
                <div className="text-center mb-3">
                  <Wallet className="w-12 h-12 text-[#00473E] mx-auto mb-2" />
                  <h3 className="text-base font-bold text-[#00473E]">Instant Settlements</h3>
                </div>
                <button 
                  onClick={() => navigate('/instant-settlements')}
                  className="w-full bg-white text-[#00473E] py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </button>
              </div>
              
              {/* Desktop Design - Keep Original Animation */}
              <div 
                className="hidden md:block"
                style={{ perspective: '1000px' }} 
                onClick={() => handleCardClick('/instant-settlements')}
                onMouseEnter={handleMouseEnter}
              >
                <div className="relative w-full h-48 transition-all duration-500 rounded-lg shadow-lg" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-700 bg-[#E9FF15] rounded-lg shadow-lg transform translate-y-0 group-hover:-translate-y-20 group-hover:shadow-2xl">
                    <Wallet className="w-20 h-20 text-[#00473E] mb-4" />
                    <h3 className="text-lg font-bold text-[#00473E] text-center">Instant Settlements</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-5 box-border transition-all duration-700 bg-white rounded-lg shadow-lg transform translate-y-0 group-hover:translate-y-20 group-hover:shadow-2xl">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-700 mb-2">Learn More</h3>
                      <p className="text-gray-600">Instant settlement details</p>
                    </div>
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#E9FF15]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Notifications Card */}
            <div className="w-full max-w-sm mx-auto cursor-pointer group">
              {/* Mobile Design - Simple Card Layout */}
              <div className="md:hidden bg-[#E9FF15] rounded-lg shadow-lg p-4">
                <div className="text-center mb-3">
                  <Bell className="w-12 h-12 text-[#00473E] mx-auto mb-2" />
                  <h3 className="text-base font-bold text-[#00473E]">Smart Notifications</h3>
                </div>
                <button 
                  onClick={() => navigate('/notifications')}
                  className="w-full bg-white text-[#00473E] py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Learn More
                </button>
              </div>
              
              {/* Desktop Design - Keep Original Animation */}
              <div 
                className="hidden md:block"
                style={{ perspective: '1000px' }} 
                onClick={() => handleCardClick('/notifications')}
                onMouseEnter={handleMouseEnter}
              >
                <div className="relative w-full h-48 transition-all duration-500 rounded-lg shadow-lg" style={{ transformStyle: 'preserve-3d' }}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 transition-all duration-700 bg-[#E9FF15] rounded-lg shadow-lg transform translate-y-0 group-hover:-translate-y-20 group-hover:shadow-2xl">
                    <Bell className="w-20 h-20 text-[#00473E] mb-4" />
                    <h3 className="text-lg font-bold text-[#00473E] text-center">Smart Notifications</h3>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center p-5 box-border transition-all duration-700 bg-white rounded-lg shadow-lg transform translate-y-0 group-hover:translate-y-20 group-hover:shadow-2xl">
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
        </div>
      </section>

      <MapWithControls />

      {/* Real Stories Section */}
      <section className="min-h-screen bg-gray-50 flex items-center py-12 md:py-16 lg:py-20 overflow-hidden">
        <div className="w-full">
          <div className="text-center mb-8 md:mb-12 lg:mb-16 px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 md:mb-4">What Our Online Sellers Say</h2>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">Real stories from businesses that have transformed their delivery operations with ParcelGrid.</p>
          </div>

          {/* Custom CSS for scrollable carousel */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .stories-container {
                position: relative;
              }
              
              .stories-scroll {
                scroll-behavior: smooth;
                scrollbar-width: none;
                -ms-overflow-style: none;
              }
              
              .stories-scroll::-webkit-scrollbar {
                display: none;
              }
              
              .arrow-button {
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
              }
              
              .arrow-button:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 25px rgba(0, 71, 62, 0.3);
              }
              
              .arrow-button:disabled {
                opacity: 0.3;
                cursor: not-allowed;
                transform: scale(1);
              }
              
              /* Mobile touch scrolling */
              @media (max-width: 768px) {
                .stories-scroll {
                  -webkit-overflow-scrolling: touch;
                }
              }
            `
          }} />

          {/* Stories Carousel Container */}
          <div className="relative stories-container">
            {/* Desktop Arrow Navigation */}
            <div className="hidden md:block">
              <button 
                className="arrow-button absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200"
                onClick={scrollLeft}
                aria-label="Previous stories"
              >
                <svg className="w-6 h-6 text-[#00473E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="arrow-button absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg border border-gray-200"
                onClick={scrollRight}
                aria-label="Next stories"
              >
                <svg className="w-6 h-6 text-[#00473E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Scrollable Cards Container */}
            <div 
              ref={storiesContainerRef}
              className="stories-scroll flex gap-3 md:gap-6 px-4 md:px-16 overflow-x-auto pb-4">
                {/* Story 1 */}
                <div className="story-card bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 w-72 md:w-80 flex-shrink-0">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">Sarah Kimani</h3>
                      <p className="text-sm md:text-base text-gray-600">Fashion & Accessories</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 italic mb-3 md:mb-4">"Before ParcelGrid, I could only sell to customers in Nairobi. Now I reach over 400+ towns across Kenya. My monthly sales have tripled, and the instant COD settlements mean I never worry about cash flow anymore."</p>
                  <div className="flex items-center">
                    <span className="text-sm md:text-base text-gray-600 ml-2">Nairobi to Nationwide</span>
                  </div>
                </div>

                {/* Story 2 */}
                <div className="story-card bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 w-72 md:w-80 flex-shrink-0">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">James Mwangi</h3>
                      <p className="text-sm md:text-base text-gray-600">Electronics & Gadgets</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 italic mb-3 md:mb-4">"The pickup points are everywhere! My customers love collecting their orders at convenient locations near them. The app is so easy to use, and I get paid instantly when customers collect their COD orders."</p>
                  <div className="flex items-center">
                    <span className="text-sm md:text-base text-gray-600 ml-2">Electronics Vendor</span>
                  </div>
                </div>

                {/* Story 3 */}
                <div className="story-card bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 w-72 md:w-80 flex-shrink-0">
                  <div className="flex items-center mb-3 md:mb-4">
                    <div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900">Grace Wanjiku</h3>
                      <p className="text-sm md:text-base text-gray-600">Beauty & Cosmetics</p>
                    </div>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 italic mb-3 md:mb-4">"ParcelGrid changed my business completely. I went from selling only to friends and family to having customers in Mombasa, Kisumu, Eldoret, and so many other towns. The growth has been incredible!"</p>
                  <div className="flex items-center">
                    <span className="text-sm md:text-base text-gray-600 ml-2">Beauty Products</span>
                  </div>
                </div>

                {/* Story 4 */}
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 w-72 md:w-80 flex-shrink-0">
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Peter Ochieng</h3>
                      <p className="text-gray-600">Home & Kitchen</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"What I love most is the instant settlements. When my customers pay COD, the money hits my wallet immediately. No waiting weeks for payments like other platforms. ParcelGrid keeps my business moving fast."</p>
                  <div className="flex items-center">
                    <span className="text-gray-600 ml-2">Home Products</span>
                  </div>
                </div>

                {/* Story 5 */}
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 w-72 md:w-80 flex-shrink-0">
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Mary Akinyi</h3>
                      <p className="text-gray-600">Books & Stationery</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"The notifications keep me and my customers informed every step of the way. From drop-off to pickup, we always know what's happening. This builds so much trust with my customers."</p>
                  <div className="flex items-center">
                    <span className="text-gray-600 ml-2">Educational Materials</span>
                  </div>
                </div>

                {/* Story 6 */}
                <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow duration-300 w-72 md:w-80 flex-shrink-0">
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">David Njenga</h3>
                      <p className="text-gray-600">Sports & Fitness</p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic mb-4">"I've tried other courier services, but ParcelGrid is different. They actually understand online vendors. The 1.8% COD fee is fair, and the coverage is unmatched. My business has never been stronger."</p>
                  <div className="flex items-center">
                    <span className="text-gray-600 ml-2">Sports Equipment</span>
                  </div>
                </div>
            </div>

            {/* Mobile scroll indicator */}
            <div className="md:hidden text-center mt-6 text-sm text-gray-500">
              ← Swipe to see more stories →
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;

