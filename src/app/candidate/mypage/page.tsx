import { getCachedCandidateUser } from '@/lib/auth/server';
import { CandidateRepository } from '@/lib/server/infrastructure/database/CandidateRepository';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { getRooms } from '@/lib/rooms';
import { redirect } from 'next/navigation';
import { getCandidateNotices } from './actions';
import { CandidateDashboardClient } from './CandidateDashboardClient';

// 包括的なやることリスト取得関数（N+1問題修正版）
async function getTaskData(candidateId: string) {
  const tasks: unknown[] = [];
  const client = await getSupabaseServerClient();

  try {
    // 一度のクエリで全ての関連データを取得（N+1問題解決）
    const seventyTwoHoursAgo = new Date(
      Date.now() - 72 * 60 * 60 * 1000
    ).toISOString();

    const [
      candidateResult,
      educationResult,
      skillsResult,
      expectationsResult,
      careerStatusResult,
      scoutsResult,
      applicationsResult,
      selectionsResult,
      notificationResult,
      rooms,
    ] = await Promise.all([
      client.from('candidates').select('*').eq('id', candidateId).single(),
      client
        .from('education')
        .select('*')
        .eq('candidate_id', candidateId)
        .single(),
      client
        .from('skills')
        .select('*')
        .eq('candidate_id', candidateId)
        .single(),
      client
        .from('expectations')
        .select('*')
        .eq('candidate_id', candidateId)
        .single(),
      client
        .from('career_status_entries')
        .select('*')
        .eq('candidate_id', candidateId),
      client
        .from('scout_sends')
        .select('*')
        .eq('candidate_id', candidateId)
        .in('status', ['sent', 'read'])
        .gte('sent_at', seventyTwoHoursAgo),
      client
        .from('application')
        .select('*')
        .eq('candidate_id', candidateId)
        .eq('status', 'RESPONDED'),
      client
        .from('selection_progress')
        .select('*, job_postings(title)')
        .eq('candidate_id', candidateId)
        .or(
          'document_screening_result.eq.pending,first_interview_result.eq.pending,secondary_interview_result.eq.pending,final_interview_result.eq.pending'
        ),
      client
        .from('notification_settings')
        .select('*')
        .eq('candidate_id', candidateId)
        .single(),
      getRooms(candidateId, 'candidate'),
    ]);

    const candidate = candidateResult.data;
    const education = educationResult.data;
    const skills = skillsResult.data;
    const expectations = expectationsResult.data;
    const careerStatusEntries = careerStatusResult.data;
    const unrepliedScouts = scoutsResult.data;
    const applications = applicationsResult.data;
    const selections = selectionsResult.data;
    const notificationSettings = notificationResult.data;

    // 1. プロフィール完成度チェック
    if (candidate) {
      // 基本情報チェック
      if (!candidate.last_name || !candidate.first_name) {
        tasks.push({
          id: 'profile-name',
          title: '氏名を登録してください',
          description: 'プロフィールの基本情報から氏名を入力してください',
        });
      }

      if (!candidate.phone_number) {
        tasks.push({
          id: 'profile-phone',
          title: '電話番号を登録してください',
          description: '企業からの連絡に必要な電話番号を登録してください',
        });
      }

      // 現在の職務情報チェック（転職経験の有無をcareer_status_entriesから確認）
      if (!careerStatusEntries || careerStatusEntries.length === 0) {
        tasks.push({
          id: 'profile-current-job',
          title: '転職活動状況を入力してください',
          description: '転職経験の有無や現在の活動状況を登録してください',
        });
      }

      // 希望条件チェック（expectationsテーブルを参照）
      if (
        !expectations ||
        !expectations.desired_income ||
        !expectations.desired_industries ||
        (expectations.desired_industries as any[])?.length === 0 ||
        !expectations.desired_job_types ||
        (expectations.desired_job_types as any[])?.length === 0 ||
        !expectations.desired_work_locations ||
        (expectations.desired_work_locations as any[])?.length === 0
      ) {
        tasks.push({
          id: 'profile-expectations',
          title: '希望条件を設定してください',
          description: '希望年収・業界・職種・勤務地を設定してください',
        });
      }

      // キャリア状況チェック（career_status_entriesテーブルを参照）
      if (!careerStatusEntries || careerStatusEntries.length === 0) {
        tasks.push({
          id: 'career-status',
          title: 'キャリア状況を設定してください',
          description: '転職活動の状況や選考進捗を入力してください',
        });
      }

      // 自己PR・職務要約チェック
      if (!candidate.job_summary || !candidate.self_pr) {
        tasks.push({
          id: 'profile-summary',
          title: '職務要約・自己PRを入力してください',
          description: 'あなたの経験とアピールポイントを記載してください',
        });
      }

      // 履歴書チェック
      if (!candidate.resume_url) {
        tasks.push({
          id: 'resume-upload',
          title: '履歴書をアップロードしてください',
          description: '応募時に必要な履歴書ファイルをアップロードしてください',
        });
      }
    }

    // 2. 学歴情報チェック
    if (!education) {
      tasks.push({
        id: 'education-info',
        title: '学歴情報を登録してください',
        description: '最終学歴を入力してください',
      });
    }

    // 3. スキル情報チェック
    if (!skills || skills.skills_list?.length === 0) {
      tasks.push({
        id: 'skills-info',
        title: 'スキル情報を登録してください',
        description: '保有スキルや資格を入力してください',
      });
    }

    // 4. 直近の職歴チェック（candidatesテーブルのrecent_job_*フィールドを参照）
    if (
      !candidate.recent_job_company_name ||
      !candidate.recent_job_department_position ||
      !candidate.recent_job_start_year ||
      !candidate.recent_job_industries ||
      !candidate.recent_job_types ||
      !candidate.recent_job_description
    ) {
      tasks.push({
        id: 'recent-job',
        title: '直近の職歴を登録してください',
        description: '直近の勤務先と職務内容を入力してください',
      });
    }

    // 5. 期待条件テーブルチェック
    if (!expectations) {
      tasks.push({
        id: 'expectations-settings',
        title: '詳細な希望条件を設定してください',
        description: '希望の働き方や条件を詳しく設定してください',
      });
    }

    // 6. 未返信スカウトチェック
    if (unrepliedScouts && unrepliedScouts.length > 0) {
      tasks.push({
        id: 'scout-reply',
        title: `${unrepliedScouts.length}件のスカウトに返信してください`,
        description: '72時間以内の返信を推奨します',
      });
    }

    // 7. 応募後の対応チェック
    if (applications && applications.length > 0) {
      tasks.push({
        id: 'application-response',
        title: `${applications.length}件の応募に企業から返信があります`,
        description: '企業からの返信を確認してください',
      });
    }

    // 8. 選考中のステータス確認
    if (selections && selections.length > 0) {
      tasks.push({
        id: 'selection-status',
        title: `${selections.length}件の選考が進行中です`,
        description: '選考状況を確認してください',
      });
    }

    // 9. 通知設定チェック
    if (!notificationSettings) {
      tasks.push({
        id: 'notification-settings',
        title: '通知設定を確認してください',
        description: '重要な通知を見逃さないよう設定を確認してください',
      });
    }

    // 10. 未読メッセージチェック
    const unreadRooms = rooms.filter(
      (room: { unreadCount?: number }) =>
        room.unreadCount && room.unreadCount > 0
    );

    if (unreadRooms.length > 0) {
      tasks.push({
        id: 'unread-messages',
        title: `${unreadRooms.length}件の未読メッセージがあります`,
        description: '企業からのメッセージを確認してください',
      });
    }

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
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

    // 候補者の希望条件を先に取得
    const { data: expectations } = await client
      .from('expectations')
      .select('desired_job_types, desired_work_locations, desired_industries')
      .eq('candidate_id', candidateId)
      .single();

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
        company_attractions,
        image_urls,
        company_accounts!inner (
          company_name
        )
      `
      )
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members']);

    // 候補者の希望条件でフィルタリング

    const conditions = [];
    if (
      expectations?.desired_job_types &&
      (expectations.desired_job_types as any[]).length > 0
    ) {
      conditions.push(
        (expectations.desired_job_types as any[])
          .map((jobType: any) => `job_type.cs.{${jobType.name || jobType}}`)
          .join(',')
      );
    }

    if (
      expectations?.desired_work_locations &&
      (expectations.desired_work_locations as any[]).length > 0
    ) {
      conditions.push(
        (expectations.desired_work_locations as any[])
          .map(
            (location: any) => `work_location.cs.{${location.name || location}}`
          )
          .join(',')
      );
    }

    if (
      expectations?.desired_industries &&
      (expectations.desired_industries as any[]).length > 0
    ) {
      conditions.push(
        (expectations.desired_industries as any[])
          .map((industry: any) => `industry.cs.{${industry.name || industry}}`)
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

    // お気に入り状態を取得
    const jobIds = jobs.map(job => job.id);
    const { data: favorites } = await client
      .from('favorites')
      .select('job_posting_id')
      .eq('candidate_id', candidateId)
      .in('job_posting_id', jobIds);

    const favoriteJobIds = new Set(
      favorites?.map(fav => fav.job_posting_id) || []
    );

    // 最適化されたデータ変換
    const transformedJobs = jobs.map(
      (job: {
        id: any;
        title: any;
        salary_min: any;
        salary_max: any;
        work_location: any;
        company_attractions: any;
        image_urls: any;
        company_accounts: { company_name: any }[];
      }) => ({
        id: job.id,
        title: job.title || '求人タイトル未設定',
        company_name: job.company_accounts?.[0]?.company_name || '企業名未設定',
        image_urls: job.image_urls?.slice(0, 1) || [], // 最初の画像のみ取得して転送量削減
        appeal_points: job.company_attractions?.slice(0, 3) || [],
        work_location: Array.isArray(job.work_location)
          ? job.work_location
          : [job.work_location || '勤務地未設定'],
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        starred: favoriteJobIds.has(job.id),
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
      user={
        user as {
          id: string;
          name?: string;
          email: string;
          userType: 'candidate';
          emailConfirmed: boolean;
        }
      }
      tasks={tasks as any[]}
      messages={messages}
      jobs={jobs}
      notices={notices.notices}
    />
  );
}
