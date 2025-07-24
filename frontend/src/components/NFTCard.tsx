import React, { useState } from 'react';

interface NFTCardProps {
  name: string;
  image: string;
  price: string;
  roi: string;
  creator: string;
  rarity?: 'Common' | 'Rare' | 'Epic' | 'Legendary';
}

const NFTCard: React.FC<NFTCardProps> = ({ 
  name, 
  image, 
  price, 
  roi, 
  creator, 
  rarity = 'Common' 
}) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  const rarityColors = {
    Common: 'text-gray-400 bg-gray-800/30',
    Rare: 'text-blue-400 bg-blue-900/30',
    Epic: 'text-purple-400 bg-purple-900/30',
    Legendary: 'text-yellow-400 bg-yellow-900/30'
  };

  const handleBuyNow = async () => {
    setIsPurchasing(true);
    
    // Simulate NFT purchase process
    const purchaseSteps = [
      'Connecting to wallet...',
      'Approving transaction...',
      'Processing payment...',
      'Transferring NFT ownership...',
      'Purchase completed!'
    ];

    for (let i = 0; i < purchaseSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      // In real app, you'd update UI with current step
    }

    setIsPurchasing(false);
    
    // Show success notification
    showNotification(`Successfully purchased ${name} for ${price} ETH!`, 'success');
  };

  const handleViewDetails = () => {
    setIsViewingDetails(true);
    
    // Simulate loading vault details
    setTimeout(() => {
      setIsViewingDetails(false);
      // In real app, this would open a modal or navigate to vault details
      showNotification(`Loading details for ${name}...`, 'info');
    }, 1000);
  };

  const showNotification = (message: string, type: 'success' | 'info' | 'error') => {
    const notification = document.createElement('div');
    const colors = {
      success: 'bg-green-500/20 border-green-500/30 text-green-400',
      info: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
      error: 'bg-red-500/20 border-red-500/30 text-red-400'
    };
    
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg border backdrop-blur-md ${colors[type]} animate-slide-in-right`;
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 rounded-full bg-current animate-pulse"></div>
        <span>${message}</span>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  };

  return (
    <div className="group relative bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden hover:shadow-soft transition-all duration-300 transform hover:scale-[1.02] animate-fade-in">
      {/* NFT Image */}
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${rarityColors[rarity]}`}>
            {rarity}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>

      {/* NFT Details */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
            <p className="text-gray-400 text-sm">by {creator}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-xs">Price</p>
            <p className="text-white font-semibold">{price} ETH</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">ROI</p>
            <p className="text-primary-green font-semibold">+{roi}%</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-green to-primary-purple text-black font-medium rounded-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105"
            onClick={handleBuyNow}
            disabled={isPurchasing}
          >
            {isPurchasing ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Purchasing...</span>
              </>
            ) : (
              <span>Buy Now</span>
            )}
          </button>
          <button 
            onClick={handleViewDetails}
            disabled={isPurchasing}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-green to-primary-purple text-black font-medium rounded-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isViewingDetails ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : (
              <span>View Details</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;