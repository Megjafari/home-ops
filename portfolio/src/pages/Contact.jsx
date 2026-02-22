import { useState } from "react";
import { siteData } from "../data";

export default function Contact() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.target);
    const res = await fetch("https://formspree.io/f/xqedgzaq", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (res.ok) {
      setStatus("success");
      e.target.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <main className="contact-page page-enter">
      <div className="container">
        <p className="section-label">.say hello</p>
        <h1 className="contact-title">let's work<br />together</h1>
        <p className="contact-sub">
          I'm currently studying Backend & Cloud Development and seeking an internship (LIA) for Autumn 2026. I'm eager to contribute to real development projects, learn from experienced teams, and continue growing as a backend developer. Feel free to reach out below or email me directly.
        </p>
        <a href={`mailto:${siteData.email}`} className="contact-email">
          {siteData.email}
        </a>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "480px" }}>
          <input
            name="name"
            required
            placeholder="Your name"
            style={inputStyle}
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Your email"
            style={inputStyle}
          />
          <textarea
            name="message"
            required
            placeholder="Your message"
            rows={5}
            style={{ ...inputStyle, resize: "vertical" }}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              fontFamily: "var(--mono)", fontSize: "13px",
              color: "var(--bg)", background: "var(--text-primary)",
              border: "none", padding: "14px 28px", borderRadius: "8px",
              cursor: "pointer", opacity: status === "sending" ? 0.6 : 1,
              transition: "opacity 0.2s", alignSelf: "flex-start",
            }}
          >
            {status === "sending" ? "sending..." : "send message →"}
          </button>
          {status === "success" && (
            <p style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "#4ade80" }}>
              Message sent! I'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "#f87171" }}>
              Something went wrong. Try emailing me directly.
            </p>
          )}
        </form>

        <div className="social-links" style={{ marginTop: "48px" }}>
          {Object.entries(siteData.social).map(([platform, url]) => (
            <a key={platform} href={url} target="_blank" rel="noreferrer" className="social-link">
              {platform} ↗
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}

const inputStyle = {
  fontFamily: "var(--mono)",
  fontSize: "13px",
  color: "var(--text-primary)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--border)",
  borderRadius: "8px",
  padding: "12px 16px",
  outline: "none",
  width: "100%",
};

