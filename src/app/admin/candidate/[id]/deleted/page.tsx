'use client';

import React from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { useRouter } from 'next/navigation';

export default function CandidateDeletedPage() {
  const router = useRouter();

  const handleGoToTop = () => {
    router.push('/admin');
  };

  const handleGoToCandidateList = () => {
    router.push('/admin/candidate');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-12">
      <div className="text-center">
        <h1 className="font-[16px] font-bold text-gray-800 mb-8">
          候補者の消去が完了しました。
        </h1>
        
        <div className="flex gap-4 justify-center">
          <AdminButton 
            text="管理画面トップ" 
            onClick={handleGoToTop} 
            variant="green-outline" 
          />
          <AdminButton 
            text="候補者一覧" 
            onClick={handleGoToCandidateList} 
            variant="green-gradient" 
          />
        </div>
      </div>
    </div>
  );
}