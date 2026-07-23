import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { LayoutDashboard, CheckSquare, Plus, BarChart3, User } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage, setCommandPaletteOpen } = useLifeOSStore();
  const navigate = useNavigate();

  const handleNavigation = (id: string, path: string) => {
    setActivePage(id);
    navigate(path);
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
      <nav className="bg-bg-sidebar/90 backdrop-blur-xl border border-border-subtle rounded-full px-4 py-2.5 flex items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
        {/* Dashboard link */}
        <button
          onClick={() => handleNavigation('dashboard', '/dashboard')}
          className={clsx(
            'p-2 rounded-full transition-colors cursor-pointer',
            activePage === 'dashboard' ? 'text-brand-secondary bg-brand-secondary/10' : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <LayoutDashboard className="w-5.5 h-5.5" />
        </button>

        {/* Habits link */}
        <button
          onClick={() => handleNavigation('habits', '/habits')}
          className={clsx(
            'p-2 rounded-full transition-colors cursor-pointer',
            activePage === 'habits' ? 'text-brand-primary bg-brand-primary/10' : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <CheckSquare className="w-5.5 h-5.5" />
        </button>

        {/* Floating Action Button (Quick Log / Cmd+K Command Palette) */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="w-12 h-12 rounded-full bg-brand-primary hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-brand-primary/20 transition-all cursor-pointer -translate-y-4"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Analytics link */}
        <button
          onClick={() => handleNavigation('analytics', '/analytics')}
          className={clsx(
            'p-2 rounded-full transition-colors cursor-pointer',
            activePage === 'analytics' ? 'text-indigo-400 bg-indigo-500/10' : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <BarChart3 className="w-5.5 h-5.5" />
        </button>

        {/* Profile link */}
        <button
          onClick={() => handleNavigation('profile', '/profile')}
          className={clsx(
            'p-2 rounded-full transition-colors cursor-pointer',
            activePage === 'profile' ? 'text-amber-500 bg-amber-500/10' : 'text-text-secondary hover:text-text-primary'
          )}
        >
          <User className="w-5.5 h-5.5" />
        </button>
      </nav>
    </div>
  );
};
