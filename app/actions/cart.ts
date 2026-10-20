"use server";

import {
  createCart,
  addToCart,
  updateCartQuantity,
  updateCartLines,
  updateCartAttributes,
  removeFromCart,
  getCart
} from "@/lib/shopify";
import { Cart } from "@/lib/shopify/types";
import { sanitizeOrderText, isValidShopifyId } from "@/lib/security";
import { formatDeliveryDateHuman, isDeliverySlotAvailable } from "@/lib/delivery";

export interface SaveCartNotesParams {
  cartId: string;
  deliveryDate?: string;
  deliveryTimeSlot?: string;
  deliveryNotes?: string;
  cardMessage?: string;
  acceptedTerms?: boolean;
  lineAttributes?: Array<{
    lineId: string;
    quantity?: number;
    attributes: Array<{ key: string; value: string }>;
  }>;
}

export interface SaveCartNotesResult {
  success: boolean;
  cart: Cart | null;
  error?: string;
}

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

export async function saveCartNotesAction(
  params: SaveCartNotesParams
): Promise<SaveCartNotesResult> {
  try {
    const {
      cartId,
      deliveryDate = "",
      deliveryTimeSlot = "",
      deliveryNotes = "",
      cardMessage = "",
      acceptedTerms = false,
      lineAttributes = []
    } = params;

    // 1. Strict ID format validation to prevent injection
    if (!cartId || !isValidShopifyId(cartId)) {
      return { success: false, cart: null, error: "Identificador de carrito inválido." };
    }

    // 2. Strict text sanitization: strip script/HTML tags, bidi characters, null bytes, collapse newlines, cap length
    const cleanDate = sanitizeOrderText(deliveryDate, 30);
    const cleanSlot = sanitizeOrderText(deliveryTimeSlot, 100);
    const cleanDeliveryNotes = sanitizeOrderText(deliveryNotes, 500);
    const cleanCardMessage = sanitizeOrderText(cardMessage, 500);

    // 3. Strict delivery date and time slot enforcement
    if (!cleanDate) {
      return {
        success: false,
        cart: null,
        error: "Por favor selecciona un día de entrega en el calendario."
      };
    }

    if (!cleanSlot) {
      return {
        success: false,
        cart: null,
        error: "Por favor selecciona un horario de entrega disponible."
      };
    }

    if (!isDeliverySlotAvailable(cleanDate, cleanSlot)) {
      return {
        success: false,
        cart: null,
        error: "El día u horario seleccionado no está disponible (mínimo 24 hrs de anticipación)."
      };
    }

    const attributes: Array<{ key: string; value: string }> = [];

    // Delivery Date & Slot attributes
    const humanDate = formatDeliveryDateHuman(cleanDate);
    attributes.push({ key: "Fecha de entrega", value: humanDate || cleanDate });
    attributes.push({ key: "Fecha de entrega (ISO)", value: cleanDate });
    attributes.push({ key: "Horario de entrega", value: cleanSlot });
    if (cleanDeliveryNotes) {
      attributes.push({ key: "Instrucciones de entrega", value: cleanDeliveryNotes });
    }
    if (cleanCardMessage) {
      attributes.push({ key: "Dedicatoria para la tarjeta", value: cleanCardMessage });
    }
    if (acceptedTerms) {
      attributes.push({ key: "Términos perecederos aceptados", value: "Sí" });
    }

    // Summary note for Shopify Admin Order details
    const noteParts: string[] = [];
    if (cleanDate) {
      const humanDate = formatDeliveryDateHuman(cleanDate);
      noteParts.push(`Fecha de entrega: ${humanDate || cleanDate}`);
    }
    if (cleanSlot) {
      noteParts.push(`Horario: ${cleanSlot}`);
    }
    if (acceptedTerms) {
      noteParts.push("Términos perecederos: Aceptados");
    }
    if (cleanDeliveryNotes) {
      noteParts.push(`Instrucciones: ${cleanDeliveryNotes}`);
    }
    if (cleanCardMessage) {
      noteParts.push(`Dedicatoria: ${cleanCardMessage}`);
    }
    const combinedNote = noteParts.join(" | ");

    let currentCart: Cart | null = null;

    // 3. Sanitize and validate line item attributes
    const validLineUpdates: Array<{
      lineId: string;
      quantity?: number;
      attributes: Array<{ key: string; value: string }>;
    }> = [];

    for (const item of lineAttributes) {
      if (!item.lineId || !isValidShopifyId(item.lineId)) continue;

      const cleanItemAttrs: Array<{ key: string; value: string }> = [];
      for (const attr of item.attributes || []) {
        const cleanKey = sanitizeOrderText(attr.key, 50);
        const cleanVal = sanitizeOrderText(attr.value, 500);
        if (cleanKey && cleanVal) {
          cleanItemAttrs.push({ key: cleanKey, value: cleanVal });
        }
      }

      if (cleanItemAttrs.length > 0) {
        validLineUpdates.push({
          lineId: item.lineId,
          quantity: item.quantity,
          attributes: cleanItemAttrs
        });
      }
    }

    if (validLineUpdates.length > 0) {
      const lineRes = await updateCartLines(
        cartId,
        validLineUpdates.map((la) => ({
          id: la.lineId,
          quantity: la.quantity,
          attributes: la.attributes
        }))
      );
      if (lineRes.userErrors && lineRes.userErrors.length > 0) {
        console.error("Error saving line attributes in Shopify:", lineRes.userErrors);
        return {
          success: false,
          cart: null,
          error: lineRes.userErrors[0]?.message || "Error al guardar la dedicatoria del producto."
        };
      }
      currentCart = lineRes.cart;
    }

    // 4. Update cart attributes and note in Shopify
    if (attributes.length > 0 || combinedNote) {
      const attrRes = await updateCartAttributes(cartId, attributes, combinedNote);
      if (attrRes.userErrors && attrRes.userErrors.length > 0) {
        console.error("Error saving cart attributes in Shopify:", attrRes.userErrors);
        return {
          success: false,
          cart: currentCart,
          error: attrRes.userErrors[0]?.message || "Error al guardar las notas del pedido en Shopify."
        };
      }
      if (attrRes.cart) {
        currentCart = attrRes.cart;
      }
    }

    if (!currentCart) {
      currentCart = await getCart(cartId);
    }

    return { success: true, cart: currentCart };
  } catch (error) {
    console.error("Error in saveCartNotesAction:", error);
    return {
      success: false,
      cart: null,
      error: "Hubo un error de conexión al guardar los detalles en Shopify. Por favor intenta de nuevo."
    };
  }
}
