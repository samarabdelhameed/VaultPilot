import React from 'react';

interface CardStatProps {
  title: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  gradient?: 'green' | 'purple';
}

const CardStat: React.FC<CardStatProps> = ({ 
  title, 
  value, 
  change, 
  isPositive = true, 
  icon,
  gradient = 'green'
}) => {

  return (
    <div className="group relative p-6 bg-glass-gradient backdrop-blur-md border border-white/20 rounded-2xl shadow-glass hover:shadow-glass-hover transition-all duration-300 transform hover:scale-[1.02] animate-fade-in">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient === 'green' ? 'from-primary-green/10 to-primary-green/5' : 'from-primary-purple/10 to-primary-purple/5'} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
          {icon && <div className={gradient === 'green' ? 'text-primary-green' : 'text-primary-purple'}>{icon}</div>}
        </div>
        
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-white mb-1">{value}</p>
            {change && (
              <p className={`text-sm flex items-center ${
                isPositive ? (gradient === 'green' ? 'text-primary-green' : 'text-primary-purple') : 'text-red-400'
              }`}>
                <span className="mr-1">
                  {isPositive ? '↗' : '↘'}
                </span>
                {change}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardStat;