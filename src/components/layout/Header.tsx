import React, { useState } from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { useAuth } from '../../auth/AuthProvider';
import { useToast } from '../../hooks/useToast';
import { Search, Command, Sparkles, LogOut, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { GlassCard } from '../common/GlassCard';

export const Header: React.FC = () => {
  const { activePage, setCommandPaletteOpen, getDailyLifeScore } = useLifeOSStore();
  const { profile, signOut } = useAuth();
  const toast = useToast();
  const lifeScore = getDailyLifeScore();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully.');
    } catch (e: any) {
      toast.error('Logout operation failed.');
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const getTitle = () => {
    switch (activePage) {
      case 'dashboard': return 'Today Command Center';
      case 'habits': return 'Habit Systems & Streaks';
      case 'goals': return 'Goals & OKRs Tree';
      case 'calendar': return 'Time Block Planner';
      case 'analytics': return 'Life OS Analytics';
      case 'journal': return 'Daily Reflection & Mood';
      case 'settings': return 'System Settings';
      case 'profile': return 'User Profile & Trophies';
      default: return 'LifeOS';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-bg-header/85 backdrop-blur-md border-b border-border-subtle px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Page Title & Date */}
        <div>
          <h1 className="text-xl font-bold text-text-primary tracking-tight flex items-center gap-2">
            {getTitle()}
          </h1>
          <p className="text-xs text-text-muted font-mono mt-0.5">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-bg-card-hover border border-border-subtle text-text-secondary text-xs transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Quick action / search...</span>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-bg-card border border-border-subtle text-[10px] font-mono text-text-secondary">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

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
