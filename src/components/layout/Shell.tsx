import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "./Shell.css";

export function Shell() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Module pages own their titles (their effect runs before this one,
    // so writing here would clobber it).
    if (pathname.startsWith("/module/")) {
      return;
    }
    const titles: Record<string, string> = {
      "/": "Automation with Generative AI",
      "/playground": "Playground — Automation with Generative AI",
      "/capstone": "Capstone — Automation with Generative AI",
      "/resources": "Resources — Automation with Generative AI",
    };
    document.title = titles[pathname] ?? "Automation with Generative AI";
  }, [pathname]);

  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" className="shell-main">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
}
