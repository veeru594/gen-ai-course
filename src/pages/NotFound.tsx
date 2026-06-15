import { Link } from "react-router-dom";
import "./StatusPage.css";

export function NotFound() {
  return (
    <div className="container status-page">
      <p className="meta status-code">404</p>
      <h1>This page doesn't exist</h1>
      <p className="status-body">
        The link may be mistyped or the page may have moved. Everything in the
        program is reachable from the navigation above — or jump anywhere with{" "}
        <kbd>Ctrl</kbd> <kbd>K</kbd>.
      </p>
      <Link className="status-link" to="/">
        ← Back to home
      </Link>
    </div>
  );
}
