import React from 'react';
import { Button } from '../ui/button';
import { Logo } from '../ui/micros/logo';
import { useTheme } from '../ui/theme-provider';
import {
  Menu,
  X,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

interface HeaderProps {
  onMobileMenuToggle?: () => void;
  isMobileMenuOpen?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onMobileMenuToggle,
  isMobileMenuOpen = false
}) => {
  const { theme, setTheme } = useTheme();

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

        {/* Right side - theme toggle and future content */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Theme Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-accent"
            title={`Current theme: ${theme}. Click to cycle through themes.`}
          >
            {getThemeIcon()}
          </Button>
          {/* Content can be added here later */}
        </div>
      </div>
    </header>
  );
};

export default Header;