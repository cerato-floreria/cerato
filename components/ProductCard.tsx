import React from "react";
import Link from "next/link";

interface ProductCardProps {
  id: string; // Added ID for routing
  name: string;
  price: number;
  image: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, image }) => {
  return (
    <Link 
      href={`/productos/${id}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-[32px] bg-cream shadow-2xl border border-primary/5 transition-all duration-500 hover:shadow-primary/10 hover:-translate-y-2 active:scale-[0.98]"
    >
      {/* Background Image with Zoom Effect */}
      <img
        alt={name}
        className="h-full w-full object-cover transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) group-hover:scale-110"
        src={image}
      />
      
      {/* Information Overlay with Add to Cart Button */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-8 pt-20 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent transition-all duration-500">
        <div className="flex items-start justify-between mb-6">
          <h4 className="font-display text-xl font-bold text-white leading-tight drop-shadow-2xl max-w-[70%]">
            {name}
          </h4>
          <span className="text-2xl font-bold text-accent-gold drop-shadow-2xl">
            ${price.toFixed(2)}
          </span>
        </div>

        <button className="w-full rounded-2xl bg-primary py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white transition-all hover:bg-primary-dark shadow-xl backdrop-blur-sm">
          Ver Detalles
        </button>
      </div>

    </Link>
  );
};

export default ProductCard;

