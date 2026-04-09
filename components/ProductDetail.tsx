"use client";

import React, { useState } from "react";
import Image from "next/image";
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
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const increment = () => setQuantity((q: number) => q + 1);
  const decrement = () => setQuantity((q: number) => (q > 1 ? q - 1 : 1));

  // Handle ESC key and scroll lock
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomedImage(null);
    };
    if (zoomedImage) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [zoomedImage]);

  // Use up to 4 images
  const displayImages = product.images.slice(0, 4);
  // Fill if less than 4
  while (displayImages.length < 4) {
    displayImages.push("https://images.unsplash.com/photo-1519340333755-5072120ef3aa"); 
  }

  return (
    <main className="bg-background-light pt-28 pb-16 mb-6 lg:pt-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-24">

          
          {/* Left Section: Breadcrumbs & Image Grid */}
          <div className="w-full lg:w-[55%]">
            {/* Breadcrumbs */}
            <nav className="mb-4 flex items-center gap-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
              <Link className="transition-colors hover:text-primary" href="/">Inicio</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <Link className="transition-colors hover:text-primary" href="/flores">{product.category || "Arreglos"}</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="font-bold text-primary/70">{product.name}</span>
            </nav>

            {/* 4-Image Grid */}
            <div className="grid grid-cols-2 gap-4 lg:gap-6">
              {displayImages.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setZoomedImage(img)}
                  className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 shadow-sm transition-all duration-700 hover:shadow-xl cursor-zoom-in"
                >
                  <Image
                    src={img}
                    alt={`${product.name} vista ${idx + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white opacity-0 transition-opacity group-hover:opacity-100 text-3xl">fullscreen</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Product Info */}
          <div className="flex flex-col justify-center py-12 w-full lg:w-[45%]">
            <div className="max-w-md">
              {/* Tag */}
              <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
                {product.tag || "Edición Limitada"}
              </span>

              {/* Title */}
              <h1 className="font-display mb-4 font-semibold leading-[1.1] text-primary text-3xl sm:text-4xl md:text-5xl lg:mb-8 lg:text-6xl">
                {product.name}
              </h1>


              {/* Price */}
              <p className="font-display mb-8 flex items-baseline gap-2 text-2xl font-medium text-primary sm:text-3xl lg:mb-12">
                {typeof product.price === 'number' ? `$${product.price.toLocaleString()}` : product.price}
                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {product.currency}
                </span>
              </p>


              {/* Descriptions */}
              <div className="mb-10 lg:mb-16 space-y-10">
                <p className="font-display text-lg italic leading-relaxed text-primary sm:text-xl lg:text-2xl">
                  "{product.description}"
                </p>

                <div className="h-[1px] w-20 bg-accent-gold/30"></div>
                <p className="max-w-sm text-sm leading-relaxed text-gray-600 font-medium">
                  {product.longDescription}
                </p>
              </div>

              {/* Actions: Quantity & CTA */}
              <div className="flex items-center gap-6 pt-4">
                {/* Quantity Manager */}
                <div className="flex h-16 items-center overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <button 
                    onClick={decrement}
                    className="flex h-full w-12 items-center justify-center text-primary transition-colors hover:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-sm">remove</span>
                  </button>
                  <span className="font-display flex h-full w-12 items-center justify-center text-lg font-bold text-primary">
                    {quantity}
                  </span>
                  <button 
                    onClick={increment}
                    className="flex h-full w-12 items-center justify-center text-primary transition-colors hover:bg-gray-50"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                </div>

                <button className="bg-accent flex h-16 flex-1 items-center justify-center gap-2 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-lg shadow-accent/40 transition-all hover:opacity-90 active:scale-95">
                  <span className="material-symbols-outlined text-lg p-2">shopping_cart</span>
                  Añadir al Carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal (Lightbox) */}
      <div 
        className={`fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-500 ${zoomedImage ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={() => setZoomedImage(null)}
      >
        {/* Close Button */}
        <button 
          className="absolute right-6 top-6 z-[210] flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-all hover:bg-red-700 hover:scale-110 active:scale-95 cursor-pointer"
          onClick={() => setZoomedImage(null)}
        >
          <span className="material-symbols-outlined text-2xl font-bold">close</span>
        </button>

        {/* Modal Image Container */}
        <div 
          className="relative h-[85vh] w-[90vw] overflow-hidden rounded-xl bg-white/5 transition-all duration-500 transform"
          onClick={(e) => e.stopPropagation()}
        >
          {zoomedImage && (
            <Image
              src={zoomedImage}
              alt="Producto ampliado"
              fill
              className={`object-contain rounded-xl transition-all duration-700 ${zoomedImage ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
              sizes="90vw"
              priority
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
