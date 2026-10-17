"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import ProductFilters from "@/components/ProductFilters";
import MinifiedProductFilters from "@/components/MinifiedProductFilters";
import ProductSection from "@/components/ProductSection";
import { CategorySubItem, ShopifyProduct } from "@/lib/shopify/types";

interface CategoryClientPageProps {
  categoryName: string;
  subtypes: CategorySubItem[];
  allProducts: ShopifyProduct[];
  initialSubtype?: string;
}

export default function CategoryClientPage({
  categoryName,
  subtypes,
  allProducts,
  initialSubtype = "",
}: CategoryClientPageProps) {
  // Resolve initial subtype against available subtypes (case-insensitive)
  const resolvedInitialSubtype = useMemo(() => {
    if (!initialSubtype) return "";
    const matched = subtypes.find(
      (s) => s.type.toLowerCase() === initialSubtype.toLowerCase()
    );
    return matched ? matched.type : initialSubtype;
  }, [subtypes, initialSubtype]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubtype, setSelectedSubtype] = useState(resolvedInitialSubtype);
  const [prevInitialSubtype, setPrevInitialSubtype] = useState(resolvedInitialSubtype);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [showMinifiedFilters, setShowMinifiedFilters] = useState(false);

  const mainFiltersRef = useRef<HTMLDivElement>(null);

  if (prevInitialSubtype !== resolvedInitialSubtype) {
    setPrevInitialSubtype(resolvedInitialSubtype);
    setSelectedSubtype(resolvedInitialSubtype);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!mainFiltersRef.current) return;
      const rect = mainFiltersRef.current.getBoundingClientRect();
      // When the bottom of the main filter bar scrolls above the bottom of the navbar (~64px)
      setShowMinifiedFilters(rect.bottom <= 64);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Available subtype names for the filter dropdown
  const subtypeNames = useMemo(() => {
    return subtypes.map((s) => s.type);
  }, [subtypes]);

  // Format all products scoped to this category
  const categoryProductsFormatted = useMemo(() => {
    return allProducts
      .filter((p) => {
        // Match category via categories array or categoryPairs
        const matchesCategory =
          p.categories?.some(
            (cat) => cat.toLowerCase() === categoryName.toLowerCase()
          ) ||
          p.categoryPairs?.some(
            (pair) => pair.category.toLowerCase() === categoryName.toLowerCase()
          );
        return matchesCategory;
      })
      .map((p) => {
        const priceNum = p.priceRange?.minVariantPrice?.amount
          ? parseFloat(p.priceRange.minVariantPrice.amount)
          : 0;

        return {
          id: p.id,
          handle: p.handle,
          name: p.title,
          price: priceNum,
          currency: p.priceRange?.minVariantPrice?.currencyCode || "MXN",
          image:
            p.featuredImage?.url ||
            "https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=400",
          availableForSale: p.availableForSale !== false,
          categoryPairs: p.categoryPairs || [],
          types: p.types || [],
          rawProduct: p,
        };
      });
  }, [allProducts, categoryName]);

  // Apply search query, subtype, and price filters
  const filteredProducts = useMemo(() => {
    return categoryProductsFormatted.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesPrice = product.price <= maxPrice;

      const matchesSubtype =
        selectedSubtype === "" ||
        product.categoryPairs.some(
          (pair) =>
            pair.category.toLowerCase() === categoryName.toLowerCase() &&
            pair.type.toLowerCase() === selectedSubtype.toLowerCase()
        ) ||
        product.types.some(
          (t) => t.toLowerCase() === selectedSubtype.toLowerCase()
        );

      return matchesSearch && matchesPrice && matchesSubtype;
    });
  }, [categoryProductsFormatted, searchQuery, selectedSubtype, maxPrice, categoryName]);

  // Group filtered products by sub-type sections
  const sectionsToRender = useMemo(() => {
    if (selectedSubtype !== "") {
      // Single sub-type section
      const itemsInSubtype = filteredProducts.filter(
        (p) =>
          p.categoryPairs.some(
            (pair) =>
              pair.category.toLowerCase() === categoryName.toLowerCase() &&
              pair.type.toLowerCase() === selectedSubtype.toLowerCase()
          ) ||
          p.types.some(
            (t) => t.toLowerCase() === selectedSubtype.toLowerCase()
          )
      );
      if (itemsInSubtype.length === 0) return [];
      return [
        {
          title: selectedSubtype,
          products: itemsInSubtype,
        },
      ];
    }

    // All sub-types sections under this category
    return subtypes
      .map((sub) => {
        const productsInSub = filteredProducts.filter(
          (p) =>
            p.categoryPairs.some(
              (pair) =>
                pair.category.toLowerCase() === categoryName.toLowerCase() &&
                pair.type.toLowerCase() === sub.type.toLowerCase()
            ) ||
            p.types.some((t) => t.toLowerCase() === sub.type.toLowerCase())
        );

        return {
          title: sub.type,
          products: productsInSub,
        };
      })
      .filter((section) => section.products.length > 0);
  }, [selectedSubtype, subtypes, filteredProducts, categoryName]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedSubtype("");
    setMaxPrice(10000);
  };

  return (
    <div className="flex-1 pt-32 lg:pt-44 pb-24 bg-background-light">
      {/* Minified Sticky Filter Bar - Appears upon scrolling past the main filter block */}
      <MinifiedProductFilters
        isVisible={showMinifiedFilters}
        categoryName={categoryName}
        productCount={filteredProducts.length}
        searchQuery={searchQuery}
        selectedCategory={selectedSubtype}
        price={maxPrice}
        onSearch={setSearchQuery}
        onCategory={setSelectedSubtype}
        onPrice={setMaxPrice}
        onClear={handleClearFilters}
        options={subtypeNames}
        allLabel="Todos los Tipos"
        maxPriceLimit={10000}
      />

      <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
        {/* Page Header - Catálogo {categoryName} */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="font-display text-4xl font-bold text-primary lg:text-5xl uppercase tracking-wide">
              Catálogo {categoryName}
            </h1>
            <div className="mt-4 h-1.5 w-24 bg-accent-gold rounded-full"></div>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-charcoal/40">
            <span>{filteredProducts.length} Productos Encontrados</span>
          </div>
        </div>

        {/* Scoped Filter Bar */}
        <div ref={mainFiltersRef}>
          <ProductFilters
            searchQuery={searchQuery}
            selectedCategory={selectedSubtype}
            price={maxPrice}
            onSearch={setSearchQuery}
            onCategory={setSelectedSubtype}
            onPrice={setMaxPrice}
            onClear={handleClearFilters}
            options={subtypeNames}
            categoryLabel="Tipo / Subcategoría"
            allLabel="Todos los Tipos"
            maxPriceLimit={10000}
          />
        </div>

        {/* Dynamic Product Sections */}
        {sectionsToRender.length > 0 ? (
          sectionsToRender.map((section) => (
            <ProductSection
              key={section.title}
              title={section.title}
              products={section.products}
            />
          ))
        ) : (
          <div className="py-24 text-center bg-cream/50 rounded-3xl border border-primary/10">
            <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">
              search_off
            </span>
            <p className="font-display text-2xl italic text-primary/60">
              No se encontraron productos en {categoryName} con estos filtros.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
