/** @type {import('next').NextConfig} */
const nextConfig = {
  // ビルド時のESLintチェックを完全に無視
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ビルド時のTypeScriptエラーを完全に無視
  typescript: {
    ignoreBuildErrors: true,
  },
  // output: 'standalone', // 削除してデフォルトモードを使用
  // セキュリティヘッダー設定
  async headers() {
    return [
      {
        // すべてのルートに適用
        source: '/(.*)',
        headers: [
          // Content Security Policy は middleware 側で nonce を付与して動的に適用
          // HTTP Strict Transport Security (HTTPS環境で有効化)
          ...(process.env.NODE_ENV === 'production' ||
          process.env.HTTPS === 'true'
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=63072000; includeSubDomains; preload',
                },
              ]
            : []),
          // X-Frame-Options (CSP frame-ancestorsと併用)
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          // X-Content-Type-Options
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Referrer Policy
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Permissions Policy
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // X-DNS-Prefetch-Control
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'off',
          },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Server Actionsのボディサイズ制限を5MBに設定
      // 悪性オリジンからのserver actions呼び出しを抑止（非破壊: 本番での適用想定）
      allowedOrigins:
        process.env.NODE_ENV === 'production'
          ? ['https://mokin-recruit-client.vercel.app']
          : undefined,
    },
    optimizePackageImports: [
      '@supabase/supabase-js',
      'lucide-react',
      '@heroicons/react',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@tiptap/react',
    ],
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
  },
  distDir: '.next',
  // SWCミニファイヤーの明示（デフォルトtrueだが明示化）
  swcMinify: true,
  compiler: {
    // SWC compiler options for JSX
    styledComponents: false,
    reactRemoveProperties: false,
    // 本番ではconsole.*を除去（warn/errorは維持）し、バンドルサイズ削減
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },
  // import { Icon } from 'lucide-react' → 個別アイコンに自動変換し解析負荷を低減
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  // 本番のブラウザ向けソースマップを無効化してビルド時間と配信サイズを軽減
  productionBrowserSourceMaps: false,
  // 開発時のパフォーマンス最適化
  onDemandEntries: {
    // ページが60秒間アクセスされない場合、メモリから削除
    maxInactiveAge: 60 * 1000,
    // 同時に保持するページ数
    pagesBufferLength: 5,
  },
  // Code splitting は Next.js のデフォルト挙動を使用
  webpack: config => {
    return config;
  },
  images: {
    // remotePatterns のみを使用（必要なホストのみに最小化）
    remotePatterns: [
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
      },
    ],
    // 画像最適化設定
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    // SVGファイルは通常のimgタグで扱い、Next.js Image最適化は無効にする
    dangerouslyAllowSVG: false,
  },
};

module.exports = nextConfig;
