import React from 'react';

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-blue-500 ${sizeClasses[size]}`} />
  );
};

export default LoadingSpinner;
