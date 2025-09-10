'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/mo-dal';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';

interface CompanyPlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPlan: string) => void;
  currentPlan: string;
}

// 利用可能なプランオプション
const planOptions = [
  { value: 'プラン加入なし', label: 'プラン加入なし' },
  { value: 'スタンダード', label: 'スタンダード' },
  { value: 'ストラテジック', label: 'ストラテジック' }
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

  // 現在のプラン以外のオプションを作成
  const availableOptions = planOptions.filter(option => option.value !== currentPlan);

  return (
    <Modal
      title="プラン変更"
      isOpen={isOpen}
      onClose={handleClose}
      width="604px"
      height="393px"
      hideFooter={true}
    >
      <div className="flex flex-col items-center justify-center h-full w-full space-y-8">
        {/* 説明文 */}
        <div className="text-center">
          <p className="text-base font-bold text-[#323232]">
            変更するプランを選択してください。
          </p>
        </div>

        {/* プラン選択 */}
        <div className="w-[323px]">
          <SelectInput
            options={availableOptions}
            value={selectedPlan}
            placeholder="変更後のプランを選択してください。"
            onChange={setSelectedPlan}
            className="w-full"
            style={{ height: '50px' }}
          />
        </div>

        {/* ボタン群 */}
        <div className="flex gap-4 w-full max-w-[435px]">
          <Button
            variant="outline"
            size="figma-default"
            onClick={handleClose}
            className="flex-1 h-[51px] border-[#323232] text-[#323232] rounded-[35px] hover:bg-gray-50"
          >
            キャンセル
          </Button>
          <Button
            variant="green-gradient"
            size="figma-default"
            onClick={handleConfirm}
            className="flex-1 h-[51px]"
          >
            プランを変更する
          </Button>
        </div>
        </div>
     
    </Modal>
  );
}
