"use client";

import Image from "next/image";
import Link from "next/link";
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
              DISEÑO FLORAL EXCLUSIVO
            </span>
            <h3 className="font-display text-4xl font-medium leading-[1.1] text-accent md:text-5xl lg:text-[56px]">
              Eventos <br /> Inolvidables <br /> Cerato
            </h3>
            <p className="max-w-xl text-base leading-relaxed text-charcoal/70 lg:text-lg">
              Transformamos sus espacios con diseño floral a medida para bodas, reuniones corporativas y celebraciones especiales. Nuestro equipo de maestros floristas crea atmósferas únicas que reflejan la esencia de su evento con elegancia y distinción.
            </p>
            <div className="pt-6">
              <Link 
                href="/eventos-y-bodas"
                className="group flex items-center gap-4 rounded-full bg-[#6B4E71] px-10 py-5 text-[10px] font-bold tracking-[0.2em] text-white shadow-2xl transition-all hover:opacity-90 hover:-translate-y-1 lg:text-xs"
              >
                VER COLECCIÓN DE EVENTOS Y BODAS
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">calendar_month</span>
              </Link>
            </div>
          </div>

          {/* Image Layout - Non-touching, smaller side-by-side images */}
          <div className="w-full xl:w-1/2 flex justify-center xl:justify-end items-center">
            <div className="flex items-center gap-6 md:gap-10">
              {/* Image 1: Higher */}
              <div className="relative w-[140px] md:w-[260px] aspect-[3/4] overflow-hidden rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:scale-[1.05] -translate-y-6 md:-translate-y-10">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw"
                  alt="Evento Cerato 1"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 40vw, 260px"
                />
              </div>
              
              {/* Image 2: Lower */}
              <div className="relative w-[140px] md:w-[260px] aspect-[3/4] overflow-hidden rounded-[24px] md:rounded-[32px] shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-700 hover:scale-[1.05] translate-y-6 md:translate-y-10">
                <Image 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAE3wTrCDgFop23cBenSXDz1C1rzyZ0ANix675D704dcbhYQZWepyQg4N1EeVZSifAwQA1-DbNn6A3vWoPUDQJBhsIkkI0_A0SbgoHm7ozgieKLFgNCfPRX64dxnDJ0Hh5b-VuX4NPTzF8WrTixexllWIdbMP9p7NPRFNWrfYheWMI2JPZJrbZBuBpzXyrEZl_QJku5QXRbfirOT78S9q2DBtqVPhrdMC2tOf7CLO7YdvVFuqNCeb0sOKqexnFXELYz09oihP4UkQ"
                  alt="Evento Cerato 2"
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
