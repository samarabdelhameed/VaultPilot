🧪 simulator/ — Vault Strategy Backtesting Module
Purpose:
This folder simulates how each vault strategy would perform using real historical data (via CoinGecko + sentiment logs). It helps test AI + vault logic before going live.

1. backtest.ts 📉 (Updated for Real Data)
   Purpose: Simulates performance of Vault strategies (TWAP, Sentiment, Hybrid) over time using live market data.
   Functionality:
   Fetches price history from CoinGecko for the selected token (e.g., ETH)

Fetches historical sentiment logs from the DB or MCP memory

Runs virtual vault execution logic based on strategy type

Tracks:

Execution count ✅

Missed opportunities ✅

Avg. profit per trade (optional)

Reaction to sentiment dips ✅

Execution Logic Example:
if (strategy === "TWAP") {
if (currentTime % interval === 0) execute();
} else if (strategy === "Sentiment") {
if (sentimentScore > threshold) execute();
} else if (strategy === "Hybrid") {
if (sentimentScore > threshold && timeOk) execute();
}

Real Data Integration: ✅
Prices from https://api.coingecko.com

Sentiment logs from /api/sentiment_logs (Xata / MCP memory)

Suggested Enhancements:
✅ Visualize performance (plot trades vs price/sentiment over time)

Add risk simulation layer (simulate drawdowns or volatility)

Generate report: Win rate, avg ROI, max DD, Sharpe ratio

Test Scenarios:
✅ Load ETH/USDC price data from CoinGecko

✅ Simulate TWAP execution over 30 days

✅ Simulate sentiment drops → pause trades

✅ Hybrid adapts based on mood + interval

✅ Add fake slippage + stop-loss triggers

2. mockData.json 📦 (Deprecated)
   Purpose: Legacy placeholder for simulated data.
   Structure:
   [
   {
   "timestamp": "2025-07-20T00:00:00Z",
   "price": 1820.5,
   "sentiment": 0.7
   },
   {
   "timestamp": "2025-07-20T01:00:00Z",
   "price": 1830.1,
   "sentiment": 0.6
   }
   ]

Usage:
✅ No longer used — replaced with real-time fetch

Can be kept for local testing/debug mode

Suggested Enhancements:
Add volatility stress scenarios (optional)

Include crash patterns for stress testing (optional)

✅ Integration Summary:
File
Role
Output Used In
Enhancement Ready
backtest.ts
Simulate vault performance
Validates strategy logic
✅ Real Data + Graph Ready
mockData.json
Legacy mock data
Optional debug input
❌ Deprecated

🔁 Next Steps:
Use simulation results in dashboard as "AI backtest insights"

Feed results to strategy-advisor.mcp.ts to improve adaptive logic

Add toggle in frontend: View past simulation runs by strategy + mood

Enable export to CSV or chart view (user-facing analytics)
