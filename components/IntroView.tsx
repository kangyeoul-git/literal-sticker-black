import React, { useState, useEffect } from 'react';

interface IntroViewProps {
  onStart: () => void;
  onUnmount: () => void;
}

const IntroView: React.FC<IntroViewProps> = ({ onStart, onUnmount }) => {
  const [isFading, setIsFading] = useState(false);

  const handleClick = () => {
    if (isFading) return;
    
    // Start the fade out visual
    setIsFading(true);
    
    // Trigger the app to start (mount camera) immediately behind this view
    onStart();
  };

  // Handle the cleanup after animation
  useEffect(() => {
    if (isFading) {
      const timer = setTimeout(() => {
        onUnmount();
      }, 800); // 800ms match with CSS duration
      return () => clearTimeout(timer);
    }
  }, [isFading, onUnmount]);

  return (
    <div 
      onClick={handleClick}
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-1000 ease-in-out cursor-pointer select-none ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="text-center group">
        <h1 
            className="text-white text-5xl md:text-8xl font-black tracking-tighter leading-none transition-transform duration-700 group-hover:scale-105"
            style={{ fontFamily: '"Inter", sans-serif' }}
        >
            LITERAL<br className="md:hidden" /> STICKER
        </h1>
      </div>
    </div>
  );
};

export default IntroView;