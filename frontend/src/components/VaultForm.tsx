import React, { useState } from 'react';

interface VaultFormProps {
  onSubmit?: (data: any) => void;
}

const VaultForm: React.FC<VaultFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    tradingPair: 'ETH/USDC',
    strategy: 'TWAP',
    timeInterval: '1h',
    maxDrawdown: 10,
    initialDeposit: ''
  });

  const [isDeploying, setIsDeploying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeploying(true);
    
    // Simulate smart contract deployment process
    const deploymentSteps = [
      { step: 'Validating parameters...', duration: 800 },
      { step: 'Compiling smart contract...', duration: 1200 },
      { step: 'Deploying to blockchain...', duration: 2000 },
      { step: 'Initializing vault...', duration: 1000 },
      { step: 'Setting up AI strategy...', duration: 800 }
    ];

    let currentStep = 0;
    const deploymentInterval = setInterval(() => {
      if (currentStep < deploymentSteps.length) {
        const stepElement = document.getElementById('deployment-step');
        if (stepElement) {
          stepElement.textContent = deploymentSteps[currentStep].step;
        }
        currentStep++;
      } else {
        clearInterval(deploymentInterval);
        // Show success and redirect
        const stepElement = document.getElementById('deployment-step');
        if (stepElement) {
          stepElement.textContent = 'Vault deployed successfully!';
        }
        
        setTimeout(() => {
          setIsDeploying(false);
          // Generate unique vault ID and redirect
          const vaultId = `${formData.tradingPair.toLowerCase().replace('/', '-')}-${formData.strategy.toLowerCase()}-vault`;
          window.location.href = `/vault/${vaultId}`;
        }, 1500);
      }
    }, 1000);
    
    onSubmit?.(formData);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-8 bg-gradient-to-r from-primary-green to-primary-purple bg-clip-text text-transparent">
        Create New Vault
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trading Pair */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Trading Pair
          </label>
          <select
            value={formData.tradingPair}
            onChange={(e) => handleInputChange('tradingPair', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-white transition-all duration-200"
          >
            <option value="ETH/USDC">ETH/USDC</option>
            <option value="BTC/USDT">BTC/USDT</option>
            <option value="ETH/BTC">ETH/BTC</option>
            <option value="MATIC/USDC">MATIC/USDC</option>
          </select>
        </div>

        {/* Vault Name */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Vault Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
            placeholder="Enter vault name"
            required
          />
        </div>

        {/* Strategy Selection */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Strategy Type
          </label>
          <select
            value={formData.strategy}
            onChange={(e) => handleInputChange('strategy', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-white transition-all duration-200"
          >
            <option value="TWAP">TWAP (Time-Weighted Average Price)</option>
            <option value="Sentiment">Sentiment Analysis</option>
            <option value="Hybrid">Hybrid (TWAP + Sentiment)</option>
          </select>
        </div>

        {/* Time Interval */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Time Interval
          </label>
          <select
            value={formData.timeInterval}
            onChange={(e) => handleInputChange('timeInterval', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-white transition-all duration-200"
          >
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day</option>
          </select>
        </div>

        {/* Max Drawdown */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Max Drawdown: <span className="text-primary-green">{formData.maxDrawdown}%</span>
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={formData.maxDrawdown}
            onChange={(e) => handleInputChange('maxDrawdown', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>5% (Conservative)</span>
            <span>50% (Aggressive)</span>
          </div>
        </div>

        {/* Initial Deposit */}
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">
            Initial Deposit (ETH)
          </label>
          <input
            type="number"
            value={formData.initialDeposit}
            onChange={(e) => handleInputChange('initialDeposit', e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-green focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={isDeploying}
            className="w-full px-8 py-4 bg-gradient-to-r from-primary-green to-primary-purple text-black font-semibold rounded-full hover:shadow-glow transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isDeploying ? (
              <>
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <div className="flex flex-col items-center">
                  <span>Deploying Smart Vault...</span>
                  <span id="deployment-step" className="text-xs opacity-80 mt-1">Initializing...</span>
                </div>
              </>
            ) : (
              <span>Deploy Smart Vault</span>
            )}
          </button>
          
          {isDeploying && (
            <div className="mt-4 p-4 bg-primary-green/10 border border-primary-green/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
                <span className="text-primary-green font-medium text-sm">Smart Contract Deployment</span>
              </div>
              <p className="text-gray-300 text-sm">
                Your vault is being deployed to the blockchain. This process may take a few moments...
              </p>
              <div className="mt-2 bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-primary-green to-primary-purple h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default VaultForm;