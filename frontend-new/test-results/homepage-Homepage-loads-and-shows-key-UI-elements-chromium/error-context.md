# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepage.spec.ts >> Homepage >> loads and shows key UI elements
- Location: e2e/homepage.spec.ts:9:7

# Error details

```
Error: expect(page).toHaveTitle(expected) failed

Expected pattern: /Times of Namibia/
Received string:  "Namibia's Digital Broadsheet — Applied AI. Built in Africa."
Timeout: 5000ms

Call log:
  - Expect "toHaveTitle" with timeout 5000ms
    14 × unexpected value "Namibia's Digital Broadsheet — Applied AI. Built in Africa."

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- banner:
  - link "Times of Namibia Unbiased News. Global Reach.":
    - /url: /
  - navigation:
    - link "News":
      - /url: /section/national
    - link "Business":
      - /url: /section/economy
    - link "Opinion":
      - /url: /section/opinion
    - link "Sport":
      - /url: /section/sport
    - link "Tech":
      - /url: /section/technology
  - button "Search"
  - button "Menu"
- navigation:
  - link "National":
    - /url: /section/national
  - link "Politics":
    - /url: /section/politics
  - link "Economy":
    - /url: /section/economy
  - link "Mining":
    - /url: /section/mining
  - link "Energy":
    - /url: /section/energy
  - link "Sport":
    - /url: /section/sport
  - link "Technology":
    - /url: /section/technology
  - link "Africa":
    - /url: /section/africa
  - link "World":
    - /url: /section/world
  - link "Environment":
    - /url: /section/environment
  - link "Health":
    - /url: /section/health
  - link "Opinion":
    - /url: /section/opinion
  - link "Contribute":
    - /url: /contribute
- main:
  - text: Live
  - link "Ethiopian PM’s party secures landslide win in national election▸":
    - /url: /article/ethiopian-pms-party-secures-landslide-win-in-national-election
  - link "Drone show in Matosinhos breaks Guinness record▸":
    - /url: /article/drone-show-in-matosinhos-breaks-guinness-record
  - link "Latest news bulletin | June 21st, 2026 – Evening▸":
    - /url: /article/latest-news-bulletin-june-21st-2026-evening
  - link "Trump threatens to hit Iran again and take over Strait of Hormuz▸":
    - /url: /article/trump-threatens-to-hit-iran-again-and-take-over-strait-of-hormuz
  - link "Europe hits 40ºC as heatwave threatens tourism industry, wildlife▸":
    - /url: /article/europe-hits-40c-as-heatwave-threatens-tourism-industry-wildlife
  - link "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area▸":
    - /url: /article/fish-river-canyon-hike-closed-due-to-heavy-rainfall-in-the-naute-dam-catchment-a
  - link "A Spectacular Finish to the Ulaanbaatar Grand Slam▸":
    - /url: /article/a-spectacular-finish-to-the-ulaanbaatar-grand-slam
  - 'link "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps▸"':
    - /url: /article/red-hawk-rising-how-the-z-20-family-is-plugging-chinas-chronic-defence-gaps
  - link "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry▸":
    - /url: /article/negotiators-at-iran-us-talks-form-working-groups-on-final-peace-deal-qatari-mini
  - link "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media▸":
    - /url: /article/iranian-source-says-strait-of-hormuz-wont-reopen-as-long-as-ceasefire-in-lebanon
  - link "Hong Kong father, son arrested after parking ticket thrown at traffic wardens▸":
    - /url: /article/hong-kong-father-son-arrested-after-parking-ticket-thrown-at-traffic-wardens
  - link "Bolivian lawmakers approve state of emergency as protests choke supply chain▸":
    - /url: /article/bolivian-lawmakers-approve-state-of-emergency-as-protests-choke-supply-chain
  - link "Starmer reflecting on 'political realities' amid reports of imminent resignation▸":
    - /url: /article/starmer-reflecting-on-political-realities-amid-reports-of-imminent-resignation
  - link "Iran start talks at Buergenstock resort in Switzerland▸":
    - /url: /article/iran-start-talks-at-buergenstock-resort-in-switzerland
  - link "These Gulf carriers are offering insurance to entice customers back to the Middle East▸":
    - /url: /article/these-gulf-carriers-are-offering-insurance-to-entice-customers-back-to-the-middl
  - link "Ethiopian PM’s party secures landslide win in national election▸":
    - /url: /article/ethiopian-pms-party-secures-landslide-win-in-national-election
  - link "Drone show in Matosinhos breaks Guinness record▸":
    - /url: /article/drone-show-in-matosinhos-breaks-guinness-record
  - link "Latest news bulletin | June 21st, 2026 – Evening▸":
    - /url: /article/latest-news-bulletin-june-21st-2026-evening
  - link "Trump threatens to hit Iran again and take over Strait of Hormuz▸":
    - /url: /article/trump-threatens-to-hit-iran-again-and-take-over-strait-of-hormuz
  - link "Europe hits 40ºC as heatwave threatens tourism industry, wildlife▸":
    - /url: /article/europe-hits-40c-as-heatwave-threatens-tourism-industry-wildlife
  - link "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area▸":
    - /url: /article/fish-river-canyon-hike-closed-due-to-heavy-rainfall-in-the-naute-dam-catchment-a
  - link "A Spectacular Finish to the Ulaanbaatar Grand Slam▸":
    - /url: /article/a-spectacular-finish-to-the-ulaanbaatar-grand-slam
  - 'link "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps▸"':
    - /url: /article/red-hawk-rising-how-the-z-20-family-is-plugging-chinas-chronic-defence-gaps
  - link "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry▸":
    - /url: /article/negotiators-at-iran-us-talks-form-working-groups-on-final-peace-deal-qatari-mini
  - link "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media▸":
    - /url: /article/iranian-source-says-strait-of-hormuz-wont-reopen-as-long-as-ceasefire-in-lebanon
  - link "Hong Kong father, son arrested after parking ticket thrown at traffic wardens▸":
    - /url: /article/hong-kong-father-son-arrested-after-parking-ticket-thrown-at-traffic-wardens
  - link "Bolivian lawmakers approve state of emergency as protests choke supply chain▸":
    - /url: /article/bolivian-lawmakers-approve-state-of-emergency-as-protests-choke-supply-chain
  - link "Starmer reflecting on 'political realities' amid reports of imminent resignation▸":
    - /url: /article/starmer-reflecting-on-political-realities-amid-reports-of-imminent-resignation
  - link "Iran start talks at Buergenstock resort in Switzerland▸":
    - /url: /article/iran-start-talks-at-buergenstock-resort-in-switzerland
  - link "These Gulf carriers are offering insurance to entice customers back to the Middle East▸":
    - /url: /article/these-gulf-carriers-are-offering-insurance-to-entice-customers-back-to-the-middl
  - img "Ethiopian PM’s party secures landslide win in national election"
  - text: world
  - heading "Ethiopian PM’s party secures landslide win in national election" [level=2]:
    - link "Ethiopian PM’s party secures landslide win in national election":
      - /url: /article/ethiopian-pms-party-secures-landslide-win-in-national-election
  - paragraph: Ethiopian Prime Minister Abiy Ahmed’s Prosperity Party (PP) won a landslide victory in legislative polls held June 1, the election commission said on Sunday, giving it almost 90 per cent of the seats. Abiy has led Ethiopia since 2018, and is increasingly criticised for growing authoritarianism, in...
  - text: South China Morning Post 31m ago
  - button "Previous slide"
  - button "Next slide"
  - button "Go to slide 1"
  - button "Go to slide 2"
  - button "Go to slide 3"
  - button "Go to slide 4"
  - button "Go to slide 5"
  - text: USD/NAD 18.42 EUR/NAD 19.87 ZAR/NAD 1.00 GBP/NAD 23.34 Gold (oz) USD 2,041 Bitcoin USD 67,234
  - heading "Latest News" [level=2]
  - text: Live
  - link "Europe hits 40ºC as heatwave threatens tourism industry, wildlife world Europe hits 40ºC as heatwave threatens tourism industry, wildlife A severe ⁠heatwave gripped much of Europe on Sunday, with temperatures nearing 40 degrees Celsius (104 degrees Fahrenheit), prompting nationwide warnings, transport disruption and signs of strain on wildlife and at tourist hotspots. The heat surge on June 21, the summer solstice in the northern... South China Morning Post 2h ago":
    - /url: /article/europe-hits-40c-as-heatwave-threatens-tourism-industry-wildlife
    - img "Europe hits 40ºC as heatwave threatens tourism industry, wildlife"
    - text: world
    - heading "Europe hits 40ºC as heatwave threatens tourism industry, wildlife" [level=3]
    - paragraph: A severe ⁠heatwave gripped much of Europe on Sunday, with temperatures nearing 40 degrees Celsius (104 degrees Fahrenheit), prompting nationwide warnings, transport disruption and signs of strain on wildlife and at tourist hotspots. The heat surge on June 21, the summer solstice in the northern...
    - text: South China Morning Post 2h ago
  - link "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area environment Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area Staff Reporter THE Namibia Wildlife Resorts (NWR) has announced the temporary closure of the Fish River Canyon Hike. NWR explained that the closure is due to heavy rainfall recorded in the Naute Dam catchment area and the opening of the Naute Dam sluice gates, which may pose a risk to the safety of... Informanté 2h ago":
    - /url: /article/fish-river-canyon-hike-closed-due-to-heavy-rainfall-in-the-naute-dam-catchment-a
    - img "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area"
    - text: environment
    - heading "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area" [level=3]
    - paragraph: Staff Reporter THE Namibia Wildlife Resorts (NWR) has announced the temporary closure of the Fish River Canyon Hike. NWR explained that the closure is due to heavy rainfall recorded in the Naute Dam catchment area and the opening of the Naute Dam sluice gates, which may pose a risk to the safety of...
    - text: Informanté 2h ago
  - link "A Spectacular Finish to the Ulaanbaatar Grand Slam world A Spectacular Finish to the Ulaanbaatar Grand Slam The Ulaanbaatar Grand Slam concluded with outstanding performances from the world’s top judoka. MURAO Sanshiro claimed a ninth Grand Slam title, LYTVYNENKO Yelyzaveta triumphed in -78kg, while PIRELLI Gennaro, ARAI Mao and KIM Minjong secured gold on a thrilling final day in Mongolia. Euronews 2h ago":
    - /url: /article/a-spectacular-finish-to-the-ulaanbaatar-grand-slam
    - img "A Spectacular Finish to the Ulaanbaatar Grand Slam"
    - text: world
    - heading "A Spectacular Finish to the Ulaanbaatar Grand Slam" [level=3]
    - paragraph: The Ulaanbaatar Grand Slam concluded with outstanding performances from the world’s top judoka. MURAO Sanshiro claimed a ninth Grand Slam title, LYTVYNENKO Yelyzaveta triumphed in -78kg, while PIRELLI Gennaro, ARAI Mao and KIM Minjong secured gold on a thrilling final day in Mongolia.
    - text: Euronews 2h ago
  - 'link "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps world Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps Telling a Harbin Z-20 and a Sikorsky UH-60 “Black Hawk” apart can be challenging – the two helicopters look almost identical and their dimensions are very similar. The striking resemblance underscores China’s decades-long effort to close the technological gap with the United States and Russia in... South China Morning Post 2h ago"':
    - /url: /article/red-hawk-rising-how-the-z-20-family-is-plugging-chinas-chronic-defence-gaps
    - 'img "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps"'
    - text: world
    - 'heading "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps" [level=3]'
    - paragraph: Telling a Harbin Z-20 and a Sikorsky UH-60 “Black Hawk” apart can be challenging – the two helicopters look almost identical and their dimensions are very similar. The striking resemblance underscores China’s decades-long effort to close the technological gap with the United States and Russia in...
    - text: South China Morning Post 2h ago
  - link "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry environment Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry DOHA, June 21– Qatari Foreign Ministry spokesperson Majed Al-Ansari said on Sunday that the parties… Namibia Daily News 2h ago":
    - /url: /article/negotiators-at-iran-us-talks-form-working-groups-on-final-peace-deal-qatari-mini
    - img "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry"
    - text: environment
    - heading "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry" [level=3]
    - paragraph: DOHA, June 21– Qatari Foreign Ministry spokesperson Majed Al-Ansari said on Sunday that the parties…
    - text: Namibia Daily News 2h ago
  - link "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media politics Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media TEHRAN, June 21– Iran will not reopen the Strait of Hormuz if the war in… Namibia Daily News 2h ago":
    - /url: /article/iranian-source-says-strait-of-hormuz-wont-reopen-as-long-as-ceasefire-in-lebanon
    - img "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media"
    - text: politics
    - heading "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media" [level=3]
    - paragraph: TEHRAN, June 21– Iran will not reopen the Strait of Hormuz if the war in…
    - text: Namibia Daily News 2h ago
  - link "View All News":
    - /url: /section/national
  - heading "Most Read" [level=3]
  - link "1 Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry Namibia Daily News • 2h ago":
    - /url: /article/negotiators-at-iran-us-talks-form-working-groups-on-final-peace-deal-qatari-mini
    - text: "1"
    - heading "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry" [level=4]
    - text: Namibia Daily News • 2h ago
  - link "2 Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media Namibia Daily News • 2h ago":
    - /url: /article/iranian-source-says-strait-of-hormuz-wont-reopen-as-long-as-ceasefire-in-lebanon
    - text: "2"
    - heading "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media" [level=4]
    - text: Namibia Daily News • 2h ago
  - link "3 Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area Informanté • 2h ago":
    - /url: /article/fish-river-canyon-hike-closed-due-to-heavy-rainfall-in-the-naute-dam-catchment-a
    - text: "3"
    - heading "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area" [level=4]
    - text: Informanté • 2h ago
  - link "4 A Spectacular Finish to the Ulaanbaatar Grand Slam Euronews • 2h ago":
    - /url: /article/a-spectacular-finish-to-the-ulaanbaatar-grand-slam
    - text: "4"
    - heading "A Spectacular Finish to the Ulaanbaatar Grand Slam" [level=4]
    - text: Euronews • 2h ago
  - link "5 Trump threatens to hit Iran again and take over Strait of Hormuz Namibia Daily News • 1h ago":
    - /url: /article/trump-threatens-to-hit-iran-again-and-take-over-strait-of-hormuz
    - text: "5"
    - heading "Trump threatens to hit Iran again and take over Strait of Hormuz" [level=4]
    - text: Namibia Daily News • 1h ago
  - heading "Latest Updates" [level=3]
  - heading "Jobs" [level=3]
  - link "All →":
    - /url: /jobs
  - heading "Renewable Energy Project Manager" [level=4]:
    - link "Renewable Energy Project Manager":
      - /url: https://hyiron.com/careers
  - paragraph: HyIron • Lüderitz
  - paragraph: NAD 70,000 - 95,000/month
  - heading "Data Journalist" [level=4]:
    - link "Data Journalist":
      - /url: https://timesofnamibia.com/careers
  - paragraph: Times of Namibia • Windhoek
  - paragraph: NAD 45,000 - 60,000/month
  - heading "Senior Full-Stack Engineer" [level=4]:
    - link "Senior Full-Stack Engineer":
      - /url: https://tangison.com/careers
  - paragraph: TANGISON • Windhoek
  - paragraph: NAD 85,000 - 120,000/month
  - heading "Tenders" [level=3]
  - link "All →":
    - /url: /tender
  - heading "Supply and Installation of Broadband Infrastructure for Rural Schools" [level=4]
  - paragraph: Ministry of Information and Communication Technology
  - paragraph: "Deadline: 20 Jul 2026"
  - heading "Construction of B1 Corridor Dual Carriageway — Phase 2" [level=4]
  - paragraph: Roads Authority of Namibia
  - paragraph: "Deadline: 4 Aug 2026"
  - heading "Know Namibia?" [level=3]
  - paragraph: Share your knowledge of places, culture, and history. Contribute to the Namibia Guide.
  - link "Submit a Story":
    - /url: /contribute
- contentinfo:
  - img "Times of Namibia"
  - text: Times of Namibia Est. 2026 • Windhoek
  - navigation:
    - link "About":
      - /url: /about
    - link "Contact":
      - /url: /contact
    - link "Ethics":
      - /url: /editorial-standards
    - link "Privacy":
      - /url: /privacy
    - link "Terms":
      - /url: /terms
    - link "TANGISON":
      - /url: /tangison
  - text: Powered by TANGISON Applied AI © 2026 Times of Namibia. All rights reserved.
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | /**
  4  |  * E2E tests for the Times of Namibia homepage.
  5  |  * Runs against the live production URL.
  6  |  */
  7  | 
  8  | test.describe("Homepage", () => {
  9  |   test("loads and shows key UI elements", async ({ page }) => {
  10 |     await page.goto("/");
  11 |     
  12 |     // Page title
> 13 |     await expect(page).toHaveTitle(/Times of Namibia/);
     |                        ^ Error: expect(page).toHaveTitle(expected) failed
  14 | 
  15 |     // Masthead wordmark
  16 |     const masthead = page.locator("text=Times of Namibia").first();
  17 |     await expect(masthead).toBeVisible();
  18 | 
  19 |     // Breaking ticker (Live badge)
  20 |     const liveBadge = page.locator("text=Live").first();
  21 |     await expect(liveBadge).toBeVisible({ timeout: 10000 });
  22 | 
  23 |     // Category nav
  24 |     await expect(page.locator("text=Politics").first()).toBeVisible();
  25 |     await expect(page.locator("text=Economy").first()).toBeVisible();
  26 |     await expect(page.locator("text=Sport").first()).toBeVisible();
  27 | 
  28 |     // Most Read or Latest News section
  29 |     const mostRead = page.locator("text=Most Read");
  30 |     const latestNews = page.locator("text=Latest News");
  31 |     await expect(mostRead.or(latestNews)).toBeVisible({ timeout: 10000 });
  32 | 
  33 |     // Footer
  34 |     await expect(page.locator("text=Powered by TANGISON")).toBeVisible({ timeout: 10000 });
  35 |   });
  36 | 
  37 |   test("has no Loading... text", async ({ page }) => {
  38 |     await page.goto("/");
  39 |     const body = await page.textContent("body");
  40 |     expect(body).not.toContain("Loading...");
  41 |   });
  42 | 
  43 |   test("has no CDATA markers in visible text", async ({ page }) => {
  44 |     await page.goto("/");
  45 |     const body = await page.textContent("body");
  46 |     expect(body).not.toContain("CDATA");
  47 |   });
  48 | 
  49 |   test("canonical URL is correct", async ({ page }) => {
  50 |     await page.goto("/");
  51 |     const canonical = await page.getAttribute('link[rel="canonical"]', "href");
  52 |     expect(canonical).toContain("timesofnamibia47.vercel.app");
  53 |   });
  54 | 
  55 |   test("article links are clickable", async ({ page }) => {
  56 |     await page.goto("/");
  57 |     // Wait for content to load
  58 |     await page.waitForTimeout(3000);
  59 |     // Find article links
  60 |     const articleLinks = page.locator('a[href*="/article/"]');
  61 |     const count = await articleLinks.count();
  62 |     expect(count).toBeGreaterThan(0);
  63 |   });
  64 | });
  65 | 
```