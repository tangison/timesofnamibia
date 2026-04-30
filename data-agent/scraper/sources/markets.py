# ============================================================
# Times of Namibia — Market Data Source
# Fetches currency rates, stock indices, commodity prices
# ============================================================

import requests
from datetime import datetime, timezone
from scraper.filters import is_relevant

HEADERS = {
    "User-Agent": "TimesOfNamibiaBot/2.0 (+https://ton.na; data-agent)",
}


def fetch() -> list[dict]:
    """
    Fetch market data: currency exchange rates, stock indices,
    and commodity prices relevant to Namibia.
    Returns normalised market data items.
    """
    results = []

    # ── Exchange Rate API (free) ───────────────────────────────
    try:
        # Using exchangerate-api or similar free API
        rate_url = "https://api.exchangerate-api.com/v4/latest/USD"
        resp = requests.get(rate_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            rates = data.get("rates", {})

            # NAD is pegged 1:1 to ZAR (CMA agreement)
            zar_rate = rates.get("ZAR", 0)
            eur_rate = rates.get("EUR", 0)
            gbp_rate = rates.get("GBP", 0)

            nad_pairs = [
                {"pair": "USD/NAD", "rate": f"{zar_rate:.2f}", "source": "BoN"},
                {"pair": "EUR/NAD", "rate": f"{zar_rate / eur_rate:.2f}" if eur_rate else "N/A", "source": "BoN"},
                {"pair": "GBP/NAD", "rate": f"{zar_rate / gbp_rate:.2f}" if gbp_rate else "N/A", "source": "BoN"},
                {"pair": "ZAR/NAD", "rate": "1.00", "source": "CMA"},
            ]

            for pair_data in nad_pairs:
                results.append({
                    "name": pair_data["pair"],
                    "url": "https://www.bon.com.na",
                    "source": pair_data["source"],
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"{pair_data['pair']}: {pair_data['rate']}",
                    "description": f"Exchange rate: {pair_data['pair']} = {pair_data['rate']}",
                    "author": None,
                    "guid": f"market-{pair_data['pair'].replace('/', '-')}",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "economy",
                    "item_type": "market",
                    "metadata": {
                        "type": "market",
                        "pair": pair_data["pair"],
                        "rate": pair_data["rate"],
                        "change": "+0.0%",
                        "direction": "flat",
                        "source": pair_data["source"],
                    },
                })
    except Exception as e:
        print(f"  [Markets] Exchange rates error: {e}")

    # ── Commodity Prices (coingecko for crypto, metalpriceapi for gold) ──
    try:
        # Bitcoin
        crypto_url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true"
        resp = requests.get(crypto_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            btc = data.get("bitcoin", {})
            btc_price = btc.get("usd", 0)
            btc_change = btc.get("usd_24h_change", 0)

            results.append({
                "name": "BTC/USD",
                "url": "https://www.coingecko.com",
                "source": "CoinGecko",
                "date_found": datetime.now(timezone.utc).date().isoformat(),
                "content": f"BTC/USD: ${btc_price:,.0f}",
                "description": f"Bitcoin price: ${btc_price:,.0f}",
                "author": None,
                "guid": "market-btc-usd",
                "pub_date": datetime.now(timezone.utc).isoformat(),
                "section": "economy",
                "item_type": "market",
                "metadata": {
                    "type": "market",
                    "pair": "BTC/USD",
                    "rate": f"${btc_price:,.0f}",
                    "change": f"{btc_change:+.1f}%",
                    "direction": "up" if btc_change > 0 else "down" if btc_change < 0 else "flat",
                    "source": "CoinGecko",
                },
            })
    except Exception as e:
        print(f"  [Markets] Crypto error: {e}")

    # ── Gold Price ─────────────────────────────────────────────
    try:
        # Free gold price endpoint
        gold_url = "https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&currencies=XAU"
        resp = requests.get(gold_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            rates = data.get("rates", {})
            xau = rates.get("XAU", 0)
            if xau:
                gold_price = 1 / xau  # XAU is quoted as USD per troy ounce inverse
                results.append({
                    "name": "Gold/oz",
                    "url": "https://www.lbma.org.uk",
                    "source": "LBMA",
                    "date_found": datetime.now(timezone.utc).date().isoformat(),
                    "content": f"Gold/oz: ${gold_price:,.0f}",
                    "description": f"Gold spot price: ${gold_price:,.0f}/oz",
                    "author": None,
                    "guid": "market-gold-oz",
                    "pub_date": datetime.now(timezone.utc).isoformat(),
                    "section": "economy",
                    "item_type": "market",
                    "metadata": {
                        "type": "market",
                        "pair": "Gold/oz",
                        "rate": f"${gold_price:,.0f}",
                        "change": "+0.0%",
                        "direction": "flat",
                        "source": "LBMA",
                    },
                })
    except Exception as e:
        print(f"  [Markets] Gold error: {e}")

    # ── JSE Index (from free sources) ─────────────────────────
    try:
        # Yahoo Finance unofficial API for JSE
        jse_url = "https://query1.finance.yahoo.com/v8/finance/chart/%5EJ203.JO?range=1d&interval=1d"
        resp = requests.get(jse_url, headers=HEADERS, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            result = data.get("chart", {}).get("result", [{}])[0]
            meta = result.get("meta", {})
            price = meta.get("regularMarketPrice", 0)
            prev = meta.get("chartPreviousClose", 0)
            change_pct = ((price - prev) / prev * 100) if prev else 0

            results.append({
                "name": "JSE All Share",
                "url": "https://www.jse.co.za",
                "source": "JSE",
                "date_found": datetime.now(timezone.utc).date().isoformat(),
                "content": f"JSE All Share: {price:,.0f}",
                "description": f"JSE All Share Index: {price:,.0f} ({change_pct:+.1f}%)",
                "author": None,
                "guid": "market-jse-all",
                "pub_date": datetime.now(timezone.utc).isoformat(),
                "section": "economy",
                "item_type": "market",
                "metadata": {
                    "type": "market",
                    "pair": "JSE All",
                    "rate": f"{price:,.0f}",
                    "change": f"{change_pct:+.1f}%",
                    "direction": "up" if change_pct > 0 else "down" if change_pct < 0 else "flat",
                    "source": "JSE",
                },
            })
    except Exception as e:
        print(f"  [Markets] JSE error: {e}")

    return results
