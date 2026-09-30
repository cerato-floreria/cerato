"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { getProductsAction } from "@/app/actions/shopify";
import { buildTaxonomy } from "@/lib/shopify";
import { ShopifyProduct } from "@/lib/shopify/types";
import { useCart } from "@/context/CartContext";

const FeaturedProducts = () => {
  const [featured, setFeatured] = useState<ShopifyProduct[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addItem, isLoading } = useCart();

  useEffect(() => {
    let isMounted = true;
    getProductsAction().then((products) => {
      if (isMounted) {
        const taxonomy = buildTaxonomy(products);
        if (taxonomy.featuredProducts.length > 0) {
          setFeatured(taxonomy.featuredProducts);
        } else {
          setFeatured(products.slice(0, 5));
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  if (featured.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % featured.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + featured.length) % featured.length);
  };

  const getPosition = (index: number) => {
    let diff = index - currentIndex;
    if (diff > Math.floor(featured.length / 2)) diff -= featured.length;
    if (diff < -Math.floor(featured.length / 2)) diff += featured.length;
    return diff;
  };

  return (
    <section className="relative overflow-hidden bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 text-center lg:px-20">
        {/* Header Section */}
        <div className="mb-6 flex flex-col items-center lg:mb-8">
          <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
            FAVORITOS DE LA TEMPORADA
          </span>
          <h3 className="font-display mb-6 text-4xl font-medium text-primary lg:text-[42px]">
            Productos destacados
          </h3>
          <div className="h-[1px] w-32 bg-accent-gold/40"></div>
        </div>

        {/* Carousel Container */}
        <div className="group/carousel relative flex items-center justify-center perspective-[2000px] min-h-[500px] md:min-h-[650px]">
          {/* Nav Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-white/40 shadow-xl backdrop-blur-md transition-all hover:bg-primary hover:text-white md:h-14 md:w-14 cursor-pointer"
            aria-label="Ver producto anterior"
          >
            <span className="material-symbols-outlined text-2xl lg:text-3xl">chevron_left</span>
          </button>

          <div className="relative flex w-full max-w-5xl items-center justify-center overflow-visible">
            {featured.map((product, index) => {
              const pos = getPosition(index);
              const isActive = pos === 0;
              const isVisible = Math.abs(pos) <= 1;

              const variantId = product.variants?.edges[0]?.node?.id || product.id;
              const price = product.priceRange?.minVariantPrice?.amount
                ? `$${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)} ${product.priceRange.minVariantPrice.currencyCode}`
                : "$0.00 MXN";
              const imageUrl =
                product.featuredImage?.url ||
                "https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=400";

              return (
                <div
                  key={product.id}
                  className={`absolute flex shrink-0 flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                  style={{
                    transform: `
                      translateX(${pos * 105}%) 
                      scale(${isActive ? 1.1 : 0.85}) 
                      rotateY(${pos * -20}deg)
                      translateZ(${isActive ? 100 : 0}px)
                    `,
                    zIndex: isActive ? 30 : 20 - Math.abs(pos),
                    width: "320px"
                  }}
                >
                  <div
                    className={`relative mb-8 w-full aspect-square overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 md:mb-10 ${
                      isActive ? "border border-accent-gold/40" : ""
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      fill
                      priority={isActive}
                      className="h-full w-full object-cover"
                      sizes="320px"
                    />
                    {isActive && (
                      <div className="absolute bottom-6 left-6">
                        <span className="rounded-xl bg-primary/60 border border-white/10 px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-md md:px-5 md:py-2.5">
                          DESTACADO CERATO
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex flex-col items-center gap-2 transition-all duration-700 md:gap-4 ${
                      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                    }`}
                  >
                    <Link
                      href={`/producto/${product.handle}`}
                      className="font-display text-lg font-medium tracking-tight text-primary hover:text-accent-gold transition-colors md:text-xl"
                    >
                      {product.title}
                    </Link>
                    <p className="text-lg font-bold text-accent-gold md:text-xl">{price}</p>
                    {isActive && (
                      <button
                        onClick={() => addItem(variantId, 1)}
                        disabled={isLoading}
                        className="mt-2 rounded-lg bg-primary px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-white shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? "AÑADIENDO..." : "AGREGAR AL CARRITO"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-4 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-white/40 shadow-xl backdrop-blur-md transition-all hover:bg-primary hover:text-white md:h-14 md:w-14 cursor-pointer"
            aria-label="Ver siguiente producto"
          >
            <span className="material-symbols-outlined text-2xl lg:text-3xl">chevron_right</span>
          </button>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 flex justify-center lg:mt-8">
          <Link
            href="/flores"
            className="group flex items-center gap-4 rounded-xl bg-primary px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:-translate-y-1 hover:opacity-90 md:px-12 md:py-5"
          >
            VER COLECCIÓN COMPLETA
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
