import React from 'react';
import { HeroCarousel } from '../components/HeroCarousel';
import { Package, Clock, Shield, Star, Users, TrendingUp, ChevronLeft, ChevronRight, X } from 'lucide-react';
import AnimatedCounter from '../components/AnimatedCounter';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Features Section - interactive */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00473E] mb-4">
              Why Choose ParcelGrid?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by thousands of businesses across Kenya for reliable, efficient, and affordable delivery solutions.
            </p>
          </div>
          {/* Layout toggle */}
          <div className="flex justify-center mb-8">
            {/* simple toggle mimic via URL hash or state could be used; keeping grid default for simplicity */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Package className="w-12 h-12 text-[#E9FF15]" />,
                title: "413+ Pickup Points",
                description: "Extensive network covering every corner of Kenya, from major cities to remote towns."
              },
              {
                icon: <Clock className="w-12 h-12 text-[#E9FF15]" />,
                title: "Real-time Tracking",
                description: "Keep your customers informed with live updates and delivery notifications."
              },
              {
                icon: <Shield className="w-12 h-12 text-[#E9FF15]" />,
                title: "Secure Delivery",
                description: "COD and prepaid options with guaranteed security for all your parcels."
              },
              {
                icon: <Star className="w-12 h-12 text-[#E9FF15]" />,
                title: "Customer Satisfaction",
                description: "98% satisfaction rate with our reliable delivery and customer service."
              },
              {
                icon: <Users className="w-12 h-12 text-[#E9FF15]" />,
                title: "Business Support",
                description: "Dedicated support team to help your business grow and scale effectively."
              },
              {
                icon: <TrendingUp className="w-12 h-12 text-[#E9FF15]" />,
                title: "Growth Analytics",
                description: "Detailed insights and analytics to help optimize your delivery strategy."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#00473E] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E9FF15]/20 hover:-translate-y-1 hover:rotate-0 group"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-white/80 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-[#00473E]">
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
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
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
      <section className="py-20 bg-[#00473E]">
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