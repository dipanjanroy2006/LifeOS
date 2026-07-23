import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { useAuth } from '../../auth/AuthProvider';
import { GlassCard } from '../common/GlassCard';
import { RadialProgress } from '../common/RadialProgress';
import { StatWidget } from '../common/StatWidget';
import { GitHubHeatmap } from '../common/GitHubHeatmap';
import {
  CheckSquare,
  Flame,
  Target,
  Calendar as CalendarIcon,
  ArrowRight,
  Zap,
  CheckCircle2,
  Circle,
  Plus,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import confetti from 'canvas-confetti';

export const DashboardView: React.FC = () => {
  const {
    habits,
    habitLogs,
    toggleHabitLog,
    goals,
    timeBlocks,
    toggleTimeBlock,
    getDailyLifeScore,
    setActivePage,
  } = useLifeOSStore();
  const { profile } = useAuth();

  const lifeScore = getDailyLifeScore();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');

  // Greeting based on time
  const getGreeting = () => {
    const hrs = today.getHours();
    if (hrs < 12) return 'Good Morning 🌞';
    if (hrs < 17) return 'Good Afternoon 🌤️';
    return 'Good Evening 🌇';
  };

  // Generate week slider days
  const weekStart = startOfWeek(today, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Habits due today
  const habitsDueToday = habits.filter((h) => !h.archived);
  const completedTodayCount = habitsDueToday.filter(
    (h) => habitLogs[`${h.id}_${todayStr}`]?.status === 'completed'
  ).length;

  const handleToggleHabit = (habitId: string) => {
    toggleHabitLog(habitId);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
  };

  const peakStreak = habits.reduce((max, h) => Math.max(max, h.streak_count), 0);

  return (
    <div className="space-y-6 pb-28 md:pb-8">
      {/* Top Welcome Panel (Plan.io + Deli Mockup style) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border-subtle pb-5">
        <div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight">
            {getGreeting()}, {profile?.full_name || 'Grower'}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5 font-mono">
            Orchestrate your routines. Refine your system.
          </p>
        </div>

        {/* Hot Streaks Banner Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold text-xs shadow-sm">
          <Flame className="w-4 h-4 fill-orange-500/10" />
          <span>{peakStreak} Day Streak</span>
        </div>
      </div>

      {/* Dynamic Week Date Slider Widget */}
      <div className="grid grid-cols-7 gap-2 max-w-xl">
        {weekDays.map((day) => {
          const isToday = isSameDay(day, today);
          return (
            <div
              key={day.toString()}
              className={`flex flex-col items-center p-2.5 rounded-xl border select-none transition-all ${
                isToday
                  ? 'bg-brand-secondary text-white border-brand-secondary shadow-md scale-105'
                  : 'bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
              }`}
            >
              <span className="text-[10px] font-mono font-semibold uppercase opacity-85">
                {format(day, 'eee')}
              </span>
              <span className="text-sm font-bold mt-1 font-mono">{format(day, 'd')}</span>
            </div>
          );
        })}
      </div>

      {/* Main Grid: 3 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Core Habits and OKRs) - 8 span */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Habits due checklist */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-text-primary">Today's Habits</h3>
              </div>
              <button
                onClick={() => setActivePage('habits')}
                className="text-xs text-brand-secondary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {habitsDueToday.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-text-secondary">No habits setup for today.</p>
                <button
                  onClick={() => setActivePage('habits')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-btn bg-brand-primary hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Habit
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {habitsDueToday.map((habit, index) => {
                  const isCompleted = habitLogs[`${habit.id}_${todayStr}`]?.status === 'completed';
                  
                  // Mockup feature: Highlight the first item as a filled primary card accent!
                  const isFirstHighlight = index === 0;

                  return (
                    <div
                      key={habit.id}
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`flex items-center justify-between p-4 rounded-card border transition-all cursor-pointer select-none ${
                        isCompleted
                          ? 'bg-brand-primary/5 border-brand-primary/20 text-text-muted opacity-80'
                          : isFirstHighlight
                          ? 'bg-brand-secondary text-white border-brand-secondary shadow-lg shadow-brand-secondary/15 hover:scale-[1.005]'
                          : 'bg-bg-card border-border-subtle hover:bg-bg-card-hover hover:border-brand-secondary/30 text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button className="outline-none">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 fill-brand-primary/20 text-brand-primary" />
                          ) : (
                            <Circle className={`w-5 h-5 ${isFirstHighlight ? 'text-white' : 'text-text-muted hover:text-text-primary'}`} />
                          )}
                        </button>
                        <span className={`text-sm font-semibold ${isCompleted ? 'line-through opacity-70' : ''}`}>
                          {habit.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded ${isFirstHighlight ? 'bg-white/20 text-white' : 'bg-bg-card-hover text-text-secondary'}`}>
                          {habit.time_of_day}
                        </span>
                        <span className={`text-xs font-mono font-semibold flex items-center gap-1 ${isFirstHighlight ? 'text-white' : 'text-accent-warning'}`}>
                          <Flame className="w-3.5 h-3.5 fill-current" /> {habit.streak_count}d
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* OKRs & Goals checklist */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-brand-secondary border border-brand-secondary/20">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-text-primary">Active OKRs & Goals</h3>
              </div>
              <button
                onClick={() => setActivePage('goals')}
                className="text-xs text-brand-secondary hover:underline flex items-center gap-1 font-semibold cursor-pointer"
              >
                All OKRs <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-text-secondary">No active goal objectives setup.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goals.map((goal) => {
                  const totalProgress = Math.round(
                    (goal.key_results.reduce((acc, kr) => acc + Math.min(1, kr.current_value / kr.target_value), 0) /
                      (goal.key_results.length || 1)) *
                      100
                  );
                  return (
                    <div key={goal.id} className="p-4 rounded-card border border-border-subtle bg-bg-card space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <h4 className="text-xs font-bold text-text-primary leading-snug">{goal.title}</h4>
                        <span className="text-xs font-mono font-bold text-brand-secondary">{totalProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-bg-card-hover rounded-progress overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary rounded-progress transition-all duration-500"
                          style={{ width: `${totalProgress}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-text-muted block font-mono">
                        Target: {goal.target_date}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* GitHub Heatmap panel */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-brand-primary border border-brand-primary/20">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-text-primary">System Habits Consistency</h3>
            </div>
            <GitHubHeatmap logs={habitLogs} days={91} />
          </GlassCard>

        </div>

        {/* Right Column (Widgets Panel: Life Score, Schedule, AI Coach) - 4 span */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Radial Life Score widget */}
          <GlassCard className="flex flex-col items-center justify-center py-6 text-center">
            <h3 className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Daily Life Index</h3>
            <RadialProgress score={lifeScore.score} size={130} />
            <div className="grid grid-cols-3 gap-2 mt-5 w-full text-[10px] font-mono text-text-secondary border-t border-border-subtle/50 pt-4">
              <div>
                <span className="block text-text-muted">Habits</span>
                <span className="text-brand-primary font-bold">{lifeScore.habit_component}/50</span>
              </div>
              <div className="border-x border-border-subtle/50">
                <span className="block text-text-muted">Goals</span>
                <span className="text-brand-secondary font-bold">{lifeScore.goal_component}/30</span>
              </div>
              <div>
                <span className="block text-text-muted">Mood</span>
                <span className="text-accent-warning font-bold">{lifeScore.mood_component}/20</span>
              </div>
            </div>
          </GlassCard>

          {/* AI Coach widget */}
          <GlassCard className="border border-brand-primary/20 bg-brand-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <h3 className="text-xs font-bold text-text-primary">AI Growth Coach</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              "Your habit execution index is high today! Completing the final routine of the evening will boost your daily score into Peak Performance status."
            </p>
          </GlassCard>

          {/* Daily Scheduler Time Blocks */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-brand-secondary border border-brand-secondary/20">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-text-primary">Planner Blocks</h3>
              </div>
              <button
                onClick={() => setActivePage('calendar')}
                className="text-xs text-brand-secondary hover:underline cursor-pointer font-semibold"
              >
                Planner <ChevronRight className="w-3.5 h-3.5 inline" />
              </button>
            </div>

            {timeBlocks.length === 0 ? (
              <div className="py-6 text-center text-xs text-text-muted">
                No time blocks scheduled.
              </div>
            ) : (
              <div className="space-y-2.5">
                {timeBlocks.map((block) => (
                  <div
                    key={block.id}
                    onClick={() => toggleTimeBlock(block.id)}
                    className={`flex items-center justify-between p-3 rounded-card border transition-all cursor-pointer ${
                      block.is_completed ? 'bg-bg-card-hover/40 border-border-subtle opacity-60' : 'bg-bg-card border-border-subtle hover:border-brand-secondary/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: block.color }} />
                      <div>
                        <h4 className={`text-xs font-bold ${block.is_completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                          {block.title}
                        </h4>
                        <p className="text-[10px] text-text-muted font-mono mt-0.5">
                          {format(new Date(block.start_time), 'HH:mm')} - {format(new Date(block.end_time), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[9px] px-2 py-0.5 rounded font-mono font-semibold ${block.is_completed ? 'bg-bg-card-hover text-text-muted' : 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20'}`}>
                      {block.is_completed ? 'Done' : block.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick reflection matrix panel */}
          <GlassCard>
            <div className="space-y-1 mb-3">
              <h3 className="text-xs font-bold text-text-primary">Daily Reflection</h3>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Log your energy and mood to refine your Life Score correlation algorithms.
              </p>
            </div>
            <button
              onClick={() => setActivePage('journal')}
              className="w-full py-2 rounded-btn bg-bg-card hover:bg-bg-card-hover border border-border-subtle text-text-primary font-semibold text-xs transition-all cursor-pointer active:scale-98"
            >
              Open Mood Matrix
            </button>
          </GlassCard>

        </div>

      </div>
    </div>
  );
};
