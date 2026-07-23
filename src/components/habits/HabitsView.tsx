import React, { useState } from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { GlassCard } from '../common/GlassCard';
import { GitHubHeatmap } from '../common/GitHubHeatmap';
import { Plus, Flame, Trash2, CheckCircle2, Circle, Sun, Sunset, Moon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import type { Habit, Pillar } from '../../types';

export const HabitsView: React.FC = () => {
  const { habits, habitLogs, toggleHabitLog, addHabit, deleteHabit, pillars } = useLifeOSStore();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [selectedPillar, setSelectedPillar] = useState(pillars[0]?.id || '');
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const handleToggle = (id: string) => {
    toggleHabitLog(id);
    confetti({ particleCount: 25, spread: 50, origin: { y: 0.7 } });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({
      title: newTitle,
      pillar_id: selectedPillar,
      frequency: 'daily',
      target_days: [0, 1, 2, 3, 4, 5, 6],
      target_count: 1,
      time_of_day: timeOfDay,
      color: '#6366f1',
      icon: 'CheckSquare',
      archived: false,
    });
    setNewTitle('');
    setShowModal(false);
  };

  const getTimeIcon = (tod: string) => {
    switch (tod) {
      case 'morning': return <Sun className="w-4 h-4 text-amber-400" />;
      case 'afternoon': return <Sunset className="w-4 h-4 text-indigo-400" />;
      case 'evening': return <Moon className="w-4 h-4 text-violet-400" />;
      default: return <Clock className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Habits</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Build good habits and keep your daily streak going.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Habit
        </button>
      </div>

      {/* Heatmap Overview */}
      <GlassCard>
        <GitHubHeatmap logs={habitLogs} days={140} />
      </GlassCard>

      {/* Habits Grid by Time of Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {habits.map((habit: Habit) => {
          const isCompleted = habitLogs[`${habit.id}_${todayStr}`]?.status === 'completed';
          const pillar = pillars.find((p: Pillar) => p.id === habit.pillar_id);

          return (
            <GlassCard
              key={habit.id}
              interactive
              className={`flex items-center justify-between p-4 transition-all ${
                isCompleted ? 'border-emerald-500/30 bg-emerald-950/10' : ''
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => handleToggle(habit.id)}
                  className="text-emerald-400 transition-transform active:scale-95"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 fill-emerald-500/20 text-emerald-400" />
                  ) : (
                    <Circle className="w-6 h-6 text-zinc-500 hover:text-zinc-300" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-sm font-semibold ${isCompleted ? 'line-through text-zinc-500' : 'text-white'}`}>
                      {habit.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {pillar && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded border"
                        style={{ color: pillar.color, borderColor: `${pillar.color}40`, backgroundColor: `${pillar.color}15` }}
                      >
                        {pillar.title}
                      </span>
                    )}
                    <span className="text-[10px] text-zinc-400 flex items-center gap-1 capitalize font-mono">
                      {getTimeIcon(habit.time_of_day)} {habit.time_of_day}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-amber-500/20" /> {habit.streak_count}d
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono">Best: {habit.best_streak}d</span>
                </div>
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* New Habit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Habit</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Read 20 mins, Cold Shower, Gym"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Life Pillar</label>
                <select
                  value={selectedPillar}
                  onChange={(e) => setSelectedPillar(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  {pillars.map((p: Pillar) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Time of Day</label>
                <select
                  value={timeOfDay}
                  onChange={(e) => setTimeOfDay(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="anytime">Anytime</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/20"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
