import { ArchitectureVisual, FlowVisual, CodeVisual } from "./ProjectVisuals";

function ProjectVisual({ project }) {
  const style = {
    width: "100%",
    height: "100%",
    minHeight: "320px",
    background: "#0d0d0d",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    overflow: "hidden",
  };

  if (project.image) {
    return (
      <div style={style}>
        <img src={project.image} alt={project.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }

  if (project.visual === "architecture" && project.arch) {
    return <div style={style}><ArchitectureVisual data={project.arch} /></div>;
  }

  if (project.visual === "flow" && project.flow) {
    return <div style={style}><FlowVisual data={project.flow} /></div>;
  }

  if (project.visual === "code" && project.snippet) {
    return <div style={style}><CodeVisual snippet={project.snippet} /></div>;
  }

  return <div style={style} className="image-placeholder">{project.title}</div>;
}

export default function ProjectItem({ project, index }) {
  return (
    <a
      href={project.link}
      className="project-item"
      target={project.link !== "#" ? "_blank" : undefined}
      rel="noreferrer"
      style={{ animationDelay: `${index * 0.1}s`, textDecoration: "none" }}
    >
      <div className="project-info">
        <div className="project-meta">
          <span className="project-year">{project.year}</span>
          <span className="project-year">—</span>
          <span className="project-category">{project.category}</span>
        </div>
        <h2 className="project-title">{project.title}</h2>
        <p style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 300, marginBottom: "20px", lineHeight: 1.6 }}>
          {project.description}
        </p>
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project-tag">{tag}</span>
          ))}
        </div>
        <div className="project-link-row desktop-only" style={{ marginTop: "24px" }}>
          <span>view on github</span>
          <span className="project-arrow">↗</span>
        </div>
      </div>
      <div className="project-image" style={{ overflow: "visible", background: "transparent", borderRadius: 0 }}>
        <ProjectVisual project={project} />
      </div>
              <div className="project-link-row mobile-only" style={{ marginTop: "16px" }}>
          <span>view on github</span>
          <span className="project-arrow">↗</span>
        </div>
    </a>
  );
}
