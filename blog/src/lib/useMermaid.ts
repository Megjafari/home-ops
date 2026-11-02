import { useEffect, type RefObject } from "react";

/**
 * Draws Mermaid diagrams inside rendered post HTML. The Mermaid library is large,
 * so it is only loaded when the HTML actually contains a diagram.
 */
export function useMermaid(ref: RefObject<HTMLElement | null>, html: string) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !root.querySelector(".mermaid-diagram")) return;

    let cancelled = false;
    import("./mermaid").then((m) => {
      if (!cancelled) void m.renderDiagrams(root);
    });
    return () => {
      cancelled = true;
    };
  }, [ref, html]);
}
