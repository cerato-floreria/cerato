'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { toPascalCase } from '@/lib/shopify';

interface ProductCardProps {
  id: string;
  handle?: string;
  name: string;
  price: number;
  currency?: string;
  image: string;
  availableForSale?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  handle,
  name,
  price,
  image,
  availableForSale = true,
}) => {
  const targetSlug = handle || id;
  const displayName = useMemo(() => toPascalCase(name), [name]);
  const [isHovered, setIsHovered] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [marqueeDistance, setMarqueeDistance] = useState(0);
  const [marqueeDuration, setMarqueeDuration] = useState(4);

  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  const checkOverflow = () => {
    if (containerRef.current && textRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.scrollWidth;

      if (textWidth > containerWidth + 2) {
        setIsOverflowing(true);
        const distance = -(textWidth - containerWidth + 8);
        setMarqueeDistance(distance);
        // Calculate duration based on distance so speed is consistent and comfortable to read
        const duration = Math.max(3.5, Math.abs(distance) / 22);
        setMarqueeDuration(duration);
      } else {
        setIsOverflowing(false);
        setMarqueeDistance(0);
      }
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(() => {
      checkOverflow();
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [displayName]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    checkOverflow();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      href={`/producto/${targetSlug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-cream border border-primary/5 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/15 active:scale-[0.98]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image with Smooth Zoom */}
      <Image
        src={image}
        alt={displayName}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      {/* Out of Stock Badge */}
      {!availableForSale && (
        <div className="absolute top-3.5 right-3.5 z-20">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase shadow-md backdrop-blur-md border border-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-red-400"></span>
            Agotado
          </span>
        </div>
      )}

      {/* Information Overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-5 pt-16 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent transition-all duration-500">
        {/* Title and Price Row - Guaranteed No Overlap */}
        <div className="flex items-center justify-between gap-3 w-full mb-3">
          {/* Title Container with Ellipsis & Marquee Banner Effect */}
          <div
            ref={containerRef}
            className="flex-1 min-w-0 overflow-hidden relative"
          >
            <h4
              ref={textRef}
              style={
                isHovered && isOverflowing
                  ? ({
                      '--marquee-distance': `${marqueeDistance}px`,
                      '--marquee-duration': `${marqueeDuration}s`,
                    } as React.CSSProperties)
                  : undefined
              }
              className={`font-display text-sm sm:text-[15px] font-semibold text-white tracking-wide drop-shadow-md transition-all ${
                isHovered && isOverflowing
                  ? 'whitespace-nowrap inline-block animate-marquee-banner'
                  : 'truncate block w-full'
              }`}
              title={displayName}
            >
              {displayName}
            </h4>
          </div>

          {/* Price Component - Fixed & Never Crowded */}
          <div className="shrink-0 text-right whitespace-nowrap pl-1">
            <span className="text-sm sm:text-[15px] font-bold text-accent-gold drop-shadow-md">
              $
              {price.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* View Product CTA Button */}
        <span className="w-full block text-center rounded-lg bg-white/95 py-2.5 text-[9px] font-bold uppercase tracking-[0.25em] text-primary transition-all group-hover:bg-accent-gold group-hover:text-white shadow-md backdrop-blur-sm">
          {!availableForSale ? 'Agotado • Ver Detalles' : 'Ver Detalles'}
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
