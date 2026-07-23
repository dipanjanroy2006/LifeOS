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
    if (count === 0) return 'bg-bg-card-hover border-border-subtle';
    if (count === 1) return 'bg-brand-primary/20 border-brand-primary/30';
    if (count === 2) return 'bg-brand-primary/45 border-brand-primary/55';
    if (count === 3) return 'bg-brand-primary/70 border-brand-primary/80';
    return 'bg-brand-primary border-brand-primary/90 shadow-[0_0_8px_rgba(34,197,94,0.3)]';
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
          <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">Consistency Heatmap</span>
          {hoveredDay && (
            <span className="text-[10px] font-mono font-medium text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded border border-brand-primary/20 animate-fade-in">
              {hoveredDay.count} Completed
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-sm bg-bg-card-hover border border-border-subtle" />
          <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary/20" />
          <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary/45" />
          <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary/70" />
          <div className="w-2.5 h-2.5 rounded-sm bg-brand-primary" />
          <span>More</span>
        </div>
      </div>

      <div className="grid grid-flow-col grid-rows-7 gap-1 md:gap-1.5 overflow-x-auto pb-1 pt-1">
        {dateList.map((item) => (
          <div
            key={item.date}
            onMouseEnter={(e) => handleMouseEnter(item, e)}
            onMouseLeave={() => setHoveredDay(null)}
            className={`w-2.5 h-2.5 md:w-3.5 md:h-3.5 rounded-sm border transition-all duration-150 hover:scale-125 hover:z-10 cursor-pointer ${getShade(
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
          <div className="bg-bg-card/95 backdrop-blur-md border border-border-subtle rounded-xl p-3 shadow-2xl space-y-1.5 min-w-[200px]">
            <div className="flex items-center gap-1.5 text-xs text-text-primary font-medium">
              <CalendarIcon className="w-3.5 h-3.5 text-brand-secondary" />
              <span>{format(parseISO(hoveredDay.date), 'EEEE, MMM d, yyyy')}</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-border-subtle">
              <span className="text-[11px] text-text-secondary">Tasks Completed:</span>
              <div className="flex items-center gap-1">
                {hoveredDay.count > 0 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-primary" />
                    <span className="text-xs font-mono font-bold text-brand-primary">
                      {hoveredDay.count} Habits
                    </span>
                  </>
                ) : (
                  <span className="text-xs font-mono text-text-muted">0 Habits</span>
                )}
              </div>
            </div>

            {hoveredDay.count >= 3 && (
              <div className="flex items-center gap-1 text-[10px] font-mono text-accent-warning pt-0.5">
                <Flame className="w-3 h-3 fill-accent-warning/20" /> Peak Execution Day
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
