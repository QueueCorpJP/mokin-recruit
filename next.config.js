/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Server Actionsのボディサイズ制限を5MBに設定
    },
    optimizePackageImports: ['@supabase/supabase-js'],
    swcPlugins: [],
    // 開発時の最適化
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // 開発時のコンパイル最適化
    esmExternals: 'loose',
    // SWCミニファイヤーを使用
    swcMinify: true,
  },
  distDir: '.next',
  compiler: {
    // SWC compiler options for JSX
    styledComponents: false,
    reactRemoveProperties: false,
  },
  // 開発時のパフォーマンス最適化
  onDemandEntries: {
    // ページが60秒間アクセスされない場合、メモリから削除
    maxInactiveAge: 60 * 1000,
    // 同時に保持するページ数
    pagesBufferLength: 5,
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
    // remotePatterns のみを使用（domains は廃止予定）
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
    // SVGファイルは通常のimgタグで扱い、Next.js Image最適化は無効にする
    dangerouslyAllowSVG: false,
  },
};

module.exports = nextConfig;