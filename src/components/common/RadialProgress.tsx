import React from 'react';

interface RadialProgressProps {
  score: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  title?: string;
  subtitle?: string;
}

export const RadialProgress: React.FC<RadialProgressProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  title = 'Life Score',
  subtitle = 'Daily Index',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color based on score
  let colorClass = '#6366f1'; // Indigo default
  if (score >= 85) colorClass = '#10b981'; // Emerald peak
  else if (score >= 70) colorClass = '#6366f1';
  else if (score >= 50) colorClass = '#f59e0b'; // Amber warning
  else colorClass = '#f43f5e'; // Rose alert

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#27272a"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorClass}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{score}</span>
        <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">{title}</span>
      </div>
    </div>
  );
};
