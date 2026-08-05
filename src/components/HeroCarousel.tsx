import React, { useState, useEffect } from 'react';
import './HeroCarousel.css';
import parcelsImage from '../assets/Parcels.png';

interface HeroSlide {
  id: number;
  title: string;
  description: React.ReactNode;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    title: "DELIVERY INFRASTRUCTURE THAT POWERS YOUR GROWTH",
    description: (
      <>
        From Nairobi to the furthest town, ParcelGrid helps you scale with{" "}
        <span className="accent">prepaid and COD deliveries</span> to pickup points across major towns.
      </>
    )
  },
  {
    id: 2,
    title: "HAPPY CUSTOMERS, REPEAT BUYERS",
    description: (
      <>
        Smart notifications keep your buyers informed at every step—building trust that turns{" "}
        <span className="accent">first-time buyers into loyal customers</span>.
      </>
    )
  },
  {
    id: 3,
    title: "KENYA'S BROADEST PICKUP NETWORK",
    description: (
      <>
        Beat Nairobi's high competition by selling to{" "}
        <span className="accent">untapped towns</span>. From One Branch, to the Whole Country.
      </>
    )
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Rotate the words automatically, but keep the background fixed
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[currentSlide];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Fixed Parcels Background - does NOT change */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${parcelsImage})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Content - words on the far left, aligned toward the bottom */}
      <div className="relative z-10 h-full flex items-end">
        <div className="w-full max-w-3xl px-5 sm:px-6 lg:px-12 xl:px-16 pb-32 md:pb-20">
          {/* Rotating words - keyed by slide to re-trigger the slide-in animation */}
          <div key={slide.id} className="carousel-slide">
            {/* Title */}
            <h1
              className="gradient-text text-[1.65rem] sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-5 sm:mb-6 leading-tight"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.025em'
              }}
            >
              {slide.title}
            </h1>

            {/* Description */}
            <p
              className="hero-description text-[15px] sm:text-lg lg:text-xl font-light max-w-xl leading-relaxed mb-8 sm:mb-10"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.6'
              }}
            >
              {slide.description}
            </p>
          </div>

          {/* CTA Button - full width on mobile for an easy tap target */}
          <div className="carousel-slide">
            <a
              href="https://play.google.com/store/apps/details?id=com.escrow.escrowApp"
              className="text-[#E9FF15] bg-transparent font-semibold px-8 py-4 text-base sm:text-lg transition-all duration-300 hover:bg-[#E9FF15]/10 rounded-xl border-2 border-[#E9FF15] inline-flex items-center justify-center w-full sm:w-auto"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                letterSpacing: '0.025em'
              }}
            >
              Download and Deliver
            </a>
          </div>
        </div>

        {/* Scroll Down - Mobile */}
        <div className="md:hidden absolute bottom-8 left-0 right-0 flex flex-col items-center animate-bounce-slow pointer-events-none">
          <span className="text-[#E9FF15] text-sm mb-2 font-medium">Scroll Down</span>
          <svg
            className="w-6 h-6 text-[#E9FF15]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};