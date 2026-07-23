import React from 'react';
import { Atom } from '../../shared/components/ui/Atom';

export const SplashLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Background glow vector */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center relative z-10 space-y-4">
        <Atom color="#379d64" size="medium" />
        
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-text-primary tracking-widest font-mono uppercase">LifeOS</h2>
          <p className="text-[10px] text-text-muted font-mono">Initializing secure connection...</p>
        </div>
      </div>
    </div>
  );
};
