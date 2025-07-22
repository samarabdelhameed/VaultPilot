import React, { useState } from 'react';

interface ConnectWalletButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ConnectWalletButton: React.FC<ConnectWalletButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  className = ''
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    setIsLoading(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-primary-green to-primary-purple hover:shadow-glow text-black font-semibold',
    secondary: 'bg-gray-800/50 border border-gray-700 hover:border-primary-green text-white'
  };

  if (isConnected) {
    return (
      <button
        onClick={handleDisconnect}
        className={`${sizeClasses[size]} ${variantClasses.secondary} rounded-full transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 ${className}`}
      >
        <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
        <span>0x1234...5678</span>
        <span className="text-gray-400">|</span>
        <span className="text-red-400 hover:text-red-300">Disconnect</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isLoading}
      className={`${sizeClasses[size]} ${variantClasses[variant]} rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 ${className}`}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span>Connect Wallet</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </>
      )}
    </button>
  );
};

export default ConnectWalletButton;