import { describe, expect, it } from "vitest";
import { estimateReadingStats } from "./readingTime";

describe("estimateReadingStats", () => {
  it("counts words and ignores HTML tags", () => {
    const { words } = estimateReadingStats("<p>Hello <strong>big</strong> world</p>");
    expect(words).toBe(3);
  });

  it("never reports less than one minute", () => {
    expect(estimateReadingStats("<p>short</p>").minutes).toBe(1);
  });

  it("estimates about 200 words per minute", () => {
    const html = `<p>${"word ".repeat(600)}</p>`;
    expect(estimateReadingStats(html).minutes).toBe(3);
  });

  it("handles empty content", () => {
    expect(estimateReadingStats("")).toEqual({ words: 0, minutes: 1 });
  });
});
