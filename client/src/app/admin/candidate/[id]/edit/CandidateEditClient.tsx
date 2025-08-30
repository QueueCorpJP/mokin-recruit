'use client';

import React, { useState } from 'react';
import { CandidateDetailData } from '../page';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';

interface Props {
  candidate: CandidateDetailData;
}

export default function CandidateEditClient({ candidate }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          候補者情報編集
        </h1>
        <p className="text-gray-600">
          ユーザーID: {candidate.id}
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        <p>編集画面を構築中です...</p>
        
        <div className="mt-6">
          <AdminButton 
            onClick={() => router.back()}
            variant="outline"
          >
            戻る
          </AdminButton>
        </div>
      </div>
    </div>
  );
}