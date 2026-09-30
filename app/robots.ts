import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://cerato-arte-floral.myshopify.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/checkout"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}
