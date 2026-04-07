"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductFilters from "@/components/ProductFilters";
import ProductSection from "@/components/ProductSection";
import { allProducts as productsData } from "@/data/products";

const FloresCatalog = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [maxPrice, setMaxPrice] = useState(1000);

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam !== null) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);


  // Unified Product Data with Categories normalized
  const allProducts = useMemo(() => {
    return productsData.map(p => ({
      ...p,
      price: typeof p.price === 'string' ? parseFloat(p.price.replace(/[^0-9.]/g, "")) : p.price
    }));
  }, []);


  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
      const matchesPrice = (product.price as number) <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [allProducts, searchQuery, selectedCategory, maxPrice]);

  // Derived sections based on filtered products
  const categories = ["Ramos y Atados", "Diseños con Base", "Diseños en Florero", "Colección Premium XL", "Flores individuales y Orquídeas"];

  return (
    <main className="flex-1 pt-32 lg:pt-48 pb-24 bg-background-light">
      <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
        
        {/* Page Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h2 className="font-display text-4xl font-bold text-primary lg:text-5xl">Catálogo Flores</h2>
            <div className="mt-4 h-1.5 w-24 bg-accent-gold rounded-full"></div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/40">
            <span>{filteredProducts.length} Productos Encontrados</span>
          </div>
        </div>

        {/* Functional Filter Bar */}
        <ProductFilters 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          price={maxPrice}
          onSearch={setSearchQuery}
          onCategory={setSelectedCategory}
          onPrice={setMaxPrice}
          onClear={() => {
            setSearchQuery("");
            setSelectedCategory("");
            setMaxPrice(1000);
          }}
        />

        {/* Dynamic Product Sections */}
        {filteredProducts.length > 0 ? (
          categories.map((cat) => {
            const productsInCat = filteredProducts.filter(p => p.category === cat);
            if (productsInCat.length === 0) return null;
            return <ProductSection key={cat} title={cat} products={productsInCat} />;
          })
        ) : (
          <div className="py-24 text-center">
            <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">search_off</span>
            <p className="font-display text-2xl italic text-primary/60">No se encontraron flores con estos filtros.</p>
          </div>
        )}

      </div>
    </main>
  );
};

export default FloresCatalog;
