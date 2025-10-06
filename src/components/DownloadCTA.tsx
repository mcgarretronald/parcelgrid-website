
export default function DownloadCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-[#00473E] rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#E9FF15] rounded-full opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#00473E] rounded-full opacity-5 animate-pulse delay-500"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 bg-[#E9FF15] rounded-full opacity-10 animate-pulse delay-1500"></div>
        <div className="absolute top-1/4 right-1/3 w-8 h-8 bg-[#00473E] rounded-full opacity-10 animate-pulse delay-2000"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 animate-bounce delay-300">
          <svg className="w-8 h-8 text-[#00473E] opacity-10" aria-hidden />
        </div>
        <div className="absolute bottom-32 right-1/4 animate-bounce delay-700">
          <svg className="w-10 h-10 text-[#E9FF15] opacity-10" aria-hidden />
        </div>
        <div className="absolute top-1/3 right-20 animate-bounce delay-1000">
          <svg className="w-6 h-6 text-[#00473E] opacity-15" aria-hidden />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6">
          <a
            href="/download"
            aria-label="Download ParcelGrid App"
            className="group block mx-auto w-full max-w-lg h-28 sm:h-32 md:h-40 rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.02]"
            style={{ backgroundImage: `url('/parcelgridlogo05.jpeg')`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}
          >
            <span className="sr-only">Download ParcelGrid App</span>
            <span className="absolute right-6 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#00473E] rounded-full animate-pulse" />
          </a>
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Available on iOS and Android • Free to download • Start delivering today</p>
          <div className="flex justify-center items-center space-x-6 text-sm text-gray-500">
            <span className="flex items-center"><div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>10,000+ Active Vendors</span>
            <span className="flex items-center"><div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></div>413+ Pickup Points</span>
            <span className="flex items-center"><div className="w-2 h-2 bg-yellow-400 rounded-full mr-2 animate-pulse"></div>99.5% Success Rate</span>
          </div>
        </div>
      </div>
    </section>
  )
}
