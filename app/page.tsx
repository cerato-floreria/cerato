import Hero from "@/components/Hero";
import MosaicGallery from "@/components/MosaicGallery";
import SeasonalSection from "@/components/SeasonalSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import EventsShowcase from "@/components/EventsShowcase";
import { getProductsAction, getSeasonalCollectionAction } from "@/app/actions/shopify";
import { buildTaxonomy, slugifyCategory } from "@/lib/shopify";

export default async function Home() {
  const [products, seasonalCollection] = await Promise.all([
    getProductsAction(),
    getSeasonalCollectionAction(),
  ]);

  const taxonomy = buildTaxonomy(products);
  const matchedCat = taxonomy.categories.find(
    (c) => slugifyCategory(c.name) === "que-quieres-decir"
  );
  const subcategories = matchedCat?.subtypes || [];

  return (
    <div className="relative flex flex-col">
      <Hero initialProducts={products} />
      <MosaicGallery subcategories={subcategories} />
      <SeasonalSection collection={seasonalCollection} />
      <FeaturedProducts />
      <EventsShowcase />
    </div>
  );
}


