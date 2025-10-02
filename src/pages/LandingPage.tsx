import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { Star, ChevronLeft, ChevronRight, X } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

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

            {/* Right column: show phone image on md+ screens */}
            <div className="hidden md:flex items-center">
              <div className="w-80 md:w-[720px] lg:w-[920px] xl:w-[960px] flex items-center justify-start">
                <img src="/phone.jpeg" alt="Phone screenshot" className="w-full max-h-[80vh] h-auto object-contain shadow-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
        <section className="h-screen bg-[#00473E] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Powering Delivery Across Kenya
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join thousands of businesses that trust ParcelGrid for their delivery needs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(
              [
                { number: 413, suffix: '+', label: 'Pickup Points' },
                { number: 50_000, suffix: '+', label: 'Happy Customers' },
                { number: 1_000_000, suffix: '+', label: 'Packages Delivered' },
                { number: 47, suffix: '', label: 'Counties Covered' },
              ] as const
            ).map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                  <AnimatedCounter to={stat.number} formatter={(n) => n.toLocaleString() + stat.suffix} />
                </div>
                <div className="text-lg text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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