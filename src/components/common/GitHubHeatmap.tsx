import React from 'react';
import { format, subDays } from 'date-fns';

interface GitHubHeatmapProps {
  logs: Record<string, any>;
  days?: number;
}

export const GitHubHeatmap: React.FC<GitHubHeatmapProps> = ({ logs, days = 105 }) => {
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

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Consistency Heatmap</span>
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
            title={`${item.date}: ${item.count} habits completed`}
            className={`w-3 h-3 rounded-sm border transition-all duration-150 hover:scale-125 cursor-pointer ${getShade(item.count)}`}
          />
        ))}
      </div>
    </div>
  );
};
