import { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { Header } from "./Header";
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
    // a note for whoever opens the console — you know who you are
    console.log(
      "%c ↳ you opened the console. of course you did. ",
      "background:#ffe24a;color:#1a1a1c;font-weight:bold;padding:4px 8px;border-radius:3px;",
    );
    console.log(
      "%c Hey I Am Veeru I Build This Page",
      "color:#8e8e94;padding:2px 8px;",
    );
  }, []);

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
      <footer className="shell-footer">
        <div className="container shell-footer-inner">
          <p className="meta">AUTOMATION WITH GENERATIVE AI — 165 HRS</p>
          <p className="shell-footer-sign" title="every painting is signed">
            vk &middot; 
          </p>
        </div>
      </footer>
      <CommandPalette />
      <ScrollRestoration />
    </div>
  );
}
