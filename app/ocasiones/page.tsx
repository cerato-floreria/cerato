"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import OccasionFilters from "@/components/OccasionFilters";
import ProductSection from "@/components/ProductSection";
import { getProductsAction } from "@/app/actions/shopify";
import { buildTaxonomy } from "@/lib/shopify";
import { ShopifyProduct } from "@/lib/shopify/types";

const OcasionesCatalogContent = () => {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categoryParam !== null) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getProductsAction().then((data) => {
      if (isMounted) {
        setProducts(data);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const taxonomy = useMemo(() => buildTaxonomy(products), [products]);
  const availableCategories = useMemo(() => taxonomy.categories.map((c) => c.name), [taxonomy]);

  const formattedProducts = useMemo(() => {
    return products.map((p) => ({
      id: p.id,
      handle: p.handle,
      name: p.title,
      price: p.priceRange?.minVariantPrice?.amount
        ? parseFloat(p.priceRange.minVariantPrice.amount)
        : 0,
      currency: p.priceRange?.minVariantPrice?.currencyCode || "MXN",
      image:
        p.featuredImage?.url ||
        "https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=400",
      categories: p.categories || ["Catálogo General"],
      types: p.types && p.types.length > 0 ? p.types : ["General"]
    }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return formattedProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "" ||
        product.categories.some((cat) => cat.toLowerCase() === selectedCategory.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [formattedProducts, searchQuery, selectedCategory, maxPrice]);

  return (
    <main className="flex-1 pt-32 lg:pt-48 pb-24 bg-background-light">
      <div className="mx-auto max-w-[1536px] px-6 lg:px-12">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-primary/5 pb-8">
          <div>
            <h2 className="font-display text-4xl font-bold text-primary lg:text-5xl">Catálogo de Ocasiones</h2>
            <div className="mt-4 h-1.5 w-24 bg-accent-gold rounded-full"></div>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/40">
              CELEBRACIONES Y MOMENTOS ESPECIALES
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">
              {filteredProducts.length} PRODUCTOS
            </span>
          </div>
        </div>

        <OccasionFilters
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          price={maxPrice}
          onSearch={setSearchQuery}
          onCategory={setSelectedCategory}
          onPrice={setMaxPrice}
          onClear={() => {
            setSearchQuery("");
            setSelectedCategory("");
            setMaxPrice(10000);
          }}
        />

        {isLoading ? (
          <div className="py-24 text-center">
            <span className="material-symbols-outlined text-6xl text-primary/30 animate-spin mb-4">
              autorenew
            </span>
            <p className="font-display text-2xl italic text-primary/60">Cargando productos de Shopify...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          (availableCategories.length > 0 ? availableCategories : ["Ocasiones Especiales"]).map((catName) => {
            const productsInCat = filteredProducts.filter((p) =>
              p.categories.some((c) => c.toLowerCase() === catName.toLowerCase())
            );
            if (productsInCat.length === 0) return null;
            return <ProductSection key={catName} title={catName} products={productsInCat} />;
          })
        ) : (
          <div className="py-24 text-center">
            <span className="material-symbols-outlined text-6xl text-primary/20 mb-4">search_off</span>
            <p className="font-display text-2xl italic text-primary/60">No se encontraron productos para esta ocasión.</p>
          </div>
        )}
      </div>
    </main>
  );
};

const OcasionesCatalog = () => {
  return (
    <Suspense
      fallback={
        <div className="flex-1 pt-32 lg:pt-48 pb-24 bg-background-light text-center">
          <p className="font-display text-2xl italic text-primary/60">Cargando productos...</p>
        </div>
      }
    >
      <OcasionesCatalogContent />
    </Suspense>
  );
};

export default OcasionesCatalog;
