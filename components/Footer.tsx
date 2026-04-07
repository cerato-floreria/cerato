"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary py-24 text-white/70">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-20">
        <div className="grid grid-cols-1 gap-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4 group/logo">
              <div className="text-white transition-transform duration-300 group-hover/logo:scale-110">
                <svg className="w-8 h-8 lg:w-9 lg:h-9" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
                </svg>
              </div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-[0.2em] text-white">
                Cerato
              </h2>
            </div>
            <p className="max-w-xs font-sans text-sm leading-relaxed text-white/60">
              Elevando el arte de regalar a través de la naturaleza. Especialistas en diseño floral de alta gama para las ocasiones más exigentes.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="flex flex-col gap-6">
            <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-accent-gold">Descubrir</h5>
            <ul className="flex flex-col gap-4 text-sm font-sans font-light">
              <li><a className="transition-colors hover:text-accent-gold" href="#">Flores</a></li>
              <li><a className="transition-colors hover:text-accent-gold" href="#">Ocasiones</a></li>
              <li><a className="transition-colors hover:text-accent-gold" href="#">Eventos y Bodas</a></li>
              <li><a className="transition-colors hover:text-accent-gold" href="#">Regalos y más</a></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="flex flex-col gap-6">
            <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-accent-gold">Atención</h5>
            <ul className="flex flex-col gap-4 text-sm font-sans font-light">
              <li><a className="transition-colors hover:text-accent-gold" href="#">Servicio Personalizado</a></li>
              <li><a className="transition-colors hover:text-accent-gold" href="#">Zonas de Cobertura</a></li>
              <li><a className="transition-colors hover:text-accent-gold" href="#">Políticas de Calidad</a></li>
              <li><a className="transition-colors hover:text-accent-gold" href="#">Privacidad</a></li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="flex flex-col gap-6">
            <h5 className="text-xs font-bold uppercase tracking-[0.3em] text-accent-gold">Conectar</h5>
            <div className="flex flex-wrap gap-4">
              <a className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent-gold hover:text-accent-gold" href="#" title="Instagram">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path></svg>
              </a>
              <a className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent-gold hover:text-accent-gold" href="#" title="Facebook">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"></path></svg>
              </a>
              <a className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent-gold hover:text-accent-gold" href="#" title="WhatsApp">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.309 1.656zm6.224-3.82c1.516.903 3.136 1.379 4.822 1.38h.005c5.331 0 9.673-4.341 9.676-9.674 0-2.584-1.005-5.013-2.829-6.837-1.826-1.826-4.253-2.83-6.838-2.83-5.333 0-9.676 4.342-9.678 9.675-.001 1.747.469 3.454 1.359 4.927l-.893 3.257 3.373-.884zm11.383-7.882c-.312-.156-1.848-.912-2.134-1.017-.286-.105-.494-.156-.701.156s-.805 1.017-1.017 1.251-.416.26-.729.104c-.312-.156-1.316-.484-2.508-1.548-.927-.827-1.551-1.849-1.733-2.16-.182-.312-.019-.481.137-.636.141-.14.312-.364.468-.546.156-.182.208-.312.312-.52.104-.208.052-.39-.026-.546-.078-.156-.701-1.691-.961-2.313-.253-.607-.511-.525-.701-.535-.181-.01-.39-.011-.598-.011-.208 0-.546.078-.832.39-.286.312-1.092 1.066-1.092 2.6s1.118 3.016 1.274 3.224c.156.208 2.199 3.358 5.327 4.708.744.321 1.324.512 1.777.656.748.237 1.429.204 1.967.124.599-.088 1.848-.755 2.108-1.485.26-.73.26-1.354.182-1.485-.077-.13-.286-.208-.597-.364z"></path></svg>
              </a>
              <a className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all hover:border-accent-gold hover:text-accent-gold" href="#" title="TikTok">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M12.525.02c1.31 0 2.591.255 3.793.75v5.18c-.732-.437-1.58-.689-2.486-.689-2.618 0-4.74 2.122-4.74 4.74v1.541c0 2.618 2.122 4.74 4.74 4.74 1.01 0 1.947-.315 2.719-.851v2.13c-.8.361-1.684.563-2.613.563-3.41 0-6.173-2.763-6.173-6.173V9.29c0-3.41 2.763-6.173 6.173-6.173.226 0 .448.012.667.036V0h.001zM19.11 5.92c1.332 0 2.56.417 3.567 1.129v5.188A6.16 6.16 0 0 0 19.11 11.08V5.92zM12.525 21.08c1.333 0 2.561.417 3.568 1.13v1.78a6.162 6.162 0 0 1-3.568-1.03v-1.88z"></path></svg>
              </a>
            </div>


            <div className="mt-4 rounded-lg border border-white/5 bg-white/5 p-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Pago Seguro</p>
              <div className="flex items-center gap-2 opacity-50 grayscale transition-all hover:grayscale-0">
                <span className="material-symbols-outlined">lock</span>
                <span className="material-symbols-outlined">verified_user</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 border-t border-white/5 pt-6 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">
          © 2024 Cerato Arte Floral. Todos los derechos reservados.
          <div className="mt-2 tracking-[0.2em]">Desarrollado por BlackCherry IT Consulting</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
