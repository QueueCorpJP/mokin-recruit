import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// TODO: 本番では認証ミドルウェアで候補者IDを取得する
async function getCandidateIdFromRequest(
  request: NextRequest
): Promise<string | null> {
  // 仮実装: メールアドレスで候補者IDを取得
  const email = 'sekiguchishunya0619@gmail.com';
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('candidates')
    .select('id')
    .eq('email', email)
    .single();
  if (error || !data) return null;
  return data.id;
}

export async function GET(request: NextRequest) {
  const candidateId = await getCandidateIdFromRequest(request);
  if (!candidateId) {
    return NextResponse.json({ error: '認証情報が無効です' }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: tasks, error } = await supabase
    .from('candidate_tasks')
    .select('*')
    .eq('candidate_id', candidateId)
    .eq('status', 'ACTIVE')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ tasks });
}
