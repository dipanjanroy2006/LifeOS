import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import {
  LayoutDashboard,
  CheckSquare,
  Target,
  Calendar,
  BarChart3,
  BookOpen,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { clsx } from 'clsx';

export const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useLifeOSStore();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'habits', label: 'Habits & Streaks', icon: CheckSquare },
    { id: 'goals', label: 'Goals & OKRs', icon: Target },
    { id: 'calendar', label: 'Time Planner', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'journal', label: 'Journal & Mood', icon: BookOpen },
  ];

  const secondaryNavItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleNavigation = (id: string) => {
    setActivePage(id);
    navigate(`/${id}`);
  };

  return (
    <aside
      className={clsx(
        'hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[#0c0c0e] border-r border-white/10 transition-all duration-300 z-30 select-none',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold tracking-tight text-white text-base font-mono">LifeOS</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-400">Operating System</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="p-2 space-y-1 mt-2">
          {!collapsed && (
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 py-1 block">
              Core Modules
            </span>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative group cursor-pointer',
                  isActive
                    ? 'text-white bg-indigo-600/15 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.15)]'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
                )}
              >
                <Icon
                  className={clsx(
                    'w-5 h-5 shrink-0 transition-colors',
                    isActive ? 'text-indigo-400' : 'text-zinc-400 group-hover:text-zinc-200'
                  )}
                />
                {!collapsed && <span>{item.label}</span>}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-l-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Secondary / Profile Navigation */}
      <div className="p-2 space-y-1 border-t border-white/5 mb-2">
        {!collapsed && (
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-3 py-1 block">
            System
          </span>
        )}
        {secondaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group cursor-pointer',
                isActive ? 'text-white bg-zinc-800/80 border border-white/10' : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40'
              )}
            >
              <Icon className="w-5 h-5 shrink-0 text-zinc-400 group-hover:text-zinc-200" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
