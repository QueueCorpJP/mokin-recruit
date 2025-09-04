'use client';

import React, { useState } from 'react';

interface CompanyPlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPlan: string) => void;
  currentPlan: string;
}

// 利用可能なプランオプション
const planOptions = [
  { value: 'free', label: 'フリープラン' },
  { value: 'basic', label: 'ベーシックプラン' },
  { value: 'standard', label: 'スタンダードプラン' },
  { value: 'premium', label: 'プレミアムプラン' },
  { value: 'enterprise', label: 'エンタープライズプラン' }
];

export default function CompanyPlanChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
}: CompanyPlanChangeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('');

  const handleConfirm = () => {
    if (!selectedPlan) {
      alert('変更するプランを選択してください');
      return;
    }

    if (selectedPlan === currentPlan) {
      alert('同じプランが選択されています');
      return;
    }

    onConfirm(selectedPlan);
    handleClose();
  };

  const handleClose = () => {
    setSelectedPlan('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div className="bg-white border border-black rounded-2xl w-[604px] h-[393px] relative">
        {/* コンテンツ */}
        <div className="flex flex-col items-center justify-center h-full px-8">
          {/* タイトル */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">
              プラン変更
            </h2>
            <p className="text-base font-bold text-black mb-6">
              変更するプランを選択してください。
            </p>
          </div>

          {/* プラン選択ドロップダウン */}
          <div className="mb-16">
            <div className="relative">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-[323px] h-[50px] px-3.5 py-3 bg-white border border-black text-base font-bold text-black outline-none appearance-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <option value="">変更後のプランを選択してください。</option>
                {planOptions.map(option => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.value === currentPlan}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {/* ドロップダウン矢印 */}
              <div className="absolute right-3.5 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg width="20" height="14" viewBox="0 0 20 12" fill="none">
                  <path d="M1 1L10 10L19 1" stroke="black" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* ボタン群 */}
          <div className="flex gap-4 w-full max-w-[435px]">
            {/* キャンセルボタン */}
            <button
              onClick={handleClose}
              className="flex-1 h-[51px] bg-white border border-black rounded-[35px] text-base font-bold text-black hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>

            {/* プランを変更するボタン */}
            <button
              onClick={handleConfirm}
              className="flex-1 h-[51px] bg-black text-white rounded-[35px] text-base font-bold hover:bg-gray-800 transition-colors"
            >
              プランを変更する
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
