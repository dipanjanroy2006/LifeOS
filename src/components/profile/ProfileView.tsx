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
    { id: 'light' as const, name: 'Light', icon: Sun },
    { id: 'dark' as const, name: 'Dark', icon: Moon },
    { id: 'system' as const, name: 'System', icon: Laptop }
  ];

  const badges = [
    { title: 'Consistency Pioneer', desc: 'Maintained a 14-day consecutive habit streak', icon: Flame, color: '#f59e0b' },
    { title: 'Goal Crusher', desc: 'Completed Q2 key result metrics on target', icon: Target, color: '#6366f1' },
    { title: 'Peak Life Score', desc: 'Reached a daily Life Score above 85/100', icon: Sparkles, color: '#10b981' },
    { title: 'Master Architect', desc: 'Built and configured LifeOS core environment', icon: ShieldCheck, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-3 pb-28 md:pb-8 max-w-2xl mx-auto">
      {/* Profile Banner */}
      <GlassCard className="p-3 flex items-center gap-3">
        <img
          src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
          alt={profile?.full_name}
          className="w-12 h-12 rounded-full border border-indigo-500/30 object-cover shadow-sm"
        />
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <h2 className="text-xs sm:text-sm font-extrabold text-text-primary tracking-tight">
              {profile?.full_name || 'Jacob Sandra'}
            </h2>
            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Pro Architect
            </span>
          </div>
          <p className="text-[9px] text-text-muted font-mono">Member since {profile?.created_at || 'July 2026'}</p>
        </div>
      </GlassCard>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-3 gap-2">
        <GlassCard className="text-center p-2.5">
          <span className="text-[8px] uppercase tracking-wider text-text-muted font-semibold block">Habits Logged</span>
          <span className="text-lg font-bold text-text-primary font-mono mt-0.5 block">{totalCompletedHabits}</span>
        </GlassCard>
        <GlassCard className="text-center p-2.5">
          <span className="text-[8px] uppercase tracking-wider text-text-muted font-semibold block">Peak Streak</span>
          <span className="text-lg font-bold text-accent-warning font-mono mt-0.5 block">{highestStreak}d</span>
        </GlassCard>
        <GlassCard className="text-center p-2.5">
          <span className="text-[8px] uppercase tracking-wider text-text-muted font-semibold block">Today Score</span>
          <span className="text-lg font-bold text-brand-secondary font-mono mt-0.5 block">{lifeScore.score}</span>
        </GlassCard>
      </div>

      {/* Badge Showcase */}
      <GlassCard className="p-3 space-y-2">
        <div className="flex items-center gap-1 pb-1.5 border-b border-border-subtle">
          <Award className="w-3.5 h-3.5 text-accent-warning" />
          <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-wider">Milestones achieved</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-center gap-2 p-2 rounded-2xl bg-bg-card border border-border-subtle">
                <div
                  className="p-1 rounded-lg shrink-0 border"
                  style={{ color: b.color, backgroundColor: `${b.color}15`, borderColor: `${b.color}25` }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-[10px] font-bold text-text-primary truncate">{b.title}</h4>
                  <p className="text-[9px] text-text-muted truncate">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Mobile Settings Block - DISPLAYED ONLY ON MOBILE DEVICES */}
      <div className="block md:hidden space-y-3">
        <GlassCard className="p-3 space-y-2.5">
          <div className="flex items-center gap-1 pb-1.5 border-b border-border-subtle">
            <Settings className="w-3.5 h-3.5 text-brand-secondary" />
            <h3 className="text-[10px] font-bold text-text-primary uppercase tracking-wider">Preferences</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[9px] font-semibold text-text-secondary block mb-0.5">Display Name</label>
              <input
                type="text"
                value={profile?.full_name || ''}
                onChange={(e) => updateProfile({ full_name: e.target.value })}
                className="w-full px-2 py-1 rounded-xl bg-bg-card border border-border-subtle text-text-primary text-[10px] focus:outline-none focus:border-brand-secondary transition-colors"
              />
            </div>
            
            <div>
              <label className="text-[9px] font-semibold text-text-secondary block mb-0.5">Timezone</label>
              <input
                type="text"
                value={profile?.timezone || ''}
                onChange={(e) => updateProfile({ timezone: e.target.value })}
                className="w-full px-2 py-1 rounded-xl bg-bg-card border border-border-subtle text-text-primary text-[10px] focus:outline-none focus:border-brand-secondary transition-colors"
              />
            </div>
          </div>

          {/* Theme selectors */}
          <div className="pt-1.5">
            <label className="text-[9px] font-semibold text-text-secondary block mb-1">Theme Appearance</label>
            <div className="grid grid-cols-3 gap-1.5">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setTheme(opt.id)}
                    className={clsx(
                      'flex items-center justify-center gap-1 py-1.5 rounded-xl border text-[9px] font-bold transition-all cursor-pointer outline-none select-none',
                      isActive
                        ? 'border-brand-secondary bg-bg-card-hover text-text-primary shadow-sm'
                        : 'border-border-subtle bg-bg-card text-text-secondary hover:bg-bg-card-hover'
                    )}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Data export card */}
        <GlassCard className="p-3">
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-1 py-1.5 rounded-btn bg-bg-card hover:bg-bg-card-hover text-text-primary text-[9px] font-semibold border border-border-subtle transition-all cursor-pointer"
          >
            <Download className="w-3 h-3 text-brand-primary" />
            <span>Export Snapshot</span>
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
