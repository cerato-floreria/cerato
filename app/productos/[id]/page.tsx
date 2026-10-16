import React from "react";
import { allProducts } from "@/data/products";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";

import { Metadata } from "next";

// Define the correct type for Next.js 15+ dynamic route params
interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = allProducts.find((p) => p.id === id);

  if (!product) {
    return {
      title: "Producto no encontrado | Cerato Floral",
    };
  }

  return {
    title: `${product.name} | Cerato Floral`,
    description: product.description || `Adquiere ${product.name} en Cerato Floral con entrega local en León, Guanajuato.`,
    alternates: {
      canonical: `/productos/${product.id}`,
    },
    openGraph: {
      title: `${product.name} | Cerato Floral`,
      description: product.description,
      url: `https://cerato-arte-floral.myshopify.com/productos/${product.id}`,
      images: product.images?.[0] ? [{ url: product.images[0], alt: product.name }] : [],
    },
  };
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
