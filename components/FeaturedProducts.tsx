"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const products = [
  { 
    name: "Orquídea Royal", 
    price: "$120.00", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj_zA4Eyk1BXqKaTe0IAtwHC_Sq17iazaUIfZ_wdE7cBWST0UZxIdzwec5e0lIrRRwVxIvApjqV7jidiKkY3J4-O7xEyif6UpXcn2u2bTyBXcUpTK-xhDNF23nBZGdWSaaW0Rv9XQ0AEXdeCaLwRxDK_heH9gLDt4_o3SkGRBcrvtmdb0RMnfme2YnvaKDXIvZloUa-PrDxVbGdgRu_hk3DW0HleUphzbWnvWmD3uKL0rS4DbYiWdsSpombMwQZ8IQfSGI2PYjaQ",
    isPopular: false
  },
  { 
    name: "Eternidad Silvestre", 
    price: "$95.00", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0qQvFNZ5Dus_9SmDhZIEpKZyy8omFXsqKnraqHypXtd3rFFaEGEooq4ypJzFoAILCYItWUJDb5QwqJJlCiohg0F0earIu3GOy7UqGhh0q6G8KQanyVUA4Plcz174M2YrsPFcPeaAC4YcAEOdumm7gbFCQx_qIJOKJBsP9HZyXNhu5gyueAWRHeC0qmy6a4Ox3Af1EzEzCYqjFerjCYktn19BcGZ4RzVnmFYnrty_t8sTsHvbEg8G117GHK5dgsxI4hUpsvvDfcQ",
    isPopular: true
  },
  { 
    name: "Cesta Primavera", 
    price: "$75.00", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZA3kbt-7LAy1pHXqim6_OkwIvMm-ycbis-l_o2gIhKpgaC8MkC7iS-jhFgCyAaUKLxW7FVywWF1Ijleu7GCiLM-cZcOSST3im_cPxtjPuIrA19nUJ7CYkVs2aVE5MvZwO9LyK-7I3c41AxJdrLOMvvKdgHuZ9G6z1oe_2jsYU5BlwrUjjvQk6fCj9vd5UZEvQmXztisMSNBukZFFIpgB5v9RjlTpNmX2XdulZmOLg-wqrcHw63qy6oQSL5JgMq-KzXjG0cQrJsg",
    isPopular: false
  },
  { 
    name: "Rosas de Terciopelo", 
    price: "$85.00", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAxgepMjFTHNBiD4B83cWPQ9yKeGiI2lW0WeKwFKm1TNKSg1_pUo_KuMtUJrCv7PYsLSomHIcXDIaupWvQqCIi1trVrjaCDQWLAXI2vOHgNy_TcErWXNEpc9ZY5-paFLTbvgA1azJMGGaKxA91WnAiu-8FEy99JB-Lg2yBTxbHABfCbyp4aIMFnIkU-Y_mFZ3nfJqZS9GDXMe1Al5g_YiNX5n5s8BLpQq0ZPPamesqraQLTBV8AzikpkWFDl1KgDoU0uw-GsPN4g",
    isPopular: false
  },
  { 
    name: "Brisa de Verano", 
    price: "$110.00", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw",
    isPopular: false
  }
];

const FeaturedProducts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const getPosition = (index: number) => {
    let diff = index - currentIndex;
    
    // Handle wrap-around for a circular carousel feel
    if (diff > Math.floor(products.length / 2)) diff -= products.length;
    if (diff < -Math.floor(products.length / 2)) diff += products.length;
    
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
            className="absolute left-4 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-white/40 shadow-xl backdrop-blur-md transition-all hover:bg-primary hover:text-white md:h-14 md:w-14"
            aria-label="Ver producto anterior en el carrusel"
          >

            <span className="material-symbols-outlined text-2xl lg:text-3xl">chevron_left</span>
          </button>
          
          <div className="relative flex w-full max-w-5xl items-center justify-center overflow-visible">
            {products.map((product, index) => {
              const pos = getPosition(index);
              const isActive = pos === 0;
              const isVisible = Math.abs(pos) <= 1;

              return (
                <div 
                  key={product.name} 
                  className={`absolute flex shrink-0 flex-col items-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                    isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{
                    transform: `
                      translateX(${pos * 105}%) 
                      scale(${isActive ? 1.1 : 0.85}) 
                      rotateY(${pos * -20}deg)
                      translateZ(${isActive ? 100 : 0}px)
                    `,
                    zIndex: isActive ? 30 : 20 - Math.abs(pos),
                    width: '320px'
                  }}
                >
                  <div className={`relative mb-8 w-full aspect-square overflow-hidden rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 md:mb-10 ${isActive ? 'border border-accent-gold/40' : ''}`}>
                    <Image 
                      src={product.image} 
                      alt={product.name}
                      fill
                      className="h-full w-full object-cover"
                      sizes="320px"
                    />
                    {product.isPopular && isActive && (
                      <div className="absolute bottom-6 left-6">
                        <span className="rounded-xl bg-primary/60 border border-white/10 px-4 py-2 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg backdrop-blur-md md:px-5 md:py-2.5">
                          MÁS POPULAR
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className={`flex flex-col items-center gap-2 transition-all duration-700 md:gap-4 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <h4 className="font-display text-lg font-medium tracking-tight text-primary md:text-xl">
                      {product.name}
                    </h4>
                    <p className="text-lg font-bold text-accent-gold md:text-xl">
                      {product.price}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-4 z-40 flex h-12 w-12 items-center justify-center rounded-xl bg-white/40 shadow-xl backdrop-blur-md transition-all hover:bg-primary hover:text-white md:h-14 md:w-14"
            aria-label="Ver siguiente producto en el carrusel"
          >

            <span className="material-symbols-outlined text-2xl lg:text-3xl">chevron_right</span>
          </button>
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 flex justify-center lg:mt-8">
          <Link 
            href="/regalos-y-mas"
            className="group flex items-center gap-4 rounded-xl bg-primary px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:-translate-y-1 hover:opacity-90 md:px-12 md:py-5"
          >
            VER REGALOS Y MÁS
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
