import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { siteData } from "../data";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

useEffect(() => {
  const onScroll = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress((window.scrollY / total) * 100);
  };
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  const links = [
    { to: "/projects", label: "projects" },
    { to: "/about", label: "about" },
    { to: "/skills", label: "skills" },
    { to: "/contact", label: "contact" },
  ];

  return (
    <>
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo">{siteData.handle}</Link>
          <ul className="nav-links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}

            <li style={{ display: "flex", alignItems: "center", gap: "7px" }}>
  <span style={{
    width: "6px", height: "6px", borderRadius: "50%",
    background: "#4ade80", display: "inline-block",
    animation: "pulse 2s infinite", flexShrink: 0
  }} />
  <span style={{
    fontFamily: "var(--mono)", fontSize: "12px",
    color: "var(--text-secondary)"
  }}>
    {siteData.tagline}
  </span>
</li>
          </ul>
          {/* Right side icons */}
<div style={{ display: "flex", alignItems: "center", gap: "16px" }} className="desktop-only">
  
  {/* GitHub */}
  <a href={siteData.social.github} target="_blank" rel="noreferrer"
    style={{ color: "var(--text-muted)", transition: "color 0.2s" }}
    onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
    onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  </a>

  {/* LinkedIn */}
  <a href={siteData.social.linkedin} target="_blank" rel="noreferrer"
    style={{ color: "var(--text-muted)", transition: "color 0.2s" }}
    onMouseEnter={e => e.target.style.color = "var(--text-primary)"}
    onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  </a>

  {/* CV Dropdown */}
  <div style={{ position: "relative", display: "flex", alignItems: "center" }} 
    onMouseEnter={e => e.currentTarget.querySelector(".cv-dropdown").style.display = "flex"}
    onMouseLeave={e => e.currentTarget.querySelector(".cv-dropdown").style.display = "none"}
  >
    <button style={{
      fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text-secondary)",
background: "none", border: "none", padding: "0",
cursor: "pointer", transition: "all 0.2s",
color: "var(--text-muted)", fontFamily: "var(--mono)", fontSize: "12px"
    }}>
      cv ↓
    </button>
    <div className="cv-dropdown" style={{
      display: "none", position: "absolute", top: "calc(100% + 2px)", right: 0,
      background: "#111", border: "1px solid var(--border)", borderRadius: "8px",
      flexDirection: "column", overflow: "hidden", minWidth: "160px", zIndex: 200
    }}>
      <a href="/cv-english.pdf" download style={{
        fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text-secondary)",
        padding: "12px 16px", transition: "background 0.15s"
      }}
        onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.05)"}
        onMouseLeave={e => e.target.style.background = "transparent"}
      >
        English ↓
      </a>
      <a href="/cv-swedish.pdf" download style={{
        fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text-secondary)",
        padding: "12px 16px", borderTop: "1px solid var(--border)", transition: "background 0.15s"
      }}
        onMouseEnter={e => e.target.style.background = "rgba(255,255,255,0.05)"}
        onMouseLeave={e => e.target.style.background = "transparent"}
      >
        Svenska ↓
      </a>
    </div>
  </div>

</div>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

<div style={{
  position: "fixed", top: "var(--nav-height)", left: 0,
  width: `${scrollProgress}%`, height: "1px",
  background: "var(--text-primary)", zIndex: 101,
transition: "width 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)"
}} />
      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
<button className="mobile-close" onClick={() => setMenuOpen(false)} style={{ zIndex: 110, position: "absolute", top: "24px", right: "32px" }}>
  close
</button>
        <Link to="/" onClick={() => setMenuOpen(false)} style={{ fontFamily: "var(--mono)", fontSize: "24px", color: "var(--text-muted)" }}>
          {siteData.handle}
        </Link>
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} onClick={() => setMenuOpen(false)}>
            {l.label}
          </NavLink>
        ))}
      </div>
    </>
  );
}
