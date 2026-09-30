"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { useCart } from "@/context/CartContext";
import { getProductsAction } from "@/app/actions/shopify";
import { buildTaxonomy } from "@/lib/shopify";
import { NavigationCategory } from "@/lib/shopify/types";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const { cart, isOpen: isCartOpen, openCart, closeCart } = useCart();
  const totalCartCount = cart?.totalQuantity || 0;

  useEffect(() => {
    setIsMobileMenuOpen(false);
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

  useEffect(() => {
    let isMounted = true;
    getProductsAction().then((products) => {
      if (isMounted) {
        const taxonomy = buildTaxonomy(products);
        setCategories(taxonomy.categories);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const headerStyle =
    isScrolled || !isHomePage
      ? "bg-primary py-3 shadow-2xl shadow-primary/40 border-b border-white/10"
      : "bg-transparent py-4 lg:py-5 hover:bg-primary/40 hover:backdrop-blur-md";

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] w-full px-6 transition-all duration-500 ${headerStyle}`}>
        <div className="mx-auto flex max-w-[1440px] items-center justify-between lg:px-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group/logo shrink-0" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="text-white transition-transform duration-300 group-hover/logo:scale-110">
              <svg className="w-8 h-8 lg:w-9 lg:h-9" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
              </svg>
            </div>
            <span className="font-display text-xl font-bold uppercase tracking-[0.25em] text-white">
              Cerato
            </span>
          </Link>

          {/* Desktop Dynamic Navigation derived from cat: & cat2: tags */}
          <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-10 lg:flex px-8">
            <Link
              className="text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:text-accent-gold whitespace-nowrap"
              href="/"
            >
              Inicio
            </Link>

            {categories.map((cat) => {
              const isHovered = activeMenu === cat.name;
              return (
                <div
                  key={cat.name}
                  className="group relative flex items-center py-2"
                  onMouseEnter={() => setActiveMenu(cat.name)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    className="relative text-[11px] font-bold uppercase tracking-widest text-white/90 transition-all group-hover:text-white flex items-center gap-1 cursor-pointer py-1 whitespace-nowrap"
                    href={`/flores?category=${encodeURIComponent(cat.name)}`}
                  >
                    {cat.name}
                    <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-accent-gold transition-all duration-300 group-hover:w-full"></span>
                  </Link>

                  {/* Seamless Hover Bridge & Mega Menu Dropdown */}
                  {cat.subtypes.length > 0 && (
                    <div
                      className={`fixed left-[3%] right-[3%] top-[64px] w-[94%] pt-3 z-[150] transition-all duration-300 ease-out ${
                        isHovered
                          ? "opacity-100 visible translate-y-0 pointer-events-auto"
                          : "opacity-0 invisible translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto"
                      }`}
                    >
                      <div className="w-full bg-white/98 backdrop-blur-2xl shadow-2xl rounded-2xl border-2 border-primary/20 p-8 lg:p-10">
                        <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-6">
                          <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2 uppercase tracking-wider">
                            <span>🌸</span> {cat.name}
                          </h3>
                          <Link
                            href={`/flores?category=${encodeURIComponent(cat.name)}`}
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent hover:text-primary transition-colors"
                          >
                            Ver Todo en {cat.name} →
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                          {cat.subtypes.map((sub) => (
                            <div key={sub.type} className="flex flex-col gap-3">
                              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary border-b border-primary/10 pb-2">
                                {sub.type}
                              </h4>
                              <ul className="space-y-2">
                                {sub.products.map((prod) => (
                                  <li key={prod.id}>
                                    <Link
                                      className="text-[12px] text-charcoal/70 hover:text-primary transition-colors font-medium block truncate"
                                      href={`/producto/${prod.handle}`}
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      {prod.title}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Icons: Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0">
            <button
              onClick={openCart}
              className="relative flex items-center justify-center h-10 w-10 text-white hover:text-accent-gold transition-colors cursor-pointer"
              aria-label="Abrir Carrito"
            >
              <span className="material-symbols-outlined text-2xl">shopping_bag</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-gold text-primary font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-md">
                  {totalCartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center h-10 w-10 text-white hover:text-accent-gold transition-colors lg:hidden z-[110]"
              aria-label="Menú Móvil"
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-[105] bg-black/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      {/* Mobile Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-[110] w-[85%] max-w-sm bg-primary border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.3)] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
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
              <li>
                <Link
                  href="/"
                  className="flex items-center justify-between text-xl font-display text-white/90 transition-all hover:text-accent-gold"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Inicio</span>
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.name}>
                  <Link
                    href={`/flores?category=${encodeURIComponent(cat.name)}`}
                    className="flex items-center justify-between text-xl font-display text-white/90 transition-all hover:text-accent-gold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
