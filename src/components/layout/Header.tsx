import React, { useState } from 'react';
import { Button } from '../ui/button';
import { useTheme } from '../ui/theme-provider';
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
  Truck,
  Phone,
} from "lucide-react";

interface HeaderProps {
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  transparent = false
}) => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

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
      transparent 
        ? 'bg-[#00473E]/20 backdrop-blur-md border-[#E9FF15]/20' 
        : 'bg-[#00473E] border-[#E9FF15]/30'
    } border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-white">
              <Truck className="w-8 h-8 text-[#E9FF15]" />
              <span className="text-xl font-bold">ParcelGrid</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="font-medium transition-colors duration-200 hover:scale-105 text-white hover:text-[#E9FF15]"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-[#E9FF15] hover:bg-[#E9FF15]/20"
            >
              {getThemeIcon()}
            </Button>

            {/* Contact Info (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-white/90">
                <Phone className="w-4 h-4" />
                <span>+254 700 123 456</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-white border-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E]"
              >
                Sign In
              </Button>
              <Button
                className="bg-[#E9FF15] text-[#00473E] hover:bg-[#E9FF15]/90 font-semibold"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[#E9FF15] hover:bg-[#E9FF15]/20"
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