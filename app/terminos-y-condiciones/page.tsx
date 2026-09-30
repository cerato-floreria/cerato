import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones de Uso y Compra | Cerato Arte Floral",
  description: "Términos y condiciones de uso y compra en línea para Cerato Arte Floral en León, Guanajuato, México."
};

export default function TerminosYCondicionesPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 lg:px-20">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl p-8 lg:p-14 shadow-xl border border-primary/5">
        <div className="mb-8 border-b border-primary/10 pb-6 text-center">
          <span className="text-4xl mb-4 block">📜</span>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary mb-2">
            Términos y Condiciones de Uso y Compra
          </h1>
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-primary/60">
            Cerato Arte Floral — León, Guanajuato, México
          </p>
        </div>

        <div className="prose prose-purple max-w-none text-charcoal/80 space-y-6 text-sm lg:text-base leading-relaxed">
          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>1.</span> Generalidades
            </h2>
            <p>
              Al acceder y realizar una compra en nuestro sitio web, el cliente acepta los presentes Términos y Condiciones. Estos aplican a todas las ventas realizadas a través de nuestra plataforma digital.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>2.</span> Disponibilidad de productos
            </h2>
            <p>
              Todos los arreglos florales están sujetos a disponibilidad. En caso de no contar con alguna flor o material específico, nos reservamos el derecho de realizar sustituciones por elementos de igual o mayor valor, respetando el estilo y diseño original.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>3.</span> Precios
            </h2>
            <p>
              Los precios publicados en el sitio web son exclusivos para compras en línea y pueden variar respecto a los precios ofrecidos en nuestra tienda física.
            </p>
            <p>
              Nos reservamos el derecho de modificar los precios en cualquier momento sin previo aviso.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>4.</span> Pedidos y pagos
            </h2>
            <p>
              El pedido se considerará confirmado una vez que el pago haya sido procesado correctamente. Nos reservamos el derecho de rechazar o cancelar pedidos en caso de detectar irregularidades en el pago o disponibilidad.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>5.</span> Entregas
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Las entregas se realizan en los horarios y zonas previamente especificados.</li>
              <li>Es responsabilidad del cliente proporcionar datos correctos y completos de entrega.</li>
              <li>En caso de ausencia del destinatario, se intentará realizar la entrega según nuestras políticas internas, pudiendo generar cargos adicionales.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>6.</span> Cancelaciones y cambios
            </h2>
            <p>
              Las cancelaciones o modificaciones deberán solicitarse con al menos <strong>24 horas de anticipación</strong>. Después de este plazo, no se garantizan cambios ni reembolsos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>7.</span> Naturaleza del producto
            </h2>
            <p>
              Al tratarse de productos naturales, las flores pueden presentar ligeras variaciones en color, tamaño o forma respecto a las imágenes mostradas en el sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>8.</span> Globos con helio
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>
                Los globos con helio son productos de duración limitada y su tiempo de flotación puede variar dependiendo del material, condiciones climáticas y manipulación.
              </li>
              <li>
                De forma estimada:
                <ul className="list-disc list-inside space-y-1 ml-6 mt-1 text-sm">
                  <li><strong>Globos de látex:</strong> entre 6 y 12 horas.</li>
                  <li><strong>Globos metálicos (foil):</strong> entre 2 y 5 días.</li>
                </ul>
              </li>
              <li>No se garantiza un tiempo exacto de flotación.</li>
              <li>Factores como calor, frío, cambios de altitud o exposición directa al sol pueden reducir significativamente su duración.</li>
              <li>Una vez entregados, no nos hacemos responsables por el manejo, cuidado o condiciones a las que sean expuestos.</li>
              <li>Los globos pueden desinflarse de manera natural con el paso del tiempo, lo cual no se considera defecto.</li>
              <li>No hay cambios ni devoluciones en globos una vez entregados.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>9.</span> Responsabilidad
            </h2>
            <p>
              No nos hacemos responsables por retrasos ocasionados por causas externas, tales como condiciones climáticas, tráfico o situaciones fuera de nuestro control.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>10.</span> Propiedad intelectual
            </h2>
            <p>
              Las imágenes, diseños y contenido del sitio web son propiedad de la florería y no pueden ser utilizados sin autorización previa.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>11.</span> Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho de actualizar o modificar estos Términos y Condiciones en cualquier momento sin previo aviso.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-primary/10 text-center text-xs text-primary/60">
            <p><strong>Última actualización:</strong> Junio 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
