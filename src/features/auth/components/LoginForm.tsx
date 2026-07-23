import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../shared/services/authService';
import { GlassCard } from '../../../components/common/GlassCard';
import { useToast } from '../../../hooks/useToast';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { parseAuthError } from '../../../shared/utils/errors';

const RATE_LIMIT_KEY = 'lifeos_login_attempts';
const RATE_LIMIT_LOCK_TIME = 60 * 1000; // 1 minute

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutTimeLeft, setLockoutTimeLeft] = useState(0);

  // Rate Limiting checks
  useEffect(() => {
    const checkLockout = () => {
      const attemptsData = localStorage.getItem(RATE_LIMIT_KEY);
      if (attemptsData) {
        const { count, lockTimestamp } = JSON.parse(attemptsData);
        if (count >= 5 && lockTimestamp) {
          const elapsed = Date.now() - lockTimestamp;
          if (elapsed < RATE_LIMIT_LOCK_TIME) {
            setLockoutTimeLeft(Math.ceil((RATE_LIMIT_LOCK_TIME - elapsed) / 1000));
          } else {
            localStorage.removeItem(RATE_LIMIT_KEY);
            setLockoutTimeLeft(0);
          }
        }
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, []);

  const trackFailedAttempt = () => {
    const attemptsData = localStorage.getItem(RATE_LIMIT_KEY);
    let attempts = { count: 0, lockTimestamp: null as number | null };
    
    if (attemptsData) {
      attempts = JSON.parse(attemptsData);
    }
    
    attempts.count += 1;
    if (attempts.count >= 5) {
      attempts.lockTimestamp = Date.now();
      toast.warning('Too many failed attempts. Login locked for 60 seconds.');
    }
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(attempts));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || lockoutTimeLeft > 0) return;

    if (!email || !password) {
      toast.error('Please fill in all credentials fields.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.login(email, password);
      // Remove failed attempts registry on success
      localStorage.removeItem(RATE_LIMIT_KEY);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      trackFailedAttempt();
      toast.error(parseAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await authService.signInWithGoogle();
    } catch (e: any) {
      toast.error(e.message || 'Google Auth redirection failed.');
    }
  };

  return (
    <GlassCard glow className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-text-primary tracking-tight">Welcome Back</h2>
        <p className="text-xs text-text-secondary">Sign in to resume tracking your growth journey.</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-text-secondary block mb-1.5">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              disabled={isLoading || lockoutTimeLeft > 0}
              placeholder="architect@lifeos.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-input bg-bg-card border border-border-subtle text-text-primary text-xs focus:outline-none focus:border-brand-secondary transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-text-secondary">Password</label>
            <Link
              to="/forgot-password"
              className="text-[11px] font-semibold text-brand-secondary hover:underline transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading || lockoutTimeLeft > 0}
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-input bg-bg-card border border-border-subtle text-text-primary text-xs focus:outline-none focus:border-brand-secondary transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="text-text-muted hover:text-text-primary absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || lockoutTimeLeft > 0}
          className="w-full py-2.5 rounded-btn bg-brand-primary hover:bg-emerald-600 text-white font-semibold text-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
        >
          {isLoading ? (
            <Spinner />
          ) : lockoutTimeLeft > 0 ? (
            `Locked (${lockoutTimeLeft}s)`
          ) : (
            <>
              <LogIn className="w-4 h-4" /> Sign In to Dashboard
            </>
          )}
        </button>
      </form>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-[10px] font-mono text-text-muted uppercase">or</span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={isLoading || lockoutTimeLeft > 0}
        className="w-full py-2.5 rounded-btn border border-border-subtle bg-bg-card hover:bg-bg-card-hover text-text-primary font-semibold text-xs transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

      <div className="text-center">
        <Link
          to="/signup"
          className="text-xs text-text-secondary hover:text-brand-secondary transition-colors font-medium"
        >
          Don't have an account? Create one
        </Link>
      </div>
    </GlassCard>
  );
}
