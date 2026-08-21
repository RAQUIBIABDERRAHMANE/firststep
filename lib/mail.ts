import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import {
    getWelcomeEmailTemplate,
    getPaymentRequestTemplate,
    getPaymentApprovedTemplate,
    getPaymentDeclinedTemplate,
    getInvoiceEmailTemplate,
    getMonthlyReportEmailTemplate,
    getEmploymentApplicationReceivedTemplate,
    getEmploymentApplicationAcceptedTemplate
} from './email/templates';

// Domain-specific sender addresses
export const EMAIL_SENDERS = {
    HR: process.env.EMAIL_FROM_HR || 'hr@firststepco.com',
    NOREPLY: process.env.EMAIL_FROM_NOREPLY || 'no-reply@firststepco.com',
    ANALYTICS: process.env.EMAIL_FROM_ANALYTICS || 'analytics@firststepco.com',
    CONTACT: process.env.EMAIL_FROM_CONTACT || process.env.EMAIL_USER || 'contact@firststepco.com',
};

export function getResendClient(): Resend | null {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey && apiKey.trim().length > 0) {
        return new Resend(apiKey.trim());
    }
    return null;
}

export function getTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.hostinger.com',
        port: Number(process.env.EMAIL_PORT) || 465,
        secure: process.env.EMAIL_SECURE === 'true' || Number(process.env.EMAIL_PORT) === 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
        },
        tls: {
            rejectUnauthorized: false
        }
    });
}

export function getFromEmail(customName: string = 'FirstStep', category?: 'HR' | 'NOREPLY' | 'ANALYTICS' | 'CONTACT'): string {
    if (process.env.RESEND_FROM) {
        return process.env.RESEND_FROM;
    }
    if (process.env.EMAIL_FROM) {
        return process.env.EMAIL_FROM;
    }

    if (category === 'HR') {
        return `"${customName || 'FirstStep HR'}" <${EMAIL_SENDERS.HR}>`;
    }
    if (category === 'NOREPLY') {
        return `"${customName || 'FirstStep Security'}" <${EMAIL_SENDERS.NOREPLY}>`;
    }
    if (category === 'ANALYTICS') {
        return `"${customName || 'FirstStep Analytics'}" <${EMAIL_SENDERS.ANALYTICS}>`;
    }

    return `"${customName || 'FirstStep'}" <${EMAIL_SENDERS.CONTACT}>`;
}

interface SendMailParams {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    fromName?: string;
    category?: 'HR' | 'NOREPLY' | 'ANALYTICS' | 'CONTACT';
    from?: string;
    replyTo?: string;
    attachments?: Array<{
        filename: string;
        content: Buffer | Uint8Array | string;
        contentType?: string;
    }>;
    headers?: Record<string, string>;
}

export async function sendMailUnified({
    to,
    subject,
    html,
    text,
    fromName = 'FirstStep',
    category = 'CONTACT',
    from,
    replyTo,
    attachments,
    headers
}: SendMailParams): Promise<{ success: boolean; id?: string; error?: any; logged?: boolean }> {
    const resend = getResendClient();
    const toList = Array.isArray(to) ? to : [to];
    const fromAddress = from || getFromEmail(fromName, category);
    const replyToAddress = replyTo || EMAIL_SENDERS.CONTACT;

    // 1. Prioritize Resend API if API Key is configured
    if (resend) {
        try {
            console.log(`🚀 [MAILER - RESEND] [${fromAddress}] -> [${toList.join(', ')}] | Subject: ${subject}`);

            const resendAttachments = attachments?.map(att => ({
                filename: att.filename,
                content: Buffer.isBuffer(att.content) ? att.content : (typeof att.content === 'string' ? Buffer.from(att.content) : Buffer.from(att.content as any)),
                contentType: att.contentType,
            }));

            const { data, error } = await resend.emails.send({
                from: fromAddress,
                to: toList,
                subject,
                html,
                text,
                replyTo: replyToAddress,
                attachments: resendAttachments,
                headers,
            });

            if (error) {
                console.error('❌ [MAILER - RESEND] Resend API error:', error);
                return { success: false, error };
            }

            console.log(`✅ [MAILER - RESEND] Email sent successfully! ID: ${data?.id}`);
            return { success: true, id: data?.id };
        } catch (err: any) {
            console.error('❌ [MAILER - RESEND] Exception during send:', err);
            return { success: false, error: err };
        }
    }

    // 2. Fallback to Hostinger / Standard SMTP
    const hasSmtpConfig = !!(process.env.EMAIL_USER && (process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS));
    if (!hasSmtpConfig) {
        console.log('--------------------------------------------------');
        console.log(`[MAILER] SIMULATION (No RESEND_API_KEY or SMTP Config)`);
        console.log(`[MAILER] FROM: ${fromAddress} | TO: ${toList.join(', ')} | Subject: ${subject}`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    try {
        console.log(`🌐 [MAILER - SMTP] [${fromAddress}] -> [${toList.join(', ')}] | Subject: ${subject}`);

        const mailOptions: nodemailer.SendMailOptions = {
            from: fromAddress,
            to: toList,
            replyTo: replyToAddress,
            subject,
            html,
            text,
            attachments: attachments?.map(att => ({
                filename: att.filename,
                content: Buffer.isBuffer(att.content) ? att.content : (typeof att.content === 'string' ? att.content : Buffer.from(att.content as any)),
                contentType: att.contentType,
            })),
            headers,
        };

        const info = await getTransporter().sendMail(mailOptions);
        console.log(`✅ [MAILER - SMTP] Email sent successfully! ID: ${info.messageId}`);
        return { success: true, id: info.messageId };
    } catch (err: any) {
        console.error('❌ [MAILER - SMTP] SMTP send error:', err);
        return { success: false, error: err };
    }
}

// ----------------------------------------------------
// 1. GENERAL & ACCOUNT (contact@firststepco.com)
// ----------------------------------------------------
export async function sendWelcomeEmail(email: string, companyName: string) {
    const html = getWelcomeEmailTemplate(companyName);
    return sendMailUnified({
        to: email,
        category: 'CONTACT',
        fromName: 'FirstStep',
        subject: 'Welcome to FirstStep - Your Authority System is Ready',
        html,
        text: `Welcome to FirstStep, ${companyName}! Your system is ready.`,
    });
}

export async function sendHtmlEmail(
    to: string,
    subject: string,
    html: string,
    attachments?: Array<{ filename: string; content: Buffer | Uint8Array | string; contentType?: string }>
) {
    return sendMailUnified({
        to,
        category: 'CONTACT',
        fromName: 'FirstStep',
        subject,
        html,
        attachments,
    });
}

// ----------------------------------------------------
// 2. SECURITY & AUTH (no-reply@firststepco.com)
// ----------------------------------------------------
export async function sendResetCodeEmail(email: string, code: string) {
    const { getResetCodeTemplate } = await import('./email/templates');
    const html = getResetCodeTemplate(code);
    return sendMailUnified({
        to: email,
        category: 'NOREPLY',
        fromName: 'FirstStep Security',
        subject: 'FirstStep — Votre code de vérification',
        html,
        text: `Votre code de vérification FirstStep est : ${code} (valable 10 minutes).`,
    });
}

export async function send2FACodeEmail(email: string, companyName: string, code: string) {
    const digits = code.split('').map(d =>
        `<span style="display:inline-block;width:44px;height:52px;line-height:52px;text-align:center;font-size:28px;font-weight:800;color:#1e293b;background:#f1f5f9;border:2px solid #e2e8f0;border-radius:10px;margin:0 4px;font-family:monospace;">${d}</span>`
    ).join('');

    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:32px 40px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:18px;">🔐</span>
        </div>
        <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">FirstStep</span>
      </div>
      <p style="color:rgba(255,255,255,0.85);margin:10px 0 0;font-size:14px;">Vérification en deux étapes</p>
    </div>
    <div style="padding:40px;">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">Bonjour, ${companyName} 👋</h2>
      <p style="margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.6;">
        Utilisez le code ci-dessous pour compléter votre connexion à FirstStep.
        Ce code est valable <strong>10 minutes</strong>.
      </p>
      <div style="text-align:center;margin:0 0 32px;">
        <div style="margin-bottom:8px;">${digits}</div>
        <p style="margin:12px 0 0;color:#94a3b8;font-size:12px;">Expire dans 10 minutes</p>
      </div>
      <div style="background:#fef9ec;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
          ⚠️ <strong>Ne partagez jamais ce code.</strong> L'équipe FirstStep ne vous demandera jamais votre code de vérification.
        </p>
      </div>
      <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
        FirstStep — Plateforme de digitalisation professionnelle
      </p>
    </div>
  </div>
</body>
</html>`;

    return sendMailUnified({
        to: email,
        category: 'NOREPLY',
        fromName: 'FirstStep Security',
        subject: `🔐 ${code} — Votre code de connexion FirstStep`,
        text: `Bonjour ${companyName},\n\nVotre code de connexion FirstStep est : ${code}\nCe code est valable 10 minutes.\n\nNe partagez jamais ce code.`,
        html,
    });
}

// ----------------------------------------------------
// 3. BILLING & PAYMENTS (contact@firststepco.com)
// ----------------------------------------------------
export async function sendPaymentRequestEmail(
    email: string,
    companyName: string,
    serviceName: string,
    amount: number,
    bankDetails: {
        accountName: string;
        accountNumber: string;
        rib: string;
        bankName: string;
    }
) {
    const html = getPaymentRequestTemplate(companyName, serviceName, amount, bankDetails);
    return sendMailUnified({
        to: email,
        category: 'CONTACT',
        fromName: 'FirstStep Billing',
        subject: `Demande de Paiement - ${serviceName}`,
        html,
        text: `Bonjour ${companyName},\n\nDemande de paiement pour le service : ${serviceName} (${amount} MAD).\n\nFirstStep`,
    });
}

export async function sendPaymentApprovedEmail(
    email: string,
    companyName: string,
    serviceName: string,
    amount: number,
    facturePdf?: Uint8Array,
    factureNumber?: string
) {
    const html = getPaymentApprovedTemplate(companyName, serviceName, amount);
    const attachments = facturePdf ? [{
        filename: `facture-${factureNumber || 'invoice'}.pdf`,
        content: Buffer.from(facturePdf),
        contentType: 'application/pdf',
    }] : [];

    return sendMailUnified({
        to: email,
        category: 'CONTACT',
        fromName: 'FirstStep Billing',
        subject: `✓ Paiement Approuvé - ${serviceName}${factureNumber ? ` | Facture ${factureNumber}` : ''}`,
        html,
        text: `Bonjour ${companyName},\n\nVotre paiement pour ${serviceName} (${amount} MAD) a été approuvé.\n\nFacture ci-jointe.\n\nFirstStep`,
        attachments,
    });
}

export async function sendPaymentDeclinedEmail(
    email: string,
    companyName: string,
    serviceName: string,
    amount: number
) {
    const html = getPaymentDeclinedTemplate(companyName, serviceName, amount);
    return sendMailUnified({
        to: email,
        category: 'CONTACT',
        fromName: 'FirstStep Billing',
        subject: `Demande de Paiement - ${serviceName}`,
        html,
        text: `Bonjour ${companyName},\n\nVotre paiement pour ${serviceName} (${amount} MAD) a été refusé.\n\nFirstStep`,
    });
}

export async function sendInvoiceEmail(
    invoice: {
        number: string;
        issueDate: Date | string;
        dueDate?: Date | string | null;
        clientName: string;
        clientEmail: string;
        subtotal: number;
        taxRate: number;
        taxAmount: number;
        total: number;
        notes?: string | null;
        items: { description: string; quantity: number; unitPrice: number; total: number }[];
    },
    settings: {
        companyName?: string | null;
        companyAddress?: string | null;
        companyPhone?: string | null;
        companyEmail?: string | null;
        currency?: string | null;
        footerNote?: string | null;
        bankDetails?: string | null;
    } | null
) {
    const companyName = settings?.companyName ?? 'Votre prestataire';
    const html = getInvoiceEmailTemplate(invoice, settings);

    return sendMailUnified({
        to: invoice.clientEmail,
        category: 'CONTACT',
        fromName: companyName,
        subject: `Facture ${invoice.number} - ${companyName}`,
        html,
        text: `Facture ${invoice.number} pour ${invoice.clientName} - Total: ${invoice.total} MAD.`,
    });
}

// ----------------------------------------------------
// 4. REPORTS & ANALYTICS (analytics@firststepco.com)
// ----------------------------------------------------
export async function sendMonthlyReportEmail(
    to: string,
    restaurantName: string,
    month: number,
    year: number,
    language: 'fr' | 'en',
    data: {
        totalRevenue: number;
        totalOrders: number;
        averageOrderValue: number;
        paidOrders: number;
        topDishes: { name: string; count: number; revenue: number }[];
    },
    pdfBytes: Uint8Array
) {
    const months_fr = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    const months_en = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const monthName = (language === 'fr' ? months_fr : months_en)[month - 1];
    const subject = language === 'fr'
        ? `📊 Rapport Mensuel — ${monthName} ${year} | ${restaurantName}`
        : `📊 Monthly Report — ${monthName} ${year} | ${restaurantName}`;

    const html = getMonthlyReportEmailTemplate(restaurantName, month, year, language, data);
    const filename = `rapport-${year}-${String(month).padStart(2, '0')}-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.pdf`;

    return sendMailUnified({
        to,
        category: 'ANALYTICS',
        fromName: 'FirstStep Analytics',
        subject,
        html,
        text: `Rapport mensuel pour ${restaurantName} (${monthName} ${year}) - Total Commandes: ${data.totalOrders}, Total CA: ${data.totalRevenue} MAD.`,
        attachments: [{
            filename,
            content: Buffer.from(pdfBytes),
            contentType: 'application/pdf',
        }],
    });
}

// ----------------------------------------------------
// 5. RECRUITMENT & EMPLOYMENT (hr@firststepco.com)
// ----------------------------------------------------
export async function sendEmploymentApplicationReceivedEmail(
    email: string,
    candidateName: string,
    roleType: string = 'DEVELOPER'
) {
    const html = getEmploymentApplicationReceivedTemplate(candidateName, roleType);
    const isVideo = roleType === 'VIDEO_EDITOR';
    const roleSubject = isVideo ? 'Monteur Vidéo & Motion Designer' : 'Software Developer';

    const plainText = `Bonjour ${candidateName},

Nous avons bien reçu votre candidature pour le poste de ${roleSubject} chez FirstStep.

Notre équipe étudie actuellement votre profil ainsi que vos compétences. Nous reviendrons vers vous très prochainement par email avec les suites de votre demande.

Récapitulatif :
- Réception et évaluation de votre dossier (En cours)
- Notification et transmission de votre contrat d'engagement

Merci pour votre intérêt pour FirstStep !

Cordialement,
Équipe Recrutement FirstStep
https://firststepco.com`;

    return sendMailUnified({
        to: email,
        category: 'HR',
        fromName: 'FirstStep HR',
        subject: `FirstStep — Réception de votre dossier de candidature (${roleSubject})`,
        text: plainText,
        html,
        headers: {
            'X-Entity-Ref-ID': `application-received-${Date.now()}`,
        },
    });
}

export async function sendEmploymentApplicationAcceptedEmail(
    email: string,
    candidateName: string,
    pdfBuffer?: Buffer,
    pdfFilename: string = 'Employment_Agreement.pdf',
    pdfUrl?: string,
    roleType: string = 'DEVELOPER'
) {
    const html = getEmploymentApplicationAcceptedTemplate(candidateName, pdfUrl, roleType);
    const attachments = pdfBuffer ? [{
        filename: pdfFilename,
        content: pdfBuffer,
        contentType: 'application/pdf',
    }] : [];

    const isVideo = roleType === 'VIDEO_EDITOR';
    const roleSubject = isVideo ? 'Monteur Vidéo & Motion Designer' : 'Software Developer';
    const contractTitle = isVideo ? 'Video Editor Employment Agreement' : 'Developer Employment Agreement';

    const plainText = `Bonjour ${candidateName},

Nous avons le plaisir de vous informer que votre candidature pour le poste de ${roleSubject} chez FirstStep a été retenue.

Vous trouverez ci-joint votre ${contractTitle} dûment établi avec les termes convenus (Revenue Share).
${pdfUrl ? `Lien de consultation en ligne : ${pdfUrl}\n` : ''}
Notre équipe prendra contact avec vous rapidement pour lancer votre premier projet.

Bienvenue dans l'équipe FirstStep !

Abderrahmane Raquibi - Équipe RH FirstStep
https://firststepco.com`;

    return sendMailUnified({
        to: email,
        category: 'HR',
        fromName: 'FirstStep HR',
        subject: `FirstStep — Contrat d'engagement et validation de candidature (${roleSubject})`,
        text: plainText,
        html,
        attachments,
        headers: {
            'X-Entity-Ref-ID': `application-accepted-${Date.now()}`,
        },
    });
}

export async function sendAdminNewEmploymentAlert({
    adminEmails,
    candidateName,
    roleType,
    email,
    phone,
    cin,
    skills,
    revenueShare,
    showreelOrGithubUrl,
    portfolioUrl,
    cvUrl,
    photoUrl,
}: {
    adminEmails: string[];
    candidateName: string;
    roleType: string;
    email: string;
    phone: string;
    cin: string;
    skills: string[];
    revenueShare: number;
    showreelOrGithubUrl?: string | null;
    portfolioUrl?: string | null;
    cvUrl: string;
    photoUrl: string;
}) {
    const isVideo = roleType === 'VIDEO_EDITOR';
    const roleLabel = isVideo ? '🎬 Monteur Vidéo & Motion Designer' : '💻 Software Developer';
    const primaryLinkName = isVideo ? 'Showreel Vidéo' : 'Profil GitHub';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://firststepco.com';
    const adminPanelUrl = `${appUrl}/admin/employment`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0B1120; color: #E2E8F0; margin: 0; padding: 24px; }
            .card { max-width: 600px; margin: 0 auto; background: #0F172A; border: 1px solid #1E293B; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
            .header { background: linear-gradient(135deg, ${isVideo ? '#7C3AED, #DB2777' : '#0284C7, #2563EB'}); padding: 28px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0 0 6px 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
            .header p { color: rgba(255,255,255,0.9); margin: 0; font-size: 13px; font-weight: 600; }
            .content { padding: 28px; }
            .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; background: ${isVideo ? 'rgba(168, 85, 247, 0.2)' : 'rgba(14, 165, 233, 0.2)'}; color: ${isVideo ? '#C084FC' : '#38BDF8'}; border: 1px solid ${isVideo ? 'rgba(168, 85, 247, 0.4)' : 'rgba(14, 165, 233, 0.4)'}; margin-bottom: 16px; }
            .info-grid { background: #070D18; border: 1px solid #1E293B; border-radius: 16px; padding: 18px; margin: 16px 0; }
            .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1E293B; font-size: 13px; }
            .info-row:last-child { border-bottom: none; }
            .label { color: #94A3B8; font-weight: 600; }
            .value { color: #F8FAFC; font-weight: 700; }
            .skills-wrap { margin: 14px 0; }
            .skill-pill { display: inline-block; background: #1E293B; color: #E2E8F0; padding: 4px 10px; border-radius: 8px; font-size: 11px; margin: 3px; font-family: monospace; }
            .btn { display: block; text-align: center; background: ${isVideo ? 'linear-gradient(135deg, #9333EA, #E11D48)' : 'linear-gradient(135deg, #0284C7, #2563EB)'}; color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 14px; padding: 14px 24px; border-radius: 14px; margin-top: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
            .links-row { margin-top: 14px; text-align: center; font-size: 12px; }
            .links-row a { color: #38BDF8; text-decoration: none; margin: 0 8px; font-weight: 600; }
            .footer { text-align: center; padding: 18px; color: #64748B; font-size: 11px; border-top: 1px solid #1E293B; }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="header">
                <h1>Nouvelle Candidature Reçue</h1>
                <p>${roleLabel}</p>
            </div>
            <div class="content">
                <span class="badge">Nouveau Profil Candidat</span>
                <p style="font-size: 14px; color: #CBD5E1; margin: 0 0 16px 0;">
                    Un nouveau candidat vient de postuler au programme de partenariat <strong>FirstStep</strong>.
                </p>
                <div class="info-grid">
                    <div class="info-row">
                        <span class="label">Candidat :</span>
                        <span class="value">${candidateName}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Email :</span>
                        <span class="value"><a href="mailto:${email}" style="color:#38BDF8; text-decoration:none;">${email}</a></span>
                    </div>
                    <div class="info-row">
                        <span class="label">WhatsApp / Tél :</span>
                        <span class="value"><a href="tel:${phone}" style="color:#38BDF8; text-decoration:none;">${phone}</a></span>
                    </div>
                    <div class="info-row">
                        <span class="label">CIN :</span>
                        <span class="value">${cin}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Revenue Share Demandé :</span>
                        <span class="value" style="color:#10B981;">${revenueShare}% par projet</span>
                    </div>
                </div>
                ${skills && skills.length > 0 ? `
                <div class="skills-wrap">
                    <div style="font-size: 12px; font-weight: 700; color: #94A3B8; margin-bottom: 6px;">Compétences Déclarées :</div>
                    <div>
                        ${skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}
                    </div>
                </div>
                ` : ''}
                <div class="links-row">
                    ${showreelOrGithubUrl ? `<a href="${showreelOrGithubUrl}" target="_blank">🔗 ${primaryLinkName}</a>` : ''}
                    ${portfolioUrl ? `<a href="${portfolioUrl}" target="_blank">🌐 Portfolio / Behance</a>` : ''}
                    <a href="${cvUrl}" target="_blank">📄 Télécharger CV</a>
                    <a href="${photoUrl}" target="_blank">👤 Photo Identité</a>
                </div>
                <a href="${adminPanelUrl}" class="btn">
                    Accéder à la Console Admin & Examiner
                </a>
            </div>
            <div class="footer">
                Notification automatique FirstStep Administration System • ${new Date().toLocaleDateString('fr-FR')}
            </div>
        </div>
    </body>
    </html>`;

    const recipients = Array.from(new Set(adminEmails.filter(Boolean)));
    if (recipients.length === 0) {
        recipients.push(EMAIL_SENDERS.CONTACT);
    }

    const plainText = `Nouvelle Candidature Reçue (${roleLabel})
Candidat : ${candidateName}
Email : ${email}
Téléphone / WhatsApp : ${phone}
CIN : ${cin}
Revenue Share demandé : ${revenueShare}%

Compétences : ${skills ? skills.join(', ') : 'Non spécifié'}
${showreelOrGithubUrl ? `${primaryLinkName} : ${showreelOrGithubUrl}\n` : ''}${portfolioUrl ? `Portfolio : ${portfolioUrl}\n` : ''}CV : ${cvUrl}

Accéder à la console Admin : ${adminPanelUrl}`;

    return sendMailUnified({
        to: recipients,
        category: 'HR',
        fromName: 'FirstStep HR',
        replyTo: email || EMAIL_SENDERS.HR,
        subject: `FirstStep Admin — Nouvelle Candidature : ${candidateName} (${isVideo ? 'Monteur Vidéo' : 'Développeur'})`,
        text: plainText,
        html,
        headers: {
            'X-Entity-Ref-ID': `admin-alert-${Date.now()}`,
        },
    });
}
