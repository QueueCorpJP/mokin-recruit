'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/mo-dal';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';

interface CompanyPlanChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newPlan: string) => Promise<void>;
  currentPlan: string;
}

// 利用可能なプランオプション
const planOptions = [
  { value: 'none', label: 'プラン加入なし' },
  { value: 'standard', label: 'スタンダード' },
  { value: 'strategic', label: 'ストラテジック' },
];

export default function CompanyPlanChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentPlan,
}: CompanyPlanChangeModalProps) {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedPlan) {
      alert('変更するプランを選択してください');
      return;
    }

    if (selectedPlan === currentPlan) {
      alert('同じプランが選択されています');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(selectedPlan);
      // 成功した場合のみモーダルを閉じる
      handleClose();
    } catch (error) {
      // エラーの場合はモーダルを開いたまま
      console.error('プラン変更エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPlan('');
    onClose();
  };

  // すべてのプランオプションを表示（現在のプランも含む）
  const availableOptions = planOptions.map(option => ({
    ...option,
    label:
      option.value === currentPlan
        ? `${option.label} (現在のプラン)`
        : option.label,
  }));

  return (
    <Modal
      title='プラン変更'
      isOpen={isOpen}
      onClose={handleClose}
      width='604px'
      height='393px'
      hideFooter={true}
    >
      <div className='flex flex-col items-center justify-center h-full w-full space-y-8'>
        {/* 説明文 */}
        <div className='text-center'>
          <p className='text-base font-bold text-[#323232]'>
            変更するプランを選択してください。
          </p>
        </div>

        {/* プラン選択 */}
        <div className='w-[323px]'>
          <SelectInput
            options={availableOptions}
            value={selectedPlan}
            placeholder='変更後のプランを選択してください。'
            onChange={setSelectedPlan}
            className='w-full'
            style={{ height: '50px' }}
          />
        </div>

        {/* ボタン群 */}
        <div className='flex gap-4 w-full max-w-[435px]'>
          <Button
            variant='outline'
            size='figma-default'
            onClick={handleClose}
            className='flex-1 h-[51px] border-[#323232] text-[#323232] rounded-[35px] hover:bg-gray-50'
          >
            キャンセル
          </Button>
          <Button
            variant='green-gradient'
            size='figma-default'
            onClick={handleConfirm}
            disabled={isLoading}
            className='flex-1 h-[51px]'
          >
            {isLoading ? '変更中...' : 'プランを変更する'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
