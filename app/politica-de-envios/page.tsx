import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Envíos Locales | Cerato Floral León, Gto.",
  description: "Información detallada sobre la política de envíos locales en León, Guanajuato, México. Horarios, cobertura y procedimiento de entrega."
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 lg:px-20">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl p-8 lg:p-14 shadow-xl border border-primary/5">
        <div className="mb-8 border-b border-primary/10 pb-6 text-center">
          <span className="text-4xl mb-4 block">🚚</span>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary mb-2">
            Política de envíos locales
          </h1>
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-primary/60">
            Cerato Floral — León, Guanajuato, México
          </p>
        </div>

        <div className="prose prose-purple max-w-none text-charcoal/80 space-y-6 text-sm lg:text-base leading-relaxed">
          <p className="italic font-display text-primary text-base lg:text-lg">
            En Cerato, cada entrega es parte de la experiencia. Nos esforzamos por cuidar cada detalle para que tu pedido llegue en tiempo y forma, transmitiendo exactamente lo que deseas.
          </p>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>📍</span> Cobertura de envíos
            </h2>
            <p>
              Realizamos <strong>envíos locales dentro de León, Guanajuato, México</strong>. <em>No contamos con envíos nacionales</em>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>🗓️</span> Días y horarios de entrega
            </h2>
            <p>Las entregas se realizan en los siguientes <strong>bloques de horarios</strong>:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 bg-cream p-5 rounded-xl border border-primary/10">
              <div>
                <h3 className="font-bold text-primary mb-2">Lunes a viernes</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>10:00 a.m. a 1:00 p.m.</li>
                  <li>1:00 p.m. a 4:00 p.m.</li>
                  <li>4:00 p.m. a 7:00 p.m.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-primary mb-2">Sábado</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>10:00 a.m. a 1:00 p.m.</li>
                  <li>1:00 p.m. a 4:00 p.m.</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-primary/70">
              La disponibilidad de los bloques puede variar según el día y la demanda. <strong>Domingos: sin servicio de entregas.</strong>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>✍️</span> Información del pedido
            </h2>
            <p>
              El cliente es responsable de verificar que la información proporcionada (fecha de entrega, dirección, datos del destinatario y mensaje) sea correcta al momento de realizar su compra.
            </p>
            <p>No nos hacemos responsables por retrasos o inconvenientes derivados de información incorrecta o incompleta.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>💸</span> Costo de envío
            </h2>
            <p>
              El costo del servicio a domicilio se calcula con base en la <strong>zona o distancia de entrega</strong> e incluye <strong>un solo intento de entrega</strong>.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>⏱️</span> Entrega en domicilio
            </h2>
            <p>Es importante que el destinatario pueda recibir el pedido en el momento de la entrega.</p>
            <p>El repartidor esperará un máximo de <strong>10 minutos</strong> en el domicilio. En caso de no lograr la entrega:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>El pedido será devuelto a la florería</li>
              <li>El reenvío generará un <strong>nuevo costo de envío</strong></li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>📦</span> Confirmación de entrega
            </h2>
            <p>Para garantizar transparencia y seguridad:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 my-2">
              <li>El repartidor tomará <strong>fotografía como evidencia de la entrega</strong></li>
              <li>Se solicitará el <strong>nombre de la persona que recibe</strong></li>
            </ul>
            <p>Esta información será compartida con el cliente en tiempo real.</p>
            <p className="mt-2 text-xs text-primary/70">
              En caso de entregas en casetas, recepción, lobby o con personal de seguridad, se aplicará el mismo procedimiento, considerándose como entrega completada.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>🌸</span> Consideraciones importantes
            </h2>
            <p>Una vez entregado el pedido, la responsabilidad del cuidado del producto pasa a la persona que lo recibe.</p>
          </section>

          <section className="bg-primary text-white p-6 rounded-xl text-center mt-8">
            <h2 className="font-display text-xl font-bold mb-2">🤍 Nuestro compromiso</h2>
            <p className="text-sm opacity-90">
              Trabajamos con dedicación para que cada entrega sea puntual, cuidada y especial. Agradecemos tu confianza y comprensión para mantener la calidad de nuestro servicio.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
