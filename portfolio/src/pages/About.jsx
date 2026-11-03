import { siteData } from "../data";

export default function About() {
  return (
    <main className="about-page page-enter">
      <div className="container">
        <div className="about-page-hero">
<div className="about-grid" style={{
              
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
              alignItems: "start",
            }}
          >
            <div>
              <p className="section-label" style={{ marginBottom: "24px" }}>.about</p>
              <h1 className="about-page-title">{siteData.name}</h1>
              <p className="about-page-bio">{siteData.about.description}</p>
<p style={{ marginTop: "20px", fontFamily: "var(--mono)", fontSize: "13px", color: "var(--text-muted)", lineHeight: 2 }}>
  Languages:<br />
  Swedish — fluent<br />
  English — fluent<br />
  Farsi — native
</p>
            </div>
            <div className="about-image" style={{ marginTop: "60px" }}>
              {siteData.about.image ? (
                <img src={siteData.about.image} alt={siteData.name} />
              ) : (
                <div
                  className="image-placeholder"
                  style={{ aspectRatio: "3/4", height: "auto" }}
                >
                  your photo here
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="about-details-grid">
          <div className="about-detail-block">
            <h4>core skills</h4>
            <ul>
              {siteData.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
          <div className="about-detail-block">
            <h4>education & experience</h4>
            <ul>
              <li>Backend & Cloud Development</li>
              <li>NBI/Handelsakademin — 2025–present</li>
              <li></li>
              <li>Previous Experience</li>
              <li>Shift Leader, Max Burgers — 2021–2026</li>
              <li>Support Worker, Nytida — 2018–2021</li>
            </ul>
          </div>
          <div className="about-detail-block">
            <h4>contact</h4>
            <ul>
              <li>
                <a
                  href={`mailto:${siteData.email}`}
                  style={{ color: "inherit", borderBottom: "1px solid var(--border)" }}
                >
                  {siteData.email}
                </a>
              </li>
              {Object.entries(siteData.social).map(([platform, url]) => (
                <li key={platform}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "inherit" }}
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
