import React from 'react';

interface CTAButtonProps {
  children: React.ReactNode;
  variant?: 'green' | 'purple' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  variant = 'green',
  size = 'md',
  href,
  onClick,
  className = '',
  disabled = false
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg font-semibold'
  };

  const variantClasses = {
    green: 'bg-gradient-to-r from-primary-green to-emerald-400 hover:shadow-glow text-black font-medium',
    purple: 'bg-gradient-to-r from-primary-purple to-violet-500 hover:shadow-purple text-white font-medium',
    outline: 'bg-transparent border-2 border-primary-green hover:bg-primary-green hover:text-black text-primary-green font-medium'
  };

  const baseClasses = `
    ${sizeClasses[size]} 
    ${variantClasses[variant]} 
    rounded-full 
    transition-all 
    duration-200 
    transform 
    hover:scale-105 
    disabled:opacity-50 
    disabled:cursor-not-allowed
    disabled:hover:scale-100
    inline-flex
    items-center
    justify-center
    space-x-2
    ${className}
  `;

  if (href && !disabled) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
};

export default CTAButton;