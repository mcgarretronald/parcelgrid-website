import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { router } from "./app/routes";
import { Toaster } from "sonner";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="escrow-admin-theme">
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
  );
}

export default App;