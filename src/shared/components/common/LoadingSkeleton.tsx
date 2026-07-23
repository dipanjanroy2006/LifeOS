import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse w-full">
      <div className="h-8 bg-zinc-800/50 rounded-lg w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="h-40 bg-zinc-800/40 rounded-xl" />
        <div className="h-40 bg-zinc-800/40 rounded-xl" />
        <div className="h-40 bg-zinc-800/40 rounded-xl" />
        <div className="h-40 bg-zinc-800/40 rounded-xl" />
      </div>
      <div className="h-64 bg-zinc-800/30 rounded-xl w-full" />
    </div>
  );
};
