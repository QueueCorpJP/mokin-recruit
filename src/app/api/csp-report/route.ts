import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/server/utils/logger';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Reporting API (application/reports+json) or legacy (application/csp-report)
    const isReportsJson = contentType.includes('application/reports+json');
    const isLegacy =
      contentType.includes('application/csp-report') ||
      contentType.includes('application/json');

    const body = await request.json().catch(() => null);

    if (isReportsJson) {
      logger.warn('[CSP Report][reports+json]', { body });
    } else if (isLegacy) {
      logger.warn('[CSP Report][csp-report]', { body });
    } else {
      logger.warn('[CSP Report][unknown content-type]', { contentType, body });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error('[CSP Report] handler error', error);
    return new NextResponse(null, { status: 204 });
  }
}
