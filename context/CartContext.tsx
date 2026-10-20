"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Cart } from "@/lib/shopify/types";
import {
  addToCartAction,
  updateCartItemAction,
  removeFromCartAction,
  getCartAction,
  saveCartNotesAction
} from "@/app/actions/cart";
import { sanitizeOrderText } from "@/lib/security";

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
  // Delivery & Dedication fields (Order-level)
  deliveryNotes: string;
  setDeliveryNotes: (notes: string) => void;
  cardMessage: string;
  setCardMessage: (msg: string) => void;
  saveNotesAndProceedToCheckout: () => Promise<{
    success: boolean;
    checkoutUrl?: string;
    error?: string;
  }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Delivery & Dedication States
  const [deliveryNotes, setDeliveryNotesState] = useState<string>("");
  const [cardMessage, setCardMessageState] = useState<string>("");

  const setDeliveryNotes = useCallback((notes: string) => {
    const clean = sanitizeOrderText(notes, 500);
    setDeliveryNotesState(clean);
    try {
      localStorage.setItem("cerato_delivery_notes", clean);
    } catch {}
  }, []);

  const setCardMessage = useCallback((msg: string) => {
    const clean = sanitizeOrderText(msg, 500);
    setCardMessageState(clean);
    try {
      localStorage.setItem("cerato_card_message", clean);
    } catch {}
  }, []);

  useEffect(() => {
    // Restore locally saved notes on mount
    try {
      const savedDel = localStorage.getItem("cerato_delivery_notes");
      if (savedDel) setDeliveryNotesState(savedDel);
      const savedCard = localStorage.getItem("cerato_card_message");
      if (savedCard) setCardMessageState(savedCard);
    } catch {}

    const cartId = localStorage.getItem("shopify_cart_id");
    if (cartId) {
      getCartAction(cartId).then((existingCart) => {
        if (existingCart) {
          setCart(existingCart);
          // Sync Shopify cart attributes if available
          const delAttr = existingCart.attributes?.find(
            (a) => a.key === "Instrucciones de entrega"
          );
          if (delAttr?.value) {
            setDeliveryNotesState(delAttr.value);
          }
          const cardAttr = existingCart.attributes?.find(
            (a) => a.key === "Dedicatoria para la tarjeta"
          );
          if (cardAttr?.value) {
            setCardMessageState(cardAttr.value);
          }
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

  const saveNotesAndProceedToCheckout = async (): Promise<{
    success: boolean;
    checkoutUrl?: string;
    error?: string;
  }> => {
    if (!cart?.id) {
      return { success: false, error: "El carrito está vacío o no se ha inicializado." };
    }

    setIsLoading(true);
    try {
      const result = await saveCartNotesAction({
        cartId: cart.id,
        deliveryNotes: deliveryNotes.trim(),
        cardMessage: cardMessage.trim()
      });

      if (!result.success) {
        return {
          success: false,
          error: result.error || "No se pudieron guardar las notas en Shopify. Por favor intenta de nuevo."
        };
      }

      if (result.cart) {
        setCart(result.cart);
      }

      const finalCheckoutUrl = result.cart?.checkoutUrl || cart.checkoutUrl;
      return {
        success: true,
        checkoutUrl: finalCheckoutUrl
      };
    } catch (error) {
      console.error("Error saving cart notes:", error);
      return {
        success: false,
        error: "Error inesperado al conectar con Shopify. Por favor intenta de nuevo."
      };
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
        checkoutUrl: cart?.checkoutUrl || null,
        deliveryNotes,
        setDeliveryNotes,
        cardMessage,
        setCardMessage,
        saveNotesAndProceedToCheckout
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

