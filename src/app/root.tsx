import { Outlet, useLocation } from "react-router-dom";
import Header from "../components/layout/Header";

export default function RootLayout() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="relative min-h-screen">
      {/* Header - transparent on landing page */}
      <Header transparent={isLandingPage} />
      
      {/* Main content - reserve header height on non-landing pages so fixed header doesn't overlap content */}
      <main className={isLandingPage ? '' : 'pt-20'}>
        <Outlet />
      </main>
    </div>
  );
}