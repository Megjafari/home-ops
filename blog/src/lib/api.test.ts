import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, UNAUTHORIZED_EVENT, apiFetch } from "./api";

function mockFetch(status: number, body: string) {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body, { status })));
}

describe("apiFetch", () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it("returns parsed JSON on success", async () => {
    mockFetch(200, JSON.stringify({ ok: true }));
    expect(await apiFetch("/api/x")).toEqual({ ok: true });
  });

  it("returns null for 204", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 204 })));
    expect(await apiFetch("/api/x", { method: "DELETE" })).toBeNull();
  });

  it("sends the bearer token when logged in", async () => {
    sessionStorage.setItem("token", "abc");
    mockFetch(200, "{}");
    await apiFetch("/api/x");
    const headers = vi.mocked(fetch).mock.calls[0][1]!.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer abc");
  });

  it("uses the plain-text message for conflicts", async () => {
    mockFetch(409, JSON.stringify("A post with slug 'x' already exists."));
    await expect(apiFetch("/api/x")).rejects.toMatchObject({
      status: 409,
      message: "A post with slug 'x' already exists.",
    });
  });

  it("joins validation errors from problem details", async () => {
    mockFetch(400, JSON.stringify({ errors: { Title: ["Title is required."], Slug: ["Bad slug."] } }));
    await expect(apiFetch("/api/x")).rejects.toThrow("Title is required. Bad slug.");
  });

  it("emits an unauthorized event for 401 when a token was sent", async () => {
    sessionStorage.setItem("token", "expired");
    mockFetch(401, "");
    const handler = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, handler);

    await expect(apiFetch("/api/x")).rejects.toBeInstanceOf(ApiError);
    expect(handler).toHaveBeenCalledOnce();

    window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  });

  it("does not emit the event for 401 without a token (e.g. failed login)", async () => {
    mockFetch(401, "");
    const handler = vi.fn();
    window.addEventListener(UNAUTHORIZED_EVENT, handler);

    await expect(apiFetch("/api/x")).rejects.toBeInstanceOf(ApiError);
    expect(handler).not.toHaveBeenCalled();

    window.removeEventListener(UNAUTHORIZED_EVENT, handler);
  });
});
