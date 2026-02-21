// Visual: Layered Architecture Diagram
export function ArchitectureVisual({ data }) {
  const layerColors = [
    { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.3)", dot: "#818cf8" },
    { bg: "rgba(20,184,166,0.10)", border: "rgba(20,184,166,0.25)", dot: "#2dd4bf" },
    { bg: "rgba(251,146,60,0.10)", border: "rgba(251,146,60,0.25)", dot: "#fb923c" },
    { bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)", dot: "#94a3b8" },
  ];

  return (
    <div style={{
      width: "100%", height: "auto", padding: "16px",
      display: "flex", flexDirection: "column", gap: "10px",
      justifyContent: "center", fontFamily: "var(--mono)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
        <span style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>ARCHITECTURE</span>
        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>ASP.NET Core</span>
      </div>

      {/* Layers */}
      {data.layers.map((layer, i) => (
        <div key={layer} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Connector line */}
          {i > 0 && (
            <div style={{
              position: "absolute", display: "none"
            }} />
          )}
          <div style={{
            flex: 1,
            background: layerColors[i].bg,
            border: `1px solid ${layerColors[i].border}`,
            borderRadius: "8px",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            position: "relative",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: layerColors[i].dot, flexShrink: 0,
            }} />
            <span style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 400 }}>
              {layer}
            </span>
          </div>
          {/* Arrow down */}
          {i < data.layers.length - 1 && (
            <div style={{ position: "absolute", right: "50%" }} />
          )}
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />

      {/* Endpoints */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "6px" }}>
        {data.endpoints.map((ep) => {
          const method = ep.split(" ")[0];
          const path = ep.split(" ").slice(1).join(" ");
          const methodColor = {
            GET: "#2dd4bf", POST: "#818cf8",
            PUT: "#fb923c", DELETE: "#f87171",
          }[method] || "#94a3b8";
          return (
            <div key={ep} style={{
              display: "flex", alignItems: "center", gap: "8px",
              background: "rgba(255,255,255,0.03)", borderRadius: "6px",
              padding: "7px 10px", border: "1px solid var(--border)",
            }}>
              <span style={{ fontSize: "10px", color: methodColor, fontWeight: 500, minWidth: "32px" }}>
                {method}
              </span>
              <span style={{ fontSize: "10px", color: "var(--text-secondary)" }}>{path}</span>
            </div>
          );
        })}
      </div>

      {/* Entities */}
      <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
        {data.entities.map((e) => (
          <div key={e} style={{
            fontSize: "10px", color: "var(--text-muted)",
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: "4px", padding: "4px 10px",
          }}>
            {e}
          </div>
        ))}
      </div>
    </div>
  );
}

// Visual: System Flow (Register / Login)
export function FlowVisual({ data }) {
  const steps = data.register;
  return (
    <div style={{
      width: "100%", height: "auto", padding: "16px",
      display: "flex", flexDirection: "column", gap: "16px",
      justifyContent: "center", fontFamily: "var(--mono)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "10px", color: "var(--text-muted)", letterSpacing: "0.1em" }}>SYSTEM FLOW</span>
        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>Auth API</span>
      </div>

      {/* Two flows side by side */}
      {[
        { label: "REGISTER", steps: data.register, color: "#818cf8" },
        { label: "LOGIN", steps: data.login, color: "#2dd4bf" },
      ].map(({ label, steps: flowSteps, color }) => (
        <div key={label}>
          <div style={{ fontSize: "10px", color, marginBottom: "8px", letterSpacing: "0.08em" }}>
            {label}
          </div>
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0" }}>
            {flowSteps.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  fontSize: "10px",
                  color: i === 0 || i === flowSteps.length - 1
                    ? "var(--text-primary)" : "var(--text-secondary)",
                  background: i === flowSteps.length - 1
                    ? `${color}18` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${i === flowSteps.length - 1 ? color + "40" : "var(--border)"}`,
                  borderRadius: "6px",
                  padding: "6px 10px",
                  whiteSpace: "nowrap",
                }}>
                  {step}
                </div>
                {i < flowSteps.length - 1 && (
                  <span style={{
                    fontSize: "10px", color: "var(--text-muted)",
                    padding: "0 4px",
                  }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Divider */}
      <div style={{ height: "1px", background: "var(--border)" }} />

      {/* Key security features */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {["BCrypt Hashing", "JWT Ready", "RESTful", "SQL Persistence"].map((f) => (
          <span key={f} style={{
            fontSize: "10px", color: "var(--text-muted)",
            border: "1px dashed rgba(255,255,255,0.1)",
            borderRadius: "4px", padding: "4px 10px",
          }}>
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

// Visual: Code Snippet
export function CodeVisual({ snippet }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: "#0d0d0d",
      borderRadius: "inherit",
      overflow: "hidden",
      fontFamily: "var(--mono)",
    }}>
      {/* Window bar */}
      <div style={{
        padding: "10px 16px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: "6px",
      }}>
        {["#f87171", "#fb923c", "#4ade80"].map((c) => (
          <span key={c} style={{ width: "8px", height: "8px", borderRadius: "50%", background: c, opacity: 0.7 }} />
        ))}
        <span style={{ fontSize: "10px", color: "var(--text-muted)", marginLeft: "8px" }}>
          {snippet.filename}
        </span>
      </div>
      {/* Code */}
      <div style={{ padding: "20px", overflow: "auto", height: "calc(100% - 37px)" }}>
        <pre style={{
          fontSize: "11px", lineHeight: "1.7",
          color: "var(--text-secondary)", margin: 0,
          whiteSpace: "pre-wrap",
        }}>
          {snippet.lines.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: "16px" }}>
              <span style={{ color: "var(--text-muted)", userSelect: "none", minWidth: "16px", textAlign: "right" }}>
                {i + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: line }} />
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}
