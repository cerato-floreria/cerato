import React from "react";
import { notFound } from "next/navigation";
import { getProductsAction } from "@/app/actions/shopify";
import { buildTaxonomy, slugifyCategory } from "@/lib/shopify";
import CategoryClientPage from "./CategoryClientPage";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const products = await getProductsAction();
  const taxonomy = buildTaxonomy(products);

  const matchedCat = taxonomy.categories.find(
    (c) => slugifyCategory(c.name) === slug.toLowerCase()
  );

  if (!matchedCat) {
    return {
      title: "Catálogo no encontrado | Cerato Floral"
    };
  }

  return {
    title: `Catálogo ${matchedCat.name} | Cerato Floral`,
    description: `Explora nuestro catálogo exclusivo de ${matchedCat.name} en Cerato Floral León, Guanajuato. Arreglos florales de lujo con entrega a domicilio.`,
    alternates: {
      canonical: `/categoria/${slug}`
    },
    openGraph: {
      title: `Catálogo ${matchedCat.name} | Cerato Floral`,
      description: `Diseños florales y regalos exclusivos en León, Guanajuato.`,
      url: `https://cerato-arte-floral.myshopify.com/categoria/${slug}`
    }
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const products = await getProductsAction();
  const taxonomy = buildTaxonomy(products);

  const matchedCat = taxonomy.categories.find(
    (c) => slugifyCategory(c.name) === slug.toLowerCase()
  );

  if (!matchedCat) {
    notFound();
  }

  return (
    <CategoryClientPage
      categoryName={matchedCat.name}
      subtypes={matchedCat.subtypes}
      allProducts={products}
    />
  );
}

export async function generateStaticParams() {
  const products = await getProductsAction();
  const taxonomy = buildTaxonomy(products);

  return taxonomy.categories.map((cat) => ({
    slug: slugifyCategory(cat.name)
  }));
}
