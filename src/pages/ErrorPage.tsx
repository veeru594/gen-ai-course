import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import "./StatusPage.css";

/* Root errorElement: catches render-time crashes anywhere in the route
   tree so a thrown error degrades to a recoverable page instead of a
   blank screen. Uses a full-reload anchor (not a client Link) to escape
   whatever broken state caused the crash. */
export function ErrorPage() {
  const error = useRouteError();

  let detail = "An unexpected error occurred while rendering this page.";
  if (isRouteErrorResponse(error)) {
    detail = `${error.status} ${error.statusText}`;
  } else if (error instanceof Error) {
    detail = error.message;
  }

  return (
    <div className="container status-page">
      <p className="meta status-code">error</p>
      <h1>Something went wrong</h1>
      <p className="status-body">{detail}</p>
      <a className="status-link" href="/">
        ← Reload the site
      </a>
    </div>
  );
}
