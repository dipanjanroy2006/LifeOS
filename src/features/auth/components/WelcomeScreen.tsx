import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../shared/services/authService';
import { GlassCard } from '../../../components/common/GlassCard';
import { useToast } from '../../../hooks/useToast';
import { LogIn, UserPlus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (e: any) {
      toast.error(e.message || 'Google Auth redirection failed.');
    }
  };

  return (
    <GlassCard glow className="p-6 text-center space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-white tracking-tight">Welcome to LifeOS</h2>
        <p className="text-xs text-zinc-400 leading-relaxed">
          The ultimate workspace to track your habits, orchestrate goals, and monitor your personal life score daily.
        </p>
      </div>

      {/* Modern minimal visual indicator representation */}
      <div className="py-8 flex justify-center items-center gap-1.5 relative overflow-hidden">
        <div className="absolute inset-0 bg-indigo-500/5 blur-lg rounded-full" />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center relative z-10 shadow-2xl"
        >
          <Zap className="w-10 h-10 text-indigo-400 fill-indigo-400/20" />
        </motion.div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => navigate('/signup')}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Create Free Account
        </button>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn className="w-4 h-4" /> Sign In with Email
        </button>

        <div className="flex items-center gap-3 py-1">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
            />
            <path
              fill="#FBBC05"
              d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.4C.6 9.4 0 11.6 0 14s.6 4.6 1.6 6.6l3.7-2.9c-.2-.7-.4-1.4-.4-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
            />
          </svg>
          Continue with Google
        </button>
      </div>
    </GlassCard>
  );
};
