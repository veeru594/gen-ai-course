import { useLocation } from "react-router-dom";
import "./Footer.css";

export function Footer() {
  const { pathname } = useLocation();

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <span className="footer-cell">{pathname}</span>
        <span className="footer-cell">220 THEORY + 90 EMP + 200 LAB + 30 CAP = 540 HRS</span>
        <span className="footer-cell">built with React + TS</span>
      </div>
    </footer>
  );
}
