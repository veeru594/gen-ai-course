import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandPalette } from "./CommandPalette";
import "./Shell.css";

export function Shell() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      return;
    }
    // let the page render, then jump to the anchor (palette demo links)
    const t = window.setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }, 60);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

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
      <CommandPalette />
      <ScrollRestoration />
    </div>
  );
}
