import React from 'react';
import { useLifeOSStore } from '../../store/useLifeOSStore';
import { GlassCard } from '../common/GlassCard';
import { BarChart3, TrendingUp, Sparkles, Activity } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import { format, parseISO } from 'date-fns';

export const AnalyticsView: React.FC = () => {
  const { getHistoricalScores } = useLifeOSStore();
  const historicalData = getHistoricalScores(14);

  const formattedData = historicalData.map((d) => ({
    ...d,
    shortDate: format(parseISO(d.date), 'MMM d'),
  }));

  // Calculate average score dynamically
  const avgScore = formattedData.length > 0
    ? Math.round(formattedData.reduce((acc, d) => acc + d.score, 0) / formattedData.length)
    : 0;

  return (
    <div className="space-y-4 pb-20 md:pb-8 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-text-primary tracking-tight">Consistency Trends</h2>
        <p className="text-[11px] text-text-secondary mt-0.5">
          Track your daily routine consistency, goal velocity, and mood logs over time.
        </p>
      </div>

      {/* Main Life Score Chart */}
      <GlassCard className="p-3.5 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-lg bg-indigo-500/10 text-brand-secondary border border-brand-secondary/20">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-primary">14-Day Life Score</h3>
              <p className="text-[9px] text-text-muted mt-0.5">Overall consistency rating index (0-100)</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Avg: {avgScore}
          </span>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.2} />
              <XAxis dataKey="shortDate" stroke="var(--text-muted)" fontSize={9} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="var(--text-muted)" fontSize={9} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--text-secondary)' }}
                formatter={(value: any, name: string) => {
                  if (name === 'score') return [value, 'Life Score'];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="var(--brand-secondary)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--brand-secondary)' }}
                activeDot={{ r: 5, fill: 'var(--brand-primary)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      {/* Component Breakdown Area Chart */}
      <GlassCard className="p-3.5 sm:p-5 space-y-3">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-lg bg-emerald-500/10 text-brand-primary border border-brand-primary/20">
            <Activity className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-text-primary">Daily Score Share</h3>
            <p className="text-[9px] text-text-muted mt-0.5">
              Breakdown of Habits (max 50), Goals (max 30), and Mood (max 20) points
            </p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" opacity={0.2} />
              <XAxis dataKey="shortDate" stroke="var(--text-muted)" fontSize={9} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={9} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
                itemStyle={{ color: 'var(--text-secondary)' }}
                formatter={(value: any, name: string) => {
                  switch (name) {
                    case 'habit_component': return [value, 'Habits Score'];
                    case 'goal_component': return [value, 'Goals Score'];
                    case 'mood_component': return [value, 'Mood Score'];
                    default: return [value, name];
                  }
                }}
              />
              <Area type="monotone" dataKey="habit_component" stackId="1" stroke="var(--brand-primary)" fill="var(--brand-primary)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="goal_component" stackId="1" stroke="var(--brand-secondary)" fill="var(--brand-secondary)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="mood_component" stackId="1" stroke="var(--accent-warning)" fill="var(--accent-warning)" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </div>
  );
};
