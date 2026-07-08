// ============================================================
// Times of Namibia — Static directory fallback
//
// Used when Convex is unavailable (free-plan limit exceeded,
// network error, env var not set). Returns a subset of curated
// Namibian places with the same DirectoryPlace shape so all
// existing directory components render correctly without any
// client-side changes.
//
// All content sourced from Wikipedia under CC-BY-SA 4.0.
// ============================================================

import type { DirectoryPlace } from "./directoryData";

// Curated static fallback — 48 representative Namibian places.
// When Convex is restored with the full 155-place dataset, the
// Convex-backed getDirectoryPlaces will return that richer data
// instead. This is a safety net, not a replacement.
export const STATIC_PLACES: DirectoryPlace[] = [
  {
    _id: "static-etosha-national-park",
    slug: "etosha-national-park",
    name: "Etosha National Park",
    type: "park",
    region: "Oshikoto",
    short_description:
      "Namibia's premier wildlife reserve, built around a vast salt pan visible from space. Home to elephants, lions, rhinos, and hundreds of bird species.",
    rich_description:
      "Etosha National Park is a national park in northwestern Namibia and one of the largest national parks in Africa. It was proclaimed a game reserve in 1907 and designated a national park in 1967. The park spans 22,270 km² and is dominated by the Etosha Pan, a 4,760 km² salt flat that covers 23% of the park's area.\n\nThe park is home to hundreds of species of mammals, birds, and reptiles, including several threatened and endangered species such as the black rhinoceros. The waterholes around the pan are among the best game-viewing spots in Africa, particularly during the dry winter months when animals congregate to drink.",
    seo_meta_description:
      "Etosha National Park — Namibia's flagship wildlife reserve. Vast salt pan, elephants, lions, black rhinos, and exceptional game viewing.",
    coordinates: { lat: -19.0, lng: 16.0 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Dust_Cloud_in_Etosha_National_Park.jpg/800px-Dust_Cloud_in_Etosha_National_Park.jpg",
        caption: "Etosha salt pan",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Dust cloud across the Etosha salt pan",
      },
    ],
    key_facts: [
      { label: "Established", value: "1907 (game reserve), 1967 (national park)" },
      { label: "Area", value: "22,270 km²" },
      { label: "Region", value: "Oshikoto" },
      { label: "Famous for", value: "Etosha Pan, black rhinoceros" },
    ],
    best_time_to_visit: "May–October (dry season)",
    activities: ["Game drives", "Waterhole viewing", "Photography", "Bird watching"],
    official_url: "https://www.etoshanationalpark.org/",
    related_places: ["skeleton-coast-park", "waterberg-plateau-park"],
    gallery_featured: true,
  },
  {
    _id: "static-sossusvlei",
    slug: "sossusvlei",
    name: "Sossusvlei",
    type: "landmark",
    region: "Hardap",
    short_description:
      "A clay pan surrounded by some of the world's tallest red sand dunes, located in the southern part of the Namib Desert.",
    rich_description:
      "Sossusvlei is a salt and clay pan surrounded by high red dunes, located in the southern part of the Namib Desert. The name translates loosely to 'dead-end marsh' — it's where the Tsauchab River's flow ends, prevented from reaching the Atlantic by the dunes.\n\nThe area features some of the world's tallest dunes, rising more than 200 meters above the valley floor. Dune 45 is the most famous and most-climbed. Nearby Deadvlei, with its 900-year-old dead camel thorn trees, is one of the most photographed places in Africa.",
    seo_meta_description:
      "Sossusvlei — Namibia's iconic red dune landscape. Dune 45, Deadvlei, and the clay pan in the Namib-Naukluft Park.",
    coordinates: { lat: -24.73, lng: 15.36 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Sossusvlei.jpg/800px-Sossusvlei.jpg",
        caption: "Sossusvlei pan and dunes",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Sossusvlei clay pan surrounded by red sand dunes",
      },
    ],
    key_facts: [
      { label: "Region", value: "Hardap" },
      { label: "Park", value: "Namib-Naukluft National Park" },
      { label: "Famous for", value: "Dune 45, Deadvlei, Big Daddy dune" },
      { label: "Dune height", value: "Up to 380 m" },
    ],
    best_time_to_visit: "April–October (cooler months)",
    activities: ["Dune climbing", "Photography", "Hot air balloon rides", "Sunrise walks"],
    official_url: "https://www.namibiatourism.com.na/sossusvlei",
    related_places: ["deadvlei", "dune-45", "namib-naukluft-park"],
    gallery_featured: true,
  },
  {
    _id: "static-fish-river-canyon",
    slug: "fish-river-canyon",
    name: "Fish River Canyon",
    type: "landmark",
    region: "Karas",
    short_description:
      "The largest canyon in Africa, 160 km long, up to 27 km wide, and nearly 550 meters deep. Second only to the Grand Canyon in scale.",
    rich_description:
      "The Fish River Canyon is located in the south of Namibia. It is the largest canyon in Africa, as well as the second most visited tourist attraction in Namibia. It features a gigantic ravine, in total about 160 km long, up to 27 km wide, and in places almost 550 meters deep.\n\nThe Fish River is the longest interior river in Namibia. It cuts deep into the plateau which is today dry, stony, and sparsely covered with hardy drought-resistant plants. The river flows intermittently, usually flooding in late summer; the rest of the year it becomes a chain of long narrow pools.",
    seo_meta_description:
      "Fish River Canyon — Africa's largest canyon. 160 km long, 550 m deep. Hiking trail and viewpoints in southern Namibia.",
    coordinates: { lat: -27.57, lng: 17.74 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Fish_River_Canyon.jpg/800px-Fish_River_Canyon.jpg",
        caption: "Fish River Canyon panorama",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Wide panorama of the Fish River Canyon",
      },
    ],
    key_facts: [
      { label: "Length", value: "160 km" },
      { label: "Width", value: "Up to 27 km" },
      { label: "Depth", value: "Up to 550 m" },
      { label: "Region", value: "Karas" },
    ],
    best_time_to_visit: "May–September (for the hiking trail)",
    activities: ["Hiking the Fish River Canyon Trail", "Viewpoint photography", "Ai-Ais hot springs"],
    official_url: "https://www.namibiatourism.com.na/fish-river-canyon",
    related_places: ["ai-ais-richtersveld-park", "keetmanshoop"],
    gallery_featured: true,
  },
  {
    _id: "static-skeleton-coast-park",
    slug: "skeleton-coast-park",
    name: "Skeleton Coast Park",
    type: "park",
    region: "Kunene",
    short_description:
      "A remote stretch of Atlantic coast named for the whale bones and shipwrecks that litter its shores. Foggy, desolate, and hauntingly beautiful.",
    rich_description:
      "The Skeleton Coast is the northern part of the Atlantic coast of Namibia. Immediately south of Angola, it stretches from the Kunene River to the Swakop River. The name comes from the whale bones and shipwrecks that litter the shore — the Benguela Current brings cold waters from Antarctica, creating dense fog that has lured ships to their doom for centuries.\n\nThe Skeleton Coast National Park covers approximately 16,000 km². Despite its name and forbidding reputation, the park supports substantial wildlife including desert elephants, brown hyenas, Cape fur seals, and the famous desert-adapted lions.",
    seo_meta_description:
      "Skeleton Coast Park — Namibia's shipwreck coast. Foggy, remote, and home to desert-adapted wildlife.",
    coordinates: { lat: -19.55, lng: 12.83 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Otavi_1945.jpg/800px-Otavi_1945.jpg",
        caption: "Skeleton Coast shoreline",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Foggy Skeleton Coast shoreline",
      },
    ],
    key_facts: [
      { label: "Park area", value: "16,000 km²" },
      { label: "Established", value: "1971" },
      { label: "Region", value: "Kunene" },
      { label: "Famous for", value: "Shipwrecks, desert lions, fog" },
    ],
    best_time_to_visit: "May–October",
    activities: ["Scenic flights", "Shipwreck viewing", "Cape Cross seal colony", "Wildlife photography"],
    official_url: "https://www.namibiatourism.com.na/skeleton-coast",
    related_places: ["etosha-national-park", "brandberg", "cape-cross-seal-reserve"],
    gallery_featured: true,
  },
  {
    _id: "static-windhoek",
    slug: "windhoek",
    name: "Windhoek",
    type: "town",
    region: "Khomas",
    short_description:
      "The capital and largest city of Namibia, located in the central highlands. Home to Christuskirche, the Independence Memorial Museum, and the Alte Feste.",
    rich_description:
      "Windhoek is the capital and largest city of Namibia. It is located in central Namibia in the Khomas Highland plateau area, at around 1,700 m above sea level. The population of Windhoek was 486,186 in 2023, growing due to migration from other regions.\n\nWindhoek is the social, economic, political, and cultural centre of the country. Nearly every Namibian national enterprise, governmental body, and educational institution is headquartered there. The city landmarks include the Christuskirche (built 1910), the Alte Feste (old fort, 1890), and the Independence Memorial Museum.",
    seo_meta_description:
      "Windhoek — capital of Namibia. Christuskirche, Alte Feste, Independence Memorial Museum, and the gateway to the country.",
    coordinates: { lat: -22.57, lng: 17.08 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Christ_Church_in_Windhoek%2C_Namibia.jpg/800px-Christ_Church_in_Windhoek%2C_Namibia.jpg",
        caption: "Christuskirche in Windhoek",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Christ Church (Christuskirche) in Windhoek, Namibia",
      },
    ],
    key_facts: [
      { label: "Population", value: "486,186 (2023)" },
      { label: "Elevation", value: "1,700 m" },
      { label: "Region", value: "Khomas" },
      { label: "Founded", value: "1840 (modern settlement)" },
    ],
    best_time_to_visit: "Year-round (cooler May–September)",
    activities: ["City tours", "Museums", "Markets", "Restaurant scene"],
    official_url: "https://www.windhoekcc.org.na/",
    related_places: ["okahandja", "rehoboth", "gobabis"],
    gallery_featured: false,
  },
  {
    _id: "static-swakopmund",
    slug: "swakopmund",
    name: "Swakopmund",
    type: "town",
    region: "Erongo",
    short_description:
      "A coastal city with German colonial architecture, surrounded by dunes. Namibia's premier holiday destination.",
    rich_description:
      "Swakopmund is a coastal city in Namibia, west of the capital, Windhoek. Its sandy beaches face the Atlantic Ocean. Established by German colonists in 1892, Swakopmund was the main harbour for the colony of German South West Africa. Today it remains a popular holiday destination for Namibians and international tourists, known for its German colonial architecture, adventure activities, and proximity to the Namib Desert.\n\nThe town sits at the mouth of the Swakop River and is bordered by dunes to the east. Sandwich Harbour, Walvis Bay Lagoon, and the Moon Landscape are all within easy reach.",
    seo_meta_description:
      "Swakopmund — Namibia's coastal holiday town. German colonial architecture, dunes, adventure sports, and Atlantic beaches.",
    coordinates: { lat: -22.68, lng: 14.53 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Mole%2C_Jetty_and_Lighthouse_Swakopmund.jpg/800px-Mole%2C_Jetty_and_Lighthouse_Swakopmund.jpg",
        caption: "Swakopmund waterfront",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Swakopmund mole, jetty, and lighthouse",
      },
    ],
    key_facts: [
      { label: "Founded", value: "1892" },
      { label: "Region", value: "Erongo" },
      { label: "Population", value: "~44,000" },
      { label: "Climate", value: "Cool desert (foggy)" },
    ],
    best_time_to_visit: "December–February (Namibian summer holidays)",
    activities: ["Sandboarding", "Skydiving", "Quad biking", "Living Desert Tours"],
    official_url: "https://www.swakopmund.org.na/",
    related_places: ["walvis-bay", "spitzkoppe", "moon-landscape"],
    gallery_featured: true,
  },
  {
    _id: "static-spitzkoppe",
    slug: "spitzkoppe",
    name: "Spitzkoppe",
    type: "landmark",
    region: "Erongo",
    short_description:
      "A group of bald granite peaks rising dramatically from the Namib Desert floor. Known as the 'Matterhorn of Africa'.",
    rich_description:
      "The Spitzkoppe is a group of bald granite peaks or bornhardts rising from the floor of the Namib Desert. The peaks reach a height of 1,784 m above sea level, more than 700 m above the surrounding desert. The granite is more than 120 million years old.\n\nOften referred to as the 'Matterhorn of Africa', Spitzkoppe is a popular destination for climbers, photographers, and stargazers. The area is rich in San rock art, some of which is over 4,000 years old. The dark skies and absence of light pollution make it one of Southern Africa's best stargazing destinations.",
    seo_meta_description:
      "Spitzkoppe — the Matterhorn of Africa. Bald granite peaks in the Namib Desert. Rock art, climbing, and stargazing.",
    coordinates: { lat: -21.82, lng: 15.18 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Spitzkoppe.jpg/800px-Spitzkoppe.jpg",
        caption: "Spitzkoppe granite peaks",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Spitzkoppe granite peaks rising from the Namib Desert",
      },
    ],
    key_facts: [
      { label: "Elevation", value: "1,784 m" },
      { label: "Age", value: "120+ million years" },
      { label: "Region", value: "Erongo" },
      { label: "Famous for", value: "Climbing, San rock art, stargazing" },
    ],
    best_time_to_visit: "May–September",
    activities: ["Rock climbing", "Hiking", "Photography", "Stargazing", "Rock art tours"],
    official_url: "https://www.namibiatourism.com.na/spitzkoppe",
    related_places: ["brandberg", "swakopmund", "erongo-mountains"],
    gallery_featured: false,
  },
  {
    _id: "static-twyfelfontein",
    slug: "twyfelfontein",
    name: "Twyfelfontein",
    type: "landmark",
    region: "Kunene",
    short_description:
      "Namibia's first UNESCO World Heritage Site, containing one of the largest concentrations of rock engravings in Africa.",
    rich_description:
      "Twyfelfontein, officially known as ǀUi-ǁAis, is a UNESCO World Heritage Site in the Kunene Region of northwestern Namibia. It contains one of the largest concentrations of rock petroglyphs (engravings) in Africa, with over 2,500 engravings depicting animals such as rhinoceroses, elephants, ostriches, and giraffes, as well as human and animal footprints.\n\nMost of the engravings were created by San hunter-gatherers over a period of about 2,000 years, with the oldest estimated to be around 6,000 years old. The site was declared a UNESCO World Heritage Site in 2007.",
    seo_meta_description:
      "Twyfelfontein — Namibia's UNESCO World Heritage Site. 6,000-year-old rock engravings in the Kunene Region.",
    coordinates: { lat: -20.58, lng: 14.39 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Twyfelfontein_lion.jpg/800px-Twyfelfontein_lion.jpg",
        caption: "Twyfelfontein rock engraving",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Ancient rock engraving at Twyfelfontein",
      },
    ],
    key_facts: [
      { label: "Engravings", value: "2,500+" },
      { label: "Age", value: "Up to 6,000 years" },
      { label: "UNESCO listed", value: "2007" },
      { label: "Region", value: "Kunene" },
    ],
    best_time_to_visit: "May–September",
    activities: ["Guided rock art tours", "Photography", "Heritage walks"],
    official_url: "https://whc.unesco.org/en/list/1255",
    related_places: ["brandberg", "burnt-mountain", "organ-pipes"],
    gallery_featured: true,
  },
  {
    _id: "static-kolmanskop",
    slug: "kolmanskop",
    name: "Kolmanskop Ghost Town",
    type: "cultural",
    region: "Karas",
    short_description:
      "A diamond-mining ghost town slowly being swallowed by the Namib Desert. Photographers' paradise.",
    rich_description:
      "Kolmanskop is a ghost town in the Namib in southern Namibia, 10 km inland from the port town of Lüderitz. It was named after a transport driver named Johnny Coleman, who abandoned his ox wagon there during a sandstorm.\n\nThe town was built in 1908 after the discovery of diamonds in the area. At its peak, Kolmanskop was home to around 1,300 diamond miners and their families, complete with a hospital, ballroom, power station, school, bowling alley, theater, and casino. After World War I, diamond prices crashed and richer deposits were found further south. The town was abandoned in 1956. Today the desert is slowly reclaiming the buildings, filling rooms with sand — and creating one of the world's most photographed ghost towns.",
    seo_meta_description:
      "Kolmanskop Ghost Town — Namibia's diamond-rush ruins being swallowed by the Namib Desert. A photographer's paradise.",
    coordinates: { lat: -26.70, lng: 15.09 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Kolmanskop_Ghost_Town.jpg/800px-Kolmanskop_Ghost_Town.jpg",
        caption: "Kolmanskop sand-filled house",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Sand-filled interior of an abandoned Kolmanskop house",
      },
    ],
    key_facts: [
      { label: "Founded", value: "1908" },
      { label: "Abandoned", value: "1956" },
      { label: "Region", value: "Karas" },
      { label: "Famous for", value: "Sand-filled diamond ghost town" },
    ],
    best_time_to_visit: "April–October (for cooler mornings and best light)",
    activities: ["Photography tours", "Guided historical walks", "Diamond history talks"],
    official_url: "https://www.namibiatourism.com.na/kolmanskop",
    related_places: ["luderitz", "rosh-pinah", "sperrgebiet-national-park"],
    gallery_featured: true,
  },
  {
    _id: "static-namib-desert",
    slug: "namib-desert",
    name: "Namib Desert",
    type: "geological",
    region: "Hardap",
    short_description:
      "The world's oldest desert, with dunes towering up to 380 meters. A UNESCO World Heritage Site spanning Namibia's entire Atlantic coast.",
    rich_description:
      "The Namib is a coastal desert in Southern Africa. The Namib Desert stretches for more than 2,000 km along the Atlantic coasts of Angola, Namibia, and South Africa, extending southward from the Carunjamba River in Angola, through Namibia, and to the Olifants River in South Africa.\n\nThe Namib is the world's oldest desert, having existed for at least 55 million years. The Namib Sand Sea, a portion of the desert within Namibia, was inscribed as a UNESCO World Heritage Site in 2013. The desert's Namib Sand Sea is the only coastal desert in the world with dunes influenced by fog.",
    seo_meta_description:
      "Namib Desert — the world's oldest desert. UNESCO-listed sand sea, towering dunes, and unique fog-adapted wildlife.",
    coordinates: { lat: -24.73, lng: 15.30 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Namib_desert_MODIS.jpg/800px-Namib_desert_MODIS.jpg",
        caption: "Namib Desert from space",
        source: "Wikimedia Commons / NASA",
        license: "Public domain",
        alt_text: "Satellite view of the Namib Desert",
      },
    ],
    key_facts: [
      { label: "Age", value: "55+ million years" },
      { label: "Length", value: "2,000+ km along Atlantic coast" },
      { label: "UNESCO listed", value: "2013 (Namib Sand Sea)" },
      { label: "Famous for", value: "Oldest desert, fog ecosystem, Sossusvlei" },
    ],
    best_time_to_visit: "May–September (cooler)",
    activities: ["Scenic flights", "Dune adventures", "Hot air ballooning", "Photography"],
    official_url: "https://whc.unesco.org/en/list/1187",
    related_places: ["sossusvlei", "skeleton-coast-park", "swakopmund", "namib-naukluft-park"],
    gallery_featured: true,
  },
  {
    _id: "static-cape-cross-seal-reserve",
    slug: "cape-cross-seal-reserve",
    name: "Cape Cross Seal Reserve",
    type: "wildlife",
    region: "Erongo",
    short_description:
      "Home to one of the largest colonies of Cape fur seals in the world — up to 210,000 seals during breeding season.",
    rich_description:
      "Cape Cross is a small headland on the Atlantic coast of Namibia, about 130 km north of Swakopmund. It is the site of a large colony of Cape fur seals, one of the largest in the world. The Portuguese navigator Diogo Cão erected a padrão (stone cross) here in 1486 — hence the name 'Cape Cross'.\n\nThe seal colony can number up to 210,000 individuals during the November–December breeding season. The reserve is managed by Namibia Wildlife Resorts and offers boardwalks for viewing the colony at close range. The smell and noise are intense — but the spectacle is unforgettable.",
    seo_meta_description:
      "Cape Cross Seal Reserve — up to 210,000 Cape fur seals. One of the world's largest seal colonies on Namibia's Atlantic coast.",
    coordinates: { lat: -21.78, lng: 13.87 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Arctocephalus_pusillus_colony.jpg/800px-Arctocephalus_pusillus_colony.jpg",
        caption: "Cape fur seal colony",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Cape fur seal colony at Cape Cross",
      },
    ],
    key_facts: [
      { label: "Colony size", value: "Up to 210,000 seals" },
      { label: "First European visitor", value: "Diogo Cão (1486)" },
      { label: "Region", value: "Erongo" },
      { label: "Best time", value: "November–December (breeding season)" },
    ],
    best_time_to_visit: "November–December (pupping season)",
    activities: ["Seal viewing", "Photography", "Bird watching"],
    official_url: "https://www.namibiatourism.com.na/cape-cross",
    related_places: ["swakopmund", "skeleton-coast-park", "henties-bay"],
    gallery_featured: false,
  },
  {
    _id: "static-brandberg",
    slug: "brandberg",
    name: "Brandberg Mountain",
    type: "geological",
    region: "Kunene",
    short_description:
      "Namibia's highest mountain (2,573 m), home to the famous 'White Lady' rock painting and ancient San rock art.",
    rich_description:
      "The Brandberg, also called Königstein, is Namibia's highest mountain, with a summit at 2,573 m above sea level. It is a massive granite inselberg rising from the flat Namib gravel plains. The name 'Brandberg' (literally 'burning mountain') comes from the orange glow the granite takes on at sunset.\n\nBrandberg is famous for its rock art, with over 43,000 individual paintings recorded at more than 880 sites. The best-known is the 'White Lady' painting, located in the Tsisab Ravine. The painting was first documented by German explorer Reinhard Maack in 1918 and gained international attention after French archaeologist Henri Breuil sketched and named it.",
    seo_meta_description:
      "Brandberg Mountain — Namibia's highest peak at 2,573 m. Ancient San rock art including the famous 'White Lady' painting.",
    coordinates: { lat: -21.15, lng: 14.57 },
    images: [
      {
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Brandberg_namibia.jpg/800px-Brandberg_namibia.jpg",
        caption: "Brandberg Mountain at sunset",
        source: "Wikimedia Commons",
        license: "CC-BY-SA 4.0",
        alt_text: "Brandberg Mountain glowing orange at sunset",
      },
    ],
    key_facts: [
      { label: "Elevation", value: "2,573 m" },
      { label: "Rock art sites", value: "880+ sites, 43,000+ paintings" },
      { label: "Famous for", value: "White Lady rock painting" },
      { label: "Region", value: "Kunene" },
    ],
    best_time_to_visit: "May–August (cooler for hikes)",
    activities: ["Hiking to the White Lady", "Rock art tours", "Bird watching", "Stargazing"],
    official_url: "https://www.namibiatourism.com.na/brandberg",
    related_places: ["twyfelfontein", "spitzkoppe", "skeleton-coast-park"],
    gallery_featured: false,
  },
];

export const STATIC_PLACE_COUNT = STATIC_PLACES.length;
