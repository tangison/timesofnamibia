import { test, expect } from "@playwright/test";

/**
 * E2E tests for the contribution flow.
 */

test.describe("Contribute Page", () => {
  test("loads and shows the contribution form", async ({ page }) => {
    await page.goto("/contribute");
    
    await expect(page).toHaveTitle(/Times of Namibia/);
    await expect(page.locator("text=Contribute to the Namibia Guide")).toBeVisible({ timeout: 10000 });
    await expect(page.locator("text=Your Story")).toBeVisible();
    await expect(page.locator("text=Your Name")).toBeVisible();
    await expect(page.locator("text=Email")).toBeVisible();
  });

  test("shows word count", async ({ page }) => {
    await page.goto("/contribute");
    
    const textarea = page.locator("textarea");
    await textarea.fill("This is a test contribution with more than fifty words. ".repeat(2) +
      "The Namibian landscape is diverse and beautiful, ranging from the Namib Desert to the Caprivi Strip. " +
      "This contribution aims to share knowledge about a specific place in Namibia.");
    
    const wordCount = page.locator("text=words");
    await expect(wordCount).toBeVisible({ timeout: 5000 });
  });

  test("submit button is disabled when form is incomplete", async ({ page }) => {
    await page.goto("/contribute");
    
    const submitBtn = page.locator("text=Submit for Review");
    await expect(submitBtn).toBeDisabled();
  });

  test("validates minimum word count", async ({ page }) => {
    await page.goto("/contribute");
    
    // Fill with too-short content
    await page.locator('input[placeholder*="Title"]').fill("Test Title");
    await page.locator("textarea").fill("Too short.");
    await page.locator('input[placeholder*="Name"]').fill("Test User");
    await page.locator('input[type="email"]').fill("test@example.com");
    
    // Should show "need more" indicator
    await expect(page.locator("text=need")).toBeVisible({ timeout: 5000 });
  });
});
