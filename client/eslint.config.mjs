import rootConfig from '../eslint.config.mjs';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

export default [
  ...rootConfig,
  ...compat.extends('next/core-web-vitals'),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        React: 'readonly',
      },
    },
    rules: {
      // Next.js specific rules
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',

      // React specific rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React 19 compatibility
      'no-undef': 'off', // React 19では自動的にReactがインポートされる
    },
  },
  {
    files: ['**/*.config.{js,mjs,ts}'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    // サーバーサイドロジック用のルール調整
    files: ['src/lib/server/**/*.ts', 'src/app/api/**/*.ts'],
    rules: {
      // 開発効率を考慮したルール緩和
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      'no-console': 'warn',
      'sort-imports': 'warn',

      // インターフェース定義での未使用パラメータを許可
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
