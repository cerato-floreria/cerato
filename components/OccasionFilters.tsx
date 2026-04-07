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

const OccasionFilters: React.FC<FilterProps> = ({ 
  searchQuery, 
  selectedCategory, 
  price, 
  onSearch, 
  onCategory, 
  onPrice, 
  onClear 
}) => {
  return (
    <div className="mb-12 rounded-3xl bg-cream/30 border border-primary/5 p-6 lg:p-8 shadow-sm backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row items-end gap-8">
        
        {/* Search Field */}
        <div className="flex-1 w-full space-y-3">
          <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">BUSCAR OCASIÓN</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors text-xl">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Ej: Nacimiento, Fúnebre..." 
              className="w-full bg-white border border-primary/5 rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-primary/20 shadow-sm"
              type="text" 
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="w-full lg:w-72 space-y-3">
          <label className="text-[9px] font-bold uppercase tracking-[0.3em] text-primary">OCASIÓN</label>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => onCategory(e.target.value)}
              className="w-full appearance-none bg-white border border-primary/5 rounded-xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary/80 cursor-pointer shadow-sm"
            >
              <option value="">Todas las ocasiones</option>
              <option value="Temáticos y Niños">Temáticos y Niños</option>
              <option value="Nacimiento (Welcome Baby)">Nacimiento (Welcome Baby)</option>
              <option value="Fúnebre">Fúnebre</option>
              <option value="Temporada (Navidad)">Temporada (Navidad)</option>
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
              max="5000" 
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
  );
};

export default OccasionFilters;
