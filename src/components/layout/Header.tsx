import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Menu,
  X,
} from "lucide-react";

const Header: React.FC<{ transparent?: boolean }> = ({ transparent = false }) => {
  // theme removed - site uses a single appearance
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // theme toggle removed

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Pickup Points', href: '/pickup-points' },
    { name: 'FAQ', href: '/faq' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
      
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        transparent && !scrolled
          ? 'bg-transparent shadow-none'
          : scrolled
          ? 'bg-[#00473E]/95 shadow-sm'
          : 'bg-[#00473E]/95 shadow-sm'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${scrolled ? 'h-12' : 'h-20'}`}>
          {/* Logo with text */}
          <div className="flex items-center gap-3">
            <img
              src="/logo1.png"
              alt="ParcelGrid logo"
              className={`transition-all duration-300 transform hover:scale-105 ${scrolled ? 'h-8' : 'h-12'} w-auto object-contain`}
              style={{ background: 'transparent' }}
            />
            <div className="flex flex-col">
              <div className="relative">
                <span className={`font-bold text-[#E9FF15] transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`} style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>
                  ParcelGrid
                </span>
                <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#E9FF15] transition-all duration-300`}></div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-white/95 hover:text-white transition-colors duration-150"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Theme removed - no toggle */}

            

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Button
                className="bg-[#E9FF15] text-[#00473E] hover:bg-[#E9FF15]-semibold px-5 py-2 rounded-full"
              >
                Get the App
              </Button>
            </div>

            {/* Mobile Get the App CTA (visible on small screens only) */}
            <div className="flex items-center lg:hidden">
              <Button
                className="bg-[#E9FF15] text-[#00473E] px-4 py-2 rounded-full mr-2"
                onClick={() => {
                  // Open app download in new tab
                  window.open('https://play.google.com/store/apps/details?id=com.parcelgrid.logistics', '_blank')
                }}
              >
                Get the App
              </Button>
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white/95 hover:bg-white/5 transition-all duration-300 hover:scale-110 ${
                  isMenuOpen ? 'bg-[#E9FF15]/20 rotate-90' : 'hover:rotate-12'
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
                ) : (
                  <Menu className="h-6 w-6 transition-transform duration-300" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-gradient-to-b from-[#00473E] to-[#005d4f] border-t border-[#E9FF15]/30 mt-2">
            <nav className="flex flex-col space-y-4 px-4 py-6 animate-slide-down">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="font-medium transition-all duration-300 text-white hover:text-[#E9FF15] hover:translate-x-2 hover:bg-white/5 px-4 py-2 rounded-lg transform"
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isMenuOpen ? 'slideInLeft 0.4s ease-out forwards' : 'none'
                  }}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 px-4">
                {/* Removed duplicate mobile CTA - now shown in header */}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
    </>
  );
};

export default Header;