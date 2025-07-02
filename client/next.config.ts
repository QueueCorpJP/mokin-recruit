import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // ESLint configuration for build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  // TypeScript configuration for build
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },

  // Vercel deployment optimization
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Image optimization for Vercel
  images: {
    domains: ['localhost', '*.supabase.co', '*.vercel.app'],
    unoptimized: false,
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Output configuration for Vercel
  output: 'standalone',

  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Headers for security
  async headers() {
    // 動的CORS設定
    let corsOrigin = 'http://localhost:3000';

    try {
      // 新しいバリデーションシステムを使用
      const {
        getValidatedEnv,
        getDynamicUrls,
      } = require('./src/lib/server/config/env-validation');
      const env = getValidatedEnv();
      const urls = getDynamicUrls(env);
      corsOrigin = urls.corsOrigin;
    } catch (error) {
      // フォールバック
      corsOrigin =
        process.env.CORS_ORIGIN || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000';
    }

    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: corsOrigin,
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
