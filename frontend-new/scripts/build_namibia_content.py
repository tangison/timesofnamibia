#!/usr/bin/env python3
"""
Times of Namibia — Massive Namibian content scraper.
Fetches hundreds of articles from Wikipedia REST API covering ALL aspects
of Namibia: places, history, culture, politics, economy, wildlife, geography,
historical figures, education, infrastructure, and more.

Output: src/data/namibia.ts — typed static content for the Know Namibia directory.
"""
import json, re, sys, time, urllib.parse, urllib.request
from pathlib import Path

USER_AGENT = "TimesOfNamibiaBot/1.0 (https://ton.tangison.com; contact@timesofnamibia.com)"
HEADERS = {"User-Agent": USER_AGENT, "Accept": "application/json"}
OUT = Path("/home/z/my-project/timesofnamibia/frontend-new/src/data/namibia.ts")

# ============================================================
# CATEGORIES — each topic has (slug, name, category, subcategory, wiki_title)
# ============================================================

TOPICS = [
    # ─── PARKS & RESERVES ─────────────────────────────────────
    ("etosha-national-park", "Etosha National Park", "parks", "national-parks", "Etosha National Park"),
    ("namib-naukluft-park", "Namib-Naukluft Park", "parks", "national-parks", "Namib-Naukluft National Park"),
    ("skeleton-coast-park", "Skeleton Coast Park", "parks", "national-parks", "Skeleton Coast National Park"),
    ("waterberg-plateau-park", "Waterberg Plateau Park", "parks", "national-parks", "Waterberg Plateau Park"),
    ("dorob-national-park", "Dorob National Park", "parks", "national-parks", "Dorob National Park"),
    ("bwabwata-national-park", "Bwabwata National Park", "parks", "national-parks", "Bwabwata National Park"),
    ("mudumu-national-park", "Mudumu National Park", "parks", "national-parks", "Mudumu National Park"),
    ("nkasa-rupara-national-park", "Nkasa Rupara National Park", "parks", "national-parks", "Nkasa Rupara National Park"),
    ("khaudum-national-park", "Khaudum National Park", "parks", "national-parks", "Khaudum National Park"),
    ("ai-ais-richtersveld-park", "Ai-Ais Richtersveld Park", "parks", "national-parks", "Ai-Ais Richtersveld Transfrontier Park"),
    ("cape-cross-seal-reserve", "Cape Cross Seal Reserve", "parks", "national-parks", "Cape Cross"),
    ("sperrgebiet-national-park", "Tsau ǁKhaeb National Park", "parks", "national-parks", "Tsau ǁKhaeb National Park"),
    ("mamili-national-park", "Mamili National Park", "parks", "national-parks", "Nkasa Rupara National Park"),
    ("hardap-game-reserve", "Hardap Game Reserve", "parks", "national-parks", "Hardap Dam"),

    # ─── LANDMARKS & NATURAL WONDERS ──────────────────────────
    ("sossusvlei", "Sossusvlei", "landmarks", "natural-wonders", "Sossusvlei"),
    ("deadvlei", "Deadvlei", "landmarks", "natural-wonders", "Deadvlei"),
    ("dune-45", "Dune 45", "landmarks", "natural-wonders", "Dune 45"),
    ("fish-river-canyon", "Fish River Canyon", "landmarks", "natural-wonders", "Fish River Canyon"),
    ("spitzkoppe", "Spitzkoppe", "landmarks", "natural-wonders", "Spitzkoppe"),
    ("brandberg-mountain", "Brandberg Mountain", "landmarks", "natural-wonders", "Brandberg Mountain"),
    ("twyfelfontein", "Twyfelfontein", "landmarks", "natural-wonders", "Twyfelfontein"),
    ("burnt-mountain", "Burnt Mountain", "landmarks", "natural-wonders", "Burnt Mountain"),
    ("organ-pipes", "Organ Pipes", "landmarks", "natural-wonders", "Organ Pipes (Namibia)"),
    ("petrified-forest", "Petrified Forest", "landmarks", "natural-wonders", "Petrified forest (Namibia)"),
    ("epupa-falls", "Epupa Falls", "landmarks", "natural-wonders", "Epupa Falls"),
    ("ruacana-falls", "Ruacana Falls", "landmarks", "natural-wonders", "Ruacana Falls"),
    ("quiver-tree-forest", "Quiver Tree Forest", "landmarks", "natural-wonders", "Quiver Tree Forest"),
    ("gamsberg-pass", "Gamsberg Pass", "landmarks", "natural-wonders", "Gamsberg Pass"),
    ("lake-otjikoto", "Lake Otjikoto", "landmarks", "natural-wonders", "Lake Otjikoto"),
    ("lake-oshikoto", "Lake Oshikoto", "landmarks", "natural-wonders", "Lake Oshikoto"),
    ("sandwich-harbour", "Sandwich Harbour", "landmarks", "natural-wonders", "Sandwich Harbour"),
    ("moon-landscape", "Moon Landscape", "landmarks", "natural-wonders", "Moon Landscape"),
    ("vingerklip", "Vingerklip", "landmarks", "natural-wonders", "Vingerklip"),
    ("kalke-eiland", "Kalkkeiland", "landmarks", "natural-wonders", "Kalkkeiland"),

    # ─── TOWNS & CITIES ───────────────────────────────────────
    ("windhoek", "Windhoek", "towns", "cities", "Windhoek"),
    ("swakopmund", "Swakopmund", "towns", "cities", "Swakopmund"),
    ("walvis-bay", "Walvis Bay", "towns", "cities", "Walvis Bay"),
    ("luderitz", "Lüderitz", "towns", "cities", "Lüderitz"),
    ("otjiwarongo", "Otjiwarongo", "towns", "cities", "Otjiwarongo"),
    ("tsumeb", "Tsumeb", "towns", "cities", "Tsumeb"),
    ("grootfontein", "Grootfontein", "towns", "cities", "Grootfontein"),
    ("mariental", "Mariental", "towns", "cities", "Mariental"),
    ("keetmanshoop", "Keetmanshoop", "towns", "cities", "Keetmanshoop"),
    ("oshakati", "Oshakati", "towns", "cities", "Oshakati"),
    ("ondangwa", "Ondangwa", "towns", "cities", "Ondangwa"),
    ("rundu", "Rundu", "towns", "cities", "Rundu"),
    ("katima-mulilo", "Katima Mulilo", "towns", "cities", "Katima Mulilo"),
    ("gobabis", "Gobabis", "towns", "cities", "Gobabis"),
    ("okahandja", "Okahandja", "towns", "cities", "Okahandja"),
    ("karibib", "Karibib", "towns", "cities", "Karibib"),
    ("usakos", "Usakos", "towns", "cities", "Usakos"),
    ("henties-bay", "Henties Bay", "towns", "cities", "Henties Bay"),
    ("oranjemund", "Oranjemund", "towns", "cities", "Oranjemund"),
    ("rosh-pinah", "Rosh Pinah", "towns", "cities", "Rosh Pinah"),
    ("outjo", "Outjo", "towns", "cities", "Outjo"),
    ("rehoboth", "Rehoboth", "towns", "cities", "Rehoboth, Namibia"),
    ("khorixas", "Khorixas", "towns", "cities", "Khorixas"),
    ("opuwo", "Opuwo", "towns", "cities", "Opuwo"),
    ("ongwediva", "Ongwediva", "towns", "cities", "Ongwediva"),
    ("omaruru", "Omaruru", "towns", "cities", "Omaruru"),
    ("uis", "Uis", "towns", "cities", "Uis"),
    ("otavi", "Otavi", "towns", "cities", "Otavi"),
    ("gochaganach", "Gochas", "towns", "cities", "Gochas"),
    ("maltahohe", "Maltahöhe", "towns", "cities", "Maltahöhe"),
    ("arandis", "Arandis", "towns", "cities", "Arandis"),
    ("kamanjab", "Kamanjab", "towns", "cities", "Kamanjab"),
    ("leonardville", "Leonardville", "towns", "cities", "Leonardville"),
    ("tsumkwe", "Tsumkwe", "towns", "cities", "Tsumkwe"),
    ("eenhana", "Eenhana", "towns", "cities", "Eenhana"),
    ("helao-nafidi", "Helao Nafidi", "towns", "cities", "Helao Nafidi"),
    ("oshikango", "Oshikango", "towns", "cities", "Oshikango"),
    ("nkurenkuru", "Nkurenkuru", "towns", "cities", "Nkurenkuru"),

    # ─── REGIONS ──────────────────────────────────────────────
    ("khomas-region", "Khomas Region", "regions", "administrative", "Khomas Region"),
    ("erongo-region", "Erongo Region", "regions", "administrative", "Erongo Region"),
    ("oshikoto-region", "Oshikoto Region", "regions", "administrative", "Oshikoto Region"),
    ("oshana-region", "Oshana Region", "regions", "administrative", "Oshana Region"),
    ("ohangwena-region", "Ohangwena Region", "regions", "administrative", "Ohangwena Region"),
    ("omusati-region", "Omusati Region", "regions", "administrative", "Omusati Region"),
    ("kunene-region", "Kunene Region", "regions", "administrative", "Kunene Region"),
    ("otjozondjupa-region", "Otjozondjupa Region", "regions", "administrative", "Otjozondjupa Region"),
    ("kavango-east-region", "Kavango East Region", "regions", "administrative", "Kavango East Region"),
    ("kavango-west-region", "Kavango West Region", "regions", "administrative", "Kavango West Region"),
    ("zambezi-region", "Zambezi Region", "regions", "administrative", "Zambezi Region"),
    ("hardap-region", "Hardap Region", "regions", "administrative", "Hardap Region"),
    ("karas-region", "Karas Region", "regions", "administrative", "ǁKaras Region"),
    ("omaheke-region", "Omaheke Region", "regions", "administrative", "Omaheke Region"),

    # ─── HISTORY ──────────────────────────────────────────────
    ("german-south-west-africa", "German South West Africa", "history", "colonial", "German South West Africa"),
    ("namibian-war-of-independence", "Namibian War of Independence", "history", "independence", "Namibian War of Independence"),
    ("south-west-africa", "South West Africa", "history", "colonial", "South West Africa"),
    ("independence-of-namibia", "Independence of Namibia", "history", "independence", "Independence of Namibia"),
    ("herero-and-namaqua-genocide", "Herero and Namaqua Genocide", "history", "colonial", "Herero and Namaqua genocide"),
    ("battle-of-waterberg", "Battle of Waterberg", "history", "colonial", "Battle of Waterberg"),
    ("shark-island-concentration-camp", "Shark Island Concentration Camp", "history", "colonial", "Shark Island concentration camp"),
    ("mandate-for-south-west-africa", "South West Africa Mandate", "history", "colonial", "South West Africa"),
    ("turnhalle-conference", "Turnhalle Conference", "history", "independence", "Turnhalle Constitutional Conference"),
    ("transition-period-1989", "1989 Transition Period", "history", "independence", "1989 in South West Africa"),
    ("namibian-constitution", "Namibian Constitution", "history", "independence", "Constitution of Namibia"),

    # ─── CULTURE & ETHNIC GROUPS ──────────────────────────────
    ("ovambo-people", "Ovambo People", "culture", "ethnic-groups", "Ovambo people"),
    ("herero-people", "Herero People", "culture", "ethnic-groups", "Herero people"),
    ("himba-people", "Himba People", "culture", "ethnic-groups", "Himba people"),
    ("nama-people", "Nama People", "culture", "ethnic-groups", "Nama people"),
    ("damara-people", "Damara People", "culture", "ethnic-groups", "Damara people"),
    ("kavango-people", "Kavango People", "culture", "ethnic-groups", "Kavango people"),
    ("lozi-people", "Lozi People", "culture", "ethnic-groups", "Lozi people"),
    ("san-people", "San People", "culture", "ethnic-groups", "San people"),
    ("baster-community", "Baster Community", "culture", "ethnic-groups", "Baster"),
    ("german-namibians", "German-Namibians", "culture", "ethnic-groups", "German-Namibians"),
    ("afrikaner-namibians", "Afrikaner-Namibians", "culture", "ethnic-groups", "Afrikaners in Namibia"),
    ("coloured-namibians", "Coloured Namibians", "culture", "ethnic-groups", "Multiracial people in Namibia"),
    ("tswana-namibians", "Tswana Namibians", "culture", "ethnic-groups", "Tswana people"),

    # ─── LANGUAGES ────────────────────────────────────────────
    ("oshiwambo-language", "Oshiwambo Language", "culture", "languages", "Oshiwambo"),
    ("khoekhoe-language", "Khoekhoe Language", "culture", "languages", "Khoekhoe language"),
    ("herero-language", "Herero Language", "culture", "languages", "Herero language"),
    ("kwangali-language", "Kwangali Language", "culture", "languages", "Kwangali language"),
    ("lozi-language", "Lozi (Silozi) Language", "culture", "languages", "Lozi language"),
    ("ndonga-dialect", "Ndonga Dialect", "culture", "languages", "Ndonga dialect"),
    ("kwanyama-dialect", "Kwanyama Dialect", "culture", "languages", "Kwanyama dialect"),

    # ─── POLITICS & GOVERNMENT ────────────────────────────────
    ("government-of-namibia", "Government of Namibia", "politics", "government", "Government of Namibia"),
    ("president-of-namibia", "President of Namibia", "politics", "government", "President of Namibia"),
    ("national-assembly-of-namibia", "National Assembly of Namibia", "politics", "government", "National Assembly (Namibia)"),
    ("national-council-of-namibia", "National Council of Namibia", "politics", "government", "National Council of Namibia"),
    ("swapo", "SWAPO Party", "politics", "parties", "SWAPO"),
    ("popular-democratic-movement", "Popular Democratic Movement", "politics", "parties", "Popular Democratic Movement"),
    ("land-reform-in-namibia", "Land Reform in Namibia", "politics", "policy", "Land reform in Namibia"),
    ("namibian-elections", "Elections in Namibia", "politics", "elections", "Elections in Namibia"),
    ("1989-namibian-election", "1989 Independence Election", "politics", "elections", "1989 Namibian parliamentary election"),
    ("foreign-relations-of-namibia", "Foreign Relations of Namibia", "politics", "foreign-policy", "Foreign relations of Namibia"),

    # ─── HISTORICAL FIGURES ───────────────────────────────────
    ("sam-nujoma", "Sam Nujoma", "people", "leaders", "Sam Nujoma"),
    ("hifikepunye-pohamba", "Hifikepunye Pohamba", "people", "leaders", "Hifikepunye Pohamba"),
    ("hage-geingob", "Hage Geingob", "people", "leaders", "Hage Geingob"),
    ("netumbo-nandi-ndaitwah", "Netumbo Nandi-Ndaitwah", "people", "leaders", "Netumbo Nandi-Ndaitwah"),
    ("andimba-toivo-ya-toivo", "Andimba Toivo ya Toivo", "people", "leaders", "Andimba Toivo ya Toivo"),
    ("hendrik-witbooi", "Hendrik Witbooi", "people", "leaders", "Hendrik Witbooi"),
    ("samuel-maharero", "Samuel Maharero", "people", "leaders", "Samuel Maharero"),
    ("jacob-morenga", "Jacob Morenga", "people", "leaders", "Jacob Morenga"),
    ("mandume-ya-ndemufayo", "Mandume ya Ndemufayo", "people", "leaders", "Mandume ya Ndemufayo"),
    ("theodore-leutwein", "Theodor Leutwein", "people", "colonial", "Theodor Leutwein"),
    ("lothar-von-trotha", "Lothar von Trotha", "people", "colonial", "Lothar von Trotha"),

    # ─── ECONOMY ──────────────────────────────────────────────
    ("economy-of-namibia", "Economy of Namibia", "economy", "overview", "Economy of Namibia"),
    ("mining-in-namibia", "Mining in Namibia", "economy", "mining", "Mining in Namibia"),
    ("diamond-mining-namibia", "Diamond Mining in Namibia", "economy", "mining", "Debmarine Namibia"),
    ("uranium-mining-namibia", "Uranium Mining in Namibia", "economy", "mining", "Rössing Uranium Mine"),
    ("rossing-mine", "Rössing Uranium Mine", "economy", "mining", "Rössing Uranium Mine"),
    ("husab-mine", "Husab Mine", "economy", "mining", "Husab Mine"),
    ("agriculture-in-namibia", "Agriculture in Namibia", "economy", "agriculture", "Agriculture in Namibia"),
    ("fishing-industry-namibia", "Fishing Industry in Namibia", "economy", "fishing", "Fishing in Namibia"),
    ("tourism-in-namibia", "Tourism in Namibia", "economy", "tourism", "Tourism in Namibia"),
    ("namibian-dollar", "Namibian Dollar", "economy", "currency", "Namibian dollar"),
    ("bank-of-namibia", "Bank of Namibia", "economy", "banking", "Bank of Namibia"),
    ("windhoek-stock-exchange", "Namibian Stock Exchange", "economy", "finance", "Namibian Stock Exchange"),
    ("green-hydrogen-namibia", "Green Hydrogen Economy", "economy", "energy", "Green hydrogen in Namibia"),

    # ─── WILDLIFE ─────────────────────────────────────────────
    ("desert-elephant", "Desert Elephant", "wildlife", "mammals", "Desert elephant"),
    ("black-rhinoceros-namibia", "Black Rhinoceros", "wildlife", "mammals", "Southwestern black rhinoceros"),
    ("white-rhinoceros-namibia", "White Rhinoceros", "wildlife", "mammals", "Southern white rhinoceros"),
    ("desert-lion", "Desert-Adapted Lion", "wildlife", "mammals", "Desert lion"),
    ("cape-fur-seal", "Cape Fur Seal", "wildlife", "marine", "Cape fur seal"),
    ("gemsbok", "Gemsbok (Oryx)", "wildlife", "mammals", "Gemsbok"),
    ("springbok", "Springbok", "wildlife", "mammals", "Springbok (antelope)"),
    ("hartmanns-mountain-zebra", "Hartmann's Mountain Zebra", "wildlife", "mammals", "Hartmann's mountain zebra"),
    ("cheetah-namibia", "Namibian Cheetah", "wildlife", "mammals", "Cheetah"),
    ("leopard-namibia", "Leopard in Namibia", "wildlife", "mammals", "African leopard"),
    ("african-buffalo-namibia", "African Buffalo", "wildlife", "mammals", "African buffalo"),
    ("greater-flamingo-namibia", "Greater Flamingo", "wildlife", "birds", "Greater flamingo"),
    ("lesser-flamingo-namibia", "Lesser Flamingo", "wildlife", "birds", "Lesser flamingo"),
    ("cape-vulture", "Cape Vulture", "wildlife", "birds", "Cape vulture"),
    ("brown-hyena", "Brown Hyena", "wildlife", "mammals", "Brown hyena"),
    ("wild-horses-garub", "Wild Horses of Garub", "wildlife", "mammals", "Namib desert horse"),
    ("dolphin-walvis-bay", "Dolphins of Walvis Bay", "wildlife", "marine", "Bottlenose dolphin"),

    # ─── GEOGRAPHY & LANDSCAPES ───────────────────────────────
    ("namib-desert", "Namib Desert", "geography", "deserts", "Namib"),
    ("kalahari-desert", "Kalahari Desert", "geography", "deserts", "Kalahari Desert"),
    ("namib-sand-sea", "Namib Sand Sea", "geography", "deserts", "Namib Sand Sea"),
    ("etosha-pan", "Etosha Pan", "geography", "geological", "Etosha Pan"),
    ("kuiseb-river", "Kuiseb River", "geography", "rivers", "Kuiseb River"),
    ("swakop-river", "Swakop River", "geography", "rivers", "Swakop River"),
    ("orange-river", "Orange River", "geography", "rivers", "Orange River"),
    ("okavango-river", "Okavango River", "geography", "rivers", "Okavango River"),
    ("zambezi-river", "Zambezi River", "geography", "rivers", "Zambezi River"),
    ("fish-river", "Fish River", "geography", "rivers", "Fish River (Namibia)"),
    ("kunene-river", "Kunene River", "geography", "rivers", "Cunene River"),
    ("kaokoveld", "Kaokoveld", "geography", "regions", "Kaokoland"),
    ("damaraland", "Damaraland", "geography", "regions", "Damaraland"),
    ("caprivi-strip", "Caprivi Strip", "geography", "regions", "Caprivi Strip"),
    ("bushmanland", "Bushmanland", "geography", "regions", "Tsumkwe"),
    ("hardap-dam", "Hardap Dam", "geography", "dams", "Hardap Dam"),
    ("naute-dam", "Naute Dam", "geography", "dams", "Naute Dam"),
    ("skeleton-coast", "Skeleton Coast", "geography", "coastal", "Skeleton Coast"),

    # ─── EDUCATION ────────────────────────────────────────────
    ("university-of-namibia", "University of Namibia", "education", "universities", "University of Namibia"),
    ("namibia-university-of-science-and-technology", "Namibia University of Science and Technology", "education", "universities", "Namibia University of Science and Technology"),
    ("international-university-of-management", "International University of Management", "education", "universities", "International University of Management"),

    # ─── INFRASTRUCTURE ───────────────────────────────────────
    ("windhoek-airport", "Hosea Kutako International Airport", "infrastructure", "airports", "Hosea Kutako International Airport"),
    ("walvis-bay-port", "Port of Walvis Bay", "infrastructure", "ports", "Port of Walvis Bay"),
    ("trans-kalahari-corridor", "Trans-Kalahari Corridor", "infrastructure", "roads", "Trans-Kalahari Corridor"),
    ("trans-caprivi-highway", "Trans-Caprivi Highway", "infrastructure", "roads", "Trans-Caprivi Highway"),

    # ─── COASTAL FEATURES ─────────────────────────────────────
    ("walvis-bay-lagoon", "Walvis Bay Lagoon", "coastal", "coastal-features", "Walvis Bay"),
    ("cape-cross", "Cape Cross", "coastal", "coastal-features", "Cape Cross"),
    ("terrace-bay", "Terrace Bay", "coastal", "coastal-features", "Terrace Bay"),
    ("torra-bay", "Torra Bay", "coastal", "coastal-features", "Torra Bay"),
    ("dias-point", "Dias Point", "coastal", "coastal-features", "Dias Point"),
    ("halifax-island", "Halifax Island", "coastal", "islands", "Halifax Island (Namibia)"),
    ("ichaboe-island", "Ichaboe Island", "coastal", "islands", "Ichaboe Island"),

    # ─── HISTORICAL SITES ─────────────────────────────────────
    ("kolmanskop", "Kolmanskop Ghost Town", "history", "historical-sites", "Kolmanskop"),
    ("alte-feste", "Alte Feste", "history", "historical-sites", "Alte Feste"),
    ("christuskirche", "Christuskirche", "history", "historical-sites", "Christuskirche"),
    ("heros-acre", "Heroes' Acre", "history", "historical-sites", "Heroes' Acre"),
    ("namutoni-fort", "Namutoni Fort", "history", "historical-sites", "Namutoni"),
    ("duwisib-castle", "Duwisib Castle", "history", "historical-sites", "Duwisib Castle"),
    ("warmbad", "Warmbad", "history", "historical-sites", "Warmbad, Namibia"),
    ("windhoek-old-location", "Windhoek Old Location Memorial", "history", "historical-sites", "Old Location"),
    ("tsumeb-mine", "Tsumeb Mine", "history", "historical-sites", "Tsumeb Mine"),
]

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

def expand_extract(extract):
    sentences = re.split(r"(?<=[.!?])\s+", extract.strip())
    if len(sentences) >= 4:
        chunks = []
        for j in range(0, len(sentences), 3):
            chunks.append(" ".join(sentences[j:j+3]))
        return "\n\n".join(chunks)
    return extract

def derive_facts(name, category, subcategory, extract):
    facts = [
        {"label":"Category","value":category.replace("-"," ").title()},
        {"label":"Type","value":subcategory.replace("-"," ").title()},
    ]
    m = re.search(r"\b(1[4-9]\d{2}|20\d{2})\b", extract)
    if m: facts.append({"label":"First referenced","value":m.group(1)})
    pm = re.search(r"population of (\d[\d,]*)", extract, re.IGNORECASE)
    if pm: facts.append({"label":"Population","value":pm.group(1)})
    return facts

def main():
    print(f"Building {len(TOPICS)} Namibian topics...")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    results, failures = [], []
    for i,(slug,name,cat,subcat,wt) in enumerate(TOPICS,1):
        if i % 20 == 0: print(f"  [{i}/{len(TOPICS)}]...")
        wiki = fetch_wiki(wt)
        if not wiki or wiki.get("disambig") or not wiki.get("extract"):
            wiki2 = fetch_wiki(f"{wt} (Namibia)")
            if wiki2 and not wiki2.get("disambig") and wiki2.get("extract"):
                wiki = wiki2
            else:
                failures.append((slug,name,"no extract")); continue
        extract = wiki["extract"]
        if len(extract) < 60:
            failures.append((slug,name,f"short ({len(extract)})")); continue
        img = wiki.get("thumb") or fetch_lead_image(wt)
        image_meta = {"url":img,"alt":f"{name}, Namibia","credit":"Wikipedia / Wikimedia Commons","sourceUrl":wiki.get("url",""),"license":"CC-BY-SA 4.0"} if img else None
        body = expand_extract(extract)
        facts = derive_facts(name, cat, subcat, extract)
        results.append({
            "slug":slug,"name":name,"category":cat,"subcategory":subcat,
            "summary": extract.split(". ")[0]+"." if "." in extract else extract[:160],
            "description": body,
            "keyFacts": facts,
            "coordinates": None,
            "image": image_meta,
            "sources": [{"name":"Wikipedia","url":wiki.get("url",""),"license":"CC-BY-SA 4.0"}],
        })
        time.sleep(0.03)
    print(f"\n{len(results)} topics with content; {len(failures)} failures:")
    for s,n,r in failures[:20]: print(f"  ✗ {n}: {r}", file=sys.stderr)
    # Write TypeScript
    ts = [
        "/**",
        " * Times of Namibia — Comprehensive static Namibia content.",
        " * Generated by scripts/build_namibia_content.py from Wikipedia REST API.",
        " * All content licensed CC-BY-SA 4.0 (inherited from Wikipedia).",
        " */",
        "",
        "export type NamibiaCategory = 'parks' | 'landmarks' | 'towns' | 'regions' | 'history' | 'culture' | 'politics' | 'people' | 'economy' | 'wildlife' | 'geography' | 'education' | 'infrastructure' | 'coastal';",
        "",
        "export interface NamibiaKeyFact { label: string; value: string; }",
        "export interface NamibiaImage { url: string; alt: string; credit: string; sourceUrl: string; license: string; }",
        "export interface NamibiaSource { name: string; url: string; license: string; }",
        "export interface NamibiaTopic {",
        "  slug: string; name: string; category: NamibiaCategory; subcategory: string;",
        "  summary: string; description: string; keyFacts: NamibiaKeyFact[];",
        "  coordinates: { lat: number; lng: number } | null;",
        "  image: NamibiaImage | null; sources: NamibiaSource[];",
        "}",
        "",
        "export const topics: NamibiaTopic[] = " + json.dumps(results, indent=2, ensure_ascii=False) + ";",
        "",
        "export const categories: NamibiaCategory[] = ['parks','landmarks','towns','regions','history','culture','politics','people','economy','wildlife','geography','education','infrastructure','coastal'];",
        "",
        "export const categoryLabels: Record<NamibiaCategory, string> = {",
        "  parks: 'Parks & Reserves', landmarks: 'Landmarks', towns: 'Towns & Cities', regions: 'Regions',",
        "  history: 'History', culture: 'Culture & People', politics: 'Politics & Government', people: 'Notable Figures',",
        "  economy: 'Economy & Mining', wildlife: 'Wildlife', geography: 'Geography', education: 'Education',",
        "  infrastructure: 'Infrastructure', coastal: 'Coastal Features',",
        "};",
        "",
        "export function getTopicBySlug(slug: string): NamibiaTopic | undefined { return topics.find((t) => t.slug === slug); }",
        "export function getTopicsByCategory(category: NamibiaCategory): NamibiaTopic[] { return topics.filter((t) => t.category === category); }",
        "export function getRelatedTopics(slug: string, limit = 4): NamibiaTopic[] {",
        "  const current = getTopicBySlug(slug); if (!current) return [];",
        "  return topics.filter((t) => t.slug !== slug && t.category === current.category).slice(0, limit);",
        "}",
        "",
    ]
    OUT.write_text("\n".join(ts))
    print(f"\nWrote {OUT} ({len(results)} topics)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
