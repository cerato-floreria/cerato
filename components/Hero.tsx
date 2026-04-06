"use client";

import React from "react";

const Hero = () => {
  return (
    <section className="relative h-[110vh] w-full overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0">
        <div 
          className="h-full w-full bg-cover bg-center brightness-75 scale-105" 
          style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB7SQC5j2SEbPXUk-uVjoIycUIAcdLn5giMTeCvOzKcaxZaGipSYEDgUFtI87kuy6f9b7RXXzuOBPvluWIhX1yaMr08jSkZqWEgoVqgWEd4ZtBNutaXlmAIAex4WOjgX-fp5lZPGpwRJTcEB2whflMKpzxhJdk4wg8304iHUyX6VdP_tMhrOl_Cgfn2v68C3bGgHrZQ76SYejV12M9ut2nQQyOE9xVU96CsKabi79TALniCPrmEfBTpWzPFNV6KrGX54DLutPIp5Q")' }}
        ></div>
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto h-full max-w-[1440px] flex flex-col justify-center pt-24 px-6 lg:px-20">
        {/* Text Section - Left Aligned */}
        <div className="max-w-4xl text-left">
          <span className="mb-6 block text-sm font-bold uppercase tracking-[0.5em] text-accent-gold text-glow">
            Exclusividad en cada detalle
          </span>
          <h1 className="mb-8 text-7xl font-light leading-[1.1] text-white lg:text-[100px] font-display">
            Arte Floral que <br />
            <span className="italic font-normal text-cream">Enamora</span>
          </h1>
          <p className="mb-12 max-w-2xl text-xl leading-relaxed text-white/90 font-light">
            Diseños premium curados por expertos para transformar sus momentos especiales en recuerdos inolvidables.
          </p>
        </div>
        
        {/* Action Row - Fully Centered horizontally on the page */}
        <div className="w-full flex justify-center mt-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <button className="group flex items-center justify-center gap-4 rounded-full bg-primary h-16 px-10 text-xs font-bold tracking-[0.2em] text-white shadow-2xl transition-all duration-500 hover:bg-primary-dark hover:scale-105 whitespace-nowrap">
              EXPLORAR COLECCIÓN DE FLORES
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
            </button>
            
            <div className="bg-white flex items-center h-16 w-full md:w-auto md:min-w-[500px] rounded-[24px] p-1.5 shadow-[0_30px_60px_rgba(0,0,0,0.15)]">
              <div className="flex flex-1 items-center gap-4 px-6">
                <span className="material-symbols-outlined text-primary/60 text-xl">search</span>
                <input 
                  className="w-full border-none bg-transparent py-4 text-sm font-medium text-charcoal placeholder:text-charcoal/30 focus:ring-0" 
                  placeholder='Escribe: "Ramos de flores"' 
                  type="text"
                />
              </div>
              <button className="h-full rounded-[18px] bg-primary px-8 text-[10px] font-bold tracking-[0.2em] text-white shadow-lg transition-all duration-300 hover:bg-primary-dark whitespace-nowrap">
                BUSCAR REGALO
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>






  );
};

export default Hero;
