import { getCachedCandidateUser } from '@/lib/auth/server';
import { CandidateDashboardClient } from './CandidateDashboardClient';
// 追加: サーバーサイドで求人を取得するためのリポジトリとSupabaseクライアント
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { getRooms } from '@/lib/rooms';


// やることリスト取得用の関数（candidate/taskと同じロジック）
async function getTaskData(candidateId: string) {
  try {
    const rooms = await getRooms(candidateId, 'candidate');
    const unreadRooms = rooms.filter((room: any) => room.unreadCount && room.unreadCount > 0);
    
    const tasks = [];
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

// おすすめ求人取得用の関数（search/settingと同様のロジック）
async function getRecommendedJobs(candidateId: string) {
  try {
    const candidateRepo = new CandidateRepository();
    const candidate = await candidateRepo.findById(candidateId);

    if (!candidate) return [];

    const client = getSupabaseAdminClient();
    
    // JOINで企業情報も一緒に取得
    let query = client
      .from('job_postings')
      .select(`
        id,
        title,
        salary_min,
        salary_max,
        salary_note,
        work_location,
        job_type,
        industry,
        appeal_points,
        created_at,
        image_urls,
        company_account_id,
        company_accounts (
          id,
          company_name
        )
      `)
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members']);

    // 候補者の希望条件でフィルタリング
    if (candidate.desired_job_types && candidate.desired_job_types.length > 0) {
      const jobTypeConditions = candidate.desired_job_types.map(jobType => `job_type.cs.{${jobType}}`).join(',');
      query = query.or(jobTypeConditions);
    }
    
    if (candidate.desired_locations && candidate.desired_locations.length > 0) {
      const locationConditions = candidate.desired_locations.map(location => `work_location.cs.{${location}}`).join(',');
      query = query.or(locationConditions);
    }
    
    if (candidate.desired_industries && candidate.desired_industries.length > 0) {
      const industryConditions = candidate.desired_industries.map(industry => `industry.cs.{${industry}}`).join(',');
      query = query.or(industryConditions);
    }

    const { data: jobs, error } = await query
      .order('created_at', { ascending: false })
      .limit(10);

    if (error || !jobs) {
      console.error('Failed to get recommended jobs:', error);
      return [];
    }

    // search/settingと同様のデータ変換
    const transformedJobs = jobs.map((job: any, index: number) => {
      const companyName = job.company_accounts?.company_name || `企業名未設定 #${index + 1}`;
      
      return {
        id: job.id,
        title: job.title || `求人タイトル未設定 #${index + 1}`,
        company_name: companyName,
        image_urls: job.image_urls || [],
        appeal_points: Array.isArray(job.appeal_points) && job.appeal_points.length > 0 
          ? job.appeal_points.slice(0, 3) 
          : ['アピールポイントなし'],
        work_location: Array.isArray(job.work_location) ? job.work_location : [job.work_location || '勤務地未設定'],
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        job_type: Array.isArray(job.job_type) ? job.job_type : [job.job_type].filter(Boolean),
        industry: job.industry,
        created_at: job.created_at
      };
    });

    return transformedJobs;
  } catch (error) {
    console.error('Error in getRecommendedJobs:', error);
    return [];
  }
}

export default async function CandidateDashboard() {
  let user = await getCachedCandidateUser();

  // サインアップ完了後のユーザーの場合、signup_user_idクッキーをチェックして自動ログイン
  if (!user) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const signupUserId = cookieStore.get('signup_user_id')?.value;
    
    if (signupUserId) {
      // サインアップ完了直後のユーザーの場合、自動でログイン状態にする処理
      const { createServerClient } = await import('@supabase/ssr');
      
      // 管理者権限でユーザー情報を取得
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
        // ユーザー情報が取得できた場合、認証済みとして扱う
        user = {
          id: userData.user.id,
          email: userData.user.email || '',
          userType: 'candidate' as const,
          name: userData.user.user_metadata?.full_name || userData.user.user_metadata?.name,
          emailConfirmed: userData.user.email_confirmed_at != null,
          lastSignIn: userData.user.last_sign_in_at || undefined,
          user_metadata: userData.user.user_metadata,
        };
        
        // signup_user_id クッキーを削除（もう不要）
        cookieStore.delete('signup_user_id');
      }
    }
  }

  if (!user) {
    // レイアウトで既に認証済みのはずなので、ここに到達することは基本的にない
    throw new Error('Authentication required');
  }

  // サーバーサイドで全データを取得
  const [tasks, messages, jobs] = await Promise.all([
    getTaskData(user.id),
    getRecentMessages(user.id),
    getRecommendedJobs(user.id)
  ]);

  return <CandidateDashboardClient user={user} tasks={tasks} messages={messages} jobs={jobs} />;
}

export const dynamic = 'force-dynamic';
