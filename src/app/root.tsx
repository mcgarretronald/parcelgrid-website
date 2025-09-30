import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

export default function RootLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Mobile-only Sidebar */}
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        onCloseMobileMenu={closeMobileMenu}
      />
      {/* Main layout - no left padding since sidebar is mobile-only */}
      <div className="flex flex-col min-h-screen">
        <Header 
          onMobileMenuToggle={toggleMobileMenu}
          isMobileMenuOpen={isMobileMenuOpen}
        />
        <main className="flex-1 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}