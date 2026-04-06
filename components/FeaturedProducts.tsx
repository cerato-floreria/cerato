"use client";

import React, { useState, useEffect } from "react";

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

  // Auto-play
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const getVisibleProducts = () => {
    const visible = [];
    for (let i = -1; i <= 1; i++) {
      const index = (currentIndex + i + products.length) % products.length;
      visible.push({ ...products[index], position: i });
    }
    return visible;
  };

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20 text-center">
        {/* Header Section */}
        <div className="mb-24 flex flex-col items-center">
          <span className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold">
            FAVORITOS DE LA TEMPORADA
          </span>
          <h3 className="font-display mb-6 text-5xl font-medium text-primary">
            Productos destacados
          </h3>
          <div className="h-[1px] w-32 bg-accent-gold/40"></div>
        </div>
        {/* Carousel Container */}
        <div className="relative flex items-center justify-center perspective-1000 group/carousel">
          {/* Nav Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 lg:left-0 z-30 h-14 w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary-dark opacity-0 group-hover/carousel:opacity-100"
          >
            <span className="material-symbols-outlined text-3xl">chevron_left</span>
          </button>
          
          <div className="flex items-center justify-center gap-4 lg:gap-10 min-h-[600px] w-full max-w-7xl overflow-visible">
            {getVisibleProducts().map((product, idx) => (
              <div 
                key={`${currentIndex}-${idx}`} 
                className={`flex flex-col items-center transition-all duration-1000 ease-in-out w-full lg:w-[380px] shrink-0 ${
                  product.position === 0 
                  ? 'scale-110 z-20 translate-y-0 opacity-100 translate-z-[100px] rotate-y-0' 
                  : product.position === -1
                  ? 'scale-[0.82] opacity-50 translate-y-12 rotate-y-[25deg] translate-x-8'
                  : 'scale-[0.82] opacity-50 translate-y-12 -rotate-y-[25deg] -translate-x-8'
                }`}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className={`relative mb-10 w-full aspect-square overflow-hidden rounded-[12px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-700 ${product.position === 0 ? 'border border-accent-gold/40' : ''}`}>
                  <div 
                    className="h-full w-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${product.image})` }}
                  ></div>
                  {product.isPopular && product.position === 0 && (
                    <div className="absolute bottom-6 left-6">
                      <span className="rounded-full bg-primary/60 backdrop-blur-md px-5 py-2.5 text-[8px] font-bold uppercase tracking-widest text-white shadow-lg border border-white/10">
                        MÁS POPULAR
                      </span>
                    </div>
                  )}
                </div>
                
                <div className={`flex flex-col items-center gap-4 transition-all duration-700 ${product.position === 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                  <h4 className="font-display text-xl text-primary tracking-tight font-medium">
                    {product.name}
                  </h4>
                  <p className="text-xl font-bold text-accent-gold">
                    {product.price}
                  </p>
                </div>

              </div>
            ))}

          </div>

          <button 
            onClick={nextSlide}
            className="absolute right-4 lg:right-0 z-30 h-14 w-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 text-primary-dark opacity-0 group-hover/carousel:opacity-100"
          >
            <span className="material-symbols-outlined text-3xl">chevron_right</span>
          </button>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 flex justify-center">
          <button className="group flex items-center gap-4 rounded-full bg-primary-dark/80 px-12 py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:bg-primary-dark hover:-translate-y-1">
            VER REGALOS Y MÁS
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

