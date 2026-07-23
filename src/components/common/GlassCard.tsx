import React from 'react';
import { clsx } from 'clsx';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  glow?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  interactive = false,
  className,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={clsx(
        'rounded-xl p-5 text-text-primary transition-all duration-200',
        interactive ? 'glass-panel-interactive cursor-pointer' : 'glass-panel',
        glow && 'shadow-[0_0_20px_rgba(99,102,241,0.15)] border-indigo-500/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
