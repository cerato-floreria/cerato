'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toPascalCase } from '@/lib/shopify';
import { CartItem } from '@/lib/shopify/types';
import {
  getUpcomingDeliveryDays,
  getAvailableSlotsForDate,
  formatDeliveryDateHuman,
  isDeliverySlotAvailable,
} from '@/lib/delivery';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    updateItemQuantity,
    removeItem,
    checkoutUrl,
    isLoading,
    deliveryDate,
    setDeliveryDate,
    deliveryTimeSlot,
    setDeliveryTimeSlot,
    deliveryNotes,
    setDeliveryNotes,
    cardFrom,
    setCardFrom,
    cardTo,
    setCardTo,
    cardMessage,
    setCardMessage,
    saveNotesAndProceedToCheckout,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [hasAttemptedCheckout, setHasAttemptedCheckout] = useState(false);

  // Reset terms acceptance whenever drawer closes so user must re-accept each purchase
  useEffect(() => {
    if (!isOpen) {
      setAcceptedTerms(false);
      setHasAttemptedCheckout(false);
      setCheckoutError(null);
    }
  }, [isOpen]);

  // Compute upcoming delivery calendar days (next 21 days)
  const upcomingDays = useMemo(() => getUpcomingDeliveryDays(21), []);

  // Compute available slots for currently selected date
  const availableSlotsForSelectedDate = useMemo(
    () => (deliveryDate ? getAvailableSlotsForDate(deliveryDate) : []),
    [deliveryDate],
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Extract lines supporting edges or direct nodes
  const lineItems = useMemo((): CartItem[] => {
    if (!cart?.lines) return [];
    if (Array.isArray(cart.lines)) return cart.lines as CartItem[];
    const linesObj = cart.lines as unknown as {
      nodes?: CartItem[];
      edges?: Array<{ node?: CartItem }>;
    };
    if (Array.isArray(linesObj.nodes)) return linesObj.nodes;
    if (Array.isArray(linesObj.edges)) {
      return linesObj.edges.map((e) => (e.node || e) as CartItem);
    }
    return [];
  }, [cart]);

  // Calculate total items count
  const totalQuantity = useMemo(() => {
    if (typeof cart?.totalQuantity === 'number' && cart.totalQuantity > 0) {
      return cart.totalQuantity;
    }
    return lineItems.reduce(
      (acc: number, item: CartItem) => acc + (item.quantity || 0),
      0,
    );
  }, [cart, lineItems]);

  // Calculate subtotal with fallbacks
  const subtotal = useMemo(() => {
    if (cart?.cost?.subtotalAmount?.amount) {
      const parsed = parseFloat(cart.cost.subtotalAmount.amount);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (cart?.cost?.totalAmount?.amount) {
      const parsed = parseFloat(cart.cost.totalAmount.amount);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return lineItems.reduce((acc: number, item: CartItem) => {
      const lineCost = item.cost?.totalAmount?.amount
        ? parseFloat(item.cost.totalAmount.amount)
        : parseFloat(item.merchandise?.price?.amount || '0') *
          (item.quantity || 1);
      return acc + (isNaN(lineCost) ? 0 : lineCost);
    }, 0);
  }, [cart, lineItems]);

  const currency =
    cart?.cost?.subtotalAmount?.currencyCode ||
    cart?.cost?.totalAmount?.currencyCode ||
    lineItems[0]?.merchandise?.price?.currencyCode ||
    'MXN';

  const handleCheckout = async () => {
    setCheckoutError(null);

    if (!deliveryDate) {
      setCheckoutError(
        'Por favor selecciona un día de entrega en el calendario.',
      );
      return;
    }

    if (!deliveryTimeSlot) {
      setCheckoutError(
        'Por favor selecciona un bloque de horario disponible para la entrega.',
      );
      return;
    }

    if (!isDeliverySlotAvailable(deliveryDate, deliveryTimeSlot)) {
      setCheckoutError(
        'El horario de entrega seleccionado no está disponible (mínimo 24 hrs de anticipación). Por favor elige otro.',
      );
      return;
    }

    if (!cardFrom.trim()) {
      setHasAttemptedCheckout(true);
      setCheckoutError(
        'Por favor completa el campo obligatorio "De:" para la tarjeta de dedicatoria.',
      );
      const fromEl = document.getElementById('cart-card-from');
      if (fromEl) {
        fromEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        fromEl.focus();
      }
      return;
    }

    if (!cardTo.trim()) {
      setHasAttemptedCheckout(true);
      setCheckoutError(
        'Por favor completa el campo obligatorio "Para:" para la tarjeta de dedicatoria.',
      );
      const toEl = document.getElementById('cart-card-to');
      if (toEl) {
        toEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        toEl.focus();
      }
      return;
    }

    if (!acceptedTerms) {
      setHasAttemptedCheckout(true);
      setCheckoutError(
        'Es necesario que marques como leído y aceptes los términos de compra para continuar al pago.',
      );
      const termsEl = document.getElementById('cart-terms-section');
      if (termsEl) {
        termsEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsCheckingOut(true);

    try {
      const res = await saveNotesAndProceedToCheckout({ acceptedTerms: true });
      if (!res.success) {
        setCheckoutError(
          res.error ||
            'No se pudieron confirmar las notas con Shopify. Por favor intenta de nuevo.',
        );
        setIsCheckingOut(false);
        return;
      }

      const finalUrl = res.checkoutUrl || checkoutUrl;
      if (finalUrl) {
        window.location.href = finalUrl;
      } else {
        setCheckoutError(
          'El enlace de pago de Shopify no está disponible en este momento.',
        );
        setIsCheckingOut(false);
      }
    } catch (err) {
      console.error('Error during checkout redirection:', err);
      setCheckoutError(
        'Ocurrió un error al preparar el pago. Por favor intenta de nuevo.',
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen
            ? 'opacity-100 visible'
            : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de compras"
        className={`fixed right-0 top-0 bottom-0 z-[130] w-full sm:w-[460px] lg:w-[36%] bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 bg-primary text-white shrink-0">
          <div className="flex flex-col">
            <h2 className="text-xl lg:text-2xl font-display font-bold tracking-tight">
              Tu Carrito {totalQuantity > 0 && `(${totalQuantity})`}
            </h2>
            <p className="text-[10px] font-sans text-white/70 uppercase tracking-[0.2em]">
              Cerato Arte Floral
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="text-white/80 hover:text-white transition-colors cursor-pointer p-2"
          >
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Content with Wave Pattern */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 bg-wave-pattern">
          <div className="flex flex-col gap-4">
            {lineItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-primary/10 mb-4">
                  shopping_bag
                </span>
                <p className="text-primary/40 font-display italic text-lg">
                  Tu carrito está vacío
                </p>
              </div>
            ) : (
              <>
                {lineItems.map((item: CartItem) => {
                  const productTitle = toPascalCase(
                    item.merchandise?.product?.title ||
                      item.merchandise?.title ||
                      'Producto Floral',
                  );
                  const rawVariantTitle = (
                    item.merchandise?.title || ''
                  ).trim();
                  const isDefaultVariant =
                    !rawVariantTitle ||
                    rawVariantTitle.toLowerCase() === 'default title' ||
                    rawVariantTitle.toLowerCase() === 'default';

                  const variantTitle = !isDefaultVariant
                    ? toPascalCase(rawVariantTitle)
                    : '';
                  const displayTitle =
                    variantTitle &&
                    variantTitle.toLowerCase() !== productTitle.toLowerCase()
                      ? `${productTitle} – ${variantTitle}`
                      : productTitle;
                  const imageUrl =
                    item.merchandise?.image?.url ||
                    item.merchandise?.product?.featuredImage?.url ||
                    'https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=200';

                  const unitPrice = parseFloat(
                    item.merchandise?.price?.amount || '0',
                  );
                  const lineTotal = item.cost?.totalAmount?.amount
                    ? parseFloat(item.cost.totalAmount.amount)
                    : !isNaN(unitPrice)
                      ? unitPrice * (item.quantity || 1)
                      : 0;

                  const itemCurrency =
                    item.cost?.totalAmount?.currencyCode ||
                    item.merchandise?.price?.currencyCode ||
                    currency;

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-primary/10 shadow-xs relative w-full"
                    >
                      {/* Fixed Square Image */}
                      <div className="w-20 h-20 min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-xl overflow-hidden bg-gray-50 border border-primary/10 shrink-0 relative">
                        <Image
                          src={imageUrl}
                          alt={displayTitle}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-0.5">
                        {/* Top Row: Title + Delete Button */}
                        <div className="flex items-start justify-between gap-2">
                          <h4
                            className="text-sm font-display font-semibold text-primary truncate block flex-1 min-w-0"
                            title={displayTitle}
                          >
                            {displayTitle}
                          </h4>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading || isCheckingOut}
                            aria-label={`Eliminar ${displayTitle} del carrito`}
                            className="text-primary/30 hover:text-red-600 transition-colors p-1 -mr-1 -mt-1 cursor-pointer shrink-0 disabled:opacity-50"
                            title="Eliminar producto"
                          >
                            <span className="material-symbols-outlined text-lg leading-none">
                              delete
                            </span>
                          </button>
                        </div>

                        {/* Bottom Row: Stepper Input + Price */}
                        <div className="flex items-center justify-between gap-2 mt-2">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-primary/15 rounded-lg bg-background-light shadow-xs overflow-hidden shrink-0">
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.id,
                                  (item.quantity || 1) - 1,
                                )
                              }
                              disabled={isLoading || isCheckingOut}
                              aria-label="Disminuir cantidad"
                              className="w-7 h-7 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40 cursor-pointer font-bold text-sm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-primary">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() =>
                                updateItemQuantity(
                                  item.id,
                                  (item.quantity || 1) + 1,
                                )
                              }
                              disabled={isLoading || isCheckingOut}
                              aria-label="Aumentar cantidad"
                              className="w-7 h-7 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40 cursor-pointer font-bold text-sm"
                            >
                              +
                            </button>
                          </div>

                          {/* Line Total Price */}
                          <div className="text-right shrink-0">
                            <span className="font-display font-bold text-sm sm:text-[15px] text-primary block whitespace-nowrap">
                              $
                              {lineTotal.toLocaleString('es-MX', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}{' '}
                              {itemCurrency}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Delivery Date & Time Slot Scheduler */}
                <div className="flex flex-col gap-3.5 bg-white p-4 sm:p-5 rounded-2xl border border-primary/10 shadow-xs mt-1">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-2.5">
                    <div className="flex items-center gap-2 text-primary font-display font-semibold text-sm">
                      <span className="material-symbols-outlined text-accent text-lg">
                        calendar_month
                      </span>
                      <span>Fecha y Horario de Entrega</span>
                    </div>
                    <span className="text-[9px] font-sans font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Mínimo 24 hrs
                    </span>
                  </div>

                  <p className="text-[11px] text-primary/65 font-sans leading-relaxed">
                    Para garantizar la máxima frescura de nuestras flores,
                    preparamos cada arreglo bajo pedido con al menos 24 hrs de
                    anticipación (Lunes a Sábado).
                  </p>

                  {/* 1. Date Selector Scroller */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-sans font-semibold text-primary/80">
                        1. Elige el día de entrega:{' '}
                        <span className="text-red-500 font-bold">*</span>
                      </label>
                      {deliveryDate ? (
                        <span className="text-[10px] text-accent font-medium truncate max-w-[50%] text-right">
                          {formatDeliveryDateHuman(deliveryDate)}
                        </span>
                      ) : (
                        <span className="text-[10px] text-accent font-semibold">
                          Selección obligatoria
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 pt-1 -mx-1 px-1">
                      {upcomingDays.map((day) => {
                        const isSelected = deliveryDate === day.dateStr;
                        const isDisabled =
                          day.isSunday || !day.hasAvailableSlots;

                        return (
                          <button
                            key={day.dateStr}
                            type="button"
                            disabled={isDisabled}
                            onClick={() => {
                              setDeliveryDate(day.dateStr);
                              // Do not preselect time slot; user must choose explicitly
                              setDeliveryTimeSlot('');
                              setCheckoutError(null);
                            }}
                            className={`flex flex-col items-center justify-center min-w-[62px] py-2 px-1 rounded-xl border text-center transition-all cursor-pointer shrink-0 ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-md scale-[1.02]'
                                : isDisabled
                                  ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
                                  : 'bg-background-light/70 hover:bg-white border-primary/15 text-primary hover:border-accent hover:shadow-xs'
                            }`}
                          >
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-accent-gold' : ''}`}
                            >
                              {day.dayName}
                            </span>
                            <span className="text-base font-display font-bold leading-tight my-0.5">
                              {day.dayNumber}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider opacity-75">
                              {day.isSunday ? 'Cerrado' : day.monthName}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Time Slot Blocks */}
                  {!deliveryDate ? (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-background-light/70 border border-dashed border-primary/20 text-primary/70 text-xs font-sans mt-1">
                      <span className="material-symbols-outlined text-accent text-lg shrink-0">
                        calendar_month
                      </span>
                      <span>
                        Primero selecciona un día disponible en el calendario
                        para elegir el horario de entrega.
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2 border-t border-primary/5">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-sans font-semibold text-primary/80">
                          2. Elige el bloque de horario:{' '}
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        {!deliveryTimeSlot && (
                          <span className="text-[10px] text-accent font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                            Selección obligatoria
                          </span>
                        )}
                      </div>

                      {availableSlotsForSelectedDate.length === 0 ? (
                        <p className="text-xs text-red-600 italic bg-red-50 p-2.5 rounded-xl border border-red-100">
                          Los domingos no se realizan entregas. Por favor elige
                          otro día de la semana.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {availableSlotsForSelectedDate.map(
                            ({ slot, isAvailable, reason }) => {
                              const isSelected =
                                deliveryTimeSlot === slot.label;
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={!isAvailable}
                                  onClick={() => {
                                    setDeliveryTimeSlot(slot.label);
                                    setCheckoutError(null);
                                  }}
                                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-sans text-left transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-accent/10 border-accent text-primary font-semibold shadow-xs ring-1 ring-accent'
                                      : !isAvailable
                                        ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-40'
                                        : 'bg-white border-primary/15 text-primary hover:border-accent/60 hover:bg-background-light/40'
                                  }`}
                                >
                                  <span
                                    className={`material-symbols-outlined text-base ${isSelected ? 'text-accent' : 'text-primary/40'}`}
                                  >
                                    schedule
                                  </span>
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate">
                                      {slot.label}
                                    </span>
                                    {!isAvailable && reason && (
                                      <span className="text-[9px] text-red-500 italic leading-none mt-0.5">
                                        {reason}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Selected Schedule Confirmation Banner */}
                  {deliveryDate && deliveryTimeSlot && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-2 rounded-xl text-[11px] font-sans">
                      <span className="material-symbols-outlined text-emerald-600 text-base shrink-0">
                        check_circle
                      </span>
                      <span>
                        Entrega programada:{' '}
                        <strong>{formatDeliveryDateHuman(deliveryDate)}</strong>{' '}
                        ({deliveryTimeSlot})
                      </span>
                    </div>
                  )}
                </div>

                {/* Dedicatoria para la Tarjeta (Campos 'De:' y 'Para:' obligatorios, dedicatoria opcional) */}
                <div
                  id="cart-card-section"
                  className={`flex flex-col gap-3.5 bg-white p-4 rounded-2xl border transition-all mt-1 ${
                    hasAttemptedCheckout && (!cardFrom.trim() || !cardTo.trim())
                      ? 'border-red-300 ring-2 ring-red-400/20 shadow-xs'
                      : 'border-primary/10 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                    <div className="flex items-center gap-2 text-primary font-display font-semibold text-sm">
                      <span className="material-symbols-outlined text-accent text-lg">
                        drafts
                      </span>
                      <span>Tarjeta de Dedicatoria</span>
                    </div>
                    <span className="text-[10px] font-sans text-primary/60 italic">
                      Cortesía de Cerato ✨
                    </span>
                  </div>

                  {/* Campos De: y Para: (Obligatorios) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Campo 'De:' */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="cart-card-from"
                          className="text-[11px] font-sans font-semibold text-primary/90 flex items-center gap-1"
                        >
                          <span>De:</span>
                          <span className="text-accent font-bold">*</span>
                          <span className="text-[9px] text-accent/80 font-normal">
                            (Obligatorio)
                          </span>
                        </label>
                        <span className="text-[9px] text-primary/40">
                          {cardFrom.length}/100
                        </span>
                      </div>
                      <input
                        type="text"
                        id="cart-card-from"
                        value={cardFrom}
                        onChange={(e) => {
                          setCardFrom(e.target.value);
                          if (e.target.value.trim() && checkoutError) {
                            setCheckoutError(null);
                          }
                        }}
                        maxLength={100}
                        placeholder="Tu nombre / quién envía"
                        className={`w-full text-xs font-sans px-3 py-2.5 rounded-xl border bg-background-light/40 text-primary placeholder:text-primary/30 focus:outline-none focus:bg-white transition-all shadow-xs ${
                          hasAttemptedCheckout && !cardFrom.trim()
                            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/30'
                            : 'border-primary/15 focus:ring-1 focus:ring-accent'
                        }`}
                      />
                    </div>

                    {/* Campo 'Para:' */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="cart-card-to"
                          className="text-[11px] font-sans font-semibold text-primary/90 flex items-center gap-1"
                        >
                          <span>Para:</span>
                          <span className="text-accent font-bold">*</span>
                          <span className="text-[9px] text-accent/80 font-normal">
                            (Obligatorio)
                          </span>
                        </label>
                        <span className="text-[9px] text-primary/40">
                          {cardTo.length}/100
                        </span>
                      </div>
                      <input
                        type="text"
                        id="cart-card-to"
                        value={cardTo}
                        onChange={(e) => {
                          setCardTo(e.target.value);
                          if (e.target.value.trim() && checkoutError) {
                            setCheckoutError(null);
                          }
                        }}
                        maxLength={100}
                        placeholder="Nombre de quien recibe"
                        className={`w-full text-xs font-sans px-3 py-2.5 rounded-xl border bg-background-light/40 text-primary placeholder:text-primary/30 focus:outline-none focus:bg-white transition-all shadow-xs ${
                          hasAttemptedCheckout && !cardTo.trim()
                            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/30'
                            : 'border-primary/15 focus:ring-1 focus:ring-accent'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Mensaje de dedicatoria (Opcional) */}
                  <div className="flex flex-col gap-1.5 pt-1 border-t border-primary/5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="cart-card-message"
                        className="text-[11px] font-sans font-semibold text-primary/80 flex items-center gap-1"
                      >
                        <span>Mensaje de dedicatoria</span>
                        <span className="text-[9px] text-primary/40 font-normal">
                          (Opcional)
                        </span>
                      </label>
                      <span className="text-[9px] text-primary/40">
                        {cardMessage.length}/500
                      </span>
                    </div>
                    <textarea
                      id="cart-card-message"
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value)}
                      rows={2}
                      maxLength={500}
                      placeholder="Escribe aquí las palabras especiales que deseas que imprimamos en la tarjeta..."
                      className="w-full text-xs font-sans p-2.5 rounded-xl border border-primary/15 bg-background-light/40 text-primary placeholder:text-primary/30 focus:outline-none focus:bg-white focus:ring-1 focus:ring-accent resize-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Instrucciones de entrega (Opcional) */}
                <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-primary/10 shadow-xs mt-1">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-2">
                    <div className="flex items-center gap-2 text-primary font-display font-semibold text-sm">
                      <span className="material-symbols-outlined text-accent text-lg">
                        local_shipping
                      </span>
                      <span>Instrucciones de entrega</span>
                    </div>
                    <span className="text-[10px] font-sans text-primary/40 uppercase tracking-wider">
                      Opcional
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="cart-delivery-notes"
                        className="text-[11px] font-sans font-semibold text-primary/80 flex items-center gap-1"
                      >
                        <span>Indicaciones para el repartidor</span>
                      </label>
                      <span className="text-[9px] text-primary/40">
                        {deliveryNotes.length}/500
                      </span>
                    </div>
                    <textarea
                      id="cart-delivery-notes"
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      rows={2}
                      maxLength={500}
                      placeholder="Referencias de la fachada, indicaciones para el repartidor (ej. Portón blanco, dejar con conserje)..."
                      className="w-full text-xs font-sans p-2.5 rounded-xl border border-primary/15 bg-background-light/40 text-primary placeholder:text-primary/30 focus:outline-none focus:bg-white focus:ring-1 focus:ring-accent resize-none transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Condiciones de Compra y Productos Perecederos (Obligatorio) */}
                <div
                  id="cart-terms-section"
                  className={`flex flex-col gap-3 p-4 sm:p-5 rounded-2xl border transition-all mt-1 ${
                    hasAttemptedCheckout && !acceptedTerms
                      ? "bg-red-50/70 border-red-300 ring-2 ring-red-400/30 shadow-sm"
                      : acceptedTerms
                      ? "bg-emerald-50/40 border-emerald-300"
                      : "bg-white border-primary/10 shadow-xs"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-primary/10 pb-2.5">
                    <div className="flex items-center gap-2 text-primary font-display font-semibold text-sm">
                      <span className="material-symbols-outlined text-accent text-lg">
                        verified_user
                      </span>
                      <span>Condiciones de Compra</span>
                    </div>
                    <span
                      className={`text-[9px] font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
                        acceptedTerms
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {acceptedTerms ? "Aceptado ✓" : "Requerido *"}
                    </span>
                  </div>

                  <div className="bg-background-light/70 p-3 sm:p-3.5 rounded-xl border border-primary/10 text-[11px] font-sans text-primary/80 leading-relaxed space-y-2">
                    <p className="font-semibold text-primary">
                      Al finalizar tu compra, aceptas que:
                    </p>
                    <ul className="space-y-1.5 list-disc pl-4 text-primary/75 marker:text-accent">
                      <li>
                        <strong>No hay cancelaciones ni reembolsos</strong> por tratarse de productos perecederos.
                      </li>
                      <li>
                        <strong>Cualquier aclaración</strong> deberá hacerse al momento de la entrega con evidencia. No se aceptarán reclamaciones posteriores.
                      </li>
                      <li>
                        <strong>Las flores pueden presentar variaciones naturales</strong> y están sujetas a disponibilidad. En caso de que no llegue la flor solicitada se reemplazará por otra similar de igual o mayor valor.
                      </li>
                    </ul>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer pt-1 select-none group">
                    <input
                      type="checkbox"
                      id="cart-accept-terms-checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        if (e.target.checked) setCheckoutError(null);
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-primary/30 text-primary focus:ring-accent accent-primary cursor-pointer shrink-0"
                    />
                    <span
                      className={`text-xs font-sans leading-snug transition-colors ${
                        hasAttemptedCheckout && !acceptedTerms
                          ? "text-red-700 font-semibold"
                          : "text-primary/90 group-hover:text-primary"
                      }`}
                    >
                      He leído y acepto los términos de compra y condiciones de productos perecederos. <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer / Summary */}
        <div className="bg-white border-t border-primary/10 px-6 sm:px-8 py-6 sm:py-7 flex flex-col gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] shrink-0">
          {checkoutError && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs font-sans">
              <span className="material-symbols-outlined text-base text-red-600 shrink-0 mt-0.5">
                error
              </span>
              <span className="flex-1 leading-relaxed">{checkoutError}</span>
            </div>
          )}

          {lineItems.length > 0 &&
            (!deliveryDate || !deliveryTimeSlot) &&
            !checkoutError && (
              <div className="flex items-center gap-2 bg-amber-50/90 border border-amber-200 text-amber-900 px-3 py-2.5 rounded-xl text-xs font-sans">
                <span className="material-symbols-outlined text-base text-amber-600 shrink-0">
                  calendar_clock
                </span>
                <span className="leading-tight">
                  {!deliveryDate
                    ? 'Selecciona fecha y horario de entrega arriba para continuar.'
                    : 'Selecciona un bloque de horario arriba para continuar.'}
                </span>
              </div>
            )}

          {lineItems.length > 0 &&
            deliveryDate &&
            deliveryTimeSlot &&
            !acceptedTerms &&
            !checkoutError && (
              <div className="flex items-center gap-2 bg-amber-50/90 border border-amber-200 text-amber-900 px-3 py-2.5 rounded-xl text-xs font-sans">
                <span className="material-symbols-outlined text-base text-amber-600 shrink-0">
                  verified_user
                </span>
                <span className="leading-tight">
                  Marca como leído el aviso de términos de compra arriba para continuar.
                </span>
              </div>
            )}

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px] font-sans font-bold uppercase tracking-widest text-primary/50">
              <span>
                Subtotal ({totalQuantity}{' '}
                {totalQuantity === 1 ? 'artículo' : 'artículos'})
              </span>
              <span className="text-primary/80 font-bold">
                $
                {subtotal.toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {currency}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-sans font-bold uppercase tracking-widest text-primary/50">
              <span>Envío Local (León, Gto.)</span>
              <span className="italic normal-case font-medium text-accent">
                Calculado en checkout
              </span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary/10">
              <span className="text-lg lg:text-xl font-display font-bold text-primary">
                Total
              </span>
              <span className="text-xl lg:text-2xl font-display font-bold text-primary">
                $
                {subtotal.toLocaleString('es-MX', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {currency}
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={lineItems.length === 0 || isLoading || isCheckingOut}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-sans font-bold tracking-[0.25em] text-[11px] transition-all shadow-xl shadow-primary/20 active:scale-[0.98] uppercase mt-1 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isCheckingOut ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>CONFIRMANDO CON SHOPIFY...</span>
              </>
            ) : isLoading ? (
              'PROCESANDO...'
            ) : (
              'CONTINUAR AL PAGO'
            )}
          </button>
          <p className="text-center text-[9px] font-sans text-primary/40 uppercase tracking-[0.2em] mt-1">
            Procesamiento de pago seguro operado por Shopify
          </p>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
