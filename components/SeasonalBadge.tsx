'use client';

import React from 'react';
import { toPascalCase } from '@/lib/shopify';

interface SeasonalBadgeProps {
  seasonName: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const SeasonalBadge: React.FC<SeasonalBadgeProps> = ({
  seasonName,
  className = '',
  size = 'default',
}) => {
  if (!seasonName) return null;

  const formattedSeason = toPascalCase(
    seasonName.replace(/^temporada:\s*/i, '').trim(),
  );

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[7.5px] gap-1'
      : size === 'lg'
        ? 'px-3.5 py-1.5 text-[10px] gap-2'
        : 'px-2 py-0.5 text-[8px] gap-1.5 sm:px-3 sm:py-1 sm:text-[9px] sm:gap-2';

  const dotSizeClasses =
    size === 'sm'
      ? 'h-1.5 w-1.5'
      : size === 'lg'
        ? 'h-2 w-2'
        : 'h-1.5 w-1.5 sm:h-2 sm:w-2';

  return (
    <span
      className={`inline-flex items-center rounded-full bg-primary/85 backdrop-blur-md border border-white/10 font-bold tracking-widest text-accent-gold uppercase shadow-sm max-w-full ${sizeClasses} ${className}`}
      title={`Temporada: ${formattedSeason}`}
    >
      <span className={`relative flex shrink-0 ${dotSizeClasses}`}>
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75" />
        <span
          className={`relative inline-flex rounded-full bg-accent-gold ${dotSizeClasses}`}
        />
      </span>
      <span className="truncate">{formattedSeason}</span>
    </span>
  );
};

export default SeasonalBadge;
