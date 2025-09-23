import { redirect } from 'next/navigation';
import AdminDashboardClient from './AdminDashboardClient';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireAdminAuth } from '@/lib/auth/server';

export default async function AdminPage() {
  // 管理者認証チェック
  const adminUser = await requireAdminAuth();
  if (!adminUser) {
    redirect('/admin/login');
  }

  const supabase = getSupabaseAdminClient();

  // 求人: 承認待ち（PENDING_APPROVAL）の件数
  const { count: jobPendingCount = 0 } = await supabase
    .from('job_postings')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'PENDING_APPROVAL');

  // メッセージ: NGワードを含み approval_status = '未対応' が存在するルーム件数
  // 既存の pending ロジックは rooms + messages + ng_keywords を突合しているため
  // ここでは簡易に messages 側で NG と未対応を満たすメッセージ数をカウントし、
  // ルーム単位に集約して件数を推定する。
  // 注意: 厳密なルーム単位集計が必要なら専用のSQL/RPCに差し替え。
  const { data: ngKeywordsData } = await supabase
    .from('ng_keywords')
    .select('keyword')
    .eq('is_active', true);

  let pendingMessageCount = 0;
  if (ngKeywordsData && ngKeywordsData.length > 0) {
    const keywords = ngKeywordsData
      .map(k => k.keyword)
      .filter(Boolean) as string[];
    // NGワードを含む未対応メッセージの room_id をユニークに集約
    const { data: msgs } = await supabase
      .from('messages')
      .select('room_id, content, subject, approval_status')
      .eq('approval_status', '未対応');

    const containsNG = (text: string | null | undefined): boolean => {
      if (!text) return false;
      const lower = text.toLowerCase();
      return keywords.some(kw =>
        lower.includes(String(kw || '').toLowerCase())
      );
    };

    const roomSet = new Set<string>();
    (msgs || []).forEach(m => {
      if (containsNG(m.content) || containsNG(m.subject)) {
        if (m.room_id) roomSet.add(m.room_id);
      }
    });
    pendingMessageCount = roomSet.size;
  }

  // レジュメ: サインアップ時にアップロードされ、未確認の件数
  // database.md には専用のフラグは無いので、ここでは「アップロード済みで、候補者ステータスが temporary（仮）または official 前段階」を未確認とみなす代替案。
  // 最低限: 履歴書がアップロードされている行数をカウント（確認フラグ未実装のため）
  const { count: resumeUploadedCount = 0 } = await supabase
    .from('candidates')
    .select('*', { count: 'exact', head: true })
    .not('resume_url', 'is', null);

  return (
    <AdminDashboardClient
      jobPendingCount={jobPendingCount || 0}
      pendingMessageCount={pendingMessageCount || 0}
      resumePendingCount={resumeUploadedCount || 0}
    />
  );
}
