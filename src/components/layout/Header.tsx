import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { Search, Command, Bell, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export const Header: React.FC = () => {
  const { activePage, profile, setCommandPaletteOpen, getDailyLifeScore } = useLifeOSStore();
  const lifeScore = getDailyLifeScore();

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
          className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 text-zinc-400 text-xs transition-colors"
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

        {/* Notifications */}
        <button className="p-2 rounded-lg bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <img
            src={profile.avatar_url}
            alt={profile.full_name}
            className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover"
          />
          <span className="hidden lg:inline-block text-xs font-medium text-zinc-200">{profile.full_name}</span>
        </div>
      </div>
    </header>
  );
};
