'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import CartDrawer from './CartDrawer';
import { useCart } from '@/context/CartContext';
import { getProductsAction } from '@/app/actions/shopify';
import { buildTaxonomy, slugifyCategory, toPascalCase } from '@/lib/shopify';
import { NavigationCategory } from '@/lib/shopify/types';

const SHOPIFY_DOMAIN =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ||
  'cerato-arte-floral.myshopify.com';
const ACCOUNT_LOGIN_URL = `https://${SHOPIFY_DOMAIN}/account/login`;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<NavigationCategory[]>([]);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { cart, isOpen: isCartOpen, openCart, closeCart } = useCart();
  const totalCartCount = cart?.totalQuantity || 0;

  const handleMouseEnter = (catName: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setActiveMenu(catName);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 250);
  };

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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

  const isDarkNavbar = isScrolled || !isHomePage || activeMenu !== null;

  const headerStyle = isDarkNavbar
    ? 'bg-primary py-3 shadow-2xl shadow-primary/40 border-b border-white/10'
    : 'bg-transparent py-4 lg:py-5 hover:bg-primary/40 hover:backdrop-blur-md';

  return (
    <>
      {/* Desktop Mega Menu Backdrop Blur */}
      <div
        className={`fixed inset-0 z-[90] bg-black/45 backdrop-blur-md transition-all duration-300 hidden lg:block ${
          activeMenu !== null
            ? 'opacity-100 visible pointer-events-auto'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setActiveMenu(null)}
        onMouseEnter={handleMouseLeave}
        aria-hidden="true"
      />

      <header
        className={`fixed top-0 left-0 right-0 z-[100] w-full px-6 transition-all duration-500 ${headerStyle}`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between lg:px-14">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group/logo shrink-0"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Cerato Arte Floral - Inicio"
          >
            <Image
              src="/Logo-Color-1.png"
              alt="Cerato Arte Floral"
              width={160}
              height={75}
              priority
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105"
            />
          </Link>

          {/* Desktop Dynamic Navigation derived from cat: & cat2: tags */}
          <nav className="hidden flex-1 items-center justify-center gap-6 xl:gap-8 lg:flex px-6">
            <Link
              className="text-[11px] font-bold uppercase tracking-widest text-white transition-all hover:text-accent-gold whitespace-nowrap"
              href="/"
            >
              Inicio
            </Link>

            {categories.map((cat) => {
              const isHovered = activeMenu === cat.name;
              const categorySlug = slugifyCategory(cat.name);
              const categoryUrl = `/categoria/${categorySlug}`;

              return (
                <div
                  key={cat.name}
                  className="group relative flex items-center py-3"
                  onMouseEnter={() => handleMouseEnter(cat.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    className="relative text-[11px] font-bold uppercase tracking-widest text-white/90 transition-all group-hover:text-white flex items-center gap-1 cursor-pointer py-1 whitespace-nowrap"
                    href={categoryUrl}
                  >
                    {cat.name}
                    <span
                      className={`absolute bottom-0 left-0 h-[2px] bg-accent-gold transition-all duration-300 ${
                        isHovered ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </Link>

                  {/* Mega Menu Dropdown formatted in PascalCase */}
                  {cat.subtypes.length > 0 && (
                    <div
                      className={`fixed left-[3%] right-[3%] top-[54px] lg:top-[58px] w-[94%] pt-4 z-[150] transition-all duration-300 ease-out ${
                        isHovered
                          ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                          : 'opacity-0 invisible translate-y-2 pointer-events-none'
                      }`}
                      onMouseEnter={() => handleMouseEnter(cat.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <div className="relative w-full bg-[#FCFBF9]/90 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] rounded-[28px] border border-primary/10 pt-7 px-8 lg:pt-8 lg:px-10 pb-0 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-6">
                          <h3 className="font-display text-xl font-bold text-primary flex items-center gap-2">
                            <span>🌸</span> {toPascalCase(cat.name)}
                          </h3>
                          <Link
                            href={categoryUrl}
                            className="text-[11px] font-semibold text-accent hover:text-primary transition-colors flex items-center gap-1"
                            onClick={() => setActiveMenu(null)}
                          >
                            Ver todo en {toPascalCase(cat.name)} →
                          </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 max-h-[min(65vh,540px)] overflow-y-auto custom-scrollbar menu-scroll-fade pb-20 pr-1">
                          {cat.subtypes.map((sub) => (
                            <div key={sub.type} className="flex flex-col gap-3">
                              <h4 className="text-[13px] font-bold text-primary border-b border-primary/10 pb-2">
                                {toPascalCase(sub.type)}
                              </h4>
                              <ul className="space-y-2.5">
                                {sub.products.map((prod) => (
                                  <li key={prod.id}>
                                    <Link
                                      className="text-[13px] text-charcoal/75 hover:text-primary hover:translate-x-1 transition-all font-medium block truncate"
                                      href={`/producto/${prod.handle}?from=${slugifyCategory(cat.name)}`}
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      {toPascalCase(prod.title)}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Glass Blur Overlay - Seamless frosted diffusion without division lines */}
                        <div
                          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 glass-fade-bottom rounded-b-[28px]"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Action Icons: Account, Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-3 shrink-0">
            {/* Account / Login Link */}
            <a
              href={ACCOUNT_LOGIN_URL}
              className="relative flex items-center justify-center h-10 w-10 text-white hover:text-accent-gold transition-colors"
              aria-label="Iniciar sesión en tu cuenta de Cerato Floral"
              title="Iniciar sesión / Mi cuenta"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="material-symbols-outlined text-2xl">person</span>
            </a>

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center h-10 w-10 text-white hover:text-accent-gold transition-colors cursor-pointer"
              aria-label={`Abrir carrito de compras${totalCartCount > 0 ? `, ${totalCartCount} productos` : ''}`}
            >
              <span className="material-symbols-outlined text-2xl">
                shopping_bag
              </span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-gold text-primary font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center shadow-md">
                  {totalCartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center h-10 w-10 text-white hover:text-accent-gold transition-colors lg:hidden z-[110]"
              aria-label={
                isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'
              }
              aria-expanded={isMobileMenuOpen}
            >
              <span className="material-symbols-outlined text-3xl">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 z-[105] bg-black/40 backdrop-blur-sm transition-opacity duration-500 lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Mobile Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación móvil"
        className={`fixed right-0 top-0 bottom-0 z-[110] w-[85%] max-w-sm bg-primary border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.3)] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-primary/80 backdrop-blur-md sticky top-0 z-10">
            <Link
              href="/"
              className="flex items-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Image
                src="/Logo-Color-1.png"
                alt="Cerato Arte Floral"
                width={130}
                height={60}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Cerrar menú móvil"
              className="flex items-center justify-center h-10 w-10 text-white/50 hover:text-red-500 transition-colors duration-300 transform active:scale-90 cursor-pointer"
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
                    href={`/categoria/${slugifyCategory(cat.name)}`}
                    className="flex items-center justify-between text-xl font-display text-white/90 transition-all hover:text-accent-gold text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{toPascalCase(cat.name)}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Account Link in Mobile Drawer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href={ACCOUNT_LOGIN_URL}
                className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-white/90 hover:text-accent-gold transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="material-symbols-outlined text-2xl text-accent-gold">
                  person
                </span>
                <span>Mi Cuenta / Iniciar Sesión</span>
              </a>
            </div>
          </nav>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;
