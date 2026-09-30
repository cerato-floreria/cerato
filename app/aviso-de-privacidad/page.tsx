import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Privacidad | Cerato Arte Floral",
  description: "Aviso de privacidad y protección de datos personales de Cerato Arte Floral en León, Guanajuato, México."
};

export default function AvisoPrivacidadPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24 px-6 lg:px-20">
      <div className="mx-auto max-w-4xl bg-white rounded-2xl p-8 lg:p-14 shadow-xl border border-primary/5">
        <div className="mb-8 border-b border-primary/10 pb-6 text-center">
          <span className="text-4xl mb-4 block">🔒</span>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-primary mb-2">
            Aviso de Privacidad
          </h1>
          <p className="text-xs font-sans uppercase tracking-[0.2em] text-primary/60">
            Cerato Arte Floral — León, Guanajuato, México
          </p>
        </div>

        <div className="prose prose-purple max-w-none text-charcoal/80 space-y-6 text-sm lg:text-base leading-relaxed">
          <p>
            En <strong>Cerato Arte Floral</strong>, con domicilio en Blvd. Juan Alonso de Torres 419 local 7, San José del Consuelo en León, Guanajuato, México, somos responsables del uso, tratamiento y protección de sus datos personales, y al respecto le informamos lo siguiente:
          </p>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>📋</span> Datos personales que recabamos
            </h2>
            <p>Para brindarle nuestros servicios, podremos solicitar los siguientes datos personales:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Nombre completo</li>
              <li>Número telefónico</li>
              <li>Dirección de entrega</li>
              <li>Referencias de ubicación para envíos</li>
              <li>Mensajes o dedicatorias para arreglos florales</li>
            </ul>
          </section>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>🎯</span> Finalidad del uso de sus datos
            </h2>
            <p>Los datos personales que recabamos serán utilizados para las siguientes finalidades:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Procesar y gestionar pedidos de arreglos florales</li>
              <li>Realizar entregas a domicilio</li>
              <li>Contactarlo para confirmar pedidos o entregas</li>
              <li>Brindar atención al cliente</li>
            </ul>
            <p className="mt-4 font-semibold text-primary">De manera adicional, podremos utilizar su información para:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
              <li>Envío de promociones o novedades (previa autorización)</li>
            </ul>
            <p className="mt-2 text-xs text-charcoal/70">
              En caso de que no desee que sus datos sean utilizados para estas finalidades adicionales, puede indicarlo en cualquier momento.
            </p>
          </section>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>🤝</span> Transferencia de datos
            </h2>
            <p>Le informamos que sus datos personales no serán compartidos con terceros, salvo con:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Servicios de mensajería o repartidores, únicamente con la finalidad de realizar la entrega de su pedido</li>
              <li>Autoridades competentes, en los casos legalmente previstos</li>
            </ul>
          </section>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>🛡️</span> Derechos ARCO
            </h2>
            <p>Usted tiene derecho a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Conocer qué datos personales tenemos de usted y para qué los utilizamos (<strong>Acceso</strong>)</li>
              <li>Solicitar la corrección de sus datos personales en caso de que estén desactualizados o incorrectos (<strong>Rectificación</strong>)</li>
              <li>Solicitar que eliminemos sus datos de nuestros registros (<strong>Cancelación</strong>)</li>
              <li>Oponerse al uso de sus datos para fines específicos (<strong>Oposición</strong>)</li>
            </ul>
            <div className="bg-cream p-5 rounded-xl border border-primary/10 mt-4">
              <p className="font-semibold text-primary mb-2">Para ejercer cualquiera de estos derechos, puede comunicarse a través de:</p>
              <ul className="space-y-1 text-sm">
                <li>📞 <strong>Teléfono / WhatsApp:</strong> 479 142 8133</li>
                <li>✉️ <strong>Correo electrónico:</strong> hola@cerato.com</li>
              </ul>
            </div>
          </section>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>🌐</span> Uso de plataformas digitales
            </h2>
            <p>
              En caso de realizar compras o contacto a través de nuestro sitio web o redes sociales, podremos utilizar cookies y herramientas similares para mejorar su experiencia de navegación.
            </p>
          </section>

          <hr className="border-primary/10 my-6" />

          <section>
            <h2 className="font-display text-xl font-bold text-primary flex items-center gap-2 mb-2">
              <span>🔄</span> Modificaciones al aviso de privacidad
            </h2>
            <p>
              El presente aviso de privacidad puede sufrir modificaciones o actualizaciones derivadas de requerimientos legales o de nuestras propias prácticas comerciales. Cualquier cambio será publicado a través de nuestros canales oficiales.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-primary/10 text-center text-xs text-primary/60">
            <p><strong>Fecha de última actualización:</strong> Junio 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
