export const NAME = "Meghdad Jafari";

// SF Pro on Apple devices (through -apple-system), Inter everywhere else.
export const SYS =
  '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter Variable", system-ui, "Segoe UI", sans-serif';
export const NAME_WEIGHT = 300;
export const nameFont = (px) => `${NAME_WEIGHT} ${px}px ${SYS}`;

export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
export const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
