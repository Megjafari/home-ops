import { siteData } from "../data";
import ProjectItem from "../components/ProjectItem";

export default function Projects() {
  return (
    <main className="projects-page page-enter">
      <div className="container">
        <h1 className="page-title">projects</h1>
        {siteData.projects.map((project, i) => (
          <ProjectItem key={project.id} project={project} index={i} />
        ))}
      </div>
    </main>
  );
}
