import React from 'react';

interface VaultCardProps {
  id: string;
  name: string;
  strategy: string;
  tradingPair: string;
  balance: string;
  roi: string;
  trades: number;
  status: 'Active' | 'Paused' | 'Stopped';
  onClick?: () => void;
}

const VaultCard: React.FC<VaultCardProps> = ({
  id,
  name,
  strategy,
  tradingPair,
  balance,
  roi,
  trades,
  status,
  onClick
}) => {
  const statusColors = {
    Active: 'bg-primary-green/20 text-primary-green border-primary-green/30',
    Paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Stopped: 'bg-red-500/20 text-red-400 border-red-500/30'
  };

  const strategyIcons = {
    TWAP: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    Sentiment: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    Hybrid: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    )
  };

  return (
    <div 
      onClick={onClick}
      className="group relative p-6 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass hover:shadow-glass-hover transition-all duration-300 transform hover:scale-[1.02] cursor-pointer animate-fade-in"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-green/10 to-primary-purple/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary-green/20 to-primary-purple/20 rounded-lg">
              {strategyIcons[strategy as keyof typeof strategyIcons]}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{name}</h3>
              <p className="text-gray-400 text-sm">{tradingPair}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColors[status]}`}>
            {status}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="space-y-1">
            <p className="text-gray-400 text-xs">Balance</p>
            <p className="text-white font-semibold text-lg">{balance}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-xs">ROI</p>
            <p className="text-primary-green font-semibold text-lg">{roi}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-xs">Strategy</p>
            <p className="text-white font-medium">{strategy}</p>
          </div>
          <div className="space-y-1">
            <p className="text-gray-400 text-xs">Trades</p>
            <p className="text-white font-medium">{trades.toLocaleString()}</p>
          </div>
        </div>

        {/* Action Button */}
        <button className="w-full px-4 py-2 bg-gradient-to-r from-primary-green/20 to-primary-purple/20 hover:from-primary-green/30 hover:to-primary-purple/30 border border-white/20 text-white rounded-lg transition-all duration-200 transform hover:scale-105">
          View Dashboard
        </button>
      </div>
    </div>
  );
};

export default VaultCard;