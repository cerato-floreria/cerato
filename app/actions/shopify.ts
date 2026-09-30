"use server";

import {
  getAllProducts,
  getProductByHandle,
  buildTaxonomy,
  getMockProducts,
  parseProductTags
} from "@/lib/shopify";
import { ShopifyProduct, TaxonomyData } from "@/lib/shopify/types";

/**
 * Server Action to fetch all products from Shopify.
 * Runs on the Node.js server where process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN is accessible.
 */
export async function getProductsAction(): Promise<ShopifyProduct[]> {
  try {
    return await getAllProducts();
  } catch (error) {
    console.error("Error in getProductsAction:", error);
    return getMockProducts().map(parseProductTags);
  }
}

/**
 * Server Action to fetch a product by handle from Shopify.
 */
export async function getProductByHandleAction(handle: string): Promise<ShopifyProduct | null> {
  try {
    return await getProductByHandle(handle);
  } catch (error) {
    console.error("Error in getProductByHandleAction:", error);
    return null;
  }
}

/**
 * Server Action to fetch navigation taxonomy derived from Shopify product tags.
 */
export async function getTaxonomyAction(): Promise<TaxonomyData> {
  try {
    const products = await getAllProducts();
    return buildTaxonomy(products);
  } catch (error) {
    console.error("Error in getTaxonomyAction:", error);
    const mock = getMockProducts();
    return buildTaxonomy(mock);
  }
}
