import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";
import { lazyWithRetry } from "../lib/lazyWithRetry";

const ChatWidget = lazyWithRetry(() => import("../components/chat/ChatWidget"));

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function RootLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  // SPA route changes — gtag initial config only covers the first load
  useEffect(() => {
    window.gtag?.('config', 'G-R80P9G4W4C', {
      page_path: `${location.pathname}${location.search}`,
    });
  }, [location.pathname, location.search]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Header - transparent on landing page */}
      <Header transparent={isLandingPage} />
      
      {/* Main content - reserve header height on non-landing pages so fixed header doesn't overlap content.
          Dark-hero pages cancel this with -mt-24 so the band sits flush under the header. */}
      <main className={`min-w-0 ${isLandingPage ? '' : 'pt-24'}`}>
        <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Website help chat — lazy so the rest of the page isn't blocked */}
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}