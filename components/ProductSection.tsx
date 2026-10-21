'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { toPascalCase } from '@/lib/shopify';

interface Product {
  id: string;
  handle?: string;
  name: string;
  price: number;
  currency?: string;
  image: string;
  availableForSale?: boolean;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  categorySlug?: string;
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products, categorySlug }) => {
  const displayTitle = toPascalCase(title);

  return (
    <section className="mb-20 relative">
      {/* Sticky Section Header with Purple Glassmorphic Blur positioned under minified filter bar */}
      <div className="sticky top-[128px] lg:top-[124px] z-30 mb-8 py-3.5 px-6 rounded-2xl bg-[#6B4E71]/[0.09] backdrop-blur-md border border-[#6B4E71]/15 shadow-sm flex items-center justify-between transition-all">
        <div className="flex items-center gap-3 shrink-0">
          <span className="h-2 w-2 rounded-full bg-accent-gold shadow-xs"></span>
          <h3 className="font-display text-xl lg:text-2xl italic text-primary font-bold tracking-tight">
            {displayTitle}
          </h3>
        </div>
        <div className="flex items-center gap-4 flex-1 ml-6">
          <div className="h-px flex-1 bg-[#6B4E71]/20"></div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/60 shrink-0">
            {products.length} {products.length === 1 ? 'Diseño' : 'Diseños'}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 relative z-10">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            id={product.id}
            handle={product.handle}
            image={product.image}
            name={product.name}
            price={product.price}
            currency={product.currency}
            availableForSale={product.availableForSale}
            categorySlug={categorySlug}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;
