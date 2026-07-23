import React from 'react';
import { clsx } from 'clsx';

interface AtomProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
  text?: string;
  textColor?: string;
}

export const Atom: React.FC<AtomProps> = ({
  color = '#379d64',
  size = 'medium',
  text = '',
  textColor = '',
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
  };

  const ringSizes = {
    small: 'w-8 h-3',
    medium: 'w-16 h-6',
    large: 'w-24 h-9',
  };

  const centerSizes = {
    small: 'w-1.5 h-1.5',
    medium: 'w-3 h-3',
    large: 'w-4 h-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 select-none">
      <div className={clsx('relative flex items-center justify-center', sizeClasses[size])}>
        {/* Orbit 1 */}
        <div
          className={clsx('absolute border-2 rounded-full animate-spin', ringSizes[size])}
          style={{
            borderColor: color,
            transform: 'rotate(0deg)',
            opacity: 0.25,
            animationDuration: '1.5s',
          }}
        />
        {/* Orbit 2 */}
        <div
          className={clsx('absolute border-2 rounded-full animate-spin', ringSizes[size])}
          style={{
            borderColor: color,
            transform: 'rotate(60deg)',
            opacity: 0.35,
            animationDuration: '2s',
          }}
        />
        {/* Orbit 3 */}
        <div
          className={clsx('absolute border-2 rounded-full animate-spin', ringSizes[size])}
          style={{
            borderColor: color,
            transform: 'rotate(120deg)',
            opacity: 0.45,
            animationDuration: '2.5s',
          }}
        />

        {/* Central Nucleus dot */}
        <div
          className={clsx('rounded-full animate-ping')}
          style={{
            backgroundColor: color,
            width: centerSizes[size],
            height: centerSizes[size],
            animationDuration: '1.2s',
          }}
        />
        <div
          className={clsx('absolute rounded-full')}
          style={{
            backgroundColor: color,
            width: centerSizes[size],
            height: centerSizes[size],
          }}
        />
      </div>

      {text && (
        <span
          className={clsx('text-xs font-mono font-bold tracking-wider uppercase', textColor || 'text-text-secondary')}
        >
          {text}
        </span>
      )}
    </div>
  );
};

export default Atom;
