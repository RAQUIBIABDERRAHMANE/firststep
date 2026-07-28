import nodemailer from 'nodemailer';
import { getWelcomeEmailTemplate, getPaymentRequestTemplate, getPaymentApprovedTemplate, getPaymentDeclinedTemplate, getInvoiceEmailTemplate, getMonthlyReportEmailTemplate } from './email/templates';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true' || Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS,
    },
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
    }
});

export async function sendWelcomeEmail(email: string, companyName: string) {
    // Basic verification of environment setup
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.warn('[MAILER] WARNING: Email credentials missing in environment variables.');
        return { success: false, error: 'Configuration missing' };
    }

    try {
        const html = getWelcomeEmailTemplate(companyName);

        await transporter.sendMail({
            from: `"FirstStep" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to FirstStep - Your Authority System is Ready',
            html: html,
        });

        return { success: true };
    } catch (error) {
        console.error('[MAILER] Error sending email:', error);
        return { success: false, error };
    }
}

export async function sendHtmlEmail(to: string, subject: string, html: string, attachments?: nodemailer.SendMailOptions['attachments']) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.warn('[MAILER] WARNING: Email credentials missing in environment variables.');
        return { success: false, error: 'Configuration missing' };
    }

    try {
        await transporter.sendMail({
            from: `"FirstStep" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments,
        });
        return { success: true };
    } catch (error) {
        console.error('[MAILER] Error sending HTML email:', error);
        return { success: false, error };
    }
}

export async function sendResetCodeEmail(email: string, code: string) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('--------------------------------------------------');
        console.log(`[MAILER] PASSWORD RESET CODE: ${code}`);
        console.log(`[MAILER] TO: ${email}`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    try {
        const { getResetCodeTemplate } = await import('./email/templates');
        const html = getResetCodeTemplate(code);

        await transporter.sendMail({
            from: `"FirstStep" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your Password Verification Code',
            html: html,
        });

        return { success: true };
    } catch (error) {
        console.error('[MAILER] Error sending reset email:', error);
        return { success: false, error };
    }
}

export async function send2FACodeEmail(email: string, companyName: string, code: string) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('--------------------------------------------------');
        console.log(`[MAILER] 2FA CODE: ${code}`);
        console.log(`[MAILER] TO: ${email}`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    const digits = code.split('').map(d =>
        `<span style="display:inline-block;width:44px;height:52px;line-height:52px;text-align:center;font-size:28px;font-weight:800;color:#1e293b;background:#f1f5f9;border:2px solid #e2e8f0;border-radius:10px;margin:0 4px;font-family:monospace;">${d}</span>`
    ).join('')

    const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:32px 40px;text-align:center;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:10px;display:flex;align-items:center;justify-content:center;">
          <span style="font-size:18px;">🔐</span>
        </div>
        <span style="font-size:22px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">FirstStep</span>
      </div>
      <p style="color:rgba(255,255,255,0.85);margin:10px 0 0;font-size:14px;">Vérification en deux étapes</p>
    </div>

    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#1e293b;">Bonjour, ${companyName} 👋</h2>
      <p style="margin:0 0 28px;color:#64748b;font-size:15px;line-height:1.6;">
        Utilisez le code ci-dessous pour compléter votre connexion à FirstStep.
        Ce code est valable <strong>10 minutes</strong>.
      </p>

      <!-- OTP Code -->
      <div style="text-align:center;margin:0 0 32px;">
        <div style="margin-bottom:8px;">${digits}</div>
        <p style="margin:12px 0 0;color:#94a3b8;font-size:12px;">Expire dans 10 minutes</p>
      </div>

      <!-- Warning -->
      <div style="background:#fef9ec;border:1px solid #fde68a;border-radius:12px;padding:16px 20px;margin-bottom:28px;">
        <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5;">
          ⚠️ <strong>Ne partagez jamais ce code.</strong> L'équipe FirstStep ne vous demandera jamais votre code de vérification.
          Si vous n'avez pas tenté de vous connecter, ignorez cet email.
        </p>
      </div>

      <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
        FirstStep — Plateforme de digitalisation professionnelle
      </p>
    </div>
  </div>
</body>
</html>`

    try {
        await transporter.sendMail({
            from: `"FirstStep Security" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `🔐 ${code} — Votre code de connexion FirstStep`,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error('[MAILER] Error sending 2FA email:', error);
        return { success: false, error };
    }
}

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
    console.log('🔍 [MAILER DEBUG] sendPaymentRequestEmail called');
    console.log('   EMAIL_HOST:', process.env.EMAIL_HOST);
    console.log('   EMAIL_USER:', process.env.EMAIL_USER);
    console.log('   EMAIL_PASS exists:', !!process.env.EMAIL_PASS);

    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('⚠️  [MAILER] Email configuration missing:');
        console.log(`   EMAIL_USER: ${process.env.EMAIL_USER ? '✓' : '✗'}`);
        console.log(`   EMAIL_PASS: ${process.env.EMAIL_PASS ? '✓' : '✗'}`);
        console.log(`   EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✓' : '✗'}`);
        console.log('--------------------------------------------------');
        console.log(`[MAILER] PAYMENT REQUEST EMAIL`);
        console.log(`[MAILER] TO: ${email}`);
        console.log(`[MAILER] Service: ${serviceName} - ${amount} MAD`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    console.log('📧 [MAILER] Sending payment request email...');
    console.log(`   To: ${email}`);
    console.log(`   Service: ${serviceName}`);
    console.log(`   Amount: ${amount} MAD`);

    try {
        const html = getPaymentRequestTemplate(companyName, serviceName, amount, bankDetails);

        await transporter.sendMail({
            from: `"FirstStep" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Demande de Paiement - ${serviceName}`,
            html: html,
        });

        console.log('✅ [MAILER] Payment request email sent successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ [MAILER] Error sending payment request email:', error);
        return { success: false, error };
    }
}

export async function sendPaymentApprovedEmail(
    email: string,
    companyName: string,
    serviceName: string,
    amount: number,
    facturePdf?: Uint8Array,
    factureNumber?: string
) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('⚠️  [MAILER] Email configuration missing (Approved)');
        console.log('--------------------------------------------------');
        console.log(`[MAILER] PAYMENT APPROVED EMAIL`);
        console.log(`[MAILER] TO: ${email}`);
        console.log(`[MAILER] Service: ${serviceName} - ${amount} MAD`);
        console.log(`[MAILER] Facture attached: ${facturePdf ? 'Yes' : 'No'}`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    console.log('📧 [MAILER] Sending payment approved email...');
    console.log(`   To: ${email}`);
    if (facturePdf) console.log(`   With facture PDF: ${factureNumber}`);

    try {
        const html = getPaymentApprovedTemplate(companyName, serviceName, amount);

        const attachments: nodemailer.SendMailOptions['attachments'] = []
        if (facturePdf) {
            attachments.push({
                filename: `facture-${factureNumber || 'invoice'}.pdf`,
                content: Buffer.from(facturePdf),
                contentType: 'application/pdf',
            })
        }

        await transporter.sendMail({
            from: `"FirstStep" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `✓ Paiement Approuvé - ${serviceName}${factureNumber ? ` | Facture ${factureNumber}` : ''}`,
            html: html,
            attachments,
        });

        console.log('✅ [MAILER] Payment approved email sent successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ [MAILER] Error sending payment approved email:', error);
        return { success: false, error };
    }
}

export async function sendPaymentDeclinedEmail(
    email: string,
    companyName: string,
    serviceName: string,
    amount: number
) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('⚠️  [MAILER] Email configuration missing (Declined)');
        console.log('--------------------------------------------------');
        console.log(`[MAILER] PAYMENT DECLINED EMAIL`);
        console.log(`[MAILER] TO: ${email}`);
        console.log(`[MAILER] Service: ${serviceName} - ${amount} MAD`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    console.log('📧 [MAILER] Sending payment declined email...');
    console.log(`   To: ${email}`);

    try {
        const html = getPaymentDeclinedTemplate(companyName, serviceName, amount);

        await transporter.sendMail({
            from: `"FirstStep" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `Demande de Paiement - ${serviceName}`,
            html: html,
        });

        console.log('✅ [MAILER] Payment declined email sent successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ [MAILER] Error sending payment declined email:', error);
        return { success: false, error };
    }
}

export async function sendInvoiceEmail(
    invoice: {
        number: string
        issueDate: Date | string
        dueDate?: Date | string | null
        clientName: string
        clientEmail: string
        subtotal: number
        taxRate: number
        taxAmount: number
        total: number
        notes?: string | null
        items: { description: string; quantity: number; unitPrice: number; total: number }[]
    },
    settings: {
        companyName?: string | null
        companyAddress?: string | null
        companyPhone?: string | null
        companyEmail?: string | null
        currency?: string | null
        footerNote?: string | null
        bankDetails?: string | null
    } | null
) {
    const companyName = settings?.companyName ?? 'Votre prestataire';

    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('⚠️  [MAILER] Email configuration missing (Invoice)');
        console.log('--------------------------------------------------');
        console.log(`[MAILER] INVOICE EMAIL`);
        console.log(`[MAILER] TO: ${invoice.clientEmail}`);
        console.log(`[MAILER] Facture: ${invoice.number} - ${invoice.total} MAD`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    console.log('📧 [MAILER] Sending invoice email...');
    console.log(`   To: ${invoice.clientEmail} — Facture ${invoice.number}`);

    try {
        const html = getInvoiceEmailTemplate(invoice, settings);

        await transporter.sendMail({
            from: `"${companyName}" <${process.env.EMAIL_USER}>`,
            to: invoice.clientEmail,
            subject: `Facture ${invoice.number} - ${companyName}`,
            html,
        });

        console.log('✅ [MAILER] Invoice email sent successfully!');
        return { success: true };
    } catch (error) {
        console.error('❌ [MAILER] Error sending invoice email:', error);
        return { success: false, error };
    }
}

export async function sendMonthlyReportEmail(
    to: string,
    restaurantName: string,
    month: number,
    year: number,
    language: 'fr' | 'en',
    data: {
        totalRevenue: number
        totalOrders: number
        averageOrderValue: number
        paidOrders: number
        topDishes: { name: string; count: number; revenue: number }[]
    },
    pdfBytes: Uint8Array
) {
    const months_fr = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
    const months_en = ['January','February','March','April','May','June','July','August','September','October','November','December']
    const monthName = (language === 'fr' ? months_fr : months_en)[month - 1]
    const subject = language === 'fr'
        ? `📊 Rapport Mensuel — ${monthName} ${year} | ${restaurantName}`
        : `📊 Monthly Report — ${monthName} ${year} | ${restaurantName}`

    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('--------------------------------------------------');
        console.log(`[MAILER] MONTHLY REPORT EMAIL (no email config — logging only)`);
        console.log(`[MAILER] TO: ${to}`);
        console.log(`[MAILER] Restaurant: ${restaurantName} — ${monthName} ${year}`);
        console.log(`[MAILER] Stats: ${data.totalOrders} orders, ${data.totalRevenue.toFixed(0)} MAD`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    try {
        const html = getMonthlyReportEmailTemplate(restaurantName, month, year, language, data)
        const filename = `rapport-${year}-${String(month).padStart(2, '0')}-${restaurantName.toLowerCase().replace(/\s+/g, '-')}.pdf`

        await transporter.sendMail({
            from: `"FirstStep Analytics" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
            attachments: [
                {
                    filename,
                    content: Buffer.from(pdfBytes),
                    contentType: 'application/pdf',
                },
            ],
        })

        console.log(`✅ [MAILER] Monthly report sent to ${to} for ${restaurantName} — ${monthName} ${year}`)
        return { success: true }
    } catch (error) {
        console.error('❌ [MAILER] Error sending monthly report email:', error)
        return { success: false, error }
    }
}

export async function sendEmploymentApplicationReceivedEmail(email: string, candidateName: string) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('--------------------------------------------------');
        console.log(`[MAILER] CANDIDATURE RECEIVED EMAIL (no config)`);
        console.log(`[MAILER] TO: ${email} | Candidate: ${candidateName}`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    try {
        const { getEmploymentApplicationReceivedTemplate } = await import('./email/templates');
        const html = getEmploymentApplicationReceivedTemplate(candidateName);

        await transporter.sendMail({
            from: `"FirstStep Recruitment" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Confirmation de réception de votre candidature - FirstStep',
            html: html,
        });

        return { success: true };
    } catch (error) {
        console.error('[MAILER] Error sending recruitment received email:', error);
        return { success: false, error };
    }
}

export async function sendEmploymentApplicationAcceptedEmail(
    email: string,
    candidateName: string,
    pdfBuffer?: Buffer,
    pdfFilename: string = 'Developer_Employment_Agreement.pdf',
    pdfUrl?: string
) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('--------------------------------------------------');
        console.log(`[MAILER] CANDIDATURE ACCEPTED EMAIL (no config)`);
        console.log(`[MAILER] TO: ${email} | Candidate: ${candidateName}`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    try {
        const { getEmploymentApplicationAcceptedTemplate } = await import('./email/templates');
        const html = getEmploymentApplicationAcceptedTemplate(candidateName, pdfUrl);

        const attachments = pdfBuffer ? [{
            filename: pdfFilename,
            content: pdfBuffer,
            contentType: 'application/pdf'
        }] : [];

        await transporter.sendMail({
            from: `"FirstStep Founder" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Félicitations ! Votre candidature Software Developer chez FirstStep a été acceptée',
            html: html,
            attachments: attachments
        });

        return { success: true };
    } catch (error) {
        console.error('[MAILER] Error sending recruitment accepted email:', error);
        return { success: false, error };
    }
}

