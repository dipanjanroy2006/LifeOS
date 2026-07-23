import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { useAuth } from '../../auth/AuthProvider';
import { useToast } from '../../hooks/useToast';
import { Sparkles, LogOut, UserCheck } from 'lucide-react';
import { format } from 'date-fns';

export const Header: React.FC = () => {
  const { getDailyLifeScore } = useLifeOSStore();
  const { profile, signOut } = useAuth();
  const toast = useToast();
  const lifeScore = getDailyLifeScore();
  const location = useLocation();
  
  // Derive active id directly from URL path
  const activePage = location.pathname.substring(1) || 'dashboard';
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully.');
    } catch {
      toast.error('Logout operation failed.');
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const getTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Overview';
      case 'habits': return 'Habits';
      case 'goals': return 'Goals';
      case 'calendar': return 'Planner';
      case 'analytics': return 'Analytics';
      case 'journal': return 'Journal';
      case 'settings': return 'Settings';
      case 'profile': return 'Profile';
      default: return 'LifeOS';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-bg-header/85 backdrop-blur-md border-b border-border-subtle px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Page Title & Date */}
        <div className="min-w-0 flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="LifeOS Logo"
            className="w-6 h-6 rounded-md object-cover border border-border-subtle shrink-0"
          />
          <div>
            <h1 className="text-sm sm:text-base font-extrabold text-text-primary tracking-tight truncate whitespace-nowrap">
              {getTitle()}
            </h1>
            <p className="text-[10px] text-text-muted font-mono mt-0.5 whitespace-nowrap">
              {format(new Date(), 'eee, MMM d, yyyy')}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Life Score Quick Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-xs font-semibold">Score</span>
            <span className="text-xs font-mono font-bold text-text-primary">{lifeScore.score}</span>
          </div>

          {/* User Auth Status / Sign Out Trigger */}
          {profile ? (
            <div className="flex items-center gap-3 pl-2 border-l border-border-subtle">
              <div className="flex items-center gap-2">
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-text-primary leading-none">{profile.full_name}</span>
                  <span className="text-[9px] font-mono text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
                    <UserCheck className="w-2.5 h-2.5" /> Connected
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                title="Sign Out"
                className="p-1.5 rounded-lg text-text-secondary hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {/* Logout Confirmation Dialog Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-bg-card border border-border-subtle rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-text-primary">Confirm Sign Out</h3>
              <p className="text-xs text-text-secondary">
                Are you sure you want to terminate your current LifeOS session? You will need to log in again to sync active routines.
              </p>
            </div>
            
            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-bg-card-hover text-text-secondary text-xs font-medium hover:bg-bg-card-hover cursor-pointer border border-border-subtle"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
