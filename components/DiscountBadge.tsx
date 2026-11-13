'use client';

import React from 'react';

interface DiscountBadgeProps {
  discountPercent: number;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const DiscountBadge: React.FC<DiscountBadgeProps> = ({
  discountPercent,
  className = '',
  size = 'default',
}) => {
  if (!discountPercent || discountPercent <= 0) return null;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[8.5px] sm:text-[9.5px] gap-0.5'
      : size === 'lg'
        ? 'px-3.5 py-1 text-xs sm:text-sm gap-1'
        : 'px-2.5 py-0.5 text-[10px] sm:text-xs gap-1';

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-full font-sans font-black tracking-wider uppercase border border-amber-100/70 select-none animate-discount-glow shrink-0 transition-transform ${sizeClasses} ${className}`}
      style={{
        background: 'linear-gradient(135deg, #ECC867 0%, #FBF0B9 35%, #D4AF37 70%, #9F7510 100%)',
        color: '#241225',
      }}
      title={`Descuento de ${discountPercent}%`}
    >
      {/* Dynamic light reflection shimmer sweeping across */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full animate-discount-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.85) 50%, transparent 100%)',
          width: '100%',
          height: '100%',
        }}
      />

      {/* Badge Content */}
      <span className="relative z-10 flex items-center leading-none drop-shadow-xs font-black">
        <span>{discountPercent}% off</span>
      </span>
    </div>
  );
};

export default DiscountBadge;

