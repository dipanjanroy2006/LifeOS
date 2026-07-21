import React, { useState } from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { GlassCard } from '../common/GlassCard';
import { BookOpen, Smile, Zap, Tag, Save, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';

export const JournalView: React.FC = () => {
  const { moodLogs, logMood } = useLifeOSStore();
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayMood = moodLogs[todayStr];

  const [valence, setValence] = useState(todayMood ? todayMood.valence : 4);
  const [energy, setEnergy] = useState(todayMood ? todayMood.energy : 4);
  const [selectedTags, setSelectedTags] = useState<string[]>(todayMood ? todayMood.tags : ['focused', 'productive']);
  const [journalEntry, setJournalEntry] = useState(todayMood ? todayMood.journal_entry || '' : '');

  const availableTags = ['focused', 'productive', 'energized', 'calm', 'stressed', 'tired', 'social', 'family', 'workout'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    logMood(valence, energy, selectedTags, journalEntry);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Journal & Mood Matrix</h2>
        <p className="text-xs text-zinc-400 mt-1">
          Capture subjective emotional state and daily reflections to uncover correlations between habits and well-being.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 2D Matrix Slider Panel */}
        <GlassCard className="space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Smile className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Subjective Well-being Check-in</h3>
          </div>

          {/* Valence Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Smile className="w-3.5 h-3.5 text-amber-400" /> Mood (Valence): {valence} / 5
              </span>
              <span className="text-zinc-500 font-mono">
                {valence === 5 ? 'Ecstatic' : valence === 4 ? 'Positive' : valence === 3 ? 'Neutral' : 'Low'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={valence}
              onChange={(e) => setValence(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Energy Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Energy Level: {energy} / 5
              </span>
              <span className="text-zinc-500 font-mono">
                {energy === 5 ? 'High Energy' : energy === 4 ? 'Moderate' : energy === 3 ? 'Steady' : 'Exhausted'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Context Tags */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-zinc-300 block">Context Tags</span>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold'
                        : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Reflection Notepad Panel */}
        <GlassCard className="space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-white/5 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Daily Reflection Log</h3>
            </div>

            <textarea
              placeholder="What went well today? What friction did you encounter?"
              value={journalEntry}
              onChange={(e) => setJournalEntry(e.target.value)}
              className="w-full h-44 p-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 font-sans resize-none"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Journal Entry
          </button>
        </GlassCard>
      </div>
    </div>
  );
};
