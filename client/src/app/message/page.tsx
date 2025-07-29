'use client';

import React from 'react';
import { MessageLayout } from '@/components/message';
import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';

export default function MessagePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* ヘッダー */}
      <Navigation 
        variant="default"
        isLoggedIn={true}
        userInfo={{
          userName: 'ユーザー名',
          companyName: '株式会社サンプル'
        }}
      />
      
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-x-hidden">
        <MessageLayout className="h-[calc(100vh-80px)] w-full" />
      </main>
      
      {/* フッター */}
      <Footer variant="default" />
    </div>
  );
}
