import crypto from 'crypto';

// Secret key for hashing table IDs (should be in .env)
const SECRET = process.env.URL_SECRET || 'firststep-restaurant-secret-key-2024';

/**
 * Signs a table ID for use in a URL (SERVER-SIDE ONLY)
 * This prevents users from manually changing ?table=1 to ?table=2
 */
export function signTableId(tableId: string): string {
    const hmac = crypto.createHmac('sha256', SECRET);
    hmac.update(tableId);
    const signature = hmac.digest('hex').substring(0, 10); // Short salt

    // Return base64 encoded string: tableId:signature
    return Buffer.from(`${tableId}:${signature}`).toString('base64url');
}

/**
 * Verifies and extracts a table ID from a token
 * Returns the tableId if valid, null otherwise
 */
export function verifyTableToken(token: string): string | null {
    try {
        const decoded = Buffer.from(token, 'base64url').toString();
        const [tableId, signature] = decoded.split(':');

        if (!tableId || !signature) return null;

        const hmac = crypto.createHmac('sha256', SECRET);
        hmac.update(tableId);
        const expectedSignature = hmac.digest('hex').substring(0, 10);

        if (signature === expectedSignature) {
            return tableId;
        }

        return null;
    } catch (error) {
        return null;
    }
}


