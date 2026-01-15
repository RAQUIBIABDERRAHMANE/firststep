
/**
 * Browser-compatible version of signTableId using Web Crypto API
 * Used for client-side QR code generation
 */
export async function signTableIdBrowser(tableId: string): Promise<string> {
    const SECRET_BROWSER = 'firststep-restaurant-secret-key-2024';
    const encoder = new TextEncoder();
    const keyData = encoder.encode(SECRET_BROWSER);
    const messageData = encoder.encode(tableId);

    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const signatureArray = new Uint8Array(signatureBuffer);
    const signature = Array.from(signatureArray.slice(0, 5))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    // Base64url encode: tableId:signature
    const tokenStr = `${tableId}:${signature}`;
    return btoa(tokenStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Browser-compatible version of verifyTableToken using Web Crypto API
 * Used for client-side QR code verification
 */
export async function verifyTableTokenBrowser(token: string): Promise<string | null> {
    if (!token) return null;

    try {
        // Base64url decode
        const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
        const decoded = atob(base64);
        const [tableId, signature] = decoded.split(':');

        if (!tableId || !signature) return null;

        // Regenerate signature to verify
        const SECRET_BROWSER = 'firststep-restaurant-secret-key-2024';
        const encoder = new TextEncoder();
        const keyData = encoder.encode(SECRET_BROWSER);
        const messageData = encoder.encode(tableId);

        const cryptoKey = await window.crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signatureBuffer = await window.crypto.subtle.sign('HMAC', cryptoKey, messageData);
        const signatureArray = new Uint8Array(signatureBuffer);
        const expectedSignature = Array.from(signatureArray.slice(0, 5))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        if (signature === expectedSignature) {
            return tableId;
        }

        return null;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}
