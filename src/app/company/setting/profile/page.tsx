'use client';

import React, { useState, useEffect } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateCompanyProfile, getCompanyUserSettings } from '../actions';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('');
  const [department, setDepartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCurrentData = async () => {
      try {
        const currentSettings = await getCompanyUserSettings();
        if (currentSettings) {
          setDisplayName(currentSettings.display_name || '');
          setDepartment(currentSettings.department || '');
        }
        setIsDataLoaded(true);
      } catch (error) {
        console.error('現在のデータ取得エラー:', error);
        setIsDataLoaded(true);
      }
    };

    loadCurrentData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await updateCompanyProfile(displayName, department);
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/company/setting/profile/complete');
      }
    } catch (error) {
      setError('プロフィールの更新に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isDataLoaded) {
    return (
      <div className="min-h-screen bg-[#f9f9f9]">
        <SettingsHeader
          breadcrumbs={[
            { label: '各種設定', href: '/company/setting' },
            { label: 'プロフィール変更' }
          ]}
          title="プロフィール変更"
          icon={<Image src="/images/setting.svg" alt="設定" width={32} height={32} />}
        />
        <div className="px-4 md:px-20 py-10">
          <div className="bg-white rounded-[10px] p-4 md:p-10">
            <div className="text-center">
              <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">
                データを読み込み中...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/company/setting' },
          { label: 'プロフィール変更' }
        ]}
        title="プロフィール変更"
        icon={<Image src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      
      <div className="px-4 md:px-20 py-10">
        <div className="bg-white rounded-[10px] p-4 md:p-10">
          <div className="flex flex-col gap-6 md:gap-10 items-center">
            <div className="text-center w-full">
              <h2 className="text-xl md:text-[32px] font-bold text-[#0f9058] tracking-[1.8px] md:tracking-[3.2px] mb-4 md:mb-6">
                プロフィール変更
              </h2>
              <p className="text-sm md:text-base font-bold text-[#323232] tracking-[1.2px] md:tracking-[1.6px] leading-6 md:leading-8">
                候補者向けの表示名と部署・役職を変更できます。
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full max-w-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start">
                  <div className="pt-0 md:pt-[11px] w-full md:w-auto">
                    <label className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] whitespace-nowrap">
                      候補者向け表示名
                    </label>
                  </div>
                  
                  <div className="w-full md:w-[400px] flex flex-col gap-2">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="例：田中 太郎"
                      className="w-full p-[11px] border border-[#999999] rounded-[5px] text-sm md:text-base text-[#323232] placeholder:text-[#999999] tracking-[1.2px] md:tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-start">
                  <div className="pt-0 md:pt-[11px] w-full md:w-auto">
                    <label className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] whitespace-nowrap">
                      部署・役職
                    </label>
                  </div>
                  
                  <div className="w-full md:w-[400px] flex flex-col gap-2">
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="例：人事部 マネージャー"
                      className="w-full p-[11px] border border-[#999999] rounded-[5px] text-sm md:text-base text-[#323232] placeholder:text-[#999999] tracking-[1.2px] md:tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="mt-4">
                  <p className="text-xs md:text-sm text-red-500 tracking-[1.2px] md:tracking-[1.4px] text-center">
                    {error}
                  </p>
                </div>
              )}
              
              <div className="flex justify-center mt-6 md:mt-10">
                <Button
                  type="submit"
                  disabled={isLoading}
                  variant="green-gradient"
                  size="figma-default"
                  className="min-w-[120px] md:min-w-[160px] w-full md:w-auto text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px]"
                >
                  {isLoading ? '更新中...' : 'プロフィール変更'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';