'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { Radio } from '@/components/ui/radio';
import type { CompanyUserSettings, CompanyNotificationSettings } from './actions';
import { saveCompanyNotificationSettings } from './actions';

interface CompanyNotificationSettingLocal {
  applicationNotification: string;
  messageNotification: string;
  recommendationNotification: string;
}

interface SettingsClientProps {
  initialUserSettings: CompanyUserSettings | null;
  initialNotifications: CompanyNotificationSettings | null;
}

export default function SettingsClient({ initialUserSettings, initialNotifications }: SettingsClientProps) {
  const [userSettings] = useState<CompanyUserSettings | null>(initialUserSettings);
  const [notifications, setNotifications] = useState<CompanyNotificationSettingLocal>({
    applicationNotification: initialNotifications?.application_notification ?? 'receive',
    messageNotification: initialNotifications?.message_notification ?? 'receive',
    recommendationNotification: initialNotifications?.system_notification ?? 'receive',
  });

  const handleNotificationChange = (type: keyof CompanyNotificationSettingLocal) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNotifications = {
      ...notifications,
      [type]: e.target.value,
    };
    setNotifications(newNotifications);

    const formData = new FormData();
    formData.append('applicationNotification', newNotifications.applicationNotification);
    formData.append('messageNotification', newNotifications.messageNotification);
    formData.append('recommendationNotification', newNotifications.recommendationNotification);
    saveCompanyNotificationSettings(formData).catch(console.error);
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <SettingsHeader
        breadcrumbs={[{ label: '' }]}
        title="プロフィール・設定"
        icon={<img src="/images/setting.svg" alt="設定" width={32} height={32} />}
      />

      <div className="px-4 md:px-20 py-10">
        <div className="bg-white rounded-[10px] p-4 md:p-10">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col md:flex-row md:gap-6">
              <div className="w-full md:w-[200px] flex-shrink-0 flex">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full">
                  <span className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">プロフィール</span>
                </div>
              </div>

              <div className="flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">候補者向け表示名</h3>
                    <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium">
                      {userSettings?.full_name || '表示名を取得中...'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">部署・役職</h3>
                    <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium">
                      {userSettings?.position_title || '部署・役職を取得中...'}
                    </p>
                  </div>
                  <Link
                    href="/company/setting/position"
                    className="px-4 md:px-6 py-[10px] min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center transition-colors duration-200 hover:bg-[#0F9058]/20"
                  >
                    部署・役職名変更
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-6">
              <div className="w-full md:w-[200px] flex-shrink-0 flex">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full">
                  <span className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">ログイン情報</span>
                </div>
              </div>

              <div className="flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">メールアドレス</h3>
                    <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium">
                      {userSettings?.email || 'メールアドレスを取得中...'}
                    </p>
                  </div>
                  <Link
                    href="/company/setting/mail"
                    className="px-4 md:px-6 py-[10px] min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center transition-colors duration-200 hover:bg-[#0F9058]/20"
                  >
                    メールアドレス変更
                  </Link>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] mb-2">パスワード</h3>
                    <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium">***********</p>
                  </div>
                  <Link
                    href="/company/setting/password"
                    className="px-4 md:px-6 py-[10px] min-w-[120px] w-full md:w-48 border border-[#0f9058] rounded-[32px] text-[#0f9058] font-bold text-xs tracking-[1.2px] text-center transition-colors duration-200 hover:bg-[#0F9058]/20"
                  >
                    パスワード変更
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:gap-6">
              <div className="w-full md:w-[200px] flex-shrink-0 flex">
                <div className="bg-[#f9f9f9] rounded-[5px] px-4 md:px-6 py-3 flex items-center justify-start w-full">
                  <span className="font-bold text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px]">通知メール配信設定</span>
                </div>
              </div>

              <div className="flex-1 py-4 md:py-6 flex flex-col gap-4 md:gap-6">
                <div className="flex flex-col gap-2 items-end justify-start">
                  <div className="flex gap-4 items-start justify-start w-full">
                    <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-bold w-[160px] text-right">
                      <p className="leading-[2] whitespace-pre">求人への応募</p>
                    </div>
                    <div className="flex flex-col gap-2 items-start justify-start">
                      <div className="flex flex-wrap gap-4 items-center justify-start">
                        <div className="flex gap-2 items-center justify-start">
                          <Radio
                            id="application-notification-receive"
                            name="applicationNotification"
                            value="receive"
                            checked={notifications.applicationNotification === 'receive'}
                            onChange={handleNotificationChange('applicationNotification')}
                          />
                          <label htmlFor="application-notification-receive" className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic shrink-0 text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer">
                            <p className="leading-[2] whitespace-pre">受け取る</p>
                          </label>
                        </div>
                        <div className="flex gap-2 items-center justify-start">
                          <Radio
                            id="application-notification-not-receive"
                            name="applicationNotification"
                            value="not-receive"
                            checked={notifications.applicationNotification === 'not-receive'}
                            onChange={handleNotificationChange('applicationNotification')}
                          />
                          <label htmlFor="application-notification-not-receive" className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic shrink-0 text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer">
                            <p className="leading-[2] whitespace-pre">受け取らない</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end justify-start">
                  <div className="flex gap-4 items-start justify-start w-full">
                    <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-bold w-[160px] text-right">
                      <p className="leading-[2] whitespace-pre">メッセージ受信</p>
                    </div>
                    <div className="flex flex-col gap-2 items-start justify-start">
                      <div className="flex flex-wrap gap-4 items-center justify-start">
                        <div className="flex gap-2 items-center justify-start">
                          <Radio
                            id="message-notification-receive"
                            name="messageNotification"
                            value="receive"
                            checked={notifications.messageNotification === 'receive'}
                            onChange={handleNotificationChange('messageNotification')}
                          />
                          <label htmlFor="message-notification-receive" className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic shrink-0 text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer">
                            <p className="leading-[2] whitespace-pre">受け取る</p>
                          </label>
                        </div>
                        <div className="flex gap-2 items-center justify-start">
                          <Radio
                            id="message-notification-not-receive"
                            name="messageNotification"
                            value="not-receive"
                            checked={notifications.messageNotification === 'not-receive'}
                            onChange={handleNotificationChange('messageNotification')}
                          />
                          <label htmlFor="message-notification-not-receive" className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic shrink-0 text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer">
                            <p className="leading-[2] whitespace-pre">受け取らない</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end justify-start">
                  <div className="flex gap-4 items-start justify-start w-full">
                    <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-bold w-[160px] text-right">
                      <p className="leading-[2] whitespace-pre">おすすめの候補者</p>
                    </div>
                    <div className="flex flex-col gap-2 items-start justify-start">
                      <div className="flex flex-wrap gap-4 items-center justify-start">
                        <div className="flex gap-2 items-center justify-start">
                          <Radio
                            id="recommendation-notification-receive"
                            name="recommendationNotification"
                            value="receive"
                            checked={notifications.recommendationNotification === 'receive'}
                            onChange={handleNotificationChange('recommendationNotification')}
                          />
                          <label htmlFor="recommendation-notification-receive" className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic shrink-0 text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer">
                            <p className="leading-[2] whitespace-pre">受け取る</p>
                          </label>
                        </div>
                        <div className="flex gap-2 items-center justify-start">
                          <Radio
                            id="recommendation-notification-not-receive"
                            name="recommendationNotification"
                            value="not-receive"
                            checked={notifications.recommendationNotification === 'not-receive'}
                            onChange={handleNotificationChange('recommendationNotification')}
                          />
                          <label htmlFor="recommendation-notification-not-receive" className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic shrink-0 text-[#323232] text-sm md:text-[16px] text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer">
                            <p className="leading-[2] whitespace-pre">受け取らない</p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <p className="text-sm md:text-base text-[#323232] tracking-[1.2px] md:tracking-[1.6px] font-medium">休会・退会をご希望の場合は、<a href="/company/contact" className="text-[#0f9058]">お問い合わせフォーム</a>よりご連絡ください</p>
        </div>
      </div>
    </div>
  );
}


