'use client';

import { useEffect } from 'react';

export function FontLoader() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'fonts' in document) {
      // フォントの読み込み状態を監視
      const loadFonts = async () => {
        try {
          // Noto Sans JPフォントの読み込みを監視（重要なウェイトを優先）
          await Promise.all([
            document.fonts.load('400 16px var(--font-noto-sans-jp)'),
            document.fonts.load('500 16px var(--font-noto-sans-jp)'),
            document.fonts.load('600 16px var(--font-noto-sans-jp)'),
            document.fonts.load('700 16px var(--font-noto-sans-jp)'),
            document.fonts.load('800 16px var(--font-noto-sans-jp)')
          ]);
          
          // フォント読み込み完了後にクラスを追加
          document.documentElement.classList.add('font-loaded');
          document.documentElement.classList.remove('font-loading');
        } catch (error) {
          console.warn('Font loading failed, using fallback fonts:', error);
          // フォント読み込みが失敗してもフォールバックを使用
          document.documentElement.classList.add('font-loaded');
          document.documentElement.classList.remove('font-loading');
        }
      };

      // 初期状態はloading
      document.documentElement.classList.add('font-loading');
      
      // フォント読み込み開始
      loadFonts();

      // タイムアウト設定（3秒でフォールバック）
      const timeout = setTimeout(() => {
        if (!document.documentElement.classList.contains('font-loaded')) {
          console.warn('Font loading timeout, using fallback fonts');
          document.documentElement.classList.add('font-loaded');
          document.documentElement.classList.remove('font-loading');
        }
      }, 3000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, []);

  return null; // UIは何も表示しない
}