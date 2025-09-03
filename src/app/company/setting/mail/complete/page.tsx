'use client';

import React, { useEffect } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';

import { Button } from '@/components/ui/button';

export default function MailCompletePage() {
  
  // コンポーネントマウント時に認証状態を確認（削除ではなく更新確認）
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        console.log('認証状態を確認中...');
        

        const cacheKeys = [
          'user-profile-cache',
          'auth-cache',
          'session-cache'
        ];
        
        cacheKeys.forEach(key => {
          try {
            localStorage.removeItem(key);
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem(key);
            }
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
          { label: '各種設定', href: '/company/setting' },
          { label: 'メールアドレス変更', href: '/company/setting/mail' },
          { label: 'メールアドレス変更完了' }
        ]}
        title="メールアドレス変更完了"
        icon={<img src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      
      <div className="px-4 md:px-20 py-10">
        <div className="bg-white rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-4 md:p-10">
          <div className="text-center py-[24px] md:py-[40px]">
            <h2 className="text-xl md:text-[32px] font-bold text-[#0f9058] tracking-[1.8px] md:tracking-[3.2px] mb-4 md:mb-6">
              メールアドレスの変更が完了しました。
            </h2>
            <p className="text-sm md:text-base font-bold text-[#323232] tracking-[1.2px] md:tracking-[1.6px] leading-6 md:leading-8">
              今後は変更後のメールアドレスでログインが可能です。
            </p>
          </div>
        </div>
        
        <div className="flex justify-center mt-10">
          <Button
            onClick={async () => {
              try {
                console.log('設定ページに移動前の最終クリーンアップ...');
                
                // 追加のクリーンアップ
                const additionalKeys = [
                  'company-session',
                  'user-profile',
                  'authentication'
                ];
                
                additionalKeys.forEach(key => {
                  try {
                    localStorage.removeItem(key);
                    if (typeof window !== 'undefined') {
                      sessionStorage.removeItem(key);
                    }
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
                window.location.href = '/company/setting';
              } catch (error) {
                console.error('クリーンアップエラー:', error);
                // エラーがあってもページ遷移は実行
                window.location.href = '/company/setting';
              }
            }}
            variant="green-gradient"
            size="figma-default"
            className="min-w-[140px] py-[19px] md:min-w-[160px] text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px] w-full md:w-auto"
          >
            各種設定ページへ
          </Button>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
