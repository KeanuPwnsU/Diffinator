import React from 'react';

export const Spinner: React.FC = () => (
  <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-apex-accent border-t-transparent rounded-full animate-spin"></div>
        <div className="text-apex-accent font-mono text-sm tracking-widest animate-pulse">PROCESSING INTELLIGENCE...</div>
    </div>
  </div>
);
