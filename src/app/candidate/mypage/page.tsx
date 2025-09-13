import { getCachedCandidateUser } from '@/lib/auth/server';
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { getRooms } from '@/lib/rooms';
import { redirect } from 'next/navigation';
import dynamicImport from 'next/dynamic';
import { getCandidateNotices } from './actions';

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
      if (firstUnreadRoom) {
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
    }
    
    return tasks;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Failed to fetch task data:', error);
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
    if (process.env.NODE_ENV === 'development') console.error('Failed to fetch messages:', error);
    return [];
  }
}


// おすすめ求人取得用の関数（最適化版）
async function getRecommendedJobsInternal(candidateId: string) {
  if (process.env.NODE_ENV === 'development') console.log('🎯 [RECOMMENDED JOBS] Starting getRecommendedJobsInternal for candidate:', candidateId);
  
  try {
    const candidateRepo = new CandidateRepository();
    const candidate = await candidateRepo.findById(candidateId);

    if (!candidate) {
      if (process.env.NODE_ENV === 'development') console.log('❌ [RECOMMENDED JOBS] Candidate not found:', candidateId);
      return [];
    }

    if (process.env.NODE_ENV === 'development') console.log('✅ [RECOMMENDED JOBS] Candidate found:', candidate.id);
    const client = await getSupabaseServerClient();
    if (process.env.NODE_ENV === 'development') console.log('✅ [RECOMMENDED JOBS] Supabase client created');
    
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

    if (process.env.NODE_ENV === 'development') console.log('📊 [RECOMMENDED JOBS] Query result:', { 
      jobsCount: jobs?.length || 0, 
      error: error?.message,
      conditions: conditions.length
    });

    if (error || !jobs) {
      if (process.env.NODE_ENV === 'development') console.error('❌ [RECOMMENDED JOBS] Failed to get jobs:', error);
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

    if (process.env.NODE_ENV === 'development') console.log('🎉 [RECOMMENDED JOBS] Success! Transformed jobs:', transformedJobs.length);
    return transformedJobs;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('❌ [RECOMMENDED JOBS] Error in getRecommendedJobs:', error);
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
    getCandidateNotices()
  ]);

  return <CandidateDashboardClient user={user as any} tasks={tasks} messages={messages} jobs={jobs} notices={notices.notices} />;
}

export const dynamic = 'force-dynamic';