# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: article.spec.ts >> Article Page >> has Listen (TTS) button
- Location: e2e/article.spec.ts:26:7

# Error details

```
Test timeout of 15000ms exceeded while running "beforeEach" hook.
```

```
Error: locator.click: Test timeout of 15000ms exceeded.
Call log:
  - waiting for locator('a[href*="/article/"]').first()
    - locator resolved to <a href="/article/ethiopian-pms-party-secures-landslide-win-in-national-election" class="font-mono text-xs text-ton-cream/80 hover:text-ton-red transition-colors">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    20 × waiting for element to be visible, enabled and stable
       - element is not stable
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - link "Skip to main content" [ref=e2] [cursor=pointer]:
    - /url: "#main-content"
  - generic [ref=e3]:
    - banner [ref=e5]:
      - link "Times of Namibia Unbiased News. Global Reach." [ref=e6] [cursor=pointer]:
        - /url: /
        - generic [ref=e7]: Times of Namibia
        - generic [ref=e8]: Unbiased News. Global Reach.
      - navigation [ref=e9]:
        - link "News" [ref=e10] [cursor=pointer]:
          - /url: /section/national
        - link "Business" [ref=e11] [cursor=pointer]:
          - /url: /section/economy
        - link "Opinion" [ref=e12] [cursor=pointer]:
          - /url: /section/opinion
        - link "Sport" [ref=e13] [cursor=pointer]:
          - /url: /section/sport
        - link "Tech" [ref=e14] [cursor=pointer]:
          - /url: /section/technology
      - generic [ref=e15]:
        - button "Search" [ref=e16]:
          - img [ref=e17]
        - button "Menu" [ref=e20]:
          - img [ref=e21]
    - navigation [ref=e22]:
      - generic [ref=e24]:
        - generic [ref=e25]:
          - link "National" [ref=e26] [cursor=pointer]:
            - /url: /section/national
          - link "Politics" [ref=e27] [cursor=pointer]:
            - /url: /section/politics
          - link "Economy" [ref=e28] [cursor=pointer]:
            - /url: /section/economy
          - link "Mining" [ref=e29] [cursor=pointer]:
            - /url: /section/mining
          - link "Energy" [ref=e30] [cursor=pointer]:
            - /url: /section/energy
          - link "Sport" [ref=e31] [cursor=pointer]:
            - /url: /section/sport
          - link "Technology" [ref=e32] [cursor=pointer]:
            - /url: /section/technology
          - link "Africa" [ref=e33] [cursor=pointer]:
            - /url: /section/africa
          - link "World" [ref=e34] [cursor=pointer]:
            - /url: /section/world
          - link "Environment" [ref=e35] [cursor=pointer]:
            - /url: /section/environment
          - link "Health" [ref=e36] [cursor=pointer]:
            - /url: /section/health
          - link "Opinion" [ref=e37] [cursor=pointer]:
            - /url: /section/opinion
        - link "Contribute" [ref=e38] [cursor=pointer]:
          - /url: /contribute
    - main [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e42]:
          - generic [ref=e43]:
            - img [ref=e44]
            - generic [ref=e50]: Live
          - generic [ref=e52]:
            - link "Ethiopian PM’s party secures landslide win in national election▸" [ref=e53] [cursor=pointer]:
              - /url: /article/ethiopian-pms-party-secures-landslide-win-in-national-election
            - link "Drone show in Matosinhos breaks Guinness record▸" [ref=e54] [cursor=pointer]:
              - /url: /article/drone-show-in-matosinhos-breaks-guinness-record
            - link "Latest news bulletin | June 21st, 2026 – Evening▸" [ref=e55] [cursor=pointer]:
              - /url: /article/latest-news-bulletin-june-21st-2026-evening
            - link "Trump threatens to hit Iran again and take over Strait of Hormuz▸" [ref=e56] [cursor=pointer]:
              - /url: /article/trump-threatens-to-hit-iran-again-and-take-over-strait-of-hormuz
            - link "Europe hits 40ºC as heatwave threatens tourism industry, wildlife▸" [ref=e57] [cursor=pointer]:
              - /url: /article/europe-hits-40c-as-heatwave-threatens-tourism-industry-wildlife
            - link "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area▸" [ref=e58] [cursor=pointer]:
              - /url: /article/fish-river-canyon-hike-closed-due-to-heavy-rainfall-in-the-naute-dam-catchment-a
            - link "A Spectacular Finish to the Ulaanbaatar Grand Slam▸" [ref=e59] [cursor=pointer]:
              - /url: /article/a-spectacular-finish-to-the-ulaanbaatar-grand-slam
            - 'link "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps▸" [ref=e60] [cursor=pointer]':
              - /url: /article/red-hawk-rising-how-the-z-20-family-is-plugging-chinas-chronic-defence-gaps
            - link "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry▸" [ref=e61] [cursor=pointer]:
              - /url: /article/negotiators-at-iran-us-talks-form-working-groups-on-final-peace-deal-qatari-mini
            - link "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media▸" [ref=e62] [cursor=pointer]:
              - /url: /article/iranian-source-says-strait-of-hormuz-wont-reopen-as-long-as-ceasefire-in-lebanon
            - link "Hong Kong father, son arrested after parking ticket thrown at traffic wardens▸" [ref=e63] [cursor=pointer]:
              - /url: /article/hong-kong-father-son-arrested-after-parking-ticket-thrown-at-traffic-wardens
            - link "Bolivian lawmakers approve state of emergency as protests choke supply chain▸" [ref=e64] [cursor=pointer]:
              - /url: /article/bolivian-lawmakers-approve-state-of-emergency-as-protests-choke-supply-chain
            - link "Starmer reflecting on 'political realities' amid reports of imminent resignation▸" [ref=e65] [cursor=pointer]:
              - /url: /article/starmer-reflecting-on-political-realities-amid-reports-of-imminent-resignation
            - link "Iran start talks at Buergenstock resort in Switzerland▸" [ref=e66] [cursor=pointer]:
              - /url: /article/iran-start-talks-at-buergenstock-resort-in-switzerland
            - link "These Gulf carriers are offering insurance to entice customers back to the Middle East▸" [ref=e67] [cursor=pointer]:
              - /url: /article/these-gulf-carriers-are-offering-insurance-to-entice-customers-back-to-the-middl
            - link "Ethiopian PM’s party secures landslide win in national election▸" [ref=e68] [cursor=pointer]:
              - /url: /article/ethiopian-pms-party-secures-landslide-win-in-national-election
            - link "Drone show in Matosinhos breaks Guinness record▸" [ref=e69] [cursor=pointer]:
              - /url: /article/drone-show-in-matosinhos-breaks-guinness-record
            - link "Latest news bulletin | June 21st, 2026 – Evening▸" [ref=e70] [cursor=pointer]:
              - /url: /article/latest-news-bulletin-june-21st-2026-evening
            - link "Trump threatens to hit Iran again and take over Strait of Hormuz▸" [ref=e71] [cursor=pointer]:
              - /url: /article/trump-threatens-to-hit-iran-again-and-take-over-strait-of-hormuz
            - link "Europe hits 40ºC as heatwave threatens tourism industry, wildlife▸" [ref=e72] [cursor=pointer]:
              - /url: /article/europe-hits-40c-as-heatwave-threatens-tourism-industry-wildlife
            - link "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area▸" [ref=e73] [cursor=pointer]:
              - /url: /article/fish-river-canyon-hike-closed-due-to-heavy-rainfall-in-the-naute-dam-catchment-a
            - link "A Spectacular Finish to the Ulaanbaatar Grand Slam▸" [ref=e74] [cursor=pointer]:
              - /url: /article/a-spectacular-finish-to-the-ulaanbaatar-grand-slam
            - 'link "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps▸" [ref=e75] [cursor=pointer]':
              - /url: /article/red-hawk-rising-how-the-z-20-family-is-plugging-chinas-chronic-defence-gaps
            - link "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry▸" [ref=e76] [cursor=pointer]:
              - /url: /article/negotiators-at-iran-us-talks-form-working-groups-on-final-peace-deal-qatari-mini
            - link "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media▸" [ref=e77] [cursor=pointer]:
              - /url: /article/iranian-source-says-strait-of-hormuz-wont-reopen-as-long-as-ceasefire-in-lebanon
            - link "Hong Kong father, son arrested after parking ticket thrown at traffic wardens▸" [ref=e78] [cursor=pointer]:
              - /url: /article/hong-kong-father-son-arrested-after-parking-ticket-thrown-at-traffic-wardens
            - link "Bolivian lawmakers approve state of emergency as protests choke supply chain▸" [ref=e79] [cursor=pointer]:
              - /url: /article/bolivian-lawmakers-approve-state-of-emergency-as-protests-choke-supply-chain
            - link "Starmer reflecting on 'political realities' amid reports of imminent resignation▸" [ref=e80] [cursor=pointer]:
              - /url: /article/starmer-reflecting-on-political-realities-amid-reports-of-imminent-resignation
            - link "Iran start talks at Buergenstock resort in Switzerland▸" [ref=e81] [cursor=pointer]:
              - /url: /article/iran-start-talks-at-buergenstock-resort-in-switzerland
            - link "These Gulf carriers are offering insurance to entice customers back to the Middle East▸" [ref=e82] [cursor=pointer]:
              - /url: /article/these-gulf-carriers-are-offering-insurance-to-entice-customers-back-to-the-middl
        - generic [ref=e83]:
          - generic [ref=e84]:
            - img "Drone show in Matosinhos breaks Guinness record" [ref=e86]
            - generic [ref=e89]:
              - generic [ref=e90]: world
              - heading "Drone show in Matosinhos breaks Guinness record" [level=2] [ref=e91]:
                - link "Drone show in Matosinhos breaks Guinness record" [ref=e92] [cursor=pointer]:
                  - /url: /article/drone-show-in-matosinhos-breaks-guinness-record
              - paragraph [ref=e93]: Almost 3,100 drones flew in sync in a show by Catalan Flock Drone Art Studio, which also marked the opening of the Sagrada Família’s Tower of Jesus, attended by Pope Leo XVI.
              - generic [ref=e94]:
                - generic [ref=e95]: Euronews
                - generic [ref=e96]:
                  - img [ref=e97]
                  - text: 57m ago
          - button "Previous slide" [ref=e100]:
            - img [ref=e101]
          - button "Next slide" [ref=e103]:
            - img [ref=e104]
          - generic [ref=e106]:
            - button "Go to slide 1" [ref=e107]
            - button "Go to slide 2" [ref=e108]
            - button "Go to slide 3" [ref=e109]
            - button "Go to slide 4" [ref=e110]
            - button "Go to slide 5" [ref=e111]
        - generic [ref=e112]:
          - generic [ref=e113]:
            - generic [ref=e114]:
              - img [ref=e115]
              - generic [ref=e118]: USD/NAD
              - generic [ref=e119]: "18.42"
            - generic [ref=e120]:
              - img [ref=e121]
              - generic [ref=e124]: EUR/NAD
              - generic [ref=e125]: "19.87"
            - generic [ref=e126]:
              - img [ref=e127]
              - generic [ref=e128]: ZAR/NAD
              - generic [ref=e129]: "1.00"
            - generic [ref=e130]:
              - img [ref=e131]
              - generic [ref=e134]: GBP/NAD
              - generic [ref=e135]: "23.34"
            - generic [ref=e136]:
              - img [ref=e137]
              - generic [ref=e140]: Gold (oz)
              - generic [ref=e141]: USD 2,041
            - generic [ref=e142]:
              - img [ref=e143]
              - generic [ref=e146]: Bitcoin
              - generic [ref=e147]: USD 67,234
          - generic [ref=e148]:
            - generic [ref=e149]:
              - generic [ref=e150]:
                - heading "Latest News" [level=2] [ref=e151]
                - generic [ref=e152]: Live
              - generic [ref=e154]:
                - link "Europe hits 40ºC as heatwave threatens tourism industry, wildlife world Europe hits 40ºC as heatwave threatens tourism industry, wildlife A severe ⁠heatwave gripped much of Europe on Sunday, with temperatures nearing 40 degrees Celsius (104 degrees Fahrenheit), prompting nationwide warnings, transport disruption and signs of strain on wildlife and at tourist hotspots. The heat surge on June 21, the summer solstice in the northern... South China Morning Post 2h ago" [ref=e155] [cursor=pointer]:
                  - /url: /article/europe-hits-40c-as-heatwave-threatens-tourism-industry-wildlife
                  - generic [ref=e156]:
                    - img "Europe hits 40ºC as heatwave threatens tourism industry, wildlife" [ref=e157]
                    - generic [ref=e158]: world
                  - generic [ref=e159]:
                    - heading "Europe hits 40ºC as heatwave threatens tourism industry, wildlife" [level=3] [ref=e160]
                    - paragraph [ref=e161]: A severe ⁠heatwave gripped much of Europe on Sunday, with temperatures nearing 40 degrees Celsius (104 degrees Fahrenheit), prompting nationwide warnings, transport disruption and signs of strain on wildlife and at tourist hotspots. The heat surge on June 21, the summer solstice in the northern...
                    - generic [ref=e162]:
                      - generic [ref=e163]: South China Morning Post
                      - generic [ref=e164]:
                        - img [ref=e165]
                        - text: 2h ago
                - link "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area environment Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area Staff Reporter THE Namibia Wildlife Resorts (NWR) has announced the temporary closure of the Fish River Canyon Hike. NWR explained that the closure is due to heavy rainfall recorded in the Naute Dam catchment area and the opening of the Naute Dam sluice gates, which may pose a risk to the safety of... Informanté 2h ago" [ref=e168] [cursor=pointer]:
                  - /url: /article/fish-river-canyon-hike-closed-due-to-heavy-rainfall-in-the-naute-dam-catchment-a
                  - generic [ref=e169]:
                    - img "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area" [ref=e170]
                    - generic [ref=e171]: environment
                  - generic [ref=e172]:
                    - heading "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area" [level=3] [ref=e173]
                    - paragraph [ref=e174]: Staff Reporter THE Namibia Wildlife Resorts (NWR) has announced the temporary closure of the Fish River Canyon Hike. NWR explained that the closure is due to heavy rainfall recorded in the Naute Dam catchment area and the opening of the Naute Dam sluice gates, which may pose a risk to the safety of...
                    - generic [ref=e175]:
                      - generic [ref=e176]: Informanté
                      - generic [ref=e177]:
                        - img [ref=e178]
                        - text: 2h ago
                - link "A Spectacular Finish to the Ulaanbaatar Grand Slam world A Spectacular Finish to the Ulaanbaatar Grand Slam The Ulaanbaatar Grand Slam concluded with outstanding performances from the world’s top judoka. MURAO Sanshiro claimed a ninth Grand Slam title, LYTVYNENKO Yelyzaveta triumphed in -78kg, while PIRELLI Gennaro, ARAI Mao and KIM Minjong secured gold on a thrilling final day in Mongolia. Euronews 2h ago" [ref=e181] [cursor=pointer]:
                  - /url: /article/a-spectacular-finish-to-the-ulaanbaatar-grand-slam
                  - generic [ref=e182]:
                    - img "A Spectacular Finish to the Ulaanbaatar Grand Slam" [ref=e183]
                    - generic [ref=e184]: world
                  - generic [ref=e185]:
                    - heading "A Spectacular Finish to the Ulaanbaatar Grand Slam" [level=3] [ref=e186]
                    - paragraph [ref=e187]: The Ulaanbaatar Grand Slam concluded with outstanding performances from the world’s top judoka. MURAO Sanshiro claimed a ninth Grand Slam title, LYTVYNENKO Yelyzaveta triumphed in -78kg, while PIRELLI Gennaro, ARAI Mao and KIM Minjong secured gold on a thrilling final day in Mongolia.
                    - generic [ref=e188]:
                      - generic [ref=e189]: Euronews
                      - generic [ref=e190]:
                        - img [ref=e191]
                        - text: 2h ago
                - 'link "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps world Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps Telling a Harbin Z-20 and a Sikorsky UH-60 “Black Hawk” apart can be challenging – the two helicopters look almost identical and their dimensions are very similar. The striking resemblance underscores China’s decades-long effort to close the technological gap with the United States and Russia in... South China Morning Post 2h ago" [ref=e194] [cursor=pointer]':
                  - /url: /article/red-hawk-rising-how-the-z-20-family-is-plugging-chinas-chronic-defence-gaps
                  - generic [ref=e195]:
                    - 'img "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps" [ref=e196]'
                    - generic [ref=e197]: world
                  - generic [ref=e198]:
                    - 'heading "Red Hawk rising: how the Z-20 family is plugging China’s chronic defence gaps" [level=3] [ref=e199]'
                    - paragraph [ref=e200]: Telling a Harbin Z-20 and a Sikorsky UH-60 “Black Hawk” apart can be challenging – the two helicopters look almost identical and their dimensions are very similar. The striking resemblance underscores China’s decades-long effort to close the technological gap with the United States and Russia in...
                    - generic [ref=e201]:
                      - generic [ref=e202]: South China Morning Post
                      - generic [ref=e203]:
                        - img [ref=e204]
                        - text: 2h ago
                - link "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry environment Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry DOHA, June 21– Qatari Foreign Ministry spokesperson Majed Al-Ansari said on Sunday that the parties… Namibia Daily News 2h ago" [ref=e207] [cursor=pointer]:
                  - /url: /article/negotiators-at-iran-us-talks-form-working-groups-on-final-peace-deal-qatari-mini
                  - generic [ref=e208]:
                    - img "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry" [ref=e209]
                    - generic [ref=e210]: environment
                  - generic [ref=e211]:
                    - heading "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry" [level=3] [ref=e212]
                    - paragraph [ref=e213]: DOHA, June 21– Qatari Foreign Ministry spokesperson Majed Al-Ansari said on Sunday that the parties…
                    - generic [ref=e214]:
                      - generic [ref=e215]: Namibia Daily News
                      - generic [ref=e216]:
                        - img [ref=e217]
                        - text: 2h ago
                - link "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media politics Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media TEHRAN, June 21– Iran will not reopen the Strait of Hormuz if the war in… Namibia Daily News 2h ago" [ref=e220] [cursor=pointer]:
                  - /url: /article/iranian-source-says-strait-of-hormuz-wont-reopen-as-long-as-ceasefire-in-lebanon
                  - generic [ref=e221]:
                    - img "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media" [ref=e222]
                    - generic [ref=e223]: politics
                  - generic [ref=e224]:
                    - heading "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media" [level=3] [ref=e225]
                    - paragraph [ref=e226]: TEHRAN, June 21– Iran will not reopen the Strait of Hormuz if the war in…
                    - generic [ref=e227]:
                      - generic [ref=e228]: Namibia Daily News
                      - generic [ref=e229]:
                        - img [ref=e230]
                        - text: 2h ago
              - link "View All News" [ref=e234] [cursor=pointer]:
                - /url: /section/national
                - text: View All News
                - img [ref=e235]
            - generic [ref=e237]:
              - generic [ref=e238]:
                - generic [ref=e239]:
                  - img [ref=e240]
                  - heading "Most Read" [level=3] [ref=e243]
                - generic [ref=e244]:
                  - link "1 Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry Namibia Daily News • 2h ago" [ref=e245] [cursor=pointer]:
                    - /url: /article/negotiators-at-iran-us-talks-form-working-groups-on-final-peace-deal-qatari-mini
                    - generic [ref=e246]: "1"
                    - generic [ref=e247]:
                      - heading "Negotiators at Iran-U.S. talks form working groups on final peace deal — Qatari ministry" [level=4] [ref=e248]
                      - generic [ref=e249]: Namibia Daily News • 2h ago
                  - link "2 Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media Namibia Daily News • 2h ago" [ref=e250] [cursor=pointer]:
                    - /url: /article/iranian-source-says-strait-of-hormuz-wont-reopen-as-long-as-ceasefire-in-lebanon
                    - generic [ref=e251]: "2"
                    - generic [ref=e252]:
                      - heading "Iranian source says Strait of Hormuz won’t reopen as long as ceasefire in Lebanon isn’t respected — media" [level=4] [ref=e253]
                      - generic [ref=e254]: Namibia Daily News • 2h ago
                  - link "3 Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area Informanté • 2h ago" [ref=e255] [cursor=pointer]:
                    - /url: /article/fish-river-canyon-hike-closed-due-to-heavy-rainfall-in-the-naute-dam-catchment-a
                    - generic [ref=e256]: "3"
                    - generic [ref=e257]:
                      - heading "Fish River Canyon hike closed due to heavy rainfall in the Naute Dam catchment area" [level=4] [ref=e258]
                      - generic [ref=e259]: Informanté • 2h ago
                  - link "4 A Spectacular Finish to the Ulaanbaatar Grand Slam Euronews • 2h ago" [ref=e260] [cursor=pointer]:
                    - /url: /article/a-spectacular-finish-to-the-ulaanbaatar-grand-slam
                    - generic [ref=e261]: "4"
                    - generic [ref=e262]:
                      - heading "A Spectacular Finish to the Ulaanbaatar Grand Slam" [level=4] [ref=e263]
                      - generic [ref=e264]: Euronews • 2h ago
                  - link "5 Trump threatens to hit Iran again and take over Strait of Hormuz Namibia Daily News • 1h ago" [ref=e265] [cursor=pointer]:
                    - /url: /article/trump-threatens-to-hit-iran-again-and-take-over-strait-of-hormuz
                    - generic [ref=e266]: "5"
                    - generic [ref=e267]:
                      - heading "Trump threatens to hit Iran again and take over Strait of Hormuz" [level=4] [ref=e268]
                      - generic [ref=e269]: Namibia Daily News • 1h ago
              - heading "Latest Updates" [level=3] [ref=e272]
              - generic [ref=e274]:
                - generic [ref=e275]:
                  - heading "Jobs" [level=3] [ref=e276]
                  - link "All →" [ref=e277] [cursor=pointer]:
                    - /url: /jobs
                - generic [ref=e278]:
                  - generic [ref=e279]:
                    - heading "Renewable Energy Project Manager" [level=4] [ref=e280]:
                      - link "Renewable Energy Project Manager" [ref=e281] [cursor=pointer]:
                        - /url: https://hyiron.com/careers
                    - paragraph [ref=e282]: HyIron • Lüderitz
                    - paragraph [ref=e283]: NAD 70,000 - 95,000/month
                  - generic [ref=e284]:
                    - heading "Data Journalist" [level=4] [ref=e285]:
                      - link "Data Journalist" [ref=e286] [cursor=pointer]:
                        - /url: https://timesofnamibia.com/careers
                    - paragraph [ref=e287]: Times of Namibia • Windhoek
                    - paragraph [ref=e288]: NAD 45,000 - 60,000/month
                  - generic [ref=e289]:
                    - heading "Senior Full-Stack Engineer" [level=4] [ref=e290]:
                      - link "Senior Full-Stack Engineer" [ref=e291] [cursor=pointer]:
                        - /url: https://tangison.com/careers
                    - paragraph [ref=e292]: TANGISON • Windhoek
                    - paragraph [ref=e293]: NAD 85,000 - 120,000/month
              - generic [ref=e294]:
                - generic [ref=e295]:
                  - heading "Tenders" [level=3] [ref=e296]
                  - link "All →" [ref=e297] [cursor=pointer]:
                    - /url: /tender
                - generic [ref=e298]:
                  - generic [ref=e299]:
                    - heading "Supply and Installation of Broadband Infrastructure for Rural Schools" [level=4] [ref=e300]
                    - paragraph [ref=e301]: Ministry of Information and Communication Technology
                    - paragraph [ref=e302]: "Deadline: 20 Jul 2026"
                  - generic [ref=e303]:
                    - heading "Construction of B1 Corridor Dual Carriageway — Phase 2" [level=4] [ref=e304]
                    - paragraph [ref=e305]: Roads Authority of Namibia
                    - paragraph [ref=e306]: "Deadline: 4 Aug 2026"
              - generic [ref=e307]:
                - heading "Know Namibia?" [level=3] [ref=e308]
                - paragraph [ref=e309]: Share your knowledge of places, culture, and history. Contribute to the Namibia Guide.
                - link "Submit a Story" [ref=e310] [cursor=pointer]:
                  - /url: /contribute
                  - text: Submit a Story
                  - img [ref=e311]
    - contentinfo [ref=e313]:
      - img "Times of Namibia" [ref=e315]
      - generic [ref=e317]:
        - generic [ref=e318]:
          - generic [ref=e320]:
            - generic [ref=e321]: Times of Namibia
            - generic [ref=e322]: Est. 2026 • Windhoek
          - navigation [ref=e323]:
            - link "About" [ref=e324] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=e325] [cursor=pointer]:
              - /url: /contact
            - link "Ethics" [ref=e326] [cursor=pointer]:
              - /url: /editorial-standards
            - link "Privacy" [ref=e327] [cursor=pointer]:
              - /url: /privacy
            - link "Terms" [ref=e328] [cursor=pointer]:
              - /url: /terms
            - link "TANGISON" [ref=e329] [cursor=pointer]:
              - /url: /tangison
        - generic [ref=e330]:
          - generic [ref=e331]: Powered by TANGISON Applied AI
          - generic [ref=e332]: © 2026 Times of Namibia. All rights reserved.
  - region "Notifications alt+T"
  - alert [ref=e333]
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | /**
  4  |  * E2E tests for article pages.
  5  |  */
  6  | 
  7  | test.describe("Article Page", () => {
  8  |   test.beforeEach(async ({ page }) => {
  9  |     // Go to homepage first to find an article
  10 |     await page.goto("/");
  11 |     await page.waitForTimeout(3000);
  12 |     
  13 |     // Click the first article link
  14 |     const articleLink = page.locator('a[href*="/article/"]').first();
> 15 |     await articleLink.click();
     |                       ^ Error: locator.click: Test timeout of 15000ms exceeded.
  16 |     await page.waitForLoadState("networkidle");
  17 |   });
  18 | 
  19 |   test("has H1 headline", async ({ page }) => {
  20 |     const h1 = page.locator("h1");
  21 |     await expect(h1).toBeVisible({ timeout: 10000 });
  22 |     const text = await h1.textContent();
  23 |     expect(text?.length).toBeGreaterThan(10);
  24 |   });
  25 | 
  26 |   test("has Listen (TTS) button", async ({ page }) => {
  27 |     const listenBtn = page.locator("text=Listen");
  28 |     await expect(listenBtn).toBeVisible({ timeout: 10000 });
  29 |   });
  30 | 
  31 |   test("has WhatsApp share button", async ({ page }) => {
  32 |     const whatsappBtn = page.locator("text=WhatsApp");
  33 |     await expect(whatsappBtn).toBeVisible({ timeout: 10000 });
  34 |   });
  35 | 
  36 |   test("has article content (paragraphs)", async ({ page }) => {
  37 |     // Wait for content
  38 |     await page.waitForTimeout(2000);
  39 |     const paragraphs = page.locator("p");
  40 |     const count = await paragraphs.count();
  41 |     expect(count).toBeGreaterThan(0);
  42 |   });
  43 | 
  44 |   test("has no Loading... text", async ({ page }) => {
  45 |     const body = await page.textContent("body");
  46 |     expect(body).not.toContain("Loading...");
  47 |   });
  48 | 
  49 |   test("has correct canonical URL", async ({ page }) => {
  50 |     const canonical = await page.getAttribute('link[rel="canonical"]', "href");
  51 |     expect(canonical).toContain("/article/");
  52 |   });
  53 | });
  54 | 
```