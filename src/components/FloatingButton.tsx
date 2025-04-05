import React from 'react';

interface FloatingButtonProps {
  onClick: () => void;
  bgColor: string;
  hoverColor: string;
  title: string;
  icon: React.ReactNode;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick, bgColor, hoverColor, title, icon }) => {
  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-full ${bgColor} shadow-lg ${hoverColor} transition-all duration-300 flex items-center justify-center text-white`}
      title={title}
    >
      {icon}
    </button>
  );
};

export default FloatingButton;
