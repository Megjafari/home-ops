import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { API_BASE } from "../lib/api";

const RSS_URL = `${API_BASE}/api/rss`;

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
    `text-sm font-mono ${
      location.pathname.startsWith(path) && path !== "/"
        ? "text-zinc-100"
        : "text-zinc-500 hover:text-zinc-300"
    } transition-colors`;

  return (
    <nav className="border-b border-zinc-900">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center gap-6">
        <Link to="/" className="text-sm font-semibold text-zinc-100">
          Homelab Journal
        </Link>
        <div className="flex gap-5 ml-auto">
          <Link to="/blog" className={linkClass("/blog")}>Blog</Link>
          <Link to="/about" className={linkClass("/about")}>About</Link>
          <a href={RSS_URL} className="text-sm font-mono text-zinc-500 hover:text-zinc-300 transition-colors">
            RSS
          </a>
        </div>
      </div>
    </nav>
  );
}
