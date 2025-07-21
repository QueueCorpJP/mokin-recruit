'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import NewJobHeader from '@/app/company/company/job/NewJobHeader';

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
      <div className="bg-[#f9f9f9] relative min-h-[577px]">
        <div className="flex flex-col items-center min-h-inherit">
          <div className="box-border content-stretch flex flex-col gap-10 items-center justify-start min-h-inherit pb-20 pt-10 px-20 w-full">
            <div className="bg-[#ffffff] relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] w-full">
              <div className="flex flex-col items-center">
                <div className="box-border content-stretch flex flex-col gap-10 items-center justify-start p-[80px] w-full">
                  <div className="box-border content-stretch flex flex-col font-['Noto_Sans_JP'] font-bold gap-6 items-center justify-start text-center w-full">
                    <div className="text-[#0f9058] text-[32px] tracking-[3.2px] w-full">
                      <p className="block leading-[1.6] mb-0">
                        掲載申請が完了しました
                      </p>
                    </div>
                    <div className="leading-[2] text-[#323232] text-[16px] tracking-[1.6px] w-full font-[700]">
                      <p className="block mb-0">
                        作成いただいた求人情報は、現在弊社にて確認を行っております。
                      </p>
                      <p className="block mb-0">
                        確認が完了次第、順次公開されます。
                      </p>
                      <p className="block mb-0">
                        また、審査結果はメールにてご連絡いたします。
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 items-start justify-center">
                    <button
                      onClick={handleContinueRegistration}
                      className="box-border flex items-center justify-center min-w-40 px-10 py-3.5 rounded-[32px] w-[248px] border border-[#0f9058] border-solid bg-transparent relative"
                    >
                      <span className="font-['Noto_Sans_JP'] font-bold text-[#0f9058] text-[16px] text-center tracking-[1.6px] leading-[2] whitespace-pre">
                        他の求人も続けて登録
                      </span>
                    </button>
                    <button
                      onClick={handleViewJobList}
                      className="box-border flex items-center justify-center min-w-40 px-10 py-3.5 rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] bg-gradient-to-r from-[#198D76] to-[#1CA74F]"
                    >
                      <span className="font-['Noto_Sans_JP'] font-bold text-[#ffffff] text-[16px] text-center tracking-[1.6px] leading-[2] whitespace-pre">
                        作成した求人一覧を見る
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 