import React, { useState } from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { GlassCard } from '../common/GlassCard';
import { Plus, Calendar, Sliders } from 'lucide-react';
import confetti from 'canvas-confetti';

export const GoalsView: React.FC = () => {
  const { goals, pillars, updateKeyResult, addGoal } = useLifeOSStore();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [selectedPillar, setSelectedPillar] = useState(pillars[0]?.id || '');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  const handleSliderChange = (goalId: string, krId: string, val: number, target: number) => {
    updateKeyResult(goalId, krId, val);
    if (val >= target) {
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addGoal({
      pillar_id: selectedPillar,
      title: newTitle,
      description: newDesc,
      target_date: targetDate,
      status: 'in_progress',
      key_results: [
        { id: `kr_${Date.now()}_1`, goal_id: '', title: 'Milestone Step 1', current_value: 0, target_value: 100, unit: '%' },
      ],
    });
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Goals & OKRs</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Set and track goals for the different areas of your life.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> New Goal
        </button>
      </div>

      {/* Pillars Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {pillars.map((pillar) => {
          const pillarGoals = goals.filter((g) => g.pillar_id === pillar.id);
          return (
            <GlassCard key={pillar.id} className="p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: pillar.color }}>
                  {pillar.category}
                </span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: pillar.color }}
                />
              </div>
              <h4 className="text-xs font-semibold text-white truncate">{pillar.title}</h4>
              <p className="text-[10px] text-zinc-400 mt-1 font-mono">{pillarGoals.length} Goals</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Goals Tree List */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const pillar = pillars.find((p) => p.id === goal.pillar_id);
          const totalProgress = Math.round(
            (goal.key_results.reduce((acc, kr) => acc + Math.min(1, kr.current_value / kr.target_value), 0) /
              (goal.key_results.length || 1)) *
              100
          );

          return (
            <GlassCard key={goal.id} className="p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {pillar && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded border uppercase tracking-wider"
                        style={{ color: pillar.color, borderColor: `${pillar.color}40`, backgroundColor: `${pillar.color}15` }}
                      >
                        {pillar.title}
                      </span>
                    )}
                    <span className="text-xs text-zinc-400 font-mono flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Target: {goal.target_date}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white tracking-tight">{goal.title}</h3>
                  {goal.description && <p className="text-xs text-zinc-400">{goal.description}</p>}
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xl font-mono font-bold text-indigo-400">{totalProgress}%</span>
                    <span className="text-[10px] uppercase block text-zinc-500 font-semibold">Total Completion</span>
                  </div>
                </div>
              </div>

              {/* Key Results Slider List */}
              <div className="space-y-3">
                <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Key Results Metric Progress
                </span>

                {goal.key_results.map((kr) => {
                  const krPercent = Math.min(100, Math.round((kr.current_value / kr.target_value) * 100));
                  return (
                    <div key={kr.id} className="p-3 rounded-lg bg-zinc-900/60 border border-white/5 space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-medium text-white">{kr.title}</span>
                        <span className="font-mono text-zinc-300 font-semibold">
                          {kr.current_value} / {kr.target_value} {kr.unit} ({krPercent}%)
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={kr.target_value}
                        step={kr.target_value > 10 ? 1 : 0.1}
                        value={kr.current_value}
                        onChange={(e) =>
                          handleSliderChange(goal.id, kr.id, parseFloat(e.target.value), kr.target_value)
                        }
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* New Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New OKR Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Goal Objective Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master System Architecture & Scalability"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Description</label>
                <textarea
                  placeholder="Brief rationale or outcome summary"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Pillar</label>
                  <select
                    value={selectedPillar}
                    onChange={(e) => setSelectedPillar(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {pillars.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Target Date</label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
