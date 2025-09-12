'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Radio } from '@/components/ui/radio';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import Image from 'next/image';
import { saveNotificationSettings, getNotificationSettings } from './actions';
import { useCandidateAuth } from '@/hooks/useClientAuth';
import { useSettingsForm } from '@/app/candidate/setting/_shared/hooks/useSettingsForm';

interface NotificationSetting {
  scoutNotification: string;
  messageNotification: string;
  recommendationNotification: string;
}

export default function NotificationSettingPage() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();

  const {
    state: notifications,
    setState: setNotifications,
    settingsLoading,
    isPending,
    error,
    setError,
    hasChanges,
    handleSave,
  } = useSettingsForm<NotificationSetting>({
    enabled: !loading && !!isAuthenticated && !!candidateUser,
    load: async () => {
      const settings = await getNotificationSettings();
      if (settings) {
        return {
          scoutNotification: settings.scout_notification,
          messageNotification: settings.message_notification,
          recommendationNotification: settings.recommendation_notification,
        };
      }
      // デフォルト値（従来の初期値を踏襲）
      return {
        scoutNotification: 'receive',
        messageNotification: 'receive',
        recommendationNotification: 'receive',
      };
    },
    buildFormData: state => {
      const formData = new FormData();
      formData.append('scoutNotification', state.scoutNotification);
      formData.append('messageNotification', state.messageNotification);
      formData.append(
        'recommendationNotification',
        state.recommendationNotification
      );
      return formData;
    },
    save: saveNotificationSettings,
  });

  // 認証チェック
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

  // 旧来の差分判定・ロード副作用は useSettingsForm に移管済み

  const handleNotificationChange =
    (type: keyof NotificationSetting) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNotifications(prev => ({
        ...prev,
        [type]: e.target.value,
      }));
    };

  const handleSaveClick = () => {
    setError(null);
    handleSave();
  };

  const handleBack = () => {
    router.push('/candidate/setting');
  };

  if (loading || settingsLoading) {
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
    <div className='min-h-screen bg-[#f9f9f9] overflow-x-hidden'>
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: '通知メール配信設定変更' },
        ]}
        title='通知メール配信設定変更'
        icon={
          <Image src='/images/setting.svg' alt='設定' width={32} height={32} />
        }
      />
      <div className='bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full'>
        <div className='bg-[#ffffff] box-border content-stretch flex flex-col gap-4 md:gap-2 items-start justify-start p-4 md:p-[40px] relative rounded-[10px] shrink-0 w-full'>
          {error && (
            <div className='w-full p-4 mb-4 text-red-600 bg-red-50 border border-red-200 rounded'>
              {error}
            </div>
          )}
          <div className='box-border content-stretch flex flex-col gap-6 md:gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
            <div className='box-border content-stretch flex flex-col gap-4 md:gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
              <div className='box-border content-stretch flex flex-col md:flex-row gap-2 md:gap-4 items-start justify-start p-0 relative shrink-0 w-full'>
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium min-w-[120px]">
                  <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                    スカウト通知
                  </p>
                </div>
                <div className='box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
                  <div className='[flex-flow:wrap] box-border content-center flex flex-col md:flex-row gap-4 items-start md:items-center justify-start p-0 relative shrink-0 w-full'>
                    <div className='flex items-center gap-2'>
                      <Radio
                        id='scout-notification-receive'
                        name='scoutNotification'
                        value='receive'
                        checked={notifications.scoutNotification === 'receive'}
                        onChange={handleNotificationChange('scoutNotification')}
                      />
                      <label
                        htmlFor='scout-notification-receive'
                        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer"
                      >
                        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                          受け取る
                        </p>
                      </label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Radio
                        id='scout-notification-not-receive'
                        name='scoutNotification'
                        value='not-receive'
                        checked={
                          notifications.scoutNotification === 'not-receive'
                        }
                        onChange={handleNotificationChange('scoutNotification')}
                      />
                      <label
                        htmlFor='scout-notification-not-receive'
                        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer"
                      >
                        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                          受け取らない
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* メッセージ通知 */}
            <div className='box-border content-stretch flex flex-col gap-4 md:gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
              <div className='box-border content-stretch flex flex-col md:flex-row gap-2 md:gap-4 items-start justify-start p-0 relative shrink-0 w-full'>
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium min-w-[120px]">
                  <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                    メッセージ通知
                  </p>
                </div>
                <div className='box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
                  <div className='[flex-flow:wrap] box-border content-center flex flex-col md:flex-row gap-4 items-start md:items-center justify-start p-0 relative shrink-0 w-full'>
                    <div className='flex items-center gap-2'>
                      <Radio
                        id='message-notification-receive'
                        name='messageNotification'
                        value='receive'
                        checked={
                          notifications.messageNotification === 'receive'
                        }
                        onChange={handleNotificationChange(
                          'messageNotification'
                        )}
                      />
                      <label
                        htmlFor='message-notification-receive'
                        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer"
                      >
                        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                          受け取る
                        </p>
                      </label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Radio
                        id='message-notification-not-receive'
                        name='messageNotification'
                        value='not-receive'
                        checked={
                          notifications.messageNotification === 'not-receive'
                        }
                        onChange={handleNotificationChange(
                          'messageNotification'
                        )}
                      />
                      <label
                        htmlFor='message-notification-not-receive'
                        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer"
                      >
                        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                          受け取らない
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* おすすめ通知 */}
            <div className='box-border content-stretch flex flex-col gap-4 md:gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
              <div className='box-border content-stretch flex flex-col md:flex-row gap-2 md:gap-4 items-start justify-start p-0 relative shrink-0 w-full'>
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium min-w-[120px]">
                  <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                    おすすめ通知
                  </p>
                </div>
                <div className='box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
                  <div className='[flex-flow:wrap] box-border content-center flex flex-col md:flex-row gap-4 items-start md:items-center justify-start p-0 relative shrink-0 w-full'>
                    <div className='flex items-center gap-2'>
                      <Radio
                        id='recommendation-notification-receive'
                        name='recommendationNotification'
                        value='receive'
                        checked={
                          notifications.recommendationNotification === 'receive'
                        }
                        onChange={handleNotificationChange(
                          'recommendationNotification'
                        )}
                      />
                      <label
                        htmlFor='recommendation-notification-receive'
                        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer"
                      >
                        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                          受け取る
                        </p>
                      </label>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Radio
                        id='recommendation-notification-not-receive'
                        name='recommendationNotification'
                        value='not-receive'
                        checked={
                          notifications.recommendationNotification ===
                          'not-receive'
                        }
                        onChange={handleNotificationChange(
                          'recommendationNotification'
                        )}
                      />
                      <label
                        htmlFor='recommendation-notification-not-receive'
                        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left text-nowrap tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer"
                      >
                        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                          受け取らない
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='[flex-flow:wrap] box-border content-start flex flex-col md:flex-row gap-4 items-stretch md:items-start justify-center p-0 relative shrink-0 w-full md:w-auto'>
          <Button
            variant='green-outline'
            size='figma-outline'
            className='min-w-40 w-full md:w-auto py-[18px]'
            onClick={handleBack}
            disabled={isPending}
          >
            保存せず戻る
          </Button>
          <Button
            variant='green-gradient'
            size='figma-square'
            className='min-w-40 w-full md:w-auto rounded-full py-[18px]'
            onClick={handleSaveClick}
            disabled={!hasChanges || isPending}
          >
            {isPending ? '保存中...' : '変更を保存'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
