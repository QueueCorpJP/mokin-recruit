'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface CompanyGroupNameChangeCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  oldGroupName: string;
  newGroupName: string;
  companyId?: string;
}

export default function CompanyGroupNameChangeCompleteModal({
  isOpen,
  onClose,
  oldGroupName,
  newGroupName,
  companyId,
}: CompanyGroupNameChangeCompleteModalProps) {
  const router = useRouter();

  const handleGoToCompanyDetail = () => {
    onClose();
    // 完了モーダルを閉じた後に確実にページをリロードして最新データを取得
    setTimeout(() => {
      if (companyId) {
        // Next.jsのrouterを使ってリロード（クエリパラメータ付きでキャッシュ回避）
        router.push(`/admin/company/${companyId}?refresh=${Date.now()}`);
      } else {
        // companyIdがない場合は現在のページをリロード
        window.location.reload();
      }
    }, 150); // モーダルが完全に閉じるまで少し待つ
  };

  const handleGoToAdminTop = () => {
    onClose();
    router.push('/admin');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div
        className="bg-white border border-black rounded-2xl"
        style={{
          width: '700px',
          padding: '26px 40px',
          borderRadius: '16px'
        }}
      >
        {/* メインコンテンツ */}
        <div className="flex flex-col items-center gap-8">
          {/* タイトル */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black mb-4">
              グループ名変更完了
            </h2>
            <p className="text-base font-bold text-black mb-2">
              グループ名を変更しました
            </p>
            <p className="text-base font-bold text-black mb-2">
              {oldGroupName} → {newGroupName}
            </p>
            <p className="text-base font-bold text-black">
              グループ名の変更が完了しました。
            </p>
          </div>

          {/* ボタン群 */}
          <div className="flex gap-4 w-full max-w-[600px] justify-center">
            {/* 企業ページに戻るボタン */}
            <button
              onClick={handleGoToCompanyDetail}
              className="flex-1 min-w-[180px] h-[60px] px-8 py-4 bg-white border border-black rounded-full text-base font-bold text-black hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              企業ページに戻る
            </button>

            {/* 管理画面トップに戻るボタン */}
            <button
              onClick={handleGoToAdminTop}
              className="flex-1 min-w-[180px] h-[60px] px-8 py-4 bg-black text-white rounded-full text-base font-bold hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              管理画面トップに戻る
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
