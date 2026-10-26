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
  shippingAddress: string;
  setShippingAddress: (addr: string) => void;
  neighborhood: string;
  setNeighborhood: (n: string) => void;
  postalCode: string;
  setPostalCode: (cp: string) => void;
  senderPhone: string;
  setSenderPhone: (phone: string) => void;
  recipientPhone: string;
  setRecipientPhone: (phone: string) => void;
  cardFrom: string;
  setCardFrom: (from: string) => void;
  cardTo: string;
  setCardTo: (to: string) => void;
  cardMessage: string;
  setCardMessage: (msg: string) => void;
  cardSignature: string;
  setCardSignature: (sig: string) => void;
  saveNotesAndProceedToCheckout: (options?: { acceptedTerms?: boolean }) => Promise<{
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
  const [shippingAddress, setShippingAddressState] = useState<string>("");
  const [neighborhood, setNeighborhoodState] = useState<string>("");
  const [postalCode, setPostalCodeState] = useState<string>("");
  const [senderPhone, setSenderPhoneState] = useState<string>("");
  const [recipientPhone, setRecipientPhoneState] = useState<string>("");
  const [cardFrom, setCardFromState] = useState<string>("");
  const [cardTo, setCardToState] = useState<string>("");
  const [cardMessage, setCardMessageState] = useState<string>("");
  const [cardSignature, setCardSignatureState] = useState<string>("");

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

  const setShippingAddress = useCallback((addr: string) => {
    const value = typeof addr === "string" ? addr.slice(0, 300) : "";
    setShippingAddressState(value);
    try {
      localStorage.setItem("cerato_shipping_address", value);
    } catch {}
  }, []);

  const setNeighborhood = useCallback((n: string) => {
    const value = typeof n === "string" ? n.slice(0, 150) : "";
    setNeighborhoodState(value);
    try {
      localStorage.setItem("cerato_neighborhood", value);
    } catch {}
  }, []);

  const setPostalCode = useCallback((cp: string) => {
    const value = typeof cp === "string" ? cp.slice(0, 20) : "";
    setPostalCodeState(value);
    try {
      localStorage.setItem("cerato_postal_code", value);
    } catch {}
  }, []);

  const setSenderPhone = useCallback((phone: string) => {
    const value = typeof phone === "string" ? phone.slice(0, 30) : "";
    setSenderPhoneState(value);
    try {
      localStorage.setItem("cerato_sender_phone", value);
    } catch {}
  }, []);

  const setRecipientPhone = useCallback((phone: string) => {
    const value = typeof phone === "string" ? phone.slice(0, 30) : "";
    setRecipientPhoneState(value);
    try {
      localStorage.setItem("cerato_recipient_phone", value);
    } catch {}
  }, []);

  const setCardFrom = useCallback((from: string) => {
    const value = typeof from === "string" ? from.slice(0, 100) : "";
    setCardFromState(value);
    try {
      localStorage.setItem("cerato_card_from", value);
    } catch {}
  }, []);

  const setCardTo = useCallback((to: string) => {
    const value = typeof to === "string" ? to.slice(0, 100) : "";
    setCardToState(value);
    try {
      localStorage.setItem("cerato_card_to", value);
    } catch {}
  }, []);

  const setCardMessage = useCallback((msg: string) => {
    const value = typeof msg === "string" ? msg.slice(0, 500) : "";
    setCardMessageState(value);
    try {
      localStorage.setItem("cerato_card_message", value);
    } catch {}
  }, []);

  const setCardSignature = useCallback((sig: string) => {
    const value = typeof sig === "string" ? sig.slice(0, 100) : "";
    setCardSignatureState(value);
    try {
      localStorage.setItem("cerato_card_signature", value);
    } catch {}
  }, []);

  useEffect(() => {
    // Clear legacy preselected date/slot to guarantee fresh user selection
    try {
      localStorage.removeItem("cerato_delivery_date");
      localStorage.removeItem("cerato_delivery_slot");
      const savedDel = localStorage.getItem("cerato_delivery_notes");
      if (savedDel) setDeliveryNotesState(savedDel);
      const savedCardFrom = localStorage.getItem("cerato_card_from");
      if (savedCardFrom) setCardFromState(savedCardFrom);
      const savedCardTo = localStorage.getItem("cerato_card_to");
      if (savedCardTo) setCardToState(savedCardTo);
      const savedCard = localStorage.getItem("cerato_card_message");
      if (savedCard) setCardMessageState(savedCard);
      const savedCardSig = localStorage.getItem("cerato_card_signature");
      if (savedCardSig) setCardSignatureState(savedCardSig);
      const savedShip = localStorage.getItem("cerato_shipping_address");
      if (savedShip) setShippingAddressState(savedShip);
      const savedNeigh = localStorage.getItem("cerato_neighborhood");
      if (savedNeigh) setNeighborhoodState(savedNeigh);
      const savedCp = localStorage.getItem("cerato_postal_code");
      if (savedCp) setPostalCodeState(savedCp);
      const savedSendPhone = localStorage.getItem("cerato_sender_phone");
      if (savedSendPhone) setSenderPhoneState(savedSendPhone);
      const savedRecPhone = localStorage.getItem("cerato_recipient_phone");
      if (savedRecPhone) setRecipientPhoneState(savedRecPhone);
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
          const fromAttr = existingCart.attributes?.find(
            (a) => a.key === "De (Remitente)"
          );
          if (fromAttr?.value) {
            setCardFromState(fromAttr.value);
          }
          const toAttr = existingCart.attributes?.find(
            (a) => a.key === "Para (Destinatario)"
          );
          if (toAttr?.value) {
            setCardToState(toAttr.value);
          }
          const cardAttr = existingCart.attributes?.find(
            (a) => a.key === "Dedicatoria para la tarjeta"
          );
          if (cardAttr?.value) {
            setCardMessageState(cardAttr.value);
          }
          const sigAttr = existingCart.attributes?.find(
            (a) => a.key === "Firma de la tarjeta"
          );
          if (sigAttr?.value) {
            setCardSignatureState(sigAttr.value);
          }
          const shipAttr = existingCart.attributes?.find(
            (a) => a.key === "Dirección de entrega"
          );
          if (shipAttr?.value) {
            setShippingAddressState(shipAttr.value);
          }
          const neighAttr = existingCart.attributes?.find(
            (a) => a.key === "Colonia / Barrio"
          );
          if (neighAttr?.value) {
            setNeighborhoodState(neighAttr.value);
          }
          const cpAttr = existingCart.attributes?.find(
            (a) => a.key === "Código Postal"
          );
          if (cpAttr?.value) {
            setPostalCodeState(cpAttr.value);
          }
          const sendPhoneAttr = existingCart.attributes?.find(
            (a) => a.key === "Teléfono quien manda"
          );
          if (sendPhoneAttr?.value) {
            setSenderPhoneState(sendPhoneAttr.value);
          }
          const recPhoneAttr = existingCart.attributes?.find(
            (a) => a.key === "Teléfono quien recibe"
          );
          if (recPhoneAttr?.value) {
            setRecipientPhoneState(recPhoneAttr.value);
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

  const saveNotesAndProceedToCheckout = async (options?: {
    acceptedTerms?: boolean;
  }): Promise<{
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

    if (!cardFrom.trim()) {
      return {
        success: false,
        error: 'Por favor indica de parte de quién es el detalle ("De:").'
      };
    }

    if (!cardTo.trim()) {
      return {
        success: false,
        error: 'Por favor indica para quién es el detalle ("Para:").'
      };
    }

    setIsLoading(true);
    try {
      const result = await saveCartNotesAction({
        cartId: cart.id,
        deliveryDate,
        deliveryTimeSlot,
        deliveryNotes: deliveryNotes.trim(),
        shippingAddress: shippingAddress.trim(),
        neighborhood: neighborhood.trim(),
        postalCode: postalCode.trim(),
        senderPhone: senderPhone.trim(),
        recipientPhone: recipientPhone.trim(),
        cardFrom: cardFrom.trim(),
        cardTo: cardTo.trim(),
        cardMessage: cardMessage.trim(),
        cardSignature: cardSignature.trim(),
        acceptedTerms: Boolean(options?.acceptedTerms)
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
        shippingAddress,
        setShippingAddress,
        neighborhood,
        setNeighborhood,
        postalCode,
        setPostalCode,
        senderPhone,
        setSenderPhone,
        recipientPhone,
        setRecipientPhone,
        cardFrom,
        setCardFrom,
        cardTo,
        setCardTo,
        cardMessage,
        setCardMessage,
        cardSignature,
        setCardSignature,
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

