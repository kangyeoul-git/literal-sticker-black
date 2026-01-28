import React from 'react';

const ProcessingView: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-black text-white space-y-8">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-2 border-white rounded-full animate-spin-slow opacity-50"></div>
        <div className="absolute inset-2 border-r-2 border-white rounded-full animate-spin opacity-70"></div>
        <div className="absolute inset-4 border-b-2 border-white rounded-full animate-spin-slow direction-reverse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold tracking-tight">Extracting Reality</h2>
        <p className="text-sm text-gray-500 font-mono">Converting background to #000000</p>
      </div>
    </div>
  );
};

export default ProcessingView;
