import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import {
  Menu,
  X,
} from "lucide-react";
import { APP_STORE_URL } from '../../lib/storeLinks';

interface SidebarItem {
  name: string;
  href: string;
  hasDropdown?: boolean;
  subItems?: { name: string; href: string }[];
}

const Header: React.FC<{ transparent?: boolean }> = ({ transparent = false }) => {
  // theme removed - site uses a single appearance
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [opportunitiesOpen, setOpportunitiesOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // theme toggle removed


  // Original main navigation items
  const mainNavItems = [
    { name: 'Home', href: '/' },
    { name: 'FAQ', href: '/faq' },
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact Us', href: '/contact' },
  ];

  // New items to be moved to sidebar
  const sidebarItems: SidebarItem[] = [
    { name: 'How to Use the App', href: '/how-to-use-app' },
    { 
      name: 'Opportunities', 
      href: '/opportunities',
      hasDropdown: true,
      subItems: [
        { name: 'Apply to Become a Pickup Agent', href: '/pickup-agent' },
        { name: 'Apply to Become a Booking Agent', href: '/booking-agent' },
      ]
    },
    { name: 'Our Pickup Points List', href: '/#pickup-points' },
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
      
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        transparent && !scrolled
          ? 'bg-transparent shadow-none'
          : 'bg-[#00473E] shadow-lg'
      }`}>
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-3 sm:gap-4 w-full transition-all duration-500 ease-out ${
          scrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo with text */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:opacity-80 transition-all duration-500 ease-out flex-shrink-0">
            <img
              src="/logo1.png"
              alt="ParcelGrid Courier Service Logo"
              width="48"
              height="48"
              className={`object-contain transition-all duration-500 ease-out ${
                scrolled ? 'h-8 w-8' : 'h-10 sm:h-12 w-10 sm:w-12'
              }`}
            />
            <span 
              className={`font-bold text-[#E9FF15] transition-all duration-500 ease-out ${
                scrolled ? 'text-base sm:text-lg' : 'text-xl sm:text-2xl'
              }`} 
              style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}
            >
              ParcelGrid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-8 flex-1 justify-center">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-sm font-medium text-white/90 hover:text-[#E9FF15] transition-colors duration-200 whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Book a Parcel Button - part of main nav */}
            <Button
              className="bg-[#E9FF15] text-[#00473E] hover:bg-[#d4e614] font-semibold px-6 py-2.5 rounded-full transition-all duration-200 hover:scale-105 ml-4"
              onClick={() => navigate('/book-parcel')}
            >
              Book a Parcel
            </Button>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-auto">
            {/* Desktop Sidebar Toggle */}
            <div className="hidden xl:block">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 hover:text-[#E9FF15] transition-all duration-200"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>            {/* Mobile/Tablet menu and CTA */}
            <div className="flex items-center gap-2 sm:gap-3 xl:hidden">
              {/* Mobile CTA - visible on small to large screens */}
              <Button
                className="bg-[#E9FF15] text-[#00473E] hover:bg-[#d4e614] font-semibold px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-2.5 rounded-full text-xs sm:text-sm transition-all duration-200 whitespace-nowrap"
                onClick={() => navigate('/book-parcel')}
              >
                Book a Parcel
              </Button>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className={`text-white hover:bg-white/10 transition-all duration-200 flex-shrink-0 ${
                  isMenuOpen ? 'bg-[#E9FF15]/20' : ''
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-[#00473E] border-t border-[#E9FF15]/20">
            <nav className="px-4 py-4">
              <div className="space-y-1">
                {/* Main navigation items for mobile */}
                {mainNavItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-3 text-sm font-medium text-white/90 hover:text-[#E9FF15] hover:bg-white/5 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Sidebar items for mobile with dropdown support */}
                {sidebarItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => setOpportunitiesOpen(!opportunitiesOpen)}
                          className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white/90 hover:text-[#E9FF15] hover:bg-white/5 rounded-lg transition-all duration-200"
                        >
                          <span>{item.name}</span>
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${opportunitiesOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {opportunitiesOpen && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.subItems?.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className="block px-4 py-2 text-sm text-white/80 hover:text-[#E9FF15] hover:bg-white/5 rounded-lg transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className="block px-4 py-3 text-sm font-medium text-white/90 hover:text-[#E9FF15] hover:bg-white/5 rounded-lg transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className={`hidden xl:block fixed top-0 right-0 h-full w-96 bg-gradient-to-b from-[#00473E] to-[#003832] shadow-2xl transform transition-transform duration-300 ease-in-out z-40 border-l border-[#E9FF15]/20 ${
        isMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-[#E9FF15]/20 bg-[#00473E]/50 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-[#E9FF15]" style={{ fontFamily: 'Georgia, "Times New Roman", Times, serif' }}>
                  Quick Actions
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-[#E9FF15]/10 hover:text-[#E9FF15] rounded-full transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Sidebar Navigation - simplified and non-scrolling */}
          <nav className="flex-1 p-6 space-y-3">
            {sidebarItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => setOpportunitiesOpen(!opportunitiesOpen)}
                      className="w-full group flex items-center justify-between px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-[#E9FF15]/10 rounded-lg transition-all duration-200"
                    >
                      <span className="group-hover:text-[#E9FF15] transition-colors duration-200">
                        {item.name}
                      </span>
                      <svg
                        className={`w-4 h-4 text-white/40 group-hover:text-[#E9FF15] transition-all duration-200 ${opportunitiesOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {opportunitiesOpen && (
                      <div className="ml-4 mt-2 space-y-2 animate-slide-down">
                        {item.subItems?.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            className="group flex items-center justify-between px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-[#E9FF15]/10 rounded-lg transition-all duration-200"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <span className="group-hover:text-[#E9FF15] transition-colors duration-200">
                              {subItem.name}
                            </span>
                            <div className="text-white/40 group-hover:text-[#E9FF15] group-hover:translate-x-1 transition-all duration-200">
                              →
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className="group flex items-center justify-between px-4 py-3 text-sm font-medium text-white/90 hover:text-white hover:bg-[#E9FF15]/10 rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="group-hover:text-[#E9FF15] transition-colors duration-200">
                      {item.name}
                    </span>
                    <div className="text-white/40 group-hover:text-[#E9FF15] group-hover:translate-x-1 transition-all duration-200">
                      →
                    </div>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 bg-[#00473E]/50 backdrop-blur-sm">
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="text-lg font-bold text-[#E9FF15] mb-2">Download Our App</h4>
                <p className="text-sm text-white/70 mb-4">Available on all platforms</p>
              </div>
              
              <div className="space-y-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.escrow.escrowApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on Google Play"
                  className="group w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#E9FF15] to-[#d4e614] text-[#00473E] hover:from-[#d4e614] hover:to-[#E9FF15] px-4 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#E9FF15]/20"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-5 w-5" viewBox="0 0 512 512">
                    <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
                  </svg>
                  Google Play
                </a>

                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                  className="group w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#E9FF15]/50 text-white hover:text-[#E9FF15] px-4 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    fill="currentColor"
                    viewBox="-52.01 0 560.035 560.035"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                  >
                    <path d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655" />
                  </svg>
                  App Store
                </a>
              </div>

              
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isMenuOpen && (
        <div 
          className="hidden xl:block fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
    </>
  );
};

export default Header;