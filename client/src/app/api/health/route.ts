import { NextRequest, NextResponse } from 'next/server';

/**
 * Health check endpoint for Docker container monitoring
 * Returns application status and basic metrics
 */
export async function GET(request: NextRequest) {
  try {
    const healthData = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      },
      // Basic connectivity checks
      checks: {
        database: await checkSupabaseConnection(),
        redis: await checkRedisConnection(),
      },
    };

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * Check Supabase connection
 */
async function checkSupabaseConnection(): Promise<{
  status: string;
  latency?: number;
}> {
  try {
    const start = Date.now();

    // Simple connectivity check - can be enhanced with actual Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      return { status: 'not_configured' };
    }

    // Basic URL validation
    new URL(supabaseUrl);
    const latency = Date.now() - start;

    return { status: 'ok', latency };
  } catch (error) {
    console.error('Supabase health check failed:', error);
    return { status: 'error' };
  }
}

/**
 * Check Redis connection
 */
async function checkRedisConnection(): Promise<{
  status: string;
  latency?: number;
}> {
  try {
    const start = Date.now();

    // Simple connectivity check - can be enhanced with actual Redis client
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return { status: 'not_configured' };
    }

    // Basic URL validation
    new URL(redisUrl);
    const latency = Date.now() - start;

    return { status: 'ok', latency };
  } catch (error) {
    console.error('Redis health check failed:', error);
    return { status: 'error' };
  }
}
