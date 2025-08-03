// backend/index.ts
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ethers } from "ethers";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Contract configuration
const CONTRACT_ADDRESS = "0x71C3f104aB544377712A8d1B393fB981F37226b6";
const OWNER_ADDRESS = "0xF26f945C1e73278157c24C1dCBb8A19227547D29";
const RPC_URL = process.env.RPC_URL || "https://sepolia.drpc.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract ABI (minimal for our functions)
const CONTRACT_ABI = [
  "function canExecute() public view returns (bool)",
  "function sentimentScore() public view returns (int256)",
  "function sentimentThreshold() public view returns (int256)",
  "function nextExecutionTime() public view returns (uint256)",
  "function executionInterval() public view returns (uint256)",
  "function owner() public view returns (address)",
  "function updateSentiment(int256 _score) external",
  "function executeTrade(bytes calldata order, bytes calldata signature, bytes calldata interaction) external"
];

// Initialize contract
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 VaultPilot Backend API is running on http://localhost:${PORT}`);
  console.log(`📋 Contract Address: ${CONTRACT_ADDRESS}`);
  console.log(`👤 Owner Address: ${OWNER_ADDRESS}`);
  console.log(`🌐 Network: Sepolia`);
});
