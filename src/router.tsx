import { createBrowserRouter, Navigate } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { Home } from "./pages/Home";
import { ModulePage } from "./pages/ModulePage";
import { Playground } from "./pages/Playground";
import { Capstone } from "./pages/Capstone";
import { Resources } from "./pages/Resources";

export const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/module/:id", element: <ModulePage /> },
      { path: "/playground", element: <Playground /> },
      { path: "/capstone", element: <Capstone /> },
      { path: "/resources", element: <Resources /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
