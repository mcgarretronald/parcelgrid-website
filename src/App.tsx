import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { router } from "./app/routes";
import { Toaster } from "./components/ui/sonner";
import IntroSplash from "./components/IntroSplash";

function App() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}
      <Toaster position="top-center" richColors closeButton />
    </HelmetProvider>
  );
}

export default App;