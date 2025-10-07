import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import './HeroCarousel.css';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  backgroundImage?: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    title: "DELIVERY INFRASTRUCTURE THAT POWERS YOUR GROWTH",
    subtitle: "",
    description: "From Nairobi to the furthest town, ParcelGrid helps you scale with prepaid and COD deliveries to 413+ pickup points.",
    backgroundImage: "https://plus.unsplash.com/premium_photo-1661409562732-aa3b5e6ecad1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 2,
    title: "HAPPY CUSTOMERS, REPEAT BUYERS",
    subtitle: "",
    description: "Smart notifications keep your buyers informed at every step—building trust that turns first-time buyers into loyal customers",
    backgroundImage: "https://plus.unsplash.com/premium_photo-1682144143348-012a5df41573?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    id: 3,
    title: "KENYA'S BROADEST PICKUP NETWORK",
    subtitle: "",
    description: "Beat Nairobi's high competition by selling to untapped towns. From One Branch, to the Whole Country.",
    backgroundImage: "https://plus.unsplash.com/premium_photo-1682144123371-b7bacda8bcbe?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  }
];

export const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const hasQuickStarted = useRef(false);

  // Preload images
  useEffect(() => {
    slides.forEach((slide) => {
      if (slide.backgroundImage) {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded((prev) => new Set(prev).add(slide.id));
        };
        img.onerror = () => {
          console.error(`Failed to load image for slide ${slide.id}:`, slide.backgroundImage);
        };
        img.src = slide.backgroundImage;
      }
    });
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    // Quick-start the first transition shortly after mount
    let quickStartTimeout: number | undefined;
    if (!hasQuickStarted.current) {
      quickStartTimeout = window.setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000); // immediate start after a short delay for mount
      hasQuickStarted.current = true;
    }

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => {
      if (quickStartTimeout) window.clearTimeout(quickStartTimeout);
      clearInterval(interval);
    };
  }, [isAutoPlaying]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      } else if (e.key === 'ArrowLeft') {
        setIsAutoPlaying(false);
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      } else if (e.key.toLowerCase() === ' ') {
        e.preventDefault();
        setIsAutoPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Removed click-based next/prev and dot navigation as per request

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative h-screen w-full">
      <div
        className="absolute inset-0 h-screen w-full bg-slate-900 overflow-hidden"
        onMouseLeave={() => setIsAutoPlaying(true)}
        onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
        onTouchMove={(e) => setTouchEndX(e.touches[0].clientX)}
        onTouchEnd={() => {
          if (touchStartX !== null && touchEndX !== null) {
            const delta = touchEndX - touchStartX;
            const threshold = 50; // px
            if (delta < -threshold) {
              setCurrentSlide((prev) => (prev + 1) % slides.length);
              setIsAutoPlaying(false);
            } else if (delta > threshold) {
              setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
              setIsAutoPlaying(false);
            }
          }
          setTouchStartX(null);
          setTouchEndX(null);
        }}
      >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-in-out"
          style={{
            backgroundImage: `url(${currentSlideData.backgroundImage || 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'})`,
            opacity: imagesLoaded.has(currentSlideData.id) ? 0.4 : 0.2
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Modern Geometric Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating geometric shapes */}
  <div className="absolute top-20 left-10 w-16 h-16 bg-cyan-500 rounded-full opacity-20 animate-float"></div>
  <div className="absolute top-40 right-20 w-12 h-12 bg-purple-500 rounded-lg opacity-15 animate-float delay-1000 rotate-45"></div>
  <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-emerald-500 rounded-full opacity-10 animate-float delay-2000"></div>
  <div className="absolute bottom-20 right-1/3 w-8 h-8 bg-orange-500 rounded-lg opacity-25 animate-pulse delay-500"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full">
            {Array.from({length: 48}).map((_, i) => (
              <div key={i} className="border-l border-white/10"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* Flat container (no blur/transparency) */}
        <div className="max-w-5xl mx-auto p-6 md:p-12 lg:p-16">
          <div className="text-center">
            {/* Slide number badge removed as requested */}
         
            {/* Title */}
            <h1
              key={`title-${currentSlide}`}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in"
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                letterSpacing: '-0.025em'
              }}
            >
              {currentSlideData.title}
            </h1>

            {/* Subtitle - only show if not empty */}
            {currentSlideData.subtitle && (
              <h2
                key={`subtitle-${currentSlide}`}
                className="text-lg sm:text-xl lg:text-2xl font-semibold text-cyan-300 mb-8 animate-fade-in"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.025em'
                }}
              >
                {currentSlideData.subtitle}
              </h2>
            )}

            {/* Description */}
            <p
              key={`description-${currentSlide}`}
              className={`text-lg sm:text-xl text-gray-200 font-light max-w-3xl mx-auto leading-relaxed animate-fade-in ${currentSlideData.subtitle ? 'mb-10' : 'mb-12'}`}
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                letterSpacing: '0.01em',
                lineHeight: '1.6'
              }}
            >
              {currentSlideData.description}
            </p>

            {/* CTA Button */}
            <div className="flex justify-center animate-fade-in">
              <Button
                size="lg"
                className="bg-[#E9FF15] hover:bg-[#E9FF15]/90 text-[#00473E] font-semibold px-8 py-4 text-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-xl border-0"
                style={{
                  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                  letterSpacing: '0.025em'
                }}
              >
                Download and Deliver
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation arrows and bottom indicators removed as requested */}

      {/* Top-right progress ring removed as requested */}
      </div>
    </div>
  );
};