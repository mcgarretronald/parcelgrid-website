import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
  <footer className="bg-gradient-to-br from-[#00473E] via-[#006644] to-[#00473E] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Stay connected + payment badges */}
          <div className="space-y-4">
            <h4 className="text-[#E9FF15] font-semibold">STAY CONNECTED</h4>
            <div className="flex space-x-3 mt-2 text-white/90">
              <a href="#" className="hover:text-[#E9FF15]"><Facebook className="w-8 h-8" /></a>
              <a href="#" className="hover:text-[#E9FF15]"><Twitter className="w-8 h-8" /></a>
              <a href="#" className="hover:text-[#E9FF15]"><Instagram className="w-8 h-8" /></a>
              <a href="#" className="hover:text-[#E9FF15]"><Linkedin className="w-8 h-8" /></a>
              <a href="#" className="hover:text-[#E9FF15]"><Youtube className="w-8 h-8" /></a>
            </div>

          <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img src="/parcelgridlogo05.jpeg" alt="logo" className="w-60 h-20 object-contain" />
          </div>
            </div>
          </div>

          {/* Center: Quick Links */}
          <div>
            <h4 className="text-[#E9FF15] font-semibold mb-3">QUICK LINKS</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="/faq" className="hover:text-[#E9FF15]">FAQ</a></li>
              <li><a href="/blog" className="hover:text-[#E9FF15]">BLOG</a></li>
              <li><a href="/privacy" className="hover:text-[#E9FF15]">PRIVACY POLICY</a></li>
              <li><a href="/terms" className="hover:text-[#E9FF15]">TERMS &amp; CONDITIONS</a></li>
              <li><a href="/about" className="hover:text-[#E9FF15]">ABOUT US</a></li>
              <li><a href="/contact" className="hover:text-[#E9FF15]">CONTACT US</a></li>
            </ul>
          </div>

          {/* Right: Our Offices */}
          <div>
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
