ai-agent

🤖 ai-agent/ — Advanced Analysis of MCP Agents in VaultPilot
This directory contains two core AI agents powered by the Model Context Protocol (MCP). These agents serve as autonomous decision-makers to feed live sentiment and strategic advice to Vault smart contracts.

1. sentiment-agent.mcp.ts 🧠
   📌 Purpose:
   Real-time sentiment analyzer for crypto asset pairs based on social/news content.
   ⚙️ Functionality:
   Fetches off-chain data (Twitter, Reddit, news) for a given asset pair.

Runs classification prompt using MCP client.

Outputs normalized sentimentScore ∈ [-1.0, 1.0].

Score is cached and optionally stored in Xata DB.

✅ How it Works:
const data = await fetchTweetsAndNews("ETH/USDC");
const score = await callMCP("sentiment-agent", { headlines: data });
saveToXata("sentiment_logs", { vaultId, score, timestamp });

🧠 MCP Prompt Logic:
"""
You are a market mood classifier.
Given: Array of tweets/headlines
Return: sentimentScore between -1.0 (bearish) and 1.0 (bullish)
"""

🔗 Integration:
Backend: vibeChecker.ts periodically triggers this agent.

Smart Contract: Feeds VaultSentiment.sol, VaultHybridStrategy.sol.

Frontend: Sentiment visualized in SentimentGraph.tsx.

📈 Suggested Enhancements:
Multi-token scoring: ETH, BTC, MATIC etc.

Store full logs to sentiment_logs table (Xata).

Add anomaly alerts for sudden sentiment swings.

🧪 Test Scenarios:
Scenario
Expected Result
🟢 Tweets positive
score > 0.5 → vault trades
🔴 Negative news spike
score < 0.3 → trade pause
🟡 No data fetched
Return fallback/0

2. strategy-advisor.mcp.ts 📊
   📌 Purpose:
   AI strategist that monitors market data + vault performance to advise execution changes.
   ⚙️ Functionality:
   Pulls vault returns, execution history.

Combines with sentimentScore and volatility from DIA.

Outputs: maintain, pause, switch_to_hybrid, reduce_size, etc.

Optional: Logs advisory results in Xata.

✅ How it Works:
const stats = await getVaultPerformance(vaultId);
const mood = await fetchSentiment(vaultId);
const decision = await callMCP("strategy-advisor", { stats, mood });
logDecisionToDB(vaultId, decision);

🧠 MCP Prompt Logic:
"""
You are a smart DeFi strategy advisor.
Given:

- execution stats
- sentiment scores
- TWAP timing
  Advise vault behavior: maintain, pause, switch to hybrid, etc.
  """

🔗 Integration:
Backend: strategy.ts queries this agent.

Smart Contracts: VaultHybridStrategy.sol and RiskManager.sol consume logic.

Frontend: Advice preview shown in VaultSummary.tsx.

📈 Suggested Enhancements:
Allow user to override AI suggestion in frontend.

Store strategy_decisions with reason + timestamp.

Incorporate on-chain gas trends or volatility.

🧪 Test Scenarios:
Scenario
AI Output
🔻 Vault PnL ↓, sentiment < 0
pause
🔼 TWAP perfect, mood bullish
maintain
🔄 Mixed returns, rising volatility
switch_to_hybrid
❗ Mood spike while paused
reactivate vault

✅ Integration Summary
Agent File
Role
Feeds Into
Output Location
sentiment-agent.mcp.ts
Sentiment classifier
VaultSentiment.sol, HybridVault
MCP, Xata (logs)
strategy-advisor.mcp.ts
Strategy tuner
strategy.ts, RiskManager.sol
MCP, Xata (advisory logs)

✅ Data Flow Overview
Frontend → /api/strategy.ts → strategy-advisor.mcp.ts
↘ /api/vibeChecker.ts → sentiment-agent.mcp.ts
↘→ Vault contracts ↔ dashboard
