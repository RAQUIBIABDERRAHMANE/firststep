import nodemailer from 'nodemailer';
import { getWelcomeEmailTemplate, getPaymentRequestTemplate, getPaymentApprovedTemplate, getPaymentDeclinedTemplate } from './email/templates';

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
            from: `"FirstStep SaaS" <${process.env.EMAIL_USER}>`,
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

export async function sendHtmlEmail(to: string, subject: string, html: string) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.warn('[MAILER] WARNING: Email credentials missing in environment variables.');
        return { success: false, error: 'Configuration missing' };
    }

    try {
        await transporter.sendMail({
            from: `"FirstStep SaaS" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
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
            from: `"FirstStep SaaS" <${process.env.EMAIL_USER}>`,
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
            from: `"FirstStep SaaS" <${process.env.EMAIL_USER}>`,
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
    amount: number
) {
    if (!process.env.EMAIL_USER || (!process.env.EMAIL_PASSWORD && !process.env.EMAIL_PASS)) {
        console.log('⚠️  [MAILER] Email configuration missing (Approved)');
        console.log('--------------------------------------------------');
        console.log(`[MAILER] PAYMENT APPROVED EMAIL`);
        console.log(`[MAILER] TO: ${email}`);
        console.log(`[MAILER] Service: ${serviceName} - ${amount} MAD`);
        console.log('--------------------------------------------------');
        return { success: true, logged: true };
    }

    console.log('📧 [MAILER] Sending payment approved email...');
    console.log(`   To: ${email}`);

    try {
        const html = getPaymentApprovedTemplate(companyName, serviceName, amount);

        await transporter.sendMail({
            from: `"FirstStep SaaS" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `✓ Paiement Approuvé - ${serviceName}`,
            html: html,
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
            from: `"FirstStep SaaS" <${process.env.EMAIL_USER}>`,
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
