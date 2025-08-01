'use client';

import React from 'react';
import { MessageLayout } from '@/components/message';

//s
export default function MessagePage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* メインコンテンツ */}
      <main className="flex-1 overflow-hidden">
        <MessageLayout className="h-full w-full" />
      </main>
    </div>
  );
}
