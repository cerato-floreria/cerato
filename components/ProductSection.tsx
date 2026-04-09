"use client";

import React from "react";
import ProductCard from "./ProductCard";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
}

const ProductSection: React.FC<ProductSectionProps> = ({ title, products }) => {
  return (
    <section className="mb-24">
      {/* Section Header */}
      <div className="mb-12 flex items-center justify-between">
        <h3 className="font-display text-2xl lg:text-3xl italic text-primary font-bold">
          {title}
        </h3>
        <div className="h-px flex-1 bg-primary/10 ml-8"></div>
      </div>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {products.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            id={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;

