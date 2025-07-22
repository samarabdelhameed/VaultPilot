🧠 backend/ — Professional Technical Analysis
This layer is the brain of VaultPilot. It connects frontend ↔️ smart contracts ↔️ AI agents and price oracles. It contains business logic, routing, agent triggering, and price tracking.

1. vibeChecker.ts (MCP Client) 💡
   Purpose:
   Acts as the bridge between backend and sentiment-agent.mcp.ts.
   Primary Responsibilities:
   Sends prompt to MCP agent → receives sentiment score

Passes that score to smart contracts via RPC or indexer

How it works:
const score = await callMCP("sentiment-agent", { assetPair: "ETH/USDC" });
await updateSentimentScoreToVault(vaultAddress, score);

MCP Integration: ✅
Uses @mcp/client to communicate with local/remote MCP

Score is stored in memory.json optionally

Can sync with a DB like Xata for historical trend analysis

Suggested Enhancements:
POST /api/vault/:id/sentiment

body: { assetPair: string }

returns: { score: number }

Test Scenarios:
✅ Trigger sentiment and check if score is numeric
✅ Validate fallback if MCP agent down
✅ Score is pushed to VaultSentiment.sol

2. strategy.ts 📊
   Purpose:
   Backend strategy advisor + signal processor
   Primary Responsibilities:
   Combines sentiment, market data, vault config

Returns decision: "pause", "execute", "rebalance"

How it works:
const mood = await vibeChecker.getMood(vaultId);
const twapSchedule = getTWAPTime(vaultId);
if (mood > 0.6 && twapSchedule.ok) return "execute";
else return "pause";

Integration with VaultHybridStrategy.sol: ✅
Strategy backend matches canExecute() conditions

Sends signal to frontend for ExecutionPreview.tsx

Suggested Enhancements:
Historical decision logs (Xata DB)

Can publish decision to MCP for autonomous loop

Test Scenarios:
✅ Returns decision based on mocked sentiment
✅ Handles edge cases (negative mood, interval edge)
✅ Decision logic is replayable from DB

3. oneInch.ts 🔄
   Purpose:
   Backend wrapper around 1inch aggregator API
   Primary Responsibilities:
   Gets optimal route for a trade

Prepares calldata to send from smart contract

Returns estimated slippage

How it works:
const quote = await getOneInchQuote(tokenIn, tokenOut, amount);
const txData = await build1inchTx(...);

Integration: ✅
Connected to VaultTWAP.sol & VaultHybridStrategy.sol

txData returned → forwarded to Vault contract → executeSwap()

Suggested Enhancements:
Add route visualization for ExecutionPreview.tsx

Record quotes in cache for batch testing

Test Scenarios:
✅ Check if API returns a valid route
✅ Validate slippage < vault settings
✅ Simulate calldata sent to EVM

4. diaPriceFeed.ts 📉
   Purpose:
   Fetches live price from DIA oracles
   Primary Responsibilities:
   Get ETH/USD, BTC/USD, etc from DIA

Feed price into strategy.ts and risk manager

How it works:
const price = await fetch(`https://api.diadata.org/v1/price/${symbol}`);
return price.value;

Integration: ✅
Used in strategy.ts to evaluate slippage

Used in risk triggers inside Vaults

Suggested Enhancements:
Add moving average smoothing

Cache last 5 values to simulate TWAP-like behavior

Test Scenarios:
✅ Handles no-data from DIA
✅ Returns float price
✅ Simulates slippage check

🔄 Suggested Database Integration (e.g. Xata or Supabase)
Table
Purpose
sentiment_logs
Track mood score history per vault
strategy_decisions
Store execution/pause decisions
tx_history
All 1inch routes tried
price_snapshots
DIA prices over time

Use cases:
Replay strategies

AI agent learns from DB

User dashboards show historical performance

✅ Integration Summary Table
File
Main Role
Integrates with
Result
vibeChecker.ts
Calls AI sentiment
MCP, VaultSentiment
score injected onchain
strategy.ts
Execution logic
HybridVault, Frontend
run / pause signal
oneInch.ts
Executes swaps
Vaults, Frontend
tx built + executed
diaPriceFeed.ts
Market data source
Risk + Strategy
pricing inputs
