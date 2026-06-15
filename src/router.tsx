import { createBrowserRouter } from "react-router-dom";
import { Shell } from "./components/layout/Shell";
import { Home } from "./pages/Home";
import { ModulePage } from "./pages/ModulePage";
import { Playground } from "./pages/Playground";
import { Capstone } from "./pages/Capstone";
import { Resources } from "./pages/Resources";
import { Schedule } from "./pages/Schedule";
import { NotFound } from "./pages/NotFound";
import { ErrorPage } from "./pages/ErrorPage";

export const router = createBrowserRouter([
  {
    element: <Shell />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/module/:id", element: <ModulePage /> },
      { path: "/schedule", element: <Schedule /> },
      { path: "/playground", element: <Playground /> },
      { path: "/capstone", element: <Capstone /> },
      { path: "/resources", element: <Resources /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
