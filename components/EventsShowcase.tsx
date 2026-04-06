"use client";

import React from "react";

const EventsShowcase = () => {
  return (
    <section className="purple-gradient-bg py-24">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Text Content */}
          <div className="space-y-8">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.4em] text-accent-gold">
              Diseño Floral Exclusivo
            </span>
            <h3 className="font-display text-5xl font-light leading-tight text-primary">
              Eventos Inolvidables Cerato
            </h3>
            <p className="text-lg leading-relaxed text-charcoal/70">
              Transformamos sus espacios con diseño floral a medida para bodas, reuniones corporativas y celebraciones especiales. Nuestro equipo de maestros floristas crea atmósferas únicas que reflejan la esencia de su evento con elegancia y distinción.
            </p>
            <div className="flex pt-4">
              <button className="group flex items-center gap-4 rounded-full bg-primary px-10 py-5 text-xs font-bold tracking-[0.2em] text-white shadow-xl transition-all hover:bg-primary-dark hover:-translate-y-1">
                VER COLECCIÓN DE EVENTOS Y BODAS
                <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">edit_calendar</span>
              </button>
            </div>
          </div>

          {/* Image Grid Overlay */}
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full border border-accent-gold/10 pointer-events-none hidden lg:block"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] aspect-square rounded-full border border-accent-gold/5 pointer-events-none hidden lg:block"></div>
            
            <div className="relative z-10 grid grid-cols-2 gap-8 items-center">
              <div className="aspect-[4/5] overflow-hidden rounded-[40px] border border-white/20 shadow-2xl transition-transform duration-700 hover:scale-105">
                <div 
                  className="h-full w-full bg-cover bg-center" 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBv_3_bmSdtd0GnSh5EHK0u0_H56GG3Kf_w-IDOHKIyW-PPwNs_tZR-Rs7AndhnNT7ubLRmz8qDyrlrrfnj-EH2def2GiQ1GRGxUojM7JR3zdP78DT7vnUixzilHMco80LOsqm2fXJPnZjKI5eLlSl7Pbu-uPVTSPvlj_5VfgN1PyYQnSJYTZniJczRyBXhjFV64tzWezEJMtRKx8f_4xWsGtXDnzwh78Lfyc61A-AVBsf0NAx763M53ybxtEfrVUPPt9vK3AjLQw")' }}
                ></div>
              </div>
              <div className="mt-20 aspect-[4/5] overflow-hidden rounded-[40px] border border-white/20 shadow-2xl transition-transform duration-700 hover:scale-105">
                <div 
                  className="h-full w-full bg-cover bg-center" 
                  style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAE3wTrCDgFop23cBenSXDz1C1rzyZ0ANix675D704dcbhYQZWepyQg4N1EeVZSifAwQA1-DbNn6A3vWoPUDQJBhsIkkI0_A0SbgoHm7ozgieKLFgNCfPRX64dxnDJ0Hh5b-VuX4NPTzF8WrTixexllWIdbMP9p7NPRFNWrfYheWMI2JPZJrbZBuBpzXyrEZl_QJku5QXRbfirOT78S9q2DBtqVPhrdMC2tOf7CLO7YdvVFuqNCeb0sOKqexnFXELYz09oihP4UkQ")' }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default EventsShowcase;
