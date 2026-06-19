'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { hashPassword, verifyPassword, SESSION_COOKIE_NAME, SESSION_DURATION } from '@/lib/auth'

export async function signUp(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const companyName = formData.get('companyName') as string
    const services = formData.getAll('services') as string[] // Service slugs

    if (!email || !password || !companyName) {
        return { error: 'Please fill in all fields' }
    }

    const existingUser = await prisma.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: 'Email already exists' }
    }

    try {
        const hashedPassword = await hashPassword(password)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                companyName,
                role: 'CLIENT',
            },
        })

        // Add selected services
        if (services.length > 0) {
            const dbServices = await prisma.service.findMany({
                where: { slug: { in: services } },
            })

            const userServices = dbServices.map(service => ({
                userId: user.id,
                serviceId: service.id,
                notify: service.status === 'COMING_SOON',
            }))

            if (userServices.length > 0) {
                await prisma.userService.createMany({
                    data: userServices,
                })
            }
        }

        // Set session
        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE_NAME, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: SESSION_DURATION,
            path: '/',
        })

        // Send Welcome Email
        const { sendWelcomeEmail } = await import('@/lib/mail')
        await sendWelcomeEmail(email, companyName)

    } catch (error) {
        console.error('Sign up error:', error)
        return { error: 'Failed to create account' }
    }

    redirect('/dashboard')
}

export async function signIn(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const redirectTo = formData.get('redirectTo') as string

    if (!email || !password) {
        return { error: 'Please fill in all fields' }
    }

    let user;
    try {
        user = await prisma.user.findUnique({ where: { email } })
    } catch (dbError) {
        console.error('[Auth] Database error in signIn:', dbError)
        return { error: 'Une erreur de connexion à la base de données est survenue. Veuillez réessayer.' }
    }

    if (!user) {
        return { error: 'Invalid email or password' }
    }

    const isValid = await verifyPassword(password, user.password)
    if (!isValid) {
        return { error: 'Invalid email or password' }
    }

    // ── Step 2: Send 2FA code ─────────────────────────────────────────────
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    const twoFaEmail = `2fa_${email}`

    try {
        // Clean up any old codes for this user
        await prisma.passwordReset.deleteMany({ where: { email: twoFaEmail } })

        await prisma.passwordReset.create({
            data: { email: twoFaEmail, code, expiresAt },
        })

        const { send2FACodeEmail } = await import('@/lib/mail')
        await send2FACodeEmail(email, user.companyName, code)

        console.log(`[Auth] 2FA code sent to ${email}`)
    } catch (err) {
        console.error('[Auth] Failed to send 2FA code:', err)
        return { error: 'Failed to send verification code. Please try again.' }
    }

    return { requires2FA: true, email, redirectTo }
}

export async function verify2FA(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const code = formData.get('code') as string
    const redirectTo = formData.get('redirectTo') as string

    if (!email || !code || code.length !== 6) {
        return { error: 'Please enter the 6-digit code.' }
    }

    const twoFaEmail = `2fa_${email}`

    try {
        const record = await prisma.passwordReset.findFirst({
            where: {
                email: twoFaEmail,
                code,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        })

        if (!record) {
            return { error: 'Invalid or expired code. Please try again.' }
        }

        // Clean up used code
        await prisma.passwordReset.deleteMany({ where: { email: twoFaEmail } })

        // Fetch user and create session
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return { error: 'User not found.' }

        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE_NAME, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: SESSION_DURATION,
            path: '/',
        })

        if (user.role === 'ADMIN') {
            redirect('/admin')
        }

        if (redirectTo && redirectTo.startsWith('/')) {
            redirect(redirectTo)
        }

        redirect('/dashboard')

    } catch (err: any) {
        // redirect() throws — let it propagate
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
        console.error('[Auth] verify2FA error:', err)
        return { error: 'Verification failed. Please try again.' }
    }
}

export async function resend2FACode(email: string) {
    const twoFaEmail = `2fa_${email}`

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return { error: 'User not found.' }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    try {
        await prisma.passwordReset.deleteMany({ where: { email: twoFaEmail } })
        await prisma.passwordReset.create({
            data: { email: twoFaEmail, code, expiresAt },
        })

        const { send2FACodeEmail } = await import('@/lib/mail')
        await send2FACodeEmail(email, user.companyName, code)

        return { success: true }
    } catch (err) {
        console.error('[Auth] resend2FACode error:', err)
        return { error: 'Failed to resend code.' }
    }
}

export async function signOut() {
    const cookieStore = await cookies()
    cookieStore.delete(SESSION_COOKIE_NAME)
    redirect('/')
}

export async function getSession() {
    const cookieStore = await cookies()
    return cookieStore.get(SESSION_COOKIE_NAME)?.value
}

export async function getCurrentUser() {
    const session = await getSession()

    if (!session) return null

    try {
        const user = await prisma.user.findUnique({
            where: { id: session },
            include: {
                services: {
                    include: {
                        service: true
                    }
                }
            }
        })
        return user
    } catch (error) {
        console.error('[Auth] Error in getCurrentUser:', error)
        return null
    }
}

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get('email') as string

    if (!email) {
        return { error: 'Email is required' }
    }

    const user = await prisma.user.findUnique({
        where: { email },
    })

    // Secure response: always indicate success even if email doesn't exist
    if (!user) {
        return { success: true, message: 'If an account is associated with this email, you will receive a verification code.' }
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 mins

    // Debug: Log Prisma keys
    console.log('Available Prisma Models:', Object.keys(prisma).filter(k => !k.startsWith('_')))

    try {
        await prisma.passwordReset.create({
            data: {
                email,
                code,
                expiresAt,
            },
        })

        const { sendResetCodeEmail } = await import('@/lib/mail')
        await sendResetCodeEmail(email, code)

        return { success: true, message: 'Verification code sent to your email.', email }
    } catch (error) {
        console.error('Reset request error:', error)
        return { error: 'Failed to process request. Please try again later.' }
    }
}

export async function resetPassword(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const code = formData.get('code') as string
    const password = formData.get('password') as string

    if (!email || !code || !password) {
        return { error: 'All fields are required' }
    }

    try {
        const reset = await prisma.passwordReset.findFirst({
            where: {
                email,
                code,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        })

        if (!reset) {
            return { error: 'Invalid or expired verification code' }
        }

        const hashedPassword = await hashPassword(password)
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        })

        // Cleanup: remove all reset records for this email
        await prisma.passwordReset.deleteMany({
            where: { email },
        })

        return { success: true }
    } catch (error) {
        console.error('Reset password error:', error)
        return { error: 'Failed to reset password. Please try again.' }
    }
}

export async function updateProfile(_prev: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Non authentifié.' }

    const companyName = formData.get('companyName') as string
    if (!companyName || companyName.trim().length < 2) {
        return { error: 'Le nom de l\'entreprise doit contenir au moins 2 caractères.' }
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { companyName: companyName.trim() },
        })
        return { success: true, message: 'Profil mis à jour avec succès.' }
    } catch (error) {
        console.error('Update profile error:', error)
        return { error: 'Échec de la mise à jour du profil.' }
    }
}

export async function updatePassword(_prev: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Non authentifié.' }

    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!currentPassword || !newPassword || !confirmPassword) {
        return { error: 'Tous les champs sont requis.' }
    }
    if (newPassword.length < 6) {
        return { error: 'Le nouveau mot de passe doit contenir au moins 6 caractères.' }
    }
    if (newPassword !== confirmPassword) {
        return { error: 'Les mots de passe ne correspondent pas.' }
    }

    try {
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
        if (!dbUser) return { error: 'Utilisateur introuvable.' }

        const valid = await verifyPassword(currentPassword, dbUser.password)
        if (!valid) return { error: 'Mot de passe actuel incorrect.' }

        const hashed = await hashPassword(newPassword)
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed },
        })
        return { success: true, message: 'Mot de passe mis à jour avec succès.' }
    } catch (error) {
        console.error('Update password error:', error)
        return { error: 'Échec de la mise à jour du mot de passe.' }
    }
}

// ─── 2FA Recovery Helpers ─────────────────────────────────────────────────────

function generateCode(): string {
    // Format: XXXX-XXXX (8 hex chars, grouped)
    const part = () => Math.random().toString(16).slice(2, 6).toUpperCase()
    return `${part()}-${part()}`
}

/** Generate 8 fresh recovery codes and save them hashed to the DB. Returns plaintext codes for display. */
export async function generateRecoveryCodes() {
    const user = await getCurrentUser()
    if (!user) return { error: 'Non authentifié.' }

    const plainCodes = Array.from({ length: 8 }, generateCode)
    // Hash each code before storing (reuse bcrypt from auth lib)
    const { hashPassword: hashCode } = await import('@/lib/auth')
    const hashedCodes = await Promise.all(plainCodes.map(c => hashCode(c)))

    await prisma.user.update({
        where: { id: user.id },
        data: { recoveryCodes: JSON.stringify(hashedCodes) },
    })

    return { success: true, codes: plainCodes }
}

/** Save / update recovery email for this user. */
export async function saveRecoveryEmail(_prev: any, formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return { error: 'Non authentifié.' }

    const recoveryEmail = (formData.get('recoveryEmail') as string)?.trim().toLowerCase()

    if (!recoveryEmail) {
        return { error: 'Veuillez saisir une adresse email de secours.' }
    }
    // Basic format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoveryEmail)) {
        return { error: 'Adresse email invalide.' }
    }
    if (recoveryEmail === user.email.toLowerCase()) {
        return { error: 'L\'email de récupération doit être différent de votre email principal.' }
    }

    try {
        await prisma.user.update({
            where: { id: user.id },
            data: { recoveryEmail },
        })
        return { success: true, message: 'Email de secours enregistré avec succès.' }
    } catch (err) {
        console.error('saveRecoveryEmail error:', err)
        return { error: 'Erreur lors de l\'enregistrement.' }
    }
}

/** Called from login page: use a recovery code instead of the 2FA OTP. Each code is one-time use. */
export async function verifyWithRecoveryCode(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const inputCode = (formData.get('code') as string)?.trim().toUpperCase()
    const redirectTo = formData.get('redirectTo') as string

    if (!email || !inputCode) return { error: 'Code requis.' }

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return { error: 'Utilisateur introuvable.' }

        const storedHashes: string[] = JSON.parse(user.recoveryCodes || '[]')
        if (storedHashes.length === 0) return { error: 'Aucun code de récupération disponible.' }

        const { verifyPassword: verifyCode } = await import('@/lib/auth')
        let matchedIndex = -1
        for (let i = 0; i < storedHashes.length; i++) {
            if (await verifyCode(inputCode, storedHashes[i])) {
                matchedIndex = i
                break
            }
        }

        if (matchedIndex === -1) return { error: 'Code de récupération invalide.' }

        // Consume the code (remove it)
        const remaining = storedHashes.filter((_, i) => i !== matchedIndex)
        await prisma.user.update({
            where: { id: user.id },
            data: { recoveryCodes: JSON.stringify(remaining) },
        })

        // Create session
        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE_NAME, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: SESSION_DURATION,
            path: '/',
        })

        if (user.role === 'ADMIN') redirect('/admin')
        if (redirectTo?.startsWith('/')) redirect(redirectTo)
        redirect('/dashboard')

    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
        console.error('verifyWithRecoveryCode error:', err)
        return { error: 'Erreur de vérification.' }
    }
}

/** Send OTP to recovery email and let the user verify it. */
export async function sendRecoveryEmailCode(email: string) {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.recoveryEmail) {
        return { error: 'Aucun email de secours configuré.' }
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    const key = `2fa_recovery_${email}`

    try {
        await prisma.passwordReset.deleteMany({ where: { email: key } })
        await prisma.passwordReset.create({ data: { email: key, code, expiresAt } })

        const { send2FACodeEmail } = await import('@/lib/mail')
        // Send to the recovery email (masking destination in logs)
        await send2FACodeEmail(user.recoveryEmail, user.companyName, code)

        return { success: true, maskedEmail: maskEmail(user.recoveryEmail) }
    } catch (err) {
        console.error('sendRecoveryEmailCode error:', err)
        return { error: 'Impossible d\'envoyer le code de secours.' }
    }
}

export async function verifyWithRecoveryEmail(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const code = formData.get('code') as string
    const redirectTo = formData.get('redirectTo') as string

    if (!email || !code || code.length !== 6) return { error: 'Code requis (6 chiffres).' }

    const key = `2fa_recovery_${email}`
    try {
        const record = await prisma.passwordReset.findFirst({
            where: { email: key, code, expiresAt: { gt: new Date() } },
            orderBy: { createdAt: 'desc' },
        })
        if (!record) return { error: 'Code invalide ou expiré.' }

        await prisma.passwordReset.deleteMany({ where: { email: key } })

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return { error: 'Utilisateur introuvable.' }

        const cookieStore = await cookies()
        cookieStore.set(SESSION_COOKIE_NAME, user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: SESSION_DURATION,
            path: '/',
        })

        if (user.role === 'ADMIN') redirect('/admin')
        if (redirectTo?.startsWith('/')) redirect(redirectTo)
        redirect('/dashboard')

    } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) throw err
        console.error('verifyWithRecoveryEmail error:', err)
        return { error: 'Erreur de vérification.' }
    }
}

/** Get current user's 2FA recovery settings (for settings page). */
export async function getRecoverySettings() {
    const user = await getCurrentUser()
    if (!user) return null
    const codes: string[] = JSON.parse((user as any).recoveryCodes || '[]')
    return {
        recoveryEmail: (user as any).recoveryEmail as string | null,
        codesCount: codes.length,
    }
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function maskEmail(email: string): string {
    const [local, domain] = email.split('@')
    return `${local.slice(0, 2)}${'*'.repeat(Math.max(local.length - 2, 2))}@${domain}`
}
