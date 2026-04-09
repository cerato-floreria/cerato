"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GiftFilters } from "@/components/CatalogFilters";
import ProductSection from "@/components/ProductSection";

import { allProducts as productsData } from "@/data/products";

const RegalosCatalogContent = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [maxPrice, setMaxPrice] = useState(3000);

  // Sync state with URL params
  useEffect(() => {
    if (categoryParam !== null) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);


  const allProducts = useMemo(() => {
    return productsData;
  }, []);



  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [allProducts, searchQuery, selectedCategory, maxPrice]);

  const categories = ["Postres, Chocolates y Botellas", "Globos y Peluches"];

  return (
    <main className="flex-1 pt-32 lg:pt-48 pb-24 bg-background-light">
      <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-primary/5 pb-8">
          <div>
            <h2 className="font-display text-4xl font-bold text-primary lg:text-5xl">Catálogo de Regalos y más</h2>
            <div className="mt-4 h-1.5 w-24 bg-accent-gold rounded-full"></div>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">
                DETALLES QUE ENAMORAN Y COMPLEMENTOS
             </span>
             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">
                {filteredProducts.length} REGALOS
             </span>
          </div>
        </div>

        <GiftFilters 
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          price={maxPrice}
          onSearch={setSearchQuery}
          onCategory={setSelectedCategory}
          onPrice={setMaxPrice}
          onClear={() => {
            setSearchQuery("");
            setSelectedCategory("");
            setMaxPrice(3000);
          }}
        />

        {filteredProducts.length > 0 ? (
          categories.map((cat) => {
            const productsInCat = filteredProducts.filter(p => p.category === cat);
            if (productsInCat.length === 0) return null;
            return <ProductSection key={cat} title={cat} products={productsInCat} />;
          })
        ) : (
          <div className="py-24 text-center">
            <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">search_off</span>
            <p className="font-display text-2xl italic text-primary/60">No se encontraron detalles para sorprender.</p>
          </div>
        )}
      </div>
    </main>
  );
};

const RegalosCatalog = () => {
  return (
    <Suspense fallback={
      <div className="flex-1 pt-32 lg:pt-48 pb-24 bg-background-light text-center">
        <p className="font-display text-2xl italic text-primary/60">Cargando detalles...</p>
      </div>
    }>
      <RegalosCatalogContent />
    </Suspense>
  );
};

export default RegalosCatalog;
