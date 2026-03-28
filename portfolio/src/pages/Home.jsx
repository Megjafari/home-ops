import { Link } from "react-router-dom";
import { siteData } from "../data";
import ProjectItem from "../components/ProjectItem";
import TextType from "../components/TextType";

export default function Home() {
  return (
    <main className="page-enter">

      {/* TAGLINE */}
      <div className="tagline-bar" style={{
        paddingTop: "calc(var(--nav-height) + 12px)",
        paddingBottom: "12px",
        paddingRight: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        maxWidth: "var(--max-width)",
        margin: "0 auto",
        width: "100%",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: "#4ade80", display: "inline-block",
            animation: "pulse 2s infinite"
          }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text-muted)" }}>
            {siteData.tagline}
          </span>
        </div>
      </div>

      {/* HERO */}
      <section className="hero">
        <div className="container" style={{ width: "100%" }}>
          <h1 className="hero-headline">
            Meghdad Jafari
          </h1>
          <TextType
            text={siteData.roles}
            typingSpeed={80}
            deletingSpeed={45}
            pauseDuration={2000}
            loop={true}
              style={{
    fontSize: "clamp(36px, 6vw, 72px)",
    fontWeight: 300,
    color: "var(--text-secondary)",
    lineHeight: 1.1,
    display: "block",
  }}
          />
        </div>
      </section>

      {/* PROJECTS */}
      <section className="projects-section">
        <div className="container">
          <p className="section-label">.selected work</p>
          {siteData.projects.map((project, i) => (
            <ProjectItem key={project.id} project={project} index={i} />
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section">
        <div className="container">
          <div className="about-grid">
            <div>
              <p className="section-label">.about</p>
              <p className="about-text">{siteData.about.bio}</p>
              <Link to="/about" className="about-cta">
                about me <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <p className="cta-label">.backend developer</p>
          <h2 className="cta-headline">
            I design and build reliable backend systems and scalable Web APIs 
            using C# and .NET, with growing fullstack experience using React. 
            Currently studying Backend & Cloud Development and seeking an 
            internship (LIA) for Autumn 2026.
          </h2>
          <a href={`mailto:${siteData.email}`} className="cta-button">
            contact me <span>→</span>
          </a>
        </div>
      </section>

    </main>
  );
}