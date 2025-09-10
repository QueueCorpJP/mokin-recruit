'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CompanyGroupNameChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newGroupName: string) => void;
  currentGroupName: string;
}

export default function CompanyGroupNameChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentGroupName,
}: CompanyGroupNameChangeModalProps) {
  const [groupName, setGroupName] = useState(currentGroupName);

  const handleConfirm = () => {
    if (!groupName.trim()) {
      alert('グループ名を入力してください');
      return;
    }

    if (groupName.trim() === currentGroupName) {
      alert('グループ名が変更されていません');
      return;
    }

    onConfirm(groupName.trim());
    handleClose();
  };

  const handleClose = () => {
    setGroupName(currentGroupName);
    onClose();
  };

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
            グループ名変更
          </h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="w-6 h-6 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </Button>
        </div>

        {/* メインコンテンツ */}
        <div className="px-10 py-20">
          <div className="flex items-center gap-3 mb-3">
            <label className="text-base font-bold text-black w-32">
              グループ名
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="グループ名を入力"
              className="flex-1 px-3.5 py-3 bg-white border border-black text-base font-bold placeholder:text-[#BABABA] outline-none"
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
          </div>
          <div className="ml-32">
            <p className="text-base font-bold text-black">
              グループ名はユーザーにも公開されます。
            </p>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-center gap-4 px-10 py-6 border-t border-[#BABABA]">
          <Button
            onClick={handleClose}
            variant="outline"
            size="figma-default"
            className="px-10"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleConfirm}
            variant="green-gradient"
            size="figma-default"
            className="px-10"
          >
            保存
          </Button>
        </div>
      </div>
    </div>
  );
}
