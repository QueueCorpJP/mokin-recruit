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
    
    
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
   
    
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
    
    
    
    // RLS対応: 認証済みクライアントでクエリを実行
    const authenticatedSupabase = await getSupabaseServerClient();
    
    // まず、全ての企業ユーザーを確認（デバッグ用）
    const { data: allCompanyUsers } = await authenticatedSupabase
      .from('company_users')
      .select('email, company_account_id, auth_user_id');
    console.log('🔍 All company users:', allCompanyUsers);
    
    const { data: companyUser, error: companyUserError } = await authenticatedSupabase
      .from('company_users')
      .select('company_account_id')
      .eq('email', user.email)
      .single();
      
    
    // 追加のフォールバック: auth_user_idで検索
    if (!companyUser && user.id) {
      console.log('🔍 Additional fallback: Searching by auth_user_id:', user.id);
      const { data: companyUserByAuthId, error: authIdError } = await authenticatedSupabase
        .from('company_users')
        .select('company_account_id')
        .eq('auth_user_id', user.id)
        .single();
      console.log('🔍 Company User by auth_user_id:', { companyUserByAuthId, authIdError });
      
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
      
    console.log('🔍 Company Groups Query Result:', { companyGroups, groupError });
      
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
async function getCandidatesDataFallback(supabase: any, groupIds: string[]): Promise<CandidateData[]> {
  try {
    console.log('🔍 Querying applications with group IDs:', groupIds);
    const { data: candidatesData, error: candidatesError } = await supabase
      .from('application')
      .select(`
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
      `)
      .in('company_group_id', groupIds);

    console.log('🔍 Applications Query Result:', { 
      count: candidatesData?.length || 0, 
      error: candidatesError,
      sampleData: candidatesData?.slice(0, 2) // 最初の2件だけログ出力
    });

    if (candidatesError) {
      console.error('Applications query error:', candidatesError);
      return [];
    }
    
    if (!candidatesData) {
      console.log('🔍 No applications data returned');
      return [];
    }

    // 各候補者の追加情報を並列取得（最小限に抑制）
    const candidatesWithDetails = await Promise.all(
      candidatesData.map(async (app: any) => {
        const candidateId = app.candidate_id;
        
        // 必要最小限のクエリのみ実行（RLS適用）
        const [jobExperience, workExperience, careerStatus] = await Promise.all([
          supabase.from('job_type_experience').select('job_type_name').eq('candidate_id', candidateId),
          supabase.from('work_experience').select('industry_name').eq('candidate_id', candidateId),
          supabase.from('career_status_entries').select('company_name').eq('candidate_id', candidateId).limit(1)
        ]);

        const candidate = app.candidates;
        const age = candidate.birth_date ? calculateAge(candidate.birth_date) : 0;

        return {
          id: candidateId,
          name: `${candidate.first_name} ${candidate.last_name}`,
          company: candidate.current_company || '',
          location: candidate.prefecture || '',
          age,
          gender: candidate.gender || '',
          experience: jobExperience.data?.map(exp => exp.job_type_name) || [],
          industry: workExperience.data?.map(ind => ind.industry_name) || [],
          targetCompany: careerStatus.data?.[0]?.company_name || '',
          targetJob: app.job_postings?.job_type || '',
          group: app.company_groups?.group_name || '',
          applicationDate: app.created_at ? new Date(app.created_at).toLocaleDateString('ja-JP') : '',
          firstScreening: app.status === 'document_screening' ? 'ready' : undefined,
          secondScreening: app.status === 'second_interview' ? 'ready' : undefined,
          finalScreening: app.status === 'final_interview' ? 'ready' : undefined,
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
export async function getGroupOptions(): Promise<Array<{ value: string; label: string }>> {
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
      ...(data?.map(group => ({ value: group.id.toString(), label: group.group_name })) || [])
    ];

    return options;
  } catch (error) {
    console.error('グループ選択肢取得中にエラーが発生:', error);
    return [{ value: '', label: 'すべて' }];
  }
}

// 求人選択肢を取得する関数
export async function getJobOptions(): Promise<Array<{ value: string; label: string }>> {
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
      ...(data?.map(job => ({ value: job.id.toString(), label: job.title })) || [])
    ];

    return options;
  } catch (error) {
    console.error('求人選択肢取得中にエラーが発生:', error);
    return [{ value: '', label: 'すべて' }];
  }
}

// 候補者詳細データを取得する関数
export async function getCandidateDetailData(candidateId: string, supabase?: any) {
  try {
    // 認証済みクライアントが渡されない場合は取得（後方互換性のため）
    const client = supabase || await getSupabaseServerClient();
    
    // 基本情報を取得
    const { data: candidate } = await client
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();
    
    if (!candidate) {
      return null;
    }
    
    // 関連データを並列取得
    const [
      jobExperience,
      workExperience,
      careerStatus,
      education,
      skills,
      expectations,
      jobSummary
    ] = await Promise.all([
      client.from('job_type_experience').select('*').eq('candidate_id', candidateId),
      client.from('work_experience').select('*').eq('candidate_id', candidateId),
      client.from('career_status_entries').select('*').eq('candidate_id', candidateId),
      client.from('education').select('*').eq('candidate_id', candidateId),
      client.from('skills').select('*').eq('candidate_id', candidateId).single(),
      client.from('expectations').select('*').eq('candidate_id', candidateId).single(),
      client.from('job_summary').select('*').eq('candidate_id', candidateId).single()
    ]);
    
    const age = candidate.birth_date ? calculateAge(candidate.birth_date) : 0;
    
    // データを整形して返す
    return {
      id: candidate.id,
      name: `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim(),
      company: candidate.current_company || '',
      location: candidate.prefecture || '',
      age,
      gender: candidate.gender || '',
      income: candidate.current_income || '',
      lastLogin: candidate.last_login_at ? new Date(candidate.last_login_at).toLocaleDateString('ja-JP') : '',
      lastUpdate: candidate.updated_at ? new Date(candidate.updated_at).toLocaleDateString('ja-JP') : '',
      registrationDate: candidate.created_at ? new Date(candidate.created_at).toLocaleDateString('ja-JP') : '',
      jobSummary: jobSummary.data?.job_summary || candidate.job_summary || '',
      experienceJobs: jobExperience.data?.map(exp => ({
        title: exp.job_type_name,
        years: exp.experience_years || 0
      })) || [],
      experienceIndustries: workExperience.data?.map(work => ({
        title: work.industry_name,
        years: work.experience_years || 0
      })) || [],
      workHistory: [{
        companyName: candidate.recent_job_company_name || candidate.current_company || '',
        period: candidate.recent_job_start_year && candidate.recent_job_start_month 
          ? `${candidate.recent_job_start_year}/${candidate.recent_job_start_month}〜${candidate.recent_job_is_currently_working ? '現在' : `${candidate.recent_job_end_year}/${candidate.recent_job_end_month}`}`
          : '',
        industries: Array.isArray(candidate.recent_job_industries) 
          ? candidate.recent_job_industries.map(item => 
              typeof item === 'object' && item?.name ? item.name : String(item || '')
            )
          : (candidate.recent_job_industries ? [candidate.recent_job_industries] : []),
        department: candidate.recent_job_department_position || '',
        position: candidate.recent_job_department_position || '',
        jobType: candidate.recent_job_types ? 
          (Array.isArray(candidate.recent_job_types) ? candidate.recent_job_types.join('、') : candidate.recent_job_types) : '',
        description: candidate.recent_job_description || ''
      }].filter(work => work.companyName), // 空のデータは除外
      desiredConditions: {
        annualIncome: expectations.data?.desired_income || '',
        currentIncome: candidate.current_income || '',
        jobTypes: Array.isArray(expectations.data?.desired_job_types) 
          ? expectations.data.desired_job_types.map(item => 
              typeof item === 'object' && item?.name ? item.name : String(item || '')
            )
          : (expectations.data?.desired_job_types ? [expectations.data.desired_job_types] : []),
        industries: Array.isArray(expectations.data?.desired_industries) 
          ? expectations.data.desired_industries.map(item => 
              typeof item === 'object' && item?.name ? item.name : String(item || '')
            )
          : (expectations.data?.desired_industries ? [expectations.data.desired_industries] : []),
        workLocations: Array.isArray(expectations.data?.desired_work_locations) 
          ? expectations.data.desired_work_locations.map(item => 
              typeof item === 'object' && item?.name ? item.name : String(item || '')
            )
          : (expectations.data?.desired_work_locations ? [expectations.data.desired_work_locations] : []),
        jobChangeTiming: candidate.job_change_timing || '',
        workStyles: Array.isArray(expectations.data?.desired_work_styles) 
          ? expectations.data.desired_work_styles.map(item => 
              typeof item === 'object' && item?.name ? item.name : String(item || '')
            )
          : (expectations.data?.desired_work_styles ? [expectations.data.desired_work_styles] : [])
      },
      selectionStatus: careerStatus.data?.map(status => ({
        companyName: status.company_name || '',
        industries: Array.isArray(status.industries) 
          ? status.industries.map(item => 
              typeof item === 'object' && item?.name ? item.name : String(item || '')
            )
          : (status.industries ? [status.industries] : []),
        jobTypes: '',
        status: status.progress_status || '',
        statusType: status.decline_reason ? 'decline' : 'pass',
        declineReason: status.decline_reason || ''
      })) || [],
      selfPR: jobSummary.data?.self_pr || candidate.self_pr || '',
      qualifications: skills.data?.qualifications || '',
      skills: Array.isArray(skills.data?.skills_list) 
        ? skills.data.skills_list.map(item => 
            typeof item === 'object' && item?.name ? item.name : String(item || '')
          )
        : (skills.data?.skills_list ? [skills.data.skills_list] : []),
      languages: skills.data?.other_languages ? 
        (Array.isArray(skills.data.other_languages) ? 
          skills.data.other_languages.map((lang: any) => ({
            language: typeof lang === 'object' && lang.language 
              ? String(lang.language) 
              : String(lang || ''),
            level: typeof lang === 'object' && lang.level 
              ? String(lang.level) 
              : ''
          })) : []) : [],
      education: education.data?.map(edu => ({
        schoolName: edu.school_name || '',
        department: edu.department || '',
        graduationDate: edu.graduation_year && edu.graduation_month ? 
          `${edu.graduation_year}年${edu.graduation_month}月 卒業` : ''
      })) || [],
      tags: {
        isHighlighted: false, // 実際のデータに基づいて設定
        isCareerChange: candidate.has_career_change === 'yes'
      }
    };
  } catch (error) {
    console.error('候補者詳細データ取得エラー:', error);
    return null;
  }
}