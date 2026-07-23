import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Bell,
  Search,
  BookOpen
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
  const navigate = useNavigate();

  const lifeScore = getDailyLifeScore();
  const today = new Date();
  
  // Track selected date in the week slider (default to today)
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  // Greeting based on time
  const getGreeting = () => {
    const hrs = today.getHours();
    if (hrs < 12) return 'Hello';
    if (hrs < 17) return 'Hello';
    return 'Hello';
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
    
    toggleHabitLog(habitId, selectedDateStr);
    
    const isNowCompleted = habitLogs[`${habitId}_${selectedDateStr}`]?.status !== 'completed';
    if (isNowCompleted) {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    }
  };

  const peakStreak = habits.reduce((max, h) => Math.max(max, h.streak_count), 0);

  return (
    <div className="space-y-4 pb-28 md:pb-8">

      {/* MOBILE SPECIFIC VIEWPORT LAYOUT (EDU/LAVENDER style from mockup) */}
      <div className="block md:hidden space-y-4">
        {/* Mockup Header: Avatar + Greetings + Bell */}
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-3">
            <img
              src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
              alt={profile?.full_name}
              className="w-10 h-10 rounded-full border border-border-subtle object-cover shadow-sm"
            />
            <div>
              <h2 className="text-xs font-semibold text-text-muted font-mono leading-none">
                {getGreeting()}, {profile?.full_name?.split(' ')[0] || 'Jacob'}
              </h2>
              <p className="text-[10px] text-text-secondary mt-1 font-bold">
                Progress: <span className="text-brand-secondary font-mono">{lifeScore.score}%</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary cursor-pointer shadow-sm">
              <Search className="w-3.5 h-3.5" />
            </button>
            <button className="p-2 rounded-full bg-bg-card border border-border-subtle text-text-secondary hover:text-text-primary cursor-pointer shadow-sm">
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mockup Challenge Banner: Daily challenge card in violet */}
        <div className="p-4 rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white relative overflow-hidden shadow-lg shadow-indigo-500/15 select-none">
          {/* Abstract background shapes */}
          <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute right-4 bottom-2 w-16 h-16 bg-emerald-400/20 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 space-y-3">
            <div>
              <span className="text-[9px] uppercase tracking-widest font-mono text-indigo-200">System Routine</span>
              <h3 className="text-base font-extrabold tracking-tight mt-0.5 leading-snug">Daily challenge</h3>
              <p className="text-[10px] text-indigo-100 font-medium">Do your plan before 07:00 PM</p>
            </div>
            
            <div className="flex items-center gap-1.5 pt-1">
              <div className="flex -space-x-1.5">
                <img className="w-4 h-4 rounded-full border border-violet-600 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=50&q=80" alt="collaborator" />
                <img className="w-4 h-4 rounded-full border border-violet-600 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&q=80" alt="collaborator" />
                <div className="w-4 h-4 rounded-full bg-violet-800 text-[8px] font-bold text-white flex items-center justify-center border border-violet-600 font-mono">+1</div>
              </div>
              <span className="text-[9px] text-indigo-200 font-semibold font-mono">Streak: {peakStreak} days</span>
            </div>
          </div>
        </div>

        {/* Mockup Date Slider: Horizontal rounded boxes */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {weekDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentToday = isSameDay(day, today);
            
            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`flex-shrink-0 flex flex-col items-center py-2.5 px-3.5 rounded-2xl border select-none transition-all cursor-pointer outline-none ${
                  isSelected
                    ? 'bg-text-primary text-bg-main border-text-primary shadow-sm font-bold scale-102'
                    : isCurrentToday
                    ? 'bg-bg-card border-brand-primary/50 text-brand-primary'
                    : 'bg-bg-card border-border-subtle text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
                }`}
              >
                <span className="text-[8px] font-mono uppercase tracking-wider">
                  {format(day, 'eee')}
                </span>
                <span className="text-xs font-bold mt-1 font-mono">{format(day, 'd')}</span>
              </button>
            );
          })}
        </div>

        {/* Mockup Habits Section: "Your Plan" */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-text-primary tracking-widest font-mono uppercase">Your plan</h3>
            <button
              onClick={() => navigate('/habits')}
              className="text-[10px] text-brand-secondary font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              All routines <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {habitsDueToday.length === 0 ? (
            <div className="py-4 text-center text-xs text-text-muted">No routines setup for today.</div>
          ) : (
            <div className="space-y-3">
              {habitsDueToday.map((habit, index) => {
                const isCompleted = habitLogs[`${habit.id}_${selectedDateStr}`]?.status === 'completed';
                const isFirst = index === 0;

                return (
                  <div
                    key={habit.id}
                    onClick={() => handleToggleHabit(habit.id)}
                    className={`flex items-center justify-between p-3.5 rounded-3xl border transition-all cursor-pointer select-none ${
                      isCompleted
                        ? 'bg-bg-card-hover/40 border-border-subtle text-text-muted opacity-80'
                        : isFirst
                        ? 'bg-amber-100 dark:bg-amber-950/20 text-amber-900 dark:text-amber-100 border-amber-300/30 shadow-md shadow-amber-900/5'
                        : 'bg-bg-card border-border-subtle hover:bg-bg-card-hover text-text-primary shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button className="outline-none shrink-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                        ) : (
                          <Circle className={`w-5 h-5 ${isFirst ? 'text-amber-500' : 'text-text-muted'}`} />
                        )}
                      </button>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{habit.title}</h4>
                        <p className={`text-[9px] font-mono mt-0.5 ${isFirst ? 'text-amber-700/80 dark:text-amber-300/80' : 'text-text-muted'}`}>
                          Due: {habit.time_of_day}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] uppercase font-mono tracking-wider font-semibold px-2 py-0.5 rounded ${isFirst ? 'bg-amber-200/40 dark:bg-white/10' : 'bg-bg-card-hover text-text-secondary'}`}>
                        {habit.frequency}
                      </span>
                      <span className="text-[10px] font-mono font-bold flex items-center gap-0.5 text-orange-400">
                        <Flame className="w-3.5 h-3.5 fill-current" /> {habit.streak_count}d
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mockup Goals Section: "Curriculum Overview" */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-text-primary tracking-widest font-mono uppercase">Curriculum Overview</h3>
            <button
              onClick={() => navigate('/goals')}
              className="text-[10px] text-brand-secondary font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
            >
              All OKRs <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {goals.length === 0 ? (
            <div className="py-4 text-center text-xs text-text-muted">No active goals setup.</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {goals.map((goal, index) => {
                const isEven = index % 2 === 0;
                const totalProgress = Math.round(
                  (goal.key_results.reduce((acc, kr) => acc + Math.min(1, kr.current_value / kr.target_value), 0) /
                    (goal.key_results.length || 1)) *
                    100
                );

                return (
                  <div
                    key={goal.id}
                    className={`p-3.5 rounded-3xl border flex flex-col justify-between shadow-sm space-y-3 ${
                      isEven
                        ? 'bg-emerald-100 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100 border-emerald-300/30'
                        : 'bg-sky-100 dark:bg-sky-950/20 text-sky-950 dark:text-sky-100 border-sky-300/30'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-[11px] font-extrabold tracking-tight leading-snug line-clamp-2">
                          {goal.title}
                        </h4>
                        <span className="text-[10px] font-mono font-extrabold">{totalProgress}%</span>
                      </div>
                      <p className={`text-[8px] font-mono mt-1 ${isEven ? 'text-emerald-700/80 dark:text-emerald-400/80' : 'text-sky-700/80 dark:text-sky-400/80'}`}>
                        Target: {goal.target_date}
                      </p>
                    </div>

                    <div className="w-full h-1 bg-black/5 dark:bg-white/10 rounded-progress overflow-hidden mt-1">
                      <div
                        className="h-full bg-text-primary rounded-progress"
                        style={{ width: `${totalProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mockup Progress Breakdown Section */}
        <div className="p-3.5 rounded-3xl bg-bg-card border border-border-subtle space-y-3 shadow-sm">
          <h3 className="text-xs font-bold text-text-primary">Learning Plan Indicators</h3>
          
          <div className="space-y-2.5">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                <span>Habit Index Score</span>
                <span className="font-bold">{lifeScore.habit_component}/50</span>
              </div>
              <div className="w-full h-1.5 bg-bg-card-hover rounded-progress overflow-hidden">
                <div className="h-full bg-brand-primary rounded-progress" style={{ width: `${(lifeScore.habit_component / 50) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                <span>Goal Velocity</span>
                <span className="font-bold">{lifeScore.goal_component}/30</span>
              </div>
              <div className="w-full h-1.5 bg-bg-card-hover rounded-progress overflow-hidden">
                <div className="h-full bg-brand-secondary rounded-progress" style={{ width: `${(lifeScore.goal_component / 30) * 100}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-text-secondary font-mono">
                <span>Mood Consistency</span>
                <span className="font-bold">{lifeScore.mood_component}/20</span>
              </div>
              <div className="w-full h-1.5 bg-bg-card-hover rounded-progress overflow-hidden">
                <div className="h-full bg-accent-warning rounded-progress" style={{ width: `${(lifeScore.mood_component / 20) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP VIEWPORT LAYOUT (Plan.io / High-Contrast space style) */}
      <div className="hidden md:block space-y-3">
        {/* Top Welcome Panel - Compact & Light (Plan.io style) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-border-subtle pb-2.5">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
              Good Morning, {profile?.full_name || 'Grower'}
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
                  onClick={() => navigate('/habits')}
                  className="text-[10px] text-brand-secondary hover:underline flex items-center gap-0.5 font-semibold cursor-pointer"
                >
                  Manage All <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {habitsDueToday.length === 0 ? (
                <div className="py-4 text-center space-y-2">
                  <p className="text-[11px] text-text-secondary">No habits setup for today.</p>
                  <button
                    onClick={() => navigate('/habits')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-btn bg-brand-primary hover:bg-emerald-600 text-white text-[10px] font-semibold transition-all cursor-pointer"
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
                  onClick={() => navigate('/goals')}
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
                  onClick={() => navigate('/calendar')}
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
                onClick={() => navigate('/journal')}
                className="w-full py-1.5 rounded-btn bg-bg-card hover:bg-bg-card-hover border border-border-subtle text-text-primary font-semibold text-[10px] transition-all cursor-pointer active:scale-98"
              >
                Open Mood Matrix
              </button>
            </GlassCard>

          </div>

        </div>
      </div>
    </div>
  );
};
