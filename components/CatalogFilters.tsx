"use client";

import React from "react";

interface FilterProps {
  searchQuery: string;
  selectedCategory: string;
  price: number;
  onSearch: (query: string) => void;
  onCategory: (category: string) => void;
  onPrice: (price: number) => void;
  onClear: () => void;
}

export const EventFilters: React.FC<FilterProps> = ({ 
  searchQuery, 
  selectedCategory, 
  price, 
  onSearch, 
  onCategory, 
  onPrice, 
  onClear 
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="mb-12 relative">
      {/* Mobile Toggle Bar */}
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between lg:hidden bg-primary px-6 py-4 rounded-xl shadow-lg border border-white/5 active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-white/50">{showFilters ? "close" : "tune"}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
            {showFilters ? "OCULTAR FILTROS" : "MOSTRAR FILTROS"}
          </span>
        </div>
        <span className={`material-symbols-outlined text-white/50 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}>expand_more</span>
      </button>

      {/* Filter Content */}
      <div className={`mt-4 lg:mt-0 lg:block ${showFilters ? "block" : "hidden"}`}>
        <div className="rounded-3xl bg-cream/30 border border-primary/5 p-6 lg:p-8 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row items-end gap-8">
        
        {/* Search Field */}
        <div className="flex-1 w-full space-y-3">
          <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">BUSCAR DISEÑO</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors text-xl">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Ej: Ramo, Centro de mesa..." 
              className="w-full bg-white border border-primary/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-primary/20 shadow-sm"
              type="text" 
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="w-full lg:w-72 space-y-3">
          <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">CATEGORÍA</label>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => onCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-primary/5 rounded-xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary/80 cursor-pointer shadow-sm"
            >
              <option value="">Todas las categorías</option>
              <option value="Bridal Bouquet (Novias)">Bridal Bouquet (Novias)</option>
              <option value="Decoración de Eventos">Decoración de Eventos</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none">expand_more</span>
          </div>
        </div>

        {/* Price Field */}
        <div className="w-full lg:w-96 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">PRESUPUESTO</label>
            <span className="text-sm font-bold text-primary">${price.toLocaleString()}+</span>
          </div>

          <div className="flex items-center gap-6 bg-white border border-primary/5 rounded-xl px-6 py-4.5 min-h-[56px] shadow-sm">
            <input 
              max="10000" 
              min="0" 
              onChange={(e) => onPrice(Number(e.target.value))}
              step="100" 
              className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-accent-gold" 
              type="range" 
              value={price}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="w-full lg:w-auto">
          <button 
            onClick={onClear}
            className="w-full lg:w-auto flex items-center justify-center gap-2 h-[56px] px-8 rounded-xl border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest group bg-white shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">backspace</span>
            LIMPIAR FILTROS
          </button>
        </div>

      </div>
        </div>
      </div>
    </div>
  );
};

export const GiftFilters: React.FC<FilterProps> = ({ 
  searchQuery, 
  selectedCategory, 
  price, 
  onSearch, 
  onCategory, 
  onPrice, 
  onClear 
}) => {
  const [showFilters, setShowFilters] = React.useState(false);

  return (
    <div className="mb-12 relative">
      {/* Mobile Toggle Bar */}
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className="w-full flex items-center justify-between lg:hidden bg-primary px-6 py-4 rounded-xl shadow-lg border border-white/5 active:scale-95 transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-white/50">{showFilters ? "close" : "tune"}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
            {showFilters ? "OCULTAR FILTROS" : "MOSTRAR FILTROS"}
          </span>
        </div>
        <span className={`material-symbols-outlined text-white/50 transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`}>expand_more</span>
      </button>

      {/* Filter Content */}
      <div className={`mt-4 lg:mt-0 lg:block ${showFilters ? "block" : "hidden"}`}>
        <div className="rounded-3xl bg-cream/30 border border-primary/5 p-6 lg:p-8 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row items-end gap-8">
        
        {/* Search Field */}
        <div className="flex-1 w-full space-y-3">
          <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">BUSCAR REGALO</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors text-xl">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Ej: Chocolates, Peluches..." 
              className="w-full bg-white border border-primary/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-primary/20 shadow-sm"
              type="text" 
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="w-full lg:w-72 space-y-3">
          <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">CATEGORÍA</label>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => onCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-primary/5 rounded-xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary/80 cursor-pointer shadow-sm"
            >
              <option value="">Todas las categorías</option>
              <option value="Postres, Chocolates y Botellas">Postres, Chocolates y Botellas</option>
              <option value="Globos y Peluches">Globos y Peluches</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none">expand_more</span>
          </div>
        </div>

        {/* Price Field */}
        <div className="w-full lg:w-96 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">PRESUPUESTO</label>
            <span className="text-sm font-bold text-primary">${price.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-6 bg-white border border-primary/5 rounded-xl px-6 py-4.5 min-h-[56px] shadow-sm">
            <input 
              max="3000" 
              min="0" 
              onChange={(e) => onPrice(Number(e.target.value))}
              step="50" 
              className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-accent-gold" 
              type="range" 
              value={price}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="w-full lg:w-auto">
          <button 
            onClick={onClear}
            className="w-full lg:w-auto flex items-center justify-center gap-2 h-[56px] px-8 rounded-xl border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest group bg-white shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:rotate-12 transition-transform">backspace</span>
            LIMPIAR FILTROS
          </button>
        </div>

      </div>
        </div>
      </div>
    </div>
  );
};
