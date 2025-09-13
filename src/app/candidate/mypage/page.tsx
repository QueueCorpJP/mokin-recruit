import { getCachedCandidateUser } from '@/lib/auth/server';
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { getRooms } from '@/lib/rooms';
import { redirect } from 'next/navigation';
import { getCandidateNotices } from './actions';
import { CandidateDashboardClient } from './CandidateDashboardClient';

// やることリスト取得用の関数（candidate/taskと同じロジック）
async function getTaskData(candidateId: string) {
  try {
    const rooms = await getRooms(candidateId, 'candidate');
    const unreadRooms = rooms.filter(
      (room: { unreadCount?: number }) =>
        room.unreadCount && room.unreadCount > 0
    );

    const tasks: unknown[] = [];
    if (unreadRooms.length > 0) {
      const firstUnreadRoom = unreadRooms[0];
      if (firstUnreadRoom) {
        const messageTime = firstUnreadRoom.lastMessageTime
          ? new Date(firstUnreadRoom.lastMessageTime)
          : new Date();

        const seventyTwoHoursInMs = 72 * 60 * 60 * 1000;
        const isWithin72Hours =
          Date.now() - messageTime.getTime() < seventyTwoHoursInMs;

        if (isWithin72Hours) {
          tasks.push({
            id: `new-message-${firstUnreadRoom.id}`,
            title: '新着メッセージがあります',
            description: `${firstUnreadRoom.companyName}から新しいメッセージが届いています`,
          });
        } else {
          tasks.push({
            id: `unread-message-${firstUnreadRoom.id}`,
            title: '未読メッセージがあります',
            description: `${firstUnreadRoom.companyName}からのメッセージを確認してください`,
          });
        }
      }
    }

    return tasks;
  } catch {
    return [];
  }
}

// 新着メッセージ取得用の関数（candidate/messageと同じロジック）
async function getRecentMessages(candidateId: string) {
  try {
    const rooms = await getRooms(candidateId, 'candidate');
    const unreadRooms = rooms.filter(
      (room: { unreadCount?: number }) =>
        room.unreadCount && room.unreadCount > 0
    );

    return unreadRooms
      .slice(0, 3)
      .map(
        (room: {
          id: string;
          companyName: string;
          lastMessage?: string;
          lastMessageTime?: string;
        }) => ({
          id: room.id,
          sender: room.companyName,
          body: room.lastMessage || '新しいメッセージがあります',
          date: room.lastMessageTime || new Date().toISOString(),
        })
      );
  } catch {
    return [];
  }
}

// おすすめ求人取得用の関数（最適化版）
async function getRecommendedJobsInternal(candidateId: string) {
  try {
    const candidateRepo = new CandidateRepository();
    const candidate = await candidateRepo.findById(candidateId);

    if (!candidate) {
      return [];
    }

    const client = await getSupabaseServerClient();

    // 必要最小限のフィールドのみ取得
    let query = client
      .from('job_postings')
      .select(
        `
        id,
        title,
        salary_min,
        salary_max,
        work_location,
        appeal_points,
        image_urls,
        company_accounts!inner (
          company_name
        )
      `
      )
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members']);

    // 候補者の希望条件でフィルタリング（最適化）
    const conditions = [];
    if (candidate.desired_job_types?.length > 0) {
      conditions.push(
        candidate.desired_job_types
          .map((jobType: string) => `job_type.cs.{${jobType}}`)
          .join(',')
      );
    }

    if (candidate.desired_locations?.length > 0) {
      conditions.push(
        candidate.desired_locations
          .map((location: string) => `work_location.cs.{${location}}`)
          .join(',')
      );
    }

    if (candidate.desired_industries?.length > 0) {
      conditions.push(
        candidate.desired_industries
          .map((industry: string) => `industry.cs.{${industry}}`)
          .join(',')
      );
    }

    if (conditions.length > 0) {
      query = query.or(conditions.join(','));
    }

    const { data: jobs, error } = await query
      .order('created_at', { ascending: false })
      .limit(5); // 5件に減らして初期ロードを高速化

    if (error || !jobs) {
      return [];
    }

    // 最適化されたデータ変換
    const transformedJobs = jobs.map(
      (job: {
        id: string;
        title?: string;
        company_accounts?: { company_name?: string };
        image_urls?: string[];
        appeal_points?: string[];
        work_location?: string | string[];
        salary_min?: number;
        salary_max?: number;
      }) => ({
        id: job.id,
        title: job.title || '求人タイトル未設定',
        company_name: job.company_accounts?.company_name || '企業名未設定',
        image_urls: job.image_urls?.slice(0, 1) || [], // 最初の画像のみ取得して転送量削減
        appeal_points: job.appeal_points?.slice(0, 3) || [],
        work_location: Array.isArray(job.work_location)
          ? job.work_location
          : [job.work_location || '勤務地未設定'],
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        starred: false,
      })
    );

    return transformedJobs;
  } catch {
    return [];
  }
}

export default async function CandidateDashboard() {
  const user = await getCachedCandidateUser();

  if (!user) {
    redirect('/candidate/auth/login');
  }

  // サーバーサイドで全データを取得（最適化版）
  const [tasks, messages, jobs, notices] = await Promise.all([
    getTaskData(user.id),
    getRecentMessages(user.id),
    getRecommendedJobsInternal(user.id), // キャッシュを使わず直接呼び出し
    getCandidateNotices(),
  ]);

  return (
    <CandidateDashboardClient
      user={user as { id: string; name?: string; email: string }}
      tasks={tasks}
      messages={messages}
      jobs={jobs}
      notices={notices.notices}
    />
  );
}

export const dynamic = 'force-dynamic';
