import { jwtVerify, type JWTPayload } from 'jose';
import { logger } from '@/lib/server/utils/logger';

export interface VerifiedToken {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}

/**
 * Verify a JWT with a given secret/public key (RS256/HS256 compatible).
 * This utility is introduced for future middleware hardening.
 * Currently unused to avoid behavior change.
 */
export async function verifyJwt(
  token: string,
  secretOrPublicKey: string
): Promise<VerifiedToken> {
  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(
      token,
      encoder.encode(secretOrPublicKey)
    );
    return { valid: true, payload };
  } catch (error) {
    logger.warn('JWT verification failed');
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'invalid token',
    };
  }
}
