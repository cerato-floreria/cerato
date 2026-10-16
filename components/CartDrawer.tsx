'use client';

import React, { useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { toPascalCase } from '@/lib/shopify';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateItemQuantity, removeItem, checkoutUrl, isLoading } =
    useCart();

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
  const lineItems = useMemo(() => {
    if (!cart?.lines) return [];
    if (Array.isArray(cart.lines)) return cart.lines;
    if (Array.isArray((cart.lines as any).nodes)) return (cart.lines as any).nodes;
    if (Array.isArray(cart.lines.edges)) return cart.lines.edges.map((e: any) => e.node || e);
    return [];
  }, [cart]);

  // Calculate total items count
  const totalQuantity = useMemo(() => {
    if (typeof cart?.totalQuantity === 'number' && cart.totalQuantity > 0) {
      return cart.totalQuantity;
    }
    return lineItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);
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
    return lineItems.reduce((acc: number, item: any) => {
      const lineCost = item.cost?.totalAmount?.amount
        ? parseFloat(item.cost.totalAmount.amount)
        : (parseFloat(item.merchandise?.price?.amount || '0') * (item.quantity || 1));
      return acc + (isNaN(lineCost) ? 0 : lineCost);
    }, 0);
  }, [cart, lineItems]);

  const currency =
    cart?.cost?.subtotalAmount?.currencyCode ||
    cart?.cost?.totalAmount?.currencyCode ||
    lineItems[0]?.merchandise?.price?.currencyCode ||
    'MXN';

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      alert(
        'Su carrito está listo. Redirigiendo a la pantalla de pago seguro de Shopify...',
      );
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
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-[130] w-full sm:w-[450px] lg:w-[33%] bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${
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
              lineItems.map((item: any) => {
                const productTitle = toPascalCase(
                  item.merchandise?.product?.title ||
                    item.merchandise?.title ||
                    'Producto Floral'
                );
                const rawVariantTitle = (item.merchandise?.title || '').trim();
                const isDefaultVariant =
                  !rawVariantTitle ||
                  rawVariantTitle.toLowerCase() === 'default title' ||
                  rawVariantTitle.toLowerCase() === 'default';

                const variantTitle = !isDefaultVariant ? toPascalCase(rawVariantTitle) : '';
                const displayTitle =
                  variantTitle && variantTitle.toLowerCase() !== productTitle.toLowerCase()
                    ? `${productTitle} – ${variantTitle}`
                    : productTitle;
                const imageUrl =
                  item.merchandise?.image?.url ||
                  item.merchandise?.product?.featuredImage?.url ||
                  'https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=200';
                
                const unitPrice = parseFloat(item.merchandise?.price?.amount || '0');
                const lineTotal = item.cost?.totalAmount?.amount
                  ? parseFloat(item.cost.totalAmount.amount)
                  : (!isNaN(unitPrice) ? unitPrice * (item.quantity || 1) : 0);

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
                          disabled={isLoading}
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
                              updateItemQuantity(item.id, (item.quantity || 1) - 1)
                            }
                            disabled={isLoading}
                            className="w-7 h-7 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40 cursor-pointer font-bold text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-primary">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() =>
                              updateItemQuantity(item.id, (item.quantity || 1) + 1)
                            }
                            disabled={isLoading}
                            className="w-7 h-7 flex items-center justify-center text-primary/60 hover:bg-primary/10 hover:text-primary transition-colors disabled:opacity-40 cursor-pointer font-bold text-sm"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total Price */}
                        <div className="text-right shrink-0">
                          <span className="font-display font-bold text-sm sm:text-[15px] text-primary block whitespace-nowrap">
                            ${lineTotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {itemCurrency}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer / Summary */}
        <div className="bg-white border-t border-primary/10 px-6 sm:px-8 py-6 sm:py-7 flex flex-col gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.02)] shrink-0">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px] font-sans font-bold uppercase tracking-widest text-primary/50">
              <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'artículo' : 'artículos'})</span>
              <span className="text-primary/80 font-bold">
                ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
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
                ${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={lineItems.length === 0 || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-sans font-bold tracking-[0.25em] text-[11px] transition-all shadow-xl shadow-primary/20 active:scale-[0.98] uppercase mt-1 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? 'PROCESANDO...' : 'PAGAR AHORA'}
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
