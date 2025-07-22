import React, { useState } from 'react';

interface AIPromptBoxProps {
  message: string;
  suggestion?: string;
  onApply?: () => void;
  type?: 'info' | 'warning' | 'success';
}

const AIPromptBox: React.FC<AIPromptBoxProps> = ({
  message,
  suggestion,
  onApply,
  type = 'info'
}) => {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    if (!onApply) return;
    
    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    onApply();
    setIsApplying(false);
  };

  const typeStyles = {
    info: 'from-primary-green/20 to-primary-green/5 border-primary-green/30',
    warning: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
    success: 'from-primary-purple/20 to-primary-purple/5 border-primary-purple/30'
  };

  const iconColors = {
    info: 'text-primary-green',
    warning: 'text-yellow-400',
    success: 'text-primary-purple'
  };

  return (
    <div className={`p-6 bg-gradient-to-br ${typeStyles[type]} backdrop-blur-md border rounded-2xl shadow-glass animate-fade-in`}>
      <div className="flex items-start space-x-4">
        {/* AI Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-green to-primary-purple rounded-full flex items-center justify-center animate-pulse-glow">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <h3 className={`font-semibold ${iconColors[type]}`}>AI Recommendation</h3>
            <div className="w-2 h-2 bg-primary-green rounded-full animate-pulse"></div>
          </div>
          
          <p className="text-gray-300 mb-4 leading-relaxed">{message}</p>
          
          {suggestion && (
            <div className="p-4 bg-white/5 rounded-lg mb-4">
              <p className="text-white font-medium mb-2">Suggested Action:</p>
              <p className="text-gray-300 text-sm">{suggestion}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {onApply && (
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="px-6 py-2 bg-gradient-to-r from-primary-green to-primary-purple text-black font-medium rounded-lg hover:shadow-glow transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isApplying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Applying...</span>
                  </>
                ) : (
                  <>
                    <span>Apply Suggestion</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
            
            <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPromptBox;