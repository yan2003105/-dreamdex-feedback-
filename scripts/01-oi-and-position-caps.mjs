// Finding 01 reproduction: compare the dreamDEX docs "Open interest cap"
// column against on-chain getPerpPoolParameters().maxOpenInterest for every
// perp market on the Somnia Hideki testnet.
// Read-only: view calls only. No wallet, no key, no transaction.
// Usage: npm install && npm run caps
import { SomniaMarkets, SOMNIA_HIDEKI_TESTNET_ADDRESSES } from '@somnia-chain/markets-sdk';
import { hidekiTestnet } from '@somnia-chain/markets-sdk/chains';
import { createPublicClient, http, parseAbiItem, formatUnits } from 'viem';

const RPC = 'https://api.hideki2.infra.testnet.somnia.network';
const INDEXER = 'https://hideki-dev.smk.somnia.host/v1/graphql';
const WS = 'wss://api.hideki2.infra.testnet.somnia.network/ws';

// Docs "Open interest cap" column, transcribed from
// https://app.testnet.dreamdex.io/docs/trading/perps-testnet
// (also served in /llms-full.txt, fetched 2026-10-23).
const DOCS = {
  BTC: 246.81545, ETH: 3995.6125, HYPE: 23812.72, SOL: 47654.44, XRP: 344632,
  ADA: 2254678, AVAX: 66672.2, BNB: 693.975, DOGE: 5613590, LINK: 42643.6,
  NEAR: 250410, SUI: 635009, XLM: 2677780, '1000PEPE': 130285600, LIT: 138896.6,
  PUMP: 87993700, TAO: 2185.491, VVV: 21786.14, WLD: 1264000, ZEC: 420, ZRO: 250599.5,
};

const pub = createPublicClient({ chain: hidekiTestnet, transport: http(RPC) });
const block = await pub.getBlockNumber();
console.log(`Somnia Hideki testnet (chainId ${await pub.getChainId()}), RPC ${RPC}`);
console.log(`Block: ${block}`);
console.log(`Date checked: ${new Date().toISOString().slice(0, 10)}`);
console.log('');
console.log('Market | Docs cap | On-chain maxOpenInterest | Ratio');
console.log('---|---|---|---');

const markets = new SomniaMarkets({
  chain: hidekiTestnet, indexerUrl: INDEXER, wsRpcUrl: WS,
  addresses: SOMNIA_HIDEKI_TESTNET_ADDRESSES,
});
const perps = await markets.client.listPerpMarkets();
const abi = [parseAbiItem('function getPerpPoolParameters() view returns ((uint256 initialMarginBps, uint256 maintenanceMarginBps, uint256 closeOutMarginBps, uint256 maxOpenInterest, uint256 maxPositionSize, uint256 takerFeeBpsTimes1k, int256 makerFeeBpsTimes1k, uint256 insuranceFundShareBps))')];

let stale = 0;
const bySymbol = new Map(perps.map((m) => [m.baseSymbol, m]));
for (const sym of Object.keys(DOCS)) {
  const m = bySymbol.get(sym);
  if (!m) { console.log(`${sym} | ${DOCS[sym]} | (market not listed) | -`); continue; }
  const p = await pub.readContract({ address: m.poolAddress, abi, functionName: 'getPerpPoolParameters' });
  const scaled = Number(formatUnits(p.maxOpenInterest, m.baseDecimals));
  const ratio = scaled / DOCS[sym];
  if (Math.abs(ratio - 1) > 1e-9) stale++;
  console.log(`${sym} | ${DOCS[sym]} | ${scaled} | ${ratio}x`);
}
console.log('');
console.log(`${stale} of ${Object.keys(DOCS).length} documented caps differ from on-chain maxOpenInterest.`);
