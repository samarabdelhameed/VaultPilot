# 🚀 VaultPilot - AI-Powered DeFi Vault Management Platform

> **Advanced DeFi vault management and analytics platform with AI-powered strategies and institutional-grade security.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solidity](https://img.shields.io/badge/Solidity-363636?style=flat&logo=solidity&logoColor=white)](https://soliditylang.org/)
[![Astro](https://img.shields.io/badge/Astro-FF5D01?style=flat&logo=astro&logoColor=white)](https://astro.build/)

## 🎯 Project Overview

VaultPilot is a comprehensive DeFi platform that combines AI-powered strategies with smart contract automation. Built for the 1inch Limit Order Protocol hackathon, it features advanced TWAP (Time-Weighted Average Price) strategies, sentiment analysis, and real-time risk management.

### ✨ Key Features

- 🤖 **AI-Powered Strategies**: Machine learning-driven trading strategies
- 📊 **Real-time Analytics**: Advanced backtesting and performance tracking
- 🔒 **Smart Contract Security**: Institutional-grade security with OpenZeppelin
- 🎯 **1inch Integration**: Full integration with 1inch Limit Order Protocol
- ⚡ **TWAP + Limit Orders**: Advanced time-weighted average price strategies
- 📈 **Risk Management**: Real-time risk assessment and automated controls
- 🎨 **Modern UI/UX**: Beautiful, responsive design with Tailwind CSS

## 🏗️ Architecture

```
VaultPilot/
├── frontend/          # Astro + React + Tailwind CSS
├── backend/           # Node.js + Express + TypeScript
├── contracts/         # Solidity smart contracts (Foundry)
├── ai-agent/          # AI integration and sentiment analysis
└── simulator/         # Backtesting and simulation engine
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Foundry (for smart contracts)
- MetaMask or compatible wallet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/vaultpilot.git
cd vaultpilot
```

2. **Install dependencies**
```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Install contract dependencies
cd ../contracts && forge install
```

3. **Environment Setup**
```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your configuration

# Contracts environment
cd ../contracts
cp .env.example .env
# Edit .env with your private key and RPC URL
```

4. **Deploy Smart Contracts**
```bash
cd contracts
forge build
forge script script/DeployVault.s.sol --rpc-url https://sepolia.drpc.org --broadcast
```

5. **Start Development Servers**
```bash
# Start backend (Terminal 1)
cd backend && npm run dev

# Start frontend (Terminal 2)
cd frontend && npm run dev
```

## 🎯 Core Features

### 🤖 AI-Powered Strategies

- **Sentiment Analysis**: Real-time market sentiment scoring
- **Risk Assessment**: AI-driven risk management
- **Strategy Optimization**: Machine learning-based strategy selection

### 📊 Advanced Analytics

- **Real-time Performance Tracking**: Live vault performance metrics
- **Backtesting Engine**: Historical strategy testing
- **Risk Analytics**: Comprehensive risk assessment tools

### 🔒 Smart Contract Features

- **VaultHybridStrategy**: Main vault contract with TWAP capabilities
- **LimitOrderManager**: 1inch limit order integration
- **VaultFactory**: Factory pattern for vault deployment
- **Risk Management**: Automated risk controls and emergency stops

### 🎨 Frontend Features

- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data synchronization
- **Interactive Charts**: Advanced data visualization
- **Wallet Integration**: MetaMask and WalletConnect support

## 🛠️ Technology Stack

### Frontend
- **Astro**: Modern static site generator
- **React**: Interactive components
- **Tailwind CSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **Ethers.js**: Ethereum interaction

### Smart Contracts
- **Solidity**: Smart contract language
- **Foundry**: Development framework
- **OpenZeppelin**: Security libraries
- **1inch Protocol**: Limit order integration

### AI/ML
- **Sentiment Analysis**: Market sentiment scoring
- **Risk Modeling**: Advanced risk assessment
- **Strategy Optimization**: ML-driven strategy selection

## 📁 Project Structure

```
VaultPilot/
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Astro pages
│   │   ├── layouts/       # Page layouts
│   │   └── assets/        # Static assets
│   └── public/            # Public assets
├── backend/
│   ├── index.ts           # Main server file
│   ├── oneInch.ts         # 1inch integration
│   └── package.json
├── contracts/
│   ├── src/
│   │   ├── VaultHybridStrategy.sol
│   │   ├── LimitOrderManager.sol
│   │   └── VaultFactory.sol
│   └── script/
│       └── DeployVault.s.sol
├── ai-agent/
│   ├── index.ts           # AI agent logic
│   └── prompts/           # AI prompts
└── simulator/
    ├── backtest.ts        # Backtesting engine
    └── metrics.ts         # Performance metrics
```

## 🔧 API Endpoints

### Contract Management
- `GET /api/contract/stats` - Get vault statistics
- `GET /api/contract/execution-status` - Get execution status
- `POST /api/contract/sentiment` - Update sentiment score
- `POST /api/contract/pause` - Pause vault operations
- `POST /api/contract/resume` - Resume vault operations

### 1inch Integration
- `GET /api/1inch/quote` - Get price quotes
- `POST /api/1inch/create-order` - Create limit orders
- `POST /api/1inch/execute-order` - Execute limit orders
- `GET /api/1inch/order-status/:orderHash` - Get order status

### TWAP + Limit Orders
- `POST /api/twap-limit/create` - Create TWAP orders
- `GET /api/twap-limit/order/:orderHash` - Get TWAP order status
- `POST /api/twap-limit/execute-part` - Execute TWAP part
- `GET /api/twap-limit/stats` - Get TWAP statistics

### AI Integration
- `POST /api/ai/chat` - AI advisor chat

## 🎯 Hackathon Features

### 1inch Limit Order Protocol Integration
- ✅ **Full Protocol Integration**: Complete 1inch limit order support
- ✅ **TWAP Strategies**: Time-weighted average price implementation
- ✅ **Advanced Order Management**: Comprehensive order lifecycle
- ✅ **Real-time Quotes**: Live price feeds from 1inch API

### AI-Powered Features
- ✅ **Sentiment Analysis**: Real-time market sentiment scoring
- ✅ **Risk Management**: AI-driven risk assessment
- ✅ **Strategy Optimization**: ML-based strategy selection
- ✅ **Predictive Analytics**: Market trend prediction

### Smart Contract Innovation
- ✅ **Hybrid Strategies**: TWAP + Sentiment combination
- ✅ **Risk Controls**: Automated risk management
- ✅ **Factory Pattern**: Scalable vault deployment
- ✅ **Emergency Features**: Safety mechanisms

## 🚀 Deployment

### Smart Contracts (Sepolia Testnet)
```bash
cd contracts
forge build
forge script script/DeployVault.s.sol --rpc-url https://sepolia.drpc.org --broadcast --verify
```

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
# Deploy to your preferred hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **1inch Protocol**: For the amazing limit order protocol
- **OpenZeppelin**: For secure smart contract libraries
- **Astro**: For the modern frontend framework
- **Tailwind CSS**: For the beautiful design system

## 📞 Contact

- **Project Link**: [https://github.com/yourusername/vaultpilot](https://github.com/yourusername/vaultpilot)
- **Demo**: [https://vaultpilot.vercel.app](https://vaultpilot.vercel.app)

---

**Built with ❤️ for the 1inch Hackathon 2025**
