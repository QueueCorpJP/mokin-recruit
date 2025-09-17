'use client';

import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Radio } from '@/components/ui/radio';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { saveScoutSettings, getScoutSettings } from './actions';
import { useCandidateAuth } from '@/hooks/useClientAuth';

export default function ScoutSettingPage() {
  const { isAuthenticated, candidateUser, loading } = useCandidateAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [scoutStatus, setScoutStatus] = useState<string>('receive');
  const [hasChanges, setHasChanges] = useState(false);
  const [originalStatus, setOriginalStatus] = useState<string>('receive');

  // 認証チェック
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !candidateUser) {
      router.push('/candidate/auth/login');
    }
  }, [isAuthenticated, candidateUser, loading, router]);

  useEffect(() => {
    const fetchCurrentSettings = async () => {
      try {
        const settings = await getScoutSettings();
        if (settings) {
          setScoutStatus(settings.scout_status);
          setOriginalStatus(settings.scout_status);
        }
      } catch (error) {
        console.error('設定の取得に失敗しました:', error);
      }
    };

    fetchCurrentSettings();
  }, []);

  useEffect(() => {
    setHasChanges(scoutStatus !== originalStatus);
  }, [scoutStatus, originalStatus]);

  const handleScoutStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScoutStatus(e.target.value);
  };

  const handleSave = () => {
    setError(null);
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('scoutStatus', scoutStatus);
        await saveScoutSettings(formData);
        // Only redirect on successful save
        router.push('/candidate/setting/scout/complete');
      } catch (err) {
        setError(err instanceof Error ? err.message : '保存に失敗しました');
      }
    });
  };

  const handleBack = () => {
    router.push('/candidate/setting');
  };

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
    <div className='min-h-screen bg-[#f9f9f9] overflow-x-hidden'>
      <SettingsHeader
        breadcrumbs={[
          { label: '各種設定', href: '/candidate/setting' },
          { label: 'スカウトステータス変更' },
        ]}
        title='スカウトステータス変更'
        icon={
          <Image src='/images/setting.svg' alt='設定' width={32} height={32} />
        }
      />
      <div className='bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-[80px] relative w-full'>
        <div className='bg-[#ffffff] box-border content-stretch flex flex-col gap-6 items-start justify-start p-4 md:py-[40px] md:px-[40px] relative rounded-[10px] shrink-0 w-full'>
          {error && (
            <div className='w-full p-4 mb-4 text-red-600 bg-red-50 border border-red-200 rounded'>
              {error}
            </div>
          )}
          <div className='box-border content-stretch flex flex-col gap-4 md:gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
            <div className='box-border content-stretch flex flex-col md:flex-row gap-2 md:gap-4 items-start justify-start p-0 relative shrink-0 w-full'>
              <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left tracking-[1.2px] md:tracking-[1.6px] font-medium min-w-[120px] md:min-w-[140px]">
                <p className='adjustLetterSpacing block leading-[2] font-bold'>
                  スカウトステータス
                </p>
              </div>
              <div className='box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
                <div className='[flex-flow:wrap] box-border content-center flex flex-col md:flex-row gap-4 items-start md:items-center justify-start p-0 relative shrink-0 w-full'>
                  <div className='flex items-center gap-2'>
                    <Radio
                      id='scout-receive'
                      name='scoutStatus'
                      value='receive'
                      checked={scoutStatus === 'receive'}
                      onChange={handleScoutStatusChange}
                    />
                    <label
                      htmlFor='scout-receive'
                      className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer"
                    >
                      <p className='adjustLetterSpacing block leading-[2]'>
                        スカウトを受け取る
                      </p>
                    </label>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Radio
                      id='scout-not-receive'
                      name='scoutStatus'
                      value='not-receive'
                      checked={scoutStatus === 'not-receive'}
                      onChange={handleScoutStatusChange}
                    />
                    <label
                      htmlFor='scout-not-receive'
                      className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left tracking-[1.2px] md:tracking-[1.6px] font-medium cursor-pointer"
                    >
                      <p className='adjustLetterSpacing block leading-[2]'>
                        スカウトを受け取らない
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[2] w-full not-italic relative shrink-0 text-[#323232] text-sm md:text-[16px] text-left tracking-[1.2px] md:tracking-[1.6px] font-medium">
            <p className='block mb-0'>
              「受け取らない」に設定すると、企業からの新規スカウトが停止されます。転職活動を一次休止したいときなどにご活用ください。
            </p>
            <p className='block'>設定はいつでも変更可能です。</p>
          </div>
        </div>
        <div className='[flex-flow:wrap] box-border content-start flex flex-col md:flex-row gap-4 items-stretch md:items-start justify-center p-0 relative shrink-0 w-full md:w-auto'>
          <Button
            variant='green-outline'
            size='figma-outline'
            className='min-w-40 w-full md:w-auto'
            onClick={handleBack}
            disabled={isPending}
          >
            保存せず戻る
          </Button>
          <Button
            variant='green-gradient'
            size='figma-default'
            className='min-w-40 w-full md:w-auto'
            onClick={handleSave}
            disabled={!hasChanges || isPending}
          >
            {isPending ? '保存中...' : '変更を保存'}
          </Button>
        </div>
      </div>
    </div>
  );
}
