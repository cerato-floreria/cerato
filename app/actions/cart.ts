"use server";

import {
  createCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCart
} from "@/lib/shopify";
import { Cart } from "@/lib/shopify/types";

export async function createCartAction(
  variantId?: string,
  quantity: number = 1
): Promise<Cart | null> {
  try {
    const lines = variantId ? [{ merchandiseId: variantId, quantity }] : [];
    return await createCart(lines);
  } catch (error) {
    console.error("Error creating cart:", error);
    return null;
  }
}

export async function addToCartAction(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<Cart | null> {
  try {
    if (!cartId) {
      return await createCart([{ merchandiseId: variantId, quantity }]);
    }
    const result = await addToCart(cartId, variantId, quantity);
    if (!result) {
      console.warn("Existing cart ID expired or invalid, creating fresh cart...");
      return await createCart([{ merchandiseId: variantId, quantity }]);
    }
    return result;
  } catch (error) {
    console.error("Error adding to cart, falling back to fresh cart:", error);
    return await createCart([{ merchandiseId: variantId, quantity }]);
  }
}

export async function updateCartItemAction(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<Cart | null> {
  try {
    if (!cartId || !lineId) return null;
    if (quantity <= 0) {
      return await removeFromCart(cartId, [lineId]);
    }
    return await updateCartQuantity(cartId, lineId, quantity);
  } catch (error) {
    console.error("Error updating cart item:", error);
    return null;
  }
}

export async function removeFromCartAction(
  cartId: string,
  lineId: string
): Promise<Cart | null> {
  try {
    if (!cartId || !lineId) return null;
    return await removeFromCart(cartId, [lineId]);
  } catch (error) {
    console.error("Error removing cart item:", error);
    return null;
  }
}

export async function getCartAction(cartId: string): Promise<Cart | null> {
  try {
    if (!cartId) return null;
    return await getCart(cartId);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}
