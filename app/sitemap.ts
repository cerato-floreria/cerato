import { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/shopify";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://cerato-arte-floral.myshopify.com";

  const products = await getAllProducts();

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/producto/${product.handle}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0
    },
    {
      url: `${baseUrl}/flores`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9
    },
    {
      url: `${baseUrl}/ocasiones`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/regalos-y-mas`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8
    },
    {
      url: `${baseUrl}/eventos-y-bodas`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${baseUrl}/politica-de-envios`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6
    }
  ];

  return [...staticUrls, ...productUrls];
}
