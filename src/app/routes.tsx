import { createBrowserRouter, Navigate } from "react-router-dom";
import { LoadingSpinner } from "../components/ui/micros/loading-spinner";
import RootLayout from "./root";


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <LoadingSpinner />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export { router };
