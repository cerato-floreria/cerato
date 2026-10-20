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
import { isDeliverySlotAvailable } from "@/lib/delivery";

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
  // Delivery Schedule & Dedication fields (Order-level)
  deliveryDate: string;
  setDeliveryDate: (date: string) => void;
  deliveryTimeSlot: string;
  setDeliveryTimeSlot: (slot: string) => void;
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

  // Delivery Schedule & Dedication States
  const [deliveryDate, setDeliveryDateState] = useState<string>("");
  const [deliveryTimeSlot, setDeliveryTimeSlotState] = useState<string>("");
  const [deliveryNotes, setDeliveryNotesState] = useState<string>("");
  const [cardMessage, setCardMessageState] = useState<string>("");

  const setDeliveryDate = useCallback((date: string) => {
    const clean = sanitizeOrderText(date, 30);
    setDeliveryDateState(clean);
  }, []);

  const setDeliveryTimeSlot = useCallback((slot: string) => {
    const clean = sanitizeOrderText(slot, 100);
    setDeliveryTimeSlotState(clean);
  }, []);

  const setDeliveryNotes = useCallback((notes: string) => {
    const value = typeof notes === "string" ? notes.slice(0, 500) : "";
    setDeliveryNotesState(value);
    try {
      localStorage.setItem("cerato_delivery_notes", value);
    } catch {}
  }, []);

  const setCardMessage = useCallback((msg: string) => {
    const value = typeof msg === "string" ? msg.slice(0, 500) : "";
    setCardMessageState(value);
    try {
      localStorage.setItem("cerato_card_message", value);
    } catch {}
  }, []);

  useEffect(() => {
    // Clear legacy preselected date/slot to guarantee fresh user selection
    try {
      localStorage.removeItem("cerato_delivery_date");
      localStorage.removeItem("cerato_delivery_slot");
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
          const dateAttr = existingCart.attributes?.find(
            (a) => a.key === "Fecha de entrega (ISO)"
          );
          if (dateAttr?.value) {
            setDeliveryDateState(dateAttr.value);
          }
          const slotAttr = existingCart.attributes?.find(
            (a) => a.key === "Horario de entrega"
          );
          if (slotAttr?.value) {
            setDeliveryTimeSlotState(slotAttr.value);
          }
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

    if (!deliveryDate) {
      return {
        success: false,
        error: "Por favor selecciona un día de entrega en el calendario."
      };
    }

    if (!deliveryTimeSlot) {
      return {
        success: false,
        error: "Por favor selecciona un horario de entrega disponible."
      };
    }

    if (!isDeliverySlotAvailable(deliveryDate, deliveryTimeSlot)) {
      return {
        success: false,
        error: "El día u horario seleccionado no está disponible (mínimo 24 hrs de anticipación)."
      };
    }

    setIsLoading(true);
    try {
      const result = await saveCartNotesAction({
        cartId: cart.id,
        deliveryDate,
        deliveryTimeSlot,
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
        deliveryDate,
        setDeliveryDate,
        deliveryTimeSlot,
        setDeliveryTimeSlot,
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

