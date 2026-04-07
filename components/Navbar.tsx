"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Force solid background if NOT on home page
  const headerStyle = (isScrolled || !isHomePage)
    ? "bg-primary py-3 shadow-2xl shadow-primary/40 border-b border-white/10" 
    : "bg-transparent py-4 lg:py-5 hover:bg-primary/40 hover:backdrop-blur-md";

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] w-full px-6 transition-all duration-500 group/nav ${headerStyle}`}>


      <div className="mx-auto flex max-w-[1440px] items-center justify-between lg:px-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group/logo">
          <div className="text-white transition-transform duration-300 group-hover/logo:scale-110">
            <svg className="w-8 h-8 lg:w-9 lg:h-9" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
          </div>
          <span className="font-display text-xl font-bold uppercase tracking-[0.25em] text-white">
            Cerato
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex">
          <Link
            className="text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:text-accent-gold"
            href="/"
          >
            Inicio
          </Link>

          {/* Mega Menu Trigger */}
          <div 
            className="group static"
            onMouseEnter={() => setActiveMenu("flores")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link
              className="relative text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white flex items-center gap-1 cursor-pointer py-2"
              href="/flores"
              onClick={() => setActiveMenu(null)}
            >
              Flores
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Mega Menu Content */}
            <div className={`absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-[32px] border-2 border-primary/40 pt-10 pb-10 px-12 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeMenu === "flores" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}>
              <div className="mx-auto max-w-[1440px] grid grid-cols-5 gap-12">



                {/* Column 1 */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Ramos y Atados
                  </h4>
                  <ul className="space-y-4">
                    {["10 gerberas", "Dulce", "Hermosa", "Precious", "5 tulipanes", "Rosa pastel", "Floral Charm", "Brisa", "Blush", "Incondicional (rojo)"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Ramos y Atados")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 2 */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Diseños con Base
                  </h4>
                  <ul className="space-y-4">
                    {["Bolsa premium", "Mini bolsa", "Girasoles y rosas", "Cherry chic", "Te adoro", "Bella", "Valeria", "Valentina", "Vida", "Rose (caja)"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Diseños con Base")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 3 */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Diseños en Florero
                  </h4>
                  <ul className="space-y-4">
                    {["Virtuosa (lila)", "Dulzura", "Destello", "Tulips", "Amor completo", "Virtuosa", "Tulips & roses", "Lili bloom", "Eva", "Solamente tu"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Diseños en Florero")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 4 */}
                <div className="flex flex-col gap-10">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                      Colección Premium XL
                    </h4>
                    <ul className="space-y-4">
                      {["In love XL", "100 rosas", "100 rosas y 20 tulipanes"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Colección Premium XL")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Exclusivo Box */}
                  <div className="bg-primary/[0.03] rounded-3xl p-8 border border-primary/5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest">EXCLUSIVO</span>
                    </div>
                    <p className="text-[12px] italic text-primary/60 leading-relaxed">
                      Consulte disponibilidad para arreglos personalizados de gran formato y eventos especiales.
                    </p>
                  </div>
                </div>
                {/* Column 5 */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Flores e Individuales
                  </h4>
                  <ul className="space-y-4">
                    {["Orquidea phalaenopsis", "Peonias", "Anturio", "Gerbera", "Tulipan", "Orquidea banda", "Peonias y tulipanes", "Hortensia", "Flor de alcachofa", "Mini orquidea"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Flores individuales y Orquídeas")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>



          </div>


          {/* Ocasiones Mega Menu Trigger */}
          <div 
            className="group static"
            onMouseEnter={() => setActiveMenu("ocasiones")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link
              className="relative text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white flex items-center gap-1 cursor-pointer py-2"
              href="/ocasiones"
              onClick={() => setActiveMenu(null)}
            >
              Ocasiones
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Mega Menu Content */}
            <div className={`absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-[32px] border-2 border-primary/40 pt-10 pb-10 px-12 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeMenu === "ocasiones" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}>
              <div className="mx-auto max-w-[1440px] grid grid-cols-4 gap-12">
                {/* Column 1: Temáticos y Niños */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Temáticos y Niños
                  </h4>
                  <ul className="space-y-4">
                    {["Barbie1", "Dragon Ball Z", "Stitch", "Caja barbie floral", "Enredados", "Barbie girl", "Rayo mcQueen", "Noche estrellada", "Petite (minis)"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/ocasiones?category=${encodeURIComponent("Temáticos y Niños")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 2: Nacimiento */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Nacimiento (Welcome Baby)
                  </h4>
                  <ul className="space-y-4">
                    {["Sweet teddy", "The garden of happiness", "Centro de mesa gender reveal"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/ocasiones?category=${encodeURIComponent("Nacimiento (Welcome Baby)")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 3: Fúnebre */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Fúnebre
                  </h4>
                  <ul className="space-y-4">
                    {["Angel", "Eterna", "Yo te extrañare (blanco)", "Corona", "Corona funebre", "Yo te extrañare"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/ocasiones?category=${encodeURIComponent("Fúnebre")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 4: Temporada (Navidad) */}
                <div className="flex flex-col gap-10">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                      Temporada (Navidad)
                    </h4>
                    <ul className="space-y-4">
                      {["Corona navideña", "Xmas tree", "Planta nochebuena"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/ocasiones?category=${encodeURIComponent("Temporada (Navidad)")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Exclusivo Box */}
                  <div className="bg-primary/[0.03] rounded-3xl p-8 border border-primary/5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest">EXCLUSIVO</span>
                    </div>
                    <p className="text-[12px] italic text-primary/60 leading-relaxed">
                      Consulta disponibilidad para arreglos personalizados de gran formato y eventos especiales.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Eventos y Bodas Mega Menu Trigger */}
          <div 
            className="group static"
            onMouseEnter={() => setActiveMenu("eventos")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link
              className="relative text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white flex items-center gap-1 cursor-pointer py-2"
              href="/eventos-y-bodas"
              onClick={() => setActiveMenu(null)}
            >
              Eventos y Bodas
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Mega Menu Content */}
            <div className={`absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-[32px] border-2 border-primary/40 pt-10 pb-10 px-12 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeMenu === "eventos" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}>
              <div className="mx-auto max-w-[1440px] grid grid-cols-2 gap-12">
                {/* Column 1: Bridal Bouquet */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Bridal Bouquet (Novias)
                  </h4>
                  <ul className="space-y-4">
                    {["Protea king", "Ramo de novia con protea", "Ramo de novia", "Ramo boda civil", "Vintage bride", "Boutonniere", "Ramo XV"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/eventos-y-bodas?category=${encodeURIComponent("Bridal Bouquet (Novias)")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 2: Decoración */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Decoración de Eventos
                  </h4>
                  <ul className="space-y-4">
                    {["Mesa de novios boho", "Centro de mesa imperial", "Gender reveal", "Centro de mesa en agua", "Centro de mesa gender reveal", "Diseño de mampara", "Arreglo para coche", "Green & white", "Camino de mesa sencillo"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/eventos-y-bodas?category=${encodeURIComponent("Decoración de Eventos")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* Regalos y más Mega Menu Trigger */}
          <div 
            className="group static"
            onMouseEnter={() => setActiveMenu("regalos")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <Link
              className="relative text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white flex items-center gap-1 cursor-pointer py-2"
              href="/regalos-y-mas"
              onClick={() => setActiveMenu(null)}
            >
              Regalos y más
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Mega Menu Content */}
            <div className={`absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-[32px] border-2 border-primary/40 pt-10 pb-10 px-12 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeMenu === "regalos" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}>
              <div className="mx-auto max-w-[1440px] grid grid-cols-3 gap-12">
                {/* Column 1: Postres */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Postres, Chocolates y Botellas
                  </h4>
                  <ul className="space-y-4">
                    {["Ferrero 16 piezas", "Postres (Nuevos)", "Chocolates (Nuevos)", "Bouquet con botella"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/regalos-y-mas?category=${encodeURIComponent("Postres, Chocolates y Botellas")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 2: Peluches */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Globos y Peluches
                  </h4>
                  <ul className="space-y-4">
                    {["Panda", "Hada", "Conejita", "Oso", "Stitch (peluche)", "Globos (Nuevos)", "Sweet teddy (escultura)", "Foto instantanea"].map((item) => (
                      <li key={item}>
                        <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/regalos-y-mas?category=${encodeURIComponent("Globos y Peluches")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Column 4: Exclusivo Box */}
                <div>
                  <div className="bg-primary/[0.03] rounded-3xl p-8 border border-primary/5 flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined text-sm">stars</span>
                      <span className="text-[9px] font-bold uppercase tracking-widest">EXCLUSIVO</span>
                    </div>
                    <p className="text-[12px] italic text-primary/60 leading-relaxed">
                      ¿BUSCAS ALGO PERSONALIZADO? Agenda una cita con nuestras diseñadoras para tu evento especial.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </nav>

        {/* Action Icons */}

        <div className="flex items-center gap-4">
          <button className="flex items-center justify-center h-10 w-10 text-white hover:text-accent-gold transition-colors">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

