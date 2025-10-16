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
            {/* Store buttons on desktop: hidden on small, visible md+ beneath social icons */}
            <div className="hidden md:flex md:flex-col md:items-start mt-4">
              <div className="flex items-center gap-3">
                <a
                  href="https://play.google.com/store/apps/details?id=com.escrow.escrowApp"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on Google Play"
                  className="inline-flex items-center justify-center border-2 border-[#00473E] rounded-full bg-[#00473E] px-6 py-2.5 text-center text-white outline-0 transition-all duration-200 ease-out hover:bg-transparent hover:text-[#E9FF15] hover:border-[#E9FF15] no-underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-6 w-6" viewBox="0 0 512 512">
                    <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
                  </svg>
                  <div className="ml-4 flex flex-col items-start leading-none">
                    <div className="mb-1 text-xs leading-4">GET IT ON</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </a>

                <a
                  href="https://apps.apple.com/app/parcelgrid/id000000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                  className="inline-flex items-center justify-center border-2 border-[#00473E] rounded-full bg-[#00473E] px-6 py-2.5 text-center text-white outline-0 transition-all duration-200 ease-out hover:bg-transparent hover:text-[#E9FF15] hover:border-[#E9FF15] no-underline"
                >
                  <svg
                    fill="currentColor"
                    viewBox="-52.01 0 560.035 560.035"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"
                      ></path>
                    </g>
                  </svg>
                  <div className="ml-4 flex flex-col items-start leading-none">
                    <div className="mb-1 text-xs leading-4">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </a>
              </div>
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
              <li><a href="https://app.escrowcourier.com/static-services/resources/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-[#E9FF15]">PRIVACY POLICY</a></li>
              <li><a href="https://app.escrowcourier.com/static-services/resources/terms" target="_blank" rel="noopener noreferrer" className="hover:text-[#E9FF15]">TERMS &amp; CONDITIONS</a></li>
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
                <div className="flex-shrink-0 mr-3 flex items-center">
                  <MapPin className="w-5 h-5 text-[#E9FF15]" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Escrow Courier Networks Limited</div>
                  <div className="mt-2 space-y-2 text-sm text-white/80">
                    <div>Iconic Business Plaza, Ground floor, Shop no: G13. Moi avenue. Between sasa mall and Sawa mall.</div>
                    <div>Jithada Shopping Complex, Ground Floor, Shop no: F7 Taveta Road, Next to Taveta shopping Mall, Opposite Samagat Building.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Logo (order-4 on mobile - appears last, order-1 on desktop) */}
          <div className="order-4 md:col-span-3 flex flex-col items-center gap-4 md:hidden px-4">
            <div className="flex flex-col xs:flex-row items-center gap-3 w-full max-w-md">
              <a
                href="https://play.google.com/store/apps/details?id=com.parcelgrid.logistics"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on Google Play"
                className="inline-flex items-center justify-center border-2 border-[#00473E] rounded-full bg-[#00473E] px-4 xs:px-6 py-2 xs:py-2.5 text-center text-white outline-0 transition-all duration-200 ease-out hover:bg-transparent hover:text-[#E9FF15] hover:border-[#E9FF15] no-underline w-full xs:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="h-5 w-5 xs:h-6 xs:w-6 flex-shrink-0" viewBox="0 0 512 512">
                  <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
                </svg>
                <div className="ml-2 xs:ml-4 flex flex-col items-start leading-none">
                  <div className="mb-1 text-xs leading-3 xs:leading-4">GET IT ON</div>
                  <div className="font-semibold text-sm xs:text-base">Google Play</div>
                </div>
              </a>

              <a
                href="https://apps.apple.com/app/parcelgrid/id000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="inline-flex items-center justify-center border-2 border-[#00473E] rounded-full bg-[#00473E] px-4 xs:px-6 py-2 xs:py-2.5 text-center text-white outline-0 transition-all duration-200 ease-out hover:bg-transparent hover:text-[#E9FF15] hover:border-[#E9FF15] no-underline w-full xs:w-auto"
              >
                <svg
                  fill="currentColor"
                  viewBox="-52.01 0 560.035 560.035"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 xs:h-6 xs:w-6 flex-shrink-0"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M380.844 297.529c.787 84.752 74.349 112.955 75.164 113.314-.622 1.988-11.754 40.191-38.756 79.652-23.343 34.117-47.568 68.107-85.731 68.811-37.499.691-49.557-22.236-92.429-22.236-42.859 0-56.256 21.533-91.753 22.928-36.837 1.395-64.889-36.891-88.424-70.883-48.093-69.53-84.846-196.475-35.496-282.165 24.516-42.554 68.328-69.501 115.882-70.192 36.173-.69 70.315 24.336 92.429 24.336 22.1 0 63.59-30.096 107.208-25.676 18.26.76 69.517 7.376 102.429 55.552-2.652 1.644-61.159 35.704-60.523 106.559M310.369 89.418C329.926 65.745 343.089 32.79 339.498 0 311.308 1.133 277.22 18.785 257 42.445c-18.121 20.952-33.991 54.487-29.709 86.628 31.421 2.431 63.52-15.967 83.078-39.655"
                    ></path>
                  </g>
                </svg>
                <div className="ml-2 xs:ml-4 flex flex-col items-start leading-none">
                  <div className="mb-1 text-xs leading-3 xs:leading-4">Download on the</div>
                  <div className="font-semibold text-sm xs:text-base">App Store</div>
                </div>
              </a>
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
