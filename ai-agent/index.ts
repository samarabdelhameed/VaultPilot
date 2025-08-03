// ai-agent/index.ts
import axios from 'axios';

// Backend API configuration
const BACKEND_URL = 'http://localhost:3001';

// Tool implementations
async function getContractStatus() {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/contract/status`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function updateSentiment(score: number) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/contract/sentiment`, {
      score: score
    });
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function executeTrade(order: string, signature: string, interaction: string) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/contract/execute`, {
      order: order,
      signature: signature,
      interaction: interaction
    });
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function analyzeMarketSentiment(marketData: any) {
  try {
    // Simple sentiment analysis based on market data
    const { price, volume, change_24h } = marketData;
    
    let sentimentScore = 50; // Base score
    
    // Price analysis
    if (change_24h > 5) sentimentScore += 20;
    else if (change_24h > 2) sentimentScore += 10;
    else if (change_24h < -5) sentimentScore -= 20;
    else if (change_24h < -2) sentimentScore -= 10;
    
    // Volume analysis
    if (volume > 1000000) sentimentScore += 10;
    else if (volume < 100000) sentimentScore -= 10;
    
    // Clamp score between 0 and 100
    sentimentScore = Math.max(0, Math.min(100, sentimentScore));
    
    // Update contract sentiment
    const updateResult = await updateSentiment(sentimentScore);
    
    return {
      success: true,
      data: {
        sentimentScore: sentimentScore,
        analysis: {
          price_trend: change_24h > 0 ? 'bullish' : 'bearish',
          volume_trend: volume > 1000000 ? 'high' : 'low',
          recommendation: sentimentScore > 60 ? 'buy' : sentimentScore < 40 ? 'sell' : 'hold'
        },
        contractUpdate: updateResult
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Main AI agent
async function main() {
  try {
    console.log('🤖 VaultPilot AI Agent starting...');
    
    // Test backend connection
    console.log('🔗 Testing backend connection...');
    const healthCheck = await axios.get(`${BACKEND_URL}/api/health`);
    console.log('✅ Backend connected:', healthCheck.data);
    
    // Test contract status
    console.log('📋 Getting contract status...');
    const contractStatus = await getContractStatus();
    console.log('✅ Contract status:', contractStatus);
    
    // Test sentiment analysis
    console.log('🧠 Testing sentiment analysis...');
    const marketData = {
      price: 50000,
      volume: 1500000,
      change_24h: 3.5
    };
    const sentimentResult = await analyzeMarketSentiment(marketData);
    console.log('✅ Sentiment analysis:', sentimentResult);
    
    console.log('🚀 VaultPilot AI Agent is ready!');
    console.log('📋 Available functions:');
    console.log('  - getContractStatus(): Get contract status');
    console.log('  - updateSentiment(score): Update sentiment score');
    console.log('  - executeTrade(order, signature, interaction): Execute trade');
    console.log('  - analyzeMarketSentiment(marketData): Analyze market sentiment');
    
  } catch (error) {
    console.error('❌ Error starting AI Agent:', error);
    process.exit(1);
  }
}

// Start the agent
main().catch(console.error); 