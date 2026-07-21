import React, { useState } from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { GlassCard } from '../common/GlassCard';
import { Calendar as CalendarIcon, Clock, Plus, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

export const CalendarView: React.FC = () => {
  const { timeBlocks, addTimeBlock, toggleTimeBlock } = useLifeOSStore();
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:00');
  const [category, setCategory] = useState('Deep Work');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTimeBlock({
      title,
      start_time: `${todayStr}T${startTime}:00`,
      end_time: `${todayStr}T${endTime}:00`,
      category,
      is_completed: false,
      color: '#6366f1',
    });
    setTitle('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Time Blocking & Planner</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Eliminate cognitive friction by assigning dedicated time slots for workouts, deep work, and mindfulness.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-xs shadow-lg shadow-indigo-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Time Block
        </button>
      </div>

      {/* Schedule Timeline */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/5">
          <CalendarIcon className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-white">Today's Timeline ({format(new Date(), 'MMMM d')})</h3>
        </div>

        <div className="space-y-3">
          {timeBlocks.map((block) => (
            <div
              key={block.id}
              onClick={() => toggleTimeBlock(block.id)}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                block.is_completed
                  ? 'bg-zinc-950/20 border-white/5 opacity-60'
                  : 'bg-zinc-900/60 border-white/10 hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <button className="text-indigo-400">
                  {block.is_completed ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500/20 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-500 hover:text-zinc-300" />
                  )}
                </button>

                <div>
                  <h4 className={`text-sm font-bold ${block.is_completed ? 'line-through text-zinc-500' : 'text-white'}`}>
                    {block.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>
                      {format(new Date(block.start_time), 'HH:mm')} - {format(new Date(block.end_time), 'HH:mm')}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {block.category}
              </span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* New Time Block Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#121215] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create Time Block</h3>
            <form onSubmit={handleCreateBlock} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Block Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Architecture Deep Work"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">Start Time</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400 block mb-1">End Time</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-400 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                >
                  <option value="Deep Work">Deep Work</option>
                  <option value="Health & Workout">Health & Workout</option>
                  <option value="Mindfulness">Mindfulness</option>
                  <option value="Learning">Learning</option>
                  <option value="Personal Admin">Personal Admin</option>
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
                  Create Time Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
