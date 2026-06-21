import { test, expect } from "@playwright/test";

/**
 * E2E tests for article pages.
 */

test.describe("Article Page", () => {
  test.beforeEach(async ({ page }) => {
    // Go to homepage first to find an article
    await page.goto("/");
    await page.waitForTimeout(3000);
    
    // Click the first article link
    const articleLink = page.locator('a[href*="/article/"]').first();
    await articleLink.click();
    await page.waitForLoadState("networkidle");
  });

  test("has H1 headline", async ({ page }) => {
    const h1 = page.locator("h1");
    await expect(h1).toBeVisible({ timeout: 10000 });
    const text = await h1.textContent();
    expect(text?.length).toBeGreaterThan(10);
  });

  test("has Listen (TTS) button", async ({ page }) => {
    const listenBtn = page.locator("text=Listen");
    await expect(listenBtn).toBeVisible({ timeout: 10000 });
  });

  test("has WhatsApp share button", async ({ page }) => {
    const whatsappBtn = page.locator("text=WhatsApp");
    await expect(whatsappBtn).toBeVisible({ timeout: 10000 });
  });

  test("has article content (paragraphs)", async ({ page }) => {
    // Wait for content
    await page.waitForTimeout(2000);
    const paragraphs = page.locator("p");
    const count = await paragraphs.count();
    expect(count).toBeGreaterThan(0);
  });

  test("has no Loading... text", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).not.toContain("Loading...");
  });

  test("has correct canonical URL", async ({ page }) => {
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical).toContain("/article/");
  });
});
