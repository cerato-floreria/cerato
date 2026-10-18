'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getProductsAction } from '@/app/actions/shopify';
import { ShopifyProduct } from '@/lib/shopify/types';
import { toPascalCase } from '@/lib/shopify';
import SoldOutBadge from './SoldOutBadge';

interface HeroProps {
  initialProducts?: ShopifyProduct[];
}

const Hero: React.FC<HeroProps> = ({ initialProducts = [] }) => {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load products if not provided via props
  useEffect(() => {
    if (initialProducts.length === 0) {
      let isMounted = true;
      getProductsAction().then((fetched) => {
        if (isMounted) {
          setProducts(fetched);
        }
      });
      return () => {
        isMounted = false;
      };
    }
  }, [initialProducts]);

  // Handle filtering with real store products
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter((product) => {
        const titleMatch = product.title?.toLowerCase().includes(q);
        const tagMatch = product.tags?.some((t) =>
          t.toLowerCase().includes(q),
        );
        const catMatch = product.categories?.some((c) =>
          c.toLowerCase().includes(q),
        );
        const typeMatch = product.types?.some((t) =>
          t.toLowerCase().includes(q),
        );
        return titleMatch || tagMatch || catMatch || typeMatch;
      })
      .slice(0, 5); // Limit to top 5 suggestions
  }, [query, products]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      if (suggestions.length > 0) {
        router.push(`/producto/${suggestions[0].handle}`);
      } else {
        router.push('/categoria/flores-y-plantas');
      }
      setIsOpen(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full pb-8">
      {/* Background Image & Overlay optimized with next/image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7SQC5j2SEbPXUk-uVjoIycUIAcdLn5giMTeCvOzKcaxZaGipSYEDgUFtI87kuy6f9b7RXXzuOBPvluWIhX1yaMr08jSkZqWEgoVqgWEd4ZtBNutaXlmAIAex4WOjgX-fp5lZPGpwRJTcEB2whflMKpzxhJdk4wg8304iHUyX6VdP_tMhrOl_Cgfn2v68C3bGgHrZQ76SYejV12M9ut2nQQyOE9xVU96CsKabi79TALniCPrmEfBTpWzPFNV6KrGX54DLutPIp5Q"
          alt="Cerato Floral Arreglo de Lujo"
          fill
          priority
          fetchPriority="high"
          className="object-cover brightness-75 transition-transform duration-[10000ms] hover:scale-110"
          sizes="100vw"
        />
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto h-full max-w-[1440px] flex flex-col justify-start pt-24 pb-16 lg:pt-32 lg:pb-20 px-6 lg:px-20">
        {/* Text Section - Left Aligned */}
        <div className="max-w-4xl text-left animate-fade-in lg:mt-0">
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold text-glow lg:mb-6 lg:text-sm">
            Exclusividad en cada detalle
          </span>
          <h1 className="mb-6 font-display text-[32px] sm:text-[42px] font-light leading-[1.1] text-white md:text-6xl lg:mb-8 lg:text-[64px]">
            Arte Floral que <br />
            <span className="italic font-normal text-cream">Enamora</span>
          </h1>
          <p className="mb-8 max-w-2xl text-base font-light leading-relaxed text-white/90 md:text-lg lg:mb-12 lg:text-xl">
            Diseños premium curados por expertos para transformar sus momentos
            especiales en recuerdos inolvidables.
          </p>
        </div>

        {/* Action Row - Centered */}
        <div className="w-full mt-8 lg:mt-16 flex justify-center">
          <div className="flex flex-col gap-6 md:flex-row md:items-center justify-center">
            <Link
              href="/categoria/flores-y-plantas"
              className="group flex h-14 items-center justify-center gap-4 rounded-xl bg-primary px-8 text-[10px] font-bold tracking-[0.2em] text-white shadow-2xl transition-all duration-500 hover:bg-primary-dark hover:scale-105 md:h-16 md:px-10 md:text-xs"
            >
              EXPLORAR COLECCIÓN DE FLORES
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>

            <div
              ref={containerRef}
              className="relative flex h-14 w-full items-center rounded-xl bg-white p-1 shadow-2xl md:h-16 md:w-auto md:min-w-[450px] lg:min-w-[500px]"
            >
              <div className="flex flex-1 items-center gap-3 px-4 lg:px-6">
                <span className="material-symbols-outlined text-primary/60 text-lg lg:text-xl">
                  search
                </span>
                <input
                  className="w-full border-none bg-transparent py-2 text-xs font-medium text-charcoal placeholder:text-charcoal/30 focus:ring-0 lg:py-4 lg:text-sm"
                  placeholder='Busca: "Ramo rosas"'
                  type="text"
                  aria-label="Buscar productos florales"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(e.target.value.trim().length > 0);
                  }}
                  onFocus={() => query.length > 0 && setIsOpen(true)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                aria-label="Ejecutar búsqueda"
                className="h-full rounded-xl bg-primary px-4 text-[9px] font-bold tracking-[0.15em] text-white transition-all duration-300 hover:bg-primary-dark md:px-8 md:text-[10px] cursor-pointer"
              >
                BUSCAR
              </button>

              {/* Suggestions Dropdown */}
              {isOpen && (
                <div className="absolute top-[calc(100%+12px)] left-0 right-0 z-[100] overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] border border-primary/10 animate-in fade-in slide-in-from-top-4 duration-300">
                  {suggestions.length > 0 ? (
                    <div className="flex flex-col divide-y divide-gray-100 max-h-[380px] overflow-y-auto custom-scrollbar">
                      <div className="bg-gray-50/80 px-6 py-2.5 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/50">
                          Productos Encontrados ({suggestions.length})
                        </span>
                        <span className="text-[10px] text-accent font-medium">
                          Catálogo Cerato
                        </span>
                      </div>
                      {suggestions.map((product) => {
                        const imgUrl =
                          product.featuredImage?.url ||
                          product.images?.edges?.[0]?.node?.url ||
                          'https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=400';
                        const price = product.priceRange?.minVariantPrice
                          ?.amount
                          ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)} MXN`
                          : null;
                        const subtitle = product.types?.[0]
                          ? toPascalCase(product.types[0])
                          : product.categories?.[0]
                            ? toPascalCase(product.categories[0])
                            : 'Arreglo Floral';

                        return (
                          <Link
                            key={product.id}
                            href={`/producto/${product.handle}`}
                            className="flex items-center gap-4 px-6 py-3.5 transition-all hover:bg-primary/5 group"
                            onClick={() => setIsOpen(false)}
                          >
                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-primary/5">
                              <Image
                                src={imgUrl}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                sizes="48px"
                              />
                            </div>
                            <div className="flex flex-col min-w-0 flex-1">
                              <span className="text-sm font-display font-medium text-primary group-hover:text-accent transition-colors truncate">
                                {toPascalCase(product.title)}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-sans text-charcoal/50 uppercase tracking-wider">
                                  {subtitle}
                                </span>
                                {price && (
                                  <>
                                    <span className="text-[10px] text-charcoal/30">
                                      •
                                    </span>
                                    <span className="text-[11px] font-bold text-accent-gold">
                                      {price}
                                    </span>
                                  </>
                                )}
                                {!product.availableForSale && (
                                  <SoldOutBadge size="sm" className="ml-1" />
                                )}
                              </div>
                            </div>
                            <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100 shrink-0">
                              <span className="material-symbols-outlined text-primary/40 text-lg">
                                arrow_forward
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-8 py-10 text-center">
                      <span className="material-symbols-outlined text-3xl text-primary/20 mb-2">
                        search_off
                      </span>
                      <p className="text-sm font-display italic text-primary/60">
                        No encontramos resultados para &ldquo;{query}&rdquo;
                      </p>
                      <p className="text-xs text-charcoal/40 mt-1">
                        Prueba buscando por nombre o tipo de flor (rosas,
                        gerberas, tulipanes...)
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator - Hidden on mobile for cleaner look */}
      <div className="absolute bottom-10 left-1/2 -content -translate-x-1/2 hidden lg:block animate-bounce opacity-50">
        <span className="material-symbols-outlined text-white text-3xl">
          expand_more
        </span>
      </div>
    </section>
  );
};

export default Hero;
