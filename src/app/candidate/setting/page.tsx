'use client';

import React, { useState, useEffect } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { getBlockedCompanies } from './ng-company/actions';
import { getUserSettings, UserSettings } from './actions';
import { useCandidateAuth } from '@/hooks/useClientAuth';
import { useRouter } from 'next/navigation';

interface BlockedCompany {
  name: string;
}

export default function SettingsPage() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const [showTooltip, setShowTooltip] = useState(false);
  const [blockedCompanies, setBlockedCompanies] = useState<BlockedCompany[]>(
    []
  );
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);

  // 認証チェック
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Starting fetchData...');

        // Fetch blocked companies
        const blockedSettings = await getBlockedCompanies();
        console.log('Blocked companies result:', blockedSettings);
        if (blockedSettings && blockedSettings.company_names) {
          const companies = blockedSettings.company_names.map(name => ({
            name,
          }));
          setBlockedCompanies(companies);
        }

        // Fetch user settings
        const userSettingsData = await getUserSettings();
        console.log('User settings data received:', userSettingsData);
        setUserSettings(userSettingsData);
      } catch (error) {
        console.error('設定の取得に失敗しました:', error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-pulse'>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !candidateUser) {
    return null;
  }

  return (
    <div className='min-h-screen bg-[#f9f9f9]'>
      <SettingsHeader
        breadcrumbs={[{ label: '各種設定' }]}
        title='各種設定'
        icon={
          <img src='/images/setting.svg' alt='設定' width={32} height={32} />
        }
      />

      <div className='px-4 md:px-20 py-10'>
        <div className='bg-white rounded-[10px] p-4 md:p-10'>
          <div className='flex flex-col gap-2'>
            <div className='flex flex-col md:flex-row md:gap-6'>
              <div className='w-full md:w-[200px] flex-shrink-0 flex'>
                <div className='bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full'>
                  <span className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]'>
                    ログイン情報
                  </span>
                </div>
              </div>

              <div className='flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6'>
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2'>
                      メールアドレス
                    </h3>
                    <p className='text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium'>
                      {userSettings?.email || 'メールアドレスを取得中...'}
                    </p>
                  </div>
                  <Link
                    href='/candidate/setting/mail'
                    className='px-4 md:px-6 py-[10px] min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center transition-colors duration-200 hover:bg-[#0F9058]/20'
                  >
                    メールアドレス変更
                  </Link>
                </div>

                <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                  <div className='flex-1'>
                    <h3 className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2'>
                      パスワード
                    </h3>
                    <p className='text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium'>
                      ***********
                    </p>
                  </div>
                  <Link
                    href='/candidate/setting/password'
                    className='px-4 md:px-6 py-[10px] min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center transition-colors duration-200 hover:bg-[#0F9058]/20'
                  >
                    パスワード変更
                  </Link>
                </div>
              </div>
            </div>

            <div className='flex flex-col md:flex-row md:gap-6'>
              <div className='w-full md:w-[200px] flex-shrink-0 flex'>
                <div className='bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full'>
                  <span className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]'>
                    通知メール配信設定
                  </span>
                </div>
              </div>

              <div className='flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6'>
                <div>
                  <h3 className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2'>
                    スカウト受信通知
                  </h3>
                  <p className='text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium'>
                    {userSettings?.notification_settings?.scout_notification ===
                    'receive'
                      ? '受け取る'
                      : userSettings?.notification_settings
                            ?.scout_notification === 'not-receive'
                        ? '受け取らない'
                        : '設定中...'}
                  </p>
                </div>

                <div>
                  <h3 className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2'>
                    メッセージ受信通知
                  </h3>
                  <p className='text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium'>
                    {userSettings?.notification_settings
                      ?.message_notification === 'receive'
                      ? '受け取る'
                      : userSettings?.notification_settings
                            ?.message_notification === 'not-receive'
                        ? '受け取らない'
                        : '設定中...'}
                  </p>
                </div>

                <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                  <div className='flex-1 md:w-[362px]'>
                    <h3 className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2'>
                      おすすめの求人
                    </h3>
                    <p className='text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium'>
                      {userSettings?.notification_settings
                        ?.recommendation_notification === 'receive'
                        ? '受け取る'
                        : userSettings?.notification_settings
                              ?.recommendation_notification === 'not-receive'
                          ? '受け取らない'
                          : '設定中...'}
                    </p>
                  </div>
                  <Link
                    href='/candidate/setting/notification'
                    className='px-4 md:px-6 py-[10px] min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center transition-colors duration-200 hover:bg-[#0F9058]/20'
                  >
                    配信設定変更
                  </Link>
                </div>
              </div>
            </div>

            <div className='flex flex-col md:flex-row md:gap-6'>
              <div className='w-full md:w-[200px] flex-shrink-0 flex'>
                <div className='bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full'>
                  <span className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]'>
                    スカウトステータス
                  </span>
                </div>
              </div>

              <div className='flex-1 py-4 md:py-6'>
                <div className='flex flex-col md:flex-row md:items-end justify-between gap-4'>
                  <div className='flex-1 md:w-[362px]'>
                    <h3 className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2'>
                      スカウトステータス
                    </h3>
                    <p className='text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium'>
                      {userSettings?.scout_settings?.scout_status === 'receive'
                        ? 'スカウトを受け取る'
                        : userSettings?.scout_settings?.scout_status ===
                            'not-receive'
                          ? 'スカウトを受け取らない'
                          : userSettings?.scout_reception_enabled
                            ? 'スカウトを受け取る'
                            : 'スカウトを受け取らない'}
                    </p>
                  </div>
                  <Link
                    href='/candidate/setting/scout'
                    className='px-4 md:px-6 py-[10px] min-w-[120px] w-full md:w-auto border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center transition-colors duration-200 hover:bg-[#0F9058]/20'
                  >
                    スカウトステータス変更
                  </Link>
                </div>
              </div>
            </div>

            <div className='flex flex-col md:flex-row md:gap-6'>
              <div className='w-full md:w-[200px] flex-shrink-0 flex'>
                <div className='bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start relative w-full'>
                  <span className='font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]'>
                    ブロック企業
                  </span>
                  <button
                    onClick={() => setShowTooltip(!showTooltip)}
                    className='absolute right-4 md:right-6'
                  >
                    <HelpCircle className='w-4 h-4 text-[#999999] hover:text-[#323232] transition-colors' />
                  </button>
                  {showTooltip && (
                    <>
                      {/* Mobile: Full width card below the button */}
                      <div className='md:hidden fixed left-4 right-4 top-[50%] transform -translate-y-1/2 bg-[#F0F9F3] rounded-[10px] p-4 shadow-[0_0_20px_0_rgba(0,0,0,0.1)] flex flex-col gap-2 z-50'>
                        <div className='flex justify-between items-start'>
                          <div className="text-[#323232] font-bold text-sm leading-[160%] tracking-[1.4px] font-['Noto_Sans_JP'] text-left">
                            ブロック企業とは
                          </div>
                          <div
                            onClick={() => setShowTooltip(false)}
                            className='p-1 cursor-pointer'
                          >
                            <svg
                              width='14'
                              height='14'
                              viewBox='0 0 14 14'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M1 1L13 13M1 13L13 1'
                                stroke='#999999'
                                strokeWidth='2'
                                strokeLinecap='round'
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="text-[#323232] font-medium text-xs leading-[160%] tracking-[1.2px] font-['Noto_Sans_JP'] text-left">
                          現職や転職活動中の企業など、スカウトを受けたくない企業をブロックできます。
                          一部の企業は自動で登録されるので、安心してご利用いただけます。
                        </div>
                      </div>
                      {/* Overlay for mobile - much lighter */}
                      <div
                        className='md:hidden fixed inset-0 bg-black/5 z-40'
                        onClick={() => setShowTooltip(false)}
                      />
                      {/* Desktop: Absolute positioned card */}
                      <div className='hidden md:flex absolute right-[-470px] top-[-40px] bg-[#F0F9F3] rounded-[5px] p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] flex-col gap-1 z-10 w-[470px]'>
                        <div className="text-[#323232] font-bold text-sm leading-[160%] tracking-[1.4px] font-['Noto_Sans_JP'] text-left">
                          ブロック企業とは
                        </div>
                        <div className="text-[#323232] font-medium text-sm leading-[160%] tracking-[1.4px] font-['Noto_Sans_JP'] text-left">
                          現職や転職活動中の企業など、スカウトを受けたくない企業をブロックできます。
                          一部の企業は自動で登録されるので、安心してご利用いただけます。
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className='flex-1 py-4 md:py-6'>
                <div className='flex flex-col md:flex-row md:items-start justify-between gap-4'>
                  <div className='w-full md:w-[400px] flex flex-col gap-2'>
                    {blockedCompanies.length > 0 ? (
                      blockedCompanies.slice(0, 3).map((company, index) => (
                        <div
                          key={index}
                          className='bg-[#d2f1da] rounded-[10px] px-4 md:px-6 py-2 h-10 flex items-center'
                        >
                          <span className='text-[#0f9058] text-[14px] font-medium leading-[1.6] tracking-[1.4px]'>
                            {company.name}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className='text-sm text-[#666666] tracking-[1.4px] py-2 text-center w-full'>
                        現在ブロックしている企業はありません。
                      </div>
                    )}
                    {blockedCompanies.length > 3 && (
                      <div className='text-xs text-[#666666] tracking-[1.2px] py-1'>
                        他 {blockedCompanies.length - 3} 件
                      </div>
                    )}
                  </div>
                  <Link
                    href='/candidate/setting/ng-company'
                    className='px-4 md:px-6 py-[10px] min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center transition-colors duration-200 hover:bg-[#0F9058]/20'
                  >
                    ブロック企業変更
                  </Link>
                </div>
              </div>
            </div>

            <div className='mt-4 md:mt-6'>
              <p className='text-xs md:text-sm text-[#323232] tracking-[1.2px] md:tracking-[1.4px] font-medium'>
                退会をご希望の方は
                <Link
                  href='/candidate/setting/withdrawal'
                  className='text-[#0f9058] underline'
                >
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
