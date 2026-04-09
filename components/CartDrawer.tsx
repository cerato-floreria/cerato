"use client";

import React, { useEffect } from "react";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  // Sample items state (Shopify engine will populate this later)
  const [cartItems, setCartItems] = React.useState([
    {
      id: 1,
      name: "Ramo de Rosas Blancas",
      price: 85,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1591886911223-3cd63f58296c?auto=format&fit=crop&q=80&w=200",
    },
    {
      id: 2,
      name: "Orquídea Phalaenopsis",
      price: 120,
      quantity: 1,
      image: "https://images.unsplash.com/photo-1534073733321-e126c23ffbc0?auto=format&fit=crop&q=80&w=200",
    }
  ]);

  // Handle ESC key and scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      {/* Backdrop (No blur as requested) */}
      <div 
        className={`fixed inset-0 z-[120] bg-black/40 transition-opacity duration-500 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer - Responsive width for mobile, tablet and desktop */}
      <div className={`fixed right-0 top-0 bottom-0 z-[130] w-full sm:w-[450px] lg:w-[33%] bg-white shadow-2xl transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 bg-primary text-white">
          <div className="flex flex-col">
            <h2 className="text-2xl font-display font-bold tracking-tight">Tu Carrito</h2>
            <p className="text-[10px] font-sans text-white/70 uppercase tracking-[0.2em]">Cerato Arte Floral</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors cursor-pointer p-2">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </div>

        {/* Content with Wave Pattern */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-8 bg-wave-pattern">
          <div className="flex flex-col gap-8">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-primary/10 mb-4">shopping_bag</span>
                <p className="text-primary/40 font-display italic text-lg">Tu carrito está vacío</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <React.Fragment key={item.id}>
                  <div className="flex gap-5 group">
                    <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden bg-gray-100 shadow-sm border border-primary/5">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        sizes="96px"
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-display font-medium leading-tight text-primary pr-2">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-primary/20 hover:text-red-700 transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xl">delete</span>
                        </button>
                      </div>
                      <div className="flex justify-between items-center font-sans mt-2">
                        <div className="flex items-center border border-primary/10 rounded-lg overflow-hidden bg-white shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="px-3 py-1 text-primary/40 hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-bold text-primary/80 min-w-[20px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="px-3 py-1 text-primary/40 hover:bg-primary/5 hover:text-primary transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-lg font-display font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <hr className="border-primary/5 last:hidden" />
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        {/* Footer / Summary */}
        <div className="bg-white border-t border-primary/10 px-6 sm:px-8 py-6 sm:py-8 flex flex-col gap-4 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[11px] font-sans font-bold uppercase tracking-widest text-primary/40">
              <span>Subtotal</span>
              <span className="text-primary/60">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] font-sans font-bold uppercase tracking-widest text-primary/40">
              <span>Envío</span>
              <span className="italic normal-case font-medium text-accent">Calculado al pagar</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-primary/10">
              <span className="text-xl font-display font-bold text-primary">Total</span>
              <span className="text-2xl font-display font-bold text-primary">${subtotal.toFixed(2)}</span>
            </div>
          </div>
          <button className="w-full bg-primary hover:bg-primary/90 text-white py-5 rounded-xl font-sans font-bold tracking-[0.25em] text-[11px] transition-all shadow-xl shadow-primary/20 active:scale-[0.98] uppercase mt-2">
            PAGAR AHORA
          </button>
          <p className="text-center text-[9px] font-sans text-primary/40 uppercase tracking-[0.2em] mt-2">
            Pago seguro garantizado por Cerato
          </p>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
