import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../../../shared/services/authService';
import { GlassCard } from '../../../components/common/GlassCard';
import { useToast } from '../../../hooks/useToast';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Mail, ArrowLeft, RefreshCw, ExternalLink } from 'lucide-react';

export const VerifyEmailScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const state = location.state as { email?: string } | null;
  const emailAddress = state?.email || 'your email address';

  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResend = async () => {
    if (isLoading || resendCooldown > 0 || !state?.email) return;

    setIsLoading(true);

    try {
      await authService.resendVerificationEmail(state.email);
      toast.success('Verification link resent. Please check your inbox.');
      setResendCooldown(60); // 1 minute lockout
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch resend request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <GlassCard glow className="p-6 text-center space-y-6 w-full max-w-md relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
          <Mail className="w-6 h-6" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white tracking-tight">Please Verify Your Email</h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            We have dispatched a validation link to <span className="font-bold text-white">{emailAddress}</span>. Click the verification link to activate your LifeOS session.
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="https://mail.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 cursor-pointer"
          >
            Open Gmail <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleResend}
            disabled={isLoading || resendCooldown > 0 || !state?.email}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Spinner />
            ) : resendCooldown > 0 ? (
              `Resend Link (${resendCooldown}s)`
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" /> Resend Verification Link
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-white/5 text-zinc-400 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
