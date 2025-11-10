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
import OpportunitiesPage from "../pages/OpportunitiesPage";
import PickupAgentPage from "../pages/PickupAgentPage";
import BookingAgentPage from "../pages/BookingAgentPage";
import HowToUseAppPage from "../pages/HowToUseAppPage";
import BookingPage from "../pages/BookingPage";

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
        path: "/opportunities",
        element: <OpportunitiesPage />,
      },
      {
        path: "/pickup-agent",
        element: <PickupAgentPage />,
      },
      {
        path: "/booking-agent",
        element: <BookingAgentPage />,
      },
      {
        path: "/how-to-use-app",
        element: <HowToUseAppPage />,
      },
      {
        path: "/book-parcel",
        element: <BookingPage />,
      },
      {
        path: "/careers",
        element: <Navigate to="/opportunities" replace />,
      },
      {
        path: "/apply-pickup-agent",
        element: <Navigate to="/pickup-agent" replace />,
      },
      {
        path: "/apply-booking-agent",
        element: <Navigate to="/booking-agent" replace />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export { router };
