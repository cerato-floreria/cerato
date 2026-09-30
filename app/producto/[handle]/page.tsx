import React from "react";
import { notFound } from "next/navigation";
import { getProductByHandle, getAllProducts } from "@/lib/shopify";
import ProductDetail from "@/components/ProductDetail";
import Script from "next/script";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: "Producto no encontrado | Cerato Floral"
    };
  }

  const price = product.priceRange?.minVariantPrice?.amount;
  const currency = product.priceRange?.minVariantPrice?.currencyCode || "MXN";
  const imageUrl = product.featuredImage?.url;

  return {
    title: `${product.title} | Cerato Floral Arte Floral`,
    description: product.description || `Adquiere ${product.title} en Cerato Floral con entrega local en León, Guanajuato.`,
    alternates: {
      canonical: `/producto/${product.handle}`
    },
    openGraph: {
      title: `${product.title} | Cerato Floral`,
      description: product.description,
      url: `https://cerato-arte-floral.myshopify.com/producto/${product.handle}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: product.title
            }
          ]
        : []
    }
  };
}

export default async function ProductHandlePage({ params }: PageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const imageUrls = (product.images?.edges || []).map((e) => e.node.url);
  if (imageUrls.length === 0 && product.featuredImage?.url) {
    imageUrls.push(product.featuredImage.url);
  }

  const formattedProduct = {
    id: product.id,
    handle: product.handle,
    variantId: product.variants?.edges[0]?.node?.id || product.id,
    name: product.title,
    price: product.priceRange?.minVariantPrice?.amount
      ? parseFloat(product.priceRange.minVariantPrice.amount)
      : 0,
    currency: product.priceRange?.minVariantPrice?.currencyCode || "MXN",
    category: product.categories?.[0] || "Colección Cerato",
    tag: product.tags?.[0] || "Edición Limitada",
    description: product.description,
    longDescription: product.description,
    images: imageUrls
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "image": imageUrls,
    "description": product.description,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Cerato Floral"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://cerato-arte-floral.myshopify.com/producto/${product.handle}`,
      "priceCurrency": product.priceRange?.minVariantPrice?.currencyCode || "MXN",
      "price": product.priceRange?.minVariantPrice?.amount || "0.00",
      "availability": product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Cerato Floral"
      }
    }
  };

  return (
    <div className="bg-background-light">
      <Script
        id={`product-schema-${product.handle}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <ProductDetail product={formattedProduct} />
    </div>
  );
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    handle: product.handle
  }));
}
