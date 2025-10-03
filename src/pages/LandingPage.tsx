import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { FeaturesCarousel } from '../components/FeaturesCarousel';
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import GoogleMap, { useAgentData, MapSearch, AgentLocationsList } from '../components/Map/GoogleMap';
import type { MapControls } from '../components/Map/GoogleMap';

// Map section with external controls
function MapWithControls() {
  const { points } = useAgentData('/api/agents')
  const mapControlsRef = React.useRef<MapControls | null>(null)

  const handleSelectPoint = (point: any) => {
    if (mapControlsRef.current) {
      mapControlsRef.current.panToPoint(point)
    }
  }

  return (
    <section className="min-h-screen bg-white flex items-center py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex justify-center mb-8">
          <div className="text-center w-full max-w-3xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Pickup Points Across Kenya
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Explore our pickup network. Click a marker to see details and contact info.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map - takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="w-full h-[70vh] rounded-2xl overflow-hidden">
              <GoogleMap 
                points={points} 
                onMapReady={(controls) => {
                  mapControlsRef.current = controls
                }}
              />
            </div>
          </div>

          {/* Sidebar with search and list - same height as map */}
          <div className="lg:col-span-1 flex flex-col h-[70vh] gap-6">
            <MapSearch points={points} onSelect={handleSelectPoint} />
            <div className="flex-1 overflow-hidden">
              <AgentLocationsList points={points} onSelect={handleSelectPoint} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Features Section - interactive */}
  <section className="min-h-screen bg-white flex items-center">
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-0">
            {/* Left: large feature text (center on small, left on md+) */}
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
                  <a
                    href="/download"
                    className="inline-block px-6 py-3 bg-[#E9FF15] text-[#00473E] rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-semibold"
                  >
                    Download App
                  </a>
                </div>
              </div>
            </div>

            {/* Right column: show phone image on md+ screens - anchored to far right */}
            <div className="hidden md:flex items-center md:col-start-2">
              <div className="w-80 md:w-[920px] lg:w-[1200px] xl:w-[1280px] flex items-center justify-end pr-8">
                {/* outer container allows overflow so scaled image isn't clipped */}
                <div className="overflow-visible rounded-xl shadow-none group">
                  <img
                    src="/phone.jpeg"
                    alt="Phone screenshot"
                    className="w-full max-h-[80vh] h-auto object-contain transform transition-transform duration-500 ease-out group-hover:scale-110 origin-right"
                    style={{ willChange: 'transform' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Carousel Section */}
      <section className="bg-gray-50">
        <FeaturesCarousel />
      </section>

      {/* Map Section - replace stats with a Kenya map showing pickup points */}
      <MapWithControls />

      {/* Testimonials Section - interactive carousel */}
        <section className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real stories from businesses that have transformed their delivery operations with ParcelGrid.
            </p>
          </div>
          {/* Simple carousel without extra deps */}
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
                  <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-transform duration-500"
                    style={{ transform: `translateX(-${(idx % 3) * 0}%)` }}
                  >
                    {testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                        <div className="flex mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</div>
                          <div className="text-gray-500 dark:text-gray-400">{testimonial.company}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Controls */}
                <button
                  aria-label="Prev testimonial"
                  className="absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => setIdx((p) => (p - 1 + testimonials.length) % testimonials.length)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  aria-label="Next testimonial"
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                  onClick={() => setIdx((p) => (p + 1) % testimonials.length)}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            );
          })()}
        </div>
      </section>

      {/* CTA Section with modal interactions */}
        <section className="h-screen bg-[#00473E] flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Scale Your Business?
          </h2>
          <p className="text-xl text-white/80 mb-10 leading-relaxed">
            Join thousands of businesses using ParcelGrid to deliver across Kenya. 
            Start your journey from one branch to the whole country today.
          </p>
          {(() => {
            const [open, setOpen] = React.useState<null | 'trial' | 'demo'>(null);
            return (
              <>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="px-8 py-4 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg text-lg"
                    onClick={() => setOpen('trial')}
                  >
                    Start Free Trial
                  </button>
                  <button
                    className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-emerald-700 transition-colors duration-300 text-lg"
                    onClick={() => setOpen('demo')}
                  >
                    Schedule Demo
                  </button>
                </div>

                {open && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
                      <button className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100" onClick={() => setOpen(null)} aria-label="Close">
                        <X className="w-5 h-5" />
                      </button>
                      <h3 className="text-2xl font-bold mb-2 text-gray-900">
                        {open === 'trial' ? 'Start Free Trial' : 'Schedule Demo'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {open === 'trial'
                          ? 'Enter your details and we will get you started right away.'
                          : 'Tell us a bit about your business and we will schedule a personalized demo.'}
                      </p>
                      <form className="space-y-4">
                        <input className="w-full border rounded-lg p-3" placeholder="Full name" />
                        <input className="w-full border rounded-lg p-3" placeholder="Email address" type="email" />
                        <input className="w-full border rounded-lg p-3" placeholder="Company" />
                        {open === 'demo' && <input className="w-full border rounded-lg p-3" placeholder="Preferred date/time" />}
                        <button type="button" className="w-full py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;