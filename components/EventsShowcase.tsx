"use client";

import Image from "next/image";
import React from "react";

const EventsShowcase = () => {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24 bg-white">
      {/* Decorative Circles - Subtle approach matching latest screenshot */}
      <div className="absolute top-1/2 left-[55%] -translate-y-1/2 w-[600px] h-[600px] border border-accent-gold/15 rounded-full pointer-events-none"></div>
      <div className="absolute top-1/2 left-[55%] translate-x-12 -translate-y-12 w-[500px] h-[500px] border border-accent-gold/10 rounded-full pointer-events-none"></div>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-20 relative z-10">
        <div className="flex flex-col items-center gap-16 xl:flex-row xl:gap-24">
          
          {/* Text Content - Left Aligned */}
          <div className="w-full flex flex-col items-center text-center space-y-8 xl:w-1/2 xl:items-start xl:text-left">
            <span className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] text-accent-gold md:text-xs">
              DISEÑO FLORAL PARA MOMENTOS ÚNICOS
            </span>
            <h3 className="font-display text-4xl font-medium leading-[1.1] text-accent md:text-5xl lg:text-[56px]">
              Cerato dando <br /> vida a tus eventos
            </h3>
            <p className="max-w-xl text-base leading-relaxed text-charcoal/70 lg:text-lg">
              Creamos diseños florales que transforman espacios y dan vida a cada celebración. Desde bodas íntimas hasta grandes eventos corporativos, diseñamos cada detalle para reflejar tu estilo y crear una atmósfera extraordinaria.
            </p>
            <div className="pt-6 relative">
              <a 
                href="https://wa.me/524791428133?text=Hola%2C%20me%20gustar%C3%ADa%20cotizar%20un%20evento%20con%20Cerato%20Arte%20Floral"
                target="_blank"
                rel="noopener noreferrer"
                className="animate-cotizar-cta group relative inline-flex items-center gap-3.5 rounded-full bg-[#25D366] px-8 py-4 text-xs font-bold tracking-[0.2em] text-white overflow-hidden transition-all duration-300 hover:bg-[#20ba59] hover:scale-105 active:scale-95 cursor-pointer lg:px-10 lg:py-5"
              >
                {/* Shiny sweep reflection glint across the button */}
                <span className="animate-cotizar-shine absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                {/* WhatsApp Icon */}
                <svg className="relative z-10 h-5 w-5 fill-current transition-transform duration-300 group-hover:scale-110 shrink-0" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>

                <span className="relative z-10">COTIZA TU EVENTO / RAMO DE NOVIA</span>

                <span className="relative z-10 material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </a>
            </div>
          </div>

          {/* Image Layout - Non-touching, smaller side-by-side images */}
          <div className="w-full xl:w-1/2 flex justify-center xl:justify-end items-center">
            <div className="flex items-center gap-6 md:gap-10">
              {/* Image 1: Higher */}
              <div className="relative w-[140px] md:w-[260px] aspect-[3/4] overflow-hidden rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:scale-[1.05] -translate-y-6 md:-translate-y-10">
                <Image 
                  src="/Bouquet_nupcial.png"
                  alt="Cerato - Bouquet nupcial para bodas y eventos"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, 260px"
                />
              </div>
              
              {/* Image 2: Lower */}
              <div className="relative w-[140px] md:w-[260px] aspect-[3/4] overflow-hidden rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:scale-[1.05] translate-y-6 md:translate-y-10">
                <Image 
                  src="/boda.jpg"
                  alt="Cerato - Decoración floral de bodas y celebraciones"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, 260px"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EventsShowcase;
