import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";

export const RSS_URL = "/rss.xml";
export const PORTFOLIO_URL = "https://meghdadjafari.dev";
export const EMAIL = "meghdad.jafari@outlook.com";

interface NavItem {
  label: string;
  to?: string;
  href?: string;
}

const items: NavItem[] = [
  { label: "Portfolio", href: PORTFOLIO_URL },
  { label: "Blog", to: "/blog" },
  { label: "About", to: "/about" },
  { label: "Contact", href: `${PORTFOLIO_URL}/#contact` },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  // Lets feed readers auto-discover the RSS feed.
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.type = "application/rss+xml";
    link.title = "Blog, Meghdad Jafari";
    link.href = RSS_URL;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  // The mobile menu locks the page while it is open.
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = matchMedia("(min-width: 721px)");
    const onChange = (e: MediaQueryListEvent) => e.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, []);

  const render = (item: NavItem, className?: string, style?: React.CSSProperties) =>
    item.to ? (
      <NavLink key={item.label} to={item.to} className={className} style={style} onClick={() => setOpen(false)}>
        {item.label}
      </NavLink>
    ) : (
      <a key={item.label} href={item.href} className={className} style={style}>
        {item.label}
      </a>
    );

  return (
    <>
      <header className="site-nav">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          © Meghdad Jafari
        </Link>
        {items.map((item) => render(item, "nav-link"))}
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>

      <div className={`menu-sheet${open ? " open" : ""}`} id="menu" inert={!open}>
        <nav aria-label="Menu">
          {items.map((item, i) => render(item, undefined, { "--i": i } as React.CSSProperties))}
        </nav>
        <div className="menu-foot">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <span>Notes from my homelab</span>
        </div>
      </div>
    </>
  );
}
