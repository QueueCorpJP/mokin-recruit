/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  distDir: '.next',
  compiler: {
    // SWC compiler options for JSX
    styledComponents: false,
    reactRemoveProperties: false,
  },
  // serverExternalPackages is not supported in Next.js 14.2
  // パフォーマンス最適化
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@tanstack/react-query', '@supabase/supabase-js', '@tiptap/react'],
    swcPlugins: [],
  },
  // Code splitting最適化
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: -5,
            reuseExistingChunk: true,
            chunks: 'all',
          },
          // 重いライブラリを個別チャンク化
          tiptap: {
            test: /[\\/]node_modules[\\/]@tiptap[\\/]/,
            name: 'tiptap',
            chunks: 'async',
            priority: 10,
          },
          reactQuery: {
            test: /[\\/]node_modules[\\/]@tanstack[\\/]/,
            name: 'react-query',
            chunks: 'async',
            priority: 10,
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'async',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
  images: {
    // 複数の設定方法で確実に動作するように設定
    domains: [
      'mjhqeagxibsklugikyma.supabase.co',
      'localhost',
      'mokin-recruit-client.vercel.app'
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',   // すべてのホスト許可
      },
      {
        protocol: 'https',
        hostname: '**',   // すべてのホスト許可
      },
      {
        protocol: 'https',
        hostname: 'mjhqeagxibsklugikyma.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        port: '',
        pathname: '/**',
      }
    ],
    // 画像最適化設定
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
};

module.exports = nextConfig;