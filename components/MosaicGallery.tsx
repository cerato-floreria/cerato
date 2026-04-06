"use client";

import React from "react";

const MosaicGallery = () => {
  const images = [
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw", alt: "Floral Arrangement 1", span: "col-span-1 row-span-1 aspect-square" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAE3wTrCDgFop23cBenSXDz1C1rzyZ0ANix675D704dcbhYQZWepyQg4N1EeVZSifAwQA1-DbNn6A3vWoPUDQJBhsIkkI0_A0SbgoHm7ozgieKLFgNCfPRX64dxnDJ0Hh5b-VuX4NPTzF8WrTixexllWIdbMP9p7NPRFNWrfYheWMI2JPZJrbZBuBpzXyrEZl_QJku5QXRbfirOT78S9q2DBtqVPhrdMC2tOf7CLO7YdvVFuqNCeb0sOKqexnFXELYz09oihP4UkQ", alt: "Celebration Moment 1", span: "col-span-1 row-span-1 aspect-square" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAxgepMjFTHNBiD4B83cWPQ9yKeGiI2lW0WeKwFKm1TNKSg1_pUo_KuMtUJrCv7PYsLSomHIcXDIaupWvQqCIi1trVrjaCDQWLAXI2vOHgNy_TcErWXNEpc9ZY5-paFLTbvgA1azJMGGaKxA91WnAiu-8FEy99JB-Lg2yBTxbHABfCbyp4aIMFnIkU-Y_mFZ3nfJqZS9GDXMe1Al5g_YiNX5n5s8BLpQq0ZPPamesqraQLTBV8AzikpkWFDl1KgDoU0uw-GsPN4g", alt: "Indoor Plant 1", span: "col-span-1 row-span-1 aspect-square" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAj_zA4Eyk1BXqKaTe0IAtwHC_Sq17iazaUIfZ_wdE7cBWST0UZxIdzwec5e0lIrRRwVxIvApjqV7jidiKkY3J4-O7xEyif6UpXcn2u2bTyBXcUpTK-xhDNF23nBZGdWSaaW0Rv9XQ0AEXdeCaLwRxDK_heH9gLDt4_o3SkGRBcrvtmdb0RMnfme2YnvaKDXIvZloUa-PrDxVbGdgRu_hk3DW0HleUphzbWnvWmD3uKL0rS4DbYiWdsSpombMwQZ8IQfSGI2PYjaQ", alt: "Gift Balloons 1", span: "col-span-2 row-span-1 aspect-[2/1]" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAxgepMjFTHNBiD4B83cWPQ9yKeGiI2lW0WeKwFKm1TNKSg1_pUo_KuMtUJrCv7PYsLSomHIcXDIaupWvQqCIi1trVrjaCDQWLAXI2vOHgNy_TcErWXNEpc9ZY5-paFLTbvgA1azJMGGaKxA91WnAiu-8FEy99JB-Lg2yBTxbHABfCbyp4aIMFnIkU-Y_mFZ3nfJqZS9GDXMe1Al5g_YiNX5n5s8BLpQq0ZPPamesqraQLTBV8AzikpkWFDl1KgDoU0uw-GsPN4g", alt: "Premium Floral Detail", span: "col-span-1 row-span-2 aspect-[1/2]" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuABiaQg9QMnR84NVTwB6ItZE4bZrhMUI5OYIc9U8joLhoRMW1mPz0OBcEHFHGtqnhIjIMhDlrtmmll7rZyCPLB11K1gWEwVis1w69g6rJ7_bRjbod9dvZpq_wq_lYerxRpv6L1uVnoPggGUuSdOk8_17EJFENtQLYvEVGemX7kYHPmpHq-bSxhCxD1NZYDh62mKSij8aeG1E7BmL22LGODFLPNOQG8x32aQP9orXWxel0JLj53imqFJYMMb3mCNJ7nR207IIvagkw", alt: "Celebration Detail", span: "col-span-1 row-span-1 aspect-square" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0qQvFNZ5Dus_9SmDhZIEpKZyy8omFXsqKnraqHypXtd3rFFaEGEooq4ypJzFoAILCYItWUJDb5QwqJJlCiohg0F0earIu3GOy7UqGhh0q6G8KQanyVUA4Plcz174M2YrsPFcPeaAC4YcAEOdumm7gbFCQx_qIJOKJBsP9HZyXNhu5gyueAWRHeC0qmy6a4Ox3Af1EzEzCYqjFerjCYktn19BcGZ4RzVnmFYnrty_t8sTsHvbEg8G117GHK5dgsxI4hUpsvvDfcQ", alt: "Floral Gift", span: "col-span-1 row-span-1 aspect-square" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBZA3kbt-7LAy1pHXqim6_OkwIvMm-ycbis-l_o2gIhKpgaC8MkC7iS-jhFgCyAaUKLxW7FVywWF1Ijleu7GCiLM-cZcOSST3im_cPxtjPuIrA19nUJ7CYkVs2aVE5MvZwO9LyK-7I3c41AxJdrLOMvvKdgHuZ9G6z1oe_2jsYU5BlwrUjjvQk6fCj9vd5UZEvQmXztisMSNBukZFFIpgB5v9RjlTpNmX2XdulZmOLg-wqrcHw63qy6oQSL5JgMq-KzXjG0cQrJsg", alt: "Indoor Plant 2", span: "col-span-1 row-span-1 aspect-square" },
    { src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw", alt: "Balloons and Flowers", span: "col-span-2 row-span-1 aspect-[2/1]" },
  ];

  return (
    <section className="purple-gradient-bg relative overflow-hidden py-24 lg:py-40">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="flex flex-col items-center gap-20 lg:flex-row">
          {/* Header Area */}
          <div className="w-full space-y-8 lg:w-2/5 pr-0 lg:pr-12">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-primary">
              Nuestra Promesa
            </span>
            <h2 className="font-display text-6xl font-bold leading-tight text-primary lg:text-7xl">
              Momentos <br /> <span className="text-accent-gold">Inolvidables</span>
            </h2>
            <p className="max-w-md text-lg leading-relaxed text-charcoal/70">
              Cada arreglo es una pieza única de artesanía floral. Seleccionamos las especies más vibrantes y frescas para asegurar que su mensaje perdure en el tiempo y el corazón.
            </p>
            <div className="pt-6">
              <button className="group flex items-center gap-4 rounded-full bg-primary px-10 py-5 text-xs font-bold tracking-[0.2em] text-white shadow-xl transition-all hover:bg-primary-dark hover:-translate-y-1">
                VER CATALOGO DE OCASIONES
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">shopping_cart</span>
              </button>
            </div>
          </div>

          {/* Mosaic Grid Area */}
          <div className="w-full lg:w-3/5">
            <div className="asymmetric-mosaic">
              {images.map((img, idx) => (
                <div key={idx} className={`group overflow-hidden rounded-[32px] relative cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500 bg-cream ${img.span}`}>
                  <img 
                    alt={img.alt} 
                    className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                    src={img.src} 
                  />
                  {/* Subtle Overlay on Hover */}
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-500">
                      <span className="material-symbols-outlined text-primary text-xl">visibility</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MosaicGallery;
