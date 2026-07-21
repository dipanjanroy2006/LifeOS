import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { GlassCard } from '../common/GlassCard';
import { Award, Flame, Target, Sparkles, ShieldCheck } from 'lucide-react';
import type { HabitLog, Habit } from '../../types';

export const ProfileView: React.FC = () => {
  const { profile, habits, habitLogs, getDailyLifeScore } = useLifeOSStore();
  const lifeScore = getDailyLifeScore();

  const habitLogsList = Object.values(habitLogs) as HabitLog[];
  const totalCompletedHabits = habitLogsList.filter((l) => l.status === 'completed').length;
  const highestStreak = habits.reduce((max: number, h: Habit) => Math.max(max, h.best_streak), 0);

  const badges = [
    { title: 'Consistency Pioneer', desc: 'Maintained a 14-day consecutive habit streak', icon: Flame, color: '#f59e0b', earned: true },
    { title: 'Goal Crusher', desc: 'Completed Q2 key result metrics on target', icon: Target, color: '#6366f1', earned: true },
    { title: 'Peak Life Score', desc: 'Reached a daily Life Score above 85/100', icon: Sparkles, color: '#10b981', earned: true },
    { title: 'Master Architect', desc: 'Built and configured LifeOS core environment', icon: ShieldCheck, color: '#8b5cf6', earned: true },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8 max-w-4xl">
      {/* Profile Banner */}
      <GlassCard glow className="p-6 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={profile.avatar_url}
          alt={profile.full_name}
          className="w-20 h-20 rounded-full border-2 border-indigo-500/50 shadow-xl object-cover"
        />
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">{profile.full_name}</h2>
            <span className="text-[10px] font-semibold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Pro Architect
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">Member since {profile.created_at}</p>
        </div>
      </GlassCard>

      {/* Lifetime Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassCard className="text-center p-4">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Total Habits Logged</span>
          <span className="text-3xl font-extrabold text-white font-mono mt-1 block">{totalCompletedHabits}</span>
        </GlassCard>
        <GlassCard className="text-center p-4">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">All-time Peak Streak</span>
          <span className="text-3xl font-extrabold text-amber-400 font-mono mt-1 block">{highestStreak} Days</span>
        </GlassCard>
        <GlassCard className="text-center p-4">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold block">Today Life Score</span>
          <span className="text-3xl font-extrabold text-indigo-400 font-mono mt-1 block">{lifeScore.score}/100</span>
        </GlassCard>
      </div>

      {/* Badge Showcase */}
      <GlassCard className="space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Trophy Case & Milestones</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {badges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-900/60 border border-white/5">
                <div
                  className="p-2 rounded-lg shrink-0 border"
                  style={{ color: b.color, backgroundColor: `${b.color}15`, borderColor: `${b.color}30` }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{b.title}</h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5">{b.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
};
