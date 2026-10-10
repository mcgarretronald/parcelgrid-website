import { Helmet } from "react-helmet-async";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";
import { ArrowRight, Home, MessageCircle, RefreshCw } from "lucide-react";
import Footer from "../components/Footer";
import { PageHeroBackground } from "../components/PageHeroBackground";
import { isChunkLoadError } from "../lib/lazyWithRetry";

function describeError(error: unknown): { title: string; body: string; chunk: boolean } {
  if (isChunkLoadError(error)) {
    return {
      title: "Please refresh to continue",
      body: "We just updated the website. Reload this page to load the latest version — your progress is not lost.",
      chunk: true,
    };
  }
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: "Page not found",
        body: "The page you are looking for does not exist or has moved.",
        chunk: false,
      };
    }
    return {
      title: "Something went wrong",
      body: error.statusText || "We could not open this page right now. Please try again.",
      chunk: false,
    };
  }
  return {
    title: "Something went wrong",
    body: "An unexpected error occurred. Refresh the page or head back home — if it keeps happening, message us on WhatsApp.",
    chunk: false,
  };
}

export default function RouteErrorPage() {
  const error = useRouteError();
  const { title, body, chunk } = describeError(error);

  const reload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white text-[#222222]">
      <Helmet>
        <title>{title} | ParcelGrid</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <header className="relative overflow-hidden bg-[#071410]">
        <PageHeroBackground />
        <div className="relative mx-auto max-w-3xl px-5 pb-16 pt-24 text-center sm:px-8 sm:pb-20 sm:pt-28">
          <p className="text-xs font-semibold tracking-[0.18em] text-[#E9FF15]">
            {chunk ? "Update available" : "Temporary issue"}
          </p>
          <h1 className="mt-4 font-[Sora] text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{body}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={reload}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-[#E9FF15] px-6 text-sm font-semibold text-[#00473E] transition-colors hover:bg-[#d4e614]"
            >
              <RefreshCw className="size-4" aria-hidden />
              Refresh page
            </button>
            <Link
              to="/"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              <Home className="size-4" aria-hidden />
              Go to homepage
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              to="/track"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Track a parcel <ArrowRight className="size-3.5" aria-hidden />
            </Link>
            <Link
              to="/contact"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Contact us
            </Link>
            <a
              href="https://wa.me/254794333888"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-white/20 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <MessageCircle className="size-3.5" aria-hidden />
              WhatsApp support
            </a>
          </div>
        </div>
      </header>

      <Footer />
    </div>
  );
}
