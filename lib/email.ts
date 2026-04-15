import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

interface InquiryEmailData {
  type: string;
  name: string;
  email: string;
  phone?: string;
  preferredDates?: string;
  guests?: string;
  venue?: string;
  message?: string;
}

export async function sendInquiryNotification(data: InquiryEmailData) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const toEmail = process.env.INQUIRY_NOTIFICATION_EMAIL || "contact@ballusresort.com";

  const resend = getResend();
  if (!resend) {
    console.warn("Resend API key missing — skipping email send");
    return;
  }
  await resend.emails.send({
    from: `Ballu's Resort <${fromEmail}>`,
    to: toEmail,
    subject: `New ${data.type} inquiry from ${data.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1B22; color: #F5EFE3; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #C9A24B; margin: 0;">Ballu's Resort & Café</h1>
          <p style="color: #9CA3AF; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 8px;">New Inquiry</p>
        </div>
        <div style="background: #0F3B47; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <h2 style="color: #C9A24B; font-size: 18px; margin: 0 0 16px;">
            ${data.type.charAt(0).toUpperCase() + data.type.slice(1)} Inquiry
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #9CA3AF; width: 120px;">Name</td><td style="padding: 8px 0;">${data.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #9CA3AF;">Email</td><td style="padding: 8px 0;">${data.email}</td></tr>
            ${data.phone ? `<tr><td style="padding: 8px 0; color: #9CA3AF;">Phone</td><td style="padding: 8px 0;">${data.phone}</td></tr>` : ""}
            ${data.preferredDates ? `<tr><td style="padding: 8px 0; color: #9CA3AF;">Dates</td><td style="padding: 8px 0;">${data.preferredDates}</td></tr>` : ""}
            ${data.guests ? `<tr><td style="padding: 8px 0; color: #9CA3AF;">Guests</td><td style="padding: 8px 0;">${data.guests}</td></tr>` : ""}
            ${data.venue ? `<tr><td style="padding: 8px 0; color: #9CA3AF;">Venue</td><td style="padding: 8px 0;">${data.venue}</td></tr>` : ""}
          </table>
          ${data.message ? `<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1);"><p style="color: #9CA3AF; margin: 0 0 8px;">Message</p><p style="margin: 0;">${data.message}</p></div>` : ""}
        </div>
        <p style="color: #9CA3AF; font-size: 13px; text-align: center;">
          Reply directly to this email or contact ${data.email}
        </p>
      </div>
    `,
  });
}

export async function sendInquiryConfirmation(data: { name: string; email: string }) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  const resend = getResend();
  if (!resend) {
    console.warn("Resend API key missing — skipping email send");
    return;
  }
  await resend.emails.send({
    from: `Ballu's Resort & Café <${fromEmail}>`,
    to: data.email,
    subject: "We've received your inquiry — Ballu's Resort & Café",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0B1B22; color: #F5EFE3; padding: 40px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <h1 style="font-size: 24px; color: #C9A24B; margin: 0;">Ballu's Resort & Café</h1>
          <p style="font-style: italic; color: #E5C97A; margin-top: 8px;">Where the River Meets the Mountains</p>
        </div>
        <div style="background: #0F3B47; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
          <p style="margin: 0 0 16px;">Dear ${data.name},</p>
          <p style="margin: 0 0 16px;">Thank you for reaching out to Ballu's Resort & Café. We've received your inquiry and our team will get back to you within 24 hours.</p>
          <p style="margin: 0 0 16px;">In the meantime, feel free to reach us directly:</p>
          <p style="margin: 0;">
            📞 <a href="tel:+918796017034" style="color: #E5C97A;">+91 8796017034</a><br>
            💬 <a href="https://wa.me/918796017034" style="color: #E5C97A;">WhatsApp</a>
          </p>
        </div>
        <p style="color: #9CA3AF; font-size: 13px; text-align: center;">
          14 Mile Road, Beas Riverside, Manali — 175131
        </p>
      </div>
    `,
  });
}
