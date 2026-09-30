import type { Metadata } from "next";
import { Noto_Serif, Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import Script from "next/script";
import { CartProvider } from "@/context/CartContext";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cerato-arte-floral.myshopify.com"),
  title: {
    default: "Cerato Floral | Arte Floral Premium en León, Guanajuato",
    template: "%s | Cerato Floral"
  },
  description: "Diseños florales exclusivos y de lujo en León, Guanajuato. Ramos, arreglos para eventos y regalos curados con entrega a domicilio.",
  keywords: [
    "cerato floral",
    "arreglos florales león guanajuato",
    "flores a domicilio león",
    "diseño floral premium",
    "ramos de novias león",
    "bodas y eventos guanajuato",
    "arte floral"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Cerato Floral | Arte Floral Premium",
    description: "Diseños florales exclusivos y de lujo para momentos inolvidables en León, Guanajuato.",
    url: "https://cerato-arte-floral.myshopify.com",
    siteName: "Cerato Floral",
    images: [
      {
        url: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7SQC5j2SEbPXUk-uVjoIycUIAcdLn5giMTeCvOzKcaxZaGipSYEDgUFtI87kuy6f9b7RXXzuOBPvluWIhX1yaMr08jSkZqWEgoVqgWEd4ZtBNutaXlmAIAex4WOjgX-fp5lZPGpwRJTcEB2whflMKpzxhJdk4wg8304iHUyX6VdP_tMhrOl_Cgfn2v68C3bGgHrZQ76SYejV12M9ut2nQQyOE9xVU96CsKabi79TALniCPrmEfBTpWzPFNV6KrGX54DLutPIp5Q",
        width: 1200,
        height: 630,
        alt: "Cerato Floral - Arte Floral Premium"
      }
    ],
    locale: "es_MX",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Cerato Floral | Arte Floral Premium",
    description: "Diseños florales exclusivos y de lujo para momentos inolvidables.",
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7SQC5j2SEbPXUk-uVjoIycUIAcdLn5giMTeCvOzKcaxZaGipSYEDgUFtI87kuy6f9b7RXXzuOBPvluWIhX1yaMr08jSkZqWEgoVqgWEd4ZtBNutaXlmAIAex4WOjgX-fp5lZPGpwRJTcEB2whflMKpzxhJdk4wg8304iHUyX6VdP_tMhrOl_Cgfn2v68C3bGgHrZQ76SYejV12M9ut2nQQyOE9xVU96CsKabi79TALniCPrmEfBTpWzPFNV6KrGX54DLutPIp5Q"
    ]
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Florist",
  "name": "Cerato Floral",
  "url": "https://cerato-arte-floral.myshopify.com",
  "logo": "https://lh3.googleusercontent.com/aida-public/AB6AXuB7SQC5j2SEbPXUk-uVjoIycUIAcdLn5giMTeCvOzKcaxZaGipSYEDgUFtI87kuy6f9b7RXXzuOBPvluWIhX1yaMr08jSkZqWEgoVqgWEd4ZtBNutaXlmAIAex4WOjgX-fp5lZPGpwRJTcEB2whflMKpzxhJdk4wg8304iHUyX6VdP_tMhrOl_Cgfn2v68C3bGgHrZQ76SYejV12M9ut2nQQyOE9xVU96CsKabi79TALniCPrmEfBTpWzPFNV6KrGX54DLutPIp5Q",
  "description": "Arte floral premium y exclusivo en León, Guanajuato.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "León",
    "addressRegion": "Guanajuato",
    "addressCountry": "MX"
  },
  "sameAs": [
    "https://www.instagram.com/cerato.artefloral/",
    "https://www.facebook.com/cerato.artefloral/?locale=es_LA",
    "https://www.tiktok.com/@cerato.artefloral"
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${notoSerif.variable} ${notoSans.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        />
      </head>

      <body className="min-h-screen flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingActions />
        </CartProvider>
      </body>
    </html>
  );
}
