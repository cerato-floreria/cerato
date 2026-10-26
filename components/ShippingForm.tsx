"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  getMonthCalendarGrid,
  getAvailableSlotsForDate,
  formatDeliveryDateHuman,
  isDeliverySlotAvailable,
  CalendarCell
} from "@/lib/delivery";
import { toPascalCase } from "@/lib/shopify";
import { CartItem } from "@/lib/shopify/types";

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAY_LABELS = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

export default function ShippingForm() {
  const {
    cart,
    isLoading: isCartLoading,
    updateItemQuantity,
    removeItem,
    deliveryDate,
    setDeliveryDate,
    deliveryTimeSlot,
    setDeliveryTimeSlot,
    deliveryNotes,
    setDeliveryNotes,
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
  } = useCart();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [hasAttemptedCheckout, setHasAttemptedCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calendar month state
  const [currentCalendarDate, setCurrentCalendarDate] = useState<Date>(() => {
    if (deliveryDate) {
      const [y, m] = deliveryDate.split("-").map(Number);
      if (!isNaN(y) && !isNaN(m)) {
        return new Date(y, m - 1, 1);
      }
    }
    return new Date();
  });

  const now = useMemo(() => new Date(), []);
  const currentYear = currentCalendarDate.getFullYear();
  const currentMonth = currentCalendarDate.getMonth();

  // Generate calendar grid for displayed month
  const calendarGrid = useMemo(() => {
    return getMonthCalendarGrid(currentYear, currentMonth, now);
  }, [currentYear, currentMonth, now]);

  // Available time slots for the selected delivery date
  const availableSlotsForDate = useMemo(() => {
    if (!deliveryDate) return [];
    return getAvailableSlotsForDate(deliveryDate, now);
  }, [deliveryDate, now]);

  // Auto-select valid slot if current becomes invalid on date change
  useEffect(() => {
    if (deliveryDate && availableSlotsForDate.length > 0) {
      const validCurrent = availableSlotsForDate.some(
        (s) => s.isAvailable && s.slot.label === deliveryTimeSlot
      );
      if (!validCurrent) {
        const firstAvailable = availableSlotsForDate.find((s) => s.isAvailable);
        if (firstAvailable) {
          setDeliveryTimeSlot(firstAvailable.slot.label);
        }
      }
    }
  }, [deliveryDate, availableSlotsForDate, deliveryTimeSlot, setDeliveryTimeSlot]);

  // Month navigation
  const canGoPreviousMonth = useMemo(() => {
    const isSameYear = currentYear === now.getFullYear();
    const isSameMonth = currentMonth === now.getMonth();
    return !(isSameYear && isSameMonth) && (currentYear > now.getFullYear() || currentMonth > now.getMonth());
  }, [currentYear, currentMonth, now]);

  const handlePrevMonth = () => {
    if (!canGoPreviousMonth) return;
    setCurrentCalendarDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    const maxMonthsAhead = 3;
    const monthsDiff = (currentYear - now.getFullYear()) * 12 + (currentMonth - now.getMonth());
    if (monthsDiff < maxMonthsAhead) {
      setCurrentCalendarDate(new Date(currentYear, currentMonth + 1, 1));
    }
  };

  const handleDaySelect = (cell: CalendarCell) => {
    if (!cell.isAvailable) return;
    setDeliveryDate(cell.dateStr);
    setErrorMessage(null);
  };

  // Extract cart line items
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

  // Subtotal calculation
  const subtotal = useMemo(() => {
    if (cart?.cost?.subtotalAmount?.amount) {
      const parsed = parseFloat(cart.cost.subtotalAmount.amount);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    if (cart?.cost?.totalAmount?.amount) {
      const parsed = parseFloat(cart.cost.totalAmount.amount);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return lineItems.reduce((acc, item) => {
      const itemCost = item.cost?.totalAmount?.amount
        ? parseFloat(item.cost.totalAmount.amount)
        : parseFloat(item.merchandise?.price?.amount || "0") * (item.quantity || 1);
      return acc + (isNaN(itemCost) ? 0 : itemCost);
    }, 0);
  }, [cart, lineItems]);

  const currency =
    cart?.cost?.subtotalAmount?.currencyCode ||
    cart?.cost?.totalAmount?.currencyCode ||
    lineItems[0]?.merchandise?.price?.currencyCode ||
    "MXN";

  const total = subtotal;

  // Validation state checks
  const isSenderPhoneValid = senderPhone.trim().length > 0;
  const isSenderPhoneInvalid = hasAttemptedCheckout && !isSenderPhoneValid;

  const isRecipientPhoneValid = recipientPhone.trim().length > 0;
  const isRecipientPhoneInvalid = hasAttemptedCheckout && !isRecipientPhoneValid;

  const isCardFromValid = cardFrom.trim().length > 0;
  const isCardFromInvalid = hasAttemptedCheckout && !isCardFromValid;

  const isCardToValid = cardTo.trim().length > 0;
  const isCardToInvalid = hasAttemptedCheckout && !isCardToValid;

  const isDateValid = Boolean(deliveryDate);
  const isDateInvalid = hasAttemptedCheckout && !isDateValid;

  const isSlotValid = Boolean(deliveryTimeSlot && isDeliverySlotAvailable(deliveryDate, deliveryTimeSlot));
  const isSlotInvalid = hasAttemptedCheckout && (!deliveryTimeSlot || !isSlotValid);

  const isTermsValid = acceptedTerms;
  const isTermsInvalid = hasAttemptedCheckout && !acceptedTerms;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasAttemptedCheckout(true);
    setErrorMessage(null);

    // Validation
    if (!senderPhone.trim()) {
      setErrorMessage("Por favor ingresa el teléfono de quien manda (Remitente).");
      scrollToField("shipping-sender-phone");
      return;
    }

    if (!recipientPhone.trim()) {
      setErrorMessage("Por favor ingresa el teléfono de quien recibe (Destinatario).");
      scrollToField("shipping-recipient-phone");
      return;
    }

    if (!cardFrom.trim()) {
      setErrorMessage('Por favor completa el campo "De:" para la tarjeta de dedicatoria.');
      scrollToField("card-from");
      return;
    }

    if (!cardTo.trim()) {
      setErrorMessage('Por favor completa el campo "Para:" para la tarjeta de dedicatoria.');
      scrollToField("card-to-dedication");
      return;
    }

    if (!deliveryDate) {
      setErrorMessage("Por favor selecciona un día de entrega en el calendario.");
      scrollToField("shipping-calendar");
      return;
    }

    if (!deliveryTimeSlot) {
      setErrorMessage("Por favor selecciona un horario de entrega disponible.");
      scrollToField("shipping-calendar");
      return;
    }

    if (!isDeliverySlotAvailable(deliveryDate, deliveryTimeSlot)) {
      setErrorMessage(
        "El horario de entrega seleccionado no está disponible (mínimo 24 hrs de anticipación). Por favor elige otro."
      );
      scrollToField("shipping-calendar");
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage(
        "Es necesario marcar como leído y aceptar los términos de compra y condiciones de productos perecederos para continuar."
      );
      scrollToField("shipping-terms");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveNotesAndProceedToCheckout({ acceptedTerms: true });
      if (!res.success) {
        setErrorMessage(res.error || "No se pudieron confirmar los datos con Shopify. Por favor intenta de nuevo.");
        setIsSubmitting(false);
        return;
      }

      if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        setErrorMessage("El enlace de pago de Shopify no está disponible en este momento.");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error redirecting to checkout:", err);
      setErrorMessage("Ocurrió un error inesperado al procesar el pago. Por favor intenta nuevamente.");
      setIsSubmitting(false);
    }
  };

  const scrollToField = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {lineItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center max-w-xl mx-auto shadow-sm border border-primary/10">
            <span className="text-5xl mb-4 block">🌸</span>
            <h2 className="font-display text-2xl font-bold text-primary mb-3">
              Tu carrito está vacío
            </h2>
            <p className="text-sm font-sans text-primary/70 mb-8">
              Aún no has agregado arreglos o flores a tu pedido. Explora nuestra colección de alta floristería.
            </p>
            <Link
              href="/productos"
              className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-sans font-bold tracking-[0.2em] text-xs uppercase transition-all shadow-md"
            >
              Explorar Colección
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* LEFT COLUMN: Shipping Details, Dedication, Calendar, Terms */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-10">
              
              {/* SECTION 1: Detalles de Envío */}
              <section aria-labelledby="heading-shipping-info">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1.5 h-6 bg-accent-gold rounded-full block" />
                  <h1 id="heading-shipping-info" className="font-display text-2xl lg:text-3xl font-bold text-primary">
                    Detalles de Envío
                  </h1>
                </div>

                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-primary/10 shadow-sm space-y-5">
                  {/* Informative Note */}
                  <div className="flex items-center gap-2 bg-[#FAF9F7] border border-primary/10 rounded-xl p-3 text-xs font-sans text-primary/70">
                    <span className="material-symbols-outlined text-accent-gold text-lg shrink-0">
                      local_shipping
                    </span>
                    <span>
                      La dirección exacta de entrega se confirmará de forma protegida en el siguiente paso con Shopify.
                    </span>
                  </div>

                  {/* Teléfono de quien manda y Teléfono de quien recibe */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
                    {/* Teléfono de quien manda */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor="shipping-sender-phone"
                          className="text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-1"
                        >
                          <span>Teléfono de quien manda</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        {isSenderPhoneValid && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check</span> Listo
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="shipping-sender-phone"
                          type="tel"
                          required
                          value={senderPhone}
                          onChange={(e) => {
                            setSenderPhone(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="10 dígitos (Para avisos de tu pedido)"
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/35 focus:outline-none transition-all shadow-xs pr-10 ${
                            isSenderPhoneInvalid
                              ? "border-red-400 ring-2 ring-red-400/20 bg-red-50/40"
                              : isSenderPhoneValid
                              ? "border-emerald-500/80 ring-1 ring-emerald-500/20 bg-emerald-50/15"
                              : "border-primary/15 bg-[#FAF9F7] focus:border-primary focus:bg-white"
                          }`}
                        />
                        {isSenderPhoneValid && (
                          <span className="material-symbols-outlined text-emerald-600 text-lg absolute right-3 top-3.5 pointer-events-none">
                            check_circle
                          </span>
                        )}
                        {isSenderPhoneInvalid && (
                          <span className="material-symbols-outlined text-red-500 text-lg absolute right-3 top-3.5 pointer-events-none">
                            error
                          </span>
                        )}
                      </div>
                      {isSenderPhoneInvalid && (
                        <p className="text-[11px] text-red-600 mt-1 font-sans flex items-center gap-1">
                          Por favor ingresa tu número telefónico.
                        </p>
                      )}
                    </div>

                    {/* Teléfono de quien recibe */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor="shipping-recipient-phone"
                          className="text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-1"
                        >
                          <span>Teléfono de quien recibe</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        {isRecipientPhoneValid && (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check</span> Listo
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="shipping-recipient-phone"
                          type="tel"
                          required
                          value={recipientPhone}
                          onChange={(e) => {
                            setRecipientPhone(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="10 dígitos (Para coordinar la entrega)"
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/35 focus:outline-none transition-all shadow-xs pr-10 ${
                            isRecipientPhoneInvalid
                              ? "border-red-400 ring-2 ring-red-400/20 bg-red-50/40"
                              : isRecipientPhoneValid
                              ? "border-emerald-500/80 ring-1 ring-emerald-500/20 bg-emerald-50/15"
                              : "border-primary/15 bg-[#FAF9F7] focus:border-primary focus:bg-white"
                          }`}
                        />
                        {isRecipientPhoneValid && (
                          <span className="material-symbols-outlined text-emerald-600 text-lg absolute right-3 top-3.5 pointer-events-none">
                            check_circle
                          </span>
                        )}
                        {isRecipientPhoneInvalid && (
                          <span className="material-symbols-outlined text-red-500 text-lg absolute right-3 top-3.5 pointer-events-none">
                            error
                          </span>
                        )}
                      </div>
                      {isRecipientPhoneInvalid && (
                        <p className="text-[11px] text-red-600 mt-1 font-sans flex items-center gap-1">
                          Por favor ingresa el teléfono del destinatario.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Referencias adicionales / Indicaciones de entrega */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="shipping-references"
                        className="text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider"
                      >
                        Referencias adicionales (Opcional)
                      </label>
                      <span className="text-[10px] text-primary/40 font-sans">
                        {deliveryNotes.length}/500
                      </span>
                    </div>
                    <textarea
                      id="shipping-references"
                      rows={3}
                      maxLength={500}
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                      placeholder="Piso, color de fachada, indicaciones de acceso para el repartidor..."
                      className="w-full bg-[#FAF9F7] border border-primary/15 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/35 focus:outline-none focus:border-primary focus:bg-white transition-all resize-y shadow-xs"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 2: Mensaje de dedicatoria */}
              <section aria-labelledby="heading-dedication-card">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1.5 h-6 bg-accent-gold rounded-full block" />
                  <h2 id="heading-dedication-card" className="font-display text-2xl lg:text-3xl font-bold text-primary">
                    Mensaje de dedicatoria
                  </h2>
                </div>

                <div className="bg-white rounded-2xl p-6 lg:p-8 border border-primary/10 shadow-sm space-y-5">
                  {/* Tarjeta header */}
                  <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                    <div className="flex items-center gap-2 text-primary font-display font-semibold text-base">
                      <span className="material-symbols-outlined text-accent-gold text-xl">
                        drafts
                      </span>
                      <span>Tarjeta de Dedicatoria</span>
                    </div>
                    <span className="text-[11px] font-sans text-accent-gold italic font-medium">
                      Cortesía de Cerato ✨
                    </span>
                  </div>

                  <p className="italic font-display text-accent-gold text-sm lg:text-base">
                    Escribe las palabras que acompañarán tu arreglo floral
                  </p>

                  {/* De: y Para: */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Campo De: */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor="card-from"
                          className="text-xs font-sans font-semibold text-primary/90 flex items-center gap-1 uppercase tracking-wider"
                        >
                          <span>De: (Remitente)</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        {isCardFromValid ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check</span> Listo
                          </span>
                        ) : (
                          <span className="text-[10px] text-primary/40 font-sans">
                            {cardFrom.length}/100
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="card-from"
                          type="text"
                          required
                          maxLength={100}
                          value={cardFrom}
                          onChange={(e) => {
                            setCardFrom(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="Tu nombre o cómo deseas firmar"
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/35 focus:outline-none transition-all shadow-xs pr-10 ${
                            isCardFromInvalid
                              ? "border-red-400 ring-2 ring-red-400/20 bg-red-50/40"
                              : isCardFromValid
                              ? "border-emerald-500/80 ring-1 ring-emerald-500/20 bg-emerald-50/15"
                              : "border-primary/15 bg-[#FAF9F7] focus:border-primary focus:bg-white"
                          }`}
                        />
                        {isCardFromValid && (
                          <span className="material-symbols-outlined text-emerald-600 text-lg absolute right-3 top-3.5 pointer-events-none">
                            check_circle
                          </span>
                        )}
                        {isCardFromInvalid && (
                          <span className="material-symbols-outlined text-red-500 text-lg absolute right-3 top-3.5 pointer-events-none">
                            error
                          </span>
                        )}
                      </div>
                      {isCardFromInvalid && (
                        <p className="text-[11px] text-red-600 mt-1 font-sans">
                          Campo obligatorio. Indica de parte de quién es el regalo.
                        </p>
                      )}
                    </div>

                    {/* Campo Para: */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          htmlFor="card-to-dedication"
                          className="text-xs font-sans font-semibold text-primary/90 flex items-center gap-1 uppercase tracking-wider"
                        >
                          <span>Para: (Destinatario)</span>
                          <span className="text-red-500 font-bold">*</span>
                        </label>
                        {isCardToValid ? (
                          <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-xs">check</span> Listo
                          </span>
                        ) : (
                          <span className="text-[10px] text-primary/40 font-sans">
                            {cardTo.length}/100
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          id="card-to-dedication"
                          type="text"
                          required
                          maxLength={100}
                          value={cardTo}
                          onChange={(e) => {
                            setCardTo(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          placeholder="Nombre de la persona especial"
                          className={`w-full border rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/35 focus:outline-none transition-all shadow-xs pr-10 ${
                            isCardToInvalid
                              ? "border-red-400 ring-2 ring-red-400/20 bg-red-50/40"
                              : isCardToValid
                              ? "border-emerald-500/80 ring-1 ring-emerald-500/20 bg-emerald-50/15"
                              : "border-primary/15 bg-[#FAF9F7] focus:border-primary focus:bg-white"
                          }`}
                        />
                        {isCardToValid && (
                          <span className="material-symbols-outlined text-emerald-600 text-lg absolute right-3 top-3.5 pointer-events-none">
                            check_circle
                          </span>
                        )}
                        {isCardToInvalid && (
                          <span className="material-symbols-outlined text-red-500 text-lg absolute right-3 top-3.5 pointer-events-none">
                            error
                          </span>
                        )}
                      </div>
                      {isCardToInvalid && (
                        <p className="text-[11px] text-red-600 mt-1 font-sans">
                          Campo obligatorio. Indica para quién es el arreglo.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Mensaje de dedicatoria */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="card-message"
                        className="text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider"
                      >
                        Mensaje de dedicatoria (Opcional)
                      </label>
                      <span className="text-[10px] text-primary/40 font-sans">
                        {cardMessage.length} / 500
                      </span>
                    </div>
                    <textarea
                      id="card-message"
                      rows={5}
                      maxLength={500}
                      value={cardMessage}
                      onChange={(e) => setCardMessage(e.target.value)}
                      placeholder="Querida mamá, que estas flores iluminen tu día tanto como tú iluminas el mío..."
                      className="w-full bg-[#FAF9F7] border border-primary/15 rounded-xl p-4 text-sm text-primary placeholder:text-primary/35 focus:outline-none focus:border-primary focus:bg-white transition-all leading-relaxed resize-y shadow-xs"
                    />
                    <div className="flex justify-end items-center text-[10px] font-sans uppercase tracking-widest text-accent-gold font-bold mt-2">
                      <span>EL MENSAJE SERÁ IMPRESO EN UNA TARJETA DE LUJO</span>
                    </div>
                  </div>

                  {/* Firma opcional */}
                  <div className="border-t border-primary/10 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        htmlFor="card-signature"
                        className="text-xs font-sans font-semibold text-primary/80 flex items-center gap-1.5 uppercase tracking-wider"
                      >
                        <span className="material-symbols-outlined text-base text-accent-gold">
                          edit_note
                        </span>
                        <span>Firma: (Opcional)</span>
                      </label>
                      <span className="text-[10px] text-primary/40 font-sans">
                        {cardSignature.length}/100
                      </span>
                    </div>
                    <input
                      id="card-signature"
                      type="text"
                      maxLength={100}
                      value={cardSignature}
                      onChange={(e) => setCardSignature(e.target.value)}
                      placeholder="Ej. Con amor infinito, Tu familia..."
                      className="w-full bg-[#FAF9F7] border border-primary/15 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-primary/35 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 3: Calendario de Entrega */}
              <section id="shipping-calendar" aria-labelledby="heading-delivery-calendar">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-accent-gold rounded-full block" />
                    <h2 id="heading-delivery-calendar" className="font-display text-2xl lg:text-3xl font-bold text-primary">
                      Calendario de Entrega
                    </h2>
                  </div>
                  <span className="text-xs font-sans uppercase tracking-[0.2em] text-accent-gold font-bold">
                    SELECCIONA UNA FECHA DISPONIBLE
                  </span>
                </div>

                <div
                  className={`bg-white rounded-2xl p-6 lg:p-8 border shadow-sm space-y-6 transition-all ${
                    isDateInvalid
                      ? "border-red-400 ring-2 ring-red-400/20 bg-red-50/20"
                      : "border-primary/10"
                  }`}
                >
                  {/* Subheader info */}
                  <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                    <div className="flex items-center gap-2 text-primary font-display font-semibold text-base">
                      <span className="material-symbols-outlined text-accent-gold text-xl">
                        calendar_month
                      </span>
                      <span>Fecha y Horario de Entrega</span>
                    </div>
                    <span className="text-[10px] font-sans font-bold bg-accent-gold/15 text-primary px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Mínimo 24 hrs
                    </span>
                  </div>

                  <p className="text-xs text-primary/70 font-sans leading-relaxed">
                    Para garantizar la máxima frescura de nuestras flores, preparamos cada arreglo bajo pedido con al menos 24 hrs de anticipación (Lunes a Sábado).
                  </p>

                  {/* Red validation warning if date not selected */}
                  {isDateInvalid && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl text-xs font-sans">
                      <span className="material-symbols-outlined text-base text-red-600 shrink-0">
                        error
                      </span>
                      <span>Por favor selecciona un día disponible en el calendario para tu entrega.</span>
                    </div>
                  )}

                  {/* Month Navigation Header */}
                  <div className="flex items-center justify-between bg-[#FAF9F7] px-4 py-2.5 rounded-xl border border-primary/10">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      disabled={!canGoPreviousMonth}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer"
                      aria-label="Mes anterior"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_left</span>
                    </button>

                    <div className="font-display text-base lg:text-lg font-bold text-primary capitalize">
                      {MONTH_NAMES[currentMonth]} {currentYear}
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-all cursor-pointer"
                      aria-label="Mes siguiente"
                    >
                      <span className="material-symbols-outlined text-xl">chevron_right</span>
                    </button>
                  </div>

                  {/* Day Names Row */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {DAY_LABELS.map((day) => (
                      <div
                        key={day}
                        className="text-[11px] font-sans font-bold uppercase tracking-wider text-primary/50 py-1"
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid (Days) */}
                  <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                    {calendarGrid.map((cell, idx) => {
                      const isSelected = deliveryDate === cell.dateStr;
                      const isClickable = cell.isAvailable;

                      return (
                        <button
                          key={`${cell.dateStr}-${idx}`}
                          type="button"
                          onClick={() => handleDaySelect(cell)}
                          disabled={!isClickable}
                          title={
                            cell.isSunday
                              ? "Domingos cerrado por descanso de taller"
                              : !cell.isAvailable
                              ? "No disponible (mínimo 24 hrs de anticipación)"
                              : `Seleccionar ${cell.dateStr}`
                          }
                          className={`
                            aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-sans transition-all
                            ${!cell.isCurrentMonth ? "opacity-25" : ""}
                            ${
                              isSelected
                                ? "bg-primary text-white font-bold shadow-lg shadow-primary/20 scale-105"
                                : isClickable
                                ? "text-primary hover:bg-primary/10 hover:border-primary/40 border border-transparent cursor-pointer font-medium"
                                : "text-primary/25 cursor-not-allowed line-through-off"
                            }
                          `}
                        >
                          <span>{cell.dayNumber}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Date Summary & Time Slots Selection */}
                  {deliveryDate && (
                    <div className="pt-4 border-t border-primary/10 space-y-4">
                      {/* Green Schedule Confirmation Banner */}
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-300 text-emerald-950 px-3.5 py-2.5 rounded-xl text-xs font-sans">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-emerald-600 text-lg shrink-0">
                            check_circle
                          </span>
                          <span>
                            Día seleccionado: <strong>{formatDeliveryDateHuman(deliveryDate)}</strong>
                            {deliveryTimeSlot && <> ({deliveryTimeSlot})</>}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                          Confirmado ✓
                        </span>
                      </div>

                      {/* Time Slots Selection */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-sans font-semibold text-primary/80 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-accent-gold text-base">
                              schedule
                            </span>
                            <span>Horario de entrega disponible *</span>
                          </label>
                          {isSlotValid && (
                            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-0.5">
                              <span className="material-symbols-outlined text-xs">check</span> Seleccionado
                            </span>
                          )}
                        </div>

                        {isSlotInvalid && (
                          <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 mb-2 font-sans flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-base text-red-600">error</span>
                            Por favor elige uno de los bloques de horario disponibles.
                          </p>
                        )}

                        {availableSlotsForDate.length === 0 ? (
                          <p className="text-xs text-red-600 italic bg-red-50 p-3 rounded-xl border border-red-100 font-sans">
                            Los domingos no se realizan entregas. Por favor elige otro día de la semana.
                          </p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                            {availableSlotsForDate.map(({ slot, isAvailable, reason }) => {
                              const isSlotSelected = deliveryTimeSlot === slot.label;
                              return (
                                <button
                                  key={slot.id}
                                  type="button"
                                  disabled={!isAvailable}
                                  onClick={() => {
                                    if (isAvailable) {
                                      setDeliveryTimeSlot(slot.label);
                                      setErrorMessage(null);
                                    }
                                  }}
                                  className={`
                                    py-3 px-3 rounded-xl border text-xs font-sans transition-all text-center flex flex-col items-center justify-center gap-0.5
                                    ${
                                      isSlotSelected
                                        ? "bg-primary text-white border-primary shadow-sm font-bold ring-1 ring-primary"
                                        : isAvailable
                                        ? "bg-white text-primary border-primary/20 hover:border-primary/50 cursor-pointer shadow-xs"
                                        : "bg-primary/5 text-primary/30 border-transparent cursor-not-allowed opacity-50"
                                    }
                                  `}
                                >
                                  <span className="flex items-center gap-1">
                                    {isSlotSelected && (
                                      <span className="material-symbols-outlined text-xs text-accent-gold">check</span>
                                    )}
                                    {slot.label}
                                  </span>
                                  {reason && !isAvailable && (
                                    <span className="text-[9px] text-red-500 italic leading-tight">
                                      {reason}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Notice about 24h lead time and Sunday closure */}
                  <div className="flex items-start gap-2.5 bg-[#FAF9F7] border border-primary/10 rounded-xl p-3.5 text-xs font-sans text-primary/70">
                    <span className="material-symbols-outlined text-accent-gold text-lg shrink-0 mt-0.5">
                      info
                    </span>
                    <p className="leading-relaxed">
                      Pedidos con <strong>mínimo 24 hrs de anticipación</strong> para garantizar la máxima frescura de las flores seleccionadas en taller. <strong>Domingos cerrado</strong> por descanso de taller.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Condiciones de Compra y Productos Perecederos */}
              <section id="shipping-terms" aria-labelledby="heading-shipping-terms">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1.5 h-6 bg-accent-gold rounded-full block" />
                  <h2 id="heading-shipping-terms" className="font-display text-2xl lg:text-3xl font-bold text-primary">
                    Condiciones de Compra
                  </h2>
                </div>

                <div
                  className={`bg-white rounded-2xl p-6 lg:p-8 border transition-all space-y-4 shadow-sm ${
                    isTermsInvalid
                      ? "border-red-400 ring-2 ring-red-400/20 bg-red-50/30"
                      : isTermsValid
                      ? "border-emerald-400 ring-1 ring-emerald-400/30 bg-emerald-50/15"
                      : "border-primary/10"
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-primary/10 pb-3">
                    <div className="flex items-center gap-2 text-primary font-display font-semibold text-base">
                      <span className="material-symbols-outlined text-accent-gold text-xl">
                        verified_user
                      </span>
                      <span>Términos de Productos Perecederos</span>
                    </div>
                    <span
                      className={`text-[10px] font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider transition-colors ${
                        isTermsValid
                          ? "bg-emerald-100 text-emerald-800"
                          : isTermsInvalid
                          ? "bg-red-100 text-red-800"
                          : "bg-accent-gold/15 text-primary"
                      }`}
                    >
                      {isTermsValid ? "Aceptado ✓" : "Requerido *"}
                    </span>
                  </div>

                  <div className="bg-[#FAF9F7] p-4 rounded-xl border border-primary/10 text-xs font-sans text-primary/80 leading-relaxed space-y-2">
                    <p className="font-semibold text-primary">
                      Al finalizar tu compra, aceptas que:
                    </p>
                    <ul className="space-y-1.5 list-disc pl-5 text-primary/75 marker:text-accent-gold">
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

                  <label className="flex items-start gap-3 cursor-pointer pt-2 group select-none">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedTerms}
                      onChange={(e) => {
                        setAcceptedTerms(e.target.checked);
                        if (e.target.checked && errorMessage) setErrorMessage(null);
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-primary/30 text-primary focus:ring-accent-gold accent-primary cursor-pointer shrink-0"
                    />
                    <span
                      className={`text-xs font-sans leading-relaxed transition-colors ${
                        isTermsInvalid
                          ? "text-red-700 font-semibold"
                          : "text-primary/90 group-hover:text-primary"
                      }`}
                    >
                      He leído y acepto los términos de compra y condiciones de productos perecederos. <span className="text-red-500 font-bold">*</span>
                    </span>
                  </label>
                </div>
              </section>
            </div>

            {/* RIGHT COLUMN: Sticky Order Summary */}
            <aside aria-label="Resumen del pedido" className="lg:col-span-5 xl:col-span-4 sticky top-28 space-y-6">
              <div className="bg-white rounded-2xl p-6 lg:p-7 border border-primary/10 shadow-sm space-y-6">
                <h2 className="font-display text-xl font-bold text-primary">
                  Resumen del Pedido
                </h2>

                {/* Products List with Stepper and Delete */}
                <div className="divide-y divide-primary/10 max-h-80 overflow-y-auto pr-1">
                  {lineItems.map((item) => {
                    const productTitle = toPascalCase(
                      item.merchandise?.product?.title ||
                        item.merchandise?.title ||
                        "Producto Floral"
                    );
                    const rawVariantTitle = (item.merchandise?.title || "").trim();
                    const isDefaultVariant =
                      !rawVariantTitle ||
                      rawVariantTitle.toLowerCase() === "default title" ||
                      rawVariantTitle.toLowerCase() === "default";
                    const variantTitle = !isDefaultVariant ? toPascalCase(rawVariantTitle) : "";

                    const imageUrl =
                      item.merchandise?.image?.url ||
                      item.merchandise?.product?.featuredImage?.url ||
                      "https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=200";

                    const unitPrice = parseFloat(item.merchandise?.price?.amount || "0");
                    const lineTotal = item.cost?.totalAmount?.amount
                      ? parseFloat(item.cost.totalAmount.amount)
                      : !isNaN(unitPrice)
                      ? unitPrice * (item.quantity || 1)
                      : 0;

                    return (
                      <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center gap-3.5">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-primary/5 shrink-0 border border-primary/10">
                          <Image
                            src={imageUrl}
                            alt={productTitle}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h3 className="font-display text-xs sm:text-sm font-bold text-primary truncate" title={productTitle}>
                              {productTitle}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              disabled={isCartLoading || isSubmitting}
                              className="text-primary/30 hover:text-red-600 transition-colors p-0.5 cursor-pointer disabled:opacity-40"
                              title="Eliminar producto"
                            >
                              <span className="material-symbols-outlined text-base">delete</span>
                            </button>
                          </div>

                          {variantTitle && (
                            <p className="text-[11px] font-sans text-primary/60 truncate">
                              {variantTitle}
                            </p>
                          )}

                          <div className="flex items-center justify-between gap-2 mt-2">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-primary/15 rounded-lg bg-[#FAF9F7] shadow-xs overflow-hidden">
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                                disabled={isCartLoading || isSubmitting}
                                className="w-6 h-6 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40 cursor-pointer font-bold text-xs"
                              >
                                -
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-primary">
                                {item.quantity || 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                                disabled={isCartLoading || isSubmitting}
                                className="w-6 h-6 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40 cursor-pointer font-bold text-xs"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-xs font-sans font-bold text-primary">
                              ${lineTotal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal, Shipping, Tax Breakdown */}
                <div className="border-t border-primary/10 pt-4 space-y-2.5 text-xs font-sans">
                  <div className="flex justify-between items-center text-primary/70">
                    <span>Subtotal</span>
                    <span className="font-bold text-primary">
                      ${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-primary/70">
                    <span>Envío Local (León, Gto.)</span>
                    <span className="text-accent-gold font-bold">
                      Calculado en checkout
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-primary/70">
                    <span>Impuestos (IVA)</span>
                    <span className="font-medium text-primary/70">
                      Incluidos
                    </span>
                  </div>

                  <div className="border-t border-primary/10 pt-3 flex justify-between items-baseline">
                    <span className="font-display text-lg font-bold text-primary">
                      Total
                    </span>
                    <span className="font-display text-2xl font-bold text-primary">
                      ${total.toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
                    </span>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3.5 rounded-xl text-xs font-sans flex items-start gap-2.5 animate-in fade-in">
                    <span className="material-symbols-outlined text-base text-red-600 shrink-0 mt-0.5">
                      error
                    </span>
                    <span className="leading-relaxed">{errorMessage}</span>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isCartLoading}
                  className="w-full bg-[#241528] hover:bg-[#341F3A] text-white py-4 rounded-xl font-sans font-bold tracking-[0.2em] text-xs transition-all shadow-xl shadow-primary/20 active:scale-[0.98] uppercase cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>PREPARANDO PAGO EN SHOPIFY...</span>
                    </>
                  ) : (
                    <>
                      <span>CONTINUAR AL PAGO</span>
                      <span className="material-symbols-outlined text-base">arrow_forward</span>
                    </>
                  )}
                </button>

                {/* SSL Security Badge */}
                <div className="text-center">
                  <p className="text-[10px] font-sans uppercase tracking-[0.2em] text-primary/50 flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-accent-gold">
                      lock
                    </span>
                    PAGO SEGURO CERTIFICADO CON SSL
                  </p>
                </div>
              </div>

              {/* Customer Help Box */}
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold shrink-0">
                  <span className="material-symbols-outlined text-xl">support_agent</span>
                </div>
                <div className="text-xs font-sans">
                  <p className="font-bold text-primary">¿Necesitas ayuda?</p>
                  <a
                    href="https://wa.me/524791428133"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary/70 hover:text-primary transition-colors underline underline-offset-2"
                  >
                    Escríbenos al (479) 142-8133
                  </a>
                </div>
              </div>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
