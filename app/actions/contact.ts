"use server";

function sanitize(str: string): string {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export interface ContactFormState {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}

export async function submitContactForm(formData: FormData): Promise<ContactFormState> {
  const name = sanitize((formData.get("name") as string) || "");
  const email = sanitize((formData.get("email") as string) || "");
  const phone = sanitize((formData.get("phone") as string) || "");
  const message = sanitize((formData.get("message") as string) || "");

  const errors: Record<string, string> = {};

  if (!name || name.trim().length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres.";
  }

  if (!email || !isValidEmail(email)) {
    errors.email = "Ingresa un correo electrónico válido.";
  }

  if (!message || message.trim().length < 5) {
    errors.message = "El mensaje debe tener al menos 5 caracteres.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Por favor corrige los errores del formulario.",
      errors
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const resendUrl = process.env.RESEND_URL || "https://api.resend.com/emails";
  const resendTo = process.env.RESEND_TO || "ceratofloreria@gmail.com";
  const resendFrom = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (!apiKey || apiKey.includes("placeholder")) {
    console.log("Mocking Resend email dispatch to:", resendTo);
    return {
      success: true,
      message: "¡Gracias por contactar a Cerato Floral! Nos comunicaremos contigo a la brevedad."
    };
  }

  try {
    const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; color: #2D1B2E; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #6B4E71; border-radius: 8px;">
        <h2 style="color: #2D1B2E; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Nuevo Mensaje de Contacto — Cerato Floral</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Correo electrónico:</strong> ${email}</p>
        <p><strong>Teléfono:</strong> ${phone || "No proporcionado"}</p>
        <div style="background-color: #FDFBF7; padding: 15px; border-left: 4px solid #6B4E71; margin-top: 15px;">
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;" />
        <p style="font-size: 12px; color: #888;">Enviado desde el formulario de contacto web de Cerato Floral.</p>
      </div>
    `;

    const resendResponse = await fetch(resendUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [resendTo],
        subject: `Nuevo mensaje de ${name} — Cerato Floral`,
        html: htmlTemplate
      })
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Resend API Error:", errorText);
      return {
        success: false,
        message: "Ocurrió un error al enviar el correo. Por favor intente nuevamente o contáctenos por WhatsApp."
      };
    }

    return {
      success: true,
      message: "¡Gracias por contactar a Cerato Floral! Nos comunicaremos contigo a la brevedad."
    };
  } catch (error) {
    console.error("Contact form error:", error);
    return {
      success: false,
      message: "Error de red al procesar la solicitud. Por favor intenta más tarde."
    };
  }
}
