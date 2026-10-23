```markdown title="feedback/03-paper-usdso-allowlist-mismatch.md"
# Paper USDso: the six markets the docs mark "No" are allowed on-chain
Severity: major
Area: contracts

## Steps to reproduce
1. Docs (Margin & Liquidations → Paper USDso, and the market table) say that while any voucher remains, you can open or increase positions only in "Yes" markets, and "The six newest markets are not on that list": 1000PEPE, LIT, PUMP, VVV, ZEC and ZRO. The developer page adds that `getMaxPerpOrderSize` reports such orders as `limitedBy: "voucherBlocked"`.
2. Call `MarginBank(0x478769E1177C0773c43A593DCCc4Ad15F15F1394).isVoucherMarketAllowed(pool)` for all 21 pools.
3. Take an account with an active voucher, e.g. `0xbc28A1b06eaF0513CD0B04D7345Ac605ec8b4bA3` (`getPerpVoucher` → claimed=true, floor=3000 USDso). Call `getMaxPerpOrderSize` for a bid on ZEC, PUMP, ZRO, LIT, VVV and 1000PEPE.
4. Simulate (`eth_call`) `placeOrder(isBid=true, price=50% of mark on tick, quantity=minQuantity, GTC, expiry +1 day)` from that account on the same pools.

## Expected
For the six "No" markets: `isVoucherMarketAllowed` = false, `getMaxPerpOrderSize` → `placeable:false, limitedBy:"voucherBlocked"`, and the simulated position-increasing order reverts.

## Actual
- `isVoucherMarketAllowed` returns **true for all 21 pools**, the six "No" markets included.
- `getMaxPerpOrderSize` for the voucher account returns `placeable:true, limitedBy:"initialMargin"` on all six.
- The `eth_call` simulation of `placeOrder` **succeeds** on all six.

Either the allowlist was widened and the docs were not updated, or the allowlist is misconfigured. In the second case, Perps Arena voucher accounts can open positions in markets the rules exclude, which matters for a competition with $15,000 in rewards.

## Evidence
- Checked at block ~30.71M
- Voucher distributor `0x2ACD9EFdA721450906bfE1bef3edE269636E42C4` (= `getCreditGranter()`)

## Environment
- SDK: `@somnia-chain/markets-sdk` 0.32.1, viem 2.57.x, Node 22
- Network: Somnia Hideki testnet (chain id 50383), RPC `https://api.hideki2.infra.testnet.somnia.network`
- Wallet address: none. Read-only checks; no transaction sent.
- Date checked: 2026-10-23
```
