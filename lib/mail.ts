import nodemailer from 'nodemailer';
import { getWelcomeEmailTemplate } from './email/templates';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true' || Number(process.env.EMAIL_PORT) === 465,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
    }
});

export async function sendWelcomeEmail(email: string, companyName: string) {
    // Basic verification of environment setup
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
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

export async function sendResetCodeEmail(email: string, code: string) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
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
