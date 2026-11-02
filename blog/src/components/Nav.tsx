import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE } from "../lib/api";

export const RSS_URL = `${API_BASE}/api/rss`;

export default function Nav() {
  const location = useLocation();

  // Lets feed readers auto-discover the RSS feed.
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.type = "application/rss+xml";
    link.title = "Homelab Journal";
    link.href = RSS_URL;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  const linkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      location.pathname.startsWith(path) ? "text-fg" : "text-fg-muted hover:text-fg"
    }`;

  return (
    <header className="sticky top-0 z-20 border-b border-line/70 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-6">
        <Link to="/" className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-fg">
          <svg width="22" height="22" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="7" fill="#1a1a1f" />
            <rect x="8" y="9" width="16" height="2.4" rx="1.2" fill="#ededef" />
            <rect x="8" y="14.8" width="11" height="2.4" rx="1.2" fill="#8e8e98" />
            <rect x="8" y="20.6" width="14" height="2.4" rx="1.2" fill="#8e8e98" />
          </svg>
          Homelab Journal
        </Link>
        <nav aria-label="Main" className="ml-auto flex items-center gap-6">
          <Link to="/blog" className={linkClass("/blog")}>
            Journal
          </Link>
          <Link to="/about" className={linkClass("/about")}>
            About
          </Link>
          <a
            href="https://meghdadjafari.dev"
            className="hidden text-sm font-medium text-fg-muted transition-colors hover:text-fg sm:inline"
          >
            Portfolio ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
