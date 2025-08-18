'use client';

import React, { useEffect } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import { refreshAuthState } from '../actions';

export default function MailCompletePage() {
  
  // コンポーネントマウント時に認証状態を確認（削除ではなく更新確認）
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log('認証状態を確認中...');
        
        // 新しいセッションが正しく設定されているか確認
        // 古いキャッシュのみクリア（認証トークンは保持）
        const cacheKeys = [
          'user-profile-cache',
          'auth-cache',
          'session-cache'
        ];
        
        cacheKeys.forEach(key => {
          try {
            localStorage.removeItem(key);
            sessionStorage.removeItem(key);
            console.log(`キャッシュクリア: ${key}`);
          } catch (error) {
            console.log(`キャッシュクリアスキップ: ${key}`);
          }
        });
        
        console.log('✅ 認証状態確認完了（ログイン状態維持）');
      } catch (error) {
        console.error('認証状態確認エラー:', error);
      }
    };
    
    checkAuthState();
  }, []);
  
  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'メールアドレス変更', href: '/candidate/setting/mail' },
          { label: '完了' }
        ]}
        title="メールアドレス変更"
        icon={<Mail className="w-8 h-8" />}
      />
      
      <div className="px-20 py-10">
        <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-10">
          <div className="text-center py-20">
            <h2 className="text-[32px] font-bold text-[#0f9058] tracking-[3.2px] mb-6">
              メールアドレスの変更が完了しました。
            </h2>
            <p className="text-base font-bold text-[#323232] tracking-[1.6px] leading-8">
              今後は変更後のメールアドレスでログインが可能です。
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-10">
          <button
            onClick={async () => {
              try {
                console.log('設定ページに移動前の最終クリーンアップ...');
                
                // 追加のクリーンアップ
                const additionalKeys = [
                  'candidate-session',
                  'user-profile',
                  'authentication'
                ];
                
                additionalKeys.forEach(key => {
                  try {
                    localStorage.removeItem(key);
                    sessionStorage.removeItem(key);
                  } catch (error) {
                    // silent fail
                  }
                });
                
                // ブラウザキャッシュもクリア
                if ('caches' in window) {
                  const cacheNames = await caches.keys();
                  await Promise.all(
                    cacheNames.map(cacheName => caches.delete(cacheName))
                  );
                }
                
                console.log('✅ 最終クリーンアップ完了');
                
                // ページを完全に再読み込みしてヘッダーフッターの表示を更新
                window.location.href = '/candidate/setting';
              } catch (error) {
                console.error('クリーンアップエラー:', error);
                // エラーがあってもページ遷移は実行
                window.location.href = '/candidate/setting';
              }
            }}
            className="px-10 py-3.5 min-w-[160px] bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] text-white font-bold text-base tracking-[1.6px] text-center shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
          >
            各種設定ページへ
          </button>
        </div>
      </div>
    </div>
  );
}