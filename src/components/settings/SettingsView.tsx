import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { useTheme } from '../../app/providers/ThemeProvider';
import { GlassCard } from '../common/GlassCard';
import { Settings, Database, Sun, Moon, Laptop, Download } from 'lucide-react';
import { clsx } from 'clsx';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, habits, goals, habitLogs } = useLifeOSStore();
  const { theme, setTheme } = useTheme();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ habits, goals, habitLogs }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "lifeos_backup.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const themeOptions = [
    {
      id: 'light' as const,
      name: 'Light Mode',
      desc: 'Clean, high-contrast light aesthetics.',
      icon: Sun,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      activeBg: 'border-indigo-500 bg-white shadow-lg text-zinc-950',
      inactiveBg: 'border-border-subtle bg-bg-card hover:bg-bg-card-hover text-text-secondary'
    },
    {
      id: 'dark' as const,
      name: 'Dark Mode',
      desc: 'Elegant, modern dark glassmorphism.',
      icon: Moon,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
      activeBg: 'border-indigo-500 bg-[#121215] shadow-lg text-white',
      inactiveBg: 'border-border-subtle bg-bg-card hover:bg-bg-card-hover text-text-secondary'
    },
    {
      id: 'system' as const,
      name: 'System Default',
      desc: 'Matches your current system preference.',
      icon: Laptop,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      activeBg: 'border-indigo-500 bg-bg-card-hover shadow-lg text-text-primary',
      inactiveBg: 'border-border-subtle bg-bg-card hover:bg-bg-card-hover text-text-secondary'
    }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-text-primary tracking-tight">System Settings & Data Management</h2>
        <p className="text-xs text-text-muted mt-1 font-mono">Configure profile preferences, themes, notifications, and export offline backups.</p>
      </div>

      {/* General Settings */}
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
          <Settings className="w-5 h-5 text-indigo-500" />
          <h3 className="text-sm font-bold text-text-primary">General Preferences</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Display Name</label>
            <input
              type="text"
              value={profile?.full_name || ''}
              onChange={(e) => updateProfile({ full_name: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border-subtle text-text-primary text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-text-secondary block mb-1.5">Timezone</label>
            <input
              type="text"
              value={profile?.timezone || ''}
              onChange={(e) => updateProfile({ timezone: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl bg-bg-card border border-border-subtle text-text-primary text-xs focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      </GlassCard>

      {/* Theme Settings Selection (Wow factor design matching Plan.io) */}
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
          <Sun className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold text-text-primary">Theme Appearance</h3>
        </div>

        <p className="text-xs text-text-secondary">
          Choose between standard deep space dark mode or clean high-contrast light mode.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1.5">
          {themeOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = theme === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={clsx(
                  'flex flex-col text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer outline-none select-none',
                  isActive ? opt.activeBg : opt.inactiveBg
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center border shrink-0', opt.color)}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight">{opt.name}</h4>
                    <p className="text-[10px] text-text-muted mt-0.5 leading-snug">{opt.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Data Backup Settings */}
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border-subtle">
          <Database className="w-5 h-5 text-emerald-500" />
          <h3 className="text-sm font-bold text-text-primary">Backup & Data Portability</h3>
        </div>

        <p className="text-xs text-text-secondary">
          Your data is yours. Export full JSON snapshots of habits, goal trajectories, and journal records.
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-bg-card hover:bg-bg-card-hover text-text-primary text-xs font-semibold border border-border-subtle transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
          >
            <Download className="w-4 h-4 text-emerald-500" /> Export JSON Data
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
