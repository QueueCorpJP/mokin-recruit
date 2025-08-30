import React from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';

interface PageProps {
  params: Promise<{ job_id: string }>;
}

export default async function JobEditConfirmPage({ params }: PageProps) {
  const { job_id: jobId } = await params;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-700 text-[16px] font-bold mb-16">
            求人の編集が完了しました。
          </p>
          
          <div className="flex justify-center gap-6">
            <AdminButton
              href={`/admin/job/${jobId}/edit`}
              text="管理者画面トップ"
              variant="green-outline"
              size="figma-outline"
            />
            <AdminButton
              href="/admin/job"
              text="求人一覧へ"
              variant="green-gradient"
              size="figma-default"
            />
          </div>
        </div>
      </div>
    </div>
  );
}