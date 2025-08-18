'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const radioButtonCheckedIcon = "http://localhost:3845/assets/ef86984da22dab6a3dfc16094acebf72af43f90c.svg";

interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

function RadioButton({ id, name, value, checked, onChange, children }: RadioButtonProps) {
  return (
    <div className="box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0">
      <div className="relative shrink-0 size-5" onClick={() => onChange(value)}>
        {checked ? (
          <div className="absolute inset-[-2.5%]">
            <img alt="" className="block max-w-none size-full" src={radioButtonCheckedIcon} />
          </div>
        ) : (
          <div className="relative rounded-[10px] shrink-0 size-5">
            <div
              aria-hidden="true"
              className="absolute border border-[#dcdcdc] border-solid inset-[-0.5px] pointer-events-none rounded-[10.5px]"
            />
          </div>
        )}
      </div>
      <label
        htmlFor={id}
        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px] font-medium cursor-pointer"
        onClick={() => onChange(value)}
      >
        <p className="adjustLetterSpacing block leading-[2] whitespace-pre">{children}</p>
      </label>
    </div>
  );
}

interface NotificationSetting {
  scoutNotification: string;
  messageNotification: string;
  recommendationNotification: string;
}

export default function NotificationSettingPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationSetting>({
    scoutNotification: 'receive',
    messageNotification: 'receive',
    recommendationNotification: 'receive'
  });
  const [originalNotifications, setOriginalNotifications] = useState<NotificationSetting>({
    scoutNotification: 'receive',
    messageNotification: 'receive',
    recommendationNotification: 'receive'
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchCurrentSettings = async () => {
      try {
     
        
        const defaultSettings = {
          scoutNotification: 'receive',
          messageNotification: 'receive',
          recommendationNotification: 'receive'
        };
        setOriginalNotifications(defaultSettings);
      } catch (error) {
        console.error('-�n֗k1WW~W_:', error);
      }
    };

    fetchCurrentSettings();
  }, []);

  useEffect(() => {
    const hasChanged = Object.keys(notifications).some(
      key => notifications[key as keyof NotificationSetting] !== originalNotifications[key as keyof NotificationSetting]
    );
    setHasChanges(hasChanged);
  }, [notifications, originalNotifications]);

  const handleNotificationChange = (type: keyof NotificationSetting, value: string) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleSave = async () => {
    try {
    
      router.push('/candidate/setting/notification/complete');
    } catch (error) {
      console.error('-�n�Xk1WW~W_:', error);
    }
  };

  const handleBack = () => {
    router.push('/candidate/setting');
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div
        className="bg-[#f9f9f9] box-border content-stretch flex flex-col gap-10 items-center justify-start pb-20 pt-10 px-4 md:px-20 relative w-full"
      >
        <div
          className="bg-[#ffffff] box-border content-stretch flex flex-col gap-2 items-start justify-start p-[40px] relative rounded-[10px] shrink-0 w-full max-w-4xl"
        >
          <div
            className="box-border content-stretch flex flex-col gap-2 items-end justify-start p-0 relative shrink-0"
          >
            <div
              className="box-border content-stretch flex flex-col gap-2 items-end justify-start p-0 relative shrink-0"
            >
              <div
                className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
              >
                <div
                  className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px] font-medium"
                >
                  <p className="adjustLetterSpacing block leading-[2] whitespace-pre">スカウト通知</p>
                </div>
                <div
                  className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0"
                >
                  <div
                    className="[flex-flow:wrap] box-border content-center flex gap-4 items-center justify-start p-0 relative shrink-0 w-full"
                  >
                    <RadioButton
                      id="scout-notification-receive"
                      name="scoutNotification"
                      value="receive"
                      checked={notifications.scoutNotification === 'receive'}
                      onChange={(value) => handleNotificationChange('scoutNotification', value)}
                    >
                      受け取る
                    </RadioButton>
                    <RadioButton
                      id="scout-notification-not-receive"
                      name="scoutNotification"
                      value="not-receive"
                      checked={notifications.scoutNotification === 'not-receive'}
                      onChange={(value) => handleNotificationChange('scoutNotification', value)}
                    >
                      受け取らない
                    </RadioButton>
                  </div>
                </div>
              </div>
            </div>

            {/* メッセージ通知 */}
            <div
              className="box-border content-stretch flex flex-col gap-2 items-end justify-start p-0 relative shrink-0"
            >
              <div
                className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
              >
                <div
                  className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px] font-medium"
                >
                  <p className="adjustLetterSpacing block leading-[2] whitespace-pre">メッセージ通知</p>
                </div>
                <div
                  className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0"
                >
                  <div
                    className="[flex-flow:wrap] box-border content-center flex gap-4 items-center justify-start p-0 relative shrink-0 w-full"
                  >
                    <RadioButton
                      id="message-notification-receive"
                      name="messageNotification"
                      value="receive"
                      checked={notifications.messageNotification === 'receive'}
                      onChange={(value) => handleNotificationChange('messageNotification', value)}
                    >
                      受け取る
                    </RadioButton>
                    <RadioButton
                      id="message-notification-not-receive"
                      name="messageNotification"
                      value="not-receive"
                      checked={notifications.messageNotification === 'not-receive'}
                      onChange={(value) => handleNotificationChange('messageNotification', value)}
                    >
                      受け取らない
                    </RadioButton>
                  </div>
                </div>
              </div>
            </div>

            {/* おすすめ通知 */}
            <div
              className="box-border content-stretch flex flex-col gap-2 items-end justify-start p-0 relative shrink-0"
            >
              <div
                className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
              >
                <div
                  className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px] font-medium"
                >
                  <p className="adjustLetterSpacing block leading-[2] whitespace-pre">おすすめ通知</p>
                </div>
                <div
                  className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0"
                >
                  <div
                    className="[flex-flow:wrap] box-border content-center flex gap-4 items-center justify-start p-0 relative shrink-0 w-full"
                  >
                    <RadioButton
                      id="recommendation-notification-receive"
                      name="recommendationNotification"
                      value="receive"
                      checked={notifications.recommendationNotification === 'receive'}
                      onChange={(value) => handleNotificationChange('recommendationNotification', value)}
                    >
                      受け取る
                    </RadioButton>
                    <RadioButton
                      id="recommendation-notification-not-receive"
                      name="recommendationNotification"
                      value="not-receive"
                      checked={notifications.recommendationNotification === 'not-receive'}
                      onChange={(value) => handleNotificationChange('recommendationNotification', value)}
                    >
                      受け取らない
                    </RadioButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="[flex-flow:wrap] box-border content-start flex gap-4 items-start justify-center p-0 relative shrink-0"
        >
          <Button
            variant="green-outline"
            size="figma-outline"
            className="min-w-40"
            onClick={handleBack}
          >
            戻る
          </Button>
          <Button
            variant="green-gradient"
            size="figma-square"
            className="min-w-40"
            onClick={handleSave}
            disabled={!hasChanges}
          >
            変更を保存  
          </Button>
        </div>
      </div>
    </div>
  );
}