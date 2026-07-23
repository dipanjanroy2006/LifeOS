import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../../shared/services/authService';
import { GlassCard } from '../../../components/common/GlassCard';
import { useToast } from '../../../hooks/useToast';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { Mail, Lock, Eye, EyeOff, UserPlus, ShieldAlert } from 'lucide-react';

export const SignUpForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | 'excellent'>('weak');
  const [strengthScore, setStrengthScore] = useState(0);

  // Dynamic Password Strength Evaluation
  useEffect(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    setStrengthScore(score);

    if (score <= 2) {
      setPasswordStrength('weak');
    } else if (score === 3) {
      setPasswordStrength('medium');
    } else if (score === 4) {
      setPasswordStrength('strong');
    } else {
      setPasswordStrength('excellent');
    }
  }, [password]);

  const getStrengthBarColor = () => {
    switch (passwordStrength) {
      case 'weak': return 'bg-rose-500 w-1/4';
      case 'medium': return 'bg-amber-500 w-2/4';
      case 'strong': return 'bg-yellow-400 w-3/4';
      case 'excellent': return 'bg-emerald-400 w-full';
    }
  };

  const getStrengthLabel = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak Password';
      case 'medium': return 'Medium Strength';
      case 'strong': return 'Strong Password';
      case 'excellent': return 'Excellent Security';
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (!fullName || !email || !password || !confirmPassword) {
      toast.error('Please enter all registration details.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (strengthScore < 4) {
      toast.warning('Please enter a stronger password following the security rules.');
      return;
    }

    if (!agreeTerms) {
      toast.warning('You must accept the Terms of Service & Privacy Policy.');
      return;
    }

    setIsLoading(true);

    try {
      const data = await authService.signUp(email, password, fullName);
      if (data.user && !data.session) {
        toast.success('Account created! Verification link sent to your email.');
        navigate('/verify-email', { state: { email } });
      } else {
        toast.success('Account registered successfully!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Signup operation failed. Email may already be in use.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard glow className="p-6 space-y-6">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Create Account</h2>
        <p className="text-xs text-zinc-400">Join LifeOS to begin orchestrating your growth metrics.</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-3.5">
        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Full Name</label>
          <input
            type="text"
            required
            disabled={isLoading}
            placeholder="Dipanjan"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
          />
        </div>

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

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="text-zinc-500 hover:text-zinc-300 absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between items-center text-[10px] font-semibold text-zinc-400">
                <span>{getStrengthLabel()}</span>
                <span>Score: {strengthScore}/5</span>
              </div>
              <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-300 ${getStrengthBarColor()}`} />
              </div>
              <p className="text-[9px] text-zinc-500 leading-tight">
                Requires: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character.
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-zinc-300 block mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              disabled={isLoading}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-zinc-500 hover:text-zinc-300 absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2.5 py-1.5 select-none">
          <input
            id="terms"
            type="checkbox"
            disabled={isLoading}
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 rounded border-white/10 bg-zinc-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 focus:outline-none shrink-0 mt-0.5"
          />
          <label htmlFor="terms" className="text-[11px] text-zinc-400 leading-snug cursor-pointer">
            I agree to the <span className="text-indigo-400 hover:underline">Terms of Service</span> &{' '}
            <span className="text-indigo-400 hover:underline">Privacy Policy</span>.
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {isLoading ? (
            <Spinner />
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Create Free Account
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <Link
          to="/login"
          className="text-xs text-zinc-400 hover:text-indigo-400 transition-colors font-medium"
        >
          Already have an account? Sign In
        </Link>
      </div>
    </GlassCard>
  );
};
