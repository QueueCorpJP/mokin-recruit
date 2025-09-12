import { jwtVerify, type JWTPayload } from 'jose';
import { edgeLogger } from './logger';

export interface VerifiedToken {
  valid: boolean;
  payload?: JWTPayload;
  error?: string;
}

// Edge-safe JWT verification using jose (symmetric key expected)
export async function verifyJwtEdge(
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
    edgeLogger.warn('JWT verification failed in Edge middleware');
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'invalid token',
    };
  }
}
