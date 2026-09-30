import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Reembolsos y Garantía de Calidad | Cerato Arte Floral",
  description: "Política de reembolsos, cancelaciones y garantía de calidad de Cerato Arte Floral en León, Guanajuato, México."
};

export default function PoliticaDeReembolsosPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 lg:px-20">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl p-8 lg:p-14 shadow-xl border border-primary/5">
        <div className="mb-8 border-b border-primary/10 pb-6 text-center">
          <span className="text-4xl mb-4 block">🌸</span>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary mb-2">
            Política de reembolsos y garantía de calidad
          </h1>
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-primary/60">
            Cerato Arte Floral — León, Guanajuato, México
          </p>
        </div>

        <div className="prose prose-purple max-w-none text-charcoal/80 space-y-6 text-sm lg:text-base leading-relaxed">
          <p className="italic font-display text-primary text-base lg:text-lg">
            En Cerato trabajamos con flores frescas y seleccionadas cuidadosamente para cada ocasión. Cada arreglo es elaborado con dedicación para transmitir emociones y crear momentos especiales.
          </p>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>🌿</span> Productos perecederos
            </h2>
            <p>
              Debido a la naturaleza de nuestros productos, <strong>no realizamos cambios, cancelaciones ni reembolsos una vez confirmado el pedido</strong>. Agradecemos tu comprensión, ya que cada arreglo se prepara especialmente para ti.
            </p>
          </section>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>💐</span> Garantía de calidad
            </h2>
            <p>
              Si tu pedido llega en condiciones no adecuadas, queremos saberlo y apoyarte.
            </p>
            <p className="font-semibold text-primary">Para poder ayudarte, es importante que:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Reportes el inconveniente <strong>al momento de la entrega</strong></li>
              <li>Envíes <strong>fotografías y/o videos como evidencia</strong></li>
            </ul>
            <p className="mt-2 text-sm text-charcoal/70">
              Esto nos permitirá evaluar correctamente lo sucedido.
            </p>
          </section>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>✨</span> Soluciones
            </h2>
            <p>
              Cada caso será revisado con atención. En situaciones donde aplique, podremos ofrecer:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              <div className="bg-cream/70 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
                <span className="text-2xl">🌼</span>
                <span className="font-medium text-primary">Reposición del producto</span>
              </div>
              <div className="bg-cream/70 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
                <span className="text-2xl">💳</span>
                <span className="font-medium text-primary">Crédito para una compra futura</span>
              </div>
            </div>
            <p className="text-sm">
              Nuestro objetivo es que tengas una experiencia satisfactoria con nosotros.
            </p>
          </section>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>⚠️</span> Consideraciones
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>La garantía aplica únicamente <strong>al momento de la entrega</strong>.</li>
              <li>
                Las flores al ser productos naturales pueden presentar ligeras variaciones en tono, tamaño o apertura, lo cual no se considerará defecto.
              </li>
              <li>
                En caso de no contar con el reporte y evidencia en tiempo, o si el caso no procede, <strong>no se realizarán reembolsos ni devoluciones</strong>.
              </li>
            </ul>
          </section>

          <section className="bg-primary text-white p-6 rounded-xl text-center mt-8 shadow-md">
            <h2 className="font-display text-xl font-bold mb-2">🤍 Compromiso</h2>
            <p className="text-sm opacity-90">
              Agradecemos tu confianza. Trabajamos todos los días para que cada entrega cumpla con la calidad y el cuidado que nos caracteriza.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
