import React from 'react';

const MaintenanceBanner = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-500 text-yellow-900 py-3 px-4 text-center">
      <p className="text-sm">
        Our system is currently undergoing maintenance. Some features may be unavailable. Thank you for your patience.
      </p>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-4 text-yellow-900 hover:text-yellow-700"
      >
        ✕
      </button>
    </div>
  );
};

export default MaintenanceBanner;
