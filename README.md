# 🚀 VaultPilot – Smart Vaults Powered by Sentiment & TWAP

✨ Let your vault feel the market… before you do.

---

## 💡 Concept Summary

**VaultPilot** is a smart trading vault protocol that enables automated execution of crypto trades using:

- 📊 **Time-Weighted Average Price (TWAP)**
- 🧠 **Sentiment Analysis powered by LLM-compatible MCP Agents**
- 🔀 **Hybrid Strategy blending time and mood dynamics**

````mermaid
flowchart TD
  A[User Connects Wallet] --> B[Select Strategy]
  B --> C[Deploy Vault (Factory)]
  C --> D[Initialize Strategy (TWAP / Sentiment / Hybrid)]
  D --> E[Fetch Mood via MCP Agent]
  E --> F[Execute via 1inch Limit Order]
  F --> G[Update Vault State]
  G --> H[Display in Dashboard]



VaultPilot empowers both beginners and pro traders to execute optimized limit orders based on live market “vibes” from social and news platforms, using decentralized onchain execution powered by **1inch Limit Order Protocol**.

---

## 🎯 Track: Expand Limit Order Protocol (1inch)

🛠 **Tech Stack**: Solidity + Foundry + React + Node + 1inch Protocol + DIA Oracle + Model Context Protocol (MCP)

---

## 🌐 Core Strategies

| Strategy      | Description                                                                |
| ------------- | -------------------------------------------------------------------------- |
| **TWAP**      | Breaks large trades into timed chunks to minimize slippage.                |
| **Sentiment** | MCP Agent analyzes mood from Twitter, Reddit, and news to guide execution. |
| **Hybrid**    | Dynamically adjusts TWAP intervals & size based on market sentiment.       |

---

## 🧪 Technical Highlights

| Component                | Description                                                             |
| ------------------------ | ----------------------------------------------------------------------- |
| 🧠 **VibeChecker (MCP)** | MCP Agent using LLM or local NLP to generate live mood scores.          |
| 📉 **SentimentTWAP.sol** | Adjusts execution intervals & amounts based on sentiment.               |
| 🔐 **RiskManager.sol**   | Adds pauseVault(), slippage control, volatility cutoff, max loss logic. |
| 🪙 **VaultNFT.sol**      | ERC-721 token for public sharing and cloning of successful strategies.  |
| 🖥 **Sim Dashboard**      | Simulation interface with backtest data and live sentiment trends.      |
| 🤖 **StrategyAdvisor**   | MCP Agent assisting users in choosing strategies via Q&A.               |
| 📡 **1inch Protocol**    | Pure onchain execution with raw 1inch Limit Orders.                     |

---

## 🔁 User Journey

1. User connects wallet and selects trading asset (e.g., ETH→USDC).
2. Picks strategy: TWAP, Sentiment, or Hybrid.
3. Configures preferences: duration, capital, risk level.
4. Vault deployed via VaultFactory.
5. MCP Agent (VibeChecker) fetches live market mood.
6. 1inch limit orders are dynamically segmented & executed.
7. Vault updates logic in real-time.
8. User monitors dashboard: mood trends, ROI, order status.

---

## 📊 Problem → Solution

| Problem                         | VaultPilot’s Solution                                 |
| ------------------------------- | ----------------------------------------------------- |
| Don’t know when to buy/sell     | AI-driven sentiment vaults + configurable TWAP engine |
| Market reacts to news rapidly   | VibeChecker reacts to live sentiment                  |
| Limit orders are hard to manage | No-code vault builder with strategy presets           |
| DCA is blind to market context  | Adaptive DCA powered by market mood                   |
| Vaults are rigid                | Pause, resume, adjust, and clone vaults as NFTs       |

---

## 🧩 Features

- 🧠 MCP-compatible Sentiment Agent
- 📡 Fully onchain 1inch Limit Orders (no centralized APIs)
- 📈 Real-time sentiment-adjusted TWAP logic
- 🛡 Volatility guard, slippage cap, pause function
- 🧪 Backtesting module with mock datasets
- 📊 Dashboard: ROI, mood chart, live orders
- 🪙 Vault-as-NFT for sharing/cloning
- 🌐 Multichain via DIA Oracle (ETH, BNB, Polygon)

---

## 📐 Project Architecture

```bash
VaultPilot/
├── contracts/
│   ├── VaultFactory.sol
│   ├── VaultTWAP.sol
│   ├── VaultSentiment.sol
│   ├── VaultHybridStrategy.sol
│   ├── VaultNFT.sol
│   ├── RiskManager.sol
├── frontend/
│   ├── pages/
│   │   ├── index.tsx
│   │   ├── create-vault.tsx
│   │   └── dashboard.tsx
│   └── components/
│       ├── SentimentGraph.tsx
│       ├── ExecutionPreview.tsx
│       └── VaultSummary.tsx
├── backend/
│   ├── routes/
│   │   ├── sentiment.ts
│   │   └── strategy.ts
│   ├── services/
│   │   ├── vibeChecker.ts
│   │   ├── oneInch.ts
│   │   └── diaPriceFeed.ts
├── ai-agent/
│   ├── sentiment-agent.mcp.ts
│   └── strategy-advisor.mcp.ts
├── simulator/
│   ├── backtest.ts
│   └── mockData.json
├── test/
│   ├── VaultTWAP.t.sol
│   └── VaultHybrid.t.sol
└── diagram/
    └── architecture.mmd
````

---

## 🧠 AI / MCP Integration

| Task                    | Powered By                      |
| ----------------------- | ------------------------------- |
| Sentiment extraction    | MCP Agent (LLM/local NLP)       |
| Strategy recommendation | MCP Q&A Agent                   |
| Backtest annotation     | NLP-based CSV labeler           |
| Memory handling         | `sentiment-memory.json` via MCP |

---

## 🛡️ Risk Management

- Pause/resume vaults via UI
- Max loss %, slippage caps, volatility filter
- Sentiment-triggered protection
- Optional webhooks for alerts

---

## 🖼️ Visuals

- 📈 Sentiment Graph – Mood timeline
- 📉 Order Timeline – Trade execution log
- 📊 Vault Metrics – ROI, slippage, Sharpe, win %

---

## 🧪 Hackathon Delivery Plan

| Phase     | Deliverable                          |
| --------- | ------------------------------------ |
| Day 1–2   | Smart contract scaffold + TWAP vault |
| Day 3–4   | MCP agent + mock data                |
| Day 5–6   | Backend + sentiment routing          |
| Day 7     | VaultHybrid implementation           |
| Day 8     | Risk Manager + NFT logic             |
| Day 9     | Frontend UI + simulations            |
| Day 10–11 | Final video + submission             |

---

## 🏆 Goal

Deliver a **production-ready MVP** for VaultPilot, using:

- 🧠 MCP Agents for mood
- ⚙️ 1inch Limit Orders
- 📊 Real-time simulations
- 🧪 Risk management logic
- 🖥 Visual dashboards

**Target: 1st place in the $65K 1inch track.**
