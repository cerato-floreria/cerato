'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CategorySubItem } from '@/lib/shopify/types';
import { toPascalCase } from '@/lib/shopify';

interface MosaicGalleryProps {
  subcategories?: CategorySubItem[];
}

// 9 mosaic items matching the exact 9-slot asymmetric grid layout
// 9 mosaic items matching the exact 9-slot asymmetric grid layout
const DEFAULT_ITEMS = [
  {
    name: 'Felicidades',
    image: '/Felicidades.jpg',
    link: '/categoria/que-quieres-decir?subtipo=Felicidades',
  },
  {
    name: 'Porque Sí',
    image: '/Porque_si.png',
    link: '/categoria/que-quieres-decir?subtipo=Porque+S%C3%AD',
  },
  {
    name: 'Te Amo',
    image: '/Te_amo.png',
    link: '/categoria/que-quieres-decir?subtipo=Te+Amo',
  },
  {
    name: 'Feliz Aniversario',
    image: '/Feliz_aniversario.jpg',
    link: '/categoria/que-quieres-decir?subtipo=Feliz+Aniversario',
  },
  {
    name: 'Mejórate Pronto',
    image: '/Mejorate.png',
    link: '/categoria/que-quieres-decir?subtipo=Mej%C3%B3rate+Pronto',
  },
  {
    name: 'Te Acompaño',
    image: '/Te_acompano.png',
    link: '/categoria/que-quieres-decir?subtipo=Te+Acompa%C3%B1o',
  },
  {
    name: 'Gracias',
    image: '/Gracias.png',
    link: '/categoria/que-quieres-decir?subtipo=Gracias',
  },
  {
    name: 'Bienvenido Al Mundo',
    image: '/Bienvenido_al_mundo.jpg',
    link: '/categoria/que-quieres-decir?subtipo=Bienvenido+Al+Mundo',
  },
  {
    name: 'Ver Todo',
    image: '/Ver_todo.jpg',
    link: '/categoria/que-quieres-decir',
  },
];

// Responsive layout spans:
// - On mobile (< 768px): 2-column grid showing ALL 9 items (4 rows of 2 squares, + 1 wide bottom banner)
// - On tablet (md: 768px - 1279px): 3-column grid showing 3x3 squares
// - On desktop (xl: >= 1280px): the exact asymmetric mosaic (3 columns with tall and wide cards)
const MOSAIC_CLASSES = [
  'col-span-1 aspect-square xl:row-span-1',
  'col-span-1 aspect-square xl:row-span-1',
  'col-span-1 aspect-square xl:row-span-1',
  'col-span-1 aspect-square xl:col-span-2 xl:row-span-1 xl:aspect-[2/1]',
  'col-span-1 aspect-square xl:col-span-1 xl:row-span-2 xl:aspect-[1/2]',
  'col-span-1 aspect-square xl:row-span-1',
  'col-span-1 aspect-square xl:row-span-1',
  'col-span-1 aspect-square xl:row-span-1',
  'col-span-2 aspect-[2/1] md:col-span-1 md:aspect-square xl:col-span-2 xl:row-span-1 xl:aspect-[2/1]',
];

const MosaicGallery: React.FC<MosaicGalleryProps> = ({
  subcategories = [],
}) => {
  // Build items from dynamic subcategories with curated fallback
  const items = React.useMemo(() => {
    if (subcategories && subcategories.length > 0) {
      const dynamicList = subcategories.map((sub) => {
        const productWithImage = sub.products.find(
          (p) => p.featuredImage?.url || p.images?.edges?.[0]?.node?.url,
        );
        const fallbackMatch = DEFAULT_ITEMS.find(
          (d) => d.name.toLowerCase() === sub.type.toLowerCase(),
        );
        const img =
          fallbackMatch?.image ||
          productWithImage?.featuredImage?.url ||
          productWithImage?.images?.edges?.[0]?.node?.url ||
          'https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=600';

        return {
          name: sub.type,
          image: img,
          link: `/categoria/que-quieres-decir?subtipo=${encodeURIComponent(sub.type)}`,
        };
      });

      // Fill up to 9 items if subcategories is less than 9 to strictly preserve layout
      while (dynamicList.length < 9) {
        const nextDefault = DEFAULT_ITEMS[dynamicList.length];
        if (nextDefault) {
          dynamicList.push(nextDefault);
        } else {
          break;
        }
      }
      return dynamicList.slice(0, 9);
    }
    return DEFAULT_ITEMS;
  }, [subcategories]);

  return (
    <section className="purple-gradient-bg relative overflow-hidden py-16 lg:py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="flex flex-col items-center gap-12 sm:gap-16 xl:flex-row xl:gap-24">
          {/* Header Area */}
          <div className="flex w-full flex-col items-center text-center space-y-6 xl:w-2/5 xl:items-start xl:text-left xl:pr-20">
            <h2 className="font-display text-4xl font-bold leading-tight text-primary md:text-5xl lg:text-[56px]">
              ¿Qué quieres <br className="hidden lg:block" />{' '}
              <span className="text-accent-gold">decir?</span>
            </h2>
            <p className="w-full text-base leading-relaxed text-charcoal/70 lg:text-lg">
              Encuentra las flores perfectas para cada ocasión.
            </p>
            <div className="pt-2 lg:pt-4">
              <Link
                href="/categoria/que-quieres-decir"
                className="group flex items-center gap-4 rounded-full bg-primary px-8 py-4 text-[10px] font-bold tracking-[0.2em] text-white shadow-xl transition-all hover:bg-primary-dark hover:-translate-y-1 lg:px-10 lg:py-5 lg:text-xs cursor-pointer"
              >
                VER CATÁLOGO DE OCASIONES
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                  shopping_cart
                </span>
              </Link>
            </div>
          </div>

          {/* Asymmetric Mosaic Grid Area showing all photos across mobile and desktop */}
          <div className="w-full xl:w-3/5 mx-auto max-w-4xl xl:max-w-none">
            <div className="asymmetric-mosaic">
              {items.map((sub, idx) => {
                const displayName = toPascalCase(sub.name);
                const spanClass =
                  MOSAIC_CLASSES[idx] || 'col-span-1 aspect-square';

                return (
                  <Link
                    key={`${sub.name}-${idx}`}
                    href={sub.link}
                    className={`group relative block cursor-pointer overflow-hidden rounded-xl bg-cream shadow-md transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${spanClass}`}
                    title={`Ver arreglos para ${displayName}`}
                  >
                    {/* Background Image: blur effect completely disappears on hover */}
                    <Image
                      src={sub.image}
                      alt={displayName}
                      fill
                      className="mosaic-card-image h-full w-full object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1280px) 50vw, 33vw"
                    />

                    {/* Darkening Overlay: becomes clear on hover */}
                    <div className="mosaic-card-overlay absolute inset-0" />

                    {/* Centered Subcategory Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-3 sm:p-4 text-center z-10 pointer-events-none">
                      <span className="font-display text-xs sm:text-sm lg:text-base xl:text-lg font-bold uppercase tracking-wider text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] transition-all duration-300 group-hover:scale-105 group-hover:text-accent-gold">
                        {displayName}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-sans font-semibold uppercase tracking-[0.2em] text-white/95 mt-1 sm:mt-1.5 opacity-0 transition-all duration-300 group-hover:opacity-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        Explorar →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MosaicGallery;
