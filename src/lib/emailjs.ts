import emailjs from "@emailjs/browser";

/**
 * ─── EMAILJS SETUP (do this once) ────────────────────────────────────────
 *
 * 1. Create a free account at https://www.emailjs.com
 * 2. Email Services → Add New Service → connect the Gmail account
 *    Moshoodalola@gmail.com (or whichever inbox should receive these).
 *    Copy the "Service ID" it gives you into EMAILJS_SERVICE_ID below.
 * 3. Email Templates → Create New Template. Make TWO templates — one for
 *    quote requests, one for testimonials — and use the variable names
 *    below (in double curly braces, e.g. {{from_name}}) inside each
 *    template's subject/body so the data shows up in the email.
 *
 *    Quote template variables:
 *      to_email, from_name, from_email, phone, service, budget,
 *      deadline, details, filename
 *
 *    Testimonial template variables:
 *      to_email, from_name, company, rating, message
 *
 *    Copy each template's "Template ID" into the constants below.
 * 4. Account → General → copy your "Public Key" into EMAILJS_PUBLIC_KEY.
 * 5. Replace the four placeholder strings below with your real values.
 *    That's it — no other code changes needed.
 * ──────────────────────────────────────────────────────────────────────
 */

export const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
export const EMAILJS_TEMPLATE_ID_QUOTE = "YOUR_QUOTE_TEMPLATE_ID";
export const EMAILJS_TEMPLATE_ID_TESTIMONIAL = "YOUR_TESTIMONIAL_TEMPLATE_ID";
export const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

// Where every form submission gets sent.
export const COMPANY_EMAIL = "Moshoodalola@gmail.com";

/**
 * Sends a set of form fields to the company inbox via EmailJS.
 * Throws if the request fails so callers can show an error toast.
 */
export async function sendEmail(
  templateId: string,
  templateParams: Record<string, string | number>
) {
  return emailjs.send(
    EMAILJS_SERVICE_ID,
    templateId,
    { to_email: COMPANY_EMAIL, ...templateParams },
    { publicKey: EMAILJS_PUBLIC_KEY }
  );
}
