'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function JobNewCompletePage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <nav className="mb-8 text-sm text-gray-600">
          <span>管理画面トップ</span>
          <span className="mx-2">&gt;</span>
          <span>求人一覧</span>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-900 font-medium">求人タイトルを入力</span>
        </nav>

        <div className="bg-white rounded-lg p-12 text-center shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            求人削除完了
          </h1>
          
          <p className="text-gray-700 mb-16 text-lg">
            求人の削除が完了しました。
          </p>
          
          <div className="flex justify-center gap-6">
            <Link href="/admin">
              <Button
                variant="green-outline"
                size="figma-outline"
                className="px-12 py-4 rounded-[32px] border-[#0f9058] text-[#0f9058] bg-white hover:bg-[#0f9058]/10 text-base font-medium"
              >
                管理画面トップ
              </Button>
            </Link>
            <Link href="/admin/job">
              <Button
                variant="green-gradient"
                size="figma-default"
                className="px-12 py-4 rounded-[32px] bg-black text-white hover:bg-gray-800 text-base font-medium"
              >
                求人一覧へ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}