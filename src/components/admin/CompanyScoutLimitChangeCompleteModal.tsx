'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/mo-dal';

interface CompanyScoutLimitChangeCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  newLimit: number;
}

export default function CompanyScoutLimitChangeCompleteModal({
  isOpen,
  onClose,
  companyName,
  newLimit,
}: CompanyScoutLimitChangeCompleteModalProps) {
  const router = useRouter();

  const handleGoToCompanyDetail = () => {
    onClose();
  };

  const handleGoToAdminTop = () => {
    onClose();
    router.push('/admin');
  };

  return (
    <Modal
      title='スカウト上限数変更完了'
      isOpen={isOpen}
      onClose={onClose}
      width='700px'
      height='auto'
      overlayBgColor='rgba(0, 0, 0, 0.4)'
      hideFooter={true}
    >
      <div className='flex flex-col items-center gap-8'>
        {/* メインコンテンツ */}
        <div className='text-center'>
          <p className='text-base font-bold text-black mb-2'>{companyName}</p>
          <p className='text-base font-bold text-black mb-2'>
            スカウト上限数：{newLimit}件
          </p>
          <p className='text-base font-bold text-black'>
            スカウト上限数の変更が完了しました。
          </p>
        </div>

        {/* ボタン群 */}
        <div className='flex gap-4 w-full max-w-[600px] justify-center'>
          {/* 企業ページに戻るボタン */}
          <button
            onClick={handleGoToCompanyDetail}
            className='flex-1 min-w-[180px] h-[60px] px-8 py-4 bg-white border border-black rounded-full text-base font-bold text-black hover:bg-gray-50 transition-colors whitespace-nowrap'
          >
            企業ページに戻る
          </button>

          {/* 管理画面トップに戻るボタン */}
          <button
            onClick={handleGoToAdminTop}
            className='flex-1 min-w-[180px] h-[60px] px-8 py-4 bg-black text-white rounded-full text-base font-bold hover:bg-gray-800 transition-colors whitespace-nowrap'
          >
            管理画面トップに戻る
          </button>
        </div>
      </div>
    </Modal>
  );
}
