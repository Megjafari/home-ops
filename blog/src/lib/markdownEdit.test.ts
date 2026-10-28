import { describe, expect, it } from "vitest";
import { insertBlock, prefixLines, wrapSelection } from "./markdownEdit";

describe("wrapSelection", () => {
  it("wraps the selected text and keeps it selected", () => {
    const edit = wrapSelection("make this bold", 5, 9, "**");

    expect(edit.value).toBe("make **this** bold");
    expect(edit.value.slice(edit.selStart, edit.selEnd)).toBe("this");
  });

  it("inserts a placeholder when nothing is selected", () => {
    const edit = wrapSelection("", 0, 0, "[", "](https://)", "link text");

    expect(edit.value).toBe("[link text](https://)");
    expect(edit.value.slice(edit.selStart, edit.selEnd)).toBe("link text");
  });
});

describe("prefixLines", () => {
  it("prefixes every selected line", () => {
    const edit = prefixLines("one\ntwo\nthree", 0, 7, "- ");

    expect(edit.value).toBe("- one\n- two\nthree");
  });

  it("removes the prefix when all lines already have it", () => {
    const edit = prefixLines("- one\n- two", 0, 11, "- ");

    expect(edit.value).toBe("one\ntwo");
  });

  it("works on the line containing the caret", () => {
    const edit = prefixLines("first\nsecond", 8, 8, "## ");

    expect(edit.value).toBe("first\n## second");
  });
});

describe("insertBlock", () => {
  it("puts the block on its own paragraph between texts", () => {
    const edit = insertBlock("Before after", 7, 7, "![img](u)");

    expect(edit.value).toBe("Before \n\n![img](u)\n\nafter");
  });

  it("does not add extra blank lines when they already exist", () => {
    const edit = insertBlock("One\n\n\n\nTwo", 5, 5, "![img](u)");

    expect(edit.value).toBe("One\n\n![img](u)\n\nTwo");
  });

  it("works in an empty document", () => {
    const edit = insertBlock("", 0, 0, "![img](u)");

    expect(edit.value).toBe("![img](u)\n");
    expect(edit.selStart).toBe(9);
  });

  it("can place the caret inside the block", () => {
    const edit = insertBlock("", 0, 0, "```\n\n```", 4);

    expect(edit.selStart).toBe(4);
  });
});
