import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { router } from "./app/routes";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </HelmetProvider>
  );
}

export default App;