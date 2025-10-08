import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
  <footer className="bg-gradient-to-br from-[#00473E] via-[#006644] to-[#00473E] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Stay connected (order-1 on mobile) */}
          <div className="space-y-4 order-1 md:order-1">
            <h4 className="text-[#E9FF15] font-semibold">STAY CONNECTED</h4>
            <div className="flex space-x-3 mt-2 text-white/90">
              <a href="#" className="hover:text-[#E9FF15]"><Facebook className="w-8 h-8" /></a>
              <a href="#" className="hover:text-[#E9FF15]"><Twitter className="w-8 h-8" /></a>
              <a href="#" className="hover:text-[#E9FF15]"><Instagram className="w-8 h-8" /></a>
              <a href="#" className="hover:text-[#E9FF15]"><Linkedin className="w-8 h-8" /></a>
              <a href="#" className="hover:text-[#E9FF15]"><Youtube className="w-8 h-8" /></a>
            </div>
          </div>

          {/* Center: Quick Links (order-2 on mobile) */}
          <div className="order-2 md:order-2">
            <h4 className="text-[#E9FF15] font-semibold mb-3">QUICK LINKS</h4>
            <ul className="space-y-2 text-white/80">
              <li><Link to="/" className="hover:text-[#E9FF15]">HOME</Link></li>
              <li><Link to="/pickup-points" className="hover:text-[#E9FF15]">PICKUP POINTS</Link></li>
              <li><Link to="/faq" className="hover:text-[#E9FF15]">FAQ</Link></li>
              <li><Link to="/about" className="hover:text-[#E9FF15]">ABOUT US</Link></li>
            </ul>
          </div>

          {/* Right: Our Offices (order-3 on mobile) */}
          <div className="order-3 md:order-3">
            <h4 className="text-[#E9FF15] font-semibold mb-3">OUR OFFICES</h4>
            <div className="text-white/80 space-y-3">
              <div className="flex items-start">
                <Phone className="w-4 h-4 mr-3 mt-1 text-[#E9FF15]" />
                <div>
                  <div>0745 111 555/ 0794 333 888</div>
                </div>
              </div>
              <div className="flex items-start">
                <Mail className="w-4 h-4 mr-3 mt-1 text-[#E9FF15]" />
                <div>
                  <div>info@escrowcourier.com</div>
                </div>
              </div>
              <div className="flex items-start">
                <MapPin className="w-4 h-4 mr-3 mt-1 text-[#E9FF15]" />
                <div>
                  <div>Escrow Courier LTD</div>
                  <div className="text-sm">Iconic Business Plaza, Ground Floor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo (order-4 on mobile - appears last, order-1 on desktop) */}
          <div className="order-4 md:col-span-3 flex justify-left md:justify-start">
            <img src="/parcelgridlogo05.jpeg" alt="logo" className="w-60 h-20 object-contain" />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center text-align-center justify-center">
          <div className="text-white/60">ALL RIGHTS RESERVED PARCELGRID © 2025</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
