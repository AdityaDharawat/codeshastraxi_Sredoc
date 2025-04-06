import { useEffect, useState } from 'react';

const LoadingSpinner = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsVisible(false), 500); // Smoothly disappear after 500ms
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  };

  if (!isVisible) return null;

  return (
    <div className={`animate-spin rounded-full border-t-2 border-blue-500 ${sizeClasses[size]}`} />
  );
};

export default LoadingSpinner;
