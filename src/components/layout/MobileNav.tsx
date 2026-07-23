import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { LayoutDashboard, CheckSquare, Target, Calendar, BarChart3, BookOpen } from 'lucide-react';
import { clsx } from 'clsx';

export const MobileNav: React.FC = () => {
  const { activePage, setActivePage } = useLifeOSStore();
  const navigate = useNavigate();

  const items = [
    { id: 'dashboard', label: 'Today', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'calendar', label: 'Planner', icon: Calendar },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'journal', label: 'Journal', icon: BookOpen },
  ];

  const handleNavigation = (id: string) => {
    setActivePage(id);
    navigate(`/${id}`);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-bg-sidebar/95 backdrop-blur-lg border-t border-border-subtle px-2 py-2 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activePage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.id)}
            className={clsx(
              'flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors cursor-pointer',
              isActive ? 'text-indigo-500' : 'text-text-secondary hover:text-text-primary'
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
