#!/usr/bin/env python3
"""
Times of Namibia — Build static places.ts from Wikipedia + Wikimedia Commons.
Generates 100+ curated Namibian places with real extracts and images.
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

USER_AGENT = "TimesOfNamibiaBot/1.0 (https://timesofnamibia47.vercel.app; contact@timesofnamibia.com)"
HEADERS = {"User-Agent": USER_AGENT, "Accept": "application/json"}
OUT = Path("/home/z/my-project/timesofnamibia/frontend-new/src/data/places.ts")

# 100+ curated Namibian places: (slug, name, category, region)
PLACES = [
    # Parks
    ("etosha-national-park","Etosha National Park","park","Oshikoto"),
    ("namib-naukluft-park","Namib-Naukluft Park","park","Hardap"),
    ("skeleton-coast-park","Skeleton Coast Park","park","Kunene"),
    ("waterberg-plateau-park","Waterberg Plateau Park","park","Otjozondjupa"),
    ("dorob-national-park","Dorob National Park","park","Erongo"),
    ("bwabwata-national-park","Bwabwata National Park","park","Zambezi"),
    ("mudumu-national-park","Mudumu National Park","park","Zambezi"),
    ("nkasa-rupara-national-park","Nkasa Rupara National Park","park","Zambezi"),
    ("khaudum-national-park","Khaudum National Park","park","Kavango East"),
    ("ai-ais-richtersveld-park","Ai-Ais Richtersveld Park","park","Karas"),
    ("cape-cross-seal-reserve","Cape Cross Seal Reserve","park","Erongo"),
    ("sperrgebiet-national-park","Tsau ǁKhaeb National Park","park","Karas"),
    # Landmarks
    ("sossusvlei","Sossusvlei","landmark","Hardap"),
    ("deadvlei","Deadvlei","landmark","Hardap"),
    ("dune-45","Dune 45","landmark","Hardap"),
    ("fish-river-canyon","Fish River Canyon","landmark","Karas"),
    ("spitzkoppe","Spitzkoppe","landmark","Erongo"),
    ("brandberg","Brandberg Mountain","landmark","Kunene"),
    ("twyfelfontein","Twyfelfontein","landmark","Kunene"),
    ("burnt-mountain","Burnt Mountain","landmark","Kunene"),
    ("organ-pipes","Organ Pipes","landmark","Kunene"),
    ("petrified-forest","Petrified Forest","landmark","Kunene"),
    ("epupa-falls","Epupa Falls","landmark","Kunene"),
    ("ruacana-falls","Ruacana Falls","landmark","Kunene"),
    ("quiver-tree-forest","Quiver Tree Forest","landmark","Karas"),
    ("gamsberg-pass","Gamsberg Pass","landmark","Khomas"),
    ("lake-otjikoto","Lake Otjikoto","landmark","Oshikoto"),
    ("sandwich-harbour","Sandwich Harbour","landmark","Hardap"),
    ("moon-landscape","Moon Landscape","landmark","Erongo"),
    # Towns
    ("windhoek","Windhoek","town","Khomas"),
    ("swakopmund","Swakopmund","town","Erongo"),
    ("walvis-bay","Walvis Bay","town","Erongo"),
    ("luderitz","Lüderitz","town","Karas"),
    ("otjiwarongo","Otjiwarongo","town","Otjozondjupa"),
    ("tsumeb","Tsumeb","town","Oshikoto"),
    ("grootfontein","Grootfontein","town","Otjozondjupa"),
    ("mariental","Mariental","town","Hardap"),
    ("keetmanshoop","Keetmanshoop","town","Karas"),
    ("oshakati","Oshakati","town","Oshana"),
    ("ondangwa","Ondangwa","town","Oshana"),
    ("rundu","Rundu","town","Kavango East"),
    ("katima-mulilo","Katima Mulilo","town","Zambezi"),
    ("gobabis","Gobabis","town","Omaheke"),
    ("okahandja","Okahandja","town","Khomas"),
    ("karibib","Karibib","town","Erongo"),
    ("usakos","Usakos","town","Erongo"),
    ("henties-bay","Henties Bay","town","Erongo"),
    ("oranjemund","Oranjemund","town","Karas"),
    ("rosh-pinah","Rosh Pinah","town","Karas"),
    ("outjo","Outjo","town","Kunene"),
    ("rehoboth","Rehoboth","town","Hardap"),
    ("khorixas","Khorixas","town","Kunene"),
    ("opuwo","Opuwo","town","Kunene"),
    ("ongwediva","Ongwediva","town","Oshana"),
    ("omaruru","Omaruru","town","Erongo"),
    ("uis","Uis","town","Erongo"),
    ("otavi","Otavi","town","Otjozondjupa"),
    # Wildlife
    ("cape-fur-seals","Cape Fur Seals","wildlife","Erongo"),
    ("desert-elephants","Desert Elephants","wildlife","Kunene"),
    ("black-rhinos-namibia","Black Rhinoceros of Namibia","wildlife","Kunene"),
    ("wild-horses-garub","Wild Horses of Garub","wildlife","Karas"),
    ("flamingos-walvis-bay","Flamingos of Walvis Bay","wildlife","Erongo"),
    ("brown-hyenas","Brown Hyenas","wildlife","Karas"),
    # Landscapes
    ("namib-desert","Namib Desert","landscape","Hardap"),
    ("kalahari-sandveld","Kalahari Sandveld","landscape","Omaheke"),
    ("etosha-pan","Etosha Pan","landscape","Oshikoto"),
    ("kuiseb-river","Kuiseb River","landscape","Erongo"),
    ("kaokoveld","Kaokoveld","landscape","Kunene"),
    ("damaraland","Damaraland","landscape","Kunene"),
    ("namib-sand-sea","Namib Sand Sea","landscape","Hardap"),
    ("hardap-dam","Hardap Dam","landscape","Hardap"),
    ("naute-dam","Naute Dam","landscape","Karas"),
    ("swakop-river","Swakop River","landscape","Erongo"),
    ("orange-river-namibia","Orange River","landscape","Karas"),
    ("okavango-river-namibia","Okavango River","landscape","Kavango East"),
    ("zambezi-river-namibia","Zambezi River","landscape","Zambezi"),
    ("fish-river","Fish River","landscape","Karas"),
    ("kunene-river","Kunene River","landscape","Kunene"),
    # Coastal
    ("skeleton-coast","Skeleton Coast","coastal","Kunene"),
    ("walvis-bay-lagoon","Walvis Bay Lagoon","coastal","Erongo"),
    ("cape-cross","Cape Cross","coastal","Erongo"),
    ("terrace-bay","Terrace Bay","coastal","Kunene"),
    ("torra-bay","Torra Bay","coastal","Kunene"),
    ("dias-point","Dias Point","coastal","Karas"),
    ("halifax-island","Halifax Island","coastal","Karas"),
    ("ichaboe-island","Ichaboe Island","coastal","Karas"),
    # Culture
    ("himba-villages-opuwo","Himba Villages","culture","Kunene"),
    ("damara-living-museum","Damara Living Museum","culture","Kunene"),
    ("san-bushmen-tsumkwe","San Communities","culture","Otjozondjupa"),
    ("owambo-culture-oshakati","Owambo Cultural Village","culture","Oshana"),
    ("caprivi-cultural-village","Caprivi Cultural Village","culture","Zambezi"),
    ("reheboth-baster-community","Rehoboth Baster Community","culture","Hardap"),
    # History
    ("kolmanskop","Kolmanskop Ghost Town","history","Karas"),
    ("alte-feste","Alte Feste","history","Khomas"),
    ("christuskirche","Christuskirche","history","Khomas"),
    ("heros-acre","Heroes' Acre","history","Khomas"),
    ("namutoni-fort","Namutoni Fort","history","Oshikoto"),
    ("shark-island-concentration-camp","Shark Island Concentration Camp","history","Karas"),
    ("warmbad","Warmbad","history","Karas"),
    ("duwisib-castle","Duwisib Castle","history","Hardap"),
    ("windhoek-old-location","Windhoek Old Location Memorial","history","Khomas"),
]

WIKI_OVERRIDES = {
    "namib-naukluft-park":"Namib-Naukluft National Park",
    "skeleton-coast-park":"Skeleton Coast National Park",
    "skeleton-coast":"Skeleton Coast",
    "waterberg-plateau-park":"Waterberg Plateau Park",
    "ai-ais-richtersveld-park":"Ai-Ais Richtersveld Transfrontier Park",
    "sperrgebiet-national-park":"Tsau ǁKhaeb National Park",
    "cape-cross-seal-reserve":"Cape Cross",
    "spitzkoppe":"Spitzkoppe",
    "brandberg":"Brandberg Mountain",
    "twyfelfontein":"Twyfelfontein",
    "burnt-mountain":"Burnt Mountain",
    "organ-pipes":"Organ Pipes (Namibia)",
    "petrified-forest":"Petrified forest (Namibia)",
    "epupa-falls":"Epupa Falls",
    "ruacana-falls":"Ruacana Falls",
    "quiver-tree-forest":"Quiver Tree Forest",
    "gamsberg-pass":"Gamsberg Pass",
    "lake-otjikoto":"Lake Otjikoto",
    "sandwich-harbour":"Sandwich Harbour",
    "moon-landscape":"Moon Landscape",
    "luderitz":"Lüderitz",
    "rehoboth":"Rehoboth, Namibia",
    "uis":"Uis",
    "cape-fur-seals":"Cape fur seal",
    "desert-elephants":"Desert elephant",
    "black-rhinos-namibia":"Southwestern black rhinoceros",
    "wild-horses-garub":"Namib desert horse",
    "flamingos-walvis-bay":"Greater flamingo",
    "brown-hyenas":"Brown hyena",
    "namib-desert":"Namib",
    "kalahari-sandveld":"Kalahari Desert",
    "etosha-pan":"Etosha Pan",
    "kuiseb-river":"Kuiseb River",
    "kaokoveld":"Kaokoland",
    "damaraland":"Damaraland",
    "namib-sand-sea":"Namib Sand Sea",
    "hardap-dam":"Hardap Dam",
    "naute-dam":"Naute Dam",
    "swakop-river":"Swakop River",
    "orange-river-namibia":"Orange River",
    "okavango-river-namibia":"Okavango River",
    "zambezi-river-namibia":"Zambezi River",
    "fish-river":"Fish River (Namibia)",
    "kunene-river":"Cunene River",
    "walvis-bay-lagoon":"Walvis Bay",
    "cape-cross":"Cape Cross",
    "terrace-bay":"Terrace Bay",
    "torra-bay":"Torra Bay",
    "dias-point":"Dias Point",
    "halifax-island":"Halifax Island (Namibia)",
    "ichaboe-island":"Ichaboe Island",
    "himba-villages-opuwo":"Himba people",
    "damara-living-museum":"Damara (Namibia)",
    "san-bushmen-tsumkwe":"San people",
    "owambo-culture-oshakati":"Ovambo people",
    "caprivi-cultural-village":"Lozi people",
    "reheboth-baster-community":"Baster",
    "kolmanskop":"Kolmanskop",
    "alte-feste":"Alte Feste",
    "christuskirche":"Christuskirche",
    "heros-acre":"Heroes' Acre",
    "namutoni-fort":"Namutoni",
    "shark-island-concentration-camp":"Shark Island concentration camp",
    "warmbad":"Warmbad, Namibia",
    "duwisib-castle":"Duwisib Castle",
    "windhoek-old-location":"Old Location",
    "khorixas":"Khorixas",
    "opuwo":"Opuwo",
    "deadvlei":"Deadvlei",
    "dune-45":"Dune 45",
    "fish-river-canyon":"Fish River Canyon",
    "etosha-national-park":"Etosha National Park",
    "dorob-national-park":"Dorob National Park",
    "bwabwata-national-park":"Bwabwata National Park",
    "mudumu-national-park":"Mudumu National Park",
    "nkasa-rupara-national-park":"Nkasa Rupara National Park",
    "khaudum-national-park":"Khaudum National Park",
    "windhoek":"Windhoek",
    "swakopmund":"Swakopmund",
    "walvis-bay":"Walvis Bay",
    "otjiwarongo":"Otjiwarongo",
    "tsumeb":"Tsumeb",
    "grootfontein":"Grootfontein",
    "mariental":"Mariental",
    "keetmanshoop":"Keetmanshoop",
    "oshakati":"Oshakati",
    "ondangwa":"Ondangwa",
    "rundu":"Rundu",
    "katima-mulilo":"Katima Mulilo",
    "gobabis":"Gobabis",
    "okahandja":"Okahandja",
    "karibib":"Karibib",
    "usakos":"Usakos",
    "henties-bay":"Henties Bay",
    "oranjemund":"Oranjemund",
    "rosh-pinah":"Rosh Pinah",
    "outjo":"Outjo",
    "ongwediva":"Ongwediva",
    "omaruru":"Omaruru",
    "otavi":"Otavi",
}

def fetch_wiki(title):
    url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{urllib.parse.quote(title)}"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r:
            if r.status != 200: return {}
            d = json.load(r)
        if d.get("type") == "disambiguation": return {"extract":"","disambig":True}
        return {
            "extract": d.get("extract",""),
            "url": d.get("content_urls",{}).get("desktop",{}).get("page",""),
            "thumb": d.get("thumbnail",{}).get("source") if d.get("thumbnail") else None,
        }
    except: return {}

def fetch_lead_image(title):
    url = f"https://en.wikipedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=pageimages&piprop=thumbnail&pithumbsize=1200&format=json"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as r:
            if r.status != 200: return None
            d = json.load(r)
        pages = (d.get("query") or {}).get("pages",{})
        for _,p in pages.items():
            t = p.get("thumbnail")
            if t and t.get("source"): return t["source"]
    except: pass
    return None

def main():
    print(f"Building {len(PLACES)} places...")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    results, failures = [], []
    for i,(slug,name,cat,region) in enumerate(PLACES,1):
        wt = WIKI_OVERRIDES.get(slug, name)
        print(f"[{i:3d}/{len(PLACES)}] {name} → '{wt}'")
        wiki = fetch_wiki(wt)
        if not wiki or wiki.get("disambig") or not wiki.get("extract"):
            wiki2 = fetch_wiki(f"{wt} (Namibia)")
            if wiki2 and not wiki2.get("disambig") and wiki2.get("extract"):
                wiki = wiki2
            else:
                failures.append((slug,name,"no extract")); continue
        extract = wiki["extract"]
        if len(extract) < 80:
            failures.append((slug,name,f"short ({len(extract)})")); continue
        img = wiki.get("thumb") or fetch_lead_image(wt)
        image_meta = None
        if img:
            image_meta = {"url":img,"alt":f"{name}, Namibia","credit":"Wikipedia / Wikimedia Commons","sourceUrl":wiki.get("url",""),"license":"CC-BY-SA 4.0"}
        # Split extract into 2-3 paragraphs
        sentences = re.split(r"(?<=[.!?])\s+", extract.strip())
        if len(sentences) >= 4:
            chunks = []
            for j in range(0, len(sentences), 3):
                chunks.append(" ".join(sentences[j:j+3]))
            body = "\n\n".join(chunks)
        else:
            body = extract
        facts = [
            {"label":"Region","value":region},
            {"label":"Category","value":cat.title()},
        ]
        m = re.search(r"\b(1[4-9]\d{2}|20\d{2})\b", extract)
        if m: facts.append({"label":"First referenced","value":m.group(1)})
        results.append({
            "slug":slug,"name":name,"category":cat,"region":region,
            "summary": extract.split(". ")[0]+"." if "." in extract else extract[:160],
            "description": body,
            "keyFacts": facts,
            "coordinates": None,
            "image": image_meta,
            "sources": [{"name":"Wikipedia","url":wiki.get("url",""),"license":"CC-BY-SA 4.0"}],
        })
        time.sleep(0.05)
    print(f"\n{len(results)} places with content; {len(failures)} failures:")
    for s,n,r in failures: print(f"  ✗ {n}: {r}", file=sys.stderr)
    # Write TypeScript
    ts = [
        "/**",
        " * Times of Namibia — Static directory data.",
        " * Generated by scripts/build_places_data.py from Wikipedia + Wikimedia Commons.",
        " * All content licensed CC-BY-SA 4.0 (inherited from Wikipedia).",
        " */",
        "",
        "export type PlaceCategory = 'park' | 'landmark' | 'town' | 'wildlife' | 'landscape' | 'coastal' | 'culture' | 'history';",
        "",
        "export interface PlaceKeyFact { label: string; value: string; }",
        "export interface PlaceImage { url: string; alt: string; credit: string; sourceUrl: string; license: string; }",
        "export interface PlaceSource { name: string; url: string; license: string; }",
        "export interface Place {",
        "  slug: string; name: string; category: PlaceCategory; region: string;",
        "  summary: string; description: string; keyFacts: PlaceKeyFact[];",
        "  coordinates: { lat: number; lng: number } | null;",
        "  image: PlaceImage | null; sources: PlaceSource[];",
        "}",
        "",
        "export const places: Place[] = " + json.dumps(results, indent=2, ensure_ascii=False) + ";",
        "",
        "export const placeCategories: PlaceCategory[] = ['park','landmark','town','wildlife','landscape','coastal','culture','history'];",
        "",
        "export function getPlaceBySlug(slug: string): Place | undefined { return places.find((p) => p.slug === slug); }",
        "export function getPlacesByCategory(category: PlaceCategory): Place[] { return places.filter((p) => p.category === category); }",
        "export function getRelatedPlaces(slug: string, limit = 4): Place[] {",
        "  const current = getPlaceBySlug(slug); if (!current) return [];",
        "  return places.filter((p) => p.slug !== slug && p.category === current.category).slice(0, limit);",
        "}",
        "",
    ]
    OUT.write_text("\n".join(ts))
    print(f"\nWrote {OUT} ({len(results)} places)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
