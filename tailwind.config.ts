import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,js,jsx,mdx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/lib/**/*.{ts,tsx,js,jsx}',
  ],
  safelist: [
    // 動的に生成されるクラス名を保護
    'bg-[#0F9058]',
    'bg-[#F9F9F9]',
    'text-[#323232]',
    'border-[#DCDCDC]',
    'bg-[linear-gradient(0deg,_#17856F_0%,_#229A4E_100%)]',
    // グリッド関連
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    // アニメーション
    'animate-pulse',
    'animate-spin',
  ],
  darkMode: 'class',
  theme: {
    // レスポンシブブレークポイントの明示的な設定
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        // Google Fontsのカスタムプロパティを利用
        inter: 'var(--font-inter), system-ui, sans-serif',
        'noto-sans-jp': 'var(--font-noto-sans-jp), sans-serif',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.625rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      colors: {
        // カスタムプロパティを参照する色
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        primary: 'var(--color-primary)',
        'primary-foreground': 'var(--color-primary-foreground)',
        secondary: 'var(--color-secondary)',
        'secondary-foreground': 'var(--color-secondary-foreground)',
        muted: 'var(--color-muted)',
        'muted-foreground': 'var(--color-muted-foreground)',
        accent: 'var(--color-accent)',
        'accent-foreground': 'var(--color-accent-foreground)',
        destructive: 'var(--color-destructive)',
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        ring: 'var(--color-ring)',
        card: 'var(--color-card)',
        'card-foreground': 'var(--color-card-foreground)',
        popover: 'var(--color-popover)',
        'popover-foreground': 'var(--color-popover-foreground)',
        // チャートやサイドバー等も必要に応じて追加
      },
      // 必要に応じてspacing, boxShadow, etc.も拡張
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    // shadcn/uiのプラグインや他の必要なプラグイン
  ],
  // v4.0のカスタムバリアント対応例（必要に応じて）
  // variants: {
  //   extend: {
  //     backgroundColor: ['hover-always'],
  //   },
  // },
};

export default config; 