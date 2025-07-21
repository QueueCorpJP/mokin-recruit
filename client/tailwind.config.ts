import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx,js,jsx,mdx}',
    './src/components/**/*.{ts,tsx,js,jsx}',
    './src/styles/**/*.{css,ts,tsx}',
    './src/lib/**/*.{ts,tsx,js,jsx}',
    // shadcn/uiや他の外部UIコンポーネント
    './node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}',
    // 必要に応じて追加
  ],
  darkMode: ['class', '.dark'],
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
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
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
    require('tw-animate-css'),
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