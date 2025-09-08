'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { createTag } from '@/app/admin/media/actions';

export default function NewTagPage() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const router = useRouter();
  const [tagName, setTagName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdTagName, setCreatedTagName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!tagName.trim()) {
      setError('タグ名を入力してください');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await createTag(tagName.trim());
      setCreatedTagName(tagName.trim());
      setShowSuccessModal(true);
    } catch (err) {
      console.error('タグの作成に失敗:', err);
      setError(err instanceof Error ? err.message : 'タグの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/admin/media/tag');
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.push('/admin/media/tag');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">認証状態を確認中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessRestricted userType="admin" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">

        {/* タグ作成フォーム */}
        <div className="bg-white rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label 
                htmlFor="tagName"
                className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] mb-2"
              >
                タグ名
              </label>
              <input
                id="tagName"
                type="text"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                className="w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-bold tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058]"
                placeholder="タグ名を入力してください"
                disabled={loading}
              />
              {error && (
                <div className="mt-2 text-red-600 text-sm font-['Noto_Sans_JP']">
                  {error}
                </div>
              )}
            </div>

            {/* ボタン */}
            <div className="flex gap-4 justify-center">
              <AdminButton
                onClick={handleBack}
                text="戻る"
                variant="secondary"
                disabled={loading}
              />
              <AdminButton
                onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                text={loading ? '作成中...' : 'タグを作成'}
                variant="primary"
                disabled={loading || !tagName.trim()}
              />
            </div>
          </form>
        </div>
      </div>

      {/* 成功通知モーダル */}
      <AdminNotificationModal
        isOpen={showSuccessModal}
        onConfirm={handleSuccessModalClose}
        title="タグ作成完了"
        description={`タグ「${createdTagName}」の作成が完了しました。`}
        confirmText="タグ一覧に戻る"
      />
    </div>
  );
}