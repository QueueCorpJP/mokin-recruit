import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';

// 候補者データの型定義
export interface CandidateData {
  id: string;
  name: string;
  company: string;
  location: string;
  age: number;
  gender: string;
  experience: string[];
  industry: string[];
  targetCompany: string;
  targetJob: string;
  group: string;
  applicationDate?: string;
  firstScreening?: string;
  secondScreening?: string;
  finalScreening?: string;
  offer?: string;
  assignedUsers: string[];
}

// 年齢を計算する関数
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// 現在のユーザーのcompany_account_idを取得する関数
async function getCurrentCompanyAccountId(): Promise<string | null> {
  try {
    // 環境変数の確認
    console.log('🔍 Environment check:', {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? 'SET'
        : 'NOT SET',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? 'SET'
        : 'NOT SET',
    });

    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    console.log('🔍 Auth User:', {
      userId: user?.id,
      email: user?.email,
      metadata: user?.user_metadata,
      authError,
    });

    if (!user) {
      console.log('🔍 No authenticated user found');
      return null;
    }

    // user_metadataからcompany_account_idを取得
    const companyAccountId = user.user_metadata?.company_account_id;
    if (companyAccountId) {
      console.log('🔍 Company Account ID from metadata:', companyAccountId);
      return companyAccountId;
    }

    // fallback: emailからcompany_usersテーブルを検索
    console.log(
      '🔍 Fallback: Searching company_users table for email:',
      user.email
    );

    // RLS対応: 認証済みクライアントでクエリを実行
    const authenticatedSupabase = await getSupabaseServerClient();

    // まず、全ての企業ユーザーを確認（デバッグ用）
    const { data: allCompanyUsers } = await authenticatedSupabase
      .from('company_users')
      .select('email, company_account_id, auth_user_id');
    console.log('🔍 All company users:', allCompanyUsers);

    const { data: companyUser, error: companyUserError } =
      await authenticatedSupabase
        .from('company_users')
        .select('company_account_id')
        .eq('email', user.email)
        .single();

    console.log('🔍 Company User Query Result:', {
      companyUser,
      companyUserError,
    });

    // 追加のフォールバック: auth_user_idで検索
    if (!companyUser && user.id) {
      console.log(
        '🔍 Additional fallback: Searching by auth_user_id:',
        user.id
      );
      const { data: companyUserByAuthId, error: authIdError } =
        await authenticatedSupabase
          .from('company_users')
          .select('company_account_id')
          .eq('auth_user_id', user.id)
          .single();
      console.log('🔍 Company User by auth_user_id:', {
        companyUserByAuthId,
        authIdError,
      });

      if (companyUserByAuthId) {
        return companyUserByAuthId.company_account_id;
      }
    }

    // 一時的なハードコード修正（テスト用）- 本番では削除すること
    if (user.email === 'test@gmail.com') {
      console.log('🔍 Temporary hardcode for test@gmail.com');
      return '8926f65d-0524-4f8a-8c5e-9f8e1d186587';
    }

    return companyUser?.company_account_id || null;
  } catch (error) {
    console.error('現在の企業アカウントIDの取得に失敗:', error);
    return null;
  }
}

// 検索・ソート・ページネーション用のパラメータ型
export interface GetCandidatesParams {
  keyword?: string;
  groupId?: string;
  jobId?: string;
  sortOrder?: 'progress' | 'date';
  excludeDeclined?: boolean;
  page?: number;
  itemsPerPage?: number;
}

// サーバーサイド検索・ソート・ページネーション対応の新API（実装は後続で追加）
export async function getCandidatesDataWithQuery(
  params: GetCandidatesParams
): Promise<CandidateData[]> {
  // 1. Supabaseクライアントと企業アカウントID取得
  const supabase = await getSupabaseServerClient();
  const companyAccountId = await getCurrentCompanyAccountId();
  if (!companyAccountId) return [];

  // 2. 企業グループID取得
  const { data: companyGroups, error: groupError } = await supabase
    .from('company_groups')
    .select('id')
    .eq('company_account_id', companyAccountId);
  if (groupError || !companyGroups || companyGroups.length === 0) return [];
  const groupIds = companyGroups.map((g: any) => g.id);

  // 3. applicationテーブルのクエリ組み立て
  let query = supabase
    .from('application')
    .select(
      `
      id,
      candidate_id,
      company_group_id,
      job_posting_id,
      status,
      created_at,
      candidates!inner (
        id,
        first_name,
        last_name,
        current_company,
        prefecture,
        birth_date,
        gender
      ),
      company_groups!inner (
        group_name
      ),
      job_postings (
        title,
        job_type
      )
    `
    )
    .in('company_group_id', groupIds);

  // 4. パラメータによるフィルタ
  if (params.groupId) {
    query = query.eq('company_group_id', params.groupId);
  }
  if (params.jobId) {
    query = query.eq('job_posting_id', params.jobId);
  }
  // 除外: 辞退者
  if (params.excludeDeclined) {
    query = query.neq('status', 'declined');
  }
  // キーワード検索（名前・会社名・経験）
  // Supabaseの複数カラム部分一致はやや工夫が必要。ここでは名前・会社名のみ対応。
  if (params.keyword) {
    // candidatesテーブルJOIN済みなのでfirst_name/last_name/current_companyでilike
    query = query.or(
      `candidates.first_name.ilike.%${params.keyword}%,candidates.last_name.ilike.%${params.keyword}%,candidates.current_company.ilike.%${params.keyword}%`
    );
  }
  // ソート
  if (params.sortOrder === 'date') {
    query = query.order('created_at', { ascending: false });
  } else {
    // デフォルト: 進行順（statusで並び替え。進行度合いの昇順/降順は要件次第で調整）
    query = query.order('status', { ascending: true });
  }
  // ページネーション
  const page = params.page ?? 1;
  const itemsPerPage = params.itemsPerPage ?? 10;
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  query = query.range(from, to);

  // 5. 実行
  const { data: candidatesData, error: candidatesError } = await query;
  if (candidatesError || !candidatesData) return [];

  // 6. 各候補者の追加情報を並列取得（既存ロジック流用）
  const candidatesWithDetails = await Promise.all(
    candidatesData.map(async (app: any) => {
      const candidateId = app.candidate_id;
      const [jobExperience, workExperience, careerStatus] = await Promise.all([
        supabase
          .from('job_type_experience')
          .select('job_type_name')
          .eq('candidate_id', candidateId),
        supabase
          .from('work_experience')
          .select('industry_name')
          .eq('candidate_id', candidateId),
        supabase
          .from('career_status_entries')
          .select('company_name')
          .eq('candidate_id', candidateId)
          .limit(1),
      ]);
      const candidate = app.candidates;
      const age = candidate.birth_date ? calculateAge(candidate.birth_date) : 0;
      return {
        id: candidateId,
        name: `${candidate.first_name} ${candidate.last_name}`,
        company: candidate.recent_job_company_name || candidate.current_company || '',
        location: candidate.prefecture || '',
        age,
        gender: candidate.gender || '',
        experience:
          jobExperience.data?.map((exp: any) => exp.job_type_name) || [],
        industry:
          workExperience.data?.map((ind: any) => ind.industry_name) || [],
        targetCompany: careerStatus.data?.[0]?.company_name || '',
        targetJob: app.job_postings?.job_type || '',
        group: app.company_groups?.group_name || '',
        applicationDate: app.created_at
          ? new Date(app.created_at).toLocaleDateString('ja-JP')
          : '',
        firstScreening:
          app.status === 'document_screening' ? 'ready' : undefined,
        secondScreening:
          app.status === 'second_interview' ? 'ready' : undefined,
        finalScreening: app.status === 'final_interview' ? 'ready' : undefined,
        offer: app.status === 'offer' ? 'ready' : undefined,
        assignedUsers: [],
      };
    })
  );
  return candidatesWithDetails;
}

// 候補者データを取得する関数
export async function getCandidatesData(): Promise<CandidateData[]> {
  // RLS対応: 認証済みクライアントを使用
  const supabase = await getSupabaseServerClient();

  // 現在の企業アカウントIDを取得
  const companyAccountId = await getCurrentCompanyAccountId();
  console.log('🔍 Company Account ID:', companyAccountId);
  if (!companyAccountId) {
    console.error('企業アカウントIDが見つかりません');
    return [];
  }

  try {
    // 自分の企業のグループIDを取得（RLS適用）
    const { data: companyGroups, error: groupError } = await supabase
      .from('company_groups')
      .select('id')
      .eq('company_account_id', companyAccountId);

    console.log('🔍 Company Groups Query Result:', {
      companyGroups,
      groupError,
    });

    if (groupError) {
      console.error('Company groups query error:', groupError);
      return [];
    }

    if (!companyGroups || companyGroups.length === 0) {
      console.log('🔍 No company groups found for account:', companyAccountId);
      return [];
    }

    const groupIds = companyGroups.map(g => g.id);
    console.log('🔍 Group IDs:', groupIds);

    // 自分の企業への応募のみを取得（RLS適用）
    return await getCandidatesDataFallback(supabase, groupIds);
  } catch (error) {
    console.error('候補者データ取得中にエラーが発生:', error);
    return [];
  }
}

// フォールバック: 従来の複数クエリ方式（RPCが使用できない場合）
async function getCandidatesDataFallback(
  supabase: any,
  groupIds: string[]
): Promise<CandidateData[]> {
  try {
    console.log('🔍 Querying applications with group IDs:', groupIds);
    const { data: candidatesData, error: candidatesError } = await supabase
      .from('application')
      .select(
        `
        id,
        candidate_id,
        company_group_id,
        job_posting_id,
        status,
        created_at,
        candidates!inner (
          id,
          first_name,
          last_name,
          current_company,
          prefecture,
          birth_date,
          gender
        ),
        company_groups!inner (
          group_name
        ),
        job_postings (
          title,
          job_type
        )
      `
      )
      .in('company_group_id', groupIds);

    console.log('🔍 Applications Query Result:', {
      count: candidatesData?.length || 0,
      error: candidatesError,
      sampleData: candidatesData?.slice(0, 2), // 最初の2件だけログ出力
    });

    if (candidatesError) {
      console.error('Applications query error:', candidatesError);
      return [];
    }

    if (!candidatesData) {
      console.log('🔍 No applications data returned');
      return [];
    }

    // 候補者IDで重複を除去（最新のアプリケーションを優先）
    const uniqueCandidatesMap = new Map();
    candidatesData.forEach((app: any) => {
      const candidateId = app.candidate_id;
      if (!uniqueCandidatesMap.has(candidateId) || 
          new Date(app.created_at) > new Date(uniqueCandidatesMap.get(candidateId).created_at)) {
        uniqueCandidatesMap.set(candidateId, app);
      }
    });
    const uniqueCandidatesData = Array.from(uniqueCandidatesMap.values());

    console.log('🔍 Deduplication result:', {
      originalCount: candidatesData.length,
      uniqueCount: uniqueCandidatesData.length,
    });

    // 各候補者の追加情報を並列取得（最小限に抑制）
    const candidatesWithDetails = await Promise.all(
      uniqueCandidatesData.map(async (app: any) => {
        const candidateId = app.candidate_id;

        // 必要最小限のクエリのみ実行（RLS適用）
        const [jobExperience, workExperience, careerStatus] = await Promise.all(
          [
            supabase
              .from('job_type_experience')
              .select('job_type_name')
              .eq('candidate_id', candidateId),
            supabase
              .from('work_experience')
              .select('industry_name')
              .eq('candidate_id', candidateId),
            supabase
              .from('career_status_entries')
              .select('company_name')
              .eq('candidate_id', candidateId)
              .limit(1),
          ]
        );

        const candidate = app.candidates;
        const age = candidate.birth_date
          ? calculateAge(candidate.birth_date)
          : 0;

        return {
          id: candidateId,
          name: `${candidate.first_name} ${candidate.last_name}`,
          company: candidate.recent_job_company_name || candidate.current_company || '',
          location: candidate.prefecture || '',
          age,
          gender: candidate.gender || '',
          experience: jobExperience.data?.map(exp => exp.job_type_name) || [],
          industry: workExperience.data?.map(ind => ind.industry_name) || [],
          targetCompany: careerStatus.data?.[0]?.company_name || '',
          targetJob: app.job_postings?.job_type || '',
          group: app.company_groups?.group_name || '',
          applicationDate: app.created_at
            ? new Date(app.created_at).toLocaleDateString('ja-JP')
            : '',
          firstScreening:
            app.status === 'document_screening' ? 'ready' : undefined,
          secondScreening:
            app.status === 'second_interview' ? 'ready' : undefined,
          finalScreening:
            app.status === 'final_interview' ? 'ready' : undefined,
          offer: app.status === 'offer' ? 'ready' : undefined,
          assignedUsers: [], // 簡易版では担当者情報は省略
        };
      })
    );

    return candidatesWithDetails;
  } catch (error) {
    console.error('フォールバック候補者データ取得中にエラーが発生:', error);
    return [];
  }
}

// グループ選択肢を取得する関数
export async function getGroupOptions(): Promise<
  Array<{ value: string; label: string }>
> {
  // RLS対応: 認証済みクライアントを使用
  const supabase = await getSupabaseServerClient();

  // 現在の企業アカウントIDを取得
  const companyAccountId = await getCurrentCompanyAccountId();
  if (!companyAccountId) {
    return [{ value: '', label: 'すべて' }];
  }

  try {
    const { data, error } = await supabase
      .from('company_groups')
      .select('id, group_name')
      .eq('company_account_id', companyAccountId)
      .order('group_name');

    if (error) {
      console.error('グループ選択肢の取得に失敗:', error);
      return [{ value: '', label: 'すべて' }];
    }

    const options = [
      { value: '', label: 'すべて' },
      ...(data?.map(group => ({
        value: group.id.toString(),
        label: group.group_name,
      })) || []),
    ];

    return options;
  } catch (error) {
    console.error('グループ選択肢取得中にエラーが発生:', error);
    return [{ value: '', label: 'すべて' }];
  }
}

// 求人選択肢を取得する関数
export async function getJobOptions(): Promise<
  Array<{ value: string; label: string }>
> {
  // RLS対応: 認証済みクライアントを使用
  const supabase = await getSupabaseServerClient();

  // 現在の企業アカウントIDを取得
  const companyAccountId = await getCurrentCompanyAccountId();
  if (!companyAccountId) {
    return [{ value: '', label: 'すべて' }];
  }

  try {
    // 自分の企業のグループIDを取得
    const { data: companyGroups } = await supabase
      .from('company_groups')
      .select('id')
      .eq('company_account_id', companyAccountId);

    if (!companyGroups || companyGroups.length === 0) {
      return [{ value: '', label: 'すべて' }];
    }

    const groupIds = companyGroups.map(g => g.id);

    const { data, error } = await supabase
      .from('job_postings')
      .select('id, title, job_type')
      .in('company_group_id', groupIds)
      .order('title');

    if (error) {
      console.error('求人選択肢の取得に失敗:', error);
      return [{ value: '', label: 'すべて' }];
    }

    const options = [
      { value: '', label: 'すべて' },
      ...(data?.map(job => ({ value: job.id.toString(), label: job.title })) ||
        []),
    ];

    return options;
  } catch (error) {
    console.error('求人選択肢取得中にエラーが発生:', error);
    return [{ value: '', label: 'すべて' }];
  }
}

// --- ここから候補者詳細取得用の型と関数を追加 ---

export interface CandidateDetailData {
  id: string;
  name: string;
  company: string;
  location: string;
  age: number;
  gender: string;
  income?: string;
  lastLogin?: string;
  lastUpdate?: string;
  registrationDate?: string;
  jobSummary?: string;
  experienceJobs?: Array<{ title: string; years: number }>;
  experienceIndustries?: Array<{ title: string; years: number }>;
  workHistory?: Array<{
    companyName: string;
    period: string;
    industries: string[];
    department: string;
    position: string;
    jobType: string;
    description: string;
  }>;
  desiredConditions?: {
    annualIncome?: string;
    currentIncome?: string;
    jobTypes?: string[];
    industries?: string[];
    workLocations?: string[];
    jobChangeTiming?: string;
    workStyles?: string[];
  };
  selectionStatus?: Array<{
    companyName: string;
    industries: string[];
    jobTypes: string;
    status: string;
    statusType?: 'pass' | 'decline' | 'offer';
    declineReason?: string;
  }>;
  selfPR?: string;
  qualifications?: string;
  skills?: string[];
  languages?: Array<{ language: string; level: string }>;
  education?: Array<{
    schoolName: string;
    department: string;
    graduationDate: string;
  }>;
  tags?: {
    isHighlighted?: boolean;
    isCareerChange?: boolean;
  };
}

/**
 * 候補者詳細データを取得する
 * @param candidateId
 * @param supabase
 */
export async function getCandidateDetailData(
  candidateId: string,
  supabase: any
): Promise<CandidateDetailData | null> {
  // 1. 基本情報
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select(
      `id, first_name, last_name, current_company, prefecture, current_residence, birth_date, gender, current_income, current_salary, desired_salary, last_login_at, updated_at, created_at, job_summary, self_pr, skills, recent_job_company_name, recent_job_department_position, recent_job_start_year, recent_job_start_month, recent_job_end_year, recent_job_end_month, recent_job_is_currently_working, recent_job_industries, recent_job_types, recent_job_description, desired_industries, desired_job_types, desired_locations, job_change_timing, interested_work_styles`
    )
    .eq('id', candidateId)
    .single();
  if (candidateError || !candidate) return null;

  // 2. 職種経験
  const { data: jobExp } = await supabase
    .from('job_type_experience')
    .select('job_type_name, experience_years')
    .eq('candidate_id', candidateId);

  // 3. 業種経験
  const { data: industryExp } = await supabase
    .from('work_experience')
    .select('industry_name, experience_years')
    .eq('candidate_id', candidateId);

  // 4. 選考状況
  const { data: selectionStatus } = await supabase
    .from('career_status_entries')
    .select(
      'company_name, industries, progress_status, decline_reason'
    )
    .eq('candidate_id', candidateId);

  // 5. スキル情報
  const { data: skillsData } = await supabase
    .from('skills')
    .select('english_level, other_languages, skills_list, qualifications')
    .eq('candidate_id', candidateId)
    .single();

  // 6. 学歴
  const { data: education } = await supabase
    .from('education')
    .select('school_name, department, graduation_year, graduation_month')
    .eq('candidate_id', candidateId);

  // 年齢計算
  const age = candidate.birth_date ? calculateAge(candidate.birth_date) : 0;

  // 日付フォーマット関数
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('ja-JP');
    } catch {
      return '';
    }
  };

  // 職務経歴の構築（recent_jobフィールドから）
  const workHistory = [];
  if (candidate.recent_job_company_name) {
    const startYear = candidate.recent_job_start_year;
    const startMonth = candidate.recent_job_start_month;
    const endYear = candidate.recent_job_end_year;
    const endMonth = candidate.recent_job_end_month;
    const isCurrentlyWorking = candidate.recent_job_is_currently_working;
    
    let period = '';
    if (startYear && startMonth) {
      period = `${startYear}年${startMonth}月〜`;
      if (isCurrentlyWorking) {
        period += '現在';
      } else if (endYear && endMonth) {
        period += `${endYear}年${endMonth}月`;
      }
    }

    workHistory.push({
      companyName: candidate.recent_job_company_name,
      period: period,
      industries: Array.isArray(candidate.recent_job_industries) 
        ? candidate.recent_job_industries 
        : (candidate.recent_job_industries ? [candidate.recent_job_industries] : []),
      department: candidate.recent_job_department_position || '',
      position: candidate.recent_job_department_position || '',
      jobType: Array.isArray(candidate.recent_job_types) 
        ? candidate.recent_job_types.join('、') 
        : (candidate.recent_job_types || ''),
      description: candidate.recent_job_description || '',
    });
  }

  return {
    id: candidate.id,
    name: `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'N/A',
    company: candidate.recent_job_company_name || candidate.current_company || '',
    location: candidate.prefecture || candidate.current_residence || '',
    age,
    gender: candidate.gender === 'male' ? '男性' : candidate.gender === 'female' ? '女性' : candidate.gender || '',
    income: candidate.current_income || candidate.current_salary || '',
    lastLogin: formatDate(candidate.last_login_at),
    lastUpdate: formatDate(candidate.updated_at),
    registrationDate: formatDate(candidate.created_at),
    jobSummary: candidate.job_summary || '',
    experienceJobs: (jobExp || []).map(
      (j: { job_type_name: string; experience_years: number }) => ({
        title: j.job_type_name,
        years: j.experience_years,
      })
    ),
    experienceIndustries: (industryExp || []).map(
      (i: { industry_name: string; experience_years: number }) => ({
        title: i.industry_name,
        years: i.experience_years,
      })
    ),
    workHistory,
    desiredConditions: {
      annualIncome: candidate.desired_salary || '',
      currentIncome: candidate.current_income || candidate.current_salary || '',
      jobTypes: Array.isArray(candidate.desired_job_types) ? candidate.desired_job_types : [],
      industries: Array.isArray(candidate.desired_industries) ? candidate.desired_industries : [],
      workLocations: Array.isArray(candidate.desired_locations) ? candidate.desired_locations : [],
      jobChangeTiming: candidate.job_change_timing || '',
      workStyles: Array.isArray(candidate.interested_work_styles) ? candidate.interested_work_styles : [],
    },
    selectionStatus: (selectionStatus || []).map(
      (s: {
        company_name: string;
        industries: any;
        progress_status: string;
        decline_reason?: string;
      }) => ({
        companyName: s.company_name,
        industries: Array.isArray(s.industries) ? s.industries : [],
        jobTypes: '',
        status: s.progress_status || '',
        statusType: s.decline_reason ? 'decline' : undefined,
        declineReason: s.decline_reason || undefined,
      })
    ),
    selfPR: candidate.self_pr || '',
    qualifications: skillsData?.qualifications || '',
    skills: Array.isArray(candidate.skills) ? candidate.skills : (Array.isArray(skillsData?.skills_list) ? skillsData.skills_list : []),
    languages: skillsData?.other_languages ? 
      Object.entries(skillsData.other_languages).map(([language, level]) => ({
        language: language,
        level: String(level),
      })) : 
      (skillsData?.english_level ? [{ language: '英語', level: skillsData.english_level }] : []),
    education: (education || []).map(
      (e: {
        school_name: string;
        department: string;
        graduation_year: number;
        graduation_month: number;
      }) => ({
        schoolName: e.school_name,
        department: e.department,
        graduationDate: `${e.graduation_year}年${e.graduation_month}月`,
      })
    ),
    tags: {
      isHighlighted: false,
      isCareerChange: false,
    },
  };
}