import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import {
  Menu,
  X,
} from "lucide-react";

const Header: React.FC = () => {
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
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'Coverage', href: '#coverage' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#00473E]/95 shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${scrolled ? 'h-12' : 'h-20'}`}>
          {/* Logo */}
          <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white">
              <img src="/logo.png" alt="ParcelGrid logo" className={`transition-all duration-300 ${scrolled ? 'w-6 h-6' : 'w-14 h-14'} object-contain`} />
              <span className={`transition-all duration-300 ${scrolled ? 'text-lg' : 'text-3xl'} font-bold leading-tight`}>ParcelGrid</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-9">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-white/95 hover:text-white transition-colors duration-150"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Theme removed - no toggle */}

            

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-white/90 hover:text-white/100"
              >
                Sign In
              </Button>
              <Button
                className="bg-white text-[#00473E] hover:bg-white/90 font-semibold px-5 py-2 rounded-full"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-white/95 hover:bg-white/5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-[#E9FF15]/30 mt-2 pt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="font-medium transition-colors duration-200 text-white hover:text-[#E9FF15]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Button variant="ghost" className="justify-start text-white border-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E]">
                  Sign In
                </Button>
                <Button className="bg-[#E9FF15] text-[#00473E] hover:bg-[#E9FF15]/90 justify-start font-semibold">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;