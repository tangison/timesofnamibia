# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contribute.spec.ts >> Contribute Page >> validates minimum word count
- Location: e2e/contribute.spec.ts:37:7

# Error details

```
Test timeout of 15000ms exceeded.
```

```
Error: locator.fill: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('input[placeholder*="Title"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e4]:
    - heading "Contribute to the Namibia Guide" [level=1] [ref=e5]
    - paragraph [ref=e6]: Share your knowledge of Namibian places, culture, and history. All submissions are reviewed by our editorial team before publishing.
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - img [ref=e10]
          - text: Title
        - textbox "e.g. The Hidden Gems of Damaraland" [ref=e13]
      - generic [ref=e14]:
        - generic [ref=e15]:
          - img [ref=e16]
          - text: Your Story (minimum 50 words)
        - textbox "Write your contribution here..." [ref=e19]
        - paragraph [ref=e20]: 0 words (need 50 more)
      - generic [ref=e21]:
        - generic [ref=e22]:
          - generic [ref=e23]:
            - img [ref=e24]
            - text: Region
          - combobox [ref=e27]:
            - option "Select region..." [selected]
            - option "Khomas"
            - option "Erongo"
            - option "Otjozondjupa"
            - option "Kunene"
            - option "Oshana"
            - option "Hardap"
            - option "//Kharas"
            - option "Zambezi"
            - option "Ohangwena"
            - option "Omusati"
            - option "Oshikoto"
            - option "Kavango East"
            - option "Kavango West"
        - generic [ref=e28]:
          - generic [ref=e29]:
            - img [ref=e30]
            - text: Category
          - combobox [ref=e33]:
            - option "Select category..." [selected]
            - option "landscape"
            - option "wildlife"
            - option "coastal"
            - option "culture"
            - option "history"
      - generic [ref=e34]:
        - generic [ref=e35]:
          - generic [ref=e36]:
            - img [ref=e37]
            - text: Your Name
          - textbox [ref=e40]
        - generic [ref=e41]:
          - generic [ref=e42]:
            - img [ref=e43]
            - text: Email (not published)
          - textbox [ref=e46]
      - button "Submit for Review" [disabled] [ref=e47]:
        - img [ref=e48]
        - text: Submit for Review
  - region "Notifications alt+T"
  - alert [ref=e51]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | /**
  4  |  * E2E tests for the contribution flow.
  5  |  */
  6  | 
  7  | test.describe("Contribute Page", () => {
  8  |   test("loads and shows the contribution form", async ({ page }) => {
  9  |     await page.goto("/contribute");
  10 |     
  11 |     await expect(page).toHaveTitle(/Times of Namibia/);
  12 |     await expect(page.locator("text=Contribute to the Namibia Guide")).toBeVisible({ timeout: 10000 });
  13 |     await expect(page.locator("text=Your Story")).toBeVisible();
  14 |     await expect(page.locator("text=Your Name")).toBeVisible();
  15 |     await expect(page.locator("text=Email")).toBeVisible();
  16 |   });
  17 | 
  18 |   test("shows word count", async ({ page }) => {
  19 |     await page.goto("/contribute");
  20 |     
  21 |     const textarea = page.locator("textarea");
  22 |     await textarea.fill("This is a test contribution with more than fifty words. ".repeat(2) +
  23 |       "The Namibian landscape is diverse and beautiful, ranging from the Namib Desert to the Caprivi Strip. " +
  24 |       "This contribution aims to share knowledge about a specific place in Namibia.");
  25 |     
  26 |     const wordCount = page.locator("text=words");
  27 |     await expect(wordCount).toBeVisible({ timeout: 5000 });
  28 |   });
  29 | 
  30 |   test("submit button is disabled when form is incomplete", async ({ page }) => {
  31 |     await page.goto("/contribute");
  32 |     
  33 |     const submitBtn = page.locator("text=Submit for Review");
  34 |     await expect(submitBtn).toBeDisabled();
  35 |   });
  36 | 
  37 |   test("validates minimum word count", async ({ page }) => {
  38 |     await page.goto("/contribute");
  39 |     
  40 |     // Fill with too-short content
> 41 |     await page.locator('input[placeholder*="Title"]').fill("Test Title");
     |                                                       ^ Error: locator.fill: Test timeout of 15000ms exceeded.
  42 |     await page.locator("textarea").fill("Too short.");
  43 |     await page.locator('input[placeholder*="Name"]').fill("Test User");
  44 |     await page.locator('input[type="email"]').fill("test@example.com");
  45 |     
  46 |     // Should show "need more" indicator
  47 |     await expect(page.locator("text=need")).toBeVisible({ timeout: 5000 });
  48 |   });
  49 | });
  50 | 
```