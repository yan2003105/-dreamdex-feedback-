
# Bot kit passes SOMNIA_TESTNET_ADDRESSES on Hideki; six of those addresses have no code there
Severity: major
Area: SDK

## Steps to reproduce
1. `packages/perp-core/src/exchange.ts` builds `SomniaMarkets` with `addresses: SOMNIA_TESTNET_ADDRESSES` for the Hideki network. The comment above it says: "The bundled testnet address set serves Hideki too: the singletons the SDK looks up sit at the same deterministic addresses there".
2. Compare `SOMNIA_TESTNET_ADDRESSES` with `SOMNIA_HIDEKI_TESTNET_ADDRESSES` (SDK 0.32.1), and `eth_getCode` each differing address on Hideki.
3. Build `SomniaMarkets` on `hidekiTestnet` with each set, call `loadMarkets()` and read `perpDiscoveryError`. Then call `client.getPerpVoucherCampaign(addresses.marginBank)`.

## Expected
The bot kit's address set resolves to deployed contracts on Hideki, as the comment says.

## Actual
- 7 entries differ, and **none of the bot kit's values has code on Hideki**: `marginBank` 0xdd4A…5C4E, `perpPoolFactory` 0x516d…a07b, `priceFeedScheduler`, `marketCreator`, `collateral`/`testUsdc` 0x70a8…5d8E, and `collateralRouter`. (Seven entries differ, but they are six unique addresses: `collateral` and `testUsdc` are the same address.)
- On SDK 0.32.1, a configured `addresses.perpPoolFactory` takes precedence for perp discovery. With the bot kit's set, `loadMarkets()` reports `perpDiscoveryError: rpc readContract getPerpPools failed: ... returned no data ("0x")`. The Hideki set gives `null`. Perps still list only because the indexer is up, so the chain-only fallback the SDK documents is lost.
- `getPerpVoucherCampaign(addresses.marginBank)` → `RpcError ... getCreditGranter returned no data` with the bot kit's set. With the Hideki set it works.

The kit works today only because it reads `marginBank` and pools off market rows. It breaks as soon as it moves to 0.32.x or a strategy uses `exchange.config.addresses`. Suggested fix: use `SOMNIA_HIDEKI_TESTNET_ADDRESSES` for the hideki network and remove the comment.

## Environment
- SDK: `@somnia-chain/markets-sdk` 0.32.1, viem 2.57.x, Node 22
- Network: Somnia Hideki testnet (chain id 50383), RPC `https://api.hideki2.infra.testnet.somnia.network`
- Wallet address: none. Read-only checks; no transaction sent.
- Date checked: 2026-10-23

