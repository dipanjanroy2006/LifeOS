import React from 'react';
import { GlassCard } from './GlassCard';
import { LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface StatWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  trendPositive?: boolean;
  icon: LucideIcon;
  iconColor?: string;
}

export const StatWidget: React.FC<StatWidgetProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendPositive = true,
  icon: Icon,
  iconColor = 'text-indigo-400',
}) => {
  return (
    <GlassCard className="flex flex-col justify-between relative overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">{title}</span>
        <div className={clsx('p-2 rounded-lg bg-zinc-900/80 border border-white/5', iconColor)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-white font-mono">{value}</span>
        {trend && (
          <span
            className={clsx(
              'text-xs font-semibold px-1.5 py-0.5 rounded',
              trendPositive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            )}
          >
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="text-xs text-zinc-400 mt-1">{subtitle}</p>}
    </GlassCard>
  );
};
