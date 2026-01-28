import React, { useState, useRef, useEffect } from 'react';
import { Download, RotateCcw, Share2, Layers } from 'lucide-react';

interface ResultViewProps {
  imageSrc: string;
  onRetake: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ imageSrc, onRetake }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Handle mouse/touch move to simulate 3D Spline viewer interaction
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    let clientX, clientY;
    
    if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = (e as React.MouseEvent).clientX;
        clientY = (e as React.MouseEvent).clientY;
    }

    const centerX = rect.left + width / 2;
    const centerY = rect.top + height / 2;

    const mouseX = clientX - centerX;
    const mouseY = clientY - centerY;

    // Rotation intensity
    const rotateX = (mouseY / (height / 2)) * -15; // Invert axis
    const rotateY = (mouseX / (width / 2)) * 15;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = `literal-sticker-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full w-full bg-black p-6 relative">
      
      {/* Header */}
      <div className="w-full flex justify-end items-center z-10 pt-4">
        <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </div>
      </div>

      {/* 3D Card Preview Container (Spline-like) */}
      <div 
        className="perspective-container flex-1 flex items-center justify-center w-full max-w-md py-8"
        onMouseMove={handleMouseMove}
        onTouchMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchEnd={handleMouseLeave}
      >
        <div 
          ref={cardRef}
          className="card-3d relative w-64 h-64 md:w-80 md:h-80 cursor-grab active:cursor-grabbing"
          style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
          }}
        >
          {/* Back Glow */}
          <div className="absolute inset-0 bg-white/5 rounded-3xl blur-2xl transform translate-z-[-20px]" />
          
          {/* The Sticker Card */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden border border-white/10 bg-pureBlack shadow-2xl">
             {/* Grid Background to prove transparency/black */}
             <div 
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
             />
             
             {/* The Result Image */}
             <img 
                src={imageSrc} 
                alt="Literal Sticker" 
                className="w-full h-full object-cover z-10 relative"
                draggable={false}
             />
             
             {/* Gloss Effect */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-20" />
          </div>
        </div>
        
        <div className="absolute bottom-32 text-white/30 text-xs font-mono animate-pulse pointer-events-none">
            DRAG TO ROTATE
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full max-w-md flex flex-col gap-3 pb-6 z-10">
        <button
          onClick={handleDownload}
          className="w-full bg-white text-black h-14 rounded-full font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download Asset
        </button>

        <div className="flex gap-3">
          <button
            onClick={onRetake}
            className="flex-1 bg-white/10 text-white h-12 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </button>
          
          {/* Share/Copy - Secondary util */}
          <button
            onClick={() => {
                // Clipboard copy if supported
                 try {
                    fetch(imageSrc)
                    .then(res => res.blob())
                    .then(blob => {
                        const item = new ClipboardItem({ "image/png": blob });
                        navigator.clipboard.write([item]);
                        alert("Copied to clipboard!");
                    });
                 } catch (e) {
                     alert("Clipboard access not supported on this browser.");
                 }
            }}
            className="flex-1 bg-white/5 text-white/70 h-12 rounded-full font-medium text-sm flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
          >
            <Layers className="w-4 h-4" />
            Copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultView;