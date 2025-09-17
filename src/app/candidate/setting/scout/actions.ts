'use server';

import { revalidatePath } from 'next/cache';
import {
  upsertByCandidateId,
  getSingleByCandidateId,
} from '@/app/candidate/setting/_shared/server/settings-utils';
import type { ScoutSettings } from '@/types';

export async function saveScoutSettings(formData: FormData) {
  const scoutStatus = formData.get('scoutStatus') as string;

  if (!scoutStatus) {
    throw new Error('スカウトステータスを選択してください');
  }

  const settings: ScoutSettings = {
    scout_status: scoutStatus as ScoutSettings['scout_status'],
  };

  const result = await upsertByCandidateId('scout_settings', settings);
  if (!result.success) {
    throw new Error((result as any).error || '更新に失敗しました');
  }

  revalidatePath('/candidate/setting/scout');
}

export async function getScoutSettings(): Promise<ScoutSettings | null> {
  return getSingleByCandidateId<ScoutSettings>(
    'scout_settings',
    'scout_status'
  );
}
