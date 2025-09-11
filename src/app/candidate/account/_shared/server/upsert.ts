'use server';

import type { SupabaseClient } from '@supabase/supabase-js';

interface UpsertByKeyParams<T extends Record<string, unknown>> {
  client: SupabaseClient<any, 'public', any>;
  table: string;
  key: string; // e.g. 'candidate_id'
  value: string; // key value
  update: T; // update payload
  insert: T & Record<string, unknown>; // insert payload (should include key)
}

/**
 * Perform an update by key; if zero rows were affected, insert instead.
 * Returns { error: PostgrestError | null, updated: boolean }
 */
export async function updateOrInsertByKey<T extends Record<string, unknown>>(
  params: UpsertByKeyParams<T>
): Promise<{ error: any; updated: boolean }> {
  const { client, table, key, value, update, insert } = params;

  const { data: updateData, error: updateError } = await client
    .from(table)
    .update(update)
    .eq(key, value)
    .select();

  if (updateError) {
    return { error: updateError, updated: false };
  }

  if (!updateData || updateData.length === 0) {
    const { error: insertError } = await client
      .from(table)
      .insert(insert as any);
    if (insertError) {
      return { error: insertError, updated: false };
    }
    return { error: null, updated: false };
  }

  return { error: null, updated: true };
}
