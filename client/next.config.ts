import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // TypeScript configuration for build
  typescript: {
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },

  // ESLint configuration for build
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },

  // プロダクションビルドでconsole.logを削除
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'], // console.errorは残す
    } : false,
  },

  // サーバー外部パッケージ（Next.js 15の新しい設定）
  serverExternalPackages: ['bcryptjs'],

  // パフォーマンス実験的機能
  experimental: {
    optimizeCss: true,
    serverMinification: true,
  },

  // 画像最適化の強化（パフォーマンス重視）
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mjhqeagxibsklugikyma.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    domains: ['localhost', 'mjhqeagxibsklugikyma.supabase.co'],
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 31536000,
    // ローダー最適化
    loader: 'default',
  },

  // Enhanced webpack config with memory optimization
  webpack: (config, { isServer, dev }) => {
    // SVG最適化のみ維持
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Memory optimization for production builds
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        minimize: true,
        sideEffects: false,
        usedExports: true,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return module.size() > 160000 &&
                  /node_modules[\\/]/.test(module.identifier());
              },
              name(module) {
                const hash = require('crypto')
                  .createHash('sha1')
                  .update(module.identifier())
                  .digest('hex');
                return `lib-${hash.substring(0, 8)}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module, chunks) {
                return `shared-${require('crypto')
                  .createHash('sha1')
                  .update(chunks.map(c => c.name).join('_'))
                  .digest('hex')
                  .substring(0, 8)}`;
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
        },
      };
    }

    // Node polyfills prevention
    config.resolve.alias = {
      ...config.resolve.alias,
      'bcryptjs': require.resolve('bcryptjs'),
    };

    return config;
  },

  // Environment variables validation
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    CUSTOM_PORT: '3000',
    NEXT_PUBLIC_API_URL: 'http://localhost:3000/api',
  },

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
      // フォールバック設定のみ使用（ビルド時の安定性のため）
      corsOrigin =
        process.env.CORS_ORIGIN || process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000';
    } catch (error) {
      // フォールバック
      corsOrigin = 'http://localhost:3000';
    }

    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-cache, no-store, must-revalidate',
            },
            { key: 'Pragma', value: 'no-cache' },
            { key: 'Expires', value: '0' },
          ],
        },
      ];
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
              '<https://fonts.googleapis.com>; rel=preconnect; crossorigin, <https://fonts.gstatic.com>; rel=preconnect; crossorigin',
          },
        ],
      },
    ];
  },

  // 出力設定
  // output: 'standalone',

  // パワードバイの非表示
  poweredByHeader: false,

  // 圧縮の有効化
  compress: true,

  // ページ拡張子の設定
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
