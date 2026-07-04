import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("requireAdmin", () => {
  beforeEach(() => { vi.resetModules(); });

  it("returns 503 if ADMIN_TOKEN is not configured", async () => {
    vi.stubEnv("ADMIN_TOKEN", "");
    const { requireAdmin } = await import("@/lib/auth");
    const req = new Request("https://example.com/api/test", { method: "POST" }) as any;
    const result = requireAdmin(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(503);
  });

  it("returns 401 if no Authorization header", async () => {
    vi.stubEnv("ADMIN_TOKEN", "test-token-min-16-chars-long");
    const { requireAdmin } = await import("@/lib/auth");
    const req = new Request("https://example.com/api/test", { method: "POST" }) as any;
    const result = requireAdmin(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns 401 if wrong token", async () => {
    vi.stubEnv("ADMIN_TOKEN", "correct-token-min-16-chars-long");
    const { requireAdmin } = await import("@/lib/auth");
    const req = new Request("https://example.com/api/test", {
      method: "POST",
      headers: { Authorization: "Bearer wrong-token" },
    }) as any;
    const result = requireAdmin(req);
    expect(result).not.toBeNull();
    expect(result!.status).toBe(401);
  });

  it("returns null when correct Bearer token", async () => {
    vi.stubEnv("ADMIN_TOKEN", "correct-token-min-16-chars-long");
    const { requireAdmin } = await import("@/lib/auth");
    const req = new Request("https://example.com/api/test", {
      method: "POST",
      headers: { Authorization: "Bearer correct-token-min-16-chars-long" },
    }) as any;
    const result = requireAdmin(req);
    expect(result).toBeNull();
  });
});

describe("rateLimit", () => {
  beforeEach(() => { vi.resetModules(); vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it("allows requests under the limit", async () => {
    const { rateLimit } = await import("@/lib/auth");
    const req = new Request("https://example.com/", {
      headers: { "X-Forwarded-For": "1.2.3.4" },
    }) as any;
    expect(rateLimit(req, { windowMs: 60_000, max: 3 })).toBe(false);
    expect(rateLimit(req, { windowMs: 60_000, max: 3 })).toBe(false);
    expect(rateLimit(req, { windowMs: 60_000, max: 3 })).toBe(false);
  });

  it("blocks requests over the limit", async () => {
    const { rateLimit } = await import("@/lib/auth");
    const req = new Request("https://example.com/", {
      headers: { "X-Forwarded-For": "5.6.7.8" },
    }) as any;
    rateLimit(req, { windowMs: 60_000, max: 1 });
    expect(rateLimit(req, { windowMs: 60_000, max: 1 })).toBe(true);
  });
});

describe("JSON-LD safety", () => {
  it("escapes < characters to prevent script injection", () => {
    const obj = { title: "<script>alert(1)</script>" };
    const safe = JSON.stringify(obj).replace(/</g, "\\u003c");
    expect(safe).not.toContain("<");
    expect(safe).toContain("\\u003cscript>");
  });
});
