import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// TODO: 本番では認証ミドルウェアで候補者IDを取得する
async function getCandidateIdFromRequest(
  request: NextRequest
): Promise<string | null> {
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
  // まず候補者のroom_id一覧を取得
  const { data: rooms, error: roomError } = await supabase
    .from('rooms')
    .select('id, company_group_id')
    .eq('candidate_id', candidateId);
  if (roomError || !rooms || rooms.length === 0) {
    return NextResponse.json({ messages: [] });
  }
  const roomIds = rooms.map((r: any) => r.id);
  const companyGroupMap = Object.fromEntries(
    rooms.map((r: any) => [r.id, r.company_group_id])
  );

  // 企業からの新着メッセージ3件
  const { data: messages, error } = await supabase
    .from('messages')
    .select('id, content, sent_at, room_id')
    .eq('sender_type', 'COMPANY_USER')
    .in('room_id', roomIds)
    .order('sent_at', { ascending: false })
    .limit(3);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // company_group_idからcompany_accountsを取得
  const companyGroupIds = Array.from(
    new Set(rooms.map((r: any) => r.company_group_id).filter(Boolean))
  );
  let companyNames: Record<string, string> = {};
  if (companyGroupIds.length > 0) {
    const { data: groups, error: groupError } = await supabase
      .from('company_groups')
      .select('id, company_account_id, company_accounts (id, company_name)')
      .in('id', companyGroupIds);
    if (!groupError && groups) {
      for (const g of groups) {
        const companyAccount = Array.isArray(g.company_accounts) 
          ? g.company_accounts[0] 
          : g.company_accounts;
        if (companyAccount?.company_name) {
          companyNames[g.id] = companyAccount.company_name;
        }
      }
    }
  }

  // 整形
  const formatted = (messages || []).map((msg: any) => ({
    id: msg.id,
    sender: companyNames[companyGroupMap[msg.room_id]] ?? '企業',
    body: msg.content,
    date: msg.sent_at,
  }));

  return NextResponse.json({ messages: formatted });
}
