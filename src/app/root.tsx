import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";

export default function RootLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="relative min-h-screen">
      {/* Header - transparent on landing page */}
      <Header transparent={isLandingPage} />
      
      {/* Main content - no padding-top on landing page since hero is full screen */}
      <main className={isLandingPage ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  );
}