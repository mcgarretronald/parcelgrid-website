import React from 'react';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-[#00473E] via-[#006644] to-[#00473E] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left: Logo + description + social */}
          <div className="flex flex-col items-start space-y-4">
            <img src="/parcelgridlogo05.jpeg" alt="ParcelGrid" className="h-20 md:h-24 lg:h-28 object-contain" />
            <p className="text-[#E9FF15] max-w-sm text-sm md:text-base leading-relaxed">
              Kenya's leading delivery platform connecting vendors to customers nationwide through our extensive pickup point network.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E] transition-all duration-200">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E] transition-all duration-200">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E] transition-all duration-200">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E] transition-all duration-200">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Center: Quick links */}
          <div className="flex flex-col">
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-[#E9FF15] hover:text-white">Home</a></li>
              <li><a href="/pickup-points" className="text-[#E9FF15] hover:text-white">Pickup Points</a></li>
              <li><a href="/deliveries" className="text-[#E9FF15] hover:text-white">Deliveries</a></li>
              <li><a href="/settlements" className="text-[#E9FF15] hover:text-white">Settlements</a></li>
              <li><a href="/notifications" className="text-[#E9FF15] hover:text-white">Notifications</a></li>
            </ul>
          </div>

          {/* Right: Contact */}
          <div className="flex flex-col">
            <h4 className="text-lg font-bold mb-4">Contact Us</h4>
            <div className="space-y-3 text-[#E9FF15]">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-white" />
                <span>support@parcelgrid.co.ke</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-white" />
                <span>+254 700 000 000</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-white" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-[#E9FF15]">
          <div>© 2025 ParcelGrid. All rights reserved.</div>
          <div className="flex space-x-6 mt-3 md:mt-0">
            <a href="/privacy" className="hover:text-white">Privacy Policy</a>
            <a href="/terms" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
