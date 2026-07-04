// ============================================================
// Times of Namibia - Market Data Fetcher (Issue 6)
//
// Fetches real market data from free APIs:
//   - Forex: exchangerate-api (open.er-api.com - free, no key)
//   - Crypto: CoinGecko API (free, no key)
//
// Pairs tracked:
//   - NAD/USD, NAD/ZAR, NAD/EUR, NAD/GBP (forex)
//   - BTC/USD, ETH/USD (crypto)
//
// Runs as a Convex cron every 30 minutes.
// ============================================================

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

// ── FOREX FETCHER ────────────────────────────────────────────
// Uses open.er-api.com (free, no key required)

async function fetchForexRates(): Promise<{ pair: string; rate: string; change: string; direction: string }[]> {
  try {
    // Fetch USD-based rates (free API)
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      signal: AbortSignal.timeout(10_000),
      headers: { "User-Agent": "TimesOfNamibiaBot/1.0" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const rates = data.rates || {};

    // NAD is ~17-19 per USD, ZAR ~18-19, EUR ~0.9, GBP ~0.79
    const nadPerUsd = rates["NAD"] || 18.5;
    const zarPerUsd = rates["ZAR"] || 18.5;
    const eurPerUsd = rates["EUR"] || 0.92;
    const gbpPerUsd = rates["GBP"] || 0.79;

    // Compute cross rates
    const results = [
      { pair: "USD/NAD", rate: nadPerUsd.toFixed(2), change: "", direction: "flat" },
      { pair: "ZAR/NAD", rate: (nadPerUsd / zarPerUsd).toFixed(2), change: "", direction: "flat" },
      { pair: "EUR/NAD", rate: (nadPerUsd / eurPerUsd).toFixed(2), change: "", direction: "flat" },
      { pair: "GBP/NAD", rate: (nadPerUsd / gbpPerUsd).toFixed(2), change: "", direction: "flat" },
    ];

    return results;
  } catch (err) {
    console.warn("[market] Forex fetch failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

// ── CRYPTO FETCHER ───────────────────────────────────────────
// Uses CoinGecko API (free, no key required)

async function fetchCryptoRates(): Promise<{ pair: string; rate: string; change: string; direction: string }[]> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true",
      {
        signal: AbortSignal.timeout(10_000),
        headers: { "User-Agent": "TimesOfNamibiaBot/1.0", Accept: "application/json" },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();

    const btcPrice = data.bitcoin?.usd || 0;
    const btcChange = data.bitcoin?.usd_24h_change || 0;
    const ethPrice = data.ethereum?.usd || 0;
    const ethChange = data.ethereum?.usd_24h_change || 0;

    return [
      {
        pair: "BTC/USD",
        rate: btcPrice.toLocaleString("en-US", { maximumFractionDigits: 0 }),
        change: `${btcChange > 0 ? "+" : ""}${btcChange.toFixed(2)}%`,
        direction: btcChange > 0 ? "up" : btcChange < 0 ? "down" : "flat",
      },
      {
        pair: "ETH/USD",
        rate: ethPrice.toLocaleString("en-US", { maximumFractionDigits: 0 }),
        change: `${ethChange > 0 ? "+" : ""}${ethChange.toFixed(2)}%`,
        direction: ethChange > 0 ? "up" : ethChange < 0 ? "down" : "flat",
      },
    ];
  } catch (err) {
    console.warn("[market] Crypto fetch failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

// ── MAIN ACTION ──────────────────────────────────────────────

export const fetchMarketData = internalAction({
  args: {},
  handler: async (ctx) => {
    const adminToken = process.env.CONVEX_ADMIN_TOKEN;
    if (!adminToken) {
      return { error: "CONVEX_ADMIN_TOKEN not configured" };
    }

    console.log("[market] Fetching market data...");

    const [forex, crypto] = await Promise.all([fetchForexRates(), fetchCryptoRates()]);
    const allRates = [...forex, ...crypto];

    let upserted = 0;
    const errors: string[] = [];

    for (const rate of allRates) {
      try {
        await ctx.runMutation(api.mutationsAdmin.upsertMarketDatum, {
          adminToken,
          pair: rate.pair,
          rate: rate.rate,
          change: rate.change,
          direction: rate.direction,
          source: rate.pair.startsWith("BTC") || rate.pair.startsWith("ETH") ? "CoinGecko" : "ER-API",
        });
        upserted++;
      } catch (err) {
        errors.push(`${rate.pair}: ${err instanceof Error ? err.message : err}`);
      }
    }

    console.log(`[market] Complete: ${upserted} rates upserted, ${errors.length} errors`);
    return { upserted, errors: errors.slice(0, 5) };
  },
});

// Manual trigger
export const triggerFetchMarketData = action({
  args: { adminToken: v.string() },
  handler: async (ctx, args) => {
    const ADMIN_TOKEN = process.env.CONVEX_ADMIN_TOKEN;
    if (!ADMIN_TOKEN || args.adminToken !== ADMIN_TOKEN) {
      throw new Error("Unauthorized: invalid admin token");
    }
    return await ctx.runAction(internal.actions.marketData.fetchMarketData, {});
  },
});
