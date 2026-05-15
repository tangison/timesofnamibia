from datetime import datetime, timezone

import httpx
from fastapi import APIRouter

router = APIRouter(tags=["market"])


def _direction(change: float) -> str:
    if change > 0:
        return "up"
    if change < 0:
        return "down"
    return "flat"


@router.get("/market/live")
def market_live():
    rows: list[dict] = []
    now = datetime.now(timezone.utc).isoformat()

    # FX: USD/EUR/GBP against ZAR then derive NAD (pegged to ZAR)
    try:
        with httpx.Client(timeout=15) as client:
            fx = client.get(
                "https://api.frankfurter.app/latest",
                params={"from": "ZAR", "to": "USD,EUR,GBP"},
            )
            fx.raise_for_status()
            rates = fx.json().get("rates", {})

            usd_nad = 1 / float(rates["USD"]) if rates.get("USD") else None
            eur_nad = 1 / float(rates["EUR"]) if rates.get("EUR") else None
            gbp_nad = 1 / float(rates["GBP"]) if rates.get("GBP") else None

            if usd_nad:
                rows.append(
                    {
                        "id": "usd-nad",
                        "pair": "USD/NAD",
                        "rate": f"{usd_nad:.4f}",
                        "change": "0.00%",
                        "direction": "flat",
                        "source": "Frankfurter",
                        "active": True,
                        "updatedAt": now,
                    }
                )
            if eur_nad:
                rows.append(
                    {
                        "id": "eur-nad",
                        "pair": "EUR/NAD",
                        "rate": f"{eur_nad:.4f}",
                        "change": "0.00%",
                        "direction": "flat",
                        "source": "Frankfurter",
                        "active": True,
                        "updatedAt": now,
                    }
                )
            if gbp_nad:
                rows.append(
                    {
                        "id": "gbp-nad",
                        "pair": "GBP/NAD",
                        "rate": f"{gbp_nad:.4f}",
                        "change": "0.00%",
                        "direction": "flat",
                        "source": "Frankfurter",
                        "active": True,
                        "updatedAt": now,
                    }
                )
    except Exception:
        pass

    # Crypto spot
    try:
        with httpx.Client(timeout=15) as client:
            cg = client.get(
                "https://api.coingecko.com/api/v3/simple/price",
                params={
                    "ids": "bitcoin,ethereum",
                    "vs_currencies": "usd",
                    "include_24hr_change": "true",
                },
            )
            cg.raise_for_status()
            data = cg.json()
            for coin, pair in (("bitcoin", "BTC/USD"), ("ethereum", "ETH/USD")):
                if coin in data and "usd" in data[coin]:
                    chg = float(data[coin].get("usd_24h_change") or 0.0)
                    rows.append(
                        {
                            "id": f"{coin}-usd",
                            "pair": pair,
                            "rate": f"{float(data[coin]['usd']):.2f}",
                            "change": f"{chg:+.2f}%",
                            "direction": _direction(chg),
                            "source": "CoinGecko",
                            "active": True,
                            "updatedAt": now,
                        }
                    )
    except Exception:
        pass

    return rows
