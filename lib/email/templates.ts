export const getWelcomeEmailTemplate = (companyName: string) => {
    const primaryColor = '#2563eb'; // Professional Blue
    const textColor = '#171717';
    const mutedColor = '#737373';
    const bgColor = '#ffffff';
    const borderColor = '#e5e5e5';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to FirstStep</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: ${bgColor}; 
                color: ${textColor}; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                padding: 40px; 
                border: 1px solid ${borderColor}; 
                border-radius: 8px;
            }
            .logo { 
                margin-bottom: 32px;
            }
            .logo img {
                height: 48px;
                width: auto;
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
                -moz-user-select: none;
                -ms-user-select: none;
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
                -moz-user-select: none;
                -ms-user-select: none;
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            h1 { 
                font-size: 28px; 
                font-weight: 700; 
                letter-spacing: -0.025em; 
                margin-bottom: 16px; 
                color: ${textColor};
            }
            p { 
                font-size: 16px; 
                line-height: 1.6; 
                margin-bottom: 24px; 
                color: ${mutedColor};
            }
            .cta-button { 
                display: inline-block; 
                background-color: ${primaryColor}; 
                color: #ffffff !important; 
                padding: 12px 24px; 
                border-radius: 6px; 
                text-decoration: none; 
                font-weight: 500; 
                font-size: 16px;
            }
            .footer { 
                margin-top: 40px; 
                padding-top: 24px; 
                border-top: 1px solid ${borderColor}; 
                font-size: 14px; 
                color: ${mutedColor};
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo"><img src="https://firststepco.com/og-image.png" alt="FirstStep Logo" /></div>
            <h1>Welcome, ${companyName}!</h1>
            <p>Your business profile has been successfully created. You now have access to the FirstStep platform, where you can manage your operations with clarity and control.</p>
            <p>Ready to get started? Access your dashboard to configure your services and monitor your system status.</p>
            <a href="https://firststepco.com/dashboard" class="cta-button">Go to Dashboard</a>
            <div class="footer">
                &copy; 2025 FirstStep. All rights reserved.<br>
                Empowering businesses with authoritative systems.
            </div>
        </div>
    </body>
    </html>
  `;
};

export const getResetCodeTemplate = (code: string) => {
    const primaryColor = '#2563eb'; // Professional Blue
    const textColor = '#171717';
    const mutedColor = '#737373';
    const bgColor = '#ffffff';
    const borderColor = '#e5e5e5';

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Code</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: ${bgColor}; 
                color: ${textColor}; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                padding: 40px; 
                border: 1px solid ${borderColor}; 
                border-radius: 8px;
            }
            .logo { 
                font-size: 24px; 
                font-weight: 800; 
                letter-spacing: -0.025em; 
                margin-bottom: 32px;
            }
            .logo img {
                height: 48px;
                width: auto;
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            .logo-f {
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: ${primaryColor};
                color: white;
                text-align: center;
                line-height: 32px;
                border-radius: 4px;
                margin-right: 8px;
            }
            h1 { 
                font-size: 24px; 
                font-weight: 700; 
                letter-spacing: -0.025em; 
                margin-bottom: 16px; 
            }
            p { 
                font-size: 16px; 
                line-height: 1.6; 
                margin-bottom: 24px; 
                color: ${mutedColor};
            }
            .code-box {
                background-color: #f8fafc;
                border: 1px solid ${borderColor};
                border-radius: 12px;
                padding: 24px;
                text-align: center;
                margin: 32px 0;
            }
            .code {
                font-size: 42px;
                font-weight: 800;
                letter-spacing: 0.25em;
                color: ${primaryColor};
                font-family: 'Courier New', Courier, monospace;
            }
            .expiry {
                font-size: 13px;
                color: #ef4444;
                margin-top: 8px;
            }
            .footer { 
                margin-top: 40px; 
                padding-top: 24px; 
                border-top: 1px solid ${borderColor}; 
                font-size: 14px; 
                color: ${mutedColor};
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo"><img src="https://firststepco.com/og-image.png" alt="FirstStep Logo" /></div>
            <h1>Reset your password</h1>
            <p>We received a request to reset the password for your FirstStep account. Use the verification code below to proceed:</p>
            
            <div class="code-box">
                <div class="code">${code}</div>
                <div class="expiry">This code expires in 15 minutes</div>
            </div>

            <p>If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            
            <div class="footer">
                &copy; 2025 FirstStep. All rights reserved.<br>
                Secure operations for modern businesses.
            </div>
        </div>
    </body>
    </html>
  `;
};

export const getPaymentRequestTemplate = (
    companyName: string,
    serviceName: string,
    amount: number,
    bankDetails: {
        accountName: string;
        accountNumber: string;
        rib: string;
        bankName: string;
    }
) => {
    const primaryColor = '#2563eb';
    const textColor = '#171717';
    const mutedColor = '#737373';
    const bgColor = '#ffffff';
    const borderColor = '#e5e5e5';

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demande de Paiement - FirstStep</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: ${bgColor}; 
                color: ${textColor}; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                padding: 40px; 
                border: 1px solid ${borderColor}; 
                border-radius: 8px;
            }
            .logo { 
                font-size: 24px; 
                font-weight: 800; 
                letter-spacing: -0.025em; 
                margin-bottom: 32px;
            }
            .logo img {
                height: 48px;
                width: auto;
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            .logo-f {
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: ${primaryColor};
                color: white;
                text-align: center;
                line-height: 32px;
                border-radius: 4px;
                margin-right: 8px;
            }
            h1 { 
                font-size: 28px; 
                font-weight: 700; 
                letter-spacing: -0.025em; 
                margin-bottom: 16px; 
            }
            p { 
                font-size: 16px; 
                line-height: 1.6; 
                margin-bottom: 24px; 
                color: ${mutedColor};
            }
            .service-box {
                background-color: #f8fafc;
                border: 1px solid ${borderColor};
                border-radius: 8px;
                padding: 20px;
                margin: 24px 0;
            }
            .service-name {
                font-size: 18px;
                font-weight: 600;
                color: ${textColor};
                margin-bottom: 8px;
            }
            .amount {
                font-size: 32px;
                font-weight: 800;
                color: ${primaryColor};
            }
            .bank-details {
                background-color: #f8fafc;
                border: 2px solid ${primaryColor};
                border-radius: 8px;
                padding: 24px;
                margin: 24px 0;
            }
            .bank-title {
                font-size: 18px;
                font-weight: 700;
                color: ${primaryColor};
                margin-bottom: 16px;
            }
            .bank-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid ${borderColor};
            }
            .bank-row:last-child {
                border-bottom: none;
            }
            .bank-label {
                font-weight: 600;
                color: ${textColor};
            }
            .bank-value {
                color: ${mutedColor};
                font-family: 'Courier New', monospace;
            }
            .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 16px;
                border-radius: 4px;
                margin: 24px 0;
            }
            .footer { 
                margin-top: 40px; 
                padding-top: 24px; 
                border-top: 1px solid ${borderColor}; 
                font-size: 14px; 
                color: ${mutedColor};
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo"><img src="https://firststepco.com/og-image.png" alt="FirstStep Logo" /></div>
            <h1>Demande de Paiement</h1>
            <p>Bonjour ${companyName},</p>
            <p>Votre demande de paiement pour le service suivant a été créée avec succès :</p>
            
            <div class="service-box">
                <div class="service-name">${serviceName}</div>
                <div class="amount">${amount} MAD</div>
            </div>

            <div class="bank-details">
                <div class="bank-title">📋 Coordonnées Bancaires</div>
                <div class="bank-row">
                    <span class="bank-label">Nom du titulaire</span>
                    <span class="bank-value">${bankDetails.accountName}</span>
                </div>
                <div class="bank-row">
                    <span class="bank-label">Numéro de compte</span>
                    <span class="bank-value">${bankDetails.accountNumber}</span>
                </div>
                <div class="bank-row">
                    <span class="bank-label">RIB</span>
                    <span class="bank-value">${bankDetails.rib}</span>
                </div>
                <div class="bank-row">
                    <span class="bank-label">Banque</span>
                    <span class="bank-value">${bankDetails.bankName}</span>
                </div>
            </div>

            <div class="warning">
                <strong>⚠️ Important :</strong> Après avoir effectué le virement, veuillez vous connecter à votre espace client et saisir la référence de votre transfert pour faciliter la validation de votre paiement.
            </div>

            <p>Une fois le paiement vérifié par notre équipe, votre service sera automatiquement activé.</p>
            
            <div class="footer">
                &copy; 2026 FirstStep. Tous droits réservés.<br>
                Des systèmes fiables pour votre entreprise.
            </div>
        </div>
    </body>
    </html>
  `;
};

export const getPaymentApprovedTemplate = (
    companyName: string,
    serviceName: string,
    amount: number
) => {
    const primaryColor = '#10b981'; // Green
    const textColor = '#171717';
    const mutedColor = '#737373';
    const bgColor = '#ffffff';
    const borderColor = '#e5e5e5';

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Paiement Approuvé - FirstStep</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: ${bgColor}; 
                color: ${textColor}; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                padding: 40px; 
                border: 1px solid ${borderColor}; 
                border-radius: 8px;
            }
            .logo { 
                font-size: 24px; 
                font-weight: 800; 
                letter-spacing: -0.025em; 
                margin-bottom: 32px;
            }
            .logo img {
                height: 48px;
                width: auto;
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            .logo-f {
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: #2563eb;
                color: white;
                text-align: center;
                line-height: 32px;
                border-radius: 4px;
                margin-right: 8px;
            }
            .success-badge {
                background-color: #d1fae5;
                color: ${primaryColor};
                font-weight: 700;
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                margin-bottom: 24px;
            }
            h1 { 
                font-size: 28px; 
                font-weight: 700; 
                letter-spacing: -0.025em; 
                margin-bottom: 16px; 
                color: ${primaryColor};
            }
            p { 
                font-size: 16px; 
                line-height: 1.6; 
                margin-bottom: 24px; 
                color: ${mutedColor};
            }
            .service-box {
                background-color: #f8fafc;
                border: 1px solid ${borderColor};
                border-radius: 8px;
                padding: 20px;
                margin: 24px 0;
            }
            .service-name {
                font-size: 18px;
                font-weight: 600;
                color: ${textColor};
                margin-bottom: 8px;
            }
            .amount {
                font-size: 24px;
                font-weight: 700;
                color: ${primaryColor};
            }
            .cta-button { 
                display: inline-block; 
                background-color: #2563eb; 
                color: #ffffff !important; 
                padding: 12px 24px; 
                border-radius: 6px; 
                text-decoration: none; 
                font-weight: 500; 
                font-size: 16px;
                margin: 24px 0;
            }
            .footer { 
                margin-top: 40px; 
                padding-top: 24px; 
                border-top: 1px solid ${borderColor}; 
                font-size: 14px; 
                color: ${mutedColor};
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo"><img src="https://firststepco.com/og-image.png" alt="FirstStep Logo" /></div>
            <div class="success-badge">✓ PAIEMENT APPROUVÉ</div>
            <h1>Félicitations !</h1>
            <p>Bonjour ${companyName},</p>
            <p>Nous avons le plaisir de vous confirmer que votre paiement a été validé avec succès. Votre service est maintenant actif !</p>
            
            <div class="service-box">
                <div class="service-name">${serviceName}</div>
                <div class="amount">${amount} MAD</div>
            </div>

            <p>Vous pouvez dès à présent accéder à votre service depuis votre tableau de bord.</p>

            <a href="https://firststepco.com/dashboard" class="cta-button">Accéder au Dashboard</a>

            <p>Merci de votre confiance. Notre équipe reste à votre disposition pour toute question.</p>
            
            <div class="footer">
                &copy; 2026 FirstStep. Tous droits réservés.<br>
                Des systèmes fiables pour votre entreprise.
            </div>
        </div>
    </body>
    </html>
  `;
};

export const getPaymentDeclinedTemplate = (
    companyName: string,
    serviceName: string,
    amount: number
) => {
    const primaryColor = '#ef4444'; // Red
    const textColor = '#171717';
    const mutedColor = '#737373';
    const bgColor = '#ffffff';
    const borderColor = '#e5e5e5';

    return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Paiement Refusé - FirstStep</title>
        <style>
            body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
                background-color: ${bgColor}; 
                color: ${textColor}; 
                margin: 0; 
                padding: 0; 
                -webkit-font-smoothing: antialiased;
            }
            .container { 
                max-width: 600px; 
                margin: 40px auto; 
                padding: 40px; 
                border: 1px solid ${borderColor}; 
                border-radius: 8px;
            }
            .logo { 
                font-size: 24px; 
                font-weight: 800; 
                letter-spacing: -0.025em; 
                margin-bottom: 32px;
            }
            .logo img {
                height: 48px;
                width: auto;
                pointer-events: none;
                user-select: none;
                -webkit-user-drag: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }
            .logo-f {
                display: inline-block;
                width: 32px;
                height: 32px;
                background-color: #2563eb;
                color: white;
                text-align: center;
                line-height: 32px;
                border-radius: 4px;
                margin-right: 8px;
            }
            .declined-badge {
                background-color: #fee2e2;
                color: ${primaryColor};
                font-weight: 700;
                padding: 8px 16px;
                border-radius: 20px;
                display: inline-block;
                margin-bottom: 24px;
            }
            h1 { 
                font-size: 28px; 
                font-weight: 700; 
                letter-spacing: -0.025em; 
                margin-bottom: 16px; 
                color: ${textColor};
            }
            p { 
                font-size: 16px; 
                line-height: 1.6; 
                margin-bottom: 24px; 
                color: ${mutedColor};
            }
            .service-box {
                background-color: #f8fafc;
                border: 1px solid ${borderColor};
                border-radius: 8px;
                padding: 20px;
                margin: 24px 0;
            }
            .service-name {
                font-size: 18px;
                font-weight: 600;
                color: ${textColor};
                margin-bottom: 8px;
            }
            .amount {
                font-size: 24px;
                font-weight: 700;
                color: ${mutedColor};
            }
            .contact-box {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 16px;
                border-radius: 4px;
                margin: 24px 0;
            }
            .footer { 
                margin-top: 40px; 
                padding-top: 24px; 
                border-top: 1px solid ${borderColor}; 
                font-size: 14px; 
                color: ${mutedColor};
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo"><img src="https://firststepco.com/og-image.png" alt="FirstStep Logo" /></div>
            <div class="declined-badge">✗ PAIEMENT REFUSÉ</div>
            <h1>Demande de Paiement Non Validée</h1>
            <p>Bonjour ${companyName},</p>
            <p>Nous vous informons que votre demande de paiement n'a pas pu être validée.</p>
            
            <div class="service-box">
                <div class="service-name">${serviceName}</div>
                <div class="amount">${amount} MAD</div>
            </div>

            <div class="contact-box">
                <strong>💡 Que faire maintenant ?</strong><br>
                Si vous pensez qu'il s'agit d'une erreur ou si vous avez des questions, n'hésitez pas à contacter notre équipe support. Nous serons ravis de vous aider à résoudre ce problème.
            </div>

            <p>Vous pouvez créer une nouvelle demande de paiement depuis votre espace client si vous souhaitez réessayer.</p>
            
            <div class="footer">
                &copy; 2026 FirstStep. Tous droits réservés.<br>
                Des systèmes fiables pour votre entreprise.
            </div>
        </div>
    </body>
    </html>
  `;
};

export const getInvoiceEmailTemplate = (invoice: {
    number: string
    issueDate: Date | string
    dueDate?: Date | string | null
    clientName: string
    subtotal: number
    taxRate: number
    taxAmount: number
    total: number
    notes?: string | null
    items: { description: string; quantity: number; unitPrice: number; total: number }[]
}, settings: {
    companyName?: string | null
    companyAddress?: string | null
    companyPhone?: string | null
    companyEmail?: string | null
    currency?: string | null
    footerNote?: string | null
    bankDetails?: string | null
} | null) => {
    const currency = settings?.currency ?? 'MAD'
    const companyName = settings?.companyName ?? 'Votre prestataire'

    const itemsHtml = invoice.items.map(item => `
        <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #333;">${item.description}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; text-align: center;">${item.quantity}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; color: #555; text-align: right;">${item.unitPrice.toFixed(0)} ${currency}</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #f0f0f0; font-size: 14px; font-weight: 600; color: #111; text-align: right;">${item.total.toFixed(0)} ${currency}</td>
        </tr>
    `).join('')

    const taxRow = invoice.taxRate > 0 ? `
        <tr>
            <td colspan="3" style="padding: 6px 12px; font-size: 13px; color: #666; text-align: right;">TVA (${invoice.taxRate}%)</td>
            <td style="padding: 6px 12px; font-size: 13px; color: #666; text-align: right;">${invoice.taxAmount.toFixed(0)} ${currency}</td>
        </tr>
    ` : ''

    const dueDateRow = invoice.dueDate ? `
        <div style="margin-top: 8px; font-size: 13px; color: #666;">
            Date d'échéance : <strong>${new Date(invoice.dueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
        </div>
    ` : ''

    const bankSection = settings?.bankDetails ? `
        <div style="margin-top: 24px; background: #f0f7ff; border-radius: 8px; padding: 16px;">
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.05em;">Coordonnées bancaires</p>
            <pre style="margin: 0; font-family: monospace; font-size: 13px; color: #333; white-space: pre-wrap;">${settings.bankDetails}</pre>
        </div>
    ` : ''

    const notesSection = invoice.notes ? `
        <div style="margin-top: 16px; padding: 12px 16px; background: #f9f9f9; border-radius: 8px; font-size: 13px; color: #555;">
            <strong>Notes :</strong> ${invoice.notes}
        </div>
    ` : ''

    const footerNote = settings?.footerNote ?? 'Merci de votre confiance.'

    return `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture ${invoice.number}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:620px;margin:32px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
        
        <!-- Header -->
        <div style="background:#111827;padding:32px 40px;text-align:center;">
            <img src="https://firststepco.com/og-image.png" alt="${companyName}" style="height:48px;width:auto;pointer-events:none;-webkit-user-drag:none;" />
        </div>

        <!-- Body -->
        <div style="padding:32px 40px;">
            <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;color:#111;">Facture ${invoice.number}</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#666;">
                Émise le ${new Date(invoice.issueDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                ${dueDateRow}
            </p>

            <p style="margin:0 0 24px;font-size:15px;color:#333;">
                Bonjour <strong>${invoice.clientName}</strong>,<br><br>
                Veuillez trouver ci-dessous votre facture de la part de <strong>${companyName}</strong>.
            </p>

            <!-- Items table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
                <thead>
                    <tr style="background:#f9fafb;">
                        <th style="padding:10px 12px;font-size:12px;font-weight:700;color:#666;text-transform:uppercase;text-align:left;letter-spacing:0.05em;">Description</th>
                        <th style="padding:10px 12px;font-size:12px;font-weight:700;color:#666;text-transform:uppercase;text-align:center;letter-spacing:0.05em;">Qté</th>
                        <th style="padding:10px 12px;font-size:12px;font-weight:700;color:#666;text-transform:uppercase;text-align:right;letter-spacing:0.05em;">Prix unit.</th>
                        <th style="padding:10px 12px;font-size:12px;font-weight:700;color:#666;text-transform:uppercase;text-align:right;letter-spacing:0.05em;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                    <tr style="background:#f9fafb;">
                        <td colspan="3" style="padding:10px 12px;font-size:13px;color:#666;text-align:right;">Sous-total</td>
                        <td style="padding:10px 12px;font-size:13px;color:#333;text-align:right;">${invoice.subtotal.toFixed(0)} ${currency}</td>
                    </tr>
                    ${taxRow}
                    <tr style="background:#111827;">
                        <td colspan="3" style="padding:12px 16px;font-size:15px;font-weight:700;color:#fff;text-align:right;">TOTAL</td>
                        <td style="padding:12px 16px;font-size:18px;font-weight:800;color:#fff;text-align:right;">${invoice.total.toFixed(0)} ${currency}</td>
                    </tr>
                </tbody>
            </table>

            ${bankSection}
            ${notesSection}

            <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e5e5e5;text-align:center;font-size:13px;color:#888;">
                ${footerNote}
            </div>
        </div>

        <!-- Footer -->
        <div style="background:#f9fafb;padding:20px 40px;text-align:center;font-size:12px;color:#aaa;border-top:1px solid #e5e5e5;">
            &copy; ${new Date().getFullYear()} ${companyName}. Tous droits réservés.
        </div>
    </div>
</body>
</html>`
}
