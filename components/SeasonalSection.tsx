'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SeasonalCollectionData, ShopifyProduct } from '@/lib/shopify/types';
import { toPascalCase } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';

interface SeasonalSectionProps {
  collection: SeasonalCollectionData | null;
}

const SeasonalSection: React.FC<SeasonalSectionProps> = ({ collection }) => {
  const { addItem, isLoading } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Strictly render only if the seasonal collection is active and has products
  if (!collection || !collection.products || collection.products.length === 0) {
    return null;
  }

  const rawSeason = collection.seasonName || 'Temporada';
  const formattedSeason = toPascalCase(rawSeason);

  const handleQuickAdd = async (
    e: React.MouseEvent,
    product: ShopifyProduct,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const variantId = product.variants?.edges?.[0]?.node?.id || product.id;
    setAddingId(product.id);
    try {
      await addItem(variantId, 1);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#FAF8F5] py-20 lg:py-28 border-y border-primary/5">
      {/* Decorative ambient gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-accent/5 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 w-[500px] h-[300px] bg-accent-gold/5 rounded-full blur-[100px]" />

      <div className="relative mx-auto max-w-[1440px] px-6 lg:px-20">
        {/* Header Section with Catchy Seasonal Title */}
        <div className="mb-14 lg:mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 px-5 py-2">
            <span className="text-sm">✨</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
              Colección Especial • Edición Limitada
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-[56px] font-medium leading-[1.15] text-primary max-w-4xl">
            Especial de{' '}
            <span className="italic font-normal text-accent-gold">
              {formattedSeason}
            </span>
          </h2>

          {collection.description && (
            <p className="mt-4 max-w-2xl text-base sm:text-lg font-light leading-relaxed text-charcoal/75">
              {collection.description}
            </p>
          )}

          <div className="mt-6 h-[1px] w-28 bg-gradient-to-r from-transparent via-accent-gold to-transparent" />
        </div>

        {/* Seasonal Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {collection.products.map((product) => {
            const imageUrl =
              product.featuredImage?.url ||
              product.images?.edges?.[0]?.node?.url ||
              'https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=600';
            const price = product.priceRange?.minVariantPrice?.amount
              ? `$${parseFloat(
                  product.priceRange.minVariantPrice.amount,
                ).toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })} ${product.priceRange.minVariantPrice.currencyCode || 'MXN'}`
              : '$0.00 MXN';

            const productSubtitle = product.types?.[0]
              ? toPascalCase(product.types[0])
              : product.categories?.[0]
                ? toPascalCase(product.categories[0])
                : 'Edición Temporada';

            const isItemAdding = addingId === product.id && isLoading;

            return (
              <div
                key={product.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-primary/10 shadow-lg hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-1.5"
              >
                {/* Product Image Container */}
                <Link
                  href={`/producto/${product.handle}`}
                  className="relative aspect-square w-full overflow-hidden bg-cream block cursor-pointer"
                >
                  <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />

                  {/* Seasonal Badge with pulsing live dot */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary/80 backdrop-blur-md border border-white/10 px-3 py-1 text-[9px] font-bold tracking-widest text-accent-gold uppercase shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold" />
                      </span>
                      {formattedSeason}
                    </span>
                  </div>

                  {/* Out of stock badge if not available */}
                  {!product.availableForSale && (
                    <div className="absolute top-3.5 right-3.5 z-10">
                      <span className="inline-flex items-center rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[8px] font-bold tracking-wider text-white uppercase">
                        Agotado
                      </span>
                    </div>
                  )}
                </Link>

                {/* Product Info */}
                <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between gap-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal/50">
                      {productSubtitle}
                    </span>
                    <Link
                      href={`/producto/${product.handle}`}
                      className="font-display text-lg font-medium text-primary group-hover:text-accent transition-colors line-clamp-1"
                      title={toPascalCase(product.title)}
                    >
                      {toPascalCase(product.title)}
                    </Link>
                    <p className="text-base font-bold text-accent-gold mt-1">
                      {price}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-primary/5">
                    <Link
                      href={`/producto/${product.handle}`}
                      className="flex-1 rounded-xl border border-primary/15 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-primary transition-all hover:bg-primary hover:text-white"
                    >
                      Ver Detalle
                    </Link>
                    <button
                      onClick={(e) => handleQuickAdd(e, product)}
                      disabled={isItemAdding || !product.availableForSale}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white transition-all hover:bg-accent-gold hover:text-primary shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      aria-label={
                        product.availableForSale
                          ? 'Agregar al carrito'
                          : 'Producto agotado'
                      }
                      title={
                        product.availableForSale
                          ? 'Agregar al carrito'
                          : 'Producto agotado'
                      }
                    >
                      <span className="material-symbols-outlined text-lg">
                        {isItemAdding ? 'sync' : 'shopping_bag'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA commented because it is not needed for now and theres no page or functionality to redirect to */}
        {/* <div className="mt-14 flex justify-center">
          <Link
            href="/categoria/flores-y-plantas"
            className="group inline-flex items-center gap-4 rounded-xl bg-primary px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-300 hover:bg-primary-dark hover:scale-105"
          >
            EXPLORAR TODO EN {formattedSeason.toUpperCase()}
            <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </div> */}
      </div>
    </section>
  );
};

export default SeasonalSection;
