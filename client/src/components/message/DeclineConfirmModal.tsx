'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';
import { X } from 'lucide-react';

interface DeclineConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName?: string;
  jobTitle?: string;
  companyUserId?: string;
  jobPostingId?: string;
  roomId?: string;
}

export const DeclineConfirmModal: React.FC<DeclineConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  companyName = '企業名',
  jobTitle = '求人タイトル',
  companyUserId,
  jobPostingId,
  roomId,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [selectedDeclineReason, setSelectedDeclineReason] = useState('');
  const [showValidationError, setShowValidationError] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const declineReasonOptions = [
    { value: '', label: '未選択' },
    { value: '業務内容が希望と合致しない', label: '業務内容が希望と合致しない' },
    { value: '事業内容が希望と合致しない', label: '事業内容が希望と合致しない' },
    { value: '給与水準が希望と合致しない', label: '給与水準が希望と合致しない' },
    { value: '求人の情報量が少なく判断できない', label: '求人の情報量が少なく判断できない' },
    { value: '既に応募済みである', label: '既に応募済みである' },
    { value: '既に転職先を決めた', label: '既に転職先を決めた' },
    { value: 'その他の理由で辞退したい', label: 'その他の理由で辞退したい' },
  ];

  const handleReasonToggle = (reason: string) => {
    setSelectedReasons(prev => 
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const handleClose = () => {
    setSelectedReasons([]);
    setSelectedDeclineReason('');
    setShowValidationError(false);
    setIsSelectOpen(false);
    setIsSubmitting(false);
    onClose();
  };

  const handleConfirm = async () => {
    if (!selectedDeclineReason) {
      setShowValidationError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/message/decline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reason: selectedDeclineReason,
          companyUserId,
          jobPostingId,
          roomId,
        }),
      });

      if (!response.ok) {
        throw new Error('辞退理由の送信に失敗しました');
      }

      const data = await response.json();
      
      if (data.success) {
        onConfirm();
        setSelectedReasons([]);
        setSelectedDeclineReason('');
        setShowValidationError(false);
        setIsSelectOpen(false);
      } else {
        throw new Error(data.error || '辞退理由の送信に失敗しました');
      }
    } catch (error) {
      console.error('辞退理由の送信エラー:', error);
      alert('辞退理由の送信に失敗しました。もう一度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 z-50'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div
        className='hidden md:flex md:items-center md:justify-center md:h-full md:p-4'
      >
        <div
          className='flex flex-col items-start bg-white rounded-[10px] shadow-lg'
          style={{
            minWidth: '750px',
            minHeight: '430px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            overflow: 'visible',
          }}
        >
        {/* Header */}
        <header className='flex w-full items-center justify-between gap-6 px-6 py-6 relative bg-white border-b border-[#E5E7EB] flex-shrink-0 rounded-t-[10px]'>
          <h2 className="text-[#323232] text-[20px] tracking-[0.05em] leading-[1.6] font-bold font-['Noto_Sans_JP']">
          辞退理由を選択
          </h2>

          <button
            className='flex w-6 h-6 items-center justify-center hover:bg-gray-100 rounded transition-colors'
            onClick={onClose}
          >
            <X className='w-6 h-6 text-gray-400 hover:text-gray-600' />
          </button>
        </header>

        {/* Main content */}
        <div className='flex flex-col w-full items-center justify-center px-8 bg-[#F9F9F9] flex-1 overflow-visible' style={{ paddingTop: '40px', paddingBottom: '24px' }}>
          
          {/* テキスト部分 - 中央揃えで縦に配置 */}
          <div className="flex flex-col items-center mb-8">
            <p className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[0.05em] leading-[1.6] mb-2">
              スカウト精度向上のため、
            </p>
            <p className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[0.05em] leading-[1.6]">
              よろしければ辞退理由を教えてください。
            </p>
          </div>
          
          {/* 辞退理由選択部分 */}
          <div className="w-full flex flex-col items-center">
            <div className="flex items-center gap-4 mb-2">
              <p className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[0.05em] leading-[1.6]">
                辞退理由
              </p>
              <SelectInput
                options={declineReasonOptions}
                value={selectedDeclineReason}
                onChange={(value) => {
                  setSelectedDeclineReason(value);
                  setShowValidationError(false);
                }}
                placeholder="未選択"
                className="w-[380px]"
                error={showValidationError}
              />
            </div>
            {showValidationError && (
              <p className="text-[#FF5B5B] text-[14px] font-['Noto_Sans_JP'] font-normal">
                辞退理由を選択してください
              </p>
            )}
          </div>
        </div>

          {/* Footer */}
          <footer
            className='w-full flex items-center justify-center px-6 bg-white border-t border-[#E5E7EB] flex-shrink-0 rounded-b-[10px]'
            style={{
              height: '108px',
              minHeight: '108px',
              maxHeight: '108px',
            }}
          >
            <div className='flex justify-center gap-4'>
              <Button
                variant='green-outline'
                size='figma-default'
                className='min-w-[160px] font-["Noto_Sans_JP"] font-bold text-[16px] h-[52px]'
                style={{ padding: '16px 40px' }}
                onClick={onClose}
                type="button"
              >
                閉じる
              </Button>
              <Button
                className={cn(
                  "min-w-[160px] h-[52px] rounded-full",
                  "bg-[#FF5B5B] text-white border-2 border-[#FF5B5B]",
                  "font-['Noto_Sans_JP'] font-bold text-[14px] leading-[200%] tracking-[1.4px] text-center",
                  "hover:bg-[#FF4545] hover:border-[#FF4545] transition-colors",
                  isSubmitting && "opacity-50 cursor-not-allowed hover:bg-[#FF5B5B] hover:border-[#FF5B5B]"
                )}
                style={{ 
                  padding: '16px 40px',
                  color: '#FFF',
                  fontFamily: 'Noto Sans JP',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '200%',
                  letterSpacing: '1.4px'
                }}
                onClick={handleConfirm}
                disabled={isSubmitting}
                type="button"
              >
                {isSubmitting ? '送信中...' : '辞退理由を送信する'}
              </Button>
            </div>
          </footer>
        </div>
      </div>

      {/* Mobile view - Bottom half modal */}
      <div 
        className='md:hidden fixed inset-x-0 bottom-0 bg-white rounded-t-[30px] shadow-lg overflow-visible' 
        style={{ 
          minHeight: isSelectOpen ? 'calc(60vh + 150px)' : '60vh', 
          maxHeight: '90vh',
          transition: 'min-height 0.2s ease-in-out'
        }}
      >
        {/* Mobile Header */}
        <header className='flex w-full items-center justify-between gap-6 px-6 py-4 relative bg-white border-b border-[#E5E7EB] flex-shrink-0 rounded-t-[30px]'>
          <h2 className="text-[#323232] text-[18px] tracking-[0.05em] leading-[1.6] font-bold font-['Noto_Sans_JP']">
          辞退理由を選択
          </h2>
          <button
            className='flex w-6 h-6 items-center justify-center hover:bg-gray-100 rounded transition-colors'
            onClick={onClose}
          >
            <X className='w-5 h-5 text-gray-400 hover:text-gray-600' />
          </button>
        </header>

        {/* Mobile Main content */}
        <div className='flex flex-col w-full items-center pt-4 px-6 bg-[#F9F9F9] flex-1 overflow-visible'>
          {/* テキスト部分 - 中央揃えで縦に配置 */}
          <div className="flex flex-col items-center mb-6">
            <p className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[0.05em] leading-[1.6] mb-2 text-center">
              スカウト精度向上のため、
            </p>
            <p className="font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[0.05em] leading-[1.6] text-center">
              よろしければ辞退理由を教えてください。
            </p>
          </div>
          
          {/* 辞退理由選択部分 */}
          <div className="w-full flex flex-col items-center gap-3 mb-6">
            <p className="w-full text-start font-['Noto_Sans_JP'] font-bold text-[16px] text-[#323232] tracking-[0.05em] leading-[1.6]">
              辞退理由
            </p>
            <SelectInput
              options={declineReasonOptions}
              value={selectedDeclineReason}
              onChange={(value) => {
                setSelectedDeclineReason(value);
                setShowValidationError(false);
              }}
              placeholder="未選択"
              className="w-full max-w-[380px]"
              error={showValidationError}
              onOpen={() => setIsSelectOpen(true)}
              onClose={() => setIsSelectOpen(false)}
            />
            {showValidationError && (
              <p className="w-full text-start text-[#FF5B5B] text-[14px] font-['Noto_Sans_JP'] font-normal">
                辞退理由を選択してください
              </p>
            )}
          </div>
        </div>

        {/* Mobile Footer - Vertical buttons */}
        <footer className='w-full flex flex-col items-center gap-3 px-6 py-4 bg-white border-t border-[#E5E7EB] flex-shrink-0 rounded-b-[30px]'>
        <Button
            variant='green-outline'
            size='figma-default'
            className='w-full h-[48px] font-["Noto_Sans_JP"] font-bold text-[16px]'
            onClick={onClose}
            type="button"
          >
            閉じる
          </Button>
          <Button
            className={cn(
              "w-full h-[48px] rounded-full",
              "bg-[#FF5B5B] text-white border-2 border-[#FF5B5B]",
              "font-['Noto_Sans_JP'] font-bold text-[14px] leading-[200%] tracking-[1.4px] text-center",
              "hover:bg-[#FF4545] hover:border-[#FF4545] transition-colors",
              isSubmitting && "opacity-50 cursor-not-allowed hover:bg-[#FF5B5B] hover:border-[#FF5B5B]"
            )}
            style={{ 
              color: '#FFF',
              fontFamily: 'Noto Sans JP',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '200%',
              letterSpacing: '1.4px'
            }}
            onClick={handleConfirm}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? '送信中...' : '辞退理由を送信する'}
          </Button>
          
        </footer>
      </div>
    </div>
  );
};