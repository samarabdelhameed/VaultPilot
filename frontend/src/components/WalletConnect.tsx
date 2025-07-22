import React, { useState, useEffect } from 'react';

interface WalletConnectProps {
  className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ className = '' }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);

  // Simulate wallet connection - in real app, use wagmi/viem
  const connectWallet = async () => {
    setIsConnecting(true);
    
    // Simulate MetaMask connection
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        // Request account access
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts',
        });
        
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
          localStorage.setItem('wallet_connected', 'true');
          localStorage.setItem('wallet_address', accounts[0]);
        }
      } else {
        // Simulate connection for demo
        setTimeout(() => {
          const mockAddress = '0x1234567890123456789012345678901234567890';
          setAddress(mockAddress);
          setIsConnected(true);
          localStorage.setItem('wallet_connected', 'true');
          localStorage.setItem('wallet_address', mockAddress);
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setAddress('');
    localStorage.removeItem('wallet_connected');
    localStorage.removeItem('wallet_address');
  };

  // Check for existing connection on mount
  useEffect(() => {
    const connected = localStorage.getItem('wallet_connected');
    const savedAddress = localStorage.getItem('wallet_address');
    
    if (connected && savedAddress) {
      setIsConnected(true);
      setAddress(savedAddress);
    }
  }, []);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Generate identicon-style avatar
  const generateAvatar = (addr: string) => {
    const colors = ['#00FFBF', '#A259FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4'];
    const hash = addr.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  if (isConnected) {
    return (
      <div className={`flex items-center space-x-3 animate-slide-in-right ${className}`}>
        <div className="flex items-center space-x-3 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-glass hover:shadow-glass-hover transition-all duration-300">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: generateAvatar(address) }}
          >
            {address.slice(2, 4).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium">{formatAddress(address)}</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
              <span className="text-primary-green text-xs">Connected</span>
            </div>
          </div>
        </div>
        <button
          onClick={disconnectWallet}
          className="p-2 text-gray-400 hover:text-red-400 transition-all duration-200 hover:bg-red-500/10 rounded-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connectWallet}
      disabled={isConnecting}
      className={`bg-gradient-to-r from-primary-green to-primary-purple px-6 py-3 rounded-full text-black font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 animate-bounce-gentle ${className}`}
    >
      {isConnecting ? (
        <>
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span>Connect Wallet</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </>
      )}
    </button>
  );
};

export default WalletConnect;