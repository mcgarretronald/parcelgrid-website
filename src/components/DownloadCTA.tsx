
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
          <a
            href="/download"
            aria-label="Download ParcelGrid App"
            className="group relative block mx-auto w-full max-w-xs sm:max-w-sm md:max-w-lg h-24 sm:h-28 md:h-32 lg:h-40 rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] shadow-lg"
            style={{ backgroundImage: `url('/parcelgridlogo05.jpeg')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}
          >
            <span className="sr-only">Download ParcelGrid App</span>
            <span className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#00473E] rounded-full animate-pulse" />
          </a>
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
              <span className="whitespace-nowrap">413+ Pickup Points</span>
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
