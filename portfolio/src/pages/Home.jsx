import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { siteData } from "../data";
import ProjectItem from "../components/ProjectItem";

export default function Home() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRoleIndex((i) => (i + 1) % siteData.roles.length);
        setVisible(true);
      }, 300);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="page-enter">
      {/* HERO */}
<section className="hero">
  <div className="container">
    <h1 className="hero-headline">
      Meghdad Jafari
    </h1>
  <p
    style={{
      position: "absolute",
      opacity: visible ? 1 : 0,
      transition: "opacity 0.3s ease",
      fontSize: "72px",
      fontWeight: 300,
      color: "var(--text-secondary)",
      lineHeight: 1.1,
      
      margin: 0
    }}
  >
    {siteData.roles[roleIndex]}
  </p>
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
            I design and build reliable backend systems and scalable Web APIs using C# and .NET. Currently studying Backend & Cloud Development and seeking an internship (LIA) for Autumn 2026.
          </h2>
          <a href={`mailto:${siteData.email}`} className="cta-button">
            contact me <span>→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
