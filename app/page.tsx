import Hero from "@/components/Hero";
import MosaicGallery from "@/components/MosaicGallery";
import FeaturedProducts from "@/components/FeaturedProducts";
import EventsShowcase from "@/components/EventsShowcase";

export default function Home() {
  return (
    <div className="relative flex flex-col">
      <Hero />
      <MosaicGallery />
      <FeaturedProducts />
      <EventsShowcase />
    </div>
  );
}


