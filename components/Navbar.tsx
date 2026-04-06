"use client";

import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[100] w-full px-6 transition-all duration-500 group/nav ${
      isScrolled 
      ? "bg-primary py-3 shadow-2xl shadow-primary/40 border-b border-white/10" 
      : "bg-transparent py-4 lg:py-5 hover:bg-primary/40 hover:backdrop-blur-md"
    }`}>

      <div className="mx-auto flex max-w-[1440px] items-center justify-between lg:px-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 lg:h-12 lg:w-12 overflow-hidden rounded-full border border-white/20 bg-primary p-0.5 shadow-xl">
            <img
              alt="Cerato Logo"
              className="h-full w-full rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2jTAcyIBJ22IIx0UjUNpG7zvxXlfYGSjusRZJl6dArbmvK_HGW_yDsbXL1G1PN0_P2XCE86BRSc8YBF4ENac53Mil8kybl2J54kVElq66VDBHARmsx8OQ83QYOhM7Xxx6r-vyZ6gYvlUzWCA-eTQqeeSLFCzOpp4dOFqgH-mcN-qyku9uOPDH7fj-4u1ucIwgxcMPdiKy8_rTPGbySAnUYlVjLuVwiy8QPlq5WgZ-zDC-jDUikDlvR3IRHJ9s_uVUwY4w7MTzsg"
            />
          </div>
          <span className="font-display text-xl font-bold uppercase tracking-[0.25em] text-white">
            Cerato
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-10 lg:flex">
          <a
            className="text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:text-accent-gold"
            href="#"
          >
            Inicio
          </a>

          {/* Mega Menu Trigger */}
          <div className="group static">
            <a
              className="relative text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white flex items-center gap-1 cursor-pointer py-2"
              href="#"
            >
              Flores
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
            </a>

            {/* Mega Menu Content */}
            <div className="absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-[32px] border border-white/20 pt-10 pb-6 px-12 z-50 opacity-0 invisible translate-y-4 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
              <div className="mx-auto max-w-[1440px] grid grid-cols-5 gap-12">


                {/* Column 1 */}
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">
                    Ramos y Atados
                  </h4>
                  <ul className="space-y-4">
                    {["10 gerberas", "Dulce", "Hermosa", "Precious", "5 tulipanes", "Rosa pastel", "Floral Charm", "Brisa", "Blush", "Incondicional (rojo)"].map((item) => (
                      <li key={item}>
                        <a className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href="#">{item}</a>
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
                        <a className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href="#">{item}</a>
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
                        <a className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href="#">{item}</a>
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
                          <a className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href="#">{item}</a>
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
                        <a className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href="#">{item}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>


          </div>


          <a className="text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white" href="#">Ocasiones</a>
          <a className="text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white" href="#">Eventos y Bodas</a>
          <a className="text-[11px] font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white" href="#">Regalos y más</a>
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
