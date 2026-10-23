
# Market table "Open interest cap" column is out of date on 20 of 21 markets
Severity: major
Area: docs

## Steps to reproduce
1. Open https://app.testnet.dreamdex.io/docs/trading/perps-testnet and read the "Open interest cap" column. The page says "These figures are read from the live markets".
2. For every perp pool from `client.listPerpMarkets()`, call `getPerpPoolParameters()` on the pool and read `maxOpenInterest`, scaled by the market's `baseDecimals`.
3. Or run `npm run caps` in this repo.

## Expected
The table matches on-chain `maxOpenInterest`.

## Actual
Only TAO-PERP matches. On-chain caps are **2x** the documented value for BTC, ETH, SOL and HYPE, and **4x** for the other 16 markets:

| Market | Docs | On-chain `maxOpenInterest` |
|---|---|---|
| BTC-PERP | 246.81545 BTC | 493.6309 BTC |
| ETH-PERP | 3,995.6125 ETH | 7,991.225 ETH |
| XRP-PERP | 344,632 XRP | 1,378,528 XRP |
| ZEC-PERP | 420 ZEC | 1,680 ZEC |
| TAO-PERP | 2,185.491 TAO | 2,185.491 TAO (matches) |

The full 21-row table is in `evidence/01-caps.txt`. The live open interest of **BTC-PERP (330.59 BTC)** and **XRP-PERP (758,078 XRP)** is already above the documented cap. A trader who reads the table would think those markets are over their limit.

The same table is served in `/llms-full.txt` (line ~6099), so AI agents building on the docs inherit the stale numbers too.

## Evidence
- `evidence/01-caps.txt` (script `scripts/01-oi-and-position-caps.ts`)
- BTC-PERP: `getPerpPoolParameters().maxOpenInterest` = 49363090000 (8 decimals).

## Environment
- SDK: `@somnia-chain/markets-sdk` 0.32.1 (the version the developer docs name), viem 2.57.x, Node 22
- Network: Somnia Tokyo testnet as the bounty calls it (Hideki in the docs and SDK, chain id 50383), RPC `https://api.hideki2.infra.testnet.somnia.network`, indexer `https://hideki-dev.smk.somnia.host/v1/graphql`
- Wallet address: none. Every check is read-only (view calls and `eth_call`). No key was used and no transaction was sent.
- Date checked: 2026-10-23 (block numbers are in the evidence files)
