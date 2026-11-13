'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { toPascalCase } from '@/lib/shopify';
import SoldOutBadge from './SoldOutBadge';
import SeasonalBadge from './SeasonalBadge';
import FeaturedBadge from './FeaturedBadge';

interface ProductCardProps {
  id: string;
  handle?: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  image: string;
  availableForSale?: boolean;
  categorySlug?: string;
  seasonName?: string;
  isFeatured?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  handle,
  name,
  price,
  compareAtPrice,
  image,
  availableForSale = true,
  categorySlug,
  seasonName,
  isFeatured = false,
}) => {
  const targetSlug = handle || id;
  const displayName = useMemo(() => toPascalCase(name), [name]);
  const hasDiscount = Boolean(compareAtPrice && compareAtPrice > price);
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

  const productHref = categorySlug
    ? `/producto/${targetSlug}?from=${encodeURIComponent(categorySlug)}`
    : `/producto/${targetSlug}`;

  return (
    <Link
      href={productHref}
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
        sizes="(max-width: 1024px) 50vw, 25vw"
      />

      {/* Top Badges Container - Stacked vertically one below the previous */}
      {(seasonName || !availableForSale || hasDiscount) && (
        <div className="pointer-events-none absolute inset-x-2 top-2 sm:inset-x-3.5 sm:top-3.5 z-10 flex flex-col items-start gap-1 sm:gap-1.5">
          {seasonName && <SeasonalBadge seasonName={seasonName} />}
          {!availableForSale && <SoldOutBadge />}
          {availableForSale && hasDiscount && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-gold/90 backdrop-blur-md px-2 py-0.5 text-[7.5px] sm:text-[9px] font-bold tracking-wider text-white uppercase shadow-md border border-white/20 shrink-0">
              Oferta
            </span>
          )}
        </div>
      )}

      {/* Information Overlay */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-3 sm:p-5 pt-12 sm:pt-16 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent transition-all duration-500">
        {isFeatured && (
          <div className="flex justify-end mb-1.5">
            <FeaturedBadge size="sm" />
          </div>
        )}
        {/* Title and Price Row - Guaranteed No Overlap */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-3 w-full mb-2 sm:mb-3">
          {/* Title Container with Full Text on Mobile & Marquee Banner Effect on Desktop */}
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
              className={`font-display text-xs sm:text-[15px] font-semibold leading-snug text-white tracking-wide drop-shadow-md transition-all ${
                isHovered && isOverflowing
                  ? 'whitespace-normal break-words sm:whitespace-nowrap sm:inline-block sm:animate-marquee-banner'
                  : 'whitespace-normal break-words sm:truncate block w-full'
              }`}
              title={displayName}
            >
              {displayName}
            </h4>
          </div>

          {/* Price Component - Fixed & Never Crowded */}
          <div className="shrink-0 sm:text-right whitespace-nowrap sm:pl-1 flex sm:flex-col sm:items-end items-baseline gap-1.5 sm:gap-0">
            {hasDiscount && compareAtPrice && (
              <span className="text-[10px] sm:text-xs font-normal text-white/60 line-through decoration-white/40 tracking-tight">
                $
                {compareAtPrice.toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            )}
            <span className="text-xs sm:text-[15px] font-bold text-accent-gold drop-shadow-md">
              $
              {price.toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>

        {/* View Product CTA Button */}
        <span className="w-full block text-center rounded-lg bg-white/95 py-2 sm:py-2.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-primary transition-all group-hover:bg-accent-gold group-hover:text-white shadow-md backdrop-blur-sm">
          Ver Detalles
        </span>
      </div>
    </Link>
  );
};

export default ProductCard;
