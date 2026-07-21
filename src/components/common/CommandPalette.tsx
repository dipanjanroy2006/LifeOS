import React, { useEffect, useState } from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { Search, LayoutDashboard, CheckSquare, Target, Calendar, BarChart3, BookOpen, Settings, User, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CommandPalette: React.FC = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen, setActivePage } = useLifeOSStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    { id: 'dashboard', label: 'Go to Dashboard', icon: LayoutDashboard, category: 'Navigation', page: 'dashboard' },
    { id: 'habits', label: 'Go to Habits & Streaks', icon: CheckSquare, category: 'Navigation', page: 'habits' },
    { id: 'goals', label: 'Go to Goals & OKRs', icon: Target, category: 'Navigation', page: 'goals' },
    { id: 'calendar', label: 'Go to Time Blocking Calendar', icon: Calendar, category: 'Navigation', page: 'calendar' },
    { id: 'analytics', label: 'Go to Analytics & Life Score', icon: BarChart3, category: 'Navigation', page: 'analytics' },
    { id: 'journal', label: 'Go to Journal & Mood Tracker', icon: BookOpen, category: 'Navigation', page: 'journal' },
    { id: 'settings', label: 'Go to Settings', icon: Settings, category: 'Navigation', page: 'settings' },
    { id: 'profile', label: 'Go to Profile', icon: User, category: 'Navigation', page: 'profile' },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (page: string) => {
    setActivePage(page);
    setCommandPaletteOpen(false);
    setQuery('');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-xl bg-[#121215] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3 border-b border-white/10 bg-zinc-900/60">
            <Search className="w-5 h-5 text-zinc-400 mr-3" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or search page..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-white placeholder-zinc-500 focus:outline-none text-sm font-medium"
            />
            <span className="text-[10px] font-mono font-semibold px-2 py-1 rounded bg-zinc-800 text-zinc-400 border border-white/10">
              ESC
            </span>
          </div>

          {/* Action List */}
          <div className="max-h-80 overflow-y-auto p-2">
            {filteredActions.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">No commands found matching "{query}"</div>
            ) : (
              filteredActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(action.page)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-md bg-zinc-900 border border-white/5 group-hover:border-indigo-500/30 text-indigo-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-zinc-500 group-hover:text-zinc-400">
                      {action.category}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
