
# Bot kit locks markets-sdk 0.31.0, so the docs' Connect and test-funds snippets fail inside it
Severity: major
Area: SDK

## Steps to reproduce
1. The bounty links the dreamDEX bot kit (github.com/somnia-chain/dreamdex-bot-kit, commit 25798660, 2026-10-12) and the developer docs, which say "this page uses version 0.32.1, the one the app runs".
2. `packages/perp-core/package.json` pins `"@somnia-chain/markets-sdk": "^0.31.0"`, and `package-lock.json` resolves it to **0.31.0**. A caret on 0.x does not cross minor versions, so `^0.31.0` can never install 0.32.x.
3. With 0.31.0, run the docs' "Connect" and "Get test funds" snippets.

## Expected
The official bot kit can run the code on the official developer page.

## Actual
In 0.31.0:
- `SOMNIA_HIDEKI_TESTNET_ADDRESSES` is `undefined`. The docs' first import gives `addresses: undefined`.
- `client.getPerpVoucherEligibility` is `undefined`, so the docs' "Get test funds" code throws `TypeError: ... is not a function`.
- `trader.claimPerpVoucher` does not exist in the 0.31.0 build (0 occurrences in `dist/`).

A builder who starts from the bot kit and adds the docs' voucher-claim code breaks immediately. Suggested fix: bump perp-core and ec-core to `^0.32.1`, and note the minimum SDK version on the docs page.

## Evidence
- `dreamdex-bot-kit/packages/perp-core/package.json` line 17; `package-lock.json` entry `packages/perp-core/node_modules/@somnia-chain/markets-sdk` → 0.31.0

## Environment
- SDK: `@somnia-chain/markets-sdk` 0.31.0 (bot kit) vs 0.32.1 (docs), Node 22
- Network: Somnia Hideki testnet (chain id 50383)
- Wallet address: none. Read-only checks; no transaction sent.
- Date checked: 2026-10-23
  
