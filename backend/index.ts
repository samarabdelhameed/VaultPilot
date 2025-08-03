// backend/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";
import OneInchIntegration from "./oneInch";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Contract configuration
const CONTRACT_ADDRESS = "0x703A04d750E45182FB909D1EA0b4a6b7dC91F1a5";
const OWNER_ADDRESS = "0xF26f945C1e73278157c24C1dCBb8A19227547D29";
const RPC_URL = process.env.RPC_URL || "https://sepolia.drpc.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract ABI (updated for new functions)
const CONTRACT_ABI = [
  "function canExecute() public view returns (bool)",
  "function sentimentScore() public view returns (int256)",
  "function sentimentThreshold() public view returns (int256)",
  "function nextExecutionTime() public view returns (uint256)",
  "function executionInterval() public view returns (uint256)",
  "function owner() public view returns (address)",
  "function updateSentiment(int256 _score) external",
  "function updateRiskLevel(uint256 _riskLevel) external",
  "function executeTrade(bytes calldata order, bytes calldata signature, bytes calldata interaction) external payable",
  "function getVaultStats() external view returns (uint256, uint256, uint256, uint256, int256, uint256)",
  "function getExecutionStatus() external view returns (bool, bool, uint256, bool, bool)",
  "function isActive() public view returns (bool)",
  "function riskLevel() public view returns (uint256)",
  "function totalExecutedTrades() public view returns (uint256)",
  "function totalVolume() public view returns (uint256)",
  "function pauseVault() external",
  "function resumeVault() external",
  "function emergencyWithdraw(address token) external"
];

// Initialize contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Initialize 1inch integration
const oneInch = new OneInchIntegration(provider, wallet);

// Routes

// ✅ Test route
app.get("/", (req, res) => {
  res.json({
    message: "VaultPilot Backend API is working ✅",
    version: "1.0.0",
    contract: CONTRACT_ADDRESS,
    network: "Sepolia"
  });
});

// ✅ Get contract status
app.get("/api/contract/status", async (req, res) => {
  try {
    const canExecute = await contract.canExecute();
    const sentimentScore = await contract.sentimentScore();
    const sentimentThreshold = await contract.sentimentThreshold();
    const nextExecutionTime = await contract.nextExecutionTime();
    const executionInterval = await contract.executionInterval();
    const owner = await contract.owner();

    res.json({
      success: true,
      data: {
        canExecute: canExecute,
        sentimentScore: Number(sentimentScore),
        sentimentThreshold: Number(sentimentThreshold),
        nextExecutionTime: Number(nextExecutionTime),
        executionInterval: Number(executionInterval),
        owner: owner,
        contractAddress: CONTRACT_ADDRESS
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// ✅ Update sentiment score
app.post("/api/contract/sentiment", async (req, res) => {
  try {
    const { score } = req.body;
    
    if (typeof score !== 'number' || score < 0 || score > 100) {
      return res.status(400).json({
        success: false,
        error: "Score must be a number between 0 and 100"
      });
    }

    const tx = await contract.updateSentiment(score);
    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        newScore: score,
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// ✅ Execute trade (placeholder for now)
app.post("/api/contract/execute", async (req, res) => {
  try {
    const { order, signature, interaction } = req.body;
    
    if (!order || !signature || !interaction) {
      return res.status(400).json({
        success: false,
        error: "Order, signature, and interaction are required"
      });
    }

    // Check if execution is possible
    const canExecute = await contract.canExecute();
    if (!canExecute) {
      return res.status(400).json({
        success: false,
        error: "Execution conditions not met"
      });
    }

    const tx = await contract.executeTrade(order, signature, interaction);
    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        transactionHash: tx.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// ✅ Health check
app.get("/api/health", async (req, res) => {
  try {
    const owner = await contract.owner();
    const sentimentScore = await contract.sentimentScore();
    
    res.json({
      success: true,
      data: {
        status: "healthy",
        contract: CONTRACT_ADDRESS,
        owner: owner,
        sentimentScore: Number(sentimentScore),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// ✅ 1inch Integration Endpoints

// Get quote from 1inch
app.get("/api/1inch/quote", async (req, res) => {
  try {
    const { fromToken, toToken, amount } = req.query;
    
    if (!fromToken || !toToken || !amount) {
      return res.status(400).json({
        success: false,
        error: "fromToken, toToken, and amount are required"
      });
    }

    const quote = await oneInch.getQuote(fromToken as string, toToken as string, amount as string);
    
    res.json({
      success: true,
      data: quote
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Create limit order
app.post("/api/1inch/create-order", async (req, res) => {
  try {
    const { makerAsset, takerAsset, makerAmount, takerAmount, expiration } = req.body;
    
    if (!makerAsset || !takerAsset || !makerAmount || !takerAmount || !expiration) {
      return res.status(400).json({
        success: false,
        error: "All order parameters are required"
      });
    }

    const order = await oneInch.createLimitOrder(
      makerAsset,
      takerAsset,
      makerAmount,
      takerAmount,
      expiration
    );
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Execute limit order
app.post("/api/1inch/execute-order", async (req, res) => {
  try {
    const { order, signature, interaction } = req.body;
    
    if (!order || !signature || !interaction) {
      return res.status(400).json({
        success: false,
        error: "order, signature, and interaction are required"
      });
    }

    const result = await oneInch.executeLimitOrder(order, signature, interaction);
    
    res.json({
      success: true,
      data: {
        transactionHash: result.hash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get order status
app.get("/api/1inch/order-status/:orderHash", async (req, res) => {
  try {
    const { orderHash } = req.params;
    
    const status = await oneInch.getOrderStatus(orderHash);
    
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Cancel order
app.post("/api/1inch/cancel-order", async (req, res) => {
  try {
    const { orderHash } = req.body;
    
    if (!orderHash) {
      return res.status(400).json({
        success: false,
        error: "orderHash is required"
      });
    }

    const result = await oneInch.cancelOrder(orderHash);
    
    res.json({
      success: true,
      data: {
        transactionHash: result.hash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get user orders
app.get("/api/1inch/user-orders/:userAddress", async (req, res) => {
  try {
    const { userAddress } = req.params;
    
    const orders = await oneInch.getUserOrders(userAddress);
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// ✅ Vault Management Endpoints

// Update risk level
app.post("/api/contract/risk", async (req, res) => {
  try {
    const { riskLevel } = req.body;
    
    if (typeof riskLevel !== 'number' || riskLevel < 0 || riskLevel > 100) {
      return res.status(400).json({
        success: false,
        error: "Risk level must be a number between 0 and 100"
      });
    }

    const tx = await contract.updateRiskLevel(riskLevel);
    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get vault statistics
app.get("/api/contract/stats", async (req, res) => {
  try {
    const stats = await contract.getVaultStats();
    
    res.json({
      success: true,
      data: {
        totalTrades: Number(stats[0]),
        totalVolume: Number(stats[1]),
        lastExecution: Number(stats[2]),
        nextExecution: Number(stats[3]),
        currentSentiment: Number(stats[4]),
        currentRisk: Number(stats[5])
      }
    });
  } catch (error) {
    console.error('Error getting vault stats:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Get execution status
app.get("/api/contract/execution-status", async (req, res) => {
  try {
    const status = await contract.getExecutionStatus();
    
    res.json({
      success: true,
      data: {
        canExecute: status[0],
        isActive: status[1],
        timeUntilNext: Number(status[2]),
        sentimentMet: status[3],
        riskAcceptable: status[4]
      }
    });
  } catch (error) {
    console.error('Error getting execution status:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Pause vault
app.post("/api/contract/pause", async (req, res) => {
  try {
    const tx = await contract.pauseVault();
    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }
    });
  } catch (error) {
    console.error('Error pausing vault:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Resume vault
app.post("/api/contract/resume", async (req, res) => {
  try {
    const tx = await contract.resumeVault();
    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// ✅ AI Chat endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: "Message is required and must be a string"
      });
    }

    // Get current sentiment score
    const sentimentScore = await contract.sentimentScore();
    
    // Simple AI response based on message content and sentiment
    const lowerMessage = message.toLowerCase();
    let response = "";

    if (lowerMessage.includes("safe") || lowerMessage.includes("safest")) {
      response = "For the safest DeFi strategy, I recommend Compound Finance with 12.4% APY. It's a well-established protocol with low risk and consistent returns.";
    } else if (lowerMessage.includes("yield") || lowerMessage.includes("apy")) {
      response = "For maximum yield, consider Yearn USDC Vault with 24.3% APY, but be aware it carries higher risk. For balanced returns, Curve 3Pool offers 18.7% APY with medium risk.";
    } else if (lowerMessage.includes("risk") || lowerMessage.includes("dangerous")) {
      response = "Risk management is crucial in DeFi. Always diversify your investments, never invest more than you can afford to lose, and consider using established protocols like Compound or Aave.";
    } else if (lowerMessage.includes("strategy") || lowerMessage.includes("recommend")) {
      response = "Based on current market conditions, I recommend: 1) Compound Finance (12.4% APY, Low Risk) for stability, 2) Curve 3Pool (18.7% APY, Medium Risk) for balance, 3) Yearn USDC Vault (24.3% APY, Higher Risk) for maximum yield.";
    } else if (lowerMessage.includes("sentiment") || lowerMessage.includes("market")) {
      const sentiment = Number(sentimentScore);
      if (sentiment >= 70) {
        response = `Current market sentiment is bullish (${sentiment}/100). This suggests good conditions for DeFi investments. Consider increasing your exposure to yield-generating protocols.`;
      } else if (sentiment >= 50) {
        response = `Market sentiment is neutral (${sentiment}/100). Consider maintaining current positions and monitoring for better opportunities.`;
      } else {
        response = `Market sentiment is bearish (${sentiment}/100). Consider reducing risk exposure and focusing on stable, established protocols.`;
      }
    } else {
      response = "I'm here to help with your DeFi strategies! Ask me about safe investments, yield optimization, risk management, or specific protocols. I can provide personalized recommendations based on your risk tolerance and goals.";
    }

    res.json({
      success: true,
      data: {
        response: response,
        sentimentScore: Number(sentimentScore),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// === LIMIT ORDER MANAGER ENDPOINTS ===

// Get order details
app.get('/api/limit-orders/order/:orderHash', async (req, res) => {
  try {
    const { orderHash } = req.params;
    
    // Mock response for now
    const order = {
      maker: "0xF26f945C1e73278157c24C1dCBb8A19227547D29",
      makerAsset: "0x0000000000000000000000000000000000000000",
      takerAsset: "0x0000000000000000000000000000000000000000",
      makerAmount: "1000000000000000000",
      takerAmount: "1000000000000000000",
      expiration: Math.floor(Date.now() / 1000) + 3600,
      orderHash: orderHash,
      isActive: true,
      isFilled: false,
      isCancelled: false,
      createdAt: Math.floor(Date.now() / 1000),
      filledAt: 0
    };
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order details'
    });
  }
});

// Get user orders
app.get('/api/limit-orders/user/:userAddress', async (req, res) => {
  try {
    const { userAddress } = req.params;
    
    // Mock response for now
    const orders = [
      {
        orderHash: "0xa13d9b5ccf47b1f18b0d03356e5a82de35170c18c10f1ac237c5616210cd0544",
        makerAsset: "0x0000000000000000000000000000000000000000",
        takerAsset: "0x0000000000000000000000000000000000000000",
        makerAmount: "1000000000000000000",
        takerAmount: "1000000000000000000",
        expiration: Math.floor(Date.now() / 1000) + 3600,
        isActive: true,
        isFilled: false,
        isCancelled: false,
        createdAt: Math.floor(Date.now() / 1000)
      }
    ];
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user orders'
    });
  }
});

// Get order statistics
app.get('/api/limit-orders/stats', async (req, res) => {
  try {
    // Mock response for now
    const stats = {
      totalOrders: 10,
      activeOrders: 5,
      filledOrders: 3,
      cancelledOrders: 2,
      totalVolume: "5000000000000000000"
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order statistics'
    });
  }
});

// Create limit order
app.post('/api/limit-orders/create', async (req, res) => {
  try {
    const { makerAsset, takerAsset, makerAmount, takerAmount, expiration } = req.body;
    
    // Validate input
    if (!makerAsset || !takerAsset || !makerAmount || !takerAmount || !expiration) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Generate mock order hash
    const orderHash = "0x" + Math.random().toString(16).substr(2, 64);
    
    res.json({
      success: true,
      data: {
        orderHash,
        makerAsset,
        takerAsset,
        makerAmount,
        takerAmount,
        expiration,
        createdAt: Math.floor(Date.now() / 1000)
      }
    });
  } catch (error) {
    console.error('Error creating limit order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create limit order'
    });
  }
});

// Fill limit order
app.post('/api/limit-orders/fill', async (req, res) => {
  try {
    const { orderHash, signature, interaction } = req.body;
    
    if (!orderHash || !signature || !interaction) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Mock transaction hash
    const transactionHash = "0x" + Math.random().toString(16).substr(2, 64);
    
    res.json({
      success: true,
      data: {
        transactionHash,
        orderHash,
        gasUsed: "150000"
      }
    });
  } catch (error) {
    console.error('Error filling limit order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fill limit order'
    });
  }
});

// Cancel limit order
app.post('/api/limit-orders/cancel', async (req, res) => {
  try {
    const { orderHash } = req.body;
    
    if (!orderHash) {
      return res.status(400).json({
        success: false,
        error: 'Missing order hash'
      });
    }
    
    // Mock transaction hash
    const transactionHash = "0x" + Math.random().toString(16).substr(2, 64);
    
    res.json({
      success: true,
      data: {
        transactionHash,
        orderHash
      }
    });
  } catch (error) {
    console.error('Error cancelling limit order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel limit order'
    });
  }
});

// === TWAP + LIMIT ORDERS ENDPOINTS ===

// Create TWAP + Limit Order
app.post('/api/twap-limit/create', async (req, res) => {
  try {
    const { 
      payToken, 
      receiveToken, 
      payAmount, 
      receiveAmount, 
      totalDuration, 
      partDuration, 
      expiration,
      vibeCheck 
    } = req.body;
    
    // Validate input
    if (!payToken || !receiveToken || !payAmount || !receiveAmount || !totalDuration || !partDuration || !expiration) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Calculate TWAP parts
    const totalMinutes = parseInt(totalDuration);
    const partMinutes = parseInt(partDuration);
    const parts = Math.ceil(totalMinutes / partMinutes);
    const amountPerPart = parseFloat(payAmount) / parts;
    
    // Generate mock order hash
    const orderHash = "0x" + Math.random().toString(16).substr(2, 64);
    
    res.json({
      success: true,
      data: {
        orderHash,
        payToken,
        receiveToken,
        payAmount,
        receiveAmount,
        totalDuration,
        partDuration,
        parts,
        amountPerPart,
        expiration,
        vibeCheck,
        createdAt: Math.floor(Date.now() / 1000),
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error creating TWAP order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create TWAP order'
    });
  }
});

// Get TWAP order status
app.get('/api/twap-limit/order/:orderHash', async (req, res) => {
  try {
    const { orderHash } = req.params;
    
    // Mock response
    const order = {
      orderHash,
      payToken: "USDC",
      receiveToken: "1INCH",
      payAmount: "100",
      receiveAmount: "500",
      totalDuration: "60",
      partDuration: "15",
      parts: 4,
      amountPerPart: "25",
      expiration: Math.floor(Date.now() / 1000) + 604800, // 7 days
      vibeCheck: true,
      status: "active",
      executedParts: 2,
      remainingParts: 2,
      createdAt: Math.floor(Date.now() / 1000) - 3600,
      lastExecution: Math.floor(Date.now() / 1000) - 900
    };
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting TWAP order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get TWAP order'
    });
  }
});

// Execute TWAP part
app.post('/api/twap-limit/execute-part', async (req, res) => {
  try {
    const { orderHash, partNumber } = req.body;
    
    if (!orderHash || !partNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      });
    }
    
    // Mock transaction hash
    const transactionHash = "0x" + Math.random().toString(16).substr(2, 64);
    
    res.json({
      success: true,
      data: {
        orderHash,
        partNumber,
        transactionHash,
        gasUsed: "150000",
        executedAt: Math.floor(Date.now() / 1000)
      }
    });
  } catch (error) {
    console.error('Error executing TWAP part:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to execute TWAP part'
    });
  }
});

// Get TWAP statistics
app.get('/api/twap-limit/stats', async (req, res) => {
  try {
    // Mock response
    const stats = {
      totalOrders: 15,
      activeOrders: 8,
      completedOrders: 5,
      cancelledOrders: 2,
      totalVolume: "2500000000000000000000",
      averageExecutionTime: "45",
      successRate: "93.3"
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting TWAP stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get TWAP statistics'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VaultPilot Backend API is running on http://localhost:${PORT}`);
  console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);
  console.log(`👤 Owner Address: ${OWNER_ADDRESS}`);
  console.log(`🌐 Network: Sepolia`);
});
