import React, { useState } from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { useAuth } from '../../auth/AuthProvider';
import { GlassCard } from '../common/GlassCard';
import { RadialProgress } from '../common/RadialProgress';
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
  
  // Track selected date in the week slider (default to today)
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

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

  // Habits due on the selected day
  const habitsDueToday = habits.filter((h) => !h.archived);
  const completedTodayCount = habitsDueToday.filter(
    (h) => habitLogs[`${h.id}_${selectedDateStr}`]?.status === 'completed'
  ).length;

  const handleToggleHabit = (habitId: string) => {
    // Only allow toggling for past or present days, not future days
    if (selectedDate > today && !isSameDay(selectedDate, today)) {
      return;
    }
    
    // Pass custom date option to store if supported, or toggle locally.
    // In our store, toggleHabitLog toggles the log for the current today date.
    // We can pass selectedDateStr if the store supports custom dates, or keep standard.
    toggleHabitLog(habitId, selectedDateStr);
    
    const isNowCompleted = habitLogs[`${habitId}_${selectedDateStr}`]?.status !== 'completed';
    if (isNowCompleted) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }
  };

  const peakStreak = habits.reduce((max, h) => Math.max(max, h.streak_count), 0);

  return (
    <div className="space-y-3 pb-28 md:pb-8">
      {/* Top Welcome Panel - Compact & Light (Deli Mockup style) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-subtle pb-2.5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            {getGreeting()}, {profile?.full_name || 'Grower'}
          </h2>
          <p className="text-[10px] text-text-secondary font-mono mt-0.5">
            Viewing records for <span className="text-brand-secondary font-bold font-mono">{format(selectedDate, 'EEEE, MMMM d')}</span>
          </p>
        </div>

        {/* Hot Streaks Banner Pill */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 font-semibold text-[10px] shadow-sm select-none">
          <Flame className="w-3.5 h-3.5 fill-orange-500/10" />
          <span>{peakStreak} Day Streak</span>
        </div>
      </div>

      {/* GitHub Heatmap - AT THE VERY TOP OF THE CONTENT */}
      <GlassCard className="p-3">
        <GitHubHeatmap logs={habitLogs} days={91} />
      </GlassCard>

      {/* Dynamic Week Date Slider Widget - Compact & Interactive */}
      <div className="grid grid-cols-7 gap-1 max-w-sm sm:max-w-md">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentToday = isSameDay(day, today);
          
          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`flex flex-col items-center py-1.5 px-1 rounded-lg border select-none transition-all cursor-pointer outline-none ${
                isSelected
                  ? 'bg-brand-secondary text-white border-brand-secondary shadow-md scale-102 font-bold'
                  : isCurrentToday
                  ? 'bg-bg-card border-brand-primary/40 text-brand-primary'
                  : 'bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
              }`}
            >
              <span className="text-[8px] font-mono uppercase tracking-wider">
                {format(day, 'eee')}
              </span>
              <span className="text-[11px] font-bold mt-0.5 font-mono">{format(day, 'd')}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: 3 Columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        
        {/* Left Column (Core Habits and OKRs) - 8 span */}
        <div className="lg:col-span-8 space-y-3.5">
          
          {/* Habits due checklist */}
          <GlassCard className="p-3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                  <CheckSquare className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-text-primary">
                  Habits checklist ({format(selectedDate, 'MMM d')})
                </h3>
              </div>
              <button
                onClick={() => setActivePage('habits')}
                className="text-[10px] text-brand-secondary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
              >
                Manage All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {habitsDueToday.length === 0 ? (
              <div className="py-4 text-center space-y-2">
                <p className="text-[11px] text-text-secondary">No habits setup for today.</p>
                <button
                  onClick={() => setActivePage('habits')}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-btn bg-brand-primary hover:bg-emerald-600 text-white text-[10px] font-semibold transition-all"
                >
                  <Plus className="w-3 h-3" /> Add Habit
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {habitsDueToday.map((habit, index) => {
                  const isCompleted = habitLogs[`${habit.id}_${selectedDateStr}`]?.status === 'completed';
                  
                  // Mockup feature: Highlight the first item as a filled primary card accent!
                  const isFirstHighlight = index === 0;

                  return (
                    <div
                      key={habit.id}
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`flex items-center justify-between p-2.5 rounded-card border transition-all cursor-pointer select-none ${
                        isCompleted
                          ? 'bg-brand-primary/5 border-brand-primary/15 text-text-muted opacity-80'
                          : isFirstHighlight
                          ? 'bg-brand-secondary text-white border-brand-secondary shadow-md hover:scale-[1.002]'
                          : 'bg-bg-card border-border-subtle hover:bg-bg-card-hover hover:border-brand-secondary/20 text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <button className="outline-none shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 fill-brand-primary/10 text-brand-primary" />
                          ) : (
                            <Circle className={`w-4 h-4 ${isFirstHighlight ? 'text-white' : 'text-text-muted hover:text-text-primary'}`} />
                          )}
                        </button>
                        <span className={`text-[11px] font-semibold ${isCompleted ? 'line-through opacity-70' : ''}`}>
                          {habit.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] uppercase font-mono tracking-wider font-semibold px-1.5 py-0.5 rounded ${isFirstHighlight ? 'bg-white/20 text-white' : 'bg-bg-card-hover text-text-secondary'}`}>
                          {habit.time_of_day}
                        </span>
                        <span className={`text-[10px] font-mono font-semibold flex items-center gap-0.5 ${isFirstHighlight ? 'text-white' : 'text-accent-warning'}`}>
                          <Flame className="w-3 h-3 fill-current" /> {habit.streak_count}d
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* OKRs & Goals checklist */}
          <GlassCard className="p-3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-indigo-500/10 text-brand-secondary border border-brand-secondary/20">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-text-primary">Active OKRs & Goals</h3>
              </div>
              <button
                onClick={() => setActivePage('goals')}
                className="text-[10px] text-brand-secondary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
              >
                All OKRs <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="py-4 text-center text-[11px] text-text-muted">
                No active goal objectives setup.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {goals.map((goal) => {
                  const totalProgress = Math.round(
                    (goal.key_results.reduce((acc, kr) => acc + Math.min(1, kr.current_value / kr.target_value), 0) /
                      (goal.key_results.length || 1)) *
                      100
                  );
                  return (
                    <div key={goal.id} className="p-2.5 rounded-card border border-border-subtle bg-bg-card space-y-1.5">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-[10px] font-bold text-text-primary leading-snug truncate">{goal.title}</h4>
                        <span className="text-[10px] font-mono font-bold text-brand-secondary">{totalProgress}%</span>
                      </div>
                      <div className="w-full h-1 bg-bg-card-hover rounded-progress overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-secondary to-brand-primary rounded-progress transition-all duration-500"
                          style={{ width: `${totalProgress}%` }}
                        />
                      </div>
                      <span className="text-[8px] text-text-muted block font-mono">
                        Target: {goal.target_date}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

        </div>

        {/* Right Column (Widgets Panel: Life Score, Schedule, AI Coach) - 4 span */}
        <div className="lg:col-span-4 space-y-3.5">
          
          {/* Radial Life Score widget */}
          <GlassCard className="p-3 flex flex-col items-center justify-center text-center">
            <h3 className="text-[9px] font-mono uppercase tracking-widest text-text-muted mb-2">Daily Life Index</h3>
            <RadialProgress score={lifeScore.score} size={90} />
            <div className="grid grid-cols-3 gap-1 mt-3 w-full text-[9px] font-mono text-text-secondary border-t border-border-subtle/50 pt-2.5">
              <div>
                <span className="block text-text-muted">Habits</span>
                <span className="text-brand-primary font-bold">{lifeScore.habit_component}</span>
              </div>
              <div className="border-x border-border-subtle/50">
                <span className="block text-text-muted">Goals</span>
                <span className="text-brand-secondary font-bold">{lifeScore.goal_component}</span>
              </div>
              <div>
                <span className="block text-text-muted">Mood</span>
                <span className="text-accent-warning font-bold">{lifeScore.mood_component}</span>
              </div>
            </div>
          </GlassCard>

          {/* AI Coach widget */}
          <GlassCard className="p-3 border border-brand-primary/15 bg-brand-primary/5">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-brand-primary" />
              <h3 className="text-[10px] font-bold text-text-primary">AI Growth Coach</h3>
            </div>
            <p className="text-[10px] text-text-secondary leading-relaxed">
              "Completing the final routine of the evening will boost your score into Peak Performance status."
            </p>
          </GlassCard>

          {/* Daily Scheduler Time Blocks */}
          <GlassCard className="p-3">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-1.5">
                <div className="p-1 rounded-lg bg-indigo-500/10 text-brand-secondary border border-brand-secondary/20">
                  <CalendarIcon className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs font-bold text-text-primary">Planner Blocks</h3>
              </div>
              <button
                onClick={() => setActivePage('calendar')}
                className="text-[10px] text-brand-secondary hover:underline cursor-pointer font-semibold"
              >
                Planner <ChevronRight className="w-3 h-3 inline" />
              </button>
            </div>

            {timeBlocks.length === 0 ? (
              <div className="py-4 text-center text-[10px] text-text-muted">
                No blocks scheduled.
              </div>
            ) : (
              <div className="space-y-1.5">
                {timeBlocks.map((block) => (
                  <div
                    key={block.id}
                    onClick={() => toggleTimeBlock(block.id)}
                    className={`flex items-center justify-between p-2 rounded-card border transition-all cursor-pointer ${
                      block.is_completed ? 'bg-bg-card-hover/40 border-border-subtle opacity-60' : 'bg-bg-card border-border-subtle hover:border-brand-secondary/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-4 rounded-full shrink-0" style={{ backgroundColor: block.color }} />
                      <div>
                        <h4 className={`text-[10px] font-bold truncate max-w-[120px] ${block.is_completed ? 'line-through text-text-muted' : 'text-text-primary'}`}>
                          {block.title}
                        </h4>
                        <p className="text-[8px] text-text-muted font-mono mt-0.5">
                          {format(new Date(block.start_time), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-semibold ${block.is_completed ? 'bg-bg-card-hover text-text-muted' : 'bg-brand-secondary/10 text-brand-secondary border border-brand-secondary/20'}`}>
                      {block.is_completed ? 'Done' : block.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* Quick reflection matrix panel */}
          <GlassCard className="p-3">
            <div className="space-y-1 mb-2">
              <h3 className="text-[10px] font-bold text-text-primary">Daily Reflection</h3>
              <p className="text-[10px] text-text-secondary leading-relaxed">
                Log energy to refine score correlations.
              </p>
            </div>
            <button
              onClick={() => setActivePage('journal')}
              className="w-full py-1.5 rounded-btn bg-bg-card hover:bg-bg-card-hover border border-border-subtle text-text-primary font-semibold text-[10px] transition-all cursor-pointer active:scale-98"
            >
              Open Mood Matrix
            </button>
          </GlassCard>

        </div>

      </div>
    </div>
  );
};
