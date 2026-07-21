import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { GlassCard } from '../common/GlassCard';
import { RadialProgress } from '../common/RadialProgress';
import { StatWidget } from '../common/StatWidget';
import { GitHubHeatmap } from '../common/GitHubHeatmap';
import { CheckSquare, Flame, Target, Calendar as CalendarIcon, ArrowRight, Zap, CheckCircle2, Circle, Plus } from 'lucide-react';
import { format } from 'date-fns';
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

  const lifeScore = getDailyLifeScore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  // Habits due today
  const habitsDueToday = habits.filter((h) => !h.archived);
  const completedTodayCount = habitsDueToday.filter(
    (h) => habitLogs[`${h.id}_${todayStr}`]?.status === 'completed'
  ).length;

  const handleToggleHabit = (habitId: string) => {
    toggleHabitLog(habitId);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Banner / Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Radial Life Score Card */}
        <GlassCard glow className="md:col-span-1 flex flex-col items-center justify-center py-6">
          <RadialProgress score={lifeScore.score} size={150} />
          <div className="flex items-center gap-4 mt-4 w-full justify-center text-xs font-mono text-zinc-400">
            <div>Habits: <span className="text-emerald-400 font-bold">{lifeScore.habit_component}/50</span></div>
            <div>Goals: <span className="text-indigo-400 font-bold">{lifeScore.goal_component}/30</span></div>
            <div>Mood: <span className="text-amber-400 font-bold">{lifeScore.mood_component}/20</span></div>
          </div>
        </GlassCard>

        {/* Quick Stat Widgets */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatWidget
            title="Habit Execution"
            value={`${completedTodayCount}/${habitsDueToday.length}`}
            subtitle={habitsDueToday.length > 0 ? `${Math.round((completedTodayCount / habitsDueToday.length) * 100)}% completed today` : 'No active habits yet'}
            trend={habitsDueToday.length > 0 ? 'Active' : 'Setup'}
            icon={CheckSquare}
            iconColor="text-emerald-400"
          />
          <StatWidget
            title="Active Streaks"
            value={`${habits.reduce((max, h) => Math.max(max, h.streak_count), 0)} Days`}
            subtitle="Current peak streak record"
            trend="Peak"
            icon={Flame}
            iconColor="text-amber-400"
          />
          <StatWidget
            title="Goal Velocity"
            value={`${goals.length} Active`}
            subtitle="Quarterly OKRs on track"
            trend={goals.length > 0 ? 'On Track' : 'Create Goal'}
            icon={Target}
            iconColor="text-indigo-400"
          />
          {/* Consistency Heatmap Card spanning 3 columns */}
          <GlassCard className="sm:col-span-3">
            <GitHubHeatmap logs={habitLogs} days={91} />
          </GlassCard>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Action Checklist & Time Blocks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Habits Card */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white">Today's Habits</h3>
              </div>
              <button
                onClick={() => setActivePage('habits')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                Manage All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {habitsDueToday.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-zinc-400">No habits added yet. Create your daily routines to start tracking progress.</p>
                <button
                  onClick={() => setActivePage('habits')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Add First Habit
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {habitsDueToday.map((habit) => {
                  const isCompleted = habitLogs[`${habit.id}_${todayStr}`]?.status === 'completed';
                  return (
                    <div
                      key={habit.id}
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-zinc-400'
                          : 'bg-zinc-900/60 border-white/5 hover:border-white/15 text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button className="text-emerald-400">
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5 text-zinc-500 hover:text-zinc-300" />
                          )}
                        </button>
                        <span className={`text-sm font-medium ${isCompleted ? 'line-through text-zinc-500' : ''}`}>
                          {habit.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {habit.time_of_day}
                        </span>
                        <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5" /> {habit.streak_count}d
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* Today's Schedule Time Blocks */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white">Daily Schedule & Time Blocks</h3>
              </div>
              <button
                onClick={() => setActivePage('calendar')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                Open Calendar <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {timeBlocks.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-zinc-400">No time blocks scheduled for today. Allocate focused work & workout slots.</p>
                <button
                  onClick={() => setActivePage('calendar')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Schedule Time Block
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {timeBlocks.map((block) => (
                  <div
                    key={block.id}
                    onClick={() => toggleTimeBlock(block.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                      block.is_completed ? 'bg-zinc-900/30 border-white/5 opacity-60' : 'bg-zinc-900/80 border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-8 rounded-full" style={{ backgroundColor: block.color }} />
                      <div>
                        <h4 className={`text-sm font-medium ${block.is_completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                          {block.title}
                        </h4>
                        <p className="text-xs text-zinc-400 font-mono">
                          {format(new Date(block.start_time), 'HH:mm')} - {format(new Date(block.end_time), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${block.is_completed ? 'bg-zinc-800 text-zinc-500' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                      {block.is_completed ? 'Done' : block.category}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Goal Progress & Quick Reflections */}
        <div className="space-y-6">
          {/* Goal Stack */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Target className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-white">Active Goals Progress</h3>
              </div>
              <button
                onClick={() => setActivePage('goals')}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
              >
                All OKRs <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <p className="text-xs text-zinc-400">No active goals found. Set quarterly targets across your life pillars.</p>
                <button
                  onClick={() => setActivePage('goals')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Create First Goal
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {goals.map((goal) => {
                  const totalProgress = Math.round(
                    (goal.key_results.reduce((acc, kr) => acc + Math.min(1, kr.current_value / kr.target_value), 0) /
                      (goal.key_results.length || 1)) *
                      100
                  );
                  return (
                    <div key={goal.id} className="space-y-2 p-3 rounded-lg bg-zinc-900/60 border border-white/5">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-white leading-tight">{goal.title}</h4>
                        <span className="text-xs font-mono font-bold text-indigo-400">{totalProgress}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${totalProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        Target Date: {goal.target_date}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </GlassCard>

          {/* Quick Mood & Reflection */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-white">Daily Reflection</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Log your energy and mood to refine your Life Score correlation algorithms.
            </p>
            <button
              onClick={() => setActivePage('journal')}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 transition-all text-center"
            >
              Open Mood Matrix & Journal
            </button>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
