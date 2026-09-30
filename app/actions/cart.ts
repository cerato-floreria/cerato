"use server";

import {
  createCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  getCart
} from "@/lib/shopify";
import { Cart } from "@/lib/shopify/types";

export async function createCartAction(): Promise<Cart | null> {
  try {
    return await createCart();
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
      const newCart = await createCart();
      if (!newCart) return null;
      return await addToCart(newCart.id, variantId, quantity);
    }
    return await addToCart(cartId, variantId, quantity);
  } catch (error) {
    console.error("Error adding to cart:", error);
    return null;
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
