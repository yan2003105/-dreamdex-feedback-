# dreamDEX Perps Builder Bounty — Developer Feedback

Four major findings from a read-only audit of the dreamDEX testnet developer
docs, the paper-trading (Paper USDso) contract behaviour, and the official
dreamDEX bot kit, checked against the Somnia Hideki testnet on 2026-10-23.
Submitted to the dreamDEX Perps Builder Bounty on DoraHacks.

## Findings

| # | Finding | Severity | Area |
|---|---------|----------|------|
| 01 | [Market table "Open interest cap" column is out of date on 20 of 21 markets](feedback/01-docs-oi-cap-column-stale.md) | major | docs |
| 03 | [Paper USDso: the six markets the docs mark "No" are allowed on-chain](feedback/03-paper-usdso-allowlist-mismatch.md) | major | contracts |
| 04 | [Bot kit locks markets-sdk 0.31.0, so the docs' Connect and test-funds snippets fail inside it](feedback/04-botkit-sdk-version-vs-docs.md) | major | SDK |
| 05 | [Bot kit passes SOMNIA_TESTNET_ADDRESSES on Hideki; six of those addresses have no code there](feedback/05-botkit-testnet-address-set-on-hideki.md) | major | SDK |

Each report has full steps to reproduce, expected vs. actual behaviour, and a
suggested fix.

## Method

- All checks are read-only: contract view calls and `eth_call` simulations.
  No wallet, no private key, no transaction was sent.
- Network: Somnia Hideki testnet (chain id 50383),
  RPC `https://api.hideki2.infra.testnet.somnia.network`
- Tooling: `@somnia-chain/markets-sdk` 0.32.1 (the version the developer docs
  name) and 0.31.0 (the version the bot kit pins), viem 2.57.x, Node 22.
- Bot kit audited at commit `25798660` (2026-10-12) of
  `github.com/somnia-chain/dreamdex-bot-kit`.
