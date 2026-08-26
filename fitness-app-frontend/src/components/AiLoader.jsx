import React from 'react';

const AiLoader = ({ message = "Processing with AI..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 animate-spin blur-md opacity-75"></div>
        
        {/* Inner spinning ring */}
        <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-cyan-400 border-r-fuchsia-500 border-b-indigo-400 animate-spin"></div>
        
        {/* Center glowing core */}
        <div className="absolute w-6 h-6 bg-white rounded-full shadow-[0_0_15px_#38bdf8] animate-pulse"></div>
      </div>
      
      <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default AiLoader;