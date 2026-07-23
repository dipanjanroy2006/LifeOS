import React from 'react';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const SplashLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center relative overflow-hidden select-none">
      {/* Background glow vector */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center space-y-4 relative z-10">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
            ease: 'easeInOut'
          }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 shadow-xl shadow-indigo-500/25"
        >
          <Zap className="w-8 h-8 text-white fill-white" />
        </motion.div>
        
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-white tracking-widest font-mono uppercase">LifeOS</h2>
          <p className="text-[10px] text-zinc-500 font-mono">Initializing secure connection...</p>
        </div>
      </div>
    </div>
  );
};
