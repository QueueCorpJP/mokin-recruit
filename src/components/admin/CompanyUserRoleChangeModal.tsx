'use client';

import React from 'react';
import { X } from 'lucide-react';

interface CompanyUserRoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  currentRole: string;
  newRole: string;
}

export default function CompanyUserRoleChangeModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
  currentRole,
  newRole,
}: CompanyUserRoleChangeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div
        className="bg-white border border-[#BABABA] rounded-none"
        style={{
          width: '812px',
          borderRadius: '0px'
        }}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-[#BABABA]">
          <h2 className="text-2xl font-bold text-black">
            企業ユーザーの権限変更
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="px-10 py-20">
          <div className="text-center">
            <p className="text-base font-bold text-black leading-relaxed">
              {userName}さんの権限を<br />
              {newRole}に変更してよろしいですか？
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-center items-center px-10 py-6 border-t border-[#BABABA] gap-4">
          <button
            onClick={onClose}
            className="px-10 py-3.5 border border-black text-black text-base font-bold hover:bg-gray-50 transition-colors"
            style={{ borderRadius: '32px' }}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-10 py-3.5 bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors"
            style={{ borderRadius: '32px' }}
          >
            変更
          </button>
        </div>
      </div>
    </div>
  );
}
