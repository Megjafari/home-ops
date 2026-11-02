import mermaid from "mermaid";

let initialized = false;
let counter = 0;

function init() {
  if (initialized) return;
  mermaid.initialize({
    startOnLoad: false,
    // Labels come from post text, so never allow HTML or scripts in them.
    securityLevel: "strict",
    theme: "base",
    themeVariables: {
      darkMode: true,
      background: "#09090b",
      fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      fontSize: "16px",
      primaryColor: "#18181d",
      primaryTextColor: "#ededef",
      primaryBorderColor: "#3a3a44",
      secondaryColor: "#101014",
      tertiaryColor: "#101014",
      lineColor: "#8e8e98",
      textColor: "#ededef",
      clusterBkg: "#101014",
      clusterBorder: "#2b2b33",
      edgeLabelBackground: "#09090b",
      titleColor: "#ededef",
    },
  });
  initialized = true;
}

/** Draws every not yet drawn `.mermaid-diagram` inside `root` as an SVG. */
export async function renderDiagrams(root: HTMLElement) {
  const figures = root.querySelectorAll<HTMLElement>(".mermaid-diagram:not([data-rendered])");
  if (figures.length === 0) return;
  init();

  for (const figure of figures) {
    const source = figure.querySelector("code")?.textContent ?? "";
    const id = `mermaid-${counter++}`;
    try {
      const { svg } = await mermaid.render(id, source);
      figure.innerHTML = svg;
      figure.dataset.rendered = "true";
      figure.setAttribute("role", "img");
      figure.setAttribute("aria-label", "Diagram");
    } catch (error) {
      // Keep the source visible and say what is wrong, so a typo is easy to find.
      document.getElementById(`d${id}`)?.remove();
      figure.dataset.error = "true";
      const message = document.createElement("p");
      message.className = "mermaid-error";
      const detail = (error as Error).message.replace(/\s+/g, " ").trim().slice(0, 160);
      message.textContent = `Diagram could not be drawn: ${detail}`;
      figure.append(message);
    }
  }
}
