'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toPascalCase, slugifyCategory } from '@/lib/shopify';
import SoldOutBadge from './SoldOutBadge';

export interface ProductVariantItem {
  id: string;
  title: string;
  price: number;
  currency: string;
  availableForSale: boolean;
  image: string | null;
}

interface ProductDetailProps {
  product: {
    id?: string;
    handle?: string;
    variantId?: string;
    name: string;
    price: number | string;
    currency: string;
    category: string;
    categories?: string[];
    fromCategorySlug?: string;
    tag?: string;
    description: string;
    longDescription?: string;
    availableForSale?: boolean;
    images: string[];
    variants?: ProductVariantItem[];
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const initialVariantId =
    product.variants?.[0]?.id || product.variantId || product.id || '';
  const [selectedVariantId, setSelectedVariantId] =
    useState<string>(initialVariantId);
  const [quantity, setQuantity] = useState(1);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const { addItem, isLoading } = useCart();

  // Find active variant if available
  const activeVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    return (
      product.variants.find((v) => v.id === selectedVariantId) ||
      product.variants[0]
    );
  }, [product.variants, selectedVariantId]);

  const currentPrice = activeVariant ? activeVariant.price : product.price;
  const currentCurrency = activeVariant ? activeVariant.currency : product.currency;
  const isAvailable = activeVariant
    ? activeVariant.availableForSale
    : product.availableForSale !== false;

  const hasMultipleVariants = useMemo(() => {
    if (!product.variants || product.variants.length <= 1) return false;
    if (
      product.variants.length === 1 &&
      (product.variants[0].title.toLowerCase() === 'default title' ||
        product.variants[0].title.toLowerCase() === 'default')
    ) {
      return false;
    }
    return true;
  }, [product.variants]);

  const searchParams = useSearchParams();
  const fromParam =
    searchParams.get('from') ||
    searchParams.get('cat') ||
    product.fromCategorySlug;

  const resolvedCategory = useMemo(() => {
    if (fromParam) {
      const decodedFrom = decodeURIComponent(fromParam).toLowerCase().trim();
      // Match against product.categories if available
      if (product.categories && product.categories.length > 0) {
        const found = product.categories.find(
          (c) => slugifyCategory(c) === decodedFrom
        );
        if (found) return found;
      }
      // If product.category matches
      if (product.category && slugifyCategory(product.category) === decodedFrom) {
        return product.category;
      }
      // Friendly mappings for category slugs
      if (decodedFrom === 'que-quieres-decir') return '¿Qué quieres decir?';
      if (decodedFrom === 'flores-y-plantas') return 'Flores y Plantas';
      if (decodedFrom === 'ocasiones') return 'Ocasiones';
    }
    return product.category || 'Flores y Plantas';
  }, [fromParam, product.categories, product.category]);

  const displayName = useMemo(() => toPascalCase(product.name), [product.name]);
  const displayCategory = useMemo(
    () => toPascalCase(resolvedCategory),
    [resolvedCategory],
  );

  const categorySlug = useMemo(() => {
    if (fromParam) {
      return decodeURIComponent(fromParam).toLowerCase().trim();
    }
    const slug = slugifyCategory(resolvedCategory);
    if (!slug || slug === 'coleccion-cerato') {
      return 'flores-y-plantas';
    }
    return slug;
  }, [fromParam, resolvedCategory]);

  const catalogUrl = `/categoria/${categorySlug}`;

  // Split description at the first period:
  // Part 1 -> Main italic quote (first sentence)
  // Part 2 (and subsequent text) -> secondaryDescription
  const { primaryDescription, secondaryDescription } = useMemo(() => {
    const fullText = (product.description || product.longDescription || '').trim();
    if (!fullText) {
      return { primaryDescription: '', secondaryDescription: '' };
    }

    const firstDotIndex = fullText.indexOf('.');
    if (firstDotIndex !== -1) {
      const primary = fullText.slice(0, firstDotIndex + 1).trim();
      const secondary = fullText.slice(firstDotIndex + 1).trim();
      return {
        primaryDescription: primary.replace(/^["']|["']$/g, ''),
        secondaryDescription: secondary,
      };
    }

    return {
      primaryDescription: fullText.replace(/^["']|["']$/g, ''),
      secondaryDescription: '',
    };
  }, [product.description, product.longDescription]);

  const increment = () => {
    if (!isAvailable) return;
    setQuantity((q: number) => q + 1);
  };
  const decrement = () => {
    if (!isAvailable) return;
    setQuantity((q: number) => (q > 1 ? q - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;
    const targetVariantId =
      activeVariant?.id ||
      product.variantId ||
      product.id ||
      'gid://shopify/ProductVariant/101';
    addItem(targetVariantId, quantity);
  };

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomedImage(null);
    };
    if (zoomedImage) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [zoomedImage]);

  const activeVariantImage = activeVariant?.image;

  // Display only real available distinct images, placing the active variant's image at the top if selected
  const displayImages = useMemo(() => {
    const baseImages =
      product.images && product.images.length > 0
        ? product.images
        : ['https://images.unsplash.com/photo-1519340333755-5072120ef3aa'];

    if (activeVariantImage) {
      const withoutVariantImg = baseImages.filter(
        (img) => img !== activeVariantImage,
      );
      return [activeVariantImage, ...withoutVariantImg];
    }
    return baseImages;
  }, [product.images, activeVariantImage]);

  return (
    <div className="bg-background-light pt-28 pb-16 mb-6 lg:pt-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        {/* Top Navigation Bar: Back to Catalog Button & Clickable Breadcrumbs */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-primary/5">
          <Link
            href={catalogUrl}
            className="group inline-flex items-center gap-2 rounded-xl border border-primary/10 bg-white/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-primary shadow-xs backdrop-blur-sm transition-all hover:border-accent-gold hover:bg-white hover:text-accent-gold hover:shadow-md active:scale-95 cursor-pointer"
            aria-label={`Regresar al catálogo de ${displayCategory}`}
          >
            <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span>Volver al Catálogo</span>
          </Link>

          {/* Clickable Breadcrumbs */}
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-gray-500"
          >
            <Link
              className="transition-colors hover:text-primary hover:underline underline-offset-2"
              href="/"
            >
              Inicio
            </Link>
            <span className="material-symbols-outlined text-[13px] text-gray-400">
              chevron_right
            </span>
            <Link
              href={catalogUrl}
              className="transition-colors hover:text-primary hover:underline underline-offset-2 font-medium"
              title={`Ver catálogo de ${displayCategory}`}
            >
              {displayCategory}
            </Link>
            <span className="material-symbols-outlined text-[13px] text-gray-400">
              chevron_right
            </span>
            <span className="font-bold text-primary truncate max-w-[150px] sm:max-w-[260px] md:max-w-none">
              {displayName}
            </span>
          </nav>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-20 items-start">
          {/* Left Section: Dynamic Image Gallery */}
          <div className="w-full lg:w-[55%] lg:sticky lg:top-28">

            {/* Dynamic Gallery: Adaptive for 1 image or multiple images */}
            {displayImages.length === 1 ? (
              <div className="w-full">
                <div
                  onClick={() => setZoomedImage(displayImages[0])}
                  className="group relative aspect-[4/5] max-h-[620px] w-full overflow-hidden rounded-2xl bg-gray-100 shadow-md transition-all duration-700 hover:shadow-2xl cursor-zoom-in border border-primary/5"
                >
                  <Image
                    src={displayImages[0]}
                    alt={`${displayName} vista principal`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white opacity-0 transition-opacity group-hover:opacity-100 text-3xl">
                      fullscreen
                    </span>
                  </div>
                  {!isAvailable && (
                    <div className="absolute top-4 right-4 z-10">
                      <SoldOutBadge />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                {displayImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setZoomedImage(img)}
                    className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-700 hover:shadow-xl cursor-zoom-in border border-primary/5"
                  >
                    <Image
                      src={img}
                      alt={`${displayName} vista ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, 25vw"
                      priority={idx === 0}
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white opacity-0 transition-opacity group-hover:opacity-100 text-3xl">
                        fullscreen
                      </span>
                    </div>
                    {!isAvailable && idx === 0 && (
                      <div className="absolute top-3.5 right-3.5 z-10">
                        <SoldOutBadge />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Section: Product Info */}
          <div className="flex flex-col justify-center py-6 w-full lg:w-[45%]">
            <div className="max-w-md">
              {/* Tag & Availability Badge */}
              <div className="flex items-center gap-3 mb-6">
                <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
                  {product.tag || 'Arte Floral Cerato'}
                </span>
                {!isAvailable && <SoldOutBadge />}
              </div>

              {/* Title - PascalCase */}
              <h1 className="font-display mb-4 font-semibold leading-[1.1] text-primary text-3xl sm:text-4xl md:text-5xl lg:mb-8 lg:text-6xl">
                {displayName}
              </h1>

              {/* Price */}
              <p className="font-display mb-6 flex items-baseline gap-2 text-2xl font-medium text-primary sm:text-3xl lg:mb-8">
                {typeof currentPrice === 'number'
                  ? `$${currentPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`
                  : currentPrice}
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {currentCurrency}
                </span>
              </p>

              {/* Variant Selector */}
              {hasMultipleVariants && product.variants && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      Variante / Tamaño
                    </label>
                    {activeVariant && (
                      <span className="text-xs font-semibold text-primary">
                        {toPascalCase(activeVariant.title)}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {product.variants.map((v) => {
                      const isSelected = v.id === activeVariant?.id;
                      const variantTitle = toPascalCase(v.title);
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`group relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-primary text-white border-primary shadow-md ring-2 ring-primary/20'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-primary/50 hover:bg-gray-50/80 shadow-sm'
                          } ${!v.availableForSale ? 'opacity-60' : ''}`}
                        >
                          {v.image && (
                            <div className="relative h-6 w-6 rounded-md overflow-hidden bg-gray-100 flex-shrink-0 border border-black/10">
                              <Image
                                src={v.image}
                                alt={variantTitle}
                                fill
                                className="object-cover"
                                sizes="24px"
                              />
                            </div>
                          )}
                          <span>{variantTitle}</span>
                          {typeof v.price === 'number' && (
                            <span
                              className={`text-[10px] font-semibold ${
                                isSelected ? 'text-white/80' : 'text-gray-400'
                              }`}
                            >
                              ${v.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                            </span>
                          )}
                          {!v.availableForSale && (
                            <span className="text-[9px] font-bold uppercase tracking-wider text-red-500 ml-1">
                              (Agotado)
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Descriptions: Split at first dot */}
              {(primaryDescription || secondaryDescription) && (
                <div className="mb-10 lg:mb-16 space-y-8">
                  {primaryDescription && (
                    <p className="font-display text-lg italic leading-relaxed text-primary sm:text-xl lg:text-2xl">
                      &ldquo;{primaryDescription}&rdquo;
                    </p>
                  )}

                  {secondaryDescription && (
                    <>
                      <div className="h-[1px] w-20 bg-accent-gold/30"></div>
                      <p className="secondaryDescription max-w-sm text-sm leading-relaxed text-gray-600 font-medium whitespace-pre-line">
                        {secondaryDescription}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Actions: Quantity & CTA */}
              <div className="flex items-center gap-6 pt-4">
                <div
                  className={`flex h-16 items-center overflow-hidden rounded-xl border transition-all ${
                    !isAvailable
                      ? 'border-gray-200 bg-gray-100/80 opacity-50 cursor-not-allowed select-none'
                      : 'border-gray-200 bg-white shadow-sm'
                  }`}
                  aria-disabled={!isAvailable}
                >
                  <button
                    type="button"
                    onClick={decrement}
                    disabled={!isAvailable || quantity <= 1}
                    aria-label="Disminuir cantidad"
                    className="flex h-full w-12 items-center justify-center text-primary transition-colors hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-sm">
                      remove
                    </span>
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={isAvailable ? quantity : 0}
                    onChange={(e) => {
                      if (!isAvailable) return;
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val) && val >= 1) {
                        setQuantity(val);
                      } else if (e.target.value === '') {
                        setQuantity(1);
                      }
                    }}
                    disabled={!isAvailable}
                    aria-label="Cantidad de productos"
                    className="font-display h-full w-14 text-center text-lg font-bold text-primary bg-transparent focus:outline-none disabled:text-gray-400 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={increment}
                    disabled={!isAvailable}
                    aria-label="Aumentar cantidad"
                    className="flex h-full w-12 items-center justify-center text-primary transition-colors hover:bg-gray-50 cursor-pointer disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined text-sm">
                      add
                    </span>
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || !isAvailable}
                  className={`flex h-16 flex-1 items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all active:scale-95 disabled:opacity-50 cursor-pointer ${
                    !isAvailable
                      ? 'bg-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-accent shadow-accent/40 hover:opacity-90'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg p-2">
                    {isAvailable ? 'shopping_cart' : 'block'}
                  </span>
                  {!isAvailable
                    ? 'Agotado'
                    : isLoading
                      ? 'Añadiendo...'
                      : 'Añadir al Carrito'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal (Lightbox) */}
      <div
        className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-500 ${
          zoomedImage
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setZoomedImage(null)}
      >
        <button
          className="absolute right-6 top-6 z-[210] flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all hover:bg-red-700 hover:scale-110 active:scale-95 cursor-pointer"
          onClick={() => setZoomedImage(null)}
          aria-label="Cerrar vista ampliada"
        >
          <span className="material-symbols-outlined text-2xl font-bold">
            close
          </span>
        </button>

        <div
          className="relative h-[85vh] w-[90vw] overflow-hidden rounded-xl bg-white/5 transition-all duration-500 transform"
          onClick={(e) => e.stopPropagation()}
        >
          {zoomedImage && (
            <Image
              src={zoomedImage}
              alt={`${displayName} ampliado`}
              fill
              className={`object-contain rounded-xl transition-all duration-700 ${
                zoomedImage ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}
              sizes="90vw"
              priority
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
