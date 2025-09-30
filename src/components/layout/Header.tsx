import React from 'react';
import { Button } from '../ui/button';
import { Logo } from '../ui/micros/logo';
import {
  Menu,
  X,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onMobileMenuToggle,
  isMobileMenuOpen = false
}) => {
  return (
    <header className="dashboard-header px-4 sm:px-6 py-4 border-b">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button & Logo */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button - only visible on mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover:bg-gray-700/50"
            onClick={onMobileMenuToggle}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          {/* Logo - visible on all screen sizes */}
          <div>
            <Logo size="md" showText />
          </div>
        </div>

        {/* Spacer to push content to the right */}
        <div className="flex-1"></div>

        {/* Right side - placeholder for future content */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Content can be added here later */}
        </div>
      </div>
    </header>
  );
};

export default Header;