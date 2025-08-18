'use client';

import React, { useState } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[{ label: '各種設定' }]}
        title="各種設定"
        icon={<Settings className="w-8 h-8" />}
      />
      
      <div className="px-4 md:px-20 py-10">
        <div className="bg-white rounded-[10px] p-4 md:p-10">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[200px] flex-shrink-0 flex">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full">
                  <span className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                    ログイン情報
                  </span>
                </div>
              </div>
              
              <div className="flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">
                      メールアドレス
                    </h3>
                    <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                      テキストが入ります。
                    </p>
                  </div>
                  <Link
                    href="/candidate/setting/mail"
                    className="px-4 md:px-6 py-2.5 min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center hover:bg-[#0f9058] hover:text-white transition-colors"
                  >
                    メールアドレス変更
                  </Link>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">
                      パスワード
                    </h3>
                    <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                      ***********
                    </p>
                  </div>
                  <Link
                    href="/candidate/setting/password"
                    className="px-4 md:px-6 py-2.5 min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center hover:bg-[#0f9058] hover:text-white transition-colors"
                  >
                    パスワード変更
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[200px] flex-shrink-0 flex">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full">
                  <span className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                    通知メール配信設定
                  </span>
                </div>
              </div>
              
              <div className="flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
                <div>
                  <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">
                    スカウト受信通知
                  </h3>
                  <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                    受け取る
                  </p>
                </div>
                
                <div>
                  <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">
                    メッセージ受信通知
                  </h3>
                  <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                    受け取る
                  </p>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1 md:w-[362px]">
                    <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">
                      おすすめの求人
                    </h3>
                    <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                      受け取る
                    </p>
                  </div>
                  <Link
                    href="/candidate/setting/notification"
                    className="px-4 md:px-6 py-2.5 min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center hover:bg-[#0f9058] hover:text-white transition-colors"
                  >
                    配信設定変更
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[200px] flex-shrink-0 flex">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full">
                  <span className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                    スカウトステータス
                  </span>
                </div>
              </div>
              
              <div className="flex-1 py-4 md:py-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1 md:w-[362px]">
                    <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">
                      スカウトステータス
                    </h3>
                    <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                      スカウトを受け取る
                    </p>
                  </div>
                  <Link
                    href="/candidate/setting/scout"
                    className="px-4 md:px-6 py-2.5 min-w-[120px] w-full md:w-auto border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center hover:bg-[#0f9058] hover:text-white transition-colors"
                  >
                    スカウトステータス変更
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[200px] flex-shrink-0 flex">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start relative w-full">
                  <span className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                    ブロック企業
                  </span>
                  <button
                    onClick={() => setShowTooltip(!showTooltip)}
                    className="absolute right-4 md:right-6"
                  >
                    <HelpCircle className="w-4 h-4 text-[#999999] hover:text-[#323232] transition-colors" />
                    {showTooltip && (
                      <div 
                        className="absolute right-[-50px] md:right-[-550px] top-[-10px] bg-[#F0F9F3] rounded-[5px] p-4 shadow-[0_0_20px_0_rgba(0,0,0,0.05)] flex flex-col justify-center items-center gap-1 z-10 w-64 md:w-auto"
                        style={{ display: 'flex', padding: '16px', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '4px' }}
                      >
                        <div className="text-[#323232] font-bold text-sm leading-[160%] tracking-[1.4px] font-['Noto_Sans_JP']">
                          ブロック企業とは
                        </div>
                        <div className="text-[#323232] font-medium text-sm leading-[160%] tracking-[1.4px] font-['Noto_Sans_JP'] text-center">
                          現職や転職活動中の企業など、スカウトを受けたくない企業をブロックできます。
                          一部の企業は自動で登録されるので、安心してご利用いただけます。
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex-1 py-4 md:py-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="w-full md:w-[400px] flex flex-col gap-2">
                    <div className="bg-[#d2f1da] rounded-[10px] px-4 md:px-6 py-2 h-10 flex items-center">
                      <span className="text-sm text-[#0f9058] tracking-[1.4px]">
                        企業名テキスト
                      </span>
                    </div>
                    <div className="bg-[#d2f1da] rounded-[10px] px-4 md:px-6 py-2 h-10 flex items-center">
                      <span className="text-sm text-[#0f9058] tracking-[1.4px]">
                        企業名テキスト
                      </span>
                    </div>
                    <div className="bg-[#d2f1da] rounded-[10px] px-4 md:px-6 py-2 h-10 flex items-center">
                      <span className="text-sm text-[#0f9058] tracking-[1.4px]">
                        企業名テキスト
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/candidate/setting/ng-company"
                    className="px-4 md:px-6 py-2.5 min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center hover:bg-[#0f9058] hover:text-white transition-colors"
                  >
                    ブロック企業変更
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-6">
              <p className="text-xs md:text-sm text-[#323232] tracking-[1.2px] md:tracking-[1.4px]">
                退会をご希望の方は
                <Link href="/candidate/setting/withdrawal" className="text-[#0f9058] underline">
                  こちら
                </Link>
                のフォームから手続きを行なってください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}