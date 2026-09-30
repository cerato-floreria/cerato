export interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

export interface CategoryTypePair {
  category: string;
  type: string;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  tags: string[];
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  featuredImage?: ShopifyImage | null;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants?: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: MoneyV2;
      };
    }>;
  };
  // Parsed metadata fields from tags
  categories?: string[];
  types?: string[];
  categoryPairs?: CategoryTypePair[];
  temporada?: string[];
  isFeatured?: boolean;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ShopifyImage | null;
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  cost: {
    totalAmount: MoneyV2;
  };
  merchandise: {
    id: string;
    title: string;
    product: ShopifyProduct;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
    totalTaxAmount?: MoneyV2 | null;
  };
  lines: {
    edges: Array<{
      node: CartItem;
    }>;
  };
  totalQuantity: number;
}

export interface CategorySubItem {
  type: string;
  products: ShopifyProduct[];
}

export interface NavigationCategory {
  name: string;
  subtypes: CategorySubItem[];
}

export interface TaxonomyData {
  categories: NavigationCategory[];
  temporadaCollections: Map<string, ShopifyProduct[]>;
  featuredProducts: ShopifyProduct[];
}
