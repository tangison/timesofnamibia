import { test, expect } from "@playwright/test";

/**
 * E2E tests for the Times of Namibia homepage.
 * Runs against the live production URL.
 */

test.describe("Homepage", () => {
  test("loads and shows key UI elements", async ({ page }) => {
    await page.goto("/");
    
    // Page title
    await expect(page).toHaveTitle(/Times of Namibia/);

    // Masthead wordmark
    const masthead = page.locator("text=Times of Namibia").first();
    await expect(masthead).toBeVisible();

    // Breaking ticker (Live badge)
    const liveBadge = page.locator("text=Live").first();
    await expect(liveBadge).toBeVisible({ timeout: 10000 });

    // Category nav
    await expect(page.locator("text=Politics").first()).toBeVisible();
    await expect(page.locator("text=Economy").first()).toBeVisible();
    await expect(page.locator("text=Sport").first()).toBeVisible();

    // Most Read or Latest News section
    const mostRead = page.locator("text=Most Read");
    const latestNews = page.locator("text=Latest News");
    await expect(mostRead.or(latestNews)).toBeVisible({ timeout: 10000 });

    // Footer
    await expect(page.locator("text=Powered by TANGISON")).toBeVisible({ timeout: 10000 });
  });

  test("has no Loading... text", async ({ page }) => {
    await page.goto("/");
    const body = await page.textContent("body");
    expect(body).not.toContain("Loading...");
  });

  test("has no CDATA markers in visible text", async ({ page }) => {
    await page.goto("/");
    const body = await page.textContent("body");
    expect(body).not.toContain("CDATA");
  });

  test("canonical URL is correct", async ({ page }) => {
    await page.goto("/");
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical).toContain("timesofnamibia47.vercel.app");
  });

  test("article links are clickable", async ({ page }) => {
    await page.goto("/");
    // Wait for content to load
    await page.waitForTimeout(3000);
    // Find article links
    const articleLinks = page.locator('a[href*="/article/"]');
    const count = await articleLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});
