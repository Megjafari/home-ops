import { motion } from "motion/react";

const sections = [
  { title: "Backend", items: ["C# / .NET", "ASP.NET Core Web API", "REST API Design", "Dependency Injection", "Service Layer Pattern", "Swagger / OpenAPI"] },
  { title: "Data", items: ["SQL & Relational Databases", "Entity Framework Core", "Data Modeling", "JSON Data Handling"] },
  { title: "Frontend (Basic)", items: ["HTML / CSS", "Basic JavaScript", "API Integration (fetch / REST)"] },
  { title: "Tools", items: ["Git & GitHub", "Version Control", "Debugging & Troubleshooting", "Clean Code Principles"] },
];

const techStrip = [
  { name: "C#",           src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg" },
  { name: ".NET",         src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg" },
  { name: "ASP.NET",      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg" },
  { name: "SQL Server",   src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" },
  { name: "Git",          src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name: "GitHub",       src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name: "Azure",        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" },
  { name: "JavaScript",   src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
];

export default function Skills() {
  return (
    <main className="page-enter" style={{ paddingTop: "calc(var(--nav-height) + 80px)", paddingBottom: "100px" }}>
      <div className="container">
        <p className="section-label">.skills</p>
        <h1 className="page-title">skills</h1>

<style>{`
  @keyframes marquee {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .marquee-track {
    animation: marquee 18s linear infinite;
    display: flex;
    width: max-content;
  }
`}</style>

<div style={{
  overflow: "hidden",
  marginBottom: "64px",
  paddingBottom: "32px",
  borderBottom: "1px solid var(--border)",
  WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
  maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
}}>
  <div className="marquee-track">
    {[...techStrip, ...techStrip].map((t, i) => (
      <div key={i} style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: "8px", flexShrink: 0, padding: "0 32px"
      }}>
        <img src={t.src} alt={t.name}
          style={{ width: "36px", height: "36px", opacity: 0.6, filter: "grayscale(100%)" }}
        />
        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-muted)" }}>
          {t.name}
        </span>
      </div>
    ))}
  </div>
</div>

        {/* Skill groups */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "48px" }}>
          {sections.map(s => (
            <div key={s.title}>
              <h4 style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "20px" }}>{s.title}</h4>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                {s.items.map(item => (
                  <li key={item} style={{ fontSize: "15px", color: "var(--text-secondary)", fontWeight: 300 }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}