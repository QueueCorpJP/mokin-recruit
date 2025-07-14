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

  // Vercel deployment optimization
  experimental: {
    // パフォーマンス最適化
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
    ],
    // ページ遷移の最適化
    scrollRestoration: true,
    // esmExternals: true, // 一時的にコメントアウト
    // フォント最適化の設定（Next.js 15では未サポートのため削除）
  },

  // サーバー外部パッケージ（Next.js 15の新しい設定）
  serverExternalPackages: ['bcryptjs'],

  // Turbopack configuration (simplified for compatibility)
  // turbopack: {
  //   rules: {
  //     '*.svg': {
  //       loaders: ['@svgr/webpack'],
  //       as: '*.js',
  //     },
  //   },
  // },

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

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

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
  output: 'standalone',

  // パワードバイの非表示
  poweredByHeader: false,

  // 圧縮の有効化
  compress: true,

  // ページ拡張子の設定
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

export default nextConfig;
