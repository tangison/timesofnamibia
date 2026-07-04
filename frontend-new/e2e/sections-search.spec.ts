import { test, expect } from "@playwright/test";

/**
 * E2E tests for section pages and search.
 */

test.describe("Section Pages", () => {
  test("national section loads", async ({ page }) => {
    await page.goto("/section/national");
    await expect(page).toHaveTitle(/National News/);
    // Wait for content
    await page.waitForTimeout(3000);
    // Should have articles or a "Coming Soon" message
    const content = await page.textContent("body");
    expect(content).toBeTruthy();
  });

  test("economy section loads", async ({ page }) => {
    await page.goto("/section/economy");
    await expect(page).toHaveTitle(/Economy/);
  });

  test("politics section loads", async ({ page }) => {
    await page.goto("/section/politics");
    await expect(page).toHaveTitle(/Politics/);
  });

  test("world section loads", async ({ page }) => {
    await page.goto("/section/world");
    await expect(page).toHaveTitle(/World/);
  });
});

test.describe("Search", () => {
  test("search API returns results", async ({ request }) => {
    const res = await request.get("/api/search?q=namibia&limit=5");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.articles).toBeDefined();
  });
});

test.describe("Stats", () => {
  test("stats API returns data", async ({ request }) => {
    const res = await request.get("/api/stats");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.stats).toBeDefined();
    expect(body.stats.total).toBeGreaterThan(0);
  });
});

test.describe("Feed", () => {
  test("RSS feed returns XML", async ({ request }) => {
    const res = await request.get("/feed.xml");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<rss");
    expect(text).toContain("<item>");
  });

  test("sitemap returns XML", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text).toContain("<urlset");
    expect(text).toContain("<loc>");
  });
});
