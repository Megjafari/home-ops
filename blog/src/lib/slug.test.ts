import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases, trims and joins words with hyphens", () => {
    expect(slugify("  My First Post ")).toBe("my-first-post");
  });

  it("drops characters the API slug pattern does not allow", () => {
    expect(slugify("Kubernetes: 5 tips!")).toBe("kubernetes-5-tips");
  });
});
