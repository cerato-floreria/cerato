'use client';

import React from 'react';

interface FeaturedBadgeProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const FeaturedBadge: React.FC<FeaturedBadgeProps> = ({
  className = '',
  size = 'default',
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[7.5px] gap-1'
      : size === 'lg'
        ? 'px-3.5 py-1.5 text-[10px] gap-2'
        : 'px-2 py-0.5 text-[8px] gap-1 sm:px-3 sm:py-1 sm:text-[9px] sm:gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full bg-primary/80 backdrop-blur-md border border-accent-gold/35 font-bold tracking-widest text-white uppercase shadow-sm max-w-full shrink-0 ${sizeClasses} ${className}`}
      title="Destacado Cerato"
    >
      <span className="text-accent-gold leading-none shrink-0">✦</span>
      <span className="truncate">Destacado Cerato</span>
    </span>
  );
};

export default FeaturedBadge;
