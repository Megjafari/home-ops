import { describe, expect, it } from "vitest";
import { wasUpdatedAfterPublish } from "./dates";

describe("wasUpdatedAfterPublish", () => {
  it("is true when edited on a later day", () => {
    expect(wasUpdatedAfterPublish("2026-10-28T12:00:00", "2026-11-03T09:00:00")).toBe(true);
  });

  it("is false when edited on the same day as publishing", () => {
    expect(wasUpdatedAfterPublish("2026-10-28T08:00:00", "2026-10-28T20:00:00")).toBe(false);
  });

  it("is false for drafts and missing dates", () => {
    expect(wasUpdatedAfterPublish(null, "2026-11-03T09:00:00")).toBe(false);
    expect(wasUpdatedAfterPublish("2026-10-28T08:00:00", undefined)).toBe(false);
  });
});
