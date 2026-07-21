import React, { useState } from 'react';
import { format, subDays, parseISO } from 'date-fns';
import { CheckCircle2, Flame, Calendar as CalendarIcon } from 'lucide-react';

interface GitHubHeatmapProps {
  logs: Record<string, any>;
  days?: number;
}

export const GitHubHeatmap: React.FC<GitHubHeatmapProps> = ({ logs, days = 105 }) => {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number; x: number; y: number } | null>(null);

  const dateList = React.useMemo(() => {
    const list: Array<{ date: string; count: number }> = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const dStr = format(d, 'yyyy-MM-dd');
      
      let count = 0;
      Object.keys(logs).forEach((key) => {
        if (key.endsWith(dStr) && logs[key]?.status === 'completed') {
          count++;
        }
      });
      list.push({ date: dStr, count });
    }
    return list;
  }, [logs, days]);

  const getShade = (count: number) => {
    if (count === 0) return 'bg-zinc-900 border-white/5';
    if (count === 1) return 'bg-emerald-950 border-emerald-800/40';
    if (count === 2) return 'bg-emerald-800 border-emerald-600/50';
    if (count === 3) return 'bg-emerald-600 border-emerald-400/60';
    return 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] border-emerald-200';
  };

  const handleMouseEnter = (item: { date: string; count: number }, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = e.currentTarget.closest('.heatmap-container')?.getBoundingClientRect() || rect;
    
    setHoveredDay({
      date: item.date,
      count: item.count,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
  };

  return (
    <div className="flex flex-col gap-2 relative heatmap-container select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Consistency Heatmap</span>
          {hoveredDay && (
            <span className="text-[10px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-fade-in">
              {hoveredDay.count} Completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-white/5" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-950" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-800" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
          <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-flow-col grid-rows-7 gap-1.5 overflow-x-auto pb-1 pt-1">
        {dateList.map((item) => (
          <div
            key={item.date}
            onMouseEnter={(e) => handleMouseEnter(item, e)}
            onMouseLeave={() => setHoveredDay(null)}
            className={`w-3.5 h-3.5 rounded-sm border transition-all duration-150 hover:scale-125 hover:z-10 cursor-pointer ${getShade(
              item.count
            )}`}
          />
        ))}
      </div>

      {/* Floating Rich Glassmorphism Tooltip on Hover */}
      {hoveredDay && (
        <div
          style={{
            left: `${Math.max(80, Math.min(hoveredDay.x, 340))}px`,
            top: `${hoveredDay.y}px`,
            transform: 'translate(-50%, -100%)',
          }}
          className="absolute z-50 pointer-events-none transition-all duration-150 ease-out"
        >
          <div className="bg-[#121215]/95 backdrop-blur-md border border-white/15 rounded-xl p-3 shadow-2xl space-y-1.5 min-w-[200px]">
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-400" />
              <span>{format(parseISO(hoveredDay.date), 'EEEE, MMM d, yyyy')}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10">
              <span className="text-[11px] text-zinc-400">Tasks Completed:</span>
              <div className="flex items-center gap-1">
                {hoveredDay.count > 0 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {hoveredDay.count} Habits
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-mono text-zinc-500">0 Habits</span>
                )}
              </div>
            </div>

            {hoveredDay.count >= 3 && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400 pt-0.5">
                <Flame className="w-3 h-3 fill-amber-500/20" /> Peak Execution Day
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
