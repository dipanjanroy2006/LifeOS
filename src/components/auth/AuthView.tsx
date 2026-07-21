import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../common/GlassCard';
import { Zap, Mail, Lock, LogIn, UserPlus, AlertCircle, CheckCircle2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuthViewProps {
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onContinueAsGuest }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const parseErrorMessage = (err: any): string => {
    if (!err) return 'Authentication failed.';
    if (typeof err === 'string') return err;
    if (err.message && err.message !== '{}') return err.message;
    if (err.error_description) return err.error_description;
    return 'User already exists or invalid credentials. Try signing in.';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (useMagicLink) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        setSuccessMsg('Magic link sent! Please check your email inbox to log in.');
      } else if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName || 'LifeOS User',
              avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            },
          },
        });
        if (error) throw error;
        if (data.user && !data.session) {
          setSuccessMsg('Account created! Please check your email inbox to confirm your account.');
        } else {
          setSuccessMsg('Account created successfully! You are logged in.');
          if (onSuccess) onSuccess();
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setSuccessMsg('Logged in successfully!');
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(parseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      setErrorMsg(null);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(parseErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-md space-y-6 relative z-10"
      >
        {/* Brand Hero Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 shadow-xl shadow-indigo-500/25 mb-1">
            <Zap className="w-6 h-6 text-white fill-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight font-mono">LifeOS</h1>
          <p className="text-xs text-zinc-400">
            Personal Life Operating System — Unified Growth & Routine Execution
          </p>
        </div>

        {/* Main Glass Card Form Container */}
        <GlassCard glow className="p-6 space-y-5">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-zinc-900/80 border border-white/5">
            <button
              onClick={() => { setIsSignUp(false); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isSignUp ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setErrorMsg(null); setSuccessMsg(null); }}
              className={`py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSignUp ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Status Feedback Banners */}
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99]"
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

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase">or email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-3.5">
            {isSignUp && (
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Roy"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-zinc-300 block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="architect@lifeos.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {!useMagicLink && (
              <div>
                <label className="text-xs font-medium text-zinc-300 block mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required={!useMagicLink}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => setUseMagicLink(!useMagicLink)}
                className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-medium"
              >
                <KeyRound className="w-3.5 h-3.5" />
                {useMagicLink ? 'Use Password' : 'Send Magic Link Email'}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              {loading ? (
                <span className="animate-pulse">Connecting to Supabase...</span>
              ) : useMagicLink ? (
                <>Send Passwordless Link</>
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" /> Create LifeOS Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Continue as Guest Button */}
          {onContinueAsGuest && (
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={onContinueAsGuest}
                className="w-full py-2 rounded-xl bg-zinc-900/50 hover:bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <span>Explore App as Guest</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              </button>
            </div>
          )}
        </GlassCard>

        {/* Security Subtext */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Encrypted with Row Level Security (RLS) via Supabase</span>
        </div>
      </motion.div>
    </div>
  );
};
