import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "../components/Footer";
import { PageHeroBackground } from '../components/PageHeroBackground';

const LINKS = [
  { to: "/track", label: "Track a parcel" },
  { to: "/pickup-points", label: "Find a station" },
  { to: "/services/upcountry-parcel-delivery", label: "Upcountry delivery" },
  { to: "/services/pay-on-delivery-courier-kenya", label: "Pay on Delivery" },
  { to: "/pricing", label: "Courier prices" },
  { to: "/contact", label: "Contact us" },
];

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>Page not found | ParcelGrid</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <section className="relative -mt-24 overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-20 sm:pt-28">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">Error 404</p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            Page not found
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
            The page you are looking for does not exist or has moved. Try one of these instead.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link
              to="/"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
            >
              Go to the homepage <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-2">
            {LINKS.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Footer />
    </div>
  );
}
