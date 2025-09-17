'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  upsertByCandidateId,
  getSingleByCandidateId,
} from '@/app/candidate/setting/_shared/server/settings-utils';
import type { NotificationSettings } from '@/types';

export async function saveNotificationSettings(formData: FormData) {
  const scoutNotification = formData.get('scoutNotification') as string;
  const messageNotification = formData.get('messageNotification') as string;
  const recommendationNotification = formData.get(
    'recommendationNotification'
  ) as string;

  if (
    !scoutNotification ||
    !messageNotification ||
    !recommendationNotification
  ) {
    throw new Error('すべての通知設定を選択してください');
  }

  const settings: NotificationSettings = {
    scout_notification:
      scoutNotification as NotificationSettings['scout_notification'],
    message_notification:
      messageNotification as NotificationSettings['message_notification'],
    recommendation_notification:
      recommendationNotification as NotificationSettings['recommendation_notification'],
  };

  const result = await upsertByCandidateId('notification_settings', settings);
  if (!result.success) {
    throw new Error((result as any).error || '更新に失敗しました');
  }

  revalidatePath('/candidate/setting/notification');
  redirect('/candidate/setting/notification/complete');
}

export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  return getSingleByCandidateId<NotificationSettings>(
    'notification_settings',
    'scout_notification, message_notification, recommendation_notification'
  );
}
