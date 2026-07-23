import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../shared/services/authService';
import { GlassCard } from '../../../components/common/GlassCard';
import { useToast } from '../../../hooks/useToast';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { parseAuthError } from '../../../shared/utils/errors';

export const ForgotPasswordForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    setIsLoading(true);

    try {
      await authService.sendPasswordResetEmail(email);
      setIsSent(true);
      toast.success('Reset link dispatched! Please check your email inbox.');
    } catch (err: any) {
      toast.error(parseAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard glow className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Recover Password</h2>
        <p className="text-xs text-zinc-400">
          Enter your registered email address below, and we will send a password reset link.
        </p>
      </div>

      {isSent ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-center text-xs text-zinc-300 leading-relaxed">
            We have sent a secure password recovery link to <span className="font-bold text-white">{email}</span>. Click the link in the email to update your credentials.
          </div>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Sign In
          </button>
        </div>
      ) : (
        <form onSubmit={handleResetRequest} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="dipanjanroy906@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Spinner /> : (
              <>
                <Send className="w-4 h-4" /> Send Recovery Link
              </>
            )}
          </button>

          <div className="text-center">
            <Link
              to="/login"
              className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors font-medium flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
            </Link>
          </div>
        </form>
      )}
    </GlassCard>
  );
};
