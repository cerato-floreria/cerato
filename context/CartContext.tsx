"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart } from "@/lib/shopify/types";
import {
  addToCartAction,
  updateCartItemAction,
  removeFromCartAction,
  getCartAction
} from "@/app/actions/cart";

interface CartContextType {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  checkoutUrl: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cartId = localStorage.getItem("shopify_cart_id");
    if (cartId) {
      getCartAction(cartId).then((existingCart) => {
        if (existingCart) {
          setCart(existingCart);
        } else {
          localStorage.removeItem("shopify_cart_id");
        }
      });
    }
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = async (variantId: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      const currentCartId = cart?.id || localStorage.getItem("shopify_cart_id") || "";
      const updatedCart = await addToCartAction(currentCartId, variantId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
        localStorage.setItem("shopify_cart_id", updatedCart.id);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Cart Context Add Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const updatedCart = await updateCartItemAction(cart.id, lineId, quantity);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Cart Context Update Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (lineId: string) => {
    if (!cart?.id) return;
    setIsLoading(true);
    try {
      const updatedCart = await removeFromCartAction(cart.id, lineId);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch (error) {
      console.error("Cart Context Remove Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        updateItemQuantity,
        removeItem,
        checkoutUrl: cart?.checkoutUrl || null
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
