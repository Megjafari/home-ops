import { Link, useLocation } from "react-router-dom";

export default function Nav() {
  const location = useLocation();

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
        </div>
      </div>
    </nav>
  );
}