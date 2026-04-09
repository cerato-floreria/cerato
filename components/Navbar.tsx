"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    setIsMobileMenuOpen(false); // Close menu on route change
  }, [pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

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
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] w-full px-6 transition-all duration-500 group/nav ${headerStyle}`}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between lg:px-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group/logo" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="text-white transition-transform duration-300 group-hover/logo:scale-110">
              <svg className="w-8 h-8 lg:w-9 lg:h-9" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <span className="font-display text-xl font-bold uppercase tracking-[0.25em] text-white">
              Cerato
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-[2] items-center justify-center gap-12 lg:flex">
            {/* Same as before... but simplified for brevity in this replacement chunk if needed, 
                however I should keep the existing logic. I will only show the added parts and preserved logic. */}
            <Link
              className="text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:text-accent-gold"
              href="/"
            >
              Inicio
            </Link>

            {/* Flores Mega Menu */}
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
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Mega Menu Content (Flores) */}
              <div className={`absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-xl border-2 border-primary/40 pt-10 pb-10 px-12 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeMenu === "flores" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}>
                <div className="mx-auto max-w-[1440px] grid grid-cols-5 gap-12">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Ramos y Atados</h4>
                    <ul className="space-y-4">
                      {["10 gerberas", "Dulce", "Hermosa", "Precious", "5 tulipanes", "Rosa pastel", "Floral Charm", "Brisa", "Blush", "Incondicional (rojo)"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Ramos y Atados")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Diseños con Base</h4>
                    <ul className="space-y-4">
                      {["Bolsa premium", "Mini bolsa", "Girasoles y rosas", "Cherry chic", "Te adoro", "Bella", "Valeria", "Valentina", "Vida", "Rose (caja)"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Diseños con Base")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Diseños en Florero</h4>
                    <ul className="space-y-4">
                      {["Virtuosa (lila)", "Dulzura", "Destello", "Tulips", "Amor completo", "Virtuosa", "Tulips & roses", "Lili bloom", "Eva", "Solamente tu"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Diseños en Florero")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-col gap-10">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Colección Premium XL</h4>
                      <ul className="space-y-4">
                        {["In love XL", "100 rosas", "100 rosas y 20 tulipanes"].map((item) => (
                          <li key={item}>
                            <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/flores?category=${encodeURIComponent("Colección Premium XL")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Flores e Individuales</h4>
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

            {/* Ocasiones Mega Menu */}
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
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <div className={`absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-xl border-2 border-primary/40 pt-10 pb-10 px-12 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeMenu === "ocasiones" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}>
                <div className="mx-auto max-w-[1440px] grid grid-cols-4 gap-12">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Temáticos y Niños</h4>
                    <ul className="space-y-4">
                      {["Barbie1", "Dragon Ball Z", "Stitch", "Caja barbie floral", "Enredados", "Barbie girl", "Rayo mcQueen", "Noche estrellada", "Petite (minis)"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/ocasiones?category=${encodeURIComponent("Temáticos y Niños")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Nacimiento (Welcome Baby)</h4>
                    <ul className="space-y-4">
                      {["Sweet teddy", "The garden of happiness", "Centro de mesa gender reveal"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/ocasiones?category=${encodeURIComponent("Nacimiento (Welcome Baby)")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Fúnebre</h4>
                    <ul className="space-y-4">
                      {["Angel", "Eterna", "Yo te extrañare (blanco)", "Corona", "Corona funebre", "Yo te extrañare"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/ocasiones?category=${encodeURIComponent("Fúnebre")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Temporada (Navidad)</h4>
                    <ul className="space-y-4">
                      {["Corona navideña", "Xmas tree", "Planta nochebuena"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/ocasiones?category=${encodeURIComponent("Temporada (Navidad)")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Eventos Mega Menu */}
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
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <div className={`absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-xl border-2 border-primary/40 pt-10 pb-10 px-12 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeMenu === "eventos" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}>
                <div className="mx-auto max-w-[1440px] grid grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Bridal Bouquet (Novias)</h4>
                    <ul className="space-y-4">
                      {["Protea king", "Ramo de novia con protea", "Ramo de novia", "Ramo boda civil", "Vintage bride", "Boutonniere", "Ramo XV"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/eventos-y-bodas?category=${encodeURIComponent("Bridal Bouquet (Novias)")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Decoración de Eventos</h4>
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

            {/* Regalos Mega Menu */}
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
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <div className={`absolute left-[5%] right-[5%] top-[calc(100%-10px)] w-[90%] bg-white/95 backdrop-blur-2xl shadow-3xl rounded-xl border-2 border-primary/40 pt-10 pb-10 px-12 z-50 transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${activeMenu === "regalos" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible translate-y-4"}`}>
                <div className="mx-auto max-w-[1440px] grid grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Postres y Detalles</h4>
                    <ul className="space-y-4">
                      {["Ferrero 16 piezas", "Postres (Nuevos)", "Chocolates (Nuevos)", "Bouquet con botella"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/regalos-y-mas?category=${encodeURIComponent("Postres, Chocolates y Botellas")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-8 border-b border-primary/5 pb-4">Pelusas y Globos</h4>
                    <ul className="space-y-4">
                      {["Panda", "Hada", "Conejita", "Oso", "Stitch (peluche)", "Globos (Nuevos)", "Sweet teddy (escultura)", "Foto instantanea"].map((item) => (
                        <li key={item}>
                          <Link className="text-[13px] text-charcoal/60 hover:text-primary transition-colors font-medium" href={`/regalos-y-mas?category=${encodeURIComponent("Globos y Peluches")}`} onClick={() => setActiveMenu(null)}>{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Mobile Hamburguer & Search */}
          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center justify-center h-10 w-10 text-white hover:text-accent-gold transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center h-10 w-10 text-white hover:text-accent-gold transition-colors lg:hidden z-[110]"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      <div 
        className={`fixed inset-0 z-[105] bg-black/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 z-[110] w-[85%] max-w-sm bg-primary border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.3)] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Menu Header with X button */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-primary/80 backdrop-blur-md sticky top-0 z-10">
            <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
              </svg>
              <span className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white">Cerato</span>
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center h-10 w-10 text-white/50 hover:text-red-500 transition-colors duration-300 transform active:scale-90"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
          </div>

          <nav className="flex-1 px-8 py-10">
            <ul className="flex flex-col gap-6">
              {[
                { name: "Inicio", href: "/" },
                { name: "Flores", href: "/flores" },
                { name: "Ocasiones", href: "/ocasiones" },
                { name: "Eventos y Bodas", href: "/eventos-y-bodas" },
                { name: "Regalos y más", href: "/regalos-y-mas" }
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href} 
                    className="flex items-center justify-between text-2xl font-display text-white/90 transition-all hover:text-accent-gold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>

  );
};

export default Navbar;

