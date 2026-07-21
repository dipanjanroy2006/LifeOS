import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { LayoutDashboard, CheckSquare, Target, Calendar, BarChart3, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage } = useLifeOSStore();

  const items = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'calendar', label: 'Planner', icon: Calendar },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0c0e]/95 backdrop-blur-lg border-t border-white/10 px-2 py-2 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={clsx(
              'flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors',
              isActive ? 'text-indigo-400' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
