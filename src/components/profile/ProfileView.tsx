import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { useTheme } from '../../app/providers/ThemeProvider';
import { GlassCard } from '../common/GlassCard';
import { Award, Flame, Target, Sparkles, ShieldCheck, Sun, Moon, Laptop, Settings, Database, Download } from 'lucide-react';
import { clsx } from 'clsx';
import type { HabitLog, Habit } from '../../types';

export const ProfileView: React.FC = () => {
  const { profile, habits, habitLogs, getDailyLifeScore, updateProfile, goals } = useLifeOSStore();
  const { theme, setTheme } = useTheme();
  const lifeScore = getDailyLifeScore();

  const habitLogsList = Object.values(habitLogs) as HabitLog[];
  const totalCompletedHabits = habitLogsList.filter((l) => l.status === 'completed').length;
  const highestStreak = habits.reduce((max: number, h: Habit) => Math.max(max, h.best_streak), 0);

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
    { id: 'light' as const, name: 'Light', icon: Sun, color: 'text-amber-500 bg-amber-500/10' },
    { id: 'dark' as const, name: 'Dark', icon: Moon, color: 'text-indigo-400 bg-indigo-500/10' },
    { id: 'system' as const, name: 'System', icon: Laptop, color: 'text-emerald-400 bg-emerald-500/10' }
  ];

  const badges = [
    { title: 'Consistency Pioneer', desc: 'Maintained a 14-day consecutive habit streak', icon: Flame, color: '#f59e0b', earned: true },
    { title: 'Goal Crusher', desc: 'Completed Q2 key result metrics on target', icon: Target, color: '#6366f1', earned: true },
    { title: 'Peak Life Score', desc: 'Reached a daily Life Score above 85/100', icon: Sparkles, color: '#10b981', earned: true },
    { title: 'Master Architect', desc: 'Built and configured LifeOS core environment', icon: ShieldCheck, color: '#8b5cf6', earned: true },
  ];

  return (
    <div className="space-y-4 pb-28 md:pb-8 max-w-4xl">
      {/* Profile Banner */}
      <GlassCard glow className="p-4 flex flex-col sm:flex-row items-center gap-4 text-text-primary">
        <img
          src={profile?.avatar_url}
          alt={profile?.full_name}
          className="w-16 h-16 rounded-full border-2 border-indigo-500/50 shadow-md object-cover"
        />
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-lg font-bold text-text-primary tracking-tight">{profile?.full_name}</h2>
            <span className="text-[9px] font-semibold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Pro Architect
            </span>
          </div>
          <p className="text-[10px] text-text-muted font-mono">Member since {profile?.created_at || 'July 2026'}</p>
        </div>
      </GlassCard>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <GlassCard className="text-center p-3">
          <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold block">Total Habits Logged</span>
          <span className="text-2xl font-extrabold text-text-primary font-mono mt-0.5 block">{totalCompletedHabits}</span>
        </GlassCard>
        <GlassCard className="text-center p-3">
          <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold block">All-time Peak Streak</span>
          <span className="text-2xl font-extrabold text-accent-warning font-mono mt-0.5 block">{highestStreak} Days</span>
        </GlassCard>
        <GlassCard className="text-center p-3">
          <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold block">Today Life Score</span>
          <span className="text-2xl font-extrabold text-brand-secondary font-mono mt-0.5 block">{lifeScore.score}/100</span>
        </GlassCard>
      </div>

      {/* Badge Showcase */}
      <GlassCard className="p-3 space-y-3">
        <div className="flex items-center gap-1.5 pb-2 border-b border-border-subtle">
          <Award className="w-4 h-4 text-accent-warning" />
          <h3 className="text-xs font-bold text-text-primary">Trophy Case & Milestones</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-start gap-2.5 p-3 rounded-card bg-bg-card border border-border-subtle">
                <div
                  className="p-1.5 rounded-lg shrink-0 border"
                  style={{ color: b.color, backgroundColor: `${b.color}15`, borderColor: `${b.color}30` }}
                >
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-text-primary">{b.title}</h4>
                  <p className="text-[10px] text-text-secondary mt-0.5">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Mobile Settings Block - DISPLAYED ONLY ON MOBILE DEVICES */}
      <div className="block md:hidden space-y-4">
        <GlassCard className="p-3 space-y-3">
          <div className="flex items-center gap-1.5 pb-2 border-b border-border-subtle">
            <Settings className="w-4 h-4 text-brand-secondary" />
            <h3 className="text-xs font-bold text-text-primary">Preferences</h3>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Display Name</label>
              <input
                type="text"
                value={profile?.full_name || ''}
                onChange={(e) => updateProfile({ full_name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-bg-card border border-border-subtle text-text-primary text-xs focus:outline-none focus:border-brand-secondary transition-colors"
              />
            </div>
            
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1">Timezone</label>
              <input
                type="text"
                value={profile?.timezone || ''}
                onChange={(e) => updateProfile({ timezone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-bg-card border border-border-subtle text-text-primary text-xs focus:outline-none focus:border-brand-secondary transition-colors"
              />
            </div>

            {/* Theme selectors */}
            <div>
              <label className="text-[10px] font-semibold text-text-secondary block mb-1.5">Theme Appearance</label>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isActive = theme === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={clsx(
                        'flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl border text-[10px] font-bold transition-all cursor-pointer outline-none select-none',
                        isActive
                          ? 'border-brand-secondary bg-bg-card-hover text-text-primary shadow-sm'
                          : 'border-border-subtle bg-bg-card text-text-secondary hover:bg-bg-card-hover'
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{opt.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Data export card */}
        <GlassCard className="p-3 space-y-2">
          <div className="flex items-center gap-1.5 pb-2 border-b border-border-subtle">
            <Database className="w-4 h-4 text-brand-primary" />
            <h3 className="text-xs font-bold text-text-primary">Data Backup</h3>
          </div>
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-btn bg-bg-card hover:bg-bg-card-hover text-text-primary text-[10px] font-semibold border border-border-subtle transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-brand-primary" /> Export Snapshot
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
