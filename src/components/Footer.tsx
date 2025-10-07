import React from 'react';
import { Package, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, X } from 'lucide-react';

const Footer: React.FC = () => {
  const [open, setOpen] = React.useState<null | 'trial' | 'demo'>(null);

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00473E] via-[#006644] to-[#00473E]"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#E9FF15] rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#E9FF15] rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-[#E9FF15] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Info */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="mb-6">
              <img 
                src="/parcelgridlogo01.jpeg" 
                alt="ParcelGrid Logo" 
                className="w-full max-w-sm md:max-w-md h-20 md:h-24 object-contain object-left" 
              />
            </div>
            <p className="text-[#E9FF15] text-base leading-relaxed mb-6 max-w-md">
              Kenya's leading delivery platform connecting vendors to customers nationwide through our extensive pickup point network.
            </p>
            
            {/* Social Media */}
            <div className="flex space-x-3">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E] transition-all duration-300 hover:scale-110">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E] transition-all duration-300 hover:scale-110">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E] transition-all duration-300 hover:scale-110">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#E9FF15] hover:bg-[#E9FF15] hover:text-[#00473E] transition-all duration-300 hover:scale-110">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="w-1.5 h-6 bg-[#E9FF15] rounded-full mr-2"></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li><a href="/" className="text-[#E9FF15] hover:text-white transition-colors duration-300 text-base hover:translate-x-1 transform transition-transform">Home</a></li>
              <li><a href="/pickup-points" className="text-[#E9FF15] hover:text-white transition-colors duration-300 text-base hover:translate-x-1 transform transition-transform">Pickup Points</a></li>
              <li><a href="/deliveries" className="text-[#E9FF15] hover:text-white transition-colors duration-300 text-base hover:translate-x-1 transform transition-transform">Deliveries</a></li>
              <li><a href="/settlements" className="text-[#E9FF15] hover:text-white transition-colors duration-300 text-base hover:translate-x-1 transform transition-transform">Settlements</a></li>
              <li><a href="/notifications" className="text-[#E9FF15] hover:text-white transition-colors duration-300 text-base hover:translate-x-1 transform transition-transform">Notifications</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 flex items-center">
              <div className="w-1.5 h-6 bg-[#E9FF15] rounded-full mr-2"></div>
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center text-[#E9FF15] text-base">
                <Mail className="w-4 h-4 mr-2 text-white" />
                support@parcelgrid.co.ke
              </li>
              <li className="flex items-center text-[#E9FF15] text-base">
                <Phone className="w-4 h-4 mr-2 text-white" />
                +254 700 000 000
              </li>
              <li className="flex items-center text-[#E9FF15] text-base">
                <MapPin className="w-4 h-4 mr-2 text-white" />
                Nairobi, Kenya
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-3 md:mb-0">
              <div className="w-6 h-6 bg-[#E9FF15] rounded-lg flex items-center justify-center mr-2">
                <Package className="w-3 h-3 text-[#00473E]" />
              </div>
              <p className="text-[#E9FF15] text-base">
                © 2025 ParcelGrid. All rights reserved.
              </p>
            </div>
            
            <div className="flex space-x-6">
              <a href="/privacy" className="text-[#E9FF15] hover:text-white transition-colors duration-300 text-base">
                Privacy Policy
              </a>
              <a href="/terms" className="text-[#E9FF15] hover:text-white transition-colors duration-300 text-base">
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(null)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
              <button className="absolute top-3 right-3 p-2 rounded-full hover:bg-gray-100" onClick={() => setOpen(null)} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{open === 'trial' ? 'Start Free Trial' : 'Schedule Demo'}</h3>
              <p className="text-gray-600 mb-4">{open === 'trial' ? 'Enter your details and we will get you started right away.' : 'Tell us a bit about your business and we will schedule a personalized demo.'}</p>
              <form className="space-y-4">
                <input className="w-full border rounded-lg p-3" placeholder="Full name" />
                <input className="w-full border rounded-lg p-3" placeholder="Email address" type="email" />
                <input className="w-full border rounded-lg p-3" placeholder="Company" />
                {open === 'demo' && <input className="w-full border rounded-lg p-3" placeholder="Preferred date/time" />}
                <button type="button" className="w-full py-3 rounded-lg bg-[#00473E] text-white font-semibold hover:bg-[#006644] transition-colors">Submit</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;