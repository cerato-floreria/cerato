"use client";

import React, { useEffect } from "react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl flex flex-col transition-all duration-500 transform scale-100">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
          <div className="flex flex-col">
            <h2 className="text-2xl font-display font-bold tracking-tight text-primary">Aviso de Privacidad</h2>
            <p className="text-[10px] font-sans text-primary/40 uppercase tracking-[0.2em]">Cerato Arte Floral • México</p>
          </div>
          <button 
            onClick={onClose} 
            className="group flex h-10 w-10 items-center justify-center rounded-full border border-primary/5 bg-primary/5 text-primary/60 transition-all hover:bg-primary hover:text-white"
            aria-label="Cerrar modal"
          >
            <span className="material-symbols-outlined text-2xl transition-transform group-hover:rotate-90">close</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-10 bg-wave-pattern">
          <div className="prose prose-sm max-w-none text-primary/70 font-sans leading-relaxed">
            <p className="mb-6">
              En cumplimiento con la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares (en lo sucesivo la "Ley")</strong>, Cerato Arte Floral, con domicilio para oír y recibir notificaciones en la Ciudad de México, hace de su conocimiento el presente Aviso de Privacidad.
            </p>

            <h3 className="text-lg font-display font-medium text-primary mb-3 mt-8">1. Datos Personales Recabados</h3>
            <p>
              Para las finalidades señaladas en el presente aviso, recabamos sus datos personales de forma directa cuando usted visita nuestro sitio web, realiza una compra o se suscribe a nuestro boletín. Los datos que obtenemos incluyen: nombre completo, domicilio de entrega, dirección de correo electrónico, número telefónico y datos de facturación.
            </p>

            <h3 className="text-lg font-display font-medium text-primary mb-3 mt-8">2. Uso de Plataformas de Terceros (Shopify)</h3>
            <p>
              Le informamos que Cerato Arte Floral utiliza la plataforma <strong>Shopify Inc.</strong> para la gestión de su tienda en línea y procesamiento de transacciones comerciales. Shopify actúa como encargado del tratamiento de datos personales, garantizando niveles de seguridad adecuados para la protección de su información financiera y personal de acuerdo a estándares internacionales.
            </p>

            <h3 className="text-lg font-display font-medium text-primary mb-3 mt-8">3. Finalidades del Tratamiento</h3>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>Procesar, dar seguimiento y entregar sus pedidos de flores y regalos.</li>
              <li>Validar la veracidad de la información proporcionada para evitar fraudes.</li>
              <li>Realizar la facturación correspondiente de sus compras.</li>
              <li>Atención a clientes y soporte técnico.</li>
              <li>Envío de promociones y noticias (solo si usted ha dado su consentimiento explícito).</li>
            </ul>

            <h3 className="text-lg font-display font-medium text-primary mb-3 mt-8">4. Derechos ARCO</h3>
            <p>
              Usted tiene el derecho de acceder a sus datos personales que poseemos y a los detalles del tratamiento de los mismos, así como a rectificarlos en caso de ser inexactos, cancelarlos cuando considere que resulten ser excesivos o innecesarios, u oponerse al tratamiento de los mismos para fines específicos.
            </p>
            <p className="mt-2">
              Para ejercer sus derechos ARCO, deberá enviar una solicitud al correo electrónico: <strong>privacidad@cerato floral.mx</strong> o comunicarse al teléfono proporcionado en nuestra sección de contacto.
            </p>

            <h3 className="text-lg font-display font-medium text-primary mb-3 mt-8">5. Cookies y Tecnologías de Rastreo</h3>
            <p>
              Nuestro sitio utiliza cookies para mejorar su experiencia de navegación. Estas herramientas permiten recordar sus preferencias y ofrecerle contenido personalizado. Usted puede deshabilitar las cookies desde la configuración de su navegador, aunque esto podría limitar algunas funciones de la tienda.
            </p>

            <h3 className="text-lg font-display font-medium text-primary mb-3 mt-8">6. Modificaciones al Aviso de Privacidad</h3>
            <p>
              Cerato se reserva el derecho de efectuar en cualquier momento modificaciones o actualizaciones al presente aviso de privacidad, para la atención de novedades legislativas o políticas internas. Estas modificaciones estarán disponibles al público a través de este mismo medio.
            </p>

            <div className="mt-12 pt-8 border-t border-primary/5 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary/30">
                Última actualización: Abril 2026
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-primary text-white px-8 py-3 rounded-xl font-sans font-bold tracking-[0.1em] text-xs hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
          >
            ENTENDIDO
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
