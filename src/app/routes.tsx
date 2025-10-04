import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./root";
import LandingPage from "../pages/LandingPage";
import PickupPointsPage from "../pages/PickupPointsPage";

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
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export { router };
