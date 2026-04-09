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

const ProductFilters: React.FC<FilterProps> = ({ 
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
        <div className="rounded-2xl bg-cream border border-primary/10 p-6 lg:p-10 shadow-sm relative overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
        
        {/* Search Field */}
        <div className="md:col-span-3 space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Búsqueda</label>
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/30 group-focus-within:text-primary transition-colors">search</span>
            <input 
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Ej: Gerberas..." 
              className="w-full bg-primary/[0.03] border-none rounded-xl py-4 pl-12 pr-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all placeholder:text-primary/20"
              type="text" 
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="md:col-span-3 space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Categoría</label>
          <div className="relative">
            <select 
              value={selectedCategory}
              onChange={(e) => onCategory(e.target.value)}
              className="w-full appearance-none bg-primary/[0.03] border-none rounded-xl py-4 px-6 text-sm focus:ring-2 focus:ring-primary/10 transition-all text-primary/80 cursor-pointer"
            >
              <option value="">Todas las Flores</option>
              <option value="Ramos y Atados">Ramos y Atados</option>
              <option value="Diseños con Base">Diseños con Base</option>
              <option value="Diseños en Florero">Diseños en Florero</option>
              <option value="Colección Premium XL">Colección Premium XL</option>
              <option value="Flores individuales y Orquídeas">Flores individuales</option>
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary/30 pointer-events-none">expand_more</span>
          </div>
        </div>

        {/* Price Field */}
        <div className="md:col-span-4 space-y-3">
          <div className="flex justify-between items-center pr-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">Precio Máximo</label>
            <span className="text-sm font-bold text-primary">${price}</span>
          </div>

          <div className="flex items-center gap-6 bg-primary/[0.03] rounded-xl px-6 py-4.5 min-h-[56px]">
            <input 
              max="1000" 
              min="0" 
              onChange={(e) => onPrice(Number(e.target.value))}
              step="5" 
              className="w-full h-1.5 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-primary" 
              type="range" 
              value={price}
            />
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="md:col-span-2">
          <button 
            onClick={onClear}
            className="w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl border border-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest group bg-white"
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


export default ProductFilters;
