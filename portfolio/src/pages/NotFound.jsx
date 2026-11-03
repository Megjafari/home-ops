import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main
      className="page-enter"
      style={{
        paddingTop: "calc(var(--nav-height) + 120px)",
        paddingBottom: "100px",
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="container">
        <p className="section-label">.404</p>
        <h1 style={{ fontSize: "clamp(40px, 8vw, 100px)", fontWeight: 300, marginBottom: "24px" }}>
          not found
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "40px", fontWeight: 300 }}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="about-cta">← back home</Link>
      </div>
    </main>
  );
}
