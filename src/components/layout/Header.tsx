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
      <header className="sticky top-0 z-20 bg-[#09090b]/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-3.5 flex items-center justify-between">
        {/* Page Title & Date */}
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            {getTitle()}
          </h1>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* Command Palette Trigger */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-400 text-xs transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Quick action / search...</span>
            <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 border border-white/10">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>

          {/* Life Score Quick Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold">Score</span>
            <span className="text-xs font-mono font-bold text-white">{lifeScore.score}</span>
          </div>

          {/* User Auth Status / Sign Out Trigger */}
          {profile ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
              <div className="flex items-center gap-2">
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover"
                />
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-none">{profile.full_name}</span>
                  <span className="text-[9px] font-mono text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                    <UserCheck className="w-2.5 h-2.5" /> Connected
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                title="Sign Out"
                className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
          <div className="w-full max-w-sm bg-[#121215] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Confirm Sign Out</h3>
              <p className="text-xs text-zinc-400">
                Are you sure you want to terminate your current LifeOS session? You will need to log in again to sync active routines.
              </p>
            </div>
            
            <div className="flex justify-end items-center gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-700 cursor-pointer"
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
