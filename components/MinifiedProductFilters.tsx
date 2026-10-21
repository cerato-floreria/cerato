"use client";

import React from "react";

interface MinifiedProductFiltersProps {
  isVisible: boolean;
  categoryName: string;
  productCount: number;
  searchQuery: string;
  selectedCategory: string;
  price: number;
  onSearch: (query: string) => void;
  onCategory: (category: string) => void;
  onPrice: (price: number) => void;
  onClear: () => void;
  options: string[];
  allLabel?: string;
  maxPriceLimit?: number;
}

const MinifiedProductFilters: React.FC<MinifiedProductFiltersProps> = ({
  isVisible,
  categoryName,
  productCount,
  searchQuery,
  selectedCategory,
  price,
  onSearch,
  onCategory,
  onPrice,
  onClear,
  options,
  allLabel = "Todos los Tipos",
  maxPriceLimit = 10000,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) || Boolean(selectedCategory) || price < maxPriceLimit;

  return (
    <div
      className={`fixed top-[58px] lg:top-[64px] left-0 right-0 z-[75] w-full bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-md transition-all duration-300 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
      aria-hidden={!isVisible}
    >
      <div className="mx-auto max-w-[1536px] px-3 sm:px-6 lg:px-12 py-2 sm:py-2.5">
        {/* Mobile Header Row (Category Name & Full Product Count Badge) */}
        <div className="flex sm:hidden items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-primary/10">
          <span className="font-display font-bold text-xs uppercase tracking-wider text-primary truncate">
            {categoryName}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary tracking-wide shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-gold"></span>
            {productCount} {productCount === 1 ? "producto" : "productos"}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Category Info (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <span className="font-display font-bold text-xs uppercase tracking-wider text-primary truncate max-w-[160px] lg:max-w-[240px]">
              {categoryName}
            </span>
            <span className="text-[10px] font-bold text-accent-gold">•</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase tracking-widest whitespace-nowrap">
              {productCount} {productCount === 1 ? "producto" : "productos"}
            </span>
          </div>

          {/* Minified Filters Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-3xl justify-end sm:justify-center">
            {/* Subcategory Select */}
            <div className="relative flex-1 min-w-[130px] sm:max-w-[210px]">
              <select
                value={selectedCategory}
                onChange={(e) => onCategory(e.target.value)}
                aria-label="Filtrar por subcategoría"
                className="w-full appearance-none bg-primary/[0.04] hover:bg-primary/[0.08] border border-primary/10 rounded-lg py-1.5 pl-3 pr-7 text-xs font-semibold text-primary transition-all cursor-pointer focus:ring-1 focus:ring-primary/20 truncate"
              >
                <option value="">{allLabel}</option>
                {options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm text-primary/40 pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Compact Search Field */}
            <div className="relative flex-1 min-w-[110px] sm:max-w-[200px]">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-primary/35 pointer-events-none">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Buscar..."
                aria-label="Buscar producto"
                className="w-full bg-primary/[0.04] hover:bg-primary/[0.08] border border-primary/10 rounded-lg py-1.5 pl-8 pr-2 text-xs font-medium text-primary placeholder:text-primary/35 transition-all focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Price Filter (Tablet / Desktop) */}
            <div className="hidden md:flex items-center gap-2 shrink-0 bg-primary/[0.04] border border-primary/10 px-3 py-1 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary/60 whitespace-nowrap">
                Max: ${price.toLocaleString()}
              </span>
              <input
                type="range"
                min={300}
                max={maxPriceLimit}
                step={100}
                value={price}
                onChange={(e) => onPrice(Number(e.target.value))}
                aria-label="Filtrar por precio máximo"
                className="w-20 h-1 bg-primary/20 rounded-lg appearance-none cursor-pointer accent-accent-gold"
              />
            </div>

            {/* Clear Button (Visible when filters are active) */}
            {hasActiveFilters && (
              <button
                onClick={onClear}
                className="flex items-center gap-1 rounded-lg bg-accent-gold/15 hover:bg-accent-gold/25 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-accent-gold transition-colors shrink-0 cursor-pointer"
                title="Limpiar filtros activos"
              >
                <span className="material-symbols-outlined text-xs">close</span>
                <span className="hidden sm:inline">Limpiar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MinifiedProductFilters;
