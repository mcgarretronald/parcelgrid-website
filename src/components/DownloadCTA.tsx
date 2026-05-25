
export default function DownloadCTA() {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-[#00473E] rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-[#E9FF15] rounded-full opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-[#00473E] rounded-full opacity-5 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-[#E9FF15] rounded-full opacity-10 animate-pulse delay-1500"></div>
        <div className="absolute top-1/4 right-1/3 w-6 h-6 sm:w-8 sm:h-8 bg-[#00473E] rounded-full opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-1/4 sm:top-20 animate-bounce delay-300">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#00473E] opacity-10" aria-hidden />
        </div>
        <div className="absolute bottom-24 right-1/4 sm:bottom-32 animate-bounce delay-700">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#E9FF15] opacity-10" aria-hidden />
        </div>
        <div className="absolute top-1/3 right-12 sm:right-20 animate-bounce delay-1000">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#00473E] opacity-15" aria-hidden />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-center">
            <a
              href="https://play.google.com/store/apps/details?id=com.escrow.escrowApp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#E9FF15] text-[#00473E] px-5 py-3 sm:px-6 sm:py-4 rounded-xl hover:bg-[#d4e614] transition-colors shadow-sm w-full sm:w-auto justify-center"
              aria-label="Download on Google Play"
            >
              <img src="/playstorelogo.png" alt="Download ParcelGrid App on Google Play Store for Android" width="48" height="48" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
              <span className="text-base sm:text-lg font-semibold">Get it on Google Play</span>
            </a>

            <a
              href="https://apps.apple.com/ke/app/parcelgrid-deliver-beyond-nrbi/id6749815954"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#E9FF15] text-[#00473E] px-5 py-3 sm:px-6 sm:py-4 rounded-xl hover:bg-[#d4e614] transition-colors shadow-sm w-full sm:w-auto justify-center"
              aria-label="Download on the App Store"
            >
              <img src="/Applelogo.png" alt="Download ParcelGrid App on Apple App Store for iOS" width="48" height="48" className="w-8 h-8 sm:w-12 sm:h-12 object-contain" />
              <span className="text-base sm:text-lg font-semibold">Download on the App Store</span>
            </a>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-base sm:text-lg mb-4 sm:mb-6 px-2 sm:px-0">Available on iOS and Android • Free to download • Start delivering today</p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-gray-500">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="whitespace-nowrap">10,000+ Active Vendors</span>
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>
              <span className="whitespace-nowrap">All Major Towns</span>
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>
              <span className="whitespace-nowrap">99.5% Success Rate</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
