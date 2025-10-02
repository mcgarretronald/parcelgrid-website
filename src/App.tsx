import { RouterProvider } from "react-router-dom";
import { router } from "./app/routes";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </>
  );
}

export default App;