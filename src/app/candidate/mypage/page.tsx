import { getCachedCandidateUser } from '@/lib/auth/server';
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { getRooms } from '@/lib/rooms';
import { redirect } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import { unstable_cache } from 'next/cache';

// Client component を dynamic import で遅延読み込み
const CandidateDashboardClient = dynamicImport(
  () => import('./CandidateDashboardClient').then(mod => mod.CandidateDashboardClient),
  { 
    ssr: true,
    loading: () => <div style={{ padding: '40px', textAlign: 'center' }}>読み込み中...</div>
  }
);


// やることリスト取得用の関数（candidate/taskと同じロジック）
async function getTaskData(candidateId: string) {
  try {
    const rooms = await getRooms(candidateId, 'candidate');
    const unreadRooms = rooms.filter((room: any) => room.unreadCount && room.unreadCount > 0);
    
    const tasks: any[] = [];
    if (unreadRooms.length > 0) {
      const firstUnreadRoom = unreadRooms[0];
      const messageTime = firstUnreadRoom.lastMessageTime 
        ? new Date(firstUnreadRoom.lastMessageTime) 
        : new Date();
      
      const seventyTwoHoursInMs = 72 * 60 * 60 * 1000;
      const isWithin72Hours = Date.now() - messageTime.getTime() < seventyTwoHoursInMs;
      
      if (isWithin72Hours) {
        tasks.push({
          id: `new-message-${firstUnreadRoom.id}`,
          title: '新着メッセージがあります',
          description: `${firstUnreadRoom.companyName}から新しいメッセージが届いています`
        });
      } else {
        tasks.push({
          id: `unread-message-${firstUnreadRoom.id}`,
          title: '未読メッセージがあります', 
          description: `${firstUnreadRoom.companyName}からのメッセージを確認してください`
        });
      }
    }
    
    return tasks;
  } catch (error) {
    console.error('Failed to fetch task data:', error);
    return [];
  }
}

// 新着メッセージ取得用の関数（candidate/messageと同じロジック）
async function getRecentMessages(candidateId: string) {
  try {
    const rooms = await getRooms(candidateId, 'candidate');
    const unreadRooms = rooms.filter((room: any) => room.unreadCount && room.unreadCount > 0);
    
    return unreadRooms.slice(0, 3).map((room: any) => ({
      id: room.id,
      sender: room.companyName,
      body: room.lastMessage || '新しいメッセージがあります',
      date: room.lastMessageTime || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
}

// キャッシュ付きおすすめ求人取得
const getCachedRecommendedJobs = unstable_cache(
  async (candidateId: string) => getRecommendedJobsInternal(candidateId),
  ['recommended-jobs'],
  { revalidate: 300, tags: ['jobs'] } // 5分間キャッシュ
);

// おすすめ求人取得用の関数（最適化版）
async function getRecommendedJobsInternal(candidateId: string) {
  try {
    const candidateRepo = new CandidateRepository();
    const candidate = await candidateRepo.findById(candidateId);

    if (!candidate) return [];

    const client = getSupabaseAdminClient();
    
    // 必要最小限のフィールドのみ取得
    let query: any = client
      .from('job_postings')
      .select(`
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
      `)
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members']);

    // 候補者の希望条件でフィルタリング（最適化）
    const conditions = [];
    if (candidate.desired_job_types?.length > 0) {
      conditions.push(candidate.desired_job_types.map((jobType: string) => `job_type.cs.{${jobType}}`).join(','));
    }
    
    if (candidate.desired_locations?.length > 0) {
      conditions.push(candidate.desired_locations.map((location: string) => `work_location.cs.{${location}}`).join(','));
    }
    
    if (candidate.desired_industries?.length > 0) {
      conditions.push(candidate.desired_industries.map((industry: string) => `industry.cs.{${industry}}`).join(','));
    }

    if (conditions.length > 0) {
      query = query.or(conditions.join(','));
    }

    const { data: jobs, error } = await query
      .order('created_at', { ascending: false })
      .limit(5); // 5件に減らして初期ロードを高速化

    if (error || !jobs) {
      console.error('Failed to get recommended jobs:', error);
      return [];
    }

    // 最適化されたデータ変換
    const transformedJobs = jobs.map((job: any) => ({
      id: job.id,
      title: job.title || '求人タイトル未設定',
      company_name: job.company_accounts?.company_name || '企業名未設定',
      image_urls: job.image_urls?.slice(0, 1) || [], // 最初の画像のみ取得して転送量削減
      appeal_points: job.appeal_points?.slice(0, 3) || [],
      work_location: Array.isArray(job.work_location) ? job.work_location : [job.work_location || '勤務地未設定'],
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      starred: false
    }));

    return transformedJobs;
  } catch (error) {
    console.error('Error in getRecommendedJobs:', error);
    return [];
  }
}

export default async function CandidateDashboard() {
  let user = await getCachedCandidateUser();

  // サインアップ完了直後ユーザーの場合、signup_user_idクッキーをチェックして自動ログイン
  if (!user) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const signupUserId = cookieStore.get('signup_user_id')?.value;
    
    if (signupUserId) {
      const { createServerClient } = await import('@supabase/ssr');
      
      const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            getAll() { return []; },
            setAll() {},
          },
        }
      );

      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(signupUserId);
      
      if (!userError && userData.user) {
        user = {
          id: userData.user.id,
          email: userData.user.email || '',
          userType: 'candidate' as const,
          name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name,
          emailConfirmed: userData.user.email_confirmed_at != null,
          lastSignIn: userData.user.last_sign_in_at || undefined,
          user_metadata: userData.user.user_metadata,
        } as any;
        
        cookieStore.delete('signup_user_id');
      }
    }
  }

  if (!user) {
    redirect('/candidate/auth/login');
  }

  // サーバーサイドで全データを取得（最適化版）
  const [tasks, messages, jobs] = await Promise.all([
    getTaskData(user.id),
    getRecentMessages(user.id),
    getCachedRecommendedJobs(user.id)
  ]);

  return <CandidateDashboardClient user={user as any} tasks={tasks} messages={messages} jobs={jobs} />;
}

export const dynamic = 'force-dynamic';