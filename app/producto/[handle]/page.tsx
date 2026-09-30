import React from "react";
import { notFound } from "next/navigation";
import { getProductByHandle, getAllProducts, toPascalCase } from "@/lib/shopify";
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

  const titleFormatted = toPascalCase(product.title);
  const imageUrl = product.featuredImage?.url;

  return {
    title: `${titleFormatted} | Cerato Floral Arte Floral`,
    description: product.description || `Adquiere ${titleFormatted} en Cerato Floral con entrega local en León, Guanajuato.`,
    alternates: {
      canonical: `/producto/${product.handle}`
    },
    openGraph: {
      title: `${titleFormatted} | Cerato Floral`,
      description: product.description,
      url: `https://cerato-arte-floral.myshopify.com/producto/${product.handle}`,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: titleFormatted
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

  const titleFormatted = toPascalCase(product.title);

  const imagesSet = new Set<string>();
  if (product.featuredImage?.url) {
    imagesSet.add(product.featuredImage.url);
  }
  (product.images?.edges || []).forEach((e) => {
    if (e.node?.url) imagesSet.add(e.node.url);
  });
  (product.variants?.edges || []).forEach((e) => {
    if (e.node?.image?.url) imagesSet.add(e.node.image.url);
  });

  const imageUrls = Array.from(imagesSet);

  const variants = (product.variants?.edges || []).map((e) => ({
    id: e.node.id,
    title: toPascalCase(e.node.title),
    price: e.node.price?.amount ? parseFloat(e.node.price.amount) : 0,
    currency: e.node.price?.currencyCode || "MXN",
    availableForSale: e.node.availableForSale ?? true,
    image: e.node.image?.url || null
  }));

  const formattedProduct = {
    id: product.id,
    handle: product.handle,
    variantId: product.variants?.edges[0]?.node?.id || product.id,
    name: titleFormatted,
    price: product.priceRange?.minVariantPrice?.amount
      ? parseFloat(product.priceRange.minVariantPrice.amount)
      : 0,
    currency: product.priceRange?.minVariantPrice?.currencyCode || "MXN",
    category: product.categories?.[0] || "Colección Cerato",
    tag: product.tags?.[0] || "Edición Limitada",
    description: product.description,
    longDescription: product.description,
    availableForSale: product.availableForSale ?? true,
    images: imageUrls,
    variants
  };

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": titleFormatted,
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
