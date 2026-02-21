import { siteData } from "../data";

export default function Contact() {
  return (
    <main className="contact-page page-enter">
      <div className="container">
        <p className="section-label">.say hello</p>
        <h1 className="contact-title">let's<br />connect</h1>
        <p className="contact-sub">
        I’m currently studying Backend & Cloud Development and seeking an internship (LIA) for Autumn 2026. I’m eager to contribute to real development projects, learn from experienced teams, and continue growing as a backend developer.
        </p>
        <a href={`mailto:${siteData.email}`} className="contact-email">
          {siteData.email}
        </a>
        <div className="social-links">
          {Object.entries(siteData.social).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              {platform} ↗
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
