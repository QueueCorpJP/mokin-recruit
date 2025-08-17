'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Navigation } from '@/components/ui/navigation';

const downIcon = "http://localhost:3845/assets/b8ec927e1b16d99a848effc5e2833c8d0e7ca488.svg";

interface SelectOption {
  value: string;
  label: string;
}

const withdrawalReasons: SelectOption[] = [
  { value: '', label: '未選択' },
  { value: 'found_job', label: '転職先が決まった' },
  { value: 'not_satisfied', label: 'サービスに満足していない' },
  { value: 'too_many_emails', label: 'メールが多い' },
  { value: 'privacy_concerns', label: 'プライバシーが心配' },
  { value: 'not_using', label: '利用していない' },
  { value: 'other', label: 'その他' }
];

export default function WithdrawalReasonPage() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleBack = () => {
    router.push('/candidate/setting/withdrawal');
  };

  const handleWithdraw = () => {
    if (!selectedReason) {
      alert('退会理由をお選びください。');
      return;
    }
    router.push('/candidate/setting/withdrawal/complete');
  };

  const handleSelectReason = (value: string) => {
    setSelectedReason(value);
    setIsDropdownOpen(false);
  };

  const selectedOption = withdrawalReasons.find(option => option.value === selectedReason);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <Navigation variant="candidate" isLoggedIn={true} />
      
      <div
        className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full"
      >
        <div
          className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-center justify-start p-[40px] relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full max-w-4xl"
        >
          <div
            className="box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full"
          >
            <div
              className="relative shrink-0 text-[#0f9058] text-[32px] tracking-[3.2px] w-full"
            >
              <p className="block leading-[1.6]">退会理由をお選びください。</p>
            </div>
            <div
              className="leading-[2] relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] font-medium w-full font-medium"
            >
              <p className="block mb-0">
                ※退会理由を参考にして今後のサービス改善に努めてまいります。
              </p>
              <p className="block">
                退会後に再度アカウントを作成いただくことは可能ですが、これまでのご利用履歴などは引き継がれません。
              </p>
            </div>
          </div>
          <div
            className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0 w-full"
          >
            <div
              className="box-border content-stretch flex flex-row gap-2.5 items-start justify-start pb-0 pt-[11px] px-0 relative shrink-0"
            >
              <div
                className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px] font-medium"
              >
                <p className="adjustLetterSpacing block leading-[2] whitespace-pre">退会理由</p>
              </div>
            </div>
            <div
              className="box-border content-stretch flex flex-col gap-2 items-start justify-center p-0 relative shrink-0 w-[400px]"
            >
              <div className="relative w-full">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="basis-0 bg-[#ffffff] box-border content-stretch flex flex-row gap-[11px] grow items-center justify-start min-h-px min-w-px pl-[11px] pr-4 py-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] cursor-pointer hover:border-[#0f9058] transition-colors"
                >
                  <div
                    className="basis-0 font-['Noto_Sans_JP:Bold',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#323232] text-[16px] text-left tracking-[1.6px] font-medium"
                  >
                    <p className="block leading-[2]">{selectedOption?.label || '未選択'}</p>
                  </div>
                  <div className="flex flex-row items-center self-stretch">
                    <div className="box-border content-stretch flex flex-col h-full items-center justify-start pb-0 pt-3 px-0 relative shrink-0 w-3.5">
                      <div className="h-[9.333px] relative shrink-0 w-3.5">
                        <img 
                          alt="" 
                          className={`block max-w-none size-full transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                          src={downIcon} 
                        />
                      </div>
                    </div>
                  </div>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-10 bg-white border border-[#999999] rounded-[5px] mt-1 shadow-lg max-h-60 overflow-y-auto">
                    {withdrawalReasons.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleSelectReason(option.value)}
                        className="w-full px-[11px] py-[11px] text-left hover:bg-[#f0f8f5] transition-colors font-['Noto_Sans_JP:Bold',_sans-serif] text-[#323232] text-[16px] tracking-[1.6px] font-medium leading-[2] font-medium"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
        >
          <Button
            variant="green-outline"
            size="figma-default"
            className="min-w-40"
            onClick={handleBack}
          >
            戻る
          </Button>
          <button
            onClick={handleWithdraw}
            disabled={!selectedReason}
            className="bg-[#ff5b5b] box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 px-10 py-3.5 relative rounded-[32px] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#e54545] transition-colors"
          >
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[14px] text-center text-nowrap tracking-[1.4px]">
              <p className="adjustLetterSpacing block leading-[2] whitespace-pre">退会する</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}