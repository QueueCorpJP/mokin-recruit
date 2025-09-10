'use client';

import React, { useState } from 'react';
import { FigmaModal } from './figma-modal';
import { Button } from './button';

/**
 * FigmaModalの使用例を示すコンポーネント
 */
export const FigmaModalExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (formData: { category: string; subcategory: string; details: string }) => {
    console.log('フォームデータ:', formData);
    alert(`設定が完了しました！\n\nカテゴリー: ${formData.category}\nサブカテゴリー: ${formData.subcategory}\n詳細: ${formData.details || '未入力'}`);
  };

  return (
    <div className="p-8 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold text-[#323232] mb-4">
        Figmaモーダル デモ
      </h1>
      
      <Button
        variant="green-gradient"
        size="figma-default"
        onClick={handleOpenModal}
      >
        モーダルを開く
      </Button>

      <FigmaModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title="設定変更"
        description="カテゴリーとサブカテゴリーを選択してください。"
      />

      <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md">
        <h2 className="font-bold text-[#323232] mb-2">使用方法:</h2>
        <ol className="list-decimal list-inside text-sm text-[#323232] space-y-1">
          <li>「モーダルを開く」ボタンをクリック</li>
          <li>カテゴリーを選択</li>
          <li>サブカテゴリーを選択</li>
          <li>詳細情報を入力（任意）</li>
          <li>「確定」ボタンをクリック</li>
        </ol>
      </div>
    </div>
  );
};
