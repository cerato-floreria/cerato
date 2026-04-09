"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { allProducts, Product } from "@/data/products";
import { useRouter } from "next/navigation";


const Hero = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle filtering
  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (query.trim()) {
      // In a real app, this would go to a search results page
      // For now, if there's a match, go to the first one, else just the flores page
      if (suggestions.length > 0) {
        router.push(`/productos/${suggestions[0].id}`);
      } else {
        router.push("/flores");
      }
      setIsOpen(false);
    }
  };

  return (

    <section className="relative min-h-screen w-full pb-8">



      {/* Background Image & Overlay optimized with next/image */}
      <div className="absolute inset-0 z-0 overflow-hidden">

        <Image 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7SQC5j2SEbPXUk-uVjoIycUIAcdLn5giMTeCvOzKcaxZaGipSYEDgUFtI87kuy6f9b7RXXzuOBPvluWIhX1yaMr08jSkZqWEgoVqgWEd4ZtBNutaXlmAIAex4WOjgX-fp5lZPGpwRJTcEB2whflMKpzxhJdk4wg8304iHUyX6VdP_tMhrOl_Cgfn2v68C3bGgHrZQ76SYejV12M9ut2nQQyOE9xVU96CsKabi79TALniCPrmEfBTpWzPFNV6KrGX54DLutPIp5Q"
          alt="Cerato Floral Arreglo de Lujo"
          fill
          priority
          fetchPriority="high"
          className="object-cover brightness-75 transition-transform duration-[10000ms] hover:scale-110"

          sizes="100vw"
        />
        <div className="absolute inset-0 hero-gradient opacity-90"></div>
      </div>

      {/* Content */}
    <div className="relative z-10 mx-auto h-full max-w-[1440px] flex flex-col justify-start pt-24 pb-16 lg:pt-32 lg:pb-20 px-6 lg:px-20">




        {/* Text Section - Left Aligned */}
        <div className="max-w-4xl text-left animate-fade-in lg:mt-0">
          <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.5em] text-accent-gold text-glow lg:mb-6 lg:text-sm">
            Exclusividad en cada detalle
          </span>
          <h1 className="mb-6 font-display text-[32px] sm:text-[42px] font-light leading-[1.1] text-white md:text-6xl lg:mb-8 lg:text-[64px]">

            Arte Floral que <br />
            <span className="italic font-normal text-cream">Enamora</span>
          </h1>
          <p className="mb-8 max-w-2xl text-base font-light leading-relaxed text-white/90 md:text-lg lg:mb-12 lg:text-xl">
            Diseños premium curados por expertos para transformar sus momentos especiales en recuerdos inolvidables.
          </p>
        </div>
        
        {/* Action Row - Centered */}
        <div className="w-full mt-8 lg:mt-16 flex justify-center">

          <div className="flex flex-col gap-6 md:flex-row md:items-center justify-center">
            <Link 
              href="/flores"
              className="group flex h-14 items-center justify-center gap-4 rounded-xl bg-primary px-8 text-[10px] font-bold tracking-[0.2em] text-white shadow-2xl transition-all duration-500 hover:bg-primary-dark hover:scale-105 md:h-16 md:px-10 md:text-xs"
            >
              EXPLORAR COLECCIÓN DE FLORES
              <span className="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
            </Link>
            
            <div ref={containerRef} className="relative flex h-14 w-full items-center rounded-xl bg-white p-1 shadow-2xl md:h-16 md:w-auto md:min-w-[450px] lg:min-w-[500px]">
              <div className="flex flex-1 items-center gap-3 px-4 lg:px-6">
                <span className="material-symbols-outlined text-primary/60 text-lg lg:text-xl">search</span>
                <input 
                  className="w-full border-none bg-transparent py-2 text-xs font-medium text-charcoal placeholder:text-charcoal/30 focus:ring-0 lg:py-4 lg:text-sm" 
                  placeholder='Busca: "Arreglos de rosas"' 
                  type="text"
                  aria-label="Buscar productos florales"
                  value={query}

                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => query.length > 0 && setIsOpen(true)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <button 
                onClick={handleSearch}
                aria-label="Ejecutar búsqueda"
                className="h-full rounded-xl bg-primary px-4 text-[9px] font-bold tracking-[0.15em] text-white transition-all duration-300 hover:bg-primary-dark md:px-8 md:text-[10px]"
              >

                BUSCAR
              </button>

              {/* Suggestions Dropdown */}
              {isOpen && (
                <div className="absolute top-[calc(100%+12px)] left-0 right-0 z-[100] overflow-hidden rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.25)] border-2 border-accent animate-in fade-in slide-in-from-top-4 duration-300">


                  {suggestions.length > 0 ? (
                    <div className="flex flex-col">
                      <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/40">Sugerencias</span>
                      </div>
                      {suggestions.map((product) => (
                        <Link
                          key={product.id}
                          href={`/productos/${product.id}`}
                          className="flex items-center gap-4 px-6 py-4 transition-all hover:bg-primary/5 group"
                          onClick={() => setIsOpen(false)}
                        >
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                            <Image 
                              src={product.image} 
                              alt={product.name} 
                              fill 
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-display font-medium text-primary group-hover:text-primary transition-colors">{product.name}</span>
                            <span className="text-[10px] font-sans text-primary/40 uppercase tracking-wider">{product.category}</span>
                          </div>
                          <div className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                            <span className="material-symbols-outlined text-primary/20 text-lg">arrow_forward</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="px-8 py-10 text-center">
                      <span className="material-symbols-outlined text-3xl text-primary/10 mb-2">search_off</span>
                      <p className="text-sm font-display italic text-primary/40">No encontramos resultados para "{query}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Scroll indicator - Hidden on mobile for cleaner look */}
      <div className="absolute bottom-10 left-1/2 -content -translate-x-1/2 hidden lg:block animate-bounce opacity-50">
        <span className="material-symbols-outlined text-white text-3xl">expand_more</span>
      </div>
    </section>
  );
};

export default Hero;
