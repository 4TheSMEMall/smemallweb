import type { WibgApplicationStatus } from "../repositories/PrismaWibgRepository";

const API_URL  = process.env.BREVO_SEND_EMAIL_URL ?? "https://api.brevo.com/v3/smtp/email";
const API_KEY  = process.env.BREVO_API_KEY ?? "";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "noreply@thesmemall.com";
const FROM_NAME  = process.env.BREVO_EMAIL_SENDER_NAME ?? "SME Mall";

async function send(to: { email: string; name: string }, subject: string, html: string) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "api-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: { name: FROM_NAME, email: FROM_EMAIL },
      to: [to],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("[Brevo] send failed:", res.status, body);
  }
}

function base(content: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>SME Mall</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px;">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:#0a1628;border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;">
    <span style="color:#fff;font-size:20px;font-weight:800;letter-spacing:-0.5px;">SME Mall</span>
    <span style="color:rgba(255,255,255,0.3);margin:0 8px;">×</span>
    <span style="color:#22c55e;font-size:14px;font-weight:700;">WIBG 2026</span>
  </td></tr>
  <tr><td style="background:#fff;padding:36px;border-radius:0 0 16px 16px;">
    ${content}
    <hr style="border:none;border-top:1px solid #f0f0f0;margin:28px 0;">
    <p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.6;">
      This email was sent by SME Mall regarding your WIBG 2026 application.<br>
      Questions? Reply to this email or visit <a href="https://thesmemall.com" style="color:#0a1628;">thesmemall.com</a>
    </p>
  </td></tr>
</table>
</td></tr></table>
</body></html>`;
}

function badge(text: string, bg: string, color: string) {
  return `<span style="display:inline-block;background:${bg};color:${color};font-size:12px;font-weight:700;padding:4px 12px;border-radius:100px;margin-bottom:20px;">${text}</span>`;
}

function btn(text: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:#0a1628;color:#fff;font-weight:700;font-size:14px;padding:13px 28px;border-radius:10px;text-decoration:none;margin-top:20px;">${text}</a>`;
}

const STATUS_CONFIG: Record<WibgApplicationStatus, {
  subject: string;
  badgeText: string;
  badgeBg: string;
  badgeColor: string;
  heading: string;
  body: (name: string) => string;
} | null> = {
  SUBMITTED: null,
  UNDER_REVIEW: {
    subject: "Your WIBG 2026 application is under review",
    badgeText: "Under Review",
    badgeBg: "#eff6ff",
    badgeColor: "#1d4ed8",
    heading: "We're reviewing your application",
    body: (name) => `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${name}</strong>,<br><br>
      Thank you for submitting your WIBG 2026 application. Our panel is now actively reviewing it against the judging criteria.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
      You'll hear from us once the review is complete. In the meantime, if the webinar dates have not passed, please make sure you attend at least 2 of the 3 June weekends (both Saturday and Sunday each).
      </p>`,
  },
  TOP_20: {
    subject: "🎉 You've been shortlisted — WIBG 2026 Top 20!",
    badgeText: "Top 20 Shortlisted",
    badgeBg: "#f0fdf4",
    badgeColor: "#15803d",
    heading: "Congratulations — you're in the Top 20!",
    body: (name) => `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${name}</strong>,<br><br>
      We're thrilled to inform you that your application has been selected as one of the <strong>Top 20</strong> applications for the WIBG 2026 competition. This is a significant achievement out of all the applications we received.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      <strong>Next step:</strong> Your virtual pitch is scheduled for <strong>June 28, 2026</strong>. We'll send you the Zoom link and further instructions separately. Please keep your calendar free.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
      Six finalists will be selected from the Top 20 to advance to the Grand Finale on July 4, 2026 in Lagos.
      </p>`,
  },
  TOP_6: {
    subject: "🏆 You're a WIBG 2026 Finalist!",
    badgeText: "Top 6 Finalist",
    badgeBg: "#fefce8",
    badgeColor: "#854d0e",
    heading: "You're a WIBG 2026 Finalist!",
    body: (name) => `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${name}</strong>,<br><br>
      We are proud to announce that you have been selected as one of the <strong>Top 6 Finalists</strong> for the WIBG 2026 Grand Finale. You pitched brilliantly and you deserve this.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      <strong>Grand Finale:</strong> July 4, 2026 — in-person in Lagos. You must be present to compete for the ₦3,000,000 grant pool.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
      Your finalist briefing pack — including venue details, run-of-show, and what to prepare — will be sent within 48 hours. Congratulations!
      </p>`,
  },
  WINNER_1ST: {
    subject: "🥇 You won 1st place at WIBG 2026 — ₦1,500,000!",
    badgeText: "1st Place Winner",
    badgeBg: "#fef9c3",
    badgeColor: "#713f12",
    heading: "You won the WIBG 2026 Grand Prize!",
    body: (name) => `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${name}</strong>,<br><br>
      Congratulations! You have been awarded <strong>1st Place</strong> at the WIBG 2026 Grand Finale, earning you a <strong>₦1,500,000 equity-free grant</strong> — plus VC coaching and exhibition space.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
      Our team will contact you within 14 business days to process your grant disbursement. Welcome to the winners' circle!
      </p>`,
  },
  WINNER_2ND: {
    subject: "🥈 You won 2nd place at WIBG 2026 — ₦1,000,000!",
    badgeText: "2nd Place Winner",
    badgeBg: "#f1f5f9",
    badgeColor: "#334155",
    heading: "You placed 2nd at WIBG 2026!",
    body: (name) => `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${name}</strong>,<br><br>
      Congratulations! You have been awarded <strong>2nd Place</strong> at the WIBG 2026 Grand Finale, earning you a <strong>₦1,000,000 equity-free grant</strong> plus 6 months of mentorship.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
      Our team will contact you within 14 business days to process your grant disbursement.
      </p>`,
  },
  WINNER_3RD: {
    subject: "🥉 You won 3rd place at WIBG 2026 — ₦500,000!",
    badgeText: "3rd Place Winner",
    badgeBg: "#fff7ed",
    badgeColor: "#9a3412",
    heading: "You placed 3rd at WIBG 2026!",
    body: (name) => `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${name}</strong>,<br><br>
      Congratulations! You have been awarded <strong>3rd Place</strong> at the WIBG 2026 Grand Finale, earning you a <strong>₦500,000 equity-free grant</strong> plus 3 months of capacity building.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
      Our team will contact you within 14 business days to process your grant disbursement.
      </p>`,
  },
  REJECTED: {
    subject: "Your WIBG 2026 application — an update",
    badgeText: "Application Update",
    badgeBg: "#fef2f2",
    badgeColor: "#991b1b",
    heading: "Thank you for applying to WIBG 2026",
    body: (name) => `<p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${name}</strong>,<br><br>
      Thank you for taking the time to apply for WIBG 2026 and for completing the Business Health Check. After careful review by our judging panel, we were unfortunately unable to shortlist your application for this edition.
      </p>
      <p style="color:#374151;font-size:15px;line-height:1.7;margin:0;">
      This does not reflect the potential of your business — competition was incredibly strong. We encourage you to keep building, use your BHC report to strengthen your foundations, and we look forward to seeing your progress in future WIBG editions.
      </p>`,
  },
};

export async function sendStatusEmail(
  founderEmail: string,
  founderName: string,
  status: WibgApplicationStatus,
) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return;

  const firstName = founderName.split(" ")[0];
  const html = base(`
    <div style="text-align:center;margin-bottom:8px;">
      ${badge(cfg.badgeText, cfg.badgeBg, cfg.badgeColor)}
    </div>
    <h1 style="color:#0a1628;font-size:22px;font-weight:800;margin:0 0 16px;text-align:center;">${cfg.heading}</h1>
    ${cfg.body(firstName)}
    <div style="text-align:center;">
      ${btn("Visit SME Mall Dashboard", "https://thesmemall.com/dashboard")}
    </div>
  `);

  await send({ email: founderEmail, name: founderName }, cfg.subject, html);
}

export async function sendVideoReminderEmail(
  founderEmail: string,
  founderName: string,
  businessName: string,
) {
  const firstName = founderName.split(" ")[0];
  const html = base(`
    <div style="text-align:center;margin-bottom:8px;">
      ${badge("Action Required", "#fff7ed", "#9a3412")}
    </div>
    <h1 style="color:#0a1628;font-size:22px;font-weight:800;margin:0 0 16px;text-align:center;">Tag us in your pitch video</h1>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${firstName}</strong>,<br><br>
      Thank you for submitting your WIBG 2026 application for <strong>${businessName}</strong>. While reviewing your application, our team noticed that your pitch video does not appear to tag or mention <strong>@SME Mall</strong> / <strong>@WIBG 2026</strong>.
    </p>
    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:10px;padding:20px 24px;margin:20px 0;">
      <p style="margin:0 0 10px;color:#9a3412;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">What you need to do</p>
      <ul style="color:#374151;font-size:14px;line-height:1.9;margin:0;padding-left:20px;">
        <li>Re-upload or update your 2-minute pitch video</li>
        <li>Ensure the video title or description tags <strong>SME Mall</strong> or <strong>#WIBG2026</strong></li>
        <li>Reply to this email with your updated video link</li>
      </ul>
    </div>
    <p style="color:#374151;font-size:14px;line-height:1.7;margin:0;">
      <strong>Important:</strong> Your application will remain in <em>Submitted</em> status until this is verified. Please action this as soon as possible — applications close <strong>June 24, 2026</strong>.
    </p>
    <div style="text-align:center;">
      ${btn("View Your Application", "https://thesmemall.com/dashboard/wibg")}
    </div>
  `);

  await send(
    { email: founderEmail, name: founderName },
    "Action Required: Tag SME Mall in Your Pitch Video — WIBG 2026",
    html,
  );
}

export async function sendApplicationReceivedEmail(
  founderEmail: string,
  founderName: string,
  businessName: string,
  receiptId: string,
) {
  const firstName = founderName.split(" ")[0];
  const html = base(`
    <div style="text-align:center;margin-bottom:8px;">
      ${badge("Application Received", "#f0fdf4", "#15803d")}
    </div>
    <h1 style="color:#0a1628;font-size:22px;font-weight:800;margin:0 0 16px;text-align:center;">We've got your application!</h1>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Hi <strong>${firstName}</strong>,<br><br>
      Your WIBG 2026 application for <strong>${businessName}</strong> has been received successfully. Our team will begin reviewing applications and you'll hear from us soon.
    </p>
    <div style="background:#f9fafb;border:1px solid #f0f0f0;border-radius:10px;padding:20px 24px;margin:20px 0;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;">Application Reference</p>
      <p style="margin:0;color:#0a1628;font-size:16px;font-weight:800;font-family:monospace;">#${receiptId.slice(-10).toUpperCase()}</p>
    </div>
    <p style="color:#374151;font-size:14px;line-height:1.7;margin:0 0 4px;"><strong>What happens next:</strong></p>
    <ul style="color:#374151;font-size:14px;line-height:1.9;margin:8px 0 0;padding-left:20px;">
      <li>Attend at least 2 of 3 June webinar weekends (both Saturday and Sunday)</li>
      <li>Our panel will review all applications after June 24</li>
      <li>Top 20 shortlist announced on July 1, 2026</li>
      <li>Top 6 Finalists pitch live at the Grand Finale — July 4, Lagos</li>
    </ul>
    <div style="text-align:center;">
      ${btn("View Your Dashboard", "https://thesmemall.com/dashboard/wibg")}
    </div>
  `);

  await send(
    { email: founderEmail, name: founderName },
    "✅ WIBG 2026 Application Received — " + businessName,
    html,
  );
}
