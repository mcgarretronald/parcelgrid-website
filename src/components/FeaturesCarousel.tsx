import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FeatureSlide {
  id: number;
  title: string;
  description: string;
  visual: 'kenya-map' | 'license' | 'wallet' | 'growth-chart' | 'vendor-shop' | 'notifications';
}

const slides: FeatureSlide[] = [
  {
    id: 1,
    title: "Pickup Points across Kenya and expanding weekly",
    description: "Our network spans the entire country with new locations added every week",
    visual: 'kenya-map'
  },
  {
    id: 2,
    title: "Licensed by the Communications Authority of Kenya (CA)",
    description: "Officially registered and regulated courier service",
    visual: 'license'
  },
  {
    id: 3,
    title: "Instant 100% COD Settlement Guarantee",
    description: "Direct payments to vendor wallets with immediate withdrawal",
    visual: 'wallet'
  },
  {
    id: 4,
    title: "The real growth is outside Nairobi, expand now and multiply your sales 4X",
    description: "Tap into untapped markets across Kenya",
    visual: 'growth-chart'
  },
  {
    id: 5,
    title: "Delivery Infrastructure Built for Online Vendors",
    description: "Everything you need to sell and deliver nationwide",
    visual: 'vendor-shop'
  },
  {
    id: 6,
    title: "Instant Notifications for both vendors and customers",
    description: "Real-time updates at every step of the delivery journey",
    visual: 'notifications'
  }
];

// Visual components for each slide
const KenyaMapVisual = () => (
  <img
    src="/map.png"
    alt="ParcelGrid coverage map showing pickup points and delivery routes across Kenya"
    width="600"
    height="400"
    className="w-full h-[400px] rounded-2xl object-contain block mx-auto transition-transform duration-300 ease-out transform hover:scale-105"
  />
)

const LicenseVisual = () => (
  <img
    src="/Certificate.jpeg"
    alt="Official courier licensing certificate from the Communications Authority of Kenya (CA) for Escrow Courier Services"
    width="600"
    height="400"
    className="w-full h-[400px] rounded-2xl object-contain block mx-auto transition-transform duration-300 ease-out transform hover:scale-105"
  />
)

const WalletVisual = () => (
    <img
      src="/withdrawal.png"
      alt="ParcelGrid vendor digital wallet interface displaying instant COD payment withdrawals"
      width="600"
      height="400"
      className="w-full h-[400px] object-contain transition-transform duration-300 ease-out transform hover:scale-105"
    />
)

const GrowthChartVisual = () => (
    <img
      src="/Realgrowth.jpeg"
      alt="Infographic showing business sales growth of online vendors using ParcelGrid courier service in Kenya"
      width="600"
      height="400"
      className="w-full h-[400px] object-contain transition-transform duration-300 ease-out transform hover:scale-105"
    />
)

const VendorShopVisual = () => (
    <img
      src="/Onlinevendor.jpeg"
      alt="An online business owner in Kenya managing order shipments using the ParcelGrid app"
      width="600"
      height="400"
      className="w-full h-[400px] object-contain transition-transform duration-300 ease-out transform hover:scale-105"
    />
)

const NotificationsVisual = () => (
  <img
    src="/Notification.png"
    alt="Smart notifications showing delivery tracking updates on a mobile phone"
    width="600"
    height="400"
    className="w-full h-[400px] rounded-2xl object-contain block mx-auto transition-transform duration-300 ease-out transform hover:scale-105"
  />
);

const getVisualComponent = (visual: FeatureSlide['visual']) => {
  switch (visual) {
    case 'kenya-map':
      return <KenyaMapVisual />;
    case 'license':
      return <LicenseVisual />;
    case 'wallet':
      return <WalletVisual />;
    case 'growth-chart':
      return <GrowthChartVisual />;
    case 'vendor-shop':
      return <VendorShopVisual />;
    case 'notifications':
      return <NotificationsVisual />;
    default:
      return null;
  }
};

export const FeaturesCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const resumeTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = window.setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isAutoPlaying]);

  const scheduleAutoResume = () => {
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current)
    // resume after 8s of inactivity
    resumeTimeoutRef.current = window.setTimeout(() => setIsAutoPlaying(true), 8000)
  }

  const manualPauseForInteraction = () => {
    setIsAutoPlaying(false)
    scheduleAutoResume()
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    manualPauseForInteraction()
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    manualPauseForInteraction()
  };

  const currentSlideData = slides[currentSlide];

  return (
    <div
      className="relative w-full py-16 md:py-20"
      style={{ backgroundColor: '#FAFBF8' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Text Content - Left Side */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: '#00473E' }}>
              {currentSlideData.title}
            </h2>
            <p className="text-lg mb-8" style={{ color: '#00473E', opacity: 0.85 }}>
              {currentSlideData.description}
            </p>
          </div>

          {/* Visual - Right Side */}
          <div className="flex-1 w-full max-w-lg h-[400px] flex items-center justify-center">
            {getVisualComponent(currentSlideData.visual)}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goToPrev}
            className="p-3 rounded-full bg-[#E9FF15] text-[#00473E] hover:brightness-90 transition-colors shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* autoplay control intentionally removed - autoplay runs and pauses on interaction */}

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  manualPauseForInteraction()
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-[#E9FF15] w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="p-3 rounded-full bg-[#E9FF15] text-[#00473E] hover:brightness-90 transition-colors shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
