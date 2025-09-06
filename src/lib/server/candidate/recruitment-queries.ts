import { getSupabaseAdminClient } from '../database/supabase';
import { createClient } from '@/lib/supabase/server';
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    // user_metadataからcompany_account_idを取得
    const companyAccountId = user.user_metadata?.company_account_id;
    if (companyAccountId) {
      return companyAccountId;
    }
    
    // fallback: emailからcompany_usersテーブルを検索
    const adminSupabase = getSupabaseAdminClient();
    const { data: companyUser } = await adminSupabase
      .from('company_users')
      .select('company_account_id')
      .eq('email', user.email)
      .single();
      
    return companyUser?.company_account_id || null;
  } catch (error) {
    console.error('現在の企業アカウントIDの取得に失敗:', error);
    return null;
  }
}

// 候補者データを取得する関数
export async function getCandidatesData(): Promise<CandidateData[]> {
  const supabase = getSupabaseAdminClient();
  
  // 現在の企業アカウントIDを取得
  const companyAccountId = await getCurrentCompanyAccountId();
  if (!companyAccountId) {
    console.error('企業アカウントIDが見つかりません');
    return [];
  }
  
  try {
    // 自分の企業のグループIDを取得
    const { data: companyGroups } = await supabase
      .from('company_groups')
      .select('id')
      .eq('company_account_id', companyAccountId);
      
    if (!companyGroups || companyGroups.length === 0) {
      return [];
    }
    
    const groupIds = companyGroups.map(g => g.id);
    
    // 自分の企業への応募のみを取得（データベース側でフィルタリング済み）
    return await getCandidatesDataFallback(supabase, groupIds);

  } catch (error) {
    console.error('候補者データ取得中にエラーが発生:', error);
    return [];
  }
}

// フォールバック: 従来の複数クエリ方式（RPCが使用できない場合）
async function getCandidatesDataFallback(supabase: any, groupIds: string[]): Promise<CandidateData[]> {
  try {
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

    if (candidatesError || !candidatesData) {
      return [];
    }

    // 各候補者の追加情報を並列取得（最小限に抑制）
    const candidatesWithDetails = await Promise.all(
      candidatesData.map(async (app: any) => {
        const candidateId = app.candidate_id;
        
        // 必要最小限のクエリのみ実行
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
  const supabase = getSupabaseAdminClient();
  
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
  const supabase = getSupabaseAdminClient();
  
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