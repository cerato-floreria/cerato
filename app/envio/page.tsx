import React from "react";
import { Metadata } from "next";
import ShippingForm from "@/components/ShippingForm";

export const metadata: Metadata = {
  title: "Detalles de Envío | Cerato Floral León, Gto.",
  description:
    "Configura los detalles de entrega, fecha, horario y dedicatoria para tu pedido de Cerato Floral en León, Guanajuato.",
  robots: {
    index: false, // Checkout & shipping steps should typically not be indexed by search engines
    follow: false
  }
};

export default function ShippingPage() {
  return <ShippingForm />;
}
