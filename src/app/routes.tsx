import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./root";
import LandingPage from "../pages/LandingPage";
import PickupPointsPage from "../pages/PickupPointsPage";
import PrepaidCODPage from "../pages/PrepaidCODPage";
import InstantSettlementsPage from "../pages/InstantSettlementsPage";
import SmartNotificationsPage from "../pages/SmartNotificationsPage";
import FAQ from "../pages/FAQ";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import CareersPage from "../pages/CareersPage";
import HowToUseAppPage from "../pages/HowToUseAppPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "/pickup-points",
        element: <PickupPointsPage />,
      },
      {
        path: "/prepaid-cod",
        element: <PrepaidCODPage />,
      },
      {
        path: "/instant-settlements",
        element: <InstantSettlementsPage />,
      },
      {
        path: "/notifications",
        element: <SmartNotificationsPage />,
      },
      {
        path: "/faq",
        element: <FAQ />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/careers",
        element: <CareersPage />,
      },
      {
        path: "/how-to-use-app",
        element: <HowToUseAppPage />,
      },
      {
        path: "/apply-pickup-agent",
        element: <Navigate to="/careers#pickup" replace />,
      },
      {
        path: "/apply-booking-agent",
        element: <Navigate to="/careers#booking" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export { router };
