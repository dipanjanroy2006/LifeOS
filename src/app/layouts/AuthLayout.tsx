import React from 'react';
import { Outlet } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[110px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
      >
        {/* Left Side: Dynamic Showcase (Apple/Linear inspired) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-center text-left space-y-6 select-none p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 shadow-xl shadow-indigo-500/25">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-extrabold text-white tracking-tight leading-none">
              LifeOS
            </h1>
            <p className="text-sm font-mono text-zinc-400">
              The unified growth operating system.
            </p>
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
            Optimize your daily routines, catalog long-term goals, track valence & energy vectors, and achieve deep workflow execution. All encrypted and secured via Supabase.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm">
              <span className="text-xs font-bold text-white block">Realtime Analytics</span>
              <span className="text-[11px] text-zinc-400 block mt-1">Monitor habits consistency and life score dynamics instantly.</span>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-zinc-900/40 backdrop-blur-sm">
              <span className="text-xs font-bold text-white block">Goal Pillars</span>
              <span className="text-[11px] text-zinc-400 block mt-1">Break down objectives across fitness, career, finance, and mind.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Renders Active Child Auth Form */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <Outlet />
        </div>
      </motion.div>
    </div>
  );
};
