import * as bcrypt from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}

export const SESSION_COOKIE_NAME = 'session_token'
export const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours
