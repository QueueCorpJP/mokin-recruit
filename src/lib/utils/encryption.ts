// Client-side encryption utilities for sensitive data
// Uses Web Crypto API for browser-based encryption

const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-for-development-only';

/**
 * Generate a key from a string using PBKDF2
 */
async function generateKey(
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypt data using AES-GCM
 */
export async function encryptData(data: string): Promise<string> {
  if (typeof window === 'undefined') {
    // Server-side: return data as-is or use a different encryption method
    return data;
  }

  try {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const key = await generateKey(ENCRYPTION_KEY, salt);
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encoder.encode(data)
    );

    // Combine salt, iv, and encrypted data
    const combined = new Uint8Array(
      salt.length + iv.length + encryptedData.byteLength
    );
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption failed:', error);
    return data; // Fallback: return unencrypted data
  }
}

/**
 * Decrypt data using AES-GCM
 */
export async function decryptData(encryptedData: string): Promise<string> {
  if (typeof window === 'undefined') {
    // Server-side: return data as-is or use a different decryption method
    return encryptedData;
  }

  try {
    // Convert from base64
    const combined = new Uint8Array(
      atob(encryptedData)
        .split('')
        .map(char => char.charCodeAt(0))
    );

    // Extract salt, iv, and encrypted data
    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const encrypted = combined.slice(28);

    const key = await generateKey(ENCRYPTION_KEY, salt);
    const decryptedData = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('Decryption failed:', error);
    return encryptedData; // Fallback: return encrypted data as-is
  }
}

/**
 * Encrypt a string (alias for encryptData)
 */
export const encryptString = encryptData;

/**
 * Decrypt a string (alias for decryptData)
 */
export const decryptString = decryptData;

// Export the encryption key constant for compatibility
export { ENCRYPTION_KEY };
