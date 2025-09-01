'use client';

import React, { useState, useEffect } from 'react';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { updateCompanyProfile, getCompanyUserSettings } from '../actions';
import { Button } from '@/components/ui/button';

export default function PositionPage() {
  const [positionTitle, setPositionTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadCurrentData = async () => {
      try {
        const currentSettings = await getCompanyUserSettings();
        if (currentSettings) {
          setPositionTitle(currentSettings.position_title || '');
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

    // バリデーション
    if (!positionTitle.trim()) {
      setError('部署・役職を入力してください');
      return;
    }

    setIsLoading(true);

    try {
      // 現在のfull_nameを取得してそのまま使用
      const currentSettings = await getCompanyUserSettings();
      const result = await updateCompanyProfile(
        currentSettings?.full_name || '', 
        positionTitle
      );
      
      if (result.error) {
        setError(result.error);
      } else {
        router.push('/company/setting');
      }
    } catch (error) {
      setError('部署・役職の更新に失敗しました');
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
            { label: '部署・役職変更' }
          ]}
          title="部署・役職変更"
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
          { label: '部署・役職変更' }
        ]}
        title="部署・役職変更"
        icon={<Image src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />
      
      <div className="px-4 md:px-20 py-10">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-[10px] p-4 md:p-10">
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="pt-[11px]">
                <label className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] whitespace-nowrap">
                  部署・役職
                </label>
              </div>
              
              <div className="w-full md:w-[400px] flex flex-col gap-2">
                <input
                  type="text"
                  value={positionTitle}
                  onChange={(e) => setPositionTitle(e.target.value)}
                  placeholder="部署・役職名テキストを入力"
                  className="w-full p-[11px] border border-[#999999] rounded-[5px] text-sm md:text-base text-[#323232] placeholder:text-[#999999] tracking-[1.2px] md:tracking-[1.6px] focus:outline-none focus:ring-2 focus:ring-[#0f9058] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
                {error && (
                  <p className="text-xs md:text-sm text-red-500 tracking-[1.2px] md:tracking-[1.4px]">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mt-10">
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 md:px-10 py-3.5 min-w-[120px] md:min-w-[160px] bg-gradient-to-r from-[#0f9058] to-[#229a4e] text-white font-bold text-sm md:text-base tracking-[1.2px] md:tracking-[1.6px] rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:shadow-[0px_8px_15px_0px_rgba(0,0,0,0.2)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '更新中...' : '変更を保存'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';