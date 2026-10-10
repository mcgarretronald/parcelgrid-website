import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./root";
import LandingPage from "../pages/LandingPage";
import RouteErrorPage from "../pages/RouteErrorPage";
import { lazyWithRetry } from "../lib/lazyWithRetry";

const PickupPointsPage = lazyWithRetry(() => import("../pages/PickupPointsPage"));
const PrepaidCODPage = lazyWithRetry(() => import("../pages/PrepaidCODPage"));
const FAQ = lazyWithRetry(() => import("../pages/FAQ"));
const AboutPage = lazyWithRetry(() => import("../pages/AboutPage"));
const ContactPage = lazyWithRetry(() => import("../pages/ContactPage"));
const CareersPage = lazyWithRetry(() => import("../pages/CareersPage"));
const OpportunitiesPage = lazyWithRetry(() => import("../pages/OpportunitiesPage"));
const JobPage = lazyWithRetry(() => import("../pages/JobPage"));
const HowToUseAppPage = lazyWithRetry(() => import("../pages/HowToUseAppPage"));
const BookingPage = lazyWithRetry(() => import("../pages/BookingPage"));
const PaymentPage = lazyWithRetry(() => import("../pages/PaymentPage"));
const TrackingPage = lazyWithRetry(() => import("../pages/TrackingPage"));
const UpcountryDeliveryPage = lazyWithRetry(() => import("../pages/UpcountryDeliveryPage"));
const PricingPage = lazyWithRetry(() => import("../pages/PricingPage"));
const NotFoundPage = lazyWithRetry(() => import("../pages/NotFoundPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
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
        path: "/services/upcountry-parcel-delivery",
        element: <UpcountryDeliveryPage />,
      },
      {
        path: "/services/pay-on-delivery-courier-kenya",
        element: <PrepaidCODPage />,
      },
      {
        path: "/pricing",
        element: <PricingPage />,
      },
      {
        path: "/services/courier-pricing-kenya",
        element: <Navigate to="/pricing" replace />,
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
        path: "/how-to-use-app",
        element: <HowToUseAppPage />,
      },
      {
        path: "/book-parcel",
        element: <BookingPage />,
      },
      {
        path: "/track",
        element: <TrackingPage />,
      },
      {
        path: "/track-parcel",
        element: <Navigate to="/track" replace />,
      },
      {
        path: "/payment",
        element: <PaymentPage />,
      },
      {
        path: "/careers",
        element: <CareersPage />,
      },
      {
        path: "/careers/vendor-growth-officer",
        element: <Navigate to="/careers" replace />,
      },
      {
        path: "/careers/:slug",
        element: <JobPage />,
      },
      {
        path: "/prepaid-cod",
        element: <Navigate to="/services/pay-on-delivery-courier-kenya" replace />,
      },
      {
        path: "/instant-settlements",
        element: <Navigate to="/services/pay-on-delivery-courier-kenya" replace />,
      },
      {
        path: "/notifications",
        element: <Navigate to="/services/pay-on-delivery-courier-kenya" replace />,
      },
      {
        path: "/pickup-agent",
        element: <Navigate to="/opportunities?role=pickup" replace />,
      },
      {
        path: "/booking-agent",
        element: <Navigate to="/opportunities?role=booking" replace />,
      },
      {
        path: "/apply-pickup-agent",
        element: <Navigate to="/opportunities?role=pickup" replace />,
      },
      {
        path: "/apply-booking-agent",
        element: <Navigate to="/opportunities?role=booking" replace />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export { router };
