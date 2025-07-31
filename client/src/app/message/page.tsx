'use client';

import React from 'react';
import { MessageLayout } from '@/components/message';

//s
export default function MessagePage() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-x-hidden">
        <MessageLayout className="h-[calc(100vh-80px)] w-full" />
      </main>
      

    </div>
  );
}
