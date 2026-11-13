'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getProductsAction } from '@/app/actions/shopify';
import { buildTaxonomy, slugifyCategory, toPascalCase } from '@/lib/shopify';
import { NavigationCategory } from '@/lib/shopify/types';

const fallbackCategories = [
  { name: 'FLORES Y PLANTAS', slug: 'flores-y-plantas' },
  { name: 'OCASIONES', slug: 'ocasiones' },
  { name: 'EVENTOS Y BODAS', slug: 'eventos-y-bodas' },
  { name: 'REGALOS Y MÁS', slug: 'regalos-y-mas' },
];

const Footer = () => {
  const [categories, setCategories] = useState<NavigationCategory[]>([]);

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

  const displayCategories =
    categories.length > 0
      ? categories.map((c) => ({
          name: toPascalCase(c.name),
          slug: slugifyCategory(c.name),
        }))
      : fallbackCategories.map((c) => ({
          name: toPascalCase(c.name),
          slug: c.slug,
        }));

  return (
    <footer className="bg-primary pt-20 pb-10 text-white/70">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Brand Column */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="inline-block group/logo">
              <Image
                src="/Logo-Color-1.png"
                alt="Cerato Arte Floral"
                width={200}
                height={95}
                className="h-14 sm:h-16 w-auto object-contain transition-transform duration-300 group-hover/logo:scale-105"
              />
            </Link>
            <p className="max-w-xs text-sm font-light leading-relaxed text-white/50">
              Cada flor tiene su encanto y cada ocasión algo que la hace
              especial. Diseñamos arreglos con una sensibilidad única y atención
              a cada detalle.
            </p>
          </div>

          {/* Links Column 1: Explorar (Synced with Navbar categories) */}
          <nav className="flex flex-col gap-6">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">
              Explorar
            </h5>
            <ul className="flex flex-col gap-3 text-sm font-light">
              <li>
                <Link className="transition-colors hover:text-white" href="/">
                  Inicio
                </Link>
              </li>
              {displayCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    className="transition-colors hover:text-white"
                    href={`/categoria/${cat.slug}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Links Column 2: Legal y Políticas */}
          <nav className="flex flex-col gap-6">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">
              Nosotros
            </h5>
            <ul className="flex flex-col gap-3 text-sm font-light">
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href="/politica-de-envios"
                >
                  Política de Envíos Locales (León, Gto.)
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href="/terminos-y-condiciones"
                >
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href="/politica-de-reembolsos"
                >
                  Política de Reembolsos y Garantía
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-white"
                  href="/aviso-de-privacidad"
                >
                  Aviso de Privacidad
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social Column */}
          <div className="flex flex-col gap-6">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-gold">
              Redes Sociales
            </h5>
            <div className="flex gap-4">
              <a
                className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white hover:text-primary"
                href="https://www.instagram.com/cerato.artefloral/"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                aria-label="Seguir a Cerato Arte Floral en Instagram"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white hover:text-primary"
                href="https://www.facebook.com/cerato.artefloral/?locale=es_LA"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                aria-label="Seguir a Cerato Arte Floral en Facebook"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </a>
              <a
                className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white hover:text-primary"
                href="https://wa.me/524791428133"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
                aria-label="Contactar por WhatsApp"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                className="flex h-10 w-10 shrink-0 aspect-square items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:bg-white hover:text-primary"
                href="https://www.tiktok.com/@cerato.artefloral"
                target="_blank"
                rel="noopener noreferrer"
                title="TikTok"
                aria-label="Seguir a Cerato Arte Floral en TikTok"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19.589 6.686a4.793 4.793 0 01-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 01-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 013.183-4.51v-3.5a6.329 6.329 0 00-5.394 10.692 6.33 6.33 0 0010.857-4.424V8.617a8.131 8.131 0 005.373 1.975V7.144a4.83 4.83 0 01-1.603-.458z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 border-t border-white/5 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 text-center md:text-left">
              © 2026 Cerato Arte Floral. Todos los derechos reservados.
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 text-center md:text-right">
              Desarrollado por{' '}
              <a
                href="https://blackcherryitconsulting.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-accent-gold transition-colors underline-offset-4 hover:underline cursor-pointer"
              >
                BlackCherry IT Consulting
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
