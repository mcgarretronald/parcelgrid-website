import React from 'react';
import './HeroCarousel.css';
import truckImage from '../assets/Truck.png';

export const HeroCarousel: React.FC = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Single Road Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1506521781262-d4582ff2b0e0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      {/* Modern Geometric Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-cyan-500 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-purple-500 rounded-lg opacity-15 animate-float delay-1000 rotate-45"></div>
        <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-emerald-500 rounded-full opacity-10 animate-float delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-orange-500 rounded-lg opacity-25 animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full flex flex-col lg:flex-row lg:items-center">
          {/* Truck Image - flush to left edge */}
          <div className="lg:w-1/2 flex justify-start animate-fade-in">
            <div className="w-full sm:w-4/5 md:w-3/4 lg:w-full max-w-2xl 2xl:max-w-4xl">
              <img
                src={truckImage}
                alt="ParcelGrid delivery truck"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-1/2 px-4 sm:px-6 lg:px-8 xl:px-12 mt-6 lg:mt-0 text-center lg:text-left">
            {/* Title */}
            <div
              role="heading"
              aria-level={2}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.025em'
              }}
            >
              DELIVERY INFRASTRUCTURE THAT POWERS YOUR GROWTH
            </div>

            {/* Description */}
            <p
              className="text-base sm:text-lg lg:text-xl text-gray-200 font-light max-w-xl leading-relaxed mb-8 animate-fade-in"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.6'
              }}
            >
              From Nairobi to the furthest town, ParcelGrid helps you scale with prepaid and COD deliveries to pickup points across major towns.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start animate-fade-in">
              <a
                href="https://play.google.com/store/apps/details?id=com.escrow.escrowApp"
                className="bg-[#E9FF15] hover:bg-[#E9FF15]/90 text-[#00473E] font-semibold px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl border-0"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.025em'
                }}
              >
                Download and Deliver
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Down - Mobile */}
        <div className="md:hidden absolute bottom-10 left-0 right-0 flex flex-col items-center animate-bounce-slow">
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