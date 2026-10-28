export interface Edit {
  value: string;
  selStart: number;
  selEnd: number;
}

/** Wraps the selection (or a placeholder) in `before`/`after` and selects the wrapped text. */
export function wrapSelection(
  value: string,
  start: number,
  end: number,
  before: string,
  after = before,
  placeholder = ""
): Edit {
  const selected = value.slice(start, end) || placeholder;
  const next = value.slice(0, start) + before + selected + after + value.slice(end);
  return {
    value: next,
    selStart: start + before.length,
    selEnd: start + before.length + selected.length,
  };
}

/** Adds `prefix` to every line touched by the selection, or removes it if all lines already have it. */
export function prefixLines(value: string, start: number, end: number, prefix: string): Edit {
  const lineStart = value.lastIndexOf("\n", start - 1) + 1;
  const newline = value.indexOf("\n", end);
  const lineEnd = newline === -1 ? value.length : newline;

  const lines = value.slice(lineStart, lineEnd).split("\n");
  const allPrefixed = lines.every((line) => line.startsWith(prefix));
  const changed = lines
    .map((line) => (allPrefixed ? line.slice(prefix.length) : prefix + line))
    .join("\n");

  return {
    value: value.slice(0, lineStart) + changed + value.slice(lineEnd),
    selStart: lineStart,
    selEnd: lineStart + changed.length,
  };
}

/**
 * Inserts `block` on its own paragraph (blank line before and after), so an
 * image or code block ends up between texts instead of inside a sentence.
 * The caret lands `caretOffset` characters into the block (default: after it).
 */
export function insertBlock(
  value: string,
  start: number,
  end: number,
  block: string,
  caretOffset = block.length
): Edit {
  const before = value.slice(0, start);
  const after = value.slice(end);

  const lead = before === "" || before.endsWith("\n\n") ? "" : before.endsWith("\n") ? "\n" : "\n\n";
  const trail = after === "" ? "\n" : after.startsWith("\n\n") ? "" : after.startsWith("\n") ? "\n" : "\n\n";

  const blockStart = before.length + lead.length;
  const caret = blockStart + caretOffset;
  return {
    value: before + lead + block + trail + after,
    selStart: caret,
    selEnd: caret,
  };
}
