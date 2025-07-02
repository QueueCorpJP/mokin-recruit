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
    // パフォーマンス最適化
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
    ],
    // Turbopack最適化（コメントアウト - Next.js 15では未対応）
    // turbotrace: {
    //   logLevel: 'bug',
    // },
    // ページ遷移の最適化
    scrollRestoration: true,
    // 静的生成の最適化（Next.js 15では未対応のため無効化）
    // staticWorkerRequestDeduping: true,
  },

  // 画像最適化の強化
  images: {
    domains: ['localhost', '*.supabase.co', '*.vercel.app'],
    unoptimized: false,
    // 画像最適化の設定
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 画像品質の最適化（Next.js 15では別の方法で設定）
    // プリロード設定
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // 画像キャッシュの最適化
    minimumCacheTTL: 31536000, // 1年
  },

  // バンドル分析とコード分割
  webpack: (config, { dev, isServer }) => {
    // プロダクション環境でのバンドル最適化
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 5,
              reuseExistingChunk: true,
            },
            // UI コンポーネントの分離
            ui: {
              test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
              name: 'ui-components',
              chunks: 'all',
              priority: 8,
            },
            // 認証関連の分離
            auth: {
              test: /[\\/]src[\\/]components[\\/]auth[\\/]/,
              name: 'auth-components',
              chunks: 'all',
              priority: 7,
            },
          },
        },
      };
    }

    // SVG最適化
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
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

  // Headers for security and performance
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
      // 静的リソースのキャッシュ最適化
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      // フォントのプリロード
      {
        source: '/:path*',
        headers: [
          {
            key: 'Link',
            value:
              '</fonts/inter.woff2>; rel=preload; as=font; type=font/woff2; crossorigin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
