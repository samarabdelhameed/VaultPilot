import React from 'react';

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
  const rarityColors = {
    Common: 'text-gray-400 bg-gray-800/30',
    Rare: 'text-blue-400 bg-blue-900/30',
    Epic: 'text-purple-400 bg-purple-900/30',
    Legendary: 'text-yellow-400 bg-yellow-900/30'
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
          <button className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-green to-primary-purple text-black font-medium rounded-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105">
            Buy Now
          </button>
          <button className="px-4 py-2 bg-gray-800/50 border border-gray-600 text-gray-300 hover:border-primary-green hover:text-primary-green rounded-lg transition-all duration-200">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default NFTCard;