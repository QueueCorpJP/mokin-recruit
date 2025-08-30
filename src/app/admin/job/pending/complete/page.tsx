'use client';

import React from 'react';
import Link from 'next/link';
import { AdminButton } from '@/components/admin/ui/AdminButton';

export default function JobNewCompletePage() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
       

        <div className="bg-white rounded-lg p-12 text-center">
        
          
          <p className="text-gray-700 font-[16px] font-bold mb-16">
            求人の作成が完了しました。
          </p>
          
          <div className="flex justify-center gap-6">
            <Link href="/admin/job/new">
              <AdminButton
                text="求人一覧"
                variant="green-outline"
                size="figma-outline"
                className="px-12 py-4 rounded-[32px] min-w-[160px] border-[#0f9058] text-[#0f9058] bg-white hover:bg-[#0f9058]/10 text-base font-bold"
              />
            </Link>
            <Link href="/admin/job">
              <AdminButton
                text="管理画面トップ"
                variant="green-gradient"
                size="figma-default"
                className="px-12 py-4 rounded-[32px] bg-gradient-to-r from-[#198D76] to-[#1CA74F] text-white hover:from-[#12614E] hover:to-[#1A8946] text-base font-bold"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}