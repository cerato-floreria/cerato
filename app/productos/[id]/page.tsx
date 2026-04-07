import React from "react";
import { allProducts } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";

// Define the correct type for Next.js 15+ dynamic route params
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  // Find product by id (slug)
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-background-light">
      <ProductDetail product={product} />
    </div>
  );
}

// Optional: Generate static paths for better performance
export async function generateStaticParams() {
  return allProducts.map((product) => ({
    id: product.id,
  }));
}
