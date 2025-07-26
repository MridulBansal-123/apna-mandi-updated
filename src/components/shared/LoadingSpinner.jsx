import React from 'react';

export default function LoadingSpinner({ size = 'md', text = '' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} border-4 border-gray-200 dark:border-dark-300 rounded-full animate-spin`}>
          {/* Inner gradient */}
          <div className="absolute inset-0 border-4 border-transparent border-t-primary-500 border-r-primary-400 rounded-full animate-spin"></div>
        </div>
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {text && (
        <p className="text-sm text-gray-600 dark:text-dark-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}
