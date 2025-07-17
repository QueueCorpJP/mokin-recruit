'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import NewJobHeader from '@/components/company/job/NewJobHeader';

export default function JobCompletePage() {
  const router = useRouter();

  const handleContinueRegistration = () => {
    // 他の求人も続けて登録
    router.push('/company/job/new');
  };

  const handleViewJobList = () => {
    // 作成した求人一覧を見る
    router.push('/company/job');
  };

  return (
    <div>
      <NewJobHeader 
        breadcrumbText="求人一覧・投稿申請完了"
        titleText="掲載申請完了"
      />
      <div className="flex min-h-[577px] pt-10 pr-20 pb-20 pl-20 flex-col items-center gap-10 self-stretch bg-[#F9F9F9]">
        <div className="w-full max-w-3xl">
          <div className="flex p-20 flex-col items-center gap-8 self-stretch rounded-[10px] bg-white">
            {/* アイコン */}
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full border-2 border-[#0F9058]">
              <svg className="w-8 h-8 text-[#0F9058]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>

            {/* タイトル */}
            <div className="text-center">
              <h1 className="font-['Noto_Sans_JP'] font-bold text-[24px] leading-[1.5] tracking-[2.4px] text-[#0F9058] mb-2">
                掲載申請完了
              </h1>
            </div>

            {/* メインメッセージ */}
            <div className="text-center space-y-6">
              <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] leading-[1.6] tracking-[2px] text-[#323232]">
                掲載申請が完了しました
              </h2>
              
              <div className="space-y-4 text-center">
                <p className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[1.8] tracking-[1.6px] text-[#666666]">
                  作成いただいた求人情報は、運営審査にて確認を行っております。
                </p>
                <p className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[1.8] tracking-[1.6px] text-[#666666]">
                  確認が完了次第、順次公開されます。
                </p>
                <p className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[1.8] tracking-[1.6px] text-[#666666]">
                  また、審査結果はメールにてご連絡いたします。
                </p>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex gap-6 mt-8">
              <Button 
                type="button" 
                onClick={handleContinueRegistration}
                style={{
                  borderRadius: '32px',
                  background: 'transparent',
                  border: '2px solid #198D76',
                  color: '#198D76',
                  fontWeight: 'bold',
                  padding: '12px 32px',
                  minWidth: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '16px',
                  letterSpacing: '1.6px'
                }}
              >
                他の求人も続けて登録
              </Button>
              
              <Button 
                type="button" 
                onClick={handleViewJobList}
                style={{
                  borderRadius: '32px',
                  background: 'linear-gradient(83deg, #198D76 0%, #1CA74F 100%)',
                  boxShadow: '0px 5px 10px 0px rgba(0, 0, 0, 0.15)',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '12px 32px',
                  minWidth: '200px',
                  border: 'none',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '16px',
                  letterSpacing: '1.6px'
                }}
              >
                作成した求人一覧を見る
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 