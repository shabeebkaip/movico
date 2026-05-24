import "server-only";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EnquiryEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  budget: string;
  message?: string;
  submittedAt: string;
}

export async function sendEnquiryEmail(data: EnquiryEmailData) {
  const recipients = (process.env.ENQUIRY_RECIPIENTS ?? process.env.SMTP_USER ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;border-radius:12px;overflow:hidden">
      <div style="background:#d98629;padding:24px 32px">
        <h2 style="margin:0;font-size:20px;font-weight:900;letter-spacing:0.05em;text-transform:uppercase;color:#000">
          New Enquiry — Movico
        </h2>
        <p style="margin:4px 0 0;font-size:12px;color:#0008;letter-spacing:0.1em;text-transform:uppercase">
          ${data.submittedAt}
        </p>
      </div>

      <div style="padding:32px">
        <table style="width:100%;border-collapse:collapse">
          ${row("Name",    data.name)}
          ${row("Email",   `<a href="mailto:${data.email}" style="color:#d98629">${data.email}</a>`)}
          ${data.phone   ? row("Phone",   data.phone)   : ""}
          ${data.company ? row("Company", data.company) : ""}
          ${row("Service", data.service)}
          ${row("Budget",  data.budget)}
        </table>

        ${data.message ? `
        <div style="margin-top:24px;padding:16px;background:#1a1a1a;border-radius:8px;border-left:3px solid #d98629">
          <p style="margin:0 0 8px;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#ffffff60">Message</p>
          <p style="margin:0;font-size:14px;line-height:1.6;color:#ffffffcc">${data.message.replace(/\n/g, "<br>")}</p>
        </div>` : ""}
      </div>

      <div style="padding:16px 32px;background:#111;border-top:1px solid #ffffff10;text-align:center">
        <p style="margin:0;font-size:11px;color:#ffffff30">Movico CMS · Automated notification</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"Movico CMS" <${process.env.SMTP_FROM}>`,
    to: recipients.join(", "),
    replyTo: data.email,
    subject: `New Enquiry: ${data.name} — ${data.service}`,
    html,
  });
}

function row(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 0;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;color:#ffffff40;width:120px;vertical-align:top">${label}</td>
      <td style="padding:10px 0;font-size:14px;color:#ffffffcc;border-bottom:1px solid #ffffff0d">${value}</td>
    </tr>
  `;
}
