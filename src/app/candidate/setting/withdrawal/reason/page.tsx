'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { processWithdrawal } from './actions';

interface SelectOption {
  value: string;
  label: string;
}

const withdrawalReasons: SelectOption[] = [
  { value: '', label: '未選択' },
  { value: 'finished_job_hunting', label: '転職活動を終えた' },
  {
    value: 'no_matching_scouts',
    label: '希望条件に合致するスカウトがなかった',
  },
  { value: 'no_matching_jobs', label: '希望条件に合致する求人がなかった' },
  { value: 'service_difficult', label: 'サービスが使いにくい' },
  { value: 'other', label: 'その他' },
];

export default function WithdrawalReasonPage() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBack = () => {
    router.push('/candidate/setting/withdrawal');
  };

  const handleWithdraw = async () => {
    if (!selectedReason) {
      alert('退会理由をお選びください。');
      return;
    }

    setIsProcessing(true);

    try {
      await processWithdrawal(selectedReason);
      // processWithdrawal内でredirectが実行されるため、ここには到達しない
    } catch (error) {
      console.error('退会処理エラー:', error);
      alert('退会処理中にエラーが発生しました。もう一度お試しください。');
      setIsProcessing(false);
    }
  };

  const handleSelectReason = (value: string) => {
    setSelectedReason(value);
  };

  return (
    <div className='min-h-screen bg-[#f9f9f9]'>
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: '退会', href: '/candidate/setting/withdrawal' },
          { label: '退会理由の選択' },
        ]}
        title='退会理由の選択'
        icon={
          <img src='/images/setting.svg' alt='設定' width={32} height={32} />
        }
      />
      <div className='bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full'>
        <div className='bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-center justify-start p-4 md:p-[40px] relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full'>
          <div className="box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full">
            <div className='relative shrink-0 text-[#0f9058] text-xl md:text-[32px] tracking-[1.6px] md:tracking-[3.2px] w-full font-bold'>
              <p className='block leading-[1.6]'>
                退会理由を選択してください。
              </p>
            </div>
            <div className='leading-[2] relative shrink-0 text-[#323232] text-sm md:text-[16px] tracking-[1.2px] md:tracking-[1.6px] w-full'>
              <p className='block mb-0 font-bold'>
                退会される場合は、以下の内容をご確認の上、手続きを進めてください。
              </p>
              <p className='block font-bold'>
                退会後はアカウント情報や応募履歴など、すべてのデータが削除され、元に戻すことはできません。
              </p>
            </div>
          </div>
          <div className='box-border content-stretch flex flex-col md:flex-row gap-4 items-start md:items-center justify-center p-0 relative shrink-0 w-full'>
            <div className='box-border content-stretch flex flex-row gap-2.5 items-center justify-start px-0 relative shrink-0'>
              <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium">
                <p className='adjustLetterSpacing block leading-[2] whitespace-pre font-bold'>
                  退会理由
                </p>
              </div>
            </div>
            <div className='box-border content-stretch flex flex-col gap-2 items-start justify-center p-0 relative shrink-0 w-full md:w-[400px]'>
              <SelectInput
                options={withdrawalReasons}
                value={selectedReason}
                placeholder='退会理由を選択してください'
                onChange={handleSelectReason}
                className='w-full'
              />
            </div>
          </div>
        </div>
        <div className='box-border content-stretch flex flex-col md:flex-row gap-4 items-stretch md:items-start justify-center md:justify-start p-0 relative shrink-0 w-full md:w-auto'>
          <Button
            variant='green-outline'
            size='figma-default'
            className='min-w-40 w-full md:w-auto font-bold'
            onClick={handleBack}
          >
            戻る
          </Button>
          <button
            onClick={handleWithdraw}
            disabled={!selectedReason || isProcessing}
            className='bg-[#ff5b5b] box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 w-full md:w-auto px-10 py-3.5 relative rounded-[32px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e54545] transition-colors'
          >
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[1.4px] font-bold">
              <p className='adjustLetterSpacing block leading-[2] whitespace-pre font-bold'>
                {isProcessing ? '処理中...' : '退会する'}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
