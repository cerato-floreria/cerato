'use client';

import React from 'react';

interface SoldOutBadgeProps {
  className?: string;
  size?: 'sm' | 'default';
}

export const SoldOutBadge: React.FC<SoldOutBadgeProps> = ({
  className = '',
  size = 'default',
}) => {
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[8px] gap-1'
      : 'px-2.5 py-1 text-[9px] gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full bg-black/70 backdrop-blur-md font-bold tracking-wider text-white uppercase shadow-md border border-white/10 shrink-0 ${sizeClasses} ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0 shadow-[0_0_6px_rgba(248,113,113,0.8)]" />
      Agotado
    </span>
  );
};

export default SoldOutBadge;
