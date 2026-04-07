"use client";

import React, { useState } from "react";
import Link from "next/link";

interface ProductDetailProps {
  product: {
    name: string;
    price: number | string;
    currency: string;
    category: string;
    tag?: string;
    description: string;
    longDescription: string;
    images: string[];
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Use up to 4 images
  const displayImages = product.images.slice(0, 4);
  // Fill if less than 4
  while (displayImages.length < 4) {
    displayImages.push("https://images.unsplash.com/photo-1519340333755-5072120ef3aa"); 
  }

  return (
    <main className="bg-background-light pt-28 lg:pt-32 pb-16 mb-6">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-20">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Section: Breadcrumbs & Image Grid */}
          <div className="w-full lg:w-[55%]">
            {/* Breadcrumbs */}
            <nav className="mb-4 flex items-center gap-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              <Link className="hover:text-primary transition-colors" href="/">Inicio</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <Link className="hover:text-primary transition-colors" href="/flores">{product.category || "Arreglos"}</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-primary/70 font-bold">{product.name}</span>
            </nav>

            {/* 4-Image Grid with specific rounded corners and spacing */}
            <div className="grid grid-cols-2 gap-6">
              {displayImages.map((img, idx) => (
                <div key={idx} className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-[20px] shadow-sm transform transition-all duration-700 hover:shadow-xl">
                  <img
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                    src={img}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Product Info */}
          <div className="w-full lg:w-[45%] flex flex-col justify-center py-12">
            <div className="max-w-md">
              {/* Tag */}
              <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-gray-500 mb-6 block">
                {product.tag || "Edición Limitada"}
              </span>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-serif font-semibold mb-8 text-primary leading-[1.1]">
                {product.name}
              </h1>

              {/* Price */}
              <p className="text-3xl font-serif font-medium text-primary mb-12 flex items-baseline gap-2">
                {typeof product.price === 'number' ? `$${product.price.toLocaleString()}` : product.price}
                <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest">
                  {product.currency}
                </span>
              </p>

              {/* Descriptions */}
              <div className="space-y-10 mb-16">
                <p className="text-primary leading-relaxed font-serif text-xl italic lg:text-2xl">
                  "{product.description}"
                </p>
                <div className="h-[1px] w-20 bg-accent-gold/30"></div>
                <p className="text-gray-600 text-sm leading-relaxed max-w-sm">
                  {product.longDescription}
                </p>
              </div>

              {/* Actions: Quantity & CTA */}
              <div className="flex items-center gap-6 pt-4">
                {/* Quantity Manager */}
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden h-16 bg-white shadow-sm">
                  <button 
                    onClick={decrement}
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-primary"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="w-12 h-full flex items-center justify-center font-serif text-lg font-bold text-primary">
                    {quantity}
                  </span>
                  <button 
                    onClick={increment}
                    className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors text-primary"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>

                {/* Add to Cart Button */}
                <button className="flex-1 bg-accent text-white h-16 rounded-xl font-bold uppercase tracking-[0.2em] text-[10px] hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-accent/40">
                  <span className="material-symbols-outlined text-lg">shopping_cart</span>
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
